angular.module('team')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.team.timecards', {
                url: '/team/timecards',
                abstract:true,
                views: {
                    "content": {
                        controller: "Team_TimecardsController",
                        templateUrl: "team/timecards/index.tpl.html"
                    }
                }
            })
            .state('app.team.timecards.clockedin', {
                url: '/clockedin',
                templateUrl: "team/timecards/clockedIn.tpl.html",
                controller: "Team_ClockedInController"
            })

    .state('app.team.timecards.reports', {
        abstract:true,
        templateUrl: "team/timecards/reports.tpl.html",
        controller: "Team_Timecards_ReportController"
    })


    .state('app.team.timecards.reports.summary', {
        url: '/summary',
        templateUrl: "team/timecards/summary.tpl.html",
        controller: "Team_Timecards_Report_SummaryController"
    })

    .state('app.team.timecards.reports.shiftdetail', {
        url: '/detail',
        templateUrl: "team/timecards/shiftdetail.tpl.html",
        controller: "Team_Timecards_Report_ShiftDetailController"
    });

    });




angular.module('team').controller('Team_TimecardsController', function($scope,timecards,notificate,user) {




    user.getUsers().$promise.then(function(results) {
        $scope.users = results;

    }, function(error) { // Check for errors
        console.log(error);
    });





    $scope.goCreateNewTimecard = function(){
        $scope.panelContent = 'team/timecards/sidepanel/create.tpl.html';
        $('#createTimecardPanel').addClass('is-visible');
    }

    $scope.newTimecard = {
        hours: 0,
        selectedUser: {},
        selectUser: function(user){
            $scope.newTimecard.selectedUser = user;
        },
        dates: {
            clock_in: {
                date: {
                    startDate: moment().format("MM/d/YYYY"),
                    endDate: moment(),
                    options: {
                        autoUpdateInput: false
                    }
                },
                time: moment()
            },
            clock_out: {
                date: {
                    startDate: moment().format("MM/d/YYYY"),
                    endDate: moment(),
                    options: {
                        autoUpdateInput: false
                    }
                },
                time: moment()
            }
        }
    }

    $scope.newTimecard.createTimecard = function() {

        if(!$scope.newTimecard.selectedUser){
          notificate.error("Please Select a Team Member");
            return;
        }
        if($scope.newTimecard.hours <= 0){
           notificate.error("Clock Out Time Must Be Greater than Clock In Time");
            return;
        }


    }



});


angular.module('team').controller('Team_ClockedInController', function($scope,user) {


});

angular.module('team').controller('Team_Timecards_ReportController', function($scope,user) {


});

angular.module('team').controller('Team_Timecards_Report_SummaryController', function($scope,user) {


});

angular.module('team').controller('Team_Timecards_Report_ShiftDetailController', function($scope,user) {


});