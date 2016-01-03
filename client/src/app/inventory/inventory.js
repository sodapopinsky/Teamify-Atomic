angular.module('inventory')

    .config(function($stateProvider){
        $stateProvider
            .state('app.inventory', {
                abstract: true,
                views: {
                    "content@app": {
                        controller: "InventoryController",
                        templateUrl: "inventory/inventory.tpl.html"
                    }
                }
            });
    });


angular.module('inventory').controller('InventoryController', function($scope,$state,$auth, $rootScope, inventory) {

    $scope.projections = [
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000}

    ];

    $scope.inventory = [];

    $scope.fetchInventory = function(){
        $scope.loading = true;
        inventory.all().$promise.then(function(response)
        {
            $scope.loading = false;

            inventory.inventory = response;
            $scope.setAdditionalInventoryProperties();
            $scope.inventory = inventory.inventory;

        }, function (error) {
            $scope.loading = false;

        });

    }
    $scope.fetchInventory();

$scope.setAdditionalInventoryProperties = function(){
console.log("here");
        for(var i = 0; i < inventory.inventory.length; i++){
            var item = inventory.inventory[i];

            item.adjusted_quantity_on_hand = adjustedQuantityOnHand(item);

            item.calculated_par = calculatedPar(item);

            item.popover = {templateUrl: "salesCalculationPopover.html"}

            item.orderQuantity = item.calculated_par.par - item.adjusted_quantity_on_hand;

            if(item.orderQuantity < 0)
                item.orderQuantity = 0;

            if(item.usage_per_thousand)
                item.lasts_until = calculateLastsUntil(item.orderQuantity + item.adjusted_quantity_on_hand, item.usage_per_thousand);

        }
    }

    $scope.printDate = function(dateFromApi){
        var d = new Date(dateFromApi);
        return moment(d).fromNow();
    };

    $scope.incrementOrderQuantity = function(item){
        item.orderQuantity++;
        if(item.usage_per_thousand) {
            item.lasts_until = calculateLastsUntil(item.orderQuantity+ item.adjusted_quantity_on_hand  , item.usage_per_thousand);
        }
    }

    $scope.decrementOrderQuantity = function(item){

        item.orderQuantity--;
        if(item.orderQuantity < 0)
            item.orderQuantity = 0;

        if(item.usage_per_thousand) {
            item.lasts_until = calculateLastsUntil(item.orderQuantity + item.adjusted_quantity_on_hand  , item.usage_per_thousand);
        }
    }



    function calculatedPar(item) {
        response = {};
        if(!item.par_value){
            response.par = item.quantity_on_hand.quantity;
             return response;
        }

        if(item.par_type == 'simple'){
            response.par = item.par_value;

            return response;
        }


        else {
            var days = item.par_value;
            var lastsUntil = moment().add(days,'days');
            sales = salesProjections(moment().add(1,'days'),lastsUntil); //does not include todays sales. should it?

            var par = (item.usage_per_thousand / 1000) * sales;

            response.sales = sales;
            response.par = par;

            return response;
        }

    }



    function calculateLastsUntil(par,usage){
        var day = moment();
        var quantity = par;
        var i = 0;

        while(i < 31) {

            quantity = quantity - (usage / 1000) * $scope.projections[day.day()].projection;

            if(quantity <= 0){
                return day.format("ddd, MM/DD");;
            }
            day.add(1,'days');
            i++;
        }

        return "> 1 Month";
    }

    function salesProjections(start,end) { //includes start and end date amounts

        var i = 0;
        var salesProjection = 0;
        while (i < 100) {
            if (end.isBefore(start, 'day')) {
                break;
            }

            salesProjection = salesProjection + $scope.projections[end.day()].projection;
            end.subtract(1, 'days');
        }
        return salesProjection;
    }


    function adjustedQuantityOnHand(item){

      //  var lastUpdatedMoment =  $scope.momentFromApi(item.updated_at);  //this needs to be a separate field so it does not update for things like name change...
        var lastUpdatedMoment = Date.now();
        var adjustedQuantity = item.quantity_on_hand.quantity;




        var dayPointer = moment();
        var i = 0;

        var done = false;
        while(done == false){

            if(dayPointer.isSame(lastUpdatedMoment,'day')){

                done = true;
                break;

            }


            var dayProjection = $scope.projections[dayPointer.day()];
            var adjustment = (item.usage_per_thousand / 1000) * dayProjection.projection;

            adjustedQuantity = adjustedQuantity - adjustment;


            i++;
            dayPointer.subtract(1, 'days');

            if(adjustedQuantity <= 0){
                adjustedQuantity = 0;
                done = true;
            }

            if(i > 100)
                done = true;

        }


        return adjustedQuantity;
    }


});




