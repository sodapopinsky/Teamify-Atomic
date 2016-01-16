
(function() {

    'use strict';

    angular
        .module('resources.tasks',['ngResource'])
        .factory('tasks', tasks);


    function tasks($resource,utils) {

        var factory = {};

        factory.data = {
             tasks: [],
             loading:{loading: true}};


        // ngResource call to our static data
        var Task = $resource('api/tasks/:_id', {}, {
            update: {
                method: 'PUT'
            }
        });


        factory.fetchTasks= function(){
            factory.data.loading.loading = true;
            var promise = Task.query().$promise;
            promise.then(function(response){
                factory.data.tasks = response;
                factory.data.loading.loading = false;
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
            var promise = Task.save(data).$promise;
            promise.then(function(response){
                factory.data.tasks.push(response);
            });
            return promise;
        }

        factory.deleteTask = function(id){
            var promise = Task.delete({_id:id}).$promise;
            promise.then(function(){
              var index = utils.getIndexByAttributeValue(factory.data.tasks,"_id",id);
                if(index != null)
                    factory.data.tasks.splice(index,1);
            });
            return promise;
        }


        return factory;

    }


})();