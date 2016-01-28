
(function() {

    'use strict';

    angular
        .module('resources.timecards',['ngResource'])
        .factory('timecards', timecards);


    function timecards($resource) {

        var factory = {};

        factory.data = {timecards: [],
            openTimecards: [],
            loading:false};


        // ngResource call to our static data
        var Timecard = $resource('api/timecards/:guid', {guid: '@guid'}, {
            update: {
                method: 'PUT'
            }
        });


        factory.fetchOpenTimecards = function(){
            var OpenTimecards = $resource('/api/opentimecards',{},
                {
                    'save': {method:'POST', isArray: true}
                });
            OpenTimecards.query().$promise.then(function(response){
                factory.data.openTimecards = response;
            });
        };

        factory.getTimecards = function(data) {

            return Timecard.query(data).$promise;
        }


        factory.updateTimecard = function(data) {
            console.log(data);
            return Timecard.update({guid:data.guid}, data).$promise;


        }

        factory.delete = function(guid){
            return Timecard.delete({guid:guid}).$promise;
        };

        factory.createTimecard = function(data) {
          return Timecard.save(data).$promise;
        };


        return factory;

    }


})();