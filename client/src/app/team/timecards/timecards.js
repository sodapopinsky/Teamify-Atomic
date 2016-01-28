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
    })
            .state('app.team.timecards.reports.shiftdetail.edit', { // added view mode
                url: "/:id",
                views: {
                    "panelContent@app.team.timecards.reports.shiftdetail": {
                        controller: "Team_Timecards_Report_ShiftDetail_EditController",
                        templateUrl: "team/timecards/sidepanel/edit.tpl.html"
                    }
                }
            });

    });




angular.module('team').controller('Team_TimecardsController', function($scope,timecards,notificate,user) {

    user.getUsers().$promise.then(function(results) {
        $scope.users = results;

    }, function(error) { // Check for errors
        console.log(error);
    });

    $scope.reportTimecards = [];


    $scope.reportDate = {};

    $scope.reportDate = {
        startDate: moment().subtract(1, "days"),
        endDate: moment(),
        options: {
            autoUpdateInput: false
        }
    };

    $scope.openDatePicker = function(selector){
        $(selector).data('daterangepicker').toggle();
    };

    $scope.reportDate.startDate = moment();
    $scope.updateDate = function(start,end){
        $scope.reportDate.startDate = start;
        $scope.reportDate.endDate = end;
        $scope.fetchTimecards();
    }


    $scope.fetchTimecards = function(){


        var start = $scope.reportDate.startDate.startOf('day').utc().format();
        var end =   $scope.reportDate.endDate.endOf('day').utc().format();



        $scope.loading = true;
        timecards.getTimecards({start:start, end:end}).then(function(results) {
            $scope.loading = false;
            $scope.reportTimecards = results;

        }, function(error) { // Check for errors
            console.log(error);
            $scope.loading = false;
        });


    }


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

        //@tmf this should be abstracted to resource file and hit server to validate for overlap
        if(!$scope.newTimecard.selectedUser){
          notificate.error("Please Select a Team Member");
            return;
        }
        if($scope.newTimecard.hours <= 0){
           notificate.error("Clock Out Time Must Be Greater than Clock In Time");
            return;
        }


        timecards.createTimecard({
            "user": $scope.newTimecard.selectedUser,
            "clock_in": utils.getMomentFromComponents($scope.newTimecard.dates.clock_in.date,$scope.newTimecard.dates.clock_in.time).utc().format(),
            "clock_out": utils.getMomentFromComponents($scope.newTimecard.dates.clock_out.date,$scope.newTimecard.dates.clock_out.time).utc().format()
        }).then(function (success) {


            notificate.success("Timecard Created!");
            $('#createTimecardPanel').removeClass('is-visible');

        }, function (error) {
            notificate.error("There was an error with your request.");
        });



    }
    $scope.calculateHours = function(inDate, inTime, outDate,outTime){
        var  i = moment(inDate);

        var  o = moment(outDate);


        var inTime = moment(inTime);
        i.hours(inTime.hours()).minutes(inTime.minutes());

        var outTime = moment(outTime);


        o.hours(outTime.hours()).minutes(outTime.minutes());

        return Math.round(moment.duration(o.diff(i)).asHours() * 100) / 100;

    }



    $scope.newTimecard.cancelCreateNewTimecard = function(){
        $('#createTimecardPanel').removeClass('is-visible');
    }

    $scope.$watch('[newTimecard.dates]', function(newDate) {

        $scope.newTimecard.hours = $scope.calculateHours($scope.newTimecard.dates.clock_in.date,
            $scope.newTimecard.dates.clock_in.time,$scope.newTimecard.dates.clock_out.date,
            $scope.newTimecard.dates.clock_out.time);
    }, true);




});


angular.module('team').controller('Team_ClockedInController', function($scope,timecards) {

    $scope.formatDate = function(date){
        return moment(date).format("ddd h:mm a");
    }
    timecards.fetchOpenTimecards();
     $scope.timecards = timecards.data;

});

angular.module('team').controller('Team_Timecards_ReportController', function($scope,user,$state) {

    $scope.$watch('reportDate', function(newDate) {
        $scope.updateDate(newDate.startDate,newDate.endDate);
    }, false);


    $scope.reports = [
        {"id":0,"title":"Timecard Summary","state":"app.team.timecards.reports.summary"},
        {"id":1,"title":"Shift Detail","state":"app.team.timecards.reports.shiftdetail"}
    ];

    $scope.activeReport = {};

    $scope.showReport = function(index){
        $scope.activeReport =  $scope.reports[index];
        $state.go($scope.reports[index].state);
    };

    $scope.formatDate =   function formatDate(date){
        if(!date)
            return "-";
        return moment(date).format("ddd MM/D/YYYY, h:mm a");
    };

    $scope.shiftLength = function(clock_in,clock_out){
        start = moment(clock_in);
        end = moment(clock_out);
        return Math.round(moment.duration(end.diff(start)).asHours() * 100) / 100;
    };

    $scope.fetchTimecards();

    $scope.selectedUser = {_id:-1,title:"All Employees"};

    $scope.selectUser = function(user){
        $scope.selectedUser = user;
        $scope.selectedUser.title = user.first_name + " " + user.last_name;
    };

});


