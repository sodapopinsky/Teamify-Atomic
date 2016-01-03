
angular.module('directives.calendar',[]).
    directive("calendar", function(projection) {
        return {
            restrict: "E",
            templateUrl: "home/sales/calendar.tpl.html",
            scope: false,
            link: function (scope) {
                scope.selected = _removeTime(scope.selected || moment());
                scope.month = scope.selected.clone();
                scope.loading = false;
                var start = scope.selected.clone();
                start.date(1);
                _removeTime(start.day(0));

                _buildMonth(scope, start, scope.month);


                scope.next = function () {

                    scope.loading = true;
                    var from = scope.month.clone();
                    var to = from.clone().add(1, 'month');
                    var start = to.clone().startOf('month').utc().format();
                    var end = to.clone().endOf('month').utc().format();
                    scope.currentMonth = to.clone();
                    projection.getProjectionsForDateRange(start, end).$promise.then(function (response) {

                        projection.data.projections = response;
                        var next = scope.month.clone();

                        _removeTime(next.month(next.month() + 1).date(1));
                        scope.month.month(scope.month.month() + 1);
                        _buildMonth(scope, next, scope.month);
                        scope.loading = false;
                    });



                };

                scope.goCustomProjection = function(day) {


                    if (!day.date.isSame(scope.month, 'month'))
                        return;

                    scope.customProjection(day.date);

                };

                scope.previous = function () {

                    scope.loading = true;
                    var previous = scope.month.clone();
                    var current = previous.clone().subtract(1, 'month');
                    var start = current.clone().startOf('month').utc().format();
                    var end = current.clone().endOf('month').utc().format();
                    scope.currentMonth = current.clone();
                    projection.getProjectionsForDateRange(start, end).$promise.then(function (response) {

                        projection.data.projections = response;
                        console.log(previous.month() - 1);

                        _removeTime(previous.month(previous.month() - 1).date(1));
                        scope.month.month(scope.month.month() - 1);
                        _buildMonth(scope, previous, scope.month);
                        scope.loading = false;
                    });


                };
            }
        };



        function _removeTime(date) {
            return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        }

        function _buildMonth(scope, start, month) {
            scope.weeks = [];
            var done = false, date = start.clone(), monthIndex = date.month(), count = 0;

            while (!done) {
                scope.weeks.push({ days: _buildWeek(date.clone(), month) });
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
        }

        function _buildWeek(date, month) {
            var days = [];


            for (var i = 0; i < 7; i++) {

                    days.push({
                        name: date.format("dd").substring(0, 1),
                        number: date.date(),
                        isCurrentMonth: date.month() === month.month(),
                        isToday: date.isSame(new Date(), "day"),
                        date: date
                    });


                date = date.clone();
                date.add(1, "d");
            }

            return days;
        }


    });