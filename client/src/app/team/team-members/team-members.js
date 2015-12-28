angular.module('team-members', [])
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



angular.module('team-members').controller('TeamMembersController', function($scope,$state,$auth, $rootScope) {

    $scope.goCreateNewEmployee = function(){
        $scope.activeUser = {};
        $scope.panelContent = 'team/team-members/sidepanel/new_employee.tpl.html';
        $('.cd-panel').addClass('is-visible');
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


});
