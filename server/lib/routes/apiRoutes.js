var User   = require('../models/user');
var Inventory   = require('../models/inventory');
var OrderForm   = require('../models/orderform');
var Organization   = require('../models/organization');
var Projection   = require('../models/projection');
var Timecard   = require('../models/timecard');
var morgan = require('morgan');
var moment = require('moment');
var async = require('async');
exports.addRoutes = function(apiRoutes) {


    function guid(){
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

        .get(function(req, res) {

            User.find({}, function(err, users) {
                res.json(users);
            });
        })


        .post(function(req, res) {

        var user = new User();
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.pin = req.body.pin;
            user.status = 1;
            user.updated_at = Date.now();

        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!', user: user });
        });

    });

    apiRoutes.route('/users/:user_id')


        .put(function(req, res) {

            // use our bear model to find the bear we want
            User.findById(req.params.user_id, function(err, user) {

                if (err)
                    res.send(err);

                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                user.pin = req.body.pin;
                user.status = req.body.status;
                user.updated_at = Date.now();

               user.save(function(err,user) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'User updated!' , user: user });
                });

            });
        });



    // ---------------------------------------------------- Inventory
    apiRoutes.route('/inventory')

        .get(function(req, res) {
            Inventory.find({}, function(err, inventory) {
                res.json(inventory);
            });
        })

        .post(function(req, res) {

            var inventory = new Inventory();
            inventory.name = req.body.name;
            inventory.measurement = req.body.measurement;
            inventory.quantity_on_hand.quantity = req.body.quantity_on_hand.quantity;
            inventory.quantity_on_hand.updated_at = Date.now();
            inventory.par_type = 'simple';
            inventory.par_value = req.body.par_value;
            inventory.updated_at = Date.now();
            inventory.created_at = Date.now();
            inventory.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Inventory item created!', item: inventory });
            });

        });

    apiRoutes.route('/inventory/:inventory_id')
        .delete(function(req, res) {

            Inventory.remove({ _id: req.params.inventory_id }, function(err) {
                if (!err) {
                    res.json({ message: 'Inventory item deleted!'});
                }
                else {
                    res.send(err);
                }
            });
        })
        .put(function(req, res) {


            Inventory.findById(req.params.inventory_id, function(err, inventory) {

                if (err){
                    console.log("error");
                    res.send(err);
                }


                inventory.name = req.body.name;
                inventory.measurement = req.body.measurement;
                inventory.updated_at = Date.now();
                if(inventory.quantity_on_hand.quantity != req.body.quantity_on_hand)
                    inventory.quantity_on_hand.updated_at = Date.now();
                inventory.quantity_on_hand.quantity = req.body.quantity_on_hand.quantity;
                inventory.par_type = req.body.par_type;
                if(req.body.par_value)
                inventory.par_value = parseFloat(req.body.par_value);
                if(req.body.usage_per_thousand)
                inventory.usage_per_thousand = parseFloat(req.body.usage_per_thousand);
                inventory.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Item updated!', item:inventory });
                });

            });
        });


    ///////Order Forms
    apiRoutes.route('/orderforms')
        .get(function(req, res) {
            OrderForm.find({}, function(err, orderform) {
                res.json(orderform);
            });
        })

        .post(function(req, res) {

            var orderform = new OrderForm();
            orderform.name = req.body.name;
            orderform.items = req.body.items;
            orderform.created_at = Date.now(),
            orderform.updated_at = Date.now()

            orderform.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Order Form created!', orderform: orderform });
            });

        });


    apiRoutes.route('/orderforms/:id')
        .delete(function(req, res) {

           OrderForm.remove({ _id: req.params.id }, function(err) {
                if (!err) {
                    res.json({ message: 'Order Form deleted!'});
                }
                else {
                    res.send(err);
                }
            });
        })
        .put(function(req, res) {

        // use our bear model to find the bear we want
        OrderForm.findById(req.params.id, function(err, orderform) {

            if (err)
                res.send(err);

              orderform.items = req.body.items;


            orderform.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Orderform updated!', orderform: orderform });
            });

        });
    });



    ///////ORGANIZATION
    apiRoutes.route('/organization/:id')
        .get(function(req, res) {
            Organization.find({}, function(err, organization) {
                res.json(organization);
            });
        })

    ///////Projection
    apiRoutes.route('/projections')
        .post(function(req, res) {

            var projection = new Projection();
            projection.date = moment(req.body.date).toDate();
            projection.organization = req.body.organization;
            projection.projection = req.body.projection;


            projection.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Created!', projection:projection });
            });

        });

    apiRoutes.route('/projections/:id')
        .get(function(req, res) {


            var start = moment(req.query.start).startOf('day');
            var end = moment(req.query.end).endOf('day');

            Projection.find({
                date: {
                    $gte: start.toDate(),
                    $lte: end.toDate()
                }
            }, function(err, projection) {

                res.json(projection);
            });

        });

    apiRoutes.route('/projections/update_default')
        .put(function(req, res) {


            Organization.findOne({},function(err, organization) {
                if (err)
                    res.send(err);

                var arr = organization.default_projections;

                arr[req.body.day] = req.body.projection;
                organization.update({default_projections: arr }, null, function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: ' updated'});
                });




            });

        })

    ///////Timecard
    apiRoutes.route('/timecards')
        .get(function(req, res) {

            Timecard.find()
                .or(
                [
                    {
                        clock_in:
                        {$gt: moment(req.query.start).startOf('day').toDate(),
                          $lt: moment(req.query.end).startOf('day').toDate()
                        }
                    },
                    {
                        clock_out:
                        {$gt: moment(req.query.start).startOf('day').toDate(),
                            $lt: moment(req.query.end).endOf('day').toDate()
                        }
                    },
                    {
                        clock_out:
                        {$gt: moment(req.query.end).startOf('day').toDate()},
                        clock_in:
                        {$lt: moment(req.query.end).endOf('day').toDate()}
                    }
                ]
                  )
                .exec(function (err, records) {
                    if (err)
                        res.send(err);
                    res.json(records);
                });
        })

            .post(function(req, res) {

            var timecard = new Timecard();

            timecard.user = req.body.user;
            timecard.clock_in = moment(req.body.clock_in).toDate();
            timecard.clock_out = moment(req.body.clock_out).toDate();


            timecard.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Created!'});
            });

        });

    apiRoutes.route('/timecards/:id')
        .put(function(req, res) {

            Timecard.findById(req.body._id, function(err, timecard) {
                if (err)
                    res.send(err);
                 console.log(timecard);
                timecard.update({
                    clock_in:moment(req.body.clock_in).toDate(),
                    clock_out:moment(req.body.clock_out).toDate()
                }, null, function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: ' updated'});
                });




            })
        });


    apiRoutes.route('/opentimecards')
        .get(function(req, res) {

            Timecard.find({clock_out: null}, function(err, timecards) {
                if (err)
                    res.send(err);
                res.send(timecards);
            })
        });

    // ---------------------------------------------------- SYNC
    apiRoutes.route('/sync/users')

        .post(function(req, res) {


            User.find({}, function(err, users) {
                res.json(users);
            });

        });

    apiRoutes.route('/sync/timecards')

        .post(function(req, res) {
            var synced = [];
            async.each(req.body.timecards, function (value, callback) {


                Timecard.findOne({guid:value.guid}, function (err, doc) {
                    var clock_out = null;

                    if(value.clock_out)
                        clock_out = moment(value.clock_out).toDate();

                    if(doc){
                        console.log("found");

                        doc.clock_out = clock_out;
                        doc.synced_at = Date.now();
                        doc.save(function(err, item){
                            if (err){
                                console.log(err);
                            }
                            synced.push(item);
                            callback();

                        });
                    }
                    else{

                        var timecard = new Timecard({
                            user: value.user,
                            guid: value.guid,
                            clock_in: moment(value.clock_in).toDate(),
                            clock_out: clock_out,
                            synced_at: Date.now()
                        });

                        timecard.save(function(err, item){
                            if (err){
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


/*
            if(req.body.timecards[0])
            {
                var guid = req.body.timecards[0].guid;

                var value = req.body.timecards[0];
                Timecard.findOne({guid:guid}, function (err, doc) {
                    var clock_out = null;

                    if(value.clock_out)
                        clock_out = moment(value.clock_out).toDate();

                    if(doc){
                        console.log("found");

                        doc.clock_out = clock_out;
                        doc.synced_at = Date.now();
                        doc.save(function(err, item){
                            if (err){
                                console.log(err);
                            }
                            console.log("saved" + item);

                        });
                    }
                    else{


                        console.log("notfound");
                        var timecard = new Timecard({
                            user: value.user,
                            guid: value.guid,
                            clock_in: moment(value.clock_in).toDate(),
                            clock_out: clock_out,
                            synced_at: Date.now()
                        });

                        timecard.save(function(err, item){
                            if (err){
                                console.log(err);
                            }
                            console.log("saved" + item);

                        });
                    }


                });//

            }

            res.json({done: "done"});

*/







            /*

            async.each(req.body.timecards, function (value, callback) {


                Timecard.findOne({ guid:value.guid }, function (err, doc){
                    doc.clock_out = Date.now();
                    console.log(doc);
                    doc.save(function(){
                        callback();
                    });
                });




 Timecard.update({guid:value.guid}, { $set: { clock_out: Date.now()}},
 null, function(){
 callback();
 });

 Timecard.find({guid:value.guid}, function(err, timecards) {

                    if(err)
                        console.log(err);
                    var clock_out = null;

                    if(value.clock_out)
                    clock_out = moment(value.clock_out).toDate();

                    console.log("clockout" + clock_out);

                    //Update existing timecard
                    if(timecards.length > 0){
                        var timecard = timecards[0];
                        timecard.update({
                            clock_out: Date.now()
                        }, null, function(err,tim) {
                            if (err)
                                console.log(err);
                            console.log("updated");
                            console.log(tim);
                            callback();
                        });


                        timecard.clock_out = clock_out;
                        timecard.synced_at =  c;
                    }
                    //Create new timecard
                    else{
                        var timecard = new Timecard({});
                        timecard.user = value.user;
                        timecard.guid = valtimeue.guid;
                        timecard.clock_in = moment(value.clock_in).toDate();
                        timecard.clock_out = clock_out;
                        timecard.synced_at = Date.now();

                        timecard.save(function(err, item){
                            if (err){
                                console.log(err);
                            }
                            console.log("saved" + item);
                            callback();
                        });

                    }


                });


        }, function (error) {
            if (error) res.json(500, {error: error});
                Timecard.find({clock_out:null}, function(err, timecards) {
                    res.send(timecards);
                });


        });


        });

             */
};