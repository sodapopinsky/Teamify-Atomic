angular.module('home')
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.home.sales', {
                url: '/home/sales',
                views: {
                    "content": {
                        controller: 'Home_SalesController',
                        templateUrl: "home/sales/sales.tpl.html"
                    }
                }
            });

    });


angular.module('home').controller('Home_SalesController', function ($scope, organization, projection, $ocModal) {

    $scope.organizationData = organization.data;

    organization.getById(1).$promise.then(function(response){ // @tmf fix id
        organization.data.organization = response[0];

        $scope.getProjections();

    });



   // $scope.organization = organization.data.organization;

    $scope.projection = projection.data;

    $scope.currentMonth = moment();
    $scope.getProjections = function () {
        projection.getProjectionsForDateRange($scope.currentMonth.startOf('month').utc().format(),
            $scope.currentMonth.endOf('month').utc().format()).$promise.then(function (response) {
                projection.data.projections = response;

            });
    };



    $scope.day = moment();

    $scope.selectDay = function (day) {
        console.log(day);
    }

    $scope.customProjection = function (day) {
        $ocModal.open({
            id: 'editCustomProjection',
            url: 'home/sales/editCustomProjection.tpl.html', //
            controller: 'EditCustomProjectionController',
            init: {
                date: day.date,
                projection: $scope.projectionForDay(day)
            },
            onClose: function (needsRefresh) {
                if (needsRefresh) {
                    $scope.getProjections(); //@tmf shouldnt need to hit server for this.  save from response.
                }
            }
        });
    }

    $scope.projectionForWeek = function (week) {

        var total = 0;
        angular.forEach(week.days, function (value) {

              total = total + parseInt(value.projection);
        });

        return total;

    }

    $scope.projectionForDay = function (day) {

        var x = 1;
        var i = -1;

        angular.forEach($scope.projection.projections, function (value, index) {
            if (moment(value.date).isSame(day.date, 'day'))
                i = index;
            x = 2;
        });

        if (i > -1)
            day.projection =  $scope.projection.projections[i].projection
        else
              day.projection =   $scope.organizationData.organization.default_projections[day.date.weekday()];

        return day.projection;
    }

    $scope.editDefaultProjection = function (day) {

        $ocModal.open({
            id: 'editDefaultProjection',
            url: 'home/sales/editDefaultProjection.tpl.html',
            controller: 'EditDefaultProjectionController',
            init: {
                day: day,
                projection: $scope.organizationData.organization.default_projections[day]
            }

        });
    }

});

angular.module('home').controller('EditDefaultProjectionController',
    function ($scope, $state, $ocModal, projection, organization, user) {


        $scope.userData = user.data;
        $scope.saveChanges = function () {
            $scope.loading = true;
            projection.updateDefaultProjections($scope.day, $scope.projection).$promise.then(function (response) {
                $scope.loading = false;

                $ocModal.close(true);
            });

        }


    });


angular.module('home').controller('EditCustomProjectionController',
    function ($scope, $state, $ocModal, projection, organization, user) {

        $scope.userData = user.data;
        $scope.loading = true;
        $scope.saveChanges = function () {
            projection.save({
                organization: $scope.userData.currentUser.organization,
                date: $scope.date.utc().format(),
                projection: $scope.projection
            }).$promise.then(function (response) {
                    $scope.loading = false;
                    $ocModal.close(true);
                });

        }


    });



