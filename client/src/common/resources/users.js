
(function() {

    'use strict';

    angular
        .module('resources.users',['ngResource'])
        .factory('user', user);

    function user($resource) {

        // ngResource call to our static data
        var User = $resource('api/users/:id', {}, {
            update: {
                method: 'PUT'
            }
        });

        var users = [];


        function createUser(data) {

            return User.save(data);
        }
        function updateUser(data) {

            return User.update({id: data._id}, data);
        }
        function getUsers() {
            // $promise.then allows us to intercept the results
            // which we will use later
            return User.query();
        }

        function getById(id){
            var result = $.grep(users, function(e){ return e._id == id; });
            return result[0];
        }


        function isValid(user) {

            if (!user.first_name || !user.last_name)
                throw "First and Last Names are required.";

            if (user.pin) {
                if (isNaN(user.pin))
                    throw "PIN must be a number";

                if (user.pin.toString().length != 4)
                    throw "PINs must be 4 digits long.";

            }
        }



        return {
            getUsers: getUsers,
            createUser: createUser,
            updateUser: updateUser,
            getById: getById,
            isValid: isValid
        }
    }

})();