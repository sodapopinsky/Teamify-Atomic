
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