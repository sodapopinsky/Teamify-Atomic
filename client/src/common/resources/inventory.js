
(function() {

    'use strict';

    angular
        .module('resources.inventory',['ngResource'])
        .factory('inventory', inventory);

    function inventory($resource) {

        var inventory =  [];

        // ngResource call to our static data
        var Inventory = $resource('api/inventory/:id', {}, {
            update: {
                method: 'PUT'
            }
        });


        function createItem(data) {
            return Inventory.save(data);
        }

        function deleteItem(id) {
            return Inventory.delete({id:id});
        }


        function updateItem(data) {

            return Inventory.update({id:data._id}, data);
        }

        function all() {


            return Inventory.query();
        }



        function isValid(data){
            if(!data.name) {
                throw "Item Name is Required";
            }
            if(!data.measurement) {
                throw "Measurement Required";
            }
            if(!data.quantity_on_hand.quantity) {
                throw "Quantity Required";
            }

            if(data.quantity_on_hand.quantity) {
                if(isNaN(data.quantity_on_hand.quantity)) {
                    throw "Quantity on hand must be a Number";

                }
            }
            if(data.usage_per_thousand) {
                if(isNaN(data.usage_per_thousand)) {
                    throw "Usage Per Thousand must be a Number";

                }
            }
            if(data.par_value) {
                if (isNaN(data.par_value)) {
                    throw "Par must be a Number";

                }
            }

            return true;
        }
        return {
            all: all,
            createItem: createItem,
            updateItem: updateItem,
            deleteItem: deleteItem,
            isValid: isValid,

            inventory: inventory
        };
    }

})();