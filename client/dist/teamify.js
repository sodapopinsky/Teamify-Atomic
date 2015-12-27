/*! teamify - v0.0.1 - 2015-12-26
 * Copyright (c) 2015 Nick Spitale;
 * Licensed 
 */
angular.module('app', [
    'ui.router',
    'auth',
    'satellizer',
    'templates.app']);

angular.module('app').run(function($rootScope, $state) {

    // $stateChangeStart is fired whenever the state changes. We can use some parameters
    // such as toState to hook into details about the state as it is changing
    $rootScope.$on('$stateChangeStart', function(event, toState) {

        // Grab the user from local storage and parse it to an object
        var user = JSON.parse(localStorage.getItem('user'));

        // If there is any user data in local storage then the user is quite
        // likely authenticated. If their token is expired, or if they are
        // otherwise not actually authenticated, they will be redirected to
        // the auth state because of the rejected request anyway
        if(user) {

            $rootScope.authenticated = true;

            // Putting the user's data on $rootScope allows
            // us to access it anywhere across the app. Here
            // we are grabbing what is in local storage
            $rootScope.currentUser = user;

            // If the user is logged in and we hit the auth route we don't need
            // to stay there and can send the user to the main state
            if(toState.name === "auth") {

                // Preventing the default behavior allows us to use $state.go
                // to change states
                event.preventDefault();

                // go to the "main" state which in our case is users
                $state.go('app');
            }
        }
    });
});

angular.module('app').config(function($stateProvider, $locationProvider,$urlRouterProvider,  $authProvider, $httpProvider, $provide) {
    function redirectWhenLoggedOut($q, $injector) {

        return {

            responseError: function(rejection) {

                // Need to use $injector.get to bring in $state or else we get
                // a circular dependency error
                var $state = $injector.get('$state');

                // Instead of checking for a status code of 400 which might be used
                // for other reasons in Laravel, we check for the specific rejection
                // reasons to tell us if we need to redirect to the login state
                var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                // Loop through each rejection reason and redirect to the login
                // state if one is encountered
                angular.forEach(rejectionReasons, function(value, key) {

                    if(rejection.data.error === value) {

                        // If we get a rejection corresponding to one of the reasons
                        // in our array, we know we need to authenticate the user so
                        // we can remove the current user from local storage
                        localStorage.removeItem('user');

                        // Send the user to the auth state so they can login
                        $state.go('auth');
                    }
                });

                return $q.reject(rejection);
            }
        };
    }

    // Setup for the $httpInterceptor
    $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

    // Push the new factory onto the $http interceptor array
    $httpProvider.interceptors.push('redirectWhenLoggedOut');

    $authProvider.loginUrl = '/api/authenticate';
    // Satellizer configuration that specifies which API
    // route the JWT should be retrieved from


    // Redirect to the auth state if any other states
    // are requested other than users
    $urlRouterProvider.otherwise('/auth');


    //
    // Now set up the states
    $stateProvider

        .state('app', {
            url: '/app',
          template: "test"

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


angular.module('auth', ['ui.router', 'satellizer']);

angular.module('auth').config(function($stateProvider) {
    $stateProvider.state('auth', {
        url: '/auth',

        templateUrl:"auth/auth.tpl.html",
        controller:'AuthController as auth'

    });
})

.controller('AuthController', function($auth, $state, $http, $rootScope) {



            var vm = this;
            vm.email = "nick@theatomicburger.com";
            vm.password = "password";
        vm.name = "Nick Cerminara";
            vm.login = function() {

                var credentials = {
                    email: vm.email,
                    password: vm.password,
                    name: vm.name
                }


                $auth.login(credentials).then(function() {
                    // Return an $http request for the now authenticated
                    // user so that we can flatten the promise chain
                   $http.get('api/authenticate/user').then(function(response) {
                       console.log("successfdafds");
                   });
                    // Handle errors
                }, function(error) {
                    vm.loginError = true;
                    vm.loginErrorText = error.data.error;
                    // Because we returned the $http.get request in the $auth.login
                    // promise, we can chain the next promise to the end here
                })
            }



    });
angular.module('templates.app', ['auth/auth.tpl.html']);

angular.module("auth/auth.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("auth/auth.tpl.html",
    "\n" +
    "<div class=\"container\" >\n" +
    "    <img src=\"images/checkLogoBig.png\"  class=\"img-responsive center-block voffset7\" />\n" +
    "    <div class=\"text-center voffset4\"><h1>Log in to your account</h1></div>\n" +
    "    <div class=\"form-group text-red text-center voffset4\" style=\"display:none;\">\n" +
    "        That account was not found.  Please Try Again.\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-4 center-block voffset5\" style=\"float:none;\">\n" +
    "        <form class=\"form-horizontal\">\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"email\"  class=\"tmf-form-control\" placeholder=\"Email\" ng-model=\"auth.email\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"password\" placeholder=\"Password\"  class=\"tmf-form-control\"  ng-model=\"auth.password\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group voffset2\">\n" +
    "\n" +
    "                <a href=\"\" class=\"pull-right\" style=\"font-size:13px;\">Forgot your password?</a>\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"form-group voffset5\">\n" +
    "                <div>\n" +
    "                    <button class=\" tmf-form-control btn btn-primary btn-caps\" ng-click=\"auth.login()\">LOG IN</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module('templates.common', []);

