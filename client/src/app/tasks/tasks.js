angular.module('tasks', [])
    .config(function($stateProvider){
        $stateProvider
            .state('app.tasks', {
                url:"/tasks",
                views: {
                    "content@app": {
                        templateUrl: "tasks/tasks.tpl.html",
                        controller: "TasksController"
                    }
                }
            });
    })
.controller("TasksController",function(){

    });