angular.module('team').controller('Team_Timecards_Report_SummaryController', function($scope) {

    $scope.activeReport.report = $scope.reports[0];

    $scope.userHours = function(shifts){
        var hours = 0;

        for(var i = 0; i < shifts.length; i++){
            hours = hours + $scope.shiftLength(shifts[i].clock_in,shifts[i].clock_out);
        }
        return hours;
    };

    $scope.totalHours = function(){
        var hours = 0;
        angular.forEach($scope.reportTimecards,function(value,index){
            hours = hours + $scope.shiftLength(value.clock_in,value.clock_out);
        });

        return hours;
    };

});

angular.module('team').controller('Team_Timecards_Report_ShiftDetailController', function($scope) {

    $scope.activeReport.report = $scope.reports[1];

    $scope.filteredTimecards = function(){

        if($scope.selectedUser._id == -1)
            return $scope.reportTimecards;

        var filtered = [];

        angular.forEach($scope.reportTimecards,function(value,index){
            if($scope.selectedUser._id == value.user._id)
                filtered.push(value);
        });

        return filtered;
    };

    $scope.totalFilteredHours = function(){
        var filtered = $scope.filteredTimecards();
        var hours = 0;
        for(var i = 0; i < filtered.length; i++){
            hours = hours + $scope.shiftLength(filtered[i].clock_in,filtered[i].clock_out);
        }
        return hours;
    };

});


angular.module('team').controller('Team_Timecards_Report_ShiftDetail_EditController', function($scope,$rootScope,$state,$stateParams,utils,timecards,notificate) {

    $scope.timecard =  utils.getObjectById($stateParams.id,$scope.reportTimecards);
    if(!$scope.timecard) {
        $state.go("app.team.timecards.reports.shiftdetail");
        return;
    }

    $('#shiftDetailEdit').addClass('is-visible');


    $scope.hours = 0;
    $scope.editDates = {
        clock_in: {
            date: {
                startDate: $scope.timecard.clock_in,
                endDate: $scope.timecard.clock_in
            },
            time: moment($scope.timecard.clock_in)
        },
        clock_out: {
            date: {
                startDate:  $scope.timecard.clock_out,
                endDate: null
            },
            time: moment($scope.timecard.clock_out)
        }
    };

    $scope.deleteTimecard = function(timecard){
        swal({   title: "Are you sure?",
            text: "This timecard will be lost and gone forever!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            closeOnConfirm: true }, function(){

            timecards.delete(timecard.guid).then(
                function(success){
                    notificate.success("Timecard Deleted!");
                    $('#shiftDetailEdit').removeClass('is-visible');
                },function(error){
                    notificate.error("Oops! We couldn't complete your request.");
                });
            $state.go("app.team.timecards.reports.shiftdetail");

        });
    };

    $scope.updateTimecard = function() {

            //@tmf validate
        timecards.updateTimecard({
                "user": $scope.timecard.user,
                "_id": $scope.timecard._id,
                "guid": $scope.timecard.guid,
                "clock_in": utils.getMomentFromComponents($scope.editDates.clock_in.date, $scope.editDates.clock_in.time).utc().format(),
                "clock_out": utils.getMomentFromComponents($scope.editDates.clock_out.date, $scope.editDates.clock_out.time).utc().format()
            }
        ).then(function(){
                $('#shiftDetailEdit').removeClass('is-visible');

                notificate.success("Timecard Updated!");
                $state.go("app.team.timecards.reports.shiftdetail");
                $scope.updateDate($scope.reportDate.startDate,$scope.reportDate.endDate);
            },
        function(){
            notificate.error("There was an error with your request.");
        });

    }


    $scope.cancelChanges = function(){
        $('#shiftDetailEdit').removeClass('is-visible');
        $state.go("app.team.timecards.reports.shiftdetail");
        $scope.editDates.clock_in.date.endDate = null;
        $scope.editDates.clock_out.date.endDate = null;
    }
    $scope.$watch('[editDates]', function(newDate) {
    
        $scope.hours =  $scope.calculateHours($scope.editDates.clock_in.date,$scope.editDates.clock_in.time,$scope.editDates.clock_out.date,$scope.editDates.clock_out.time);
    }, true);


});