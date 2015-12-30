/*! teamify - v0.0.1 - 2015-12-30
 * Copyright (c) 2015 Nick Spitale;
 * Licensed 
 */
angular.module('app', [
    'ui.router',
    'auth',
    'satellizer',
    'team',
    'inventory',
    'directives.uiSrefActiveIf',
    'directives.loading',
    'filters',
    'utils',
    'notificate',
    'oc.modal',
    'templates.app']);


angular.module('inventory', [
        'resources.inventory',
        'resources.orderforms',
         'ui.bootstrap',
        'resources.sales']);

angular.module('app').run(function($rootScope, $state) {

    // $stateChangeStart is fired whenever the state changes. We can use some parameters
    // such as toState to hook into details about the state as it is changing
    $rootScope.$on('$stateChangeStart', function(event, toState) {

        // Grab the user from local storage and parse it to an object

        var user = JSON.parse(localStorage.getItem('user'));



        // If there is any user data in local storage then the user is quite
        // likely authenticated. If their token is expired, or if they are
        // otherwise not actually authenticated, they will be redirected to
        // the auth state because of the rejected request anyway
        if(user) {

            $rootScope.authenticated = true;

            // Putting the user's data on $rootScope allows
            // us to access it anywhere across the app. Here
            // we are grabbing what is in local storage
            $rootScope.currentUser = user;

            // If the user is logged in and we hit the auth route we don't need
            // to stay there and can send the user to the main state
            if(toState.name === "auth") {

                // Preventing the default behavior allows us to use $state.go
                // to change states
                event.preventDefault();

                // go to the "main" state which in our case is users
                $state.go('app.team.members');
            }
        }

    });


});

angular.module('app').config(function($stateProvider, $locationProvider,$urlRouterProvider,  $authProvider, $httpProvider, $provide) {

    function redirectWhenLoggedOut($q, $injector) {

        return {

            responseError: function(rejection) {

                // Need to use $injector.get to bring in $state or else we get
                // a circular dependency error
                var $state = $injector.get('$state');

                // Instead of checking for a status code of 400 which might be used
                // for other reasons in Laravel, we check for the specific rejection
                // reasons to tell us if we need to redirect to the login state
                var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                // Loop through each rejection reason and redirect to the login
                // state if one is encountered
                angular.forEach(rejectionReasons, function(value, key) {

                    if(rejection.data.error === value) {

                        // If we get a rejection corresponding to one of the reasons
                        // in our array, we know we need to authenticate the user so
                        // we can remove the current user from local storage
                        localStorage.removeItem('user');

                        // Send the user to the auth state so they can login
                        $state.go('auth');
                    }
                });

                return $q.reject(rejection);
            }
        };
    }

    // Setup for the $httpInterceptor
    $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

    // Push the new factory onto the $http interceptor array
    $httpProvider.interceptors.push('redirectWhenLoggedOut');

    $authProvider.loginUrl = '/api/authenticate';
    // Satellizer configuration that specifies which API
    // route the JWT should be retrieved from


    // Redirect to the auth state if any other states
    // are requested other than users
    $urlRouterProvider.otherwise('/auth');


    //
    // Now set up the states
    $stateProvider

        .state('app', {
            abstract: true,
            views: {
                "mainContent": {
                    controller: "AppController",
                    templateUrl: "index.tpl.html"
                }
            }
        });
});



angular.module('app').controller('AppController', function() {






});


angular.module('auth', ['ui.router', 'satellizer']);

angular.module('auth').config(function($stateProvider, $authProvider) {

    $authProvider.loginUrl = '/api/authenticate';

    $stateProvider.state('auth', {
        url: '/auth',
        templateUrl:"auth/auth.tpl.html",
        controller:'AuthController as auth'

    })
    .state('logout', {
            url: '/logout',

            controller: function($scope,$auth,$rootScope,$state) {

                $auth.logout().then(function() {

                    // Remove the authenticated user from local storage
                    localStorage.removeItem('user');

                    // Flip authenticated to false so that we no longer
                    // show UI elements dependant on the user being logged in
                    $rootScope.authenticated = false;

                    // Remove the current user info from rootscope
                    $rootScope.currentUser = null;

                    $state.go('auth');
                });
            }
        });

})

.controller('AuthController', function($auth, $state, $http, $rootScope) {


            var vm = this;
            vm.email = "joe@theatomicburger.com";
            vm.password = "password";

            vm.login = function() {

                var credentials = {
                    email: vm.email,
                    password: vm.password,
                    name: vm.name
                };


                $auth.login(credentials).then(function(response) {
                    // Return an $http request for the now authenticated
                    // user so that we can flatten the promise chainf


                       // Stringify the returned data to prepare it
                       // to go into local storage
                       var user = JSON.stringify(response.data.user);

                       // Set the stringified user data into local storage
                       localStorage.setItem('user', user);

                       // The user's authenticated state gets flipped to
                       // true so we can now show parts of the UI that rely
                       // on the user being logged in
                       $rootScope.authenticated = true;

                       // Putting the user's data on $rootScope allows
                       // us to access it anywhere across the app
                       $rootScope.currentUser = response.data.user;

                       // Everything worked out so we can now redirect to
                       // the users state to view the data
                         $state.go('app.team.members');

                    // Handle errors
                }, function(error) {
                    vm.loginError = true;
                    vm.loginErrorText = error.data.error;
                    // Because we returned the $http.get request in the $auth.login
                    // promise, we can chain the next promise to the end here
                });
            };



    });

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
            original = JSON.parse(JSON.stringify($scope.item));
           notificate.success("Your Changes Have Been Saved","#cd-panel-notification");
        }, function (error) {
            console.log(error);
        });

    }

});


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
console.log("forms" + $scope.orderForms);
    $scope.orderFormEditing = utils.copy($scope.orderForm);
    $scope.inventoryEditing = utils.copy($scope.inventory);

    console.log("forms" + $scope.orderForms);
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
angular.module('inventory')

    .config(function($stateProvider){
        $stateProvider
            .state('app.inventory', {
                abstract: true,
                views: {
                    "content@app": {
                        controller: "InventoryController",
                        templateUrl: "inventory/inventory.tpl.html"
                    }
                }
            });
    });


