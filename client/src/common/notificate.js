
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