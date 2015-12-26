angular.module('templates.app', ['auth/auth.tpl.html']);

angular.module("auth/auth.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("auth/auth.tpl.html",
    "<div>\n" +
    "    dfdfsfd\n" +
    "    <button type=\"button\" class=\"btn btn-default\" aria-label=\"Left Align\">\n" +
    "        <span class=\"glyphicon glyphicon-align-left\" aria-hidden=\"true\"></span>\n" +
    "    </button>\n" +
    "\n" +
    "</div>");
}]);
