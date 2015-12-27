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