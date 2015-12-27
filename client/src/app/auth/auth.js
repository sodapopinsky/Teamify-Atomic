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