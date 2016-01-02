angular.module('home', [])

    .config(function($stateProvider){

        $stateProvider
            .state('app.home', {
                abstract: true,
                views: {
                    "content@app": {
                        templateUrl: "home/home.tpl.html"
                    }
                }
            });
    });