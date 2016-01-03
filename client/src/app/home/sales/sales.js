angular.module('home')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.home.sales', {
                url: '/home/sales',
                views: {
                    "content": {
                        controller: 'Home_SalesController',
                        templateUrl:"home/sales/sales.tpl.html"
                    }
                }
            });

    });



angular.module('home').controller('Home_SalesController', function($scope,organization,projection,$ocModal) {

    organization.getById(1);
    $scope.organizationData = organization.data;
    $scope.organization = organization.data.organization;

    $scope.projection = projection.data;

    projection.getProjectionsForDateRange(moment(),moment());

    $scope.day = moment();

    $scope.selectDay = function(day){
        console.log(day);
    }

    $scope.projectionForDate = function(date){

    var x = 1;
        var i = -1;

         angular.forEach($scope.projection.projections,function(value, index){
            if(moment(value.date).isSame(date,'day'))
                i = index;
            x = 2;
        });


        if(i > -1){
          return $scope.projection.projections[i].projection;}

     return  $scope.organizationData.organization.default_projections[date.weekday()];
    }

    $scope.editDefaultProjection = function(day) {

        $ocModal.open({
            id: 'editDefaultProjection',
            url: 'home/sales/editDefaultProjection.tpl.html',
            controller: 'EditDefaultProjectionController',
            init: {
                day: day,
                projection: $scope.organizationData.organization.default_projections[day]
            },
            onClose: function(orderForm) {
            }
        });
    }

});

angular.module('home').controller('EditDefaultProjectionController',
    function($scope,$state,$ocModal,projection,organization,user) {

console.log($scope.projection);

        $scope.userData = user.data;
        $scope.saveChanges = function(){
            projection.updateDefaultProjections($scope.day,$scope.projection).$promise.then(function(response){
                console.log(response);
            });

        }


    });




