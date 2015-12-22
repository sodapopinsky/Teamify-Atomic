angular.module('teamify').controller('Team_MembersController', function($auth,$rootScope,$scope,user) {


    $scope.status = "Active";
    $scope.users = [];

    $scope.status = {value:1, title:'Active'};


    $scope.statusTitle = function(status){
        if(status == 1)
            return 'Active';
        else
            return 'Terminated';
    }

    $scope.setActive = function(user){
        $scope.panelContent = 'views/team/members/sidepanel/general.html';
        $('.cd-panel').addClass('is-visible');
        $scope.activeUser = user;
        $scope.staleUser = JSON.parse(JSON.stringify(user));

    }

    $scope.createUser = function() {

        try {
            user.isValid($scope.activeUser)
        }
        catch (error) {
            Crash.notificate.error(error);
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

                    $scope.setActive($scope.getUserById(createdId.id));
                }, function(error) { // Check for errors
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });
    }


    $scope.cancelChanges = function(){

        if($scope.activeUser.id) {
            $scope.activeUser = $scope.staleUser;
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].id == $scope.activeUser.id) {
                    $scope.users[i] = $scope.activeUser;
                    break;
                }
            }

        }
        $('.cd-panel').removeClass('is-visible');
    }


    $scope.filterByStatus = function(status){
        $scope.status.title = $scope.statusTitle(status);
        $scope.status.value = status;
    }

    $scope.customFilter = function (data) {
        if (data.status == $scope.status.value) {
            return true;
        }
        return false;
    };


    user.getUsers().$promise.then(function(results) {
        $scope.users = results;
    }, function(error) { // Check for errors
        console.log(error);
    });



    $scope.updateUser = function() {
        try {user.isValid($scope.activeUser)}
        catch (error) {
            Crash.notificate.error(error);
            return;
        }



        // Update the time entry and then refresh the list
        user.updateUser($scope.activeUser).$promise.then(function(success) {
            $scope.staleUser = $scope.activeUser;
            Crash.notificate.success("Your Changes Have Been Saved");
        }, function(error) {
            console.log(error);
        });

    }

    $scope.goCreateNewEmployee = function(){
        $scope.activeUser = {};
        $scope.panelContent = 'views/team/members/sidepanel/new_employee.html';
        $('.cd-panel').addClass('is-visible');
    }


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
    }

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



    }


});