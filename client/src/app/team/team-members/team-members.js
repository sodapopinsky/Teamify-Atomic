angular.module('team-members', ['resources.users'])
.config(function($stateProvider) {
    $stateProvider
        .state('app.team.members', {
            url: '/teammembers',
            views: {
                "content": {
                    controller: 'TeamMembersController',
                    templateUrl:"team/team-members/team-members.tpl.html"
                }
            }
        });

});



angular.module('team-members').controller('TeamMembersController', function($scope,user,notificate) {

    $scope.users = [];

    $scope.status = {value:1, title:'Active'};


    $scope.statusTitle = function(status){
        if(status === 1)
            return 'Active';
        if(status === 0)
            return 'Terminated';
    };


    $scope.statusFilter = function (data) {
        if (data.status === $scope.status.value) {
            return true;
        }
        return false;
    };

    $scope.filterByStatus = function(status){
        $scope.status.title = $scope.statusTitle(status);
        $scope.status.value = status;
    };

    $scope.setActive = function(user){
        $scope.panelContent = 'team/team-members/sidepanel/edit.tpl.html';
        $('.cd-panel').addClass('is-visible');
        $scope.activeUser = user;
        $scope.staleUser = JSON.parse(JSON.stringify(user));

    };


    user.getUsers().$promise.then(
        function(response){
            $scope.users = response;
        }
    );

    $scope.goCreateNewEmployee = function(){
        $scope.activeUser = {};
        $scope.panelContent = 'team/team-members/sidepanel/new_employee.tpl.html';
        $('.cd-panel').addClass('is-visible');
    };

    $scope.cancelChanges = function(){

        if($scope.activeUser.id) {
            $scope.activeUser = $scope.staleUser;
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].id === $scope.activeUser.id) {
                    $scope.users[i] = $scope.activeUser;
                    break;
                }
            }

        }
        $('.cd-panel').removeClass('is-visible');
    };


    $scope.updateUser = function() {



        try {user.isValid($scope.activeUser);}
        catch (error) {
            notificate.error(error);
            return;
        }



        // Update the time entry and then refresh the list
        user.updateUser($scope.activeUser).$promise.then(function(success) {

            $scope.staleUser = $scope.activeUser;
          notificate.success("Your Changes Have Been Saved");
        }, function(error) {
            console.log(error);
        });

    };

    $scope.createUser = function() {

        try {
            user.isValid($scope.activeUser);
        }
        catch (error) {
          //  Crash.notificate.error(error); fff
            return;
        }

        user.createUser({
            "first_name": $scope.activeUser.first_name,
            "last_name": $scope.activeUser.last_name,
            "pin": parseInt($scope.activeUser.pin)
        }).$promise.then(function (createdId) {
                user.getUsers().$promise.then(function(results) {
                    $scope.users = results;
                    $('.cd-panel').removeClass('is-visible');

                    //c$scope.setActive($scope.getUserById(createdId.id));
                }, function(error) { // Check for errors
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });
    };

    $scope.terminateUser = function(user) {

        swal({   title: "Are you sure?",
            text: "This employee will be made inactive, but may be reactived at any point.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            closeOnConfirm: true }, function(){

            $scope.activeUser.status = 0;
            $scope.updateUser();


        });
    };

    $scope.reactivateUser = function() {

        swal({   title: "Are you sure?",
            text: "This employee will be re-activated.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            closeOnConfirm: true }, function(){

            $scope.activeUser.status = 1;
            $scope.updateUser();


        });



    };


});