angular.module('inventory').controller('InventoryController', function($scope,$state,$auth, $rootScope, inventory, sales) {

    $scope.projections = [
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000},
        {"projection":1000}

    ];

    $scope.inventory = [];

    $scope.fetchInventory = function(){
        $scope.loading = true;
        inventory.all().$promise.then(function(response)
        {
            $scope.loading = false;

            inventory.inventory = response;
            setAdditionalInventoryProperties();
            $scope.inventory = inventory.inventory;

        }, function (error) {
            $scope.loading = false;

        });

    }
    $scope.fetchInventory();


    function setAdditionalInventoryProperties(){

        for(var i = 0; i < inventory.inventory.length; i++){
            var item = inventory.inventory[i];

            item.adjusted_quantity_on_hand = adjustedQuantityOnHand(item);

            item.calculated_par = calculatedPar(item);

            item.popover = {templateUrl: "salesCalculationPopover.html"}

            item.orderQuantity = item.calculated_par.par - item.adjusted_quantity_on_hand;

            if(item.orderQuantity < 0)
                item.orderQuantity = 0;

            if(item.usage_per_thousand)
                item.lasts_until = calculateLastsUntil(item.orderQuantity + item.adjusted_quantity_on_hand, item.usage_per_thousand);

        }
    }

    $scope.printDate = function(dateFromApi){
        var d = new Date(dateFromApi);
        return moment(d).fromNow();
    };

    $scope.incrementOrderQuantity = function(item){
        item.orderQuantity++;
        if(item.usage_per_thousand) {
            item.lasts_until = calculateLastsUntil(item.orderQuantity+ item.adjusted_quantity_on_hand  , item.usage_per_thousand);
        }
    }

    $scope.decrementOrderQuantity = function(item){

        item.orderQuantity--;
        if(item.orderQuantity < 0)
            item.orderQuantity = 0;

        if(item.usage_per_thousand) {
            item.lasts_until = calculateLastsUntil(item.orderQuantity + item.adjusted_quantity_on_hand  , item.usage_per_thousand);
        }
    }



    function calculatedPar(item) {
        response = {};
        if(!item.par_value){
            response.par = item.quantity_on_hand.quantity;
             return response;
        }

        if(item.par_type == 'simple'){
            response.par = item.par_value;

            return response;
        }


        else {
            var days = item.par_value;
            var lastsUntil = moment().add(days,'days');
            sales = salesProjections(moment().add(1,'days'),lastsUntil); //does not include todays sales. should it?

            var par = (item.usage_per_thousand / 1000) * sales;

            response.sales = sales;
            response.par = par;

            return response;
        }

    }



    function calculateLastsUntil(par,usage){
        var day = moment();
        var quantity = par;
        var i = 0;

        while(i < 31) {

            quantity = quantity - (usage / 1000) * $scope.projections[day.day()].projection;

            if(quantity <= 0){
                return day.format("ddd, MM/DD");;
            }
            day.add(1,'days');
            i++;
        }

        return "> 1 Month";
    }

    function salesProjections(start,end) { //includes start and end date amounts

        var i = 0;
        var salesProjection = 0;
        while (i < 100) {
            if (end.isBefore(start, 'day')) {
                break;
            }

            salesProjection = salesProjection + $scope.projections[end.day()].projection;
            end.subtract(1, 'days');
        }
        return salesProjection;
    }


    function adjustedQuantityOnHand(item){

      //  var lastUpdatedMoment =  $scope.momentFromApi(item.updated_at);  //this needs to be a separate field so it does not update for things like name change...
        var lastUpdatedMoment = Date.now();
        var adjustedQuantity = item.quantity_on_hand.quantity;




        var dayPointer = moment();
        var i = 0;

        var done = false;
        while(done == false){

            if(dayPointer.isSame(lastUpdatedMoment,'day')){

                done = true;
                break;

            }


            var dayProjection = $scope.projections[dayPointer.day()];
            var adjustment = (item.usage_per_thousand / 1000) * dayProjection.projection;

            adjustedQuantity = adjustedQuantity - adjustment;


            i++;
            dayPointer.subtract(1, 'days');

            if(adjustedQuantity <= 0){
                adjustedQuantity = 0;
                done = true;
            }

            if(i > 100)
                done = true;

        }


        return adjustedQuantity;
    }


});





angular.module('team-members', ['resources.users'])
.config(function($stateProvider) {
    $stateProvider
        .state('app.team.members', {
            url: '/teammembers',
            views: {
                "content": {
                    controller: 'TeamMembersController',
                    templateUrl:"team/team-members/team-members.tpl.html"
                }
            }
        });

});



angular.module('team-members').controller('TeamMembersController', function($scope,user) {

    $scope.users = [];

    $scope.status = {value:1, title:'Active'};


    $scope.statusTitle = function(status){
        if(status === 1)
            return 'Active';
        if(status === 0)
            return 'Terminated';
    };


    $scope.statusFilter = function (data) {
        if (data.status === $scope.status.value) {
            return true;
        }
        return false;
    };

    $scope.filterByStatus = function(status){
        $scope.status.title = $scope.statusTitle(status);
        $scope.status.value = status;
    };

    $scope.setActive = function(user){
        $scope.panelContent = 'team/team-members/sidepanel/edit.tpl.html';
        $('.cd-panel').addClass('is-visible');
        $scope.activeUser = user;
        $scope.staleUser = JSON.parse(JSON.stringify(user));

    };


    user.getUsers().$promise.then(
        function(response){
            $scope.users = response;
        }
    );

    $scope.goCreateNewEmployee = function(){
        $scope.activeUser = {};
        $scope.panelContent = 'team/team-members/sidepanel/new_employee.tpl.html';
        $('.cd-panel').addClass('is-visible');
    };

    $scope.cancelChanges = function(){

        if($scope.activeUser.id) {
            $scope.activeUser = $scope.staleUser;
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].id === $scope.activeUser.id) {
                    $scope.users[i] = $scope.activeUser;
                    break;
                }
            }

        }
        $('.cd-panel').removeClass('is-visible');
    };


    $scope.updateUser = function() {

        console.log("Fa" + $scope.activeUser);

        try {user.isValid($scope.activeUser);}
        catch (error) {
            Crash.notificate.error(error);
            return;
        }



        // Update the time entry and then refresh the list
        user.updateUser($scope.activeUser).$promise.then(function(success) {
            console.log("Fa" + $scope.activeUser);
            $scope.staleUser = $scope.activeUser;
          //  Crash.notificate.success("Your Changes Have Been Saved");
        }, function(error) {
            console.log(error);
        });

    };

    $scope.createUser = function() {

        try {
            user.isValid($scope.activeUser);
        }
        catch (error) {
          //  Crash.notificate.error(error);
            return;
        }

        user.createUser({
            "first_name": $scope.activeUser.first_name,
            "last_name": $scope.activeUser.last_name,
            "pin": parseInt($scope.activeUser.pin)
        }).$promise.then(function (createdId) {
                user.getUsers().$promise.then(function(results) {
                    $scope.users = results;
                    $('.cd-panel').removeClass('is-visible');

                    //c$scope.setActive($scope.getUserById(createdId.id));
                }, function(error) { // Check for errors
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });
    };

    $scope.terminateUser = function(user) {

        swal({   title: "Are you sure?",
            text: "This employee will be made inactive, but may be reactived at any point.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            closeOnConfirm: true }, function(){

            $scope.activeUser.status = 0;
            $scope.updateUser();


        });
    };

    $scope.reactivateUser = function() {

        swal({   title: "Are you sure?",
            text: "This employee will be re-activated.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirm",
            closeOnConfirm: true }, function(){

            $scope.activeUser.status = 1;
            $scope.updateUser();


        });



    };


});

