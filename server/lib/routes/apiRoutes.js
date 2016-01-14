var Notification = require('../models/notification');

var async = require('async');
var morgan = require('morgan');
var moment = require('moment');


var Inventory = require('../models/inventory');
var OrderForm = require('../models/orderform');
var Organization = require('../models/organization');
var Projection = require('../models/projection');
var Position = require('../models/position');
var Task = require('../models/task');

var TaskCompletion = require('../models/taskCompletion');
var EmployeeFile = require('../models/employeeFile');
var Timecard = require('../models/timecard');




exports.addRoutes = function (apiRoutes,User) {

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    // ----------------------------------------------------
    apiRoutes.route('/users')

        .get(function (req, res) {
            User.find(req.params.user_id)
                //populates only unread notifications
                .populate('_notifications', 'message',
                {read_receipts: {$ne: this._id}})
                .exec(function (err, users) {
                    if (err)
                        res.send(err);
                    res.json(users);
                });

        })
        .post(function (req, res) {

            var user = new User();
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.pin = req.body.pin;
            user.status = 1;
            user.updated_at = Date.now();


            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json({message: 'User created!', user: user});
            });

        });

    apiRoutes.route('/users/:user_id')


        .put(function (req, res) {

            User.findOneAndUpdate({_id: req.params.user_id}, req.body, function (err, doc) {
                if (err) return res.send(500, {error: err});
                return res.send(doc);
            });


        });


    apiRoutes.route('/users/:user_id/timecards')


        .get(function (req, res) {
            Timecard.find({'user._id': req.params.user_id})
                .sort({clock_in: -1}).exec(function (err, timecards) {
                    if (err)
                        res.send(err);
                    res.json(timecards);
                });
        });


    // ---------------------------------------------------- Inventory
    apiRoutes.route('/inventory')

        .get(function (req, res) {
            Inventory.find({}, function (err, inventory) {
                res.json(inventory);
            });
        })

        .post(function (req, res) {

            var inventory = new Inventory();
            inventory.name = req.body.name;
            inventory.measurement = req.body.measurement;
            inventory.quantity_on_hand.quantity = req.body.quantity_on_hand.quantity;
            inventory.quantity_on_hand.updated_at = Date.now();
            inventory.par_type = 'simple';
            inventory.par_value = req.body.par_value;
            inventory.updated_at = Date.now();
            inventory.created_at = Date.now();
            inventory.save(function (err) {
                if (err)
                    res.send(err);

                res.json({message: 'Inventory item created!', item: inventory});
            });

        });

    apiRoutes.route('/inventory/:inventory_id')
        .delete(function (req, res) {

            Inventory.remove({_id: req.params.inventory_id}, function (err) {
                if (!err) {
                    res.json({message: 'Inventory item deleted!'});
                }
                else {
                    res.send(err);
                }
            });
        })
        .put(function (req, res) {


            Inventory.findById(req.params.inventory_id, function (err, inventory) {

                if (err) {
                    console.log("error");
                    res.send(err);
                }


                inventory.name = req.body.name;
                inventory.measurement = req.body.measurement;
                inventory.updated_at = Date.now();
                if (inventory.quantity_on_hand.quantity != req.body.quantity_on_hand)
                    inventory.quantity_on_hand.updated_at = Date.now();
                inventory.quantity_on_hand.quantity = req.body.quantity_on_hand.quantity;
                inventory.par_type = req.body.par_type;
                if (req.body.par_value)
                    inventory.par_value = parseFloat(req.body.par_value);
                if (req.body.usage_per_thousand)
                    inventory.usage_per_thousand = parseFloat(req.body.usage_per_thousand);
                inventory.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: 'Item updated!', item: inventory});
                });

            });
        });


    ///////Order Forms
    apiRoutes.route('/orderforms')
        .get(function (req, res) {
            OrderForm.find({}, function (err, orderform) {
                res.json(orderform);
            });
        })

        .post(function (req, res) {

            var orderform = new OrderForm();
            orderform.name = req.body.name;
            orderform.items = req.body.items;
            orderform.created_at = Date.now(),
                orderform.updated_at = Date.now()

            orderform.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Order Form created!', orderform: orderform});
            });

        });


    apiRoutes.route('/orderforms/:id')
        .delete(function (req, res) {

            OrderForm.remove({_id: req.params.id}, function (err) {
                if (!err) {
                    res.json({message: 'Order Form deleted!'});
                }
                else {
                    res.send(err);
                }
            });
        })
        .put(function (req, res) {

            // use our bear model to find the bear we want
            OrderForm.findById(req.params.id, function (err, orderform) {

                if (err)
                    res.send(err);

                orderform.items = req.body.items;


                orderform.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: 'Orderform updated!', orderform: orderform});
                });

            });
        });


    ///////ORGANIZATION
    apiRoutes.route('/organization/:id')
        .get(function (req, res) {
            Organization.find({}, function (err, organization) {
                res.json(organization);
            });
        })

    ///////Projection
    apiRoutes.route('/projections')
        .post(function (req, res) {

            var projection = new Projection();
            projection.date = moment(req.body.date).toDate();
            projection.organization = req.body.organization;
            projection.projection = req.body.projection;


            projection.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Created!', projection: projection});
            });

        });

    apiRoutes.route('/projections/:id')
        .get(function (req, res) {


            var start = moment(req.query.start).startOf('day');
            var end = moment(req.query.end).endOf('day');

            Projection.find({
                date: {
                    $gte: start.toDate(),
                    $lte: end.toDate()
                }
            }, function (err, projection) {

                res.json(projection);
            });

        });

    apiRoutes.route('/projections/update_default')
        .put(function (req, res) {


            Organization.findOne({}, function (err, organization) {
                if (err)
                    res.send(err);

                var arr = organization.default_projections;

                arr[req.body.day] = req.body.projection;
                organization.update({default_projections: arr}, null, function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: ' updated'});
                });


            });

        })

    ///////Timecard
    apiRoutes.route('/timecards')
        .get(function (req, res) {

            Timecard.find()
                .or(
                [
                    {
                        clock_in: {
                            $gt: moment(req.query.start).startOf('day').toDate(),
                            $lt: moment(req.query.end).startOf('day').toDate()
                        }
                    },
                    {
                        clock_out: {
                            $gt: moment(req.query.start).startOf('day').toDate(),
                            $lt: moment(req.query.end).endOf('day').toDate()
                        }
                    },
                    {
                        clock_out: {$gt: moment(req.query.end).startOf('day').toDate()},
                        clock_in: {$lt: moment(req.query.end).endOf('day').toDate()}
                    }
                ]
            )
                .exec(function (err, records) {
                    if (err)
                        res.send(err);
                    res.json(records);
                });
        })

        .post(function (req, res) {

            var timecard = new Timecard();

            timecard.user = req.body.user;
            timecard.clock_in = moment(req.body.clock_in).toDate();
            timecard.clock_out = moment(req.body.clock_out).toDate();


            timecard.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Created!'});
            });

        });

    apiRoutes.route('/timecards/:id')
        .put(function (req, res) {

            Timecard.findById(req.body._id, function (err, timecard) {
                if (err)
                    res.send(err);

                timecard.update({
                    clock_in: moment(req.body.clock_in).toDate(),
                    clock_out: moment(req.body.clock_out).toDate()
                }, null, function (err) {
                    if (err)
                        res.send(err);

                    res.json({message: ' updated'});
                });


            })
        });


    apiRoutes.route('/opentimecards')
        .get(function (req, res) {

            Timecard.find({clock_out: null})
                .populate("_position")
                .exec(function (err, timecards) {
                    if (err)
                        res.send(err);
                    res.send(timecards);
                })
        });

    // ---------------------------------------------------- SYNC
    apiRoutes.route('/sync/users')

        .post(function (req, res) {


            User.find({}, function (err, users) {
                res.json(users);
            });

        });

    apiRoutes.route('/sync/timecards')

        .post(function (req, res) {
            var synced = [];
            async.each(req.body.timecards, function (value, callback) {

                Timecard.findOne({guid: value.guid}, function (err, doc) {
                    var clock_out = null;

                    if (value.clock_out)
                        clock_out = moment(value.clock_out).toDate();

                    if (doc) {
                        doc.clock_out = clock_out;
                        doc.synced_at = Date.now();
                        doc.save(function (err, item) {
                            if (err) {
                                console.log(err);
                            }
                            synced.push(item);
                            callback();
                        });
                    }
                    else {
                        var timecard = new Timecard({
                            user: value.user,
                            guid: value.guid,
                            clock_in: moment(value.clock_in).toDate(),
                            clock_out: clock_out,
                            _position: value.position._id,
                            synced_at: Date.now()
                        });
                        timecard.save(function (err, item) {
                            if (err) {
                                console.log(err);
                            }
                            synced.push(timecard);
                            callback();
                        });
                    }


                });//


            }, function (error) {
                if (error) res.json(500, {error: error});
                console.log(synced);
                res.send(synced);

            });


        });


    /**
     * @route "api/tasks"
     */

    apiRoutes.route('/tasks')

    /**
     * @request GET
     * @tmf Should accept organization parameter and filter for organization
     * @returns {array} An array of all tasks for the organization
     */
        .get(function (req, res) {
            Task
                .find({})
                .populate('_position')
                .exec(function (err, tasks) {
                    if (err) {
                        res.send(err)
                    }
                    res.json(tasks);
                });
        })
    /**
     * @request POST
     * @param {name} The name of the task
     * @param {description} The description of the task
     * @tmf Should accept organization parameter and create for organization
     * @returns {json} The newly created Task object
     */
        .post(function (req, res) {

            var task = new Task();
            task.name = req.body.name;
            task.description = req.body.description;
            task.updated_at = Date.now();
            task._position = req.body.position._id;

            task.save(function (err) {
                if (err)
                    res.send(err);
                res.json(task);
            });
        });

    /**
     * @route "api/tasks/:_id"
     */
    apiRoutes.route('/tasks/:_id')

    /**
     * @request PUT
     * @param {string | _id} The id of the task
     * @body {string | name} The name of the task
     * @body {string | description} Description of the task
     * @body {Position | _position} Position the task is assigned ot
     * @return {json} The updated task
     */
        .put(function (req, res) {
            Task.findById(req.params._id, function (err, task) {
                if (err)
                    res.send(err);
                task.update({
                    name: req.body.name,
                    description: req.body.description,
                    _position: req.body._position._id
                }, null, function (err) {
                    if (err)
                        res.send(err);

                    res.json(task);
                });


            })
        });

    /**
     * @route "api/positions"
     */
    apiRoutes.route('/positions')

    /**
     * @request GET
     * @tmf Should accept organization parameter and filter for organization
     * @returns {array} An array of all positions for the organization
     */
        .get(function (req, res) {
            Position
                .find({})
                .exec(function (err, positions) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(positions);
                });

        })

    /**
     * @request POST
     * @body {name} The name of the position
     * @returns {json} The newly created position object
     */
        .post(function (req, res) {
            var position = new Position();
            position.name = req.body.name;
            position.updated_at = Date.now();
            position.save(function (err) {
                if (err)
                    res.send(err);
                res.json(position);
            });
        });


    /**
     * @route "api/taskcompletions"
     */
    apiRoutes.route('/taskcompletions')

    /**
     * @request GET
     * @tmf Should accept organization parameter and filter for organization
     * @query {date} The date for the completions
     * @returns {array} An array of all task completions for a date
     */
        .get(function (req, res) {
            var start = moment(req.query.date).startOf('day');
            var end = moment(req.query.date).endOf('day');

            var query = TaskCompletion.find({
                date: {
                    $gte: start.toDate(),
                    $lte: end.toDate()
                }
            }).populate('_user');

            query.exec(function (err, completion) {
                if (err)
                    res.send(err);
                console.log(completion);
                res.json(completion);
            })
        })
    /**
     * @request POST
     * @tmf Should accept organization parameter and filter for organization
     * @param {date} The date of the completion
     * @param {userId} The id of the user who completed the task
     * @param {taskId} The id of the task
     * @returns {json} The newly created completion object
     */
        .post(function (req, res) {
            var taskCompletion = new TaskCompletion();
            taskCompletion._user = req.body.userId;
            taskCompletion._task = req.body.taskId;
            taskCompletion.guid = req.body.guid;
            taskCompletion.date = moment(req.body.date).toDate();

            taskCompletion.save(function (err, result) {
                if (err)
                    res.send(err);
                res.json(result);
            });
        });

    /**
     * @route "api/taskcompletions/:guid"
     */
    apiRoutes.route('/taskcompletions/:guid')

    /**
     * @request DELETE
     * @param {guid} The guid of the task completion
     * @returns {json} Success
     */
        .delete(function (req, res) {
            TaskCompletion.remove({guid: req.params.guid}, function (err) {
                if (!err) {
                    res.json("Success!");
                }
                else {
                    res.send(err);
                }
            });
        });

    /**
     * @route "api/employeefile"
     */
    apiRoutes.route('/employeefile')
    /**
     * @request POST
     * @param {guid}
     * @param {userId}
     * @param {entryType}
     * @param {createdBy}
     * @returns {json} the created object
     */
        .post(function (req, res) {
            var employeeFile = new EmployeeFile();
            employeeFile._user = req.body.userId;
            employeeFile.guid = req.body.guid;
            employeeFile.updated_at = moment().toDate();
            employeeFile.entry_type = req.body.entryType;
            employeeFile.entry = req.body.entry;
            employeeFile._created_by = req.body.createdBy;


            employeeFile.save(function (err, result) {
                if (err)
                    res.send(err);
                res.json(result);
            });
        });


    /**
     * @route "api/employeefile/:id"
     */
    apiRoutes.route('/employeefile/:id')

    /**
     * @request GET
     */
        .get(function (req, res) {

            var query = EmployeeFile.find({_user: req.params.id})
                .populate('_created_by')
                .sort({updated_at: -1});

            query.exec(function (err, results) {
                if (err)
                    res.send(err);

                res.json(results);
            })
        })


    /**
     * @route api/notifications
     */

    apiRoutes.route('/notifications')

    /**
     * @request POST
     */
        .post(function (req, res) {

            Notification.create(req.body, function (err, doc) {
                if (err) return res.send(500, {error: err});

                User.update({_id: {"$in": req.body.recipients}}, {$push: {"_notifications": doc._id}}, {},
                    function (err,users) {
                    if (err) return res.send(500, {error: err});
                    console.log(users);
                    return res.send(doc);
                })
            })

        });


    /**
     * @route api/notifications/markread
     */
    apiRoutes.route('/notifications/markread')

    /**
     * @request PUT
     * @description Mark some notifications as read
     * @param {string | user_id} The id of the user
     * @param {array | notificationIds}
     */
        .put(function (req, res) {

            var ids = [];
            for (var i = 0; i < req.body.notificationIds.length; i++) {
                ids.push(req.body.notificationIds[i]._id);
            }

            //@tmf how to push only if not exists?
            Notification.update({_id: {"$in": ids}},
                {$push: {"read_receipts": req.body.user_id}}, {multi: true},
                function (err, items) {
                    if (err) return res.send(500, {error: err});
                    return res.send(items);
                });
        });

};
