angular.module('team-members', [])
.config(function($stateProvider) {
    $stateProvider
        .state('app.team.members', {
            url: '/teammembers',
            views: {
                "content": {

                    template:"teammembers"
                }
            }
        });

});