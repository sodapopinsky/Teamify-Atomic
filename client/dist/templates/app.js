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
