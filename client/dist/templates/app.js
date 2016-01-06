angular.module('templates.app', ['auth/auth.tpl.html', 'home/home.tpl.html', 'home/sales/calendar.tpl.html', 'home/sales/editCustomProjection.tpl.html', 'home/sales/editDefaultProjection.tpl.html', 'home/sales/sales.tpl.html', 'index.tpl.html', 'inventory/inventory-items/inventory-items.tpl.html', 'inventory/inventory-items/sidepanel/create.tpl.html', 'inventory/inventory-items/sidepanel/edit.tpl.html', 'inventory/inventory-ordering/createForm.tpl.html', 'inventory/inventory-ordering/editForm.tpl.html', 'inventory/inventory-ordering/inventory-ordering.tpl.html', 'inventory/inventory.tpl.html', 'team/team-members/sidepanel/edit.tpl.html', 'team/team-members/sidepanel/new_employee.tpl.html', 'team/team-members/team-members.tpl.html', 'team/team.tpl.html', 'team/timecards/clockedIn.tpl.html', 'team/timecards/index.tpl.html', 'team/timecards/reports.tpl.html', 'team/timecards/shiftdetail.tpl.html', 'team/timecards/sidepanel/create.tpl.html', 'team/timecards/summary.tpl.html', 'team/timecards/timecards.tpl.html']);

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
    "        </div><!-- /.navbar-collapse -->\n" +
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
    "    <tr ng-repeat=\"t in timecards\">\n" +
    "        <td > {{t.user['first_name']}} {{t.user['last_name']}}\n" +
    "        </td>\n" +
    "        <td> {{formatDate(t.clock_in)}}\n" +
    "        </td>\n" +
    "\n" +
    "    </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "\n" +
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
