var User   = require('../models/user');
var Inventory   = require('../models/inventory');
var OrderForm   = require('../models/orderform');
var morgan = require('morgan');
exports.addRoutes = function(apiRoutes) {


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

               user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'User updated!' });
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


};