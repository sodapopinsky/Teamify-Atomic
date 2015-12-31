
module.exports = {

    secret:'ilovescotchyscotch',

   databaseURI: function(heroku_env_uri){
        if(heroku_env_uri)
            return heroku_env_uri;
        else
           return "mongodb://crash:joehorn@ds037205.mongolab.com:37205/teamify-dev";
    }



};