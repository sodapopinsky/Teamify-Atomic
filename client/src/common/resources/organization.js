
(function() {

    'use strict';

    angular
        .module('resources.organization',[])
        .factory('organization', organization);

    function organization($resource) {


        var factory = {};
        factory.data={organization:{},loading:false};
            factory.data.loading=false;


        // ngResource call to our static data
        var Organization = $resource('api/organization/:id', {}, {
            update: {
                method: 'PUT'//
            }
        });

        factory.getById = function(id){

            return Organization.query({id:id});


        }


        return factory;
    }

})();