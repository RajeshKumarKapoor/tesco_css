require 'capistrano/ext/multistage'

set :application, "head_website"
set :scm, :subversion
set :keep_releases, 2 # number of deployed releases to keep
if ENV['SVN_USERNAME'] && ENV['SVN_PASSWORD']
  set :scm_username, ENV['SVN_USERNAME']
  set :scm_password, ENV['SVN_PASSWORD']
else
  set :scm_username, Proc.new { Capistrano::CLI.ui.ask('SVN User: ') }
  set :scm_password, Proc.new { Capistrano::CLI.password_prompt('SVN Password: ') }
end
set :use_sudo, false

# Suppress warnings that stdin is not a tty.
default_run_options[:pty]=true

# Let's try caching the source code on the server so that deploys go quicker.
set :deploy_via, :remote_cache


# =============================================================================
# TASKS
# =============================================================================
# Define tasks that run on all (or only some) of the machines. You can specify
# a role (or set of roles) that each task should be executed on. You can also
# narrow the set of servers to a subset of a role by specifying options, which
# must match the options given for the servers to select (like :primary => true)

namespace :deploy do
  desc <<-DESC
  Does a clean deploy by removing the cached-copy folder first,
  then runs full_deploy
  To run: cap RAILS_ENV deploy:clean
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :clean do
    remove_svn_cached_copy
    full
  end

  desc <<-DESC
  Does a full deploy using the tasks specified.
  To run: cap RAILS_ENV deploy:full
  RAILS_ENV = Is the rails environment to deploy to
  DESC
  task :full do
    transaction do
      update_code
      symlink
      # symlink_gems
      # vendor_gems
      # copy_db_yml
      # migrate
      # jammit
    end
    qa
    remove_html_cache
    restart
    cleanup
  end

  task :migrate do
    run("cd #{current_path} && bundle exec rake db:migrate RAILS_ENV=#{rails_env}")
  end

  desc <<-DESC
  Deploy to qa(runs npm_link, npm_instll, grunt)
  DESC
  task :qa do
    if stage == :qa
      npm_link
      npm_install
      grunt
    end
  end

  desc <<-DESC
  Run Grunt
  DESC
  task :grunt do
    run("cd #{current_path} && grunt") 
  end
  desc <<-DESC
  Installs node modules
  DESC
  task :npm_install do
    run("cd #{current_path} && npm install")
  end

  desc <<-DESC
  Creates a symlink from the node modules at shared/node_modules to /node_modules.
  DESC
  task :npm_link do
    run("cd #{current_path} && ln -s #{shared_path}/node_modules #{current_path}/node_modules")
  end

  desc <<-DESC
  Creates a symlink from the vendored gems at shared/bundle to vendor/bundle.
  DESC
  task :symlink_gems do
    run("cd #{current_path} && ln -s #{shared_path}/bundle #{current_path}/vendor/bundle")
  end

  desc <<-DESC
  Uses Bundler to grab all gem dependencies and stick them into a folder
  in vendor.
  To run: cap RAILS_ENV deploy:vendor_gems
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :vendor_gems do
    run("cd #{current_path} && bundle install --deployment --binstubs")
  end

  desc <<-DESC
  Runs the Jammit binary on the server to package assets (javascript and css)
  in accordance with the compression rules defined in config/assets.yml
  To run: cap RAILS_ENV deploy:jammit
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :jammit do
    run("cd #{current_path} && bin/jammit")
  end

  desc <<-DESC
  Removes the svn cached-copy folder.
  To run: cap RAILS_ENV deploy:remove_svn_cached_copy
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :remove_svn_cached_copy do
    run("rm -rf #{deploy_to}/shared/cached-copy")
  end

  desc <<-DESC
  Removes the HTML cache folder.
  To run: cap RAILS_ENV deploy:remove_html_cache
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :remove_html_cache do
    run("rm -rf #{deploy_to}/shared/system/cache")
  end

  desc "Restarting mod_rails with restart.txt"
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{current_path}/tmp/restart.txt"
  end

  desc "Copy the release database.yml file into place after the code deploys"
  task :copy_db_yml, :roles => :app  do
    db_config = "#{shared_path}/database.yml"
    run "cp #{db_config} #{current_path}/config/database.yml"
  end

  desc <<-DESC
  Does an initial setup, although not sure how useful this is.
  To run: cap RAILS_ENV deploy:init_setup
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :init_setup do
    run("cd #{deploy_to}/current && rake head_site:setup RAILS_ENV=#{rails_env}")
  end

  desc <<-DESC
  Creates a default admin user
  To run: cap RAILS_ENV deploy:create_admin_user
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :create_admin_user do
    run("cd #{deploy_to}/current && rake head_site:create_admin_user RAILS_ENV=#{rails_env}")
  end

  desc <<-DESC
  Creates crontab tasks
  To run: cap RAILS_ENV deploy:create_crontab_tasks
  RAILS_ENV = the rails environment to deploy to
  DESC
  task :create_crontab_tasks do
    run("cd #{deploy_to}/current && whenever --update-crontab --set environment=#{rails_env} new_headwebsite")
  end

  # TODO: What is this?
  [:start, :stop].each do |t|
    desc "#{t} task is a no-op with mod_rails"
    task t, :roles => :app do ; end
  end

