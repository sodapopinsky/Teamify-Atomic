
(function() {

    'use strict';

    angular
        .module('resources.sales',[])
        .factory('sales', sales);

    function sales($resource) {



        var factory = {};
        factory.data={projections:[],loading:false};
        factory.data.loading=false;

        // ngResource call to our static data
        var Sales = $resource('api/sales/:id', {start: '@start', end:'@end'}, {
            update: {
                method: 'PUT'
            }
        });





        return factory;

    }

})();