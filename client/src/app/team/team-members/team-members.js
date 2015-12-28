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

    console.log("here");

});
