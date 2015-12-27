angular.module('templates.app', ['auth/auth.tpl.html', 'index.tpl.html', 'team/team.tpl.html']);

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
    "            <a  ui-sref-active-if=\"app.team\" ui-sref=\"app.team.team-members\">\n" +
    "                <span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span><p>TEAM</p></a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a  ui-sref-active-if=\"app.inventory\" ui-sref=\"app.inventory.items\">\n" +
    "                <span class=\"glyphicon glyphicon-list-alt\" aria-hidden=\"true\"></span><p>INVENTORY</p></a>\n" +
    "        </li>\n" +
    "\n" +
    "        <!--\n" +
    "           <li >\n" +
    "            <a  ng-class=\"{active: sidebarTab == 'checklist',inactive: sidebarTab != 'checklist' }\"\n" +
    "                href=\"/#/checklist\">Tasks</a>\n" +
    "        </li>\n" +
    "        <li >\n" +
    "            <a  ng-class=\"{active: sidebarTab == 'ordering',inactive: sidebarTab != 'ordering' }\"\n" +
    "                href=\"/#/ordering/inventory\">Ordering</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <h5 ng-if=\"authenticated\">{{currentUser.first_name}} {{currentUser.last_name}}</h5>\n" +
    "            <button class=\"btn btn-danger\" ng-click=\"logout()\">Logout</button>\n" +
    "        </li>\n" +
    "        -->\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"wrapper\">\n" +
    "\n" +
    "\n" +
    "    <div ui-view =\"content\" ></div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
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
