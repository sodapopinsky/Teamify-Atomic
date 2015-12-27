angular.module('team', ['team-members'])

.config(function($stateProvider){

        $stateProvider
            .state('app.team', {
            abstract: true,
            views: {
                "content@app": {
                    templateUrl: "team/team.tpl.html"
                }
            }
        });
    });