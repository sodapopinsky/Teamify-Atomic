
angular.module('inventory-ordering',['resources.orderforms'])
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




angular.module('inventory-ordering').controller('InventoryOrderingController', function($scope,orderforms) {


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
            url: 'views/inventory/ordering/modals/createForm.html',
            controller: 'Inventory_Ordering_CreateFormController',
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
            controller: 'Inventory_Ordering_ModalController',
            init: {
                inventory: $scope.inventory,
                orderForm: $scope.selectedOrderForm
            }
        });
    }

});