// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var config = require('./config');
var jwt    = require('jsonwebtoken');
var User   = require('./lib/models/user');
var security = require('./lib/security');

// configuration =================

//mongoose.connect(config.database);     // connect to mongoDB database //'mongodb://localhost/'
//on mac: export MONGOLAB_URI="mongodb://crash:joehorn@ds037205.mongolab.com:37205/teamify-dev"


/*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */
//var mongodbUri = 'mongodb://heroku_dhgtspdz:rva9lpi2br503uspmangtj2omh@ds037215.mongolab.com:37215/heroku_dhgtspdz';

//mongoose.connect(mongodbUri, options);fdds


if(process.env.MONGOLAB_URI){
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});}
else{
    mongoose.connect("mongodb://crash:joehorn@ds037205.mongolab.com:37205/teamify-dev");
}



app.set('superSecret', config.secret); // secret variable
//app.use(express.static(__dirname + '/static'));

       app.use(express.static(__dirname + '/../client/dist'));   // set the static files location /public/img will be /img for users
//app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(morgan('dev'));

app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================

app.set('port', (process.env.PORT || 8080));
console.log("App listening on port 8080");

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
// define model =================



app.get('/', function(req, res) {
    var path = require('path');
    res.sendfile(path.resolve('../client/dist/index.html'));

});


app.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
        first_name: 'Joe',
        last_name: 'Spitale',
        email: 'joe@theatomicburger.com',
        password: 'password',
        admin: true
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

var apiRoutes = express.Router();


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        email: req.body.email
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            return res.status(401).send({
               error: 'Authentication failed. User not found.'
            });
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                return res.status(401).send({
                    error: 'Authentication failed. Wrong Password.'
                });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    user: user
                });
            }

        }

    });
});



require('./lib/routes/security').addRoutes(app, security);
// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});


app.get('/api/authenticate/user', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {

    User.find({}, function(err, users) {
        res.json(users);
    });
});

app.use('/api', apiRoutes);
