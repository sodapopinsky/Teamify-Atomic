angular.module('inventory', ['inventory-items'])

    .config(function($stateProvider){
        $stateProvider
            .state('app.inventory', {
                abstract: true,
                views: {
                    "content@app": {
                        templateUrl: "inventory/inventory.tpl.html"
                    }
                }
            });
    });


