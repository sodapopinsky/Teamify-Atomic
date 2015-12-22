require('angular');
require('angular-route');
require('angular-animate');

var mainCtrl = require('./controllers/mainctrl');

var app = angular.module('teamify',['ngRoute', 'ngAnimate']);




app.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        // routes
        $routeProvider
            .when("/", {
                templateUrl: "/views/authView.html",
                controller: "MainController"
                })


            .otherwise({
                redirectTo: '/'
            });
    }
])

    //Load controller
    app.controller('MainController', ['$scope', mainCtrl]);

//Load controllers
//app.controller('MainController', ['$scope', mainCtrl]); fd





