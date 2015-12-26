angular.module('templates.app', ['auth/auth.tpl.html']);

angular.module("auth/auth.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("auth/auth.tpl.html",
    "<div>\n" +
    "    dfdfsfd\n" +
    "</div>");
}]);
