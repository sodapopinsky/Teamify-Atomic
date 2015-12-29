
(function() {

    'use strict';

    angular
        .module('resources.sales',[])
        .factory('sales', sales);

    function sales($resource) {



        // ngResource call to our static data
        var Sales = $resource('api/sales/:id', {}, {
            update: {
                method: 'PUT'
            }
        });


        function dailySalesForPeriod() {
            return Sales.query();
        }


        function weeklyProjections(){



            return $resource('api/sales/projections.json', {}, {}).query().$promise.then(function (response) {
                return  [
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000}

                ];
                return response;
            }, function (error) {
                console.log(error);
            });

        }


        return {
            dailySalesForPeriod: dailySalesForPeriod,
            weeklyProjections: weeklyProjections
        }
    }

})();