angular.module('team', ['team-members'])

.config(function($stateProvider){

        $stateProvider
            .state('app.team', {
            abstract: true,
            views: {
                "content@app": {
                    templateUrl: "team/team.tpl.html"
                }
            }
        });
    });


angular.module('directives.loading',[]).directive('loading', function () {
        return {
            restrict: 'E',
            replace:true,
            template: '<div class="center-block text-center"><img src="img/spinner.gif" style="width:30px; height:30px;"></div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                    { $(element).show(); }
                    else
                    {  $(element).hide(); }
                });
            }
        };
    });
angular.module('directives.uiSrefActiveIf',[]).directive('uiSrefActiveIf', ['$state', function($state) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var state = $attrs.uiSrefActiveIf;

            function update() {
                if ( $state.includes(state) || $state.is(state) ) {
                    $element.addClass("active");
                } else {
                    $element.removeClass("active");
                }
            }

            $scope.$on('$stateChangeSuccess', update);
            update();
        }]
    };
}]);



var mod = angular.module('filters',[]);

mod.filter('inArray', function() {
    return function(array,items) {
        return array.filter(function(item) {
            if(items) {
                if (items.indexOf(item._id) != -1) {
                    return true;
                }
            }
            return false;
        });
    };
});

mod.filter('zeroFloor', function() {
    return function(input) {
        if(input < 0)
            return 0;
        return input;

    };
});

angular.module('notificate',[])

    .factory('notificate', function() {

        var factory = {};

        factory.success = function(notifyText,selector) {

            if(!selector)
                selector = 'body';

            $("#footer_notification").remove();
            $(selector).append($("<div id='footer_notification' class='notificate notificate-success'></div>"));
            $("#footer_notification").html(notifyText);
            $("#footer_notification").hide();
            $("#footer_notification").slideToggle(250);
            $("#footer_notification").delay('2500').slideToggle('slow', function() {
                $("#footer_notification").remove();
            });
        }
        factory.error= function(notifyText,selector) {
            if(!selector)
                selector = 'body';
            $("#footer_notification").remove();
            $(selector).append($("<div id='footer_notification' class='notificate notificate-error'></div>"));
            $("#footer_notification").html(notifyText);
            $("#footer_notification").hide();
            $("#footer_notification").slideToggle(250);
            $("#footer_notification").delay('2500').slideToggle('slow', function() {
                $("#footer_notification").remove();

            });
        }
        return factory;
    });

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

        function isValid(data) {
            if (!data.name)
                throw "Order Form Name is required";

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

(function() {

    'use strict';

    angular
        .module('resources.sales',[])
        .factory('sales', sales);

    function sales($resource) {



        // ngResource call to our static data
        var Sales = $resource('api/sales/:id', {}, {
            update: {
                method: 'PUT'
            }
        });


        function dailySalesForPeriod() {
            return Sales.query();
        }


        function weeklyProjections(){



            return $resource('api/sales/projections.json', {}, {}).query().$promise.then(function (response) {
                return  [
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000},
                    {"projection":1000}

                ];
                return response;
            }, function (error) {
                console.log(error);
            });

        }


        return {
            dailySalesForPeriod: dailySalesForPeriod,
            weeklyProjections: weeklyProjections
        }
    }

})();

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
            var result = $.grep(users, function(e){ return e._id === id; });
            return result[0];
        }


        function isValid(user) {

            if (!user.first_name || !user.last_name)
                throw "First and Last Names are required.";

            if (user.pin) {
                if (isNaN(user.pin))
                    throw "PIN must be a number";

                if (user.pin.toString().length !== 4)
                    throw "PINs must be 4 digits long.";

            }
        }



        return {
            getUsers: getUsers,
            createUser: createUser,
            updateUser: updateUser,
            getById: getById,
            isValid: isValid
        };
    }

})();

angular.module('utils',[])

