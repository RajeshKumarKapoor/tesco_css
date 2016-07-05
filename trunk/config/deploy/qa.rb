server "tesco-clubcard-qa.headlondon.office", :app, :web, :db, :primary => true

set :repository,  "https://collaboration.headlondon.com/svn/tes/development/trunk"
set :deploy_to, "/home/tesco-clubcard/public_html/"
set :user, "tesco-clubcard" # the ssh user we'll deploy as.
#set :rails_env, :uat

