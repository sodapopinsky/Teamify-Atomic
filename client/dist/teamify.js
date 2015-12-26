/*! teamify - v0.0.1 - 2015-12-26
 * Copyright (c) 2015 Nick Spitale;
 * Licensed 
 */
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


angular.module('auth', ['ui.router']);

angular.module('auth').config(function($stateProvider) {
    $stateProvider.state('auth', {
        url: '/auth',

        templateUrl:"auth/auth.tpl.html",
        controller:'ProjectsViewCtrl'

    });
})

.controller('ProjectsViewCtrl', function() {

console.log("test");
    });
angular.module('templates.app', ['auth/auth.tpl.html']);

angular.module("auth/auth.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("auth/auth.tpl.html",
    "<div>\n" +
    "    dfdfsfd\n" +
    "    <button type=\"button\" class=\"btn btn-default\" aria-label=\"Left Align\">\n" +
    "        <span class=\"glyphicon glyphicon-align-left\" aria-hidden=\"true\"></span>\n" +
    "    </button>\n" +
    "\n" +
    "</div>");
}]);

angular.module('templates.common', []);

