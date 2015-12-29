
(function() {

    'use strict';

    angular
        .module('resources.orderforms',[])
        .factory('orderforms', orderforms);

    function orderforms($resource) {


        var orderforms = [
            {"id":1,"name":"Schneider","created_at":"2015-11-29 19:08:42","updated_at":"2015-11-29 19:08:42","items":
                [9,8]
            }
            ,
            {"id":2,"name":"Restaurant Depot","created_at":"2015-11-29 19:08:42","updated_at":"2015-11-29 19:08:42","items":
                [8,9]
            }

        ];
        // ngResource call to our static data

        var Orderform = $resource("api/orderforms/:id", {}, {
            update: {
                method: 'PUT'
            }
        });



        function updateItem(data) {

            return Orderform.update({id:data.id}, data);
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