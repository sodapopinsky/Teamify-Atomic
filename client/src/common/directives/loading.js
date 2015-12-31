

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