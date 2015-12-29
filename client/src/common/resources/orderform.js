
(function() {

    'use strict';

    angular
        .module('resources.orderforms',[])
        .factory('orderforms', orderforms);

    function orderforms($resource) {



        var Orderform = $resource("api/orderforms/:id", {}, {
            update: {
                method: 'PUT'

            }
        });



        function updateItem(data) {

            return Orderform.update({id:data._id}, data);
        }
        function deleteItem(id) {
            return Orderform.delete({id:id});
        }

        function createItem(data) {
            return Orderform.save(data);
        }

        function isValid(data){
            if(!data.name) {

                return false;
            }


            return true;
        }
        function all() {
            return Orderform.query();
        }

        return {
            all: all,
            createItem: createItem,
            isValid: isValid,
            updateItem: updateItem,
            deleteItem: deleteItem,
            orderforms: orderforms
        }
    }

})();