
(function() {

    'use strict';

    angular
        .module('resources.timecards',['ngResource'])
        .factory('timecards', timecards);


    function timecards($resource) {

        var factory = {};

        factory.data = {timecards: [],loading:false};


        // ngResource call to our static data
        var Timecard = $resource('api/users/:id', {}, {
            update: {
                method: 'PUT'
            }
        });


        factory.getUsers = function() {

            var promise = Timecard.query().$promise;
            promise.then(function(success){
                console.log(success);
            });

            return promise;

        }


        return factory;

    }


})();