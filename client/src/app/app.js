angular.module('app', [
    'ui.router',
    'auth',
'templates.app']);


angular.module('app').config(function($stateProvider, $locationProvider,$urlRouterProvider) {
 //   $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/auth');

    //
    // Now set up the states
    $stateProvider

        .state('app', {
            abstract: true,
            views: {
                "mainContent": {
                    controller: "AppController",
                    templateUrl: "views/index.html"
                }
            }
        })

//Team
        .state('app.team', {
            abstract: true,
            controller: "TeamController",
            views: {
                "content@app": {
                    controller: "TeamController",
                    templateUrl: "views/team/index.html"
                }
            }
        })
        .state('app.team.members', {
            url: '/team/members',
            template:"members"
        });

});



angular.module('app').controller('AppController', function() {






});

