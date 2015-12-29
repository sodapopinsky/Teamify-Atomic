
angular.module('inventory-items',['resources.inventory'])
    .config(function($stateProvider) {
        $stateProvider
            .state('app.inventory.items', {
                url: '/inventoryitems',
                views: {
                    "content": {
                        controller: 'InventoryItemsController',
                        templateUrl:"inventory/inventory-items/inventory-items.tpl.html"
                    }
                }
            })
            .state('app.inventory.items.create', {
                url: "/create",
                views: {
                    "panelContent@app.inventory": {
                        controller: "InventoryItems_CreateController",
                        templateUrl: "inventory/inventory-items/sidepanel/create.tpl.html"
                    }
                }

            })
            .state('app.inventory.items.edit', {
                url: "/:id",
                views: {
                    "editInventoryItemPanel": {
                        controller: "InventoryItems_EditController",
                        templateUrl: "inventory/inventory-items/sidepanel/edit.tpl.html"
                    }
                }
            });

    });

angular.module('inventory-items').controller('InventoryItemsController', function($scope,$state) {

    $scope.printDate = function(dateFromApi){
        var d = new Date(dateFromApi);
        return moment(d).fromNow();
    };

    $scope.goCreateItem = function(){
        $state.go('app.inventory.items.create');
    }

});

angular.module('inventory-items').controller('InventoryItems_CreateController', function($scope,$state,$auth, $rootScope,inventory) {

    $('#addInventoryItemPanel').addClass('is-visible');
    $scope.item = {};

    $scope.cancelCreateItem = function(){
        $state.go('app.inventory.items');
        $('#addInventoryItemPanel').removeClass('is-visible');

    }



    $scope.createItem = function(){

        try {
            inventory.isValid($scope.item)
        }
        catch (error) {
         //   Crash.notificate.error(error);
            return;
        }

        inventory.createItem($scope.item).$promise.then(function (response) {
            var toInsert = response.created;
        //    toInsert.updated_at_from_now = moment(toInsert.updated_at).fromNow();
            inventory.inventory.push(toInsert);
            $state.go('app.inventory.items');
          //  Crash.notificate.success("Item Saved");
            $('#addInventoryItemPanel').removeClass('is-visible');
        }, function (error) {
          //  Crash.notificate.error("There was an error with your request.  Please Try Again.");
        });



    }


});


angular.module('inventory-items').controller('InventoryItems_EditController', function($scope,$state,$stateParams,$auth, $rootScope,inventory,utils) {






    $scope.item = utils.getObjectById($stateParams.id,$scope.inventory);
    if(!$scope.inventory || !$scope.item) {
        $state.go("app.inventory.items");
        return;
    }
    var original =  JSON.parse(JSON.stringify($scope.item));

    $('#editInventoryItemPanel').addClass('is-visible');

    $scope.cancelEditItem = function(){
        $state.go('app.inventory.items');
        var index = utils.indexOf($scope.item,$scope.inventory);
        $scope.inventory[index] = JSON.parse(JSON.stringify(original));
        $('#editInventoryItemPanel').removeClass('is-visible');
    }

    $scope.parType = 'Simple';
    $scope.selectParType = function(type){
        $scope.parType = type;
    }

    //DELETE ITEM
    $scope.deleteItem = function(id){

        swal({   title: "Are you sure?",
            text: "This Item will be permanently removed",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            closeOnConfirm: true }, function(){

            inventory.deleteItem(id).$promise.then(function() {
                var index = utils.indexOf($scope.item,$scope.inventory);
                $scope.inventory.splice(index,1);
              //  utils.notificate.success("Item Deleted Successfully");
                $('#editInventoryItemPanel').removeClass('is-visible');
                $state.go('app.inventory.items');

            }, function(error) {
                console.log(error);
            });
        });
    };

    $scope.updateItem = function(){
        if(!inventory.isValid($scope.item)){
            return;
        }
        inventory.updateItem($scope.item).$promise.then(function (response) {
            original = JSON.parse(JSON.stringify($scope.item));
          //  Crash.notificate.success("Your Changes Have Been Saved","#cd-panel-notification");
        }, function (error) {
            console.log(error);
        });

    }

});
