
angular.module('inventory')
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

angular.module('inventory').controller('InventoryItemsController', function($scope,$state) {



    $scope.goCreateItem = function(){
        $state.go('app.inventory.items.create');
    }

});

angular.module('inventory').controller('InventoryItems_CreateController', function($scope,$state,$auth,notificate, $rootScope,inventory) {

    $('#addInventoryItemPanel').addClass('is-visible');
    $scope.item = {
        par_type: 'simple'
    };
    $scope.cancelCreateItem = function(){
        $state.go('app.inventory.items');
        $('#addInventoryItemPanel').removeClass('is-visible');

    }

    $scope.selectParType = function(item,type){
        $scope.item.par_type = type;

    }

    $scope.createItem = function(){

        try {
            inventory.isValid($scope.item)
        }
        catch (error) {
            notificate.error(error,"#cd-panel-notification");
            return;
        }

        inventory.createItem($scope.item).$promise.then(function (response) {

            var toInsert = response.item;
            toInsert.updated_at_from_now = moment(toInsert.updated_at).fromNow();
            inventory.inventory.push(toInsert);
            $state.go('app.inventory.items');
          notificate.success("Item Saved");
            $('#addInventoryItemPanel').removeClass('is-visible');
        }, function (error) {
         notificate.error("There was an error with your request.  Please Try Again.");
        });



    }


});


angular.module('inventory').controller('InventoryItems_EditController', function($scope,notificate, $state,$stateParams,$auth, $rootScope,inventory,utils) {


    //@tmf update for quantity needs to be separated from item infromation edit so that updated field is reliable

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

    $scope.parType = 'simple';
    $scope.selectParType = function(item,type){
        $scope.item.par_type = type;

    }

    //DELETE ITEMs
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
                notificate.success("Item Deleted Successfully");
                $('#editInventoryItemPanel').removeClass('is-visible');
                $state.go('app.inventory.items');

            }, function(error) {
                console.log(error);
            });
        });
    };

    $scope.updateItem = function(){
        try {
            inventory.isValid($scope.item)
        }
        catch (error) {
            notificate.error(error,"#cd-panel-notification");
            return;
        }
        inventory.updateItem($scope.item).$promise.then(function (response) {

            original = utils.copy(response.item);
            console.log(original);
            $scope.setAdditionalInventoryProperties();
           notificate.success("Your Changes Have Been Saved","#cd-panel-notification");
        }, function (error) {
            console.log(error);
        });

    }

});
