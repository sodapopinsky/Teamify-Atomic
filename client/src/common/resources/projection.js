
(function() {

    'use strict';

    angular
        .module('resources.projection',[])
        .factory('projection', projection);

    function projection($resource,user,organization) {


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


        factory.projectionForDate = function (date) {

            var x = 1;
            var i = -1;
            var organizationData = organization.data;
            angular.forEach(factory.data.projections, function (value, index) {
                if (moment(value.date).isSame(date, 'day'))
                    i = index;
                x = 2;
            });

            if (i > -1)
               return factory.data.projections[i].projection;
                 //@tmf this is dumb, default projections should be in this factory, not organization
               return organizationData.organization.default_projections[date.weekday()];


        }

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