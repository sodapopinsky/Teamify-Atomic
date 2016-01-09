angular.module('tasks')
    .config(function($stateProvider){
        $stateProvider
            .state('app.tasks.positions', {
                url:"/positions",
                views: {
                    "content": {
                        templateUrl: "tasks/positions/positions.tpl.html",
                        controller: "Tasks_PositionsController"
                    }
                }
            });
    })
    .controller("Tasks_PositionsController",function($scope,notificate, utils, positions) {

        $scope.positions = positions.data;
        positions.fetchPositions();

        /**
         * @name $scope.goCreatePosition
         * @description Open create new position sidepanel
         */
        $scope.goCreatePosition = function(){
            $scope.newPosition = {};
            $scope.panelContent = 'tasks/positions/sidepanel/create.tpl.html';
            $('#positionsPanel').addClass('is-visible');
        };

        /**
         * @name $scope.createPosition
         * @description Validate and create new position
         */
        $scope.createPosition = function(){
          try {positions.isValid($scope.newPosition)}
          catch (error){
              notificate.error(error)
              return;
          }
        positions.create($scope.newPosition).then(function(){
            $('#positionsPanel').removeClass('is-visible');
            notificate.success("New Position Created!");
        },
        function(error){
            notificate.error("There was an error with your request");
        });
        };

        /**
         * @name $scope.cancelCreatePosition
         * @description Close create new position sidepanel
         */
        $scope.cancelCreatePosition = function(){
            $('#positionsPanel').removeClass('is-visible');
        };
    });

//@tmf need to populate the "Unassigned" entry when creating account