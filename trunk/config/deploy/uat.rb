server "tesco-clubcard.headlondon.com", :app, :web, :db, :primary => true

set :repository,  "https://collaboration.headlondon.com/svn/tes/development/tags/10.5"
set :deploy_to, "/home/tesco-clubcard/public_html/"
set :user, "tesco-clubcard" # the ssh user we'll deploy as.
#set :rails_env, :uat

