
(function() {

    'use strict';

    angular
        .module('resources.tasks',['ngResource'])
        .factory('tasks', tasks);


    function tasks($resource) {

        var factory = {};

        factory.data = {
             tasks: [],
            loading:false};


        // ngResource call to our static data
        var Task = $resource('api/tasks/:_id', {}, {
            update: {
                method: 'PUT'
            }
        });


        factory.fetchTasks= function(){
            // $promise.then allows us to intercept the results
            // which we will use later
            var promise = Task.query().$promise;
            promise.then(function(response){
                factory.data.tasks = response;
            });
            return promise
        }


        factory.isValid = function(data){

              if(!data.name)
              throw "Name Required";

        };

        factory.update = function(data){
            return Task.update({_id:data._id}, data).$promise;
        };

        factory.createTask = function(data) {
            return Task.save(data).$promise;
        }


        return factory;

    }


})();