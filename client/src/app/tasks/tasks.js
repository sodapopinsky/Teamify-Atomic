angular.module('tasks')
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.tasks', {
                abstract: true,
                url: "/tasks",
                views: {
                    "content@app": {
                        templateUrl: "tasks/index.tpl.html"
                    }
                }
            })
            .state('app.tasks.tasks', {
                url: "/tasks",
                views: {
                    "content": {
                        templateUrl: "tasks/tasks/tasks.tpl.html",
                        controller: "TasksController"
                    }
                }
            });
    })
    .controller("TasksController", function ($scope, tasks, notificate, utils, positions) {

        //Populate tasks data
        $scope.tasks = tasks.data;
        $scope.loading = true;

        tasks.fetchTasks().then(function(){
            $scope.loading = false;
        });

        //Populate positions data
        $scope.positions = positions.data;
        positions.fetchPositions().then(function (response) {
            if (response[0])
                $scope.activePosition = response[0];
        });

        /**
         * @name $scope.goCreateTask
         * @description Open create task side panel
         */
        $scope.goCreateTask = function () {
            $scope.activeTask = {
                _position: $scope.activePosition
            };

            $scope.panelContent = 'tasks/tasks/sidepanel/create.tpl.html';
            $('#taskPanel').addClass('is-visible');
        };

        /**
         * @name $scope.createTaskss
         * @description Validate and create new task
         */
        $scope.createTask = function () {
            try {
                tasks.isValid($scope.activeTask);
            }
            catch (error) {
                notificate.error(error);
                return;
            }

            tasks.createTask({
                name: $scope.activeTask.name,
                description: $scope.activeTask.description,
                position: $scope.activeTask._position
            }).then(function () {
                $('#taskPanel').removeClass('is-visible');
                notificate.success("Task Created!");
                //@tmf this doesnt need to be a server hit, use response
                tasks.fetchTasks();
            });
        };

        /**
         * @name $scope.cancelCreateTask
         * @description Close create task side panel
         */
        $scope.cancelCreateTask = function () {
            $('#taskPanel').removeClass('is-visible');
        }

        /**
         * @name $scope.deleteTask
         * @description Deletes the active task
         */
        $scope.deleteTask = function(){
            tasks.deleteTask($scope.activeTask._id).then(function(){
                notificate.success("Task has been deleted");
                $('#taskPanel').removeClass('is-visible');
            },
            function(error){
                notificate.error("There was an error with your request.");
            });
        };

        /**
         * @name $scope.filterByPosition
         * @description Filter tasks by position
         * @param position
         */
        $scope.filterByPosition = function (position) {
            $scope.activePosition = position;
        };

        /**
         * @name $scope.selectPosition
         * @description Select position for new or updated tasks
         * @param position
         */
        $scope.selectPosition = function (position) {
            $scope.activeTask._position = position;
        };

        /**
         * @name $scope.goEditTask
         * @description
         * @param task
         */
        $scope.goEditTask = function (task) {
            $scope.panelContent = 'tasks/tasks/sidepanel/edit.tpl.html';
            $('#taskPanel').addClass('is-visible');
            $scope.activeTask = task;
            $scope.staleTask = JSON.parse(JSON.stringify(task));
        };

        /**
         * @name $scope.tasksFilter
         * @description Filter tasks based on user selections
         * @param data
         * @returns {boolean}
         */
        $scope.tasksFilter = function (data) {

            if(data._position === undefined)
            return false;

                if (data._position._id == $scope.activePosition._id)
                    return true;

            return false;
        };

        /**
         * @name $scope.cancelEditTask
         * @description Reverts changes to task and closes side panel
         */
        $scope.cancelEditTask = function () {
            var index = utils.getIndexByAttributeValue($scope.tasks.tasks, "_id", $scope.activeTask._id);
            $scope.tasks.tasks[index] = utils.copy($scope.staleTask);
            $('#taskPanel').removeClass('is-visible');
        };

        $scope.updateTask = function(){
            try {
                tasks.isValid($scope.activeTask);
            }
            catch (error) {
                notificate.error(error);
                return;
            }

            tasks.update($scope.activeTask).then(function(){
                notificate.success("Changes Saved");
                $('#taskPanel').removeClass('is-visible');
            },function(){
                notificate.error("There was a problem with your request");
            });
        }

    });