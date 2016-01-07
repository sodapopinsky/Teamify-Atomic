
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


//f

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
                orderForms: $scope.orderForms,
                inventory: $scope.inventory,
                orderForm: $scope.selectedOrderForm
            },
            onClose: function(orderForm) {
                if(orderForm)
                    $scope.selectedOrderForm = orderForm;
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
        try {orderforms.isValid($scope.orderFormEditing)}
        catch (error) {
            notificate.error(error);
            return;
        }
        var newForm = utils.copy($scope.orderFormEditing);

        orderforms.createItem(newForm).$promise.then(function (response) {
            $scope.orderForms.push(response.orderform);

            $ocModal.close(response.orderform);
            $('#addInventoryItemPanel').removeClass('is-visible');
        }, function (error) {
            notificate.error("There was an error with your request.  Please Try Again.");
        });

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

        try {orderforms.isValid($scope.orderFormEditing)}
        catch (error) {
            notificate.error(error);
            return;
        }


        orderforms.updateItem($scope.orderFormEditing).$promise.then(function (response) {
            $ocModal.close(response.orderform);
        }, function (error) {
            notificate.error("There was an error with your request","#cd-panel-notification");
        });
        var newForm = utils.copy($scope.orderFormEditing);

    }

    $scope.deleteForm = function(){
        swal({   title: "Are you sure?",
            text: "This Item will be permanently removed",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            closeOnConfirm: true }, function(){






            orderforms.deleteItem($scope.orderFormEditing._id).$promise.then(function() {
                var index = utils.getIndexByAttributeValue($scope.orderForms,'_id',$scope.orderFormEditing._id);
                $scope.orderForms.splice(index,1);
                $ocModal.close($scope.orderForms[0]);
                $('#editInventoryItemPanel').removeClass('is-visible');

            }, function(error) {
                notificate.error("There was an error with your request.");
            });
        });

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