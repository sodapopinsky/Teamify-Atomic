
angular.module('inventory')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.inventory.ordering', {
                url: '/inventory/ordering',
                views: {
                    "content": {
                        controller: 'InventoryOrderingController',
                        templateUrl:"inventory/inventory-ordering/inventory-ordering.tpl.html"
                    }
                }
            });

    });




angular.module('inventory').controller('InventoryOrderingController', function($scope,orderforms,$ocModal) {


    $scope.selectedOrderForm = {};

    $scope.orderForms = [];
    $scope.selectedOrderForm =  $scope.orderForms[0];

    orderforms.all().$promise.then(function(response)
    {
        $scope.orderForms = response;
        $scope.selectedOrderForm = response[0];
    }, function (error) {
        console.log(error);
    });

    $scope.selectOrderForm = function(orderForm){
        $scope.selectedOrderForm = orderForm;
    }


    $scope.goCreateOrderForm = function() {


        $ocModal.open({
            id: 'createOrderForm',
            url: 'inventory/inventory-ordering/createForm.tpl.html',
            controller: 'InventoryOrdering_CreateFormController',
            init: {
                inventory: $scope.inventory,
                orderForms: $scope.orderForms,
                selectedOrderForm: $scope.selectedOrderForm
            },
            onClose: function(orderForm) {
                if(orderForm)
                    $scope.selectedOrderForm = orderForm;
            }
        });
    }

    $scope.openModal = function() {
        $ocModal.open({
            url: 'inventory/inventory-ordering/editForm.tpl.html',
            controller: 'InventoryOrdering_EditController',
            init: {
                inventory: $scope.inventory,
                orderForm: $scope.selectedOrderForm
            }
        });
    }

});


angular.module('inventory').controller('InventoryOrdering_CreateFormController', function($scope,$state,orderforms,$ocModal,notificate, utils) {


    $scope.orderFormEditing = {items: [], name:""};
    $scope.inventoryEditing = utils.copy($scope.inventory);

    $scope.saveChanges = function(){
        if(!$scope.orderFormEditing.name) {
           notificate.error("Please Enter a name for the form","#createOrderFormModal");
            return;
        }
        var newForm = utils.copy($scope.orderFormEditing);

        orderforms.createItem(newForm).$promise.then(function (response) {
            $scope.orderForms.push(response);
            $state.go('app.inventory.items');
            notificate.success("Item Saved");
            $('#addInventoryItemPanel').removeClass('is-visible');
        }, function (error) {
            notificate.error("There was an error with your request.  Please Try Again.");
        });
        $ocModal.close(newForm);
    }

    $scope.cancelChanges = function(){
        $ocModal.close();
    }

    $scope.addItem = function(item){
        if(utils.indexOf(item._id,$scope.orderFormEditing.items) == -1) {
            $scope.orderFormEditing.items.push(item._id);
            $scope.selected = ""
        }
    }

    $scope.removeItem = function(item){

        var index = utils.indexOf(item.id,$scope.orderFormEditing.items);

        if(index != -1)
            $scope.orderFormEditing.items.splice(index,1);

    }
});

angular.module('inventory').controller('InventoryOrdering_EditController', function($scope,$state,orderforms,$ocModal, notificate, utils) {

    $scope.orderFormEditing = utils.copy($scope.orderForm);
    $scope.inventoryEditing = utils.copy($scope.inventory);


    $scope.saveChanges = function(){
        /*
        if(!orderforms.isValid($scope.item)){
            return;
        }
        */
        if(!$scope.orderFormEditing.name) {
            notificate.error("Please Enter a name for the form","#createOrderFormModal");
            return;
        }
        orderforms.updateItem($scope.orderFormEditing).$promise.then(function (response) {
          //  original = JSON.parse(JSON.stringify($scope.item));
            notificate.success("Your Changes Have Been Saved","#cd-panel-notification");
        }, function (error) {
            console.log(error);
        });
        var newForm = utils.copy($scope.orderFormEditing);

    }

    $scope.cancelChanges = function(){
        $ocModal.close();
    }

    $scope.addItem = function(item){
        if(utils.indexOf(item._id,$scope.orderFormEditing.items) == -1)
            $scope.orderFormEditing.items.push(item._id);
    }

    $scope.removeItem = function(item){

        var index = utils.indexOf(item._id,$scope.orderFormEditing.items);

        if(index != -1)
            $scope.orderFormEditing.items.splice(index,1);

    }
});