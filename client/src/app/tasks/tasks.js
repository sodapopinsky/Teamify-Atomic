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
        tasks.fetchTasks();

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
         * @name $scope.createTask
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
                position: $scope.activeTask.position
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