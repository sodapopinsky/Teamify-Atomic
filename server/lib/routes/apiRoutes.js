var User   = require('../models/user');

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



};