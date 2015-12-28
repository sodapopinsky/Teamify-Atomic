/*! teamify - v0.0.1 - 2015-12-28
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
    'templates.app']);

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

angular.module('inventory-items',[])
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
            });

    });




angular.module('inventory-items').controller('InventoryItemsController', function($scope) {



});
angular.module('inventory', ['inventory-items'])

    .config(function($stateProvider){
        $stateProvider
            .state('app.inventory', {
                abstract: true,
                views: {
                    "content@app": {
                        templateUrl: "inventory/inventory.tpl.html"
                    }
                }
            });
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
            template: '<div class="center-block text-center"><img src="images/spinner.gif" style="width:30px; height:30px;"></div>',
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

angular.module('templates.app', ['auth/auth.tpl.html', 'index.tpl.html', 'inventory/inventory-items/inventory-items.tpl.html', 'inventory/inventory.tpl.html', 'team/team-members/sidepanel/edit.tpl.html', 'team/team-members/sidepanel/new_employee.tpl.html', 'team/team-members/team-members.tpl.html', 'team/team.tpl.html']);

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
    "        <span class=\"glyphicon glyphicon-comment\"></span>\n" +
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
    "        <li ui-sref-active-if=\"app.team.timecards\" ui-sref=\"app.team.timecards.reports.summary\">Timecards</li>\n" +
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

angular.module('templates.common', []);

