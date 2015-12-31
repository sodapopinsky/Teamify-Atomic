
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