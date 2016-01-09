/*! teamify - v0.0.1 - 2016-01-08
 * Copyright (c) 2016 Nick Spitale;
 * Licensed 
 */
angular.module('app', [
    'ui.router',
    'auth',
    'satellizer',
    'team',
    'inventory',
    'home',

    'directives.uiSrefActiveIf',
    'directives.loading',
    'filters',
    'utils',
    'resources.organization',
    'notificate',
    'daterangepicker',
    'oc.modal',
    'angular.filter',
    'tasks',
    'templates.app']);


angular.module('inventory', [
        'resources.inventory',
        'resources.orderforms',
         'ui.bootstrap', //f
        'resources.projection']);

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
    // are requested other than usersff fdfd
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

            controller: function($scope,$auth,$rootScope,$state,user) {

                $auth.logout().then(function() {

                    // Remove the authenticated user from local storage
                    localStorage.removeItem('user');

                    // Flip authenticated to false so that we no longer
                    // show UI elements dependant on the user being logged in
                    $rootScope.authenticated = false;

                    // Remove the current user info from rootscope
                    user.data.currentUser = null;
                    $rootScope.currentUser = null;

                    $state.go('auth');
                });
            }
        });

})

.controller('AuthController', function($auth, $state, $http, $rootScope,user) {


            var vm = this;
            vm.email = "joe@theatomicburger.com";
            vm.password = "password";

        vm.userData = user.data;

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

                          vm.userData.currentUser = response.data.user;

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
angular.module('home', ['directives.calendar'])

    .config(function($stateProvider){

        $stateProvider
            .state('app.home', {
                abstract: true,
                views: {
                    "content@app": {
                        templateUrl: "home/home.tpl.html"
                    }
                }
            });
    });
angular.module('home')
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.home.sales', {
                url: '/home/sales',
                views: {
                    "content": {
                        controller: 'Home_SalesController',
                        templateUrl: "home/sales/sales.tpl.html"
                    }
                }
            });

    });


angular.module('home').controller('Home_SalesController', function ($scope, organization, projection, $ocModal) {

    $scope.organizationData = organization.data;

    organization.getById(1).$promise.then(function(response){ // @tmf fix id
        organization.data.organization = response[0];

        $scope.getProjections();

    });



   // $scope.organization = organization.data.organization;

    $scope.projection = projection.data;

    $scope.currentMonth = moment();
    $scope.getProjections = function () {
        projection.getProjectionsForDateRange($scope.currentMonth.startOf('month').utc().format(),
            $scope.currentMonth.endOf('month').utc().format()).$promise.then(function (response) {
                projection.data.projections = response;

            });
    };



    $scope.day = moment();

    $scope.selectDay = function (day) {
        console.log(day);
    }

    $scope.customProjection = function (day) {
        $ocModal.open({
            id: 'editCustomProjection',
            url: 'home/sales/editCustomProjection.tpl.html', //
            controller: 'EditCustomProjectionController',
            init: {
                date: day.date,
                projection: $scope.projectionForDay(day)
            },
            onClose: function (needsRefresh) {
                if (needsRefresh) {
                    $scope.getProjections(); //@tmf shouldnt need to hit server for this.  save from response.
                }
            }
        });
    }

    $scope.projectionForWeek = function (week) {

        var total = 0;
        angular.forEach(week.days, function (value) {

              total = total + parseInt(value.projection);
        });

        return total;

    }

    $scope.projectionForDay = function (day) {

        var x = 1;
        var i = -1;

        angular.forEach($scope.projection.projections, function (value, index) {
            if (moment(value.date).isSame(day.date, 'day'))
                i = index;
            x = 2;
        });

        if (i > -1)
            day.projection =  $scope.projection.projections[i].projection
        else
              day.projection =   $scope.organizationData.organization.default_projections[day.date.weekday()];

        return day.projection;
    }

    $scope.editDefaultProjection = function (day) {

        $ocModal.open({
            id: 'editDefaultProjection',
            url: 'home/sales/editDefaultProjection.tpl.html',
            controller: 'EditDefaultProjectionController',
            init: {
                day: day,
                projection: $scope.organizationData.organization.default_projections[day]
            }

        });
    }

});

angular.module('home').controller('EditDefaultProjectionController',
    function ($scope, $state, $ocModal, projection, organization, user) {


        $scope.userData = user.data;
        $scope.saveChanges = function () {
            $scope.loading = true;
            projection.updateDefaultProjections($scope.day, $scope.projection).$promise.then(function (response) {
                $scope.loading = false;

                $ocModal.close(true);
            });

        }


    });


