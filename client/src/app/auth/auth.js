angular.module('auth', ['ui.router']);

angular.module('auth').config(function($stateProvider) {
    $stateProvider.state('auth', {
        url: '/auth',

        templateUrl:"auth/auth.tpl.html",
        controller:'ProjectsViewCtrl'

    })
})

.controller('ProjectsViewCtrl', function() {

console.log("test");
    });