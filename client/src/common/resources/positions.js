
(function() {
    'use strict';
    angular
        .module('resources.positions',['ngResource'])
        .factory('positions', positions);

    function positions($resource) {

        var factory = {};

        factory.data = {
            positions: [],
            loading:false
        };

        // ngResource call to our data
        var Position = $resource('api/positions/:id', {}, {
            update: {
                method: 'PUT'
            }
        });

        /**
         * @name fetchPositions
         * @description Fetches all positions for an organization
         * @returns {$promise|*}
         */
        factory.fetchPositions= function(){
            // $promise.then allows us to intercept the results
            // which we will use later
            var promise = Position.query().$promise;
            promise.then(function(response){
                factory.data.positions = response;
            });
            return promise;
        }

        /**
         * @name isValid
         * @description Validates the position
         * @param data
         * @throws {String} Error Description
         */
        factory.isValid = function(position){
            if(!position.name)
                throw "Name Required";
        };

        /**
         *
         * @param data
         * @returns {$promise|*}
         */
        factory.create = function(position) {
            return Position.save(position).$promise;
        }

        return factory;
    }

})();