angular.module('home').controller('EditCustomProjectionController',
    function ($scope, $state, $ocModal, projection, organization, user) {

        $scope.userData = user.data;
        $scope.loading = true;
        $scope.saveChanges = function () {
            projection.save({
                organization: $scope.userData.currentUser.organization,
                date: $scope.date.utc().format(),
                projection: $scope.projection
            }).$promise.then(function (response) {
                    $scope.loading = false;
                    $ocModal.close(true);
                });

        }


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


angular.module('inventory').controller('InventoryController', function($scope,$state,$auth,organization, $rootScope,projection, inventory) {

//

    $scope.organizationData = organization.data;
    $scope.projections = projection.data;
    $scope.inventory = [];

    organization.getById(1).$promise.then(function(response){ // @tmf fix id
        organization.data.organization = response[0];

        projection.getProjectionsForDateRange(start.utc().format(),end.utc().format()).$promise.then(function (response) {
            projection.data.projections = response;

            $scope.fetchInventory();

        });

    });



    $scope.fetchInventory = function(){
        $scope.loading = true;
        inventory.all().$promise.then(function(response)
        {
            $scope.loading = false;
//
            inventory.inventory = response;
            $scope.setAdditionalInventoryProperties();
            $scope.inventory = inventory.inventory;

        }, function (error) {
            $scope.loading = false;

        });

    }



    var start = moment().subtract(60,'days');
    var end = moment().add(60,'days');







$scope.setAdditionalInventoryProperties = function(){

        for(var i = 0; i < inventory.inventory.length; i++){
            var item = inventory.inventory[i];

            item.adjusted_quantity_on_hand = item.quantity_on_hand.quantity;
            
            if(item.usage_per_thousand)
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


            var proj = projection.projectionForDate(day);
            quantity = quantity - (usage / 1000) * proj;

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


            salesProjection = salesProjection + parseInt(projection.projectionForDate(end));
            end.subtract(1, 'days');
        }

        return salesProjection;
    }


    function adjustedQuantityOnHand(item){

        var lastUpdatedMoment = moment(item.quantity_on_hand.updated_at);

        var adjustedQuantity = item.quantity_on_hand.quantity;




        var dayPointer = moment();
        var i = 0;

        var done = false;
        while(done == false){

            if(dayPointer.isSame(lastUpdatedMoment,'day')){

                done = true;
                break;

            }


            var dayProjection = projection.projectionForDate(dayPointer);
            var adjustment = (item.usage_per_thousand / 1000) * dayProjection;

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






angular.module('tasks', [])
    .config(function($stateProvider){
        $stateProvider
            .state('app.tasks', {
                url:"/tasks",
                views: {
                    "content@app": {
                        templateUrl: "tasks/tasks.tpl.html",
                        controller: "TasksController"
                    }
                }
            });
    })
.controller("TasksController",function(){

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



angular.module('team-members').controller('TeamMembersController', function($scope,user,notificate) {

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
            notificate.error(error);
            return;
        }



        // Update the time entry and then refresh the list
        user.updateUser($scope.activeUser).$promise.then(function(success) {
            console.log("Fa" + $scope.activeUser);
            $scope.staleUser = $scope.activeUser;
          notificate.success("Your Changes Have Been Saved");
        }, function(error) {
            console.log(error);
        });

    };

    $scope.createUser = function() {

        try {
            user.isValid($scope.activeUser);
        }
        catch (error) {
          //  Crash.notificate.error(error); fff
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

angular.module('team', ['team-members','resources.timecards'])

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
angular.module('team')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.team.timecards', {
                url: '/team/timecards',
                abstract:true,
                views: {
                    "content": {
                        controller: "Team_TimecardsController",
                        templateUrl: "team/timecards/index.tpl.html"
                    }
                }
            })
            .state('app.team.timecards.clockedin', {
                url: '/clockedin',
                templateUrl: "team/timecards/clockedIn.tpl.html",
                controller: "Team_ClockedInController"
            })

    .state('app.team.timecards.reports', {
        abstract:true,
        templateUrl: "team/timecards/reports.tpl.html",
        controller: "Team_Timecards_ReportController"
    })


    .state('app.team.timecards.reports.summary', {
        url: '/summary',
        templateUrl: "team/timecards/summary.tpl.html",
        controller: "Team_Timecards_Report_SummaryController"
    })

    .state('app.team.timecards.reports.shiftdetail', {
        url: '/detail',
        templateUrl: "team/timecards/shiftdetail.tpl.html",
        controller: "Team_Timecards_Report_ShiftDetailController"
    })
            .state('app.team.timecards.reports.shiftdetail.edit', { // added view mode
                url: "/:id",
                views: {
                    "panelContent@app.team.timecards.reports.shiftdetail": {
                        controller: "Team_Timecards_Report_ShiftDetail_EditController",
                        templateUrl: "team/timecards/sidepanel/edit.tpl.html"
                    }
                }
            });

    });




angular.module('team').controller('Team_TimecardsController', function($scope,timecards,notificate,user) {




    user.getUsers().$promise.then(function(results) {
        $scope.users = results;

    }, function(error) { // Check for errors
        console.log(error);
    });




    $scope.reportTimecards = [];


    $scope.reportDate = {};

    $scope.reportDate = {
        startDate: moment().subtract(1, "days"),
        endDate: moment(),
        options: {
            autoUpdateInput: false
        }
    };

    $scope.openDatePicker = function(selector){
        $(selector).data('daterangepicker').toggle();
    };

    $scope.reportDate.startDate = moment();
    $scope.updateDate = function(start,end){
        $scope.reportDate.startDate = start;
        $scope.reportDate.endDate = end;
        $scope.fetchTimecards();
    }


    $scope.fetchTimecards = function(){

        var start = $scope.reportDate.startDate.startOf('day').utc().format();
        var end =   $scope.reportDate.endDate.endOf('day').utc().format();



        $scope.loading = true;
        timecards.getTimecards({start:start, end:end}).then(function(results) {
            $scope.loading = false;
            $scope.reportTimecards = results;

        }, function(error) { // Check for errors
            console.log(error);
            $scope.loading = false;
        });


    }


    $scope.goCreateNewTimecard = function(){
        $scope.panelContent = 'team/timecards/sidepanel/create.tpl.html';
        $('#createTimecardPanel').addClass('is-visible');
    }

    $scope.newTimecard = {
        hours: 0,
        selectedUser: {},
        selectUser: function(user){
            $scope.newTimecard.selectedUser = user;
        },
        dates: {
            clock_in: {
                date: {
                    startDate: moment().format("MM/d/YYYY"),
                    endDate: moment(),
                    options: {
                        autoUpdateInput: false
                    }
                },
                time: moment()
            },
            clock_out: {
                date: {
                    startDate: moment().format("MM/d/YYYY"),
                    endDate: moment(),
                    options: {
                        autoUpdateInput: false
                    }
                },
                time: moment()
            }
        }
    }

    $scope.newTimecard.createTimecard = function() {

        //@tmf this should be abstracted to resource file and hit server to validate for overlap
        if(!$scope.newTimecard.selectedUser){
          notificate.error("Please Select a Team Member");
            return;
        }
        if($scope.newTimecard.hours <= 0){
           notificate.error("Clock Out Time Must Be Greater than Clock In Time");
            return;
        }


        timecards.createTimecard({
            "user": $scope.newTimecard.selectedUser,
            "clock_in": utils.getMomentFromComponents($scope.newTimecard.dates.clock_in.date,$scope.newTimecard.dates.clock_in.time).utc().format(),
            "clock_out": utils.getMomentFromComponents($scope.newTimecard.dates.clock_out.date,$scope.newTimecard.dates.clock_out.time).utc().format()
        }).then(function (success) {


            notificate.success("Timecard Created!");
            $('#createTimecardPanel').removeClass('is-visible');

        }, function (error) {
            notificate.error("There was an error with your request.");
        });



    }
    $scope.calculateHours = function(inDate, inTime, outDate,outTime){
        var  i = moment(inDate);

        var  o = moment(outDate);


        var inTime = moment(inTime);
        i.hours(inTime.hours()).minutes(inTime.minutes());

        var outTime = moment(outTime);


        o.hours(outTime.hours()).minutes(outTime.minutes());

        return Math.round(moment.duration(o.diff(i)).asHours() * 100) / 100;

    }



    $scope.newTimecard.cancelCreateNewTimecard = function(){
        $('#createTimecardPanel').removeClass('is-visible');
    }

    $scope.$watch('[newTimecard.dates]', function(newDate) {

        $scope.newTimecard.hours = $scope.calculateHours($scope.newTimecard.dates.clock_in.date,
            $scope.newTimecard.dates.clock_in.time,$scope.newTimecard.dates.clock_out.date,
            $scope.newTimecard.dates.clock_out.time);
    }, true);




});


angular.module('team').controller('Team_ClockedInController', function($scope,timecards) {

    $scope.formatDate = function(date){
        return moment(date).format("ddd h:mm a");
    }
    timecards.fetchOpenTimecards();
     $scope.timecards = timecards.data;

});

angular.module('team').controller('Team_Timecards_ReportController', function($scope,user,$state) {

    $scope.$watch('reportDate', function(newDate) {
        $scope.updateDate(newDate.startDate,newDate.endDate);
    }, false);


    $scope.reports = [
        {"id":0,"title":"Timecard Summary","state":"app.team.timecards.reports.summary"},
        {"id":1,"title":"Shift Detail","state":"app.team.timecards.reports.shiftdetail"}
    ];

    $scope.activeReport = {};

    $scope.showReport = function(index){
        $scope.activeReport =  $scope.reports[index];
        $state.go($scope.reports[index].state);
    };

    $scope.formatDate =   function formatDate(date){
        if(!date)
            return "-";
        return moment(date).format("ddd MM/D/YYYY, h:mm a");
    };

    $scope.shiftLength = function(clock_in,clock_out){
        start = moment(clock_in);
        end = moment(clock_out);
        return Math.round(moment.duration(end.diff(start)).asHours() * 100) / 100;
    };

    $scope.fetchTimecards();

    $scope.selectedUser = {_id:-1,title:"All Employees"};

    $scope.selectUser = function(user){
        $scope.selectedUser = user;
        $scope.selectedUser.title = user.first_name + " " + user.last_name;
    };

});


angular.module('team').controller('Team_Timecards_Report_SummaryController', function($scope) {

    $scope.activeReport.report = $scope.reports[0];

    $scope.userHours = function(shifts){
        var hours = 0;

        for(var i = 0; i < shifts.length; i++){
            hours = hours + $scope.shiftLength(shifts[i].clock_in,shifts[i].clock_out);
        }
        return hours;
    };

    $scope.totalHours = function(){
        var hours = 0;
        angular.forEach($scope.reportTimecards,function(value,index){
            hours = hours + $scope.shiftLength(value.clock_in,value.clock_out);
        });

        return hours;
    };

});

angular.module('team').controller('Team_Timecards_Report_ShiftDetailController', function($scope) {

    $scope.activeReport.report = $scope.reports[1];

    $scope.filteredTimecards = function(){

        if($scope.selectedUser._id == -1)
            return $scope.reportTimecards;

        var filtered = [];

        angular.forEach($scope.reportTimecards,function(value,index){
            if($scope.selectedUser._id == value.user._id)
                filtered.push(value);
        });

        return filtered;
    };

    $scope.totalFilteredHours = function(){
        var filtered = $scope.filteredTimecards();
        var hours = 0;
        for(var i = 0; i < filtered.length; i++){
            hours = hours + $scope.shiftLength(filtered[i].clock_in,filtered[i].clock_out);
        }
        return hours;
    };

});


angular.module('team').controller('Team_Timecards_Report_ShiftDetail_EditController', function($scope,$rootScope,$state,$stateParams,utils,timecards,notificate) {

    $scope.timecard =  utils.getObjectById($stateParams.id,$scope.reportTimecards);
    if(!$scope.timecard) {
        $state.go("app.team.timecards.reports.shiftdetail");
        return;
    }

    $('#shiftDetailEdit').addClass('is-visible');


    $scope.hours = 0;
    $scope.editDates = {
        clock_in: {
            date: {
                startDate: $scope.timecard.clock_in,
                endDate: $scope.timecard.clock_in
            },
            time: moment($scope.timecard.clock_in)
        },
        clock_out: {
            date: {
                startDate:  $scope.timecard.clock_out,
                endDate: null
            },
            time: moment($scope.timecard.clock_out)
        }
    };

    $scope.updateTimecard = function() {
            //@tmf validate
        timecards.updateTimecard({
                "user": $scope.timecard.user,
                "_id": $scope.timecard._id,
                "clock_in": utils.getMomentFromComponents($scope.editDates.clock_in.date.startDate, $scope.editDates.clock_in.time).utc().format(),
                "clock_out": utils.getMomentFromComponents($scope.editDates.clock_out.date.startDate, $scope.editDates.clock_out.time).utc().format()
            }
        ).then(function(){
                $('#shiftDetailEdit').removeClass('is-visible');

                notificate.success("Timecard Updated!");
                $state.go("app.team.timecards.reports.shiftdetail");
            },
        function(){
            notificate.error("There was an error with your request.");
        });

    }


    $scope.cancelChanges = function(){
        $('#shiftDetailEdit').removeClass('is-visible');
        $state.go("app.team.timecards.reports.shiftdetail");
        $scope.editDates.clock_in.date.endDate = null;
        $scope.editDates.clock_out.date.endDate = null;
    }
    $scope.$watch('[editDates]', function(newDate) {

        $scope.hours =  $scope.calculateHours($scope.editDates.clock_in.date,$scope.editDates.clock_in.time,$scope.editDates.clock_out.date,$scope.editDates.clock_out.time);
    }, true);


});

angular.module('directives.calendar',[]).
    directive("calendar", function(projection) {
        return {
            restrict: "E",
            templateUrl: "home/sales/calendar.tpl.html",
            scope: false,
            link: function (scope) {
                scope.selected = _removeTime(scope.selected || moment());
                scope.month = scope.selected.clone();
                scope.loading = false;
                var start = scope.selected.clone();
                start.date(1);
                _removeTime(start.day(0));

                _buildMonth(scope, start, scope.month);


                scope.next = function () {

                    scope.loading = true;
                    var from = scope.month.clone();
                    var to = from.clone().add(1, 'month');
                    var start = to.clone().startOf('month').utc().format();
                    var end = to.clone().endOf('month').utc().format();
                    scope.currentMonth = to.clone();
                    projection.getProjectionsForDateRange(start, end).$promise.then(function (response) {

                        projection.data.projections = response;
                        var next = scope.month.clone();

                        _removeTime(next.month(next.month() + 1).date(1));
                        scope.month.month(scope.month.month() + 1);
                        _buildMonth(scope, next, scope.month);
                        scope.loading = false;
                    });



                };

                scope.goCustomProjection = function(day) {


                    if (!day.date.isSame(scope.month, 'month'))
                        return;

                    scope.customProjection(day);

                }; //

                scope.previous = function () {

                    scope.loading = true;
                    var previous = scope.month.clone();
                    var current = previous.clone().subtract(1, 'month');
                    var start = current.clone().startOf('month').utc().format();
                    var end = current.clone().endOf('month').utc().format();
                    scope.currentMonth = current.clone();
                    projection.getProjectionsForDateRange(start, end).$promise.then(function (response) {

                        projection.data.projections = response;
                        console.log(previous.month() - 1);

                        _removeTime(previous.month(previous.month() - 1).date(1));
                        scope.month.month(scope.month.month() - 1);
                        _buildMonth(scope, previous, scope.month);
                        scope.loading = false;
                    });


                };
            }
        };



        function _removeTime(date) {
            return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        }

        function _buildMonth(scope, start, month) {
            scope.weeks = [];
            var done = false, date = start.clone(), monthIndex = date.month(), count = 0;

            while (!done) {
                scope.weeks.push({ days: _buildWeek(date.clone(), month) });
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
        }

        function _buildWeek(date, month) {
            var days = [];


            for (var i = 0; i < 7; i++) {

                    days.push({
                        name: date.format("dd").substring(0, 1),
                        number: date.date(),
                        isCurrentMonth: date.month() === month.month(),
                        isToday: date.isSame(new Date(), "day"),
                        date: date
                    });


                date = date.clone();
                date.add(1, "d");
            }

            return days;
        }


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
        .module('resources.organization',[])
        .factory('organization', organization);

    function organization($resource) {


        var factory = {};
        factory.data={organization:{},loading:false};
            factory.data.loading=false;


        // ngResource call to our static data
        var Organization = $resource('api/organization/:id', {}, {
            update: {
                method: 'PUT'//
            }
        });

        factory.getById = function(id){

            return Organization.query({id:id});


        }


        return factory;
    }

})();

(function() {

    'use strict';

    angular
        .module('resources.projection',[])
        .factory('projection', projection);

    function projection($resource,user,organization) {


    var userData = user.data;

        var factory = {};
        factory.data={projections:[],loading:false};
        factory.data.loading=false;

        // ngResource call to our static data
        var Projection = $resource('api/projections/:id', {start: '@start', end:'@end'}, {
            update: {
                method: 'PUT'
            }
        });

        var r = $resource('api/projections/update_default', {organization: '@id',
            day: '@day',
            projection: '@projection'}, {
            'update': {
                method: 'PUT'
            }
        });


        factory.projectionForDate = function (date) {

            var x = 1;
            var i = -1;
            var organizationData = organization.data;
            angular.forEach(factory.data.projections, function (value, index) {
                if (moment(value.date).isSame(date, 'day'))
                    i = index;
                x = 2;
            });

            if (i > -1)
               return factory.data.projections[i].projection;
                 //@tmf this is dumb, default projections should be in this factory, not organization
               return organizationData.organization.default_projections[date.weekday()];


        }

        factory.getProjectionsForDateRange  = function(start,end){

            return Projection.query({id:1,start:start,end:end});
        }


        factory.save = function(data){
            return Projection.save(data);
        }

        factory.updateDefaultProjections = function(day,projection) {


            return r.update(
                {organization:userData.currentUser.organization,
                    day: day,
                    projection: projection

                });
        }

        return factory;

    }

})();

(function() {

    'use strict';

    angular
        .module('resources.sales',[])
        .factory('sales', sales);

    function sales($resource) {



        var factory = {};
        factory.data={projections:[],loading:false};
        factory.data.loading=false;

        // ngResource call to our static data
        var Sales = $resource('api/sales/:id', {start: '@start', end:'@end'}, {
            update: {
                method: 'PUT'
            }
        });





        return factory;

    }

})();

(function() {

    'use strict';

    angular
        .module('resources.timecards',['ngResource'])
        .factory('timecards', timecards);


    function timecards($resource) {

        var factory = {};

        factory.data = {timecards: [],
            openTimecards: [],
            loading:false};


        // ngResource call to our static data
        var Timecard = $resource('api/timecards/:id', {}, {
            update: {
                method: 'PUT'
            }
        });


        factory.fetchOpenTimecards = function(){
            var OpenTimecards = $resource('/api/opentimecards',{},
                {
                    'save': {method:'POST', isArray: true}
                });
            OpenTimecards.query().$promise.then(function(response){
                factory.data.openTimecards = response;
            });
        };

        factory.getTimecards = function(data) {

            return Timecard.query(data).$promise;
        }


        factory.updateTimecard = function(data) {

            return Timecard.update({id:data._id}, data).$promise;


        }

        factory.createTimecard = function(data) {

          return Timecard.save(data).$promise;


        }


        return factory;

    }


})();

(function() {

    'use strict';

    angular
        .module('resources.users',['ngResource'])
        .factory('user', user);


    function user($resource,$rootScope) {

        var factory = {};

        factory.data = {currentUser: $rootScope.currentUser,loading:false};

        factory.getUsers = function(){
            // $promise.then allows us to intercept the results
            // which we will use later
            return User.query();
        }

        // ngResource call to our static data
        var User = $resource('api/users/:id', {}, {
            update: {
                method: 'PUT'
            }
        });

        var users = [];


        factory.createUser = function(data) {

            return User.save(data);
        }
       factory.updateUser = function(data) {

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


       factory.isValid = function(user) {

            if (!user.first_name || !user.last_name)
                throw "First and Last Names are required.";

            if (user.pin) {
                if (isNaN(user.pin))
                    throw "PIN must be a number";

                if (user.pin.toString().length !== 4)
                    throw "PINs must be 4 digits long.";

            }
        }


return factory;
        /*
        return {
            getUsers: getUsers,
            createUser: createUser,
            updateUser: updateUser,
            getById: getById,
            isValid: isValid
        }; */
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

        factory.getMomentFromComponents = function(date,time){
            var d = moment(date).startOf('day');
            var t = moment(time);
            d.hour(t.hour()).minute(t.minute());

            return d;
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
angular.module('templates.app', ['auth/auth.tpl.html', 'home/home.tpl.html', 'home/sales/calendar.tpl.html', 'home/sales/editCustomProjection.tpl.html', 'home/sales/editDefaultProjection.tpl.html', 'home/sales/sales.tpl.html', 'index.tpl.html', 'inventory/inventory-items/inventory-items.tpl.html', 'inventory/inventory-items/sidepanel/create.tpl.html', 'inventory/inventory-items/sidepanel/edit.tpl.html', 'inventory/inventory-ordering/createForm.tpl.html', 'inventory/inventory-ordering/editForm.tpl.html', 'inventory/inventory-ordering/inventory-ordering.tpl.html', 'inventory/inventory.tpl.html', 'tasks/tasks.tpl.html', 'team/team-members/sidepanel/edit.tpl.html', 'team/team-members/sidepanel/new_employee.tpl.html', 'team/team-members/team-members.tpl.html', 'team/team.tpl.html', 'team/timecards/clockedIn.tpl.html', 'team/timecards/index.tpl.html', 'team/timecards/reports.tpl.html', 'team/timecards/shiftdetail.tpl.html', 'team/timecards/sidepanel/create.tpl.html', 'team/timecards/sidepanel/edit.tpl.html', 'team/timecards/summary.tpl.html', 'team/timecards/timecards.tpl.html']);

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

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "\n" +
    "<nav class=\"tmf-nav\">\n" +
    "\n" +
    "    <ul class=\"navbar-nav navbar-right\">\n" +
    "        <li ui-sref-active-if=\"app.home.sales\" ui-sref=\"app.home.sales\">Sales</li>\n" +
    "        <!--  <li ui-sref-active-if=\"app.team.timecards\" ui-sref=\"app.team.timecards.reports.summary\">Timecards</li>\n" +
    "  -->\n" +
    "    </ul>\n" +
    "\n" +
    "    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <a class=\"navbar-brand\" >Atomic Burger</a>\n" +
    "    </div>\n" +
    "\n" +
    "</nav>\n" +
    "\n" +
    "<div ui-view=\"content\" style=\"margin:20px;\"></div>\n" +
    "");
}]);

angular.module("home/sales/calendar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/sales/calendar.tpl.html",
    "\n" +
    "\n" +
    "<div class=\"row\" ng-if=\"organizationData.organization.default_projections && loading == false\">\n" +
    "\n" +
    "    <div class=\"header\">\n" +
    "    <span class=\" glyphicon glyphicon-chevron-left pull-left\" ng-click=\"previous()\" ></span>\n" +
    "        <span class=\" glyphicon glyphicon-chevron-right pull-right\" ng-click=\"next()\" ></span>\n" +
    "\n" +
    "        <div>{{month.format(\"MMMM, YYYY\")}}</div>\n" +
    "</div>\n" +
    "<div class=\"week names\">\n" +
    "    <span class=\"title\" ng-click=\"editDefaultProjection(0)\">\n" +
    "       <div>Sun</div>\n" +
    "    </span>\n" +
    "     <span class=\"title\" ng-click=\"editDefaultProjection(1)\">\n" +
    "        <div>Mon</div>\n" +
    "     </span>\n" +
    "\n" +
    "    <span class=\"title\" ng-click=\"editDefaultProjection(2)\">\n" +
    "        <div>Tue</div>\n" +
    "    </span>\n" +
    "    <span class=\"title\" ng-click=\"editDefaultProjection(3)\">\n" +
    "        <div>Wed</div>\n" +
    "    </span>\n" +
    "    <span class=\"title\" ng-click=\"editDefaultProjection(4)\">\n" +
    "           <div>Thu</div>\n" +
    "    </span>\n" +
    "        <span class=\"title\" ng-click=\"editDefaultProjection(5)\">\n" +
    "    <div>Fri</div>\n" +
    "            </span>\n" +
    "    <span class=\"title\" ng-click=\"editDefaultProjection(6)\">\n" +
    "           <div>Sat</div>\n" +
    "    </span>\n" +
    "      <span class=\"title\">\n" +
    "           <div>Total</div>\n" +
    "    </span>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"week\" ng-repeat=\"week in weeks\">\n" +
    "    <span class=\"day\" ng-class=\"{ today: day.isToday, 'different-month': !day.isCurrentMonth,\n" +
    "    selected: day.date.isSame(selected) }\"  ng-click=\"goCustomProjection(day)\" ng-repeat=\"day in week.days\">\n" +
    "\n" +
    "          <div class=\"day-number center-block\">{{day.number}}</div>\n" +
    "          <h3>{{projectionForDay(day) | currency:\"$\":0}}</h3>\n" +
    "\n" +
    "    </span>\n" +
    "    <div class=\"day total\"><h3>{{projectionForWeek(week) | currency:\"$\":0}}</h3></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("home/sales/editCustomProjection.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/sales/editCustomProjection.tpl.html",
    "<div style=\"height:400px; \">\n" +
    "\n" +
    "    <nav class=\"navbar navbar-default\" style=\"margin-bottom:0px;\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "\n" +
    "            Edit Custom Projection\n" +
    "            <button type=\"button\" ng-click=\"saveChanges()\" class=\"btn btn-primary  navbar-right navbar-btn\"\n" +
    "                    style=\"margin-right:5px;\">Save</button>\n" +
    "            <button type=\"button\" ng-click=\"cancelChanges()\" style=\"margin-right:5px;\" class=\"btn btn-default navbar-right\n" +
    "        navbar-btn\">Cancel</button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <hr>\n" +
    "\n" +
    "    <input type=\"text\" ng-model=\"projection\">\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("home/sales/editDefaultProjection.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/sales/editDefaultProjection.tpl.html",
    "<div style=\"height:400px; \">\n" +
    "\n" +
    "    <nav class=\"navbar navbar-default\" style=\"margin-bottom:0px;\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "\n" +
    "            Edit Default Projection\n" +
    "            <button type=\"button\" ng-click=\"saveChanges()\" class=\"btn btn-primary  navbar-right navbar-btn\"\n" +
    "                    style=\"margin-right:5px;\">Save</button>\n" +
    "            <button type=\"button\" ng-click=\"cancelChanges()\" style=\"margin-right:5px;\" class=\"btn btn-default navbar-right\n" +
    "        navbar-btn\">Cancel</button>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <hr>\n" +
    "\n" +
    "    <input type=\"text\" ng-model=\"projection\">\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("home/sales/sales.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/sales/sales.tpl.html",
    "<calendar selected=\"day\" > </calendar>");
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
    "        </div><!-- /.navbar-collapsse -->\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "    <ul class=\"sidebar-nav\">\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.home\" ui-sref=\"app.home.sales\">\n" +
    "                <span class=\"glyphicon glyphicon-home\" aria-hidden=\"true\"></span><p>ATOMIC BURGER</p></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.team\" ui-sref=\"app.team.members\">\n" +
    "                <span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span><p>TEAM</p></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.inventory\" ui-sref=\"app.inventory.items\">\n" +
    "                <span class=\"glyphicon glyphicon-list-alt\" aria-hidden=\"true\"></span><p>INVENTORY</p></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.tasks\" ui-sref=\"app.tasks\">\n" +
    "                <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span><p>TASKS</p></a>\n" +
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
    "                {{item.quantity_on_hand.quantity | number:1}}\n" +
    "            </td>\n" +
    "\n" +
    "            <td class=\"col-sm-3 text-center\"  >\n" +
    "                <div>{{item.usage_per_thousand > 0 ? (item.adjusted_quantity_on_hand | number:1) : 'Usage Not Set'}}</div>\n" +
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
    "                <input type=\"text\" class=\"form-control  \" style=\" margin-top:10px; \" placeholder=\"Order Form Name\" ng-model=\"orderFormEditing.name\">\n" +
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
    "        <th class=\"col-sm-2  text-center\">Usage Adjusted<br> Quantity</th>\n" +
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
    "                {{item.adjusted_quantity_on_hand | number:1}}\n" +
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
    "                {{item.calculated_par.par | number:1}}\n" +
    "            </div>\n" +
    "\n" +
    "        </td>\n" +
    "\n" +
    "        <td class=\"center-block\">\n" +
    "            <div class=\"background-secondary\" style=\"padding:10px; \">\n" +
    "                <div ng-click=\"decrementOrderQuantity(item)\"  class=\"btn btn-default col-sm-2\" style=\"padding:2px;\"><i class=\"glyphicon glyphicon-minus\"></i></div>\n" +
    "                <div class=\"text-center col-sm-8\">\n" +
    "\n" +
    "                    <b>{{item.orderQuantity | number:1}}</b>\n" +
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

angular.module("tasks/tasks.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tasks/tasks.tpl.html",
    "\n" +
    "<nav class=\"tmf-nav\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <a class=\"navbar-brand\" >Tasks</a>\n" +
    "    </div>\n" +
    "\n" +
    "</nav>\n" +
    "\n" +
    "<div style=\"margin:20px;\">\n" +
    "    <div>\n" +
    "        <div class=\"btn btn-primary  pull-right\">New Task</div>\n" +
    "        <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\" style=\"padding:0px;\">\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "\n" +
    "                <li class=\"tmf-dropdown\">\n" +
    "\n" +
    "                    <a  class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                        aria-expanded=\"false\">Status ({{status.title}}) <span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                    <ul class=\"dropdown-menu\" >\n" +
    "                        <li ><a ng-click=\"filterByStatus(1)\">Active</a> </li>\n" +
    "                        <li><a ng-click=\"filterByStatus(0)\">Terminated</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <table class=\"table table-hover voffset3\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>First Name</th>\n" +
    "                <th>Last Name</th>\n" +
    "                <th>Status</th>\n" +
    "                <th></th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"task in tasks\">\n" +
    "                <td></td>\n" +
    "                <td></td>\n" +
    "                <td></td>\n" +
    "                <td><span class=\"glyphicon glyphicon-menu-right pull-right\"></span></td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- SIDE PANEL -->\n" +
    "    <div class=\"cd-panel from-right\">\n" +
    "\n" +
    "        <div class=\"cd-panel-container\">\n" +
    "\n" +
    "            <div ng-include=\"panelContent\"></div>\n" +
    "        </div> <!-- cd-panel-container -->\n" +
    "    </div> <!-- cd-panel -->\n" +
    "</div>\n" +
    "");
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
    "        <li ui-sref-active-if=\"app.team.timecards\" ui-sref=\"app.team.timecards.clockedin\">Timecards</li>\n" +
    "\n" +
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

angular.module("team/timecards/clockedIn.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/clockedIn.tpl.html",
    "<table class=\"table\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Team Member</th>\n" +
    "        <th >Clocked in Since</th>\n" +
    "\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "    <tr ng-repeat=\"t in timecards.openTimecards\">\n" +
    "        <td > {{t.user['first_name']}} {{t.user['last_name']}}\n" +
    "        </td>\n" +
    "        <td> {{formatDate(t.clock_in)}}\n" +
    "        </td>\n" +
    "\n" +
    "    </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("team/timecards/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/index.tpl.html",
    "\n" +
    "\n" +
    "\n" +
    "<nav class=\"tmf-subnav\">\n" +
    "    <div  class=\"btn btn-primary nav-btn-right\" ng-click=\"goCreateNewTimecard()\">Create Timecard</div>\n" +
    "    <ul >\n" +
    "        <li  ui-sref-active-if=\"app.team.timecards.reports\"  ui-sref=\"app.team.timecards.reports.summary\">\n" +
    "            Reports\n" +
    "        </li>\n" +
    "        <li  ui-sref-active=\"active\" ui-sref=\"app.team.timecards.clockedin\">\n" +
    "            Currently Clocked In\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "</nav>\n" +
    "\n" +
    "\n" +
    "<div ui-view></div>\n" +
    "<!-- SIDE PANEL -->\n" +
    "<div class=\"cd-panel from-right\" id=\"createTimecardPanel\">\n" +
    "\n" +
    "    <div class=\"cd-panel-container\">\n" +
    "\n" +
    "        <div ng-include=\"panelContent\"></div>\n" +
    "    </div> <!-- cd-panel-container -->\n" +
    "</div>");
}]);

angular.module("team/timecards/reports.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/reports.tpl.html",
    "<div class=\"voffset2\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <input date-range-picker id=\"daterange1\" name=\"daterange1\" class=\"col-sm-4 form-control tmf-datepicker  \"\n" +
    "           type=\"text\"\n" +
    "           ng-model=\"reportDate\" options=\"{locale: {format: 'MM/DD/YYYY'},opens:'right',autoApply:true}\"  required/>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"pull-left\">\n" +
    "    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\" style=\"padding:0px; margin-left:25px;\">\n" +
    "\n" +
    "        <ul class=\"nav navbar-nav\">\n" +
    "\n" +
    "            <li class=\"tmf-dropdown\">\n" +
    "\n" +
    "                <a  class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                    aria-expanded=\"false\">{{activeReport.report.title}} <span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                <ul class=\"dropdown-menu\" >\n" +
    "                    <li ng-repeat=\"report in reports\"><a ng-click=\"showReport($index)\">{{report.title}}</a>  </li>\n" +
    "\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"reportTimecards.length > 0 && activeReport.id == 1\" class=\"collapse navbar-collapse pull-left\" id=\"bs-example-navbar-collapse-2\"  style=\"margin-left:15px;\">\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div class=\"clearfix\"></div>\n" +
    "\n" +
    "<hr class=\"voffset2\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div ui-view></div>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"reportTimecards.length == 0  && loading == false\">\n" +
    "    <hr>\n" +
    "    <div  class=\"center-block text-center voffset8\">\n" +
    "        <h3>No Timecards For Selected Period</h3>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<loading class=\"voffset8\"></loading>\n" +
    "\n" +
    "\n" +
    "<!--\n" +
    "<div ng-include=\"activeReport.templateUrl\"></div>\n" +
    "-->\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("team/timecards/shiftdetail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/shiftdetail.tpl.html",
    "<div ng-if=\"reportTimecards.length > 0 && loading == false\" >\n" +
    "    <table class=\"table table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th class=\"col-sm-2\">First Name</th>\n" +
    "            <th class=\"col-sm-2\"> Last Name</th>\n" +
    "            <th class=\"col-sm-3\">Clock In</th>\n" +
    "            <th class=\"col-sm-3\">Clock Out</th>\n" +
    "            <th class=\"col-sm-2\">Shift Length</th>\n" +
    "\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "\n" +
    "\n" +
    "        <tr  ng-repeat=\"card in filteredTimecards()\" ui-sref=\"app.team.timecards.reports.shiftdetail.edit({id: card._id})\">\n" +
    "            <td>{{ card.user.first_name }}</td>\n" +
    "            <td>{{ card.user.last_name }}</td>\n" +
    "            <td>{{ formatDate(card.clock_in)}}</td>\n" +
    "            <td>{{ formatDate(card.clock_out)}}</td>\n" +
    "            <td><span class=\"glyphicon glyphicon-menu-right pull-right\"></span>{{shiftLength(card.clock_in,card.clock_out)}}</td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td colspan=\"4\">Total</td>\n" +
    "\n" +
    "            <td>{{totalFilteredHours()}}</td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"cd-panel from-right\" id=\"shiftDetailEdit\">\n" +
    "    <div class=\"cd-panel-container\">\n" +
    "        <div ui-view=\"panelContent\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("team/timecards/sidepanel/create.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/sidepanel/create.tpl.html",
    "\n" +
    "\n" +
    "<div class=\"cd-panel-content\">\n" +
    "\n" +
    "    <div class=\"cd-panel-nav\">\n" +
    "\n" +
    "\n" +
    "        <div class=\" navbar-brand\">Create Timecard</div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"form-group col-sm-6\">\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "                <li class=\"tmf-dropdown\">\n" +
    "\n" +
    "                    <a  class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\"\n" +
    "                        aria-expanded=\"false\">\n" +
    "\n" +
    "                        <div ng-if=\"newTimecard.selectedUser == nil\">Select Employee</div>\n" +
    "                        <div ng-if=\"newTimecard.selectedUser != nil\">{{newTimecard.selectedUser.first_name}} {{newTimecard.selectedUser.last_name}}</div>\n" +
    "                        <span class=\"glyphicon glyphicon-menu-down\"></span></a>\n" +
    "                    <ul class=\"dropdown-menu\" >\n" +
    "                        <li ng-repeat=\"user in users\" role=\"menuitem\" ng-click=\"newTimecard.selectUser(user)\">\n" +
    "                            <a>{{user.first_name}} {{user.last_name}}</a>\n" +
    "                        </li>\n" +
    "\n" +
    "\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "        <div class=\"form-group col-sm-5\" style=\"margin-top:20px; position:relative;\">\n" +
    "            <label >CLOCK IN</label>\n" +
    "            <p class=\"input-group \">\n" +
    "                <input date-range-picker id=\"dateRangeClockIn\" name=\"dateRangeClockIn\" class=\"col-sm-4 form-control\"\n" +
    "                       type=\"text\"\n" +
    "                       ng-model=\"newTimecard.dates.clock_in.date.startDate\" options=\"{singleDatePicker: true, parentEl: '#clock-in-container',\n" +
    "                   locale: {format: 'MM/DD/YYYY'},opens:'right',autoApply:true}\"  required/>\n" +
    "\n" +
    "              <span class=\"input-group-btn\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"openDatePicker('#dateRangeClockIn')\">\n" +
    "                    <i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "              </span>\n" +
    "\n" +
    "            </p>\n" +
    "\n" +
    "            <div id=\"clock-in-container\" style=\"position:absolute; top:82px; left:10px;\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-sm-6\" style=\"margin-top:10px;\">\n" +
    "            <uib-timepicker  ng-model=\"newTimecard.dates.clock_in.time\" ng-change=\"changed(clockInTime,clockOutTime)\"\n" +
    "                             hour-step=\"1\" minute-step=\"1\"\n" +
    "                             show-meridian=\"true\"></uib-timepicker>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "        <div class=\"form-group col-sm-5\" style=\"margin-top:20px; position:relative;\">\n" +
    "            <label >CLOCK OUT</label>\n" +
    "            <p class=\"input-group \">\n" +
    "                <input date-range-picker id=\"dateRangeClockOut\" name=\"dateRangeClockOut\" class=\"col-sm-4 form-control\"\n" +
    "                       type=\"text\"\n" +
    "                       ng-model=\"newTimecard.dates.clock_out.date.startDate\" options=\"{singleDatePicker: true, parentEl: '#clock-out-container',\n" +
    "                   locale: {format: 'MM/DD/YYYY'},opens:'right',autoApply:true}\"  required/>\n" +
    "\n" +
    "              <span class=\"input-group-btn\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"openDatePicker('#dateRangeClockOut')\">\n" +
    "                    <i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "              </span>\n" +
    "\n" +
    "            </p>\n" +
    "\n" +
    "            <div id=\"clock-out-container\" style=\"position:absolute; top:82px; left:10px;\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-sm-6\" style=\"margin-top:10px;\">\n" +
    "            <uib-timepicker ng-model=\"newTimecard.dates.clock_out.time\" ng-change=\"newTimecard.changed(clockInTime,clockOutTime)\"\n" +
    "                            hour-step=\"1\" minute-step=\"1\"\n" +
    "                            show-meridian=\"true\"></uib-timepicker>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div style=\"width:100%; margin-bottom:100px; text-align:center; font-size:50px; margin-top:50px;\">\n" +
    "\n" +
    "        {{newTimecard.hours}} Hours\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"cd-panel-footer background-secondary\">\n" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-primary pull-right\" ng-click=\"newTimecard.createTimecard()\">Save</button>\n" +
    "        <button class=\"btn btn-default btn-default pull-right\" ng-click=\"newTimecard.cancelCreateNewTimecard()\">Cancel</button>\n" +
    "    </div>\n" +
    "</div> <!-- cd-panel-content -->\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("team/timecards/sidepanel/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/sidepanel/edit.tpl.html",
    "\n" +
    "\n" +
    "<div class=\"cd-panel-content\">\n" +
    "\n" +
    "\n" +
    "    <div class=\"cd-panel-nav\">\n" +
    "\n" +
    "\n" +
    "        <div class=\" navbar-brand\">Edit Timecard</div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"cd-panel-nav\">\n" +
    "\n" +
    "\n" +
    "        <div class=\" navbar-brand\">{{timecard.user.first_name}} {{timecard.user.last_name}}</div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "        <div class=\"form-group col-sm-5\" style=\"margin-top:20px; position:relative;\">\n" +
    "            <label >CLOCK IN</label>\n" +
    "            <p class=\"input-group \">\n" +
    "                <input date-range-picker id=\"dateRangeClockIn\" name=\"dateRangeClockIn\" class=\"col-sm-4 form-control\"\n" +
    "                       type=\"text\"\n" +
    "                       ng-model=\"editDates.clock_in.date\" options=\"{singleDatePicker: true, parentEl: '#clock-in-container',\n" +
    "                       locale: {format: 'MM/DD/YYYY'},\n" +
    "                   opens:'right',autoApply:true}\"  required/>\n" +
    "\n" +
    "              <span class=\"input-group-btn\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"openDatePicker('#dateRangeClockIn')\">\n" +
    "                    <i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "              </span>\n" +
    "\n" +
    "            </p>\n" +
    "\n" +
    "            <div id=\"clock-in-container\" style=\"position:absolute; top:82px; left:10px;\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-sm-6\" style=\"margin-top:10px;\">\n" +
    "            <uib-timepicker  ng-model=\"editDates.clock_in.time\" ng-change=\"changed(clockInTime,clockOutTime)\"\n" +
    "                             hour-step=\"1\" minute-step=\"1\"\n" +
    "                             show-meridian=\"true\"></uib-timepicker>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "\n" +
    "        <div class=\"form-group col-sm-5\" style=\"margin-top:20px; position:relative;\">\n" +
    "            <label >CLOCK OUT</label>\n" +
    "            <p class=\"input-group \">\n" +
    "                <input date-range-picker id=\"dateRangeClockOut\" name=\"dateRangeClockOut\" class=\"col-sm-4 form-control\"\n" +
    "                       type=\"text\"\n" +
    "                       ng-model=\"editDates.clock_out.date\" options=\"{singleDatePicker: true, parentEl: '#clock-out-container',\n" +
    "                   locale: {format: 'MM/DD/YYYY'},opens:'right',autoApply:true}\"  required/>\n" +
    "\n" +
    "              <span class=\"input-group-btn\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"openDatePicker('#dateRangeClockOut')\">\n" +
    "                    <i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "              </span>\n" +
    "\n" +
    "            </p>\n" +
    "\n" +
    "            <div id=\"clock-out-container\" style=\"position:absolute; top:82px; left:10px;\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-sm-6\" style=\"margin-top:10px;\">\n" +
    "            <uib-timepicker ng-model=\"editDates.clock_out.time\" ng-change=\"changed(clockInTime,clockOutTime)\"\n" +
    "                            hour-step=\"1\" minute-step=\"1\"\n" +
    "                            show-meridian=\"true\"></uib-timepicker>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div style=\"width:100%; margin-bottom:100px; text-align:center; font-size:50px; margin-top:50px;\">\n" +
    "\n" +
    "        {{hours}} Hours\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"cd-panel-footer background-secondary\">\n" +
    "\n" +
    "        <button type=\"submit\" class=\"btn btn-primary pull-right\" ng-click=\"updateTimecard()\">Save</button>\n" +
    "        <button class=\"btn btn-default btn-default pull-right\" ng-click=\"cancelChanges()\">Cancel</button>\n" +
    "    </div>\n" +
    "</div> <!-- cd-panel-content -->\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("team/timecards/summary.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/summary.tpl.html",
    "<div ng-if=\"reportTimecards.length > 0 && loading == false\">\n" +
    "\n" +
    "    <table class=\"table\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th class=\"col-sm-3\">First Names</th>\n" +
    "            <th class=\"col-sm-3\">Last Name</th>\n" +
    "            <th class=\"col-sm-3\" >Shifts Worked</th>\n" +
    "            <th class=\"col-sm-3\">Total Hours</th>\n" +
    "\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "\n" +
    "\n" +
    "        <tr  ng-repeat=\"(key, value) in reportTimecards | groupBy: 'user._id'\">\n" +
    "            <td>{{ value[0].user.first_name }}</td>\n" +
    "            <td>{{ value[0].user.last_name }}</td>\n" +
    "            <td>{{ value.length }}</td>\n" +
    "            <td>{{ userHours(value) }}</td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td colspan=\"3\">Total</td>\n" +
    "\n" +
    "            <td>{{totalHours()}}</td>\n" +
    "        </tr>\n" +
    "\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "</div>");
}]);

angular.module("team/timecards/timecards.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team/timecards/timecards.tpl.html",
    "fds");
}]);

angular.module('templates.common', []);