.factory('utils', function() {

        var factory = {};

        factory.getTimestampFromComponents = function(date,time){
            var d = moment(date).startOf('day');
            var t = moment(time);
            d.hour(t.hour()).minute(t.minute());

            return d;
        }



        factory.getObjectByAttributeValue = function(array, attributeName, attributeValue){

            var obj = null;
            angular.forEach(array,function(value, index){
                console.log(index);
                var property = 'value.' + attributeName;

                if(attributeValue == eval(property)){
                    obj = value;
                    return;
                }
            });
            return obj;
        }


        //redundant from above
        factory.getObjectById = function(id,array){
            var item;
            angular.forEach(array,function(value,index){
                if(id == value._id) {
                    item = value;
                }
            });
            return item;
        }

        factory.getIndexByAttributeValue = function(array, attributeName, attributeValue){

            var i = null;
          angular.forEach(array,function(value, index){
                console.log(index);
                var property = 'value.' + attributeName;

                if(attributeValue == eval(property)){
                    i = index;
                    return;
                }
            });
            return i;
        }

        factory.inArray = function(item,array) {
            if($.inArray(item, array) == -1)
                return false;

            return true;
        }

        factory.indexOf = function(item,array) {
            return $.inArray(item, array);
        }



        factory.copy =   function(item){
            return JSON.parse(JSON.stringify(item));
        }

        return factory;
});
angular.module('mongolabResource', []).factory('mongolabResource', ['MONGOLAB_CONFIG','$http', '$q', function (MONGOLAB_CONFIG, $http, $q) {

  function MongolabResourceFactory(collectionName) {

    var url = MONGOLAB_CONFIG.baseUrl + MONGOLAB_CONFIG.dbName + '/collections/' + collectionName;
    var defaultParams = {};
    if (MONGOLAB_CONFIG.apiKey) {
      defaultParams.apiKey = MONGOLAB_CONFIG.apiKey;
    }
    
    var thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray) {
      var scb = successcb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result;
        if (isArray) {
          result = [];
          for (var i = 0; i < response.data.length; i++) {
            result.push(new Resource(response.data[i]));
          }
        } else {
          //MongoLab has rather peculiar way of reporting not-found items, I would expect 404 HTTP response status...
          if (response.data === " null "){
            return $q.reject({
              code:'resource.notfound',
              collection:collectionName
            });
          } else {
            result = new Resource(response.data);
          }
        }
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        ecb(undefined, response.status, response.headers, response.config);
        return undefined;
      });
    };

    var Resource = function (data) {
      angular.extend(this, data);
    };

    Resource.all = function (cb, errorcb) {
      return Resource.query({}, cb, errorcb);
    };

    Resource.query = function (queryJson, successcb, errorcb) {
      var params = angular.isObject(queryJson) ? {q:JSON.stringify(queryJson)} : {};
      var httpPromise = $http.get(url, {params:angular.extend({}, defaultParams, params)});
      return thenFactoryMethod(httpPromise, successcb, errorcb, true);
    };

    Resource.getById = function (id, successcb, errorcb) {
      var httpPromise = $http.get(url + '/' + id, {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.getByIds = function (ids, successcb, errorcb) {
      var qin = [];
      angular.forEach(ids, function (id) {
         qin.push({$oid: id});
      });
      return Resource.query({_id:{$in:qin}}, successcb, errorcb);
    };

    //instance methods

    Resource.prototype.$id = function () {
      if (this._id && this._id.$oid) {
        return this._id.$oid;
      }
    };

    Resource.prototype.$save = function (successcb, errorcb) {
      var httpPromise = $http.post(url, this, {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$update = function (successcb, errorcb) {
      var httpPromise = $http.put(url + "/" + this.$id(), angular.extend({}, this, {_id:undefined}), {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$remove = function (successcb, errorcb) {
      var httpPromise = $http['delete'](url + "/" + this.$id(), {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
      if (this.$id()) {
        return this.$update(updatecb, errorUpdatecb);
      } else {
        return this.$save(savecb, errorSavecb);
      }
    };

    return Resource;
  }
  return MongolabResourceFactory;
}]);

angular.module('templates.app', ['auth/auth.tpl.html', 'index.tpl.html', 'inventory/inventory-items/inventory-items.tpl.html', 'inventory/inventory-items/sidepanel/create.tpl.html', 'inventory/inventory-items/sidepanel/edit.tpl.html', 'inventory/inventory-ordering/createForm.tpl.html', 'inventory/inventory-ordering/editForm.tpl.html', 'inventory/inventory-ordering/inventory-ordering.tpl.html', 'inventory/inventory.tpl.html', 'team/team-members/sidepanel/edit.tpl.html', 'team/team-members/sidepanel/new_employee.tpl.html', 'team/team-members/team-members.tpl.html', 'team/team.tpl.html']);

angular.module("auth/auth.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("auth/auth.tpl.html",
    "<div class=\"container\" >\n" +
    "    <img src=\"/img/checkLogoBig.png\"  class=\"img-responsive center-block voffset7\" />\n" +
    "    <div class=\"text-center voffset4\"><h1>Log in to your account</h1></div>\n" +
    "    <div class=\"form-group text-red text-center voffset4\" style=\"display:none;\">\n" +
    "        That account was not found.  Please Try Again.\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-4 center-block voffset5\" style=\"float:none;\">\n" +
    "        <form class=\"form-horizontal\">\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"email\"  class=\"tmf-form-control\" placeholder=\"Email\" ng-model=\"auth.email\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"password\" placeholder=\"Password\"  class=\"tmf-form-control\"  ng-model=\"auth.password\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group voffset2\">\n" +
    "\n" +
    "                <a href=\"\" class=\"pull-right\" style=\"font-size:13px;\">Forgot your password?</a>\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"form-group voffset5\">\n" +
    "                <div>\n" +
    "                    <button class=\" tmf-form-control btn btn-primary btn-caps\" ng-click=\"auth.login()\">LOG IN</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("index.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("index.tpl.html",
    "<div id=\"sidebar-wrapper\">\n" +
    "    <div id=\"sidebar-user\">\n" +
    "       <!-- <span class=\"glyphicon glyphicon-comment\"></span> -->\n" +
    "        <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "        <div class=\"collapse navbar-collapse pull-left\" id=\"bs-example-navbar-collapse-1\">\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "                <li><div class=\"avatar\">{{currentUser.first_name.slice(0,1)}}{{currentUser.last_name.slice(0,1)}}</div></li>\n" +
    "                <li class=\"dropdown\">\n" +
    "                    <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                       aria-expanded=\"false\"><span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li> <a ui-sref=\"logout\">Logout</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div><!-- /.navbar-collapse -->\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "    <ul class=\"sidebar-nav\">\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.team\" ui-sref=\"app.team.members\">\n" +
    "                <span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span><p>TEAM</p></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.inventory\" ui-sref=\"app.inventory.items\">\n" +
    "                <span class=\"glyphicon glyphicon-list-alt\" aria-hidden=\"true\"></span><p>INVENTORY</p></a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"wrapper\">\n" +
    "    <div ui-view =\"content\" ></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("inventory/inventory-items/inventory-items.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("inventory/inventory-items/inventory-items.tpl.html",
    "\n" +
    "<div>\n" +
    "\n" +
    "    <div class=\"btn btn-primary  pull-right\"  ng-click=\"goCreateItem()\">New Item</div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-4\">\n" +
    "            <div class=\"form-group has-feedback \" style=\"margin:0px; \" >\n" +
    "                <input class=\"tmf-form-control\" type=\"text\" placeholder=\"Search List\" ng-model=\"searchText\">\n" +
    "                <span class=\"glyphicon glyphicon-search form-control-feedback\" style=\"margin-right:10px;\"></span>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <hr class=\"voffset3\">\n" +
    "\n" +
    "\n" +
    "    <table class=\"table table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th class=\"col-sm-4\">Item</th>\n" +
    "            <th class=\"col-sm-2 text-center\">Last Updated</th>\n" +
    "            <th class=\"col-sm-2 text-center\">Quantity On Hand <br>(Last Updated)</th>\n" +
    "            <th class=\"col-sm-2 text-center\">Quantity On Hand<br> (Usage Adjusted)</th>\n" +
    "\n" +
    "            <th></th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"item in inventory | filter:searchText\" ui-sref=\"app.inventory.items.edit({id: item._id})\">\n" +
    "            <td class=\"col-sm-4\" style=\"line-height:5px;\">\n" +
    "                <div><h5>{{item.name}}</h5></div>\n" +
    "                <div class=\"text-secondary\" style=\"font-size:12px;\">{{item.measurement}}</div>\n" +
    "            </td>\n" +
    "            <td class=\"col-sm-3 text-center\"  >\n" +
    "                {{printDate(item.quantity_on_hand.updated_at)}}\n" +
    "            </td>\n" +
    "\n" +
    "            <td class=\"col-sm-3 text-secondary text-center\"  >\n" +
    "                {{item.quantity_on_hand.quantity}}\n" +
    "            </td>\n" +
    "\n" +
    "            <td class=\"col-sm-3 text-center\"  >\n" +
    "                <div>{{item.usage_per_thousand > 0 ? item.adjusted_quantity_on_hand : 'Usage Not Set'}}</div>\n" +
    "\n" +
    "            </td>\n" +
    "\n" +
    "            <td ><span class=\"glyphicon glyphicon-menu-right pull-right\"></span></td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "<loading class=\"voffset8\"></loading>\n" +
    "\n" +
    "<div class=\"cd-panel from-right\" id=\"editInventoryItemPanel\">\n" +
    "    <div class=\"cd-panel-container\">\n" +
    "        <div ui-view=\"editInventoryItemPanel\"></div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("inventory/inventory-items/sidepanel/create.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("inventory/inventory-items/sidepanel/create.tpl.html",
    "\n" +
    "\n" +
    "<div class=\"cd-panel-content\">\n" +
    "\n" +
    "    <div class=\"cd-panel-nav\">\n" +
    "\n" +
    "\n" +
    "        <div class=\" navbar-brand\">Create Inventory Item</div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <form>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-12\">\n" +
    "                <label for=\"name\">Item Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"name\" ng-model=\"item.name\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"measurement\">Measurement (ex: \"Case\")</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"measurement\" ng-model=\"item.measurement\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"quantity_on_hand\">Quantity On Hand</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"quantity_on_hand\" ng-model=\"item.quantity_on_hand.quantity\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"usage_per_thousand\">Usage Per Thousand</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"usage_per_thousand\" ng-model=\"item.usage_per_thousand\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-3\">\n" +
    "\n" +
    "\n" +
    "                <label for=\"par_type\">Par Type</label>\n" +
    "                <div  id=\"par_type\">\n" +
    "                    <ul class=\"nav navbar-nav\">\n" +
    "                        <li class=\"tmf-dropdown\">\n" +
    "                            <a  class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                                aria-expanded=\"false\">{{item.par_type}}<span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                            <ul  class=\"dropdown-menu\" >\n" +
    "\n" +
    "\n" +
    "                                <li ng-click=\"selectParType(item,'simple')\">\n" +
    "                                    <a >Simple</a>\n" +
    "                                </li>\n" +
    "                                <li ng-click=\"selectParType(item,'dynamic')\">\n" +
    "                                    <a >Dynamic</a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-3\">\n" +
    "                <label for=\"par_value\">Par Value</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"par_value\" ng-model=\"item.par_value\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-6 voffset4\">\n" +
    "\n" +
    "                <div ng-if=\"item.par_type == 'simple'\">Units</div>\n" +
    "                <div ng-if=\"item.par_type  == 'dynamic'\">Days</div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "\n" +
    "    <div class=\"cd-panel-notification\" id=\"cd-panel-notification\"></div>\n" +
    "\n" +
    "    <div class=\"cd-panel-footer\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary pull-right\" ng-click=\"createItem()\">Save</button>\n" +
    "        <button class=\"btn btn-default btn-default pull-right\" ng-click=\"cancelCreateItem()\">Cancel</button>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("inventory/inventory-items/sidepanel/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("inventory/inventory-items/sidepanel/edit.tpl.html",
    "\n" +
    "\n" +
    "<div class=\"cd-panel-content\">\n" +
    "\n" +
    "\n" +
    "    <div class=\"cd-panel-nav\">\n" +
    "        <div class=\"pull-right\" style=\"position:relative;  right:10px;\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ng-click=\"deleteItem(item._id)\">\n" +
    "                <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\" navbar-brand\">{{item.name}}</div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <form>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-12\">\n" +
    "                <label for=\"name\">Item Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"name\" ng-model=\"item.name\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"measurement\">Measurement (ex: \"Case\")</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"measurement\" ng-model=\"item.measurement\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"quantity_on_hand\">Quantity On Hand</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"quantity_on_hand\" ng-model=\"item.quantity_on_hand.quantity\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"usage_per_thousand\">Usage Per Thousand</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"usage_per_thousand\" ng-model=\"item.usage_per_thousand\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-3\">\n" +
    "\n" +
    "\n" +
    "                <label for=\"par_type\">Par Type</label>\n" +
    "                <div  id=\"par_type\">\n" +
    "                    <ul class=\"nav navbar-nav\">\n" +
    "                        <li class=\"tmf-dropdown\">\n" +
    "                            <a  class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                                aria-expanded=\"false\">{{item.par_type}}<span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                            <ul  class=\"dropdown-menu\" >\n" +
    "\n" +
    "\n" +
    "                                <li ng-click=\"selectParType(item,'simple')\">\n" +
    "                                    <a >Simple</a>\n" +
    "                                </li>\n" +
    "                                <li ng-click=\"selectParType(item,'dynamic')\">\n" +
    "                                    <a >Dynamic</a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "             </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-3\">\n" +
    "                <label for=\"par_value\">Par Value</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"par_value\" ng-model=\"item.par_value\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-6 voffset4\">\n" +
    "\n" +
    "              <div ng-if=\"item.par_type == 'simple'\">Units</div>\n" +
    "                <div ng-if=\"item.par_type  == 'dynamic'\">Days</div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"cd-panel-notification\" id=\"cd-panel-notification\"></div>\n" +
    "    <div class=\"cd-panel-footer\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary pull-right\" ng-click=\"updateItem()\">Save</button>\n" +
    "        <button class=\"btn btn-default btn-default pull-right\" ng-click=\"cancelEditItem()\">Cancel</button>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("inventory/inventory-ordering/createForm.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("inventory/inventory-ordering/createForm.tpl.html",
    "<div style=\"height:400px; \" id=\"createOrderFormModal\">\n" +
    "    <nav class=\"navbar navbar-default\" style=\"margin-bottom:0px;\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "            <div class=\"navbar-header col-sm-8\" >\n" +
    "                <input type=\"text\" class=\"form-control  \" style=\"background:none; border:none; margin-top:10px; \" placeholder=\"Order Form Name\" ng-model=\"orderFormEditing.name\">\n" +
    "            </div>\n" +
    "            <button type=\"button\" ng-click=\"saveChanges()\" class=\"btn btn-primary  navbar-right navbar-btn\"\n" +
    "                    style=\"margin-right:5px;\">Save</button>\n" +
    "            <button type=\"button\" ng-click=\"cancelChanges()\" style=\"margin-right:5px;\" class=\"btn btn-default navbar-right\n" +
    "        navbar-btn\">Cancel</button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <hr>\n" +
    "\n" +
    "    <div style=\"padding:5px;\" class=\"background-secondary\">\n" +
    "\n" +
    "        <input type=\"text\" ng-model=\"selected\" uib-typeahead=\"item as item.name  for item in inventoryEditing\n" +
    "                 | filter:$viewValue | limitTo:8\"\n" +
    "               class=\"form-control \" id=\"itemDropdown\"\n" +
    "               typeahead-on-select=\"addItem($item)\"\n" +
    "               placeholder=\"Add Inventory Items...\">\n" +
    "    </div>\n" +
    "    <hr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <table class=\"table\">\n" +
    "\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"item in inventoryEditing | inArray:orderFormEditing.items\" >\n" +
    "            <td>{{item.name}}</td>\n" +
    "            <td>\n" +
    "                <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"removeItem(item)\">\n" +
    "                    <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n" +
    "                </button>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("inventory/inventory-ordering/editForm.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("inventory/inventory-ordering/editForm.tpl.html",
    "<div style=\"height:400px; \">\n" +
    "\n" +
    "    <nav class=\"navbar navbar-default\" style=\"margin-bottom:0px;\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "            <div class=\"navbar-header\">\n" +
    "                <a class=\"navbar-brand\" >{{orderFormEditing.name}}</a>\n" +
    "            </div>\n" +
    "            <button type=\"button\" class=\"btn btn-default navbar-right\n" +
    "        navbar-btn\" ng-click=\"deleteForm()\">\n" +
    "                <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n" +
    "            </button>\n" +
    "\n" +
    "            <button type=\"button\" ng-click=\"saveChanges()\" class=\"btn btn-primary  navbar-right navbar-btn\"\n" +
    "                    style=\"margin-right:5px;\">Save</button>\n" +
    "            <button type=\"button\" ng-click=\"cancelChanges()\" style=\"margin-right:5px;\" class=\"btn btn-default navbar-right\n" +
    "        navbar-btn\">Cancel</button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <hr>\n" +
    "\n" +
    "    <div style=\"padding:5px;\" class=\"background-secondary\">\n" +
    "\n" +
    "        <input type=\"text\" ng-model=\"selected\" uib-typeahead=\"item as item.name  for item in inventoryEditing\n" +
    "                 | filter:$viewValue | limitTo:8\"\n" +
    "               class=\"form-control \" id=\"itemDropdown\"\n" +
    "               typeahead-on-select=\"addItem($item)\"\n" +
    "               placeholder=\"Add Inventory Items...\">\n" +
    "    </div>\n" +
    "    <hr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <table class=\"table\">\n" +
    "\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"item in inventoryEditing | inArray:orderFormEditing.items\" >\n" +
    "            <td>{{item.name}}</td>\n" +
    "            <td>\n" +
    "                <button type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"removeItem(item)\">\n" +
    "                    <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n" +
    "                </button>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("inventory/inventory-ordering/inventory-ordering.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("inventory/inventory-ordering/inventory-ordering.tpl.html",
    "<nav class=\"navbar\">\n" +
    "    <ul class=\"nav navbar-nav\">\n" +
    "        <li class=\"tmf-dropdown\">\n" +
    "            <a  class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                aria-expanded=\"false\">{{selectedOrderForm.name}}<span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "            <ul  class=\"dropdown-menu\" >\n" +
    "                <li ng-repeat=\"orderForm in orderForms\">\n" +
    "                    <a ng-click=\"selectOrderForm(orderForm)\">{{orderForm.name}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "\n" +
    "    <button type=\"button\" ng-click=\"goCreateOrderForm()\" class=\"btn btn-primary  navbar-right navbar-btn\"\n" +
    "            style=\"margin-right:5px;\">New Order Form</button>\n" +
    "\n" +
    "    <button type=\"button\" ng-click=\"openModal()\" class=\"btn btn-default  navbar-right navbar-btn\"\n" +
    "            style=\"margin-right:5px;\">Edit Form</button>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</nav>\n" +
    "<hr>\n" +
    "\n" +
    "\n" +
    "<table class=\"table\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th class=\"col-sm-3\">Item</th>\n" +
    "        <th class=\"col-sm-2  text-center\">Last Updated<br>Quantity</th>\n" +
    "        <th class=\"col-sm-2  text-center\">Usage Adjustment</th>\n" +
    "        <th class=\"col-sm-1  text-center\">Par</th>\n" +
    "\n" +
    "        <th class=\"col-sm-2 text-center\">Order Quantity</th>\n" +
    "        <th class=\"col-sm-2\">Lasts Until</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "    <tr ng-repeat=\"item in inventory | inArray:selectedOrderForm.items\" >\n" +
    "        <td  >\n" +
    "            <div  style=\"line-height:18px; \">\n" +
    "                <div>{{item.name}}</div>\n" +
    "                <div class=\"text-secondary\" style=\"font-size:12px;\">{{item.measurement}}</div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "        <div >\n" +
    "            <div>{{item.quantity_on_hand.quantity}}</div>\n" +
    "            <div class=\"text-secondary\" style=\"font-size:12px;\">{{printDate(item.quantity_on_hand.updated_at)}}</div>\n" +
    "        </div>\n" +
    "        </td>\n" +
    "\n" +
    "\n" +
    "        <td class=\"text-center\"  >\n" +
    "\n" +
    "\n" +
    "            <div ng-if=\"item.usage_per_thousand !== undefined\">\n" +
    "                {{item.adjusted_quantity_on_hand - item.quantity_on_hand.quantity}}\n" +
    "            </div>\n" +
    "            <div ng-show=\"{{item.usage_per_thousand === undefined}}\">\n" +
    "                <div class=\"text-danger\" style=\"font-size:12px\">Usage Not Set </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "\n" +
    "        <td class=\"text-center\">\n" +
    "\n" +
    "\n" +
    "            <i style=\"cursor:pointer\" popover-placement=\"bottom\" uib-popover-template=\"item.popover.templateUrl\"\n" +
    "               popover-trigger=\"mouseenter\" popover-title=\"Dynamic Par Calculation\" type=\"button\"\n" +
    "               ng-if=\"item.par_type == 'dynamic'\"\n" +
    "               class=\"glyphicon glyphicon-flash pull-left\"></i>\n" +
    "\n" +
    "            <div ng-if=\"!item.par_value\">\n" +
    "                0\n" +
    "            </div>\n" +
    "            <div ng-if=\"item.par_value >0\">\n" +
    "                {{item.calculated_par.par}}\n" +
    "            </div>\n" +
    "\n" +
    "        </td>\n" +
    "\n" +
    "        <td class=\"center-block\">\n" +
    "            <div class=\"background-secondary\" style=\"padding:10px; \">\n" +
    "                <div ng-click=\"decrementOrderQuantity(item)\"  class=\"btn btn-default col-sm-2\" style=\"padding:2px;\"><i class=\"glyphicon glyphicon-minus\"></i></div>\n" +
    "                <div class=\"text-center col-sm-8\">\n" +
    "\n" +
    "                    <b>{{item.orderQuantity | zeroFloor }}</b>\n" +
    "                </div>\n" +
    "                <div ng-click=\"incrementOrderQuantity(item)\" class=\"btn btn-default col-sm-2\" style=\"padding:2px;\"><i class=\"glyphicon glyphicon-plus\"></i></div>\n" +
    "                <div class=\"clearfix\"></div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td>\n" +
    "            <div ng-if=\"item.lasts_until === undefined\" class=\"text-danger\" style=\"font-size:12px;\">\n" +
    "               Usage Not Set\n" +
    "            </div>\n" +
    "            <div ng-if=\"item.lasts_until !== undefined\">\n" +
    "            {{item.lasts_until}}\n" +
    "            </div>\n" +
    "\n" +
    "           </td>\n" +
    "    </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"salesCalculationPopover.html\">\n" +
    "    <div style=\"line-height:30px;\">\n" +
    "        <div>Par Level (days): <b class=\"pull-right\">{{item.par_value}}</b></div>\n" +
    "        <div>Usage Per $1,000: <b class=\"pull-right\">{{item.usage_per_thousand}} units =</b></div>\n" +
    "        <div>Sales (Next {{item.par_value}} days): <b class=\"pull-right\">{{item.calculated_par.sales | currency}}</b></div>\n" +
    "        <div class=\"text-center voffset2\">Par Level (Units)</div>\n" +
    "        <div class=\"text-center text-secondary\">(Usage Per $1,000 / 1,000) * Projected Sales</div>\n" +
    "        <hr>\n" +
    "        <div class=\"text-center\"><h3>{{item.calculated_par.par}} units</h3></div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("inventory/inventory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("inventory/inventory.tpl.html",
    "\n" +
    "<nav class=\"tmf-nav\">\n" +
    "\n" +
    "\n" +
    "    <ul class=\"navbar-nav navbar-right\">\n" +
    "        <li ui-sref-active-if=\"app.inventory.items\" ui-sref=\"app.inventory.items\">Items</li>\n" +
    "        <li ui-sref-active-if=\"app.inventory.ordering\" ui-sref=\"app.inventory.ordering\">Ordering</li>\n" +
    "\n" +
    "    </ul>\n" +
    "\n" +
    "    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <a class=\"navbar-brand\" >Inventory</a>\n" +
    "    </div>\n" +
    "\n" +
    "</nav>\n" +
    "\n" +
    "<div ui-view=\"content\" style=\"margin:20px;\"></div>\n" +
    "\n" +
    "<!-- SIDE PANEL -->\n" +
    "<div class=\"cd-panel from-right\"   id=\"addInventoryItemPanel\">\n" +
    "    <div class=\"cd-panel-container\">\n" +
    "        <div ui-view=\"panelContent\"></div>\n" +
    "    </div>\n" +
    "    <!-- cd-panel-container -->\n" +
    "</div> <!-- cd-panels -->");
}]);

angular.module("team/team-members/sidepanel/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/team-members/sidepanel/edit.tpl.html",
    "\n" +
    "\n" +
    "<!--\n" +
    "<nav class=\"tmf-nav-sidepanel\">\n" +
    "    <div class=\"navbar-header\" style=\"width:100%\">\n" +
    "        <div class=\"pull-right\" style=\"position:relative; top:5px; right:10px;\">\n" +
    "            <button ng-if=\"activeUser.status == 1\" class=\"btn btn-default pull-right cd-btn-status\" type=\"submit\" ng-click=\"terminateUser(activeUser)\" >Terminate</button>\n" +
    "            <button ng-if=\"activeUser.status == 0\" class=\"btn btn-default pull-right cd-btn-status\" type=\"submit\" ng-click=\"reactivateUser()\" >Re-Activate</button>\n" +
    "        </div>\n" +
    "       <div class=\"avatar pull-left\" style=\"position:relative; top:5px; left:10px;\">JS</div>\n" +
    "            <div class=\" navbar-brand pull-left\">{{activeUser.first_name}} {{activeUser.last_name}}\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "</nav>\n" +
    "-->\n" +
    "<div class=\"cd-panel-content\">\n" +
    "\n" +
    "    <div class=\"cd-panel-nav\">\n" +
    "        <div class=\"pull-right\" style=\"position:relative;  right:10px;\">\n" +
    "            <button ng-if=\"activeUser.status == 1\" class=\"btn btn-default\" type=\"submit\" ng-click=\"terminateUser(activeUser)\" >Terminate</button>\n" +
    "            <button ng-if=\"activeUser.status == 0\" class=\"btn btn-default\" type=\"submit\" ng-click=\"reactivateUser()\" >Re-Activate</button>\n" +
    "        </div>\n" +
    "        <div class=\"avatar\">{{activeUser.first_name.slice(0,1)}}{{activeUser.last_name.slice(0,1)}}</div>\n" +
    "        <div class=\" navbar-brand\">{{activeUser.first_name}} {{activeUser.last_name}}</div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <form>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"firstName\">First Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"firstName\" ng-model=\"activeUser.first_name\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"lastName\">Last Name</label>\n" +
    "                <input ng-model=\"activeUser.last_name\" type=\"text\" class=\"form-control\" id=\"lastName\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4\">\n" +
    "                <label for=\"pin\">Workstation PIN</label>\n" +
    "                <input type=\"text\" ng-model=\"activeUser.pin\"  class=\"form-control\" id=\"pin\" placeholder=\"Optional\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "    <div class=\"cd-panel-footer background-secondary\">\n" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-primary pull-right\" ng-click=\"updateUser()\">Save</button>\n" +
    "        <button class=\"btn btn-default btn-default pull-right\" ng-click=\"cancelChanges()\">Cancel</button>\n" +
    "    </div>\n" +
    "</div> <!-- cd-panel-content -->\n" +
    "");
}]);

angular.module("team/team-members/sidepanel/new_employee.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/team-members/sidepanel/new_employee.tpl.html",
    "<div class=\"cd-panel-content\">\n" +
    "\n" +
    "    <div class=\"cd-panel-nav\">\n" +
    "\n" +
    "\n" +
    "        <div class=\" navbar-brand\">Create New Employee</div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <form>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"firstName\">First Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"firstName\" ng-model=\"activeUser.first_name\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-6\">\n" +
    "                <label for=\"lastName\">Last Name</label>\n" +
    "                <input ng-model=\"activeUser.last_name\" type=\"text\" class=\"form-control\" id=\"lastName\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4\">\n" +
    "                <label for=\"pin\">Workstation PIN</label>\n" +
    "                <input type=\"text\" ng-model=\"activeUser.pin\"  class=\"form-control\" id=\"pin\" placeholder=\"Optional\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "    <div class=\"cd-panel-footer background-secondary\">\n" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-primary pull-right\" ng-click=\"createUser()\">Save</button>\n" +
    "        <button class=\"btn btn-default btn-default pull-right\" ng-click=\"cancelChanges()\">Cancel</button>\n" +
    "    </div>\n" +
    "</div> <!-- cd-panel-content -->\n" +
    "");
}]);

angular.module("team/team-members/team-members.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/team-members/team-members.tpl.html",
    "<div>\n" +
    "    <div class=\"btn btn-primary  pull-right\" ng-click=\"goCreateNewEmployee()\">Add Team Member</div>\n" +
    "    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\" style=\"padding:0px;\">\n" +
    "\n" +
    "        <ul class=\"nav navbar-nav\">\n" +
    "\n" +
    "            <li class=\"tmf-dropdown\">\n" +
    "\n" +
    "                <a  class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                    aria-expanded=\"false\">Status ({{status.title}}) <span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                <ul class=\"dropdown-menu\" >\n" +
    "                    <li ><a ng-click=\"filterByStatus(1)\">Active</a> </li>\n" +
    "                    <li><a ng-click=\"filterByStatus(0)\">Terminated</a></li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <table class=\"table table-hover voffset3\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th>First Name</th>\n" +
    "            <th>Last Name</th>\n" +
    "            <th>Status</th>\n" +
    "            <th></th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"user in users | filter:statusFilter\" ng-click=\"setActive(user)\">\n" +
    "            <td>{{user.first_name}}</td>\n" +
    "            <td>{{user.last_name}}</td>\n" +
    "            <td>{{statusTitle(user.status)}}</td>\n" +
    "            <td><span class=\"glyphicon glyphicon-menu-right pull-right\"></span></td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- SIDE PANEL -->\n" +
    "<div class=\"cd-panel from-right\">\n" +
    "\n" +
    "    <div class=\"cd-panel-container\">\n" +
    "\n" +
    "        <div ng-include=\"panelContent\"></div>\n" +
    "    </div> <!-- cd-panel-container -->\n" +
    "</div> <!-- cd-panel -->");
}]);

angular.module("team/team.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/team.tpl.html",
    "\n" +
    "<nav class=\"tmf-nav\">\n" +
    "\n" +
    "    <ul class=\"navbar-nav navbar-right\">\n" +
    "        <li ui-sref-active-if=\"app.team.members\" ui-sref=\"app.team.members\">Members</li>\n" +
    "      <!--  <li ui-sref-active-if=\"app.team.timecards\" ui-sref=\"app.team.timecards.reports.summary\">Timecards</li>\n" +
    "-->\n" +
    "    </ul>\n" +
    "\n" +
    "    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <a class=\"navbar-brand\" >Team</a>\n" +
    "    </div>\n" +
    "\n" +
    "</nav>\n" +
    "\n" +
    "<div ui-view=\"content\" style=\"margin:20px;\"></div>\n" +
    "");
}]);

angular.module('templates.common', []);

