/*! teamify - v0.0.1 - 2015-12-27
 * Copyright (c) 2015 Nick Spitale;
 * Licensed 
 */
angular.module('app', [
    'ui.router',
    'auth',
    'satellizer',
    'team',
    'directives.uiSrefActiveIf',
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
                $state.go('app.team.members');
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
            abstract: true,
            views: {
                "mainContent": {
                    controller: "AppController",
                    templateUrl: "index.tpl.html"
                }
            }
        })
});



angular.module('app').controller('AppController', function() {






});


angular.module('auth', ['ui.router', 'satellizer']);

angular.module('auth').config(function($stateProvider, $authProvider) {

    $authProvider.loginUrl = '/api/authenticate';

    $stateProvider.state('auth', {
        url: '/auth',
        templateUrl:"auth/auth.tpl.html",
        controller:'AuthController as auth'

    })
    .state('logout', {
            url: '/logout',

            controller: function($scope,$auth,$rootScope,$state) {

                $auth.logout().then(function() {

                    // Remove the authenticated user from local storage
                    localStorage.removeItem('user');

                    // Flip authenticated to false so that we no longer
                    // show UI elements dependant on the user being logged in
                    $rootScope.authenticated = false;

                    // Remove the current user info from rootscope
                    $rootScope.currentUser = null;

                    $state.go('auth');
                });
            }
        });

})

.controller('AuthController', function($auth, $state, $http, $rootScope) {


            var vm = this;
            vm.email = "joe@theatomicburger.com";
            vm.password = "password";

            vm.login = function() {

                var credentials = {
                    email: vm.email,
                    password: vm.password,
                    name: vm.name
                };


                $auth.login(credentials).then(function(response) {
                    // Return an $http request for the now authenticated
                    // user so that we can flatten the promise chain


                       // Stringify the returned data to prepare it
                       // to go into local storage
                       var user = JSON.stringify(response.data.user);

                       // Set the stringified user data into local storage
                       localStorage.setItem('user', user);

                       // The user's authenticated state gets flipped to
                       // true so we can now show parts of the UI that rely
                       // on the user being logged in
                       $rootScope.authenticated = true;

                       // Putting the user's data on $rootScope allows
                       // us to access it anywhere across the app
                       $rootScope.currentUser = response.data.user;

                       // Everything worked out so we can now redirect to
                       // the users state to view the data
                         $state.go('app.team.members');

                    // Handle errors
                }, function(error) {
                    vm.loginError = true;
                    vm.loginErrorText = error.data.error;
                    // Because we returned the $http.get request in the $auth.login
                    // promise, we can chain the next promise to the end here
                });
            };



    });
angular.module('team-members', [])
.config(function($stateProvider) {
    $stateProvider
        .state('app.team.members', {
            url: '/teammembers',
            views: {
                "content": {

                    template:"teammembers"
                }
            }
        });

});
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


angular.module('directives.loading',[]).directive('loading', function () {
        return {
            restrict: 'E',
            replace:true,
            template: '<div class="center-block text-center"><img src="images/spinner.gif" style="width:30px; height:30px;"></div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    }); //ett
angular.module('directives.uiSrefActiveIf',[]).directive('uiSrefActiveIf', ['$state', function($state) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var state = $attrs.uiSrefActiveIf;

            function update() {
                if ( $state.includes(state) || $state.is(state) ) {
                    $element.addClass("active");
                } else {
                    $element.removeClass("active");
                }
            }

            $scope.$on('$stateChangeSuccess', update);
            update();
        }]
    };
}]);


angular.module('templates.app', ['auth/auth.tpl.html', 'index.tpl.html', 'team/team.tpl.html']);

angular.module("auth/auth.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("auth/auth.tpl.html",
    "<div class=\"container\" >\n" +
    "    <img src=\"/img/checkLogoBig.png\"  class=\"img-responsive center-block voffset7\" />\n" +
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

angular.module("index.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("index.tpl.html",
    "<div id=\"sidebar-wrapper\">\n" +
    "    <div id=\"sidebar-user\">\n" +
    "        <span class=\"glyphicon glyphicon-comment\"></span>\n" +
    "        <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "        <div class=\"collapse navbar-collapse pull-left\" id=\"bs-example-navbar-collapse-1\">\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "                <li><div class=\"avatar\">{{currentUser.first_name.slice(0,1)}}{{currentUser.last_name.slice(0,1)}}</div></li>\n" +
    "                <li class=\"dropdown\">\n" +
    "                    <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                       aria-expanded=\"false\"><span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li> <a ui-sref=\"logout\">Logout</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div><!-- /.navbar-collapse -->\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "    <ul class=\"sidebar-nav\">\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.team\" ui-sref=\"app.team.team-members\">\n" +
    "                <span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span><p>TEAM</p></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.inventory\" ui-sref=\"app.inventory.items\">\n" +
    "                <span class=\"glyphicon glyphicon-list-alt\" aria-hidden=\"true\"></span><p>INVENTORY</p></a>\n" +
    "        </li>\n" +
    "\n" +
    "        <!--\n" +
    "           <li >\n" +
    "            <a  ng-class=\"{active: sidebarTab == 'checklist',inactive: sidebarTab != 'checklist' }\"\n" +
    "                href=\"/#/checklist\">Tasks</a>\n" +
    "        </li>\n" +
    "        <li >\n" +
    "            <a  ng-class=\"{active: sidebarTab == 'ordering',inactive: sidebarTab != 'ordering' }\"\n" +
    "                href=\"/#/ordering/inventory\">Ordering</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <h5 ng-if=\"authenticated\">{{currentUser.first_name}} {{currentUser.last_name}}</h5>\n" +
    "            <button class=\"btn btn-danger\" ng-click=\"logout()\">Logout</button>\n" +
    "        </li>\n" +
    "        -->\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"wrapper\">\n" +
    "\n" +
    "\n" +
    "    <div ui-view =\"content\" ></div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("team/team.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/team.tpl.html",
    "\n" +
    "<nav class=\"tmf-nav\">\n" +
    "\n" +
    "    <ul class=\"navbar-nav navbar-right\">\n" +
    "        <li ui-sref-active-if=\"app.team.members\" ui-sref=\"app.team.members\">Members</li>\n" +
    "        <li ui-sref-active-if=\"app.team.timecards\" ui-sref=\"app.team.timecards.reports.summary\">Timecards</li>\n" +
    "\n" +
    "    </ul>\n" +
    "\n" +
    "    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <a class=\"navbar-brand\" >Team</a>\n" +
    "    </div>\n" +
    "\n" +
    "</nav>\n" +
    "\n" +
    "<div ui-view=\"content\" style=\"margin:20px;\"></div>\n" +
    "");
}]);

angular.module('templates.common', []);

