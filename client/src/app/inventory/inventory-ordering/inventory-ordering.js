
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

    console.log($scope.inventory);
    $scope.selectedOrderForm = {};

    $scope.orderForms = orderforms.orderforms;
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
            url: 'views/inventory/ordering/modal.html',
            controller: 'InventoryOrdering_ModalController',
            init: {
                inventory: $scope.inventory,
                orderForm: $scope.selectedOrderForm
            }
        });
    }

});


angular.module('inventory').controller('InventoryOrdering_CreateFormController', function($scope,$state,orderforms,$ocModal, utils) {


    $scope.orderFormEditing = {items: [], name:""};
    $scope.inventoryEditing = utils.copy($scope.inventory);

    $scope.saveChanges = function(){
        if(!$scope.orderFormEditing.name) {
            
            // Crash.notificate.error("Please Enter a name for the form","#createOrderFormModal");
            return;
        }
        var newForm = utils.copy($scope.orderFormEditing);

        $scope.orderForms.push(newForm);

        $ocModal.close(newForm);
    }

    $scope.cancelChanges = function(){
        $ocModal.close();
    }

    $scope.addItem = function(item){
        if(utils.indexOf(item.id,$scope.orderFormEditing.items) == -1) {
            $scope.orderFormEditing.items.push(item.id);
            $scope.selected = ""
        }
    }

    $scope.removeItem = function(item){

        var index = Crash.indexOf(item.id,$scope.orderFormEditing.items);

        if(index != -1)
            $scope.orderFormEditing.items.splice(index,1);

    }
});

angular.module('inventory').controller('InventoryOrdering_ModalController', function($scope,$state,orderforms,$ocModal, Crash) {

    $scope.orderFormEditing = utils.copy($scope.orderForm);
    $scope.inventoryEditing = utils.copy($scope.inventory);

    $scope.saveChanges = function(){
        $scope.orderForm.items = utils.copy($scope.orderFormEditing.items);
        $ocModal.close();
    }

    $scope.cancelChanges = function(){
        $ocModal.close();
    }

    $scope.addItem = function(item){
        if(utils.indexOf(item.id,$scope.orderFormEditing.items) == -1)
            $scope.orderFormEditing.items.push(item.id);
    }

    $scope.removeItem = function(item){

        var index = utils.indexOf(item.id,$scope.orderFormEditing.items);

        if(index != -1)
            $scope.orderFormEditing.items.splice(index,1);

    }
});