end

namespace :friendly_id do
  desc <<-DESC
  Create slugs for a given model
  To run: cap RAILS_ENV friendly_id:create_slugs_for_model
  RAILS_ENV = the rails environment to deploy to
  MODELNAME = Model to create slugs for
  DESC
  task :create_slugs_for_model do
    run("cd #{deploy_to}/current && rake friendly_id:make_slugs MODEL=#{MODELNAME} RAILS_ENV=#{rails_env}")
  end
end

##
# Dev Site tasks
#
namespace :dev do
  desc <<-DESC
  Loads the specified (qa|uat|production) database into your development environment.
  e.g. cap (qa|staging|production) dev:download_db
  DESC
  task :download_db, :roles => :app do
    require 'yaml'
    config = YAML::load_file('config/database.yml')['development']
    p_config = load_remote_yml(rails_env, "#{current_path}/config/database.yml")
    # copy the SQL data
    filename = "/tmp/dump.#{Time.now.strftime '%Y-%m-%d_%H:%M:%S'}.sql.gz"
    run "mysqldump -u #{p_config['username']} -h #{p_config['host']} --password='#{p_config['password']}' #{p_config['database']} | gzip > #{filename}"
    # copy down to your tmp directory
    get filename, filename
    # load into the development database
    `gunzip -c #{filename} | mysql -u #{config['username']} --password='#{config['password']}' #{config['database']} && rm -f gunzip #{filename}`
  end

  desc <<-DESC
  Sync the specified (qa|uat|production) system directory  into your development environment.
  e.g. cap (qa|staging|production) dev:sync_system
  DESC
  task :sync_system, :roles => :app do
    find_servers_for_task(current_task).each do |current_server|
      `rsync -avP #{user}@#{current_server.host}:#{shared_path}/system public`
    end
  end

  desc <<-DESC
  Sync the specified (qa|uat|production) system directory  into your development environment.
  e.g. cap (qa|staging|production) dev:sync_system
  DESC
  task :sync, :roles => :app do
    download_db
    sync_system
  end


  # desc <<-DESC
  # Loads the media from the specified project to into your app's public/system/export directory.
  # e.g. cap (staging|production) dev:download_project folder_key=FOLDER_KEY
  # DESC
  # task :download_project, :roles => :app do
  #   require 'yaml'
  #   config = YAML::load_file('config/database.yml')['development']
  #   p_config = load_remote_yml(rails_env, "#{current_path}/config/database.yml")
  #   folder_key = ENV['folder_key']

  #   unless folder_key.nil?
  #     dev_tmp_path = "/tmp"
  #     production_tmp_path = "/home/cptb/public_html/shared/tmp"
  #     run "mkdir -p #{production_tmp_path}"
  #     projects_tar = "#{folder_key}.tar"
  #     projects_targz = "#{folder_key}.tar.gz"
  #     run "cd #{shared_path}/system/export && tar cf #{production_tmp_path}/#{projects_tar} #{folder_key} && gzip -f #{production_tmp_path}/#{projects_tar}"
  #     get "#{production_tmp_path}/#{projects_targz}", "#{dev_tmp_path}/#{projects_targz}"
  #     run "cd public/system/export && tar zxf #{dev_tmp_path}/#{projects_targz}"
  #     run "rm -rf #{tmp_path};rm -f #{dev_tmp_path}/#{projects_targz}"
  #   else
  #     puts "Please specify a valid project to download e.g. cap qa dev.download_project_to_development project=PR-123456789"
  #   end
  # end
end

# Loads database creds for a given Rails environment from a database.yml file on
# a remote server.
#
# @param [String] environment the rails environment to load database creds for
# @param [String] path the absolute path to the yaml file
# @returns [Hash] a Hash with the database creds in it
def load_remote_yml(environment, path)
  yml = "config/database.#{environment}-#{Time.now.strftime '%Y-%m-%d_%H:%M:%S'}.yml"
  begin
    get path, yml
    config = YAML::load_file(yml)
    return config[environment.to_s]
  rescue
    raise
  ensure
    `rm -f #{yml}`
  end
end

