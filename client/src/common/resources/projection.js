
(function() {

    'use strict';

    angular
        .module('resources.projection',[])
        .factory('projection', projection);

    function projection($resource,user) {


    var userData = user.data;

        var factory = {};
        factory.data={projections:[],loading:false};
        factory.data.loading=false;

        // ngResource call to our static data
        var Projection = $resource('api/projections/:id', {start: '@start', end:'@end'}, {
            update: {
                method: 'PUT'
            }
        });

        var r = $resource('api/projections/update_default', {organization: '@id',
            day: '@day',
            projection: '@projection'}, {
            'update': {
                method: 'PUT'
            }
        });



        factory.getProjectionsForDateRange  = function(start,end){

            return Projection.query({id:1,start:start,end:end});
        }


        factory.save = function(data){
            return Projection.save(data);
        }

        factory.updateDefaultProjections = function(day,projection) {


            return r.update(
                {organization:userData.currentUser.organization,
                    day: day,
                    projection: projection

                });
        }

        return factory;

    }

})();