// server.js
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
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
var Inventory   = require('./lib/models/inventory');
var Organization   = require('./lib/models/organization');
var Projection   = require('./lib/models/projection');
var moment = require('moment');
var async = require('async');
app.use(allowCrossDomain);

mongoose.connect(config.databaseURI(process.env.MONGOLAB_URI));

app.set('superSecret', config.secret); // secret variable
app.use(express.static(__dirname + '/../client/dist'));   // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
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

    // create a sample user test
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

app.get('/setup/organization', function(req, res) {

    // create a sample user test
    var org = new Organization({
        name: 'Atomic Burger',
        default_projections: [1000,2000,3000,4000,5000,6000,7000]
    });

    // save the sample user
    org.save(function(err) {
        if (err) throw err;

        console.log('saved successfully');
        res.json({ success: true });
    });
});



app.get('/setup/inventory', function(req, res) {
  var inv =  [{"id":99,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:22:35","deleted_at":null,"name":"10 in red straws","measurement":"1 case","quantity_on_hand":"2","par":"2"},{"id":50,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:59:38","deleted_at":null,"name":"1\/2 Gallon Ketchup","measurement":"1\/2 Gallon","quantity_on_hand":"20","par":"36"},{"id":49,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:59:24","deleted_at":null,"name":"1\/2 Gallon Mustard","measurement":"1\/2 Gallon","quantity_on_hand":"0","par":"6"},{"id":106,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:23:16","deleted_at":null,"name":"12 oz drink cups","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":123,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:24:44","deleted_at":null,"name":"12 oz fry cups","measurement":"1 case","quantity_on_hand":"6","par":"3"},{"id":102,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:22:56","deleted_at":null,"name":"12 oz kids drink cup","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":124,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:24:47","deleted_at":null,"name":"16 oz fry cups","measurement":"1 case","quantity_on_hand":"6","par":"1.5"},{"id":105,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:23:10","deleted_at":null,"name":"16 oz Milkshake Cups","measurement":"1 case","quantity_on_hand":"2","par":"2"},{"id":100,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:14:46","deleted_at":null,"name":"16SL drink lids (small)","measurement":"1 case","quantity_on_hand":"3","par":"4"},{"id":55,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:00:17","deleted_at":null,"name":"1 Cleaner","measurement":"1 Unit","quantity_on_hand":"2","par":"3"},{"id":104,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:23:06","deleted_at":null,"name":"20 oz drink cup (regular)","measurement":"1 case","quantity_on_hand":"3","par":"4"},{"id":101,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:14:42","deleted_at":null,"name":"20SL drink lids (large)","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":103,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:22:59","deleted_at":null,"name":"32 oz drink cup (large)","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":54,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:00:14","deleted_at":null,"name":"3 Glass and Hard Surface Cleaner","measurement":"1 jug","quantity_on_hand":"6","par":"2"},{"id":53,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-29 10:27:02","deleted_at":null,"name":"6 Degreaser","measurement":"1 each (6 per case)","quantity_on_hand":"3","par":"4"},{"id":98,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:22:32","deleted_at":null,"name":"7 in red straws","measurement":"1 case","quantity_on_hand":"2","par":"0.5"},{"id":122,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:24:40","deleted_at":null,"name":"8 oz fry cups","measurement":"1 case","quantity_on_hand":"6","par":"1"},{"id":4,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 17:10:54","deleted_at":null,"name":"Aluminum Foil","measurement":"1 each","quantity_on_hand":"3","par":"1"},{"id":81,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:07:59","deleted_at":null,"name":"American Cheese","measurement":"Case (20 Lb)","quantity_on_hand":"7","par":"8"},{"id":43,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:55:26","deleted_at":null,"name":"Apple Cider Vinegar","measurement":"Jug","quantity_on_hand":"0","par":"1"},{"id":87,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:09:29","deleted_at":null,"name":"Apple Pie Filling","measurement":"1 jug","quantity_on_hand":"5","par":"3"},{"id":2,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 17:10:45","deleted_at":null,"name":"Atomic Burger bags","measurement":"1 case","quantity_on_hand":"2","par":"2"},{"id":75,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:06:33","deleted_at":null,"name":"Bacon","measurement":"Case (20 Lb)","quantity_on_hand":"3","par":"4"},{"id":6,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-29 10:33:41","deleted_at":null,"name":"Balsamic Vinegar of Modena","measurement":"1 Jug","quantity_on_hand":"0","par":"1"},{"id":94,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:13:28","deleted_at":null,"name":"Barqs","measurement":"5 Gallon Bag in Box","quantity_on_hand":"2","par":"2"},{"id":73,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:05:31","deleted_at":null,"name":"Beef - Brisket","measurement":"Lbs","quantity_on_hand":"198","par":"0"},{"id":72,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:06:15","deleted_at":null,"name":"Beef - Chuck","measurement":"Lbs","quantity_on_hand":"217","par":"0"},{"id":44,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:57:50","deleted_at":null,"name":"Black Pepper","measurement":"Jug","quantity_on_hand":"6","par":"3"},{"id":56,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:00:24","deleted_at":null,"name":"Bleach","measurement":"1 Jug","quantity_on_hand":"5","par":"3"},{"id":110,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:23:40","deleted_at":null,"name":"Blue Mop Heads","measurement":"1 each","quantity_on_hand":"3","par":"5"},{"id":48,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:58:52","deleted_at":null,"name":"Blue Plate Mayo Jug","measurement":"1 Jug","quantity_on_hand":"16","par":"12"},{"id":71,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:03:47","deleted_at":null,"name":"Bottled Water","measurement":"1 case","quantity_on_hand":"2","par":"3"},{"id":36,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:54:49","deleted_at":null,"name":"Brown Sugar","measurement":"Box","quantity_on_hand":"0","par":"6"},{"id":25,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:56:33","deleted_at":null,"name":"Caramel Sauce","measurement":"Jug","quantity_on_hand":"5","par":"6"},{"id":80,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:07:51","deleted_at":null,"name":"Cheddar","measurement":"5 Lb Bag","quantity_on_hand":"2","par":"4"},{"id":60,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:01:51","deleted_at":null,"name":"Cheesecake Pieces","measurement":"Tray","quantity_on_hand":"9","par":"4"},{"id":133,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:18:25","deleted_at":null,"name":"Chicken Base Soup","measurement":"1 Can","quantity_on_hand":"1","par":"6"},{"id":83,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-29 10:39:07","deleted_at":null,"name":"Chocolate Chip Pieces","measurement":"Box","quantity_on_hand":"1","par":"2"},{"id":27,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:56:41","deleted_at":null,"name":"Chocolate Sauce","measurement":"Jug","quantity_on_hand":"2","par":"2"},{"id":24,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:56:26","deleted_at":null,"name":"Cocoa Powder","measurement":"Bag","quantity_on_hand":"5","par":"6"},{"id":91,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:13:18","deleted_at":null,"name":"Coke","measurement":"5 Gallon Bag in Box","quantity_on_hand":"2","par":"3"},{"id":95,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:13:32","deleted_at":null,"name":"Coke Zero","measurement":"5 Gallon Bag in Box","quantity_on_hand":"2","par":"2"},{"id":92,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:13:20","deleted_at":null,"name":"Diet Coke","measurement":"5 Gallon Bag in Box","quantity_on_hand":"2","par":"2"},{"id":47,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:58:42","deleted_at":null,"name":"Dip & Squeeze Ketchup Packets","measurement":"1 Box","quantity_on_hand":"4","par":"6"},{"id":115,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:16:31","deleted_at":null,"name":"Dispenser Napkins","measurement":"1 case","quantity_on_hand":"2","par":"4"},{"id":116,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:16:12","deleted_at":null,"name":"Dispenser Towels","measurement":"1 case","quantity_on_hand":"4","par":"3"},{"id":39,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:54:56","deleted_at":null,"name":"Dried Thyme","measurement":"1 carton","quantity_on_hand":"1","par":"1"},{"id":126,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:24:22","deleted_at":null,"name":"Drink Carriers","measurement":"1 sleeve","quantity_on_hand":"5","par":"2"},{"id":96,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-29 10:12:15","deleted_at":null,"name":"Dr. Pepper","measurement":"5 Gallon Bag in Box","quantity_on_hand":"1","par":"2"},{"id":59,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:01:46","deleted_at":null,"name":"Edamame","measurement":"Box","quantity_on_hand":"5","par":"5"},{"id":78,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:07:17","deleted_at":null,"name":"Egg Yolk","measurement":"Full Case","quantity_on_hand":"1","par":"4"},{"id":18,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:21:14","deleted_at":null,"name":"Equal packets","measurement":"1 case","quantity_on_hand":"3","par":"1.5"},{"id":79,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:07:43","deleted_at":null,"name":"Espresso","measurement":"1 Cool Brew ","quantity_on_hand":"4","par":"3"},{"id":42,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:55:21","deleted_at":null,"name":"Extra Virgin Olive Oil","measurement":"1 gallon","quantity_on_hand":"1","par":"1"},{"id":93,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:13:24","deleted_at":null,"name":"Fanta","measurement":"5 Gallon Bag in Box","quantity_on_hand":"3","par":"2"},{"id":52,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:00:33","deleted_at":null,"name":"Foaming Hand Soap","measurement":"1 case","quantity_on_hand":"17","par":"1"},{"id":113,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-29 10:17:03","deleted_at":null,"name":"Frying Oil","measurement":"Jug","quantity_on_hand":"5","par":"14"},{"id":29,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:56:53","deleted_at":null,"name":"Graham Cracker Crumbs","measurement":"1 case","quantity_on_hand":"1","par":"1"},{"id":38,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:54:54","deleted_at":null,"name":"Granulated garlic","measurement":"1 carton","quantity_on_hand":"1","par":"1"},{"id":63,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:02:36","deleted_at":null,"name":"Green Leaf Lettuce","measurement":"Case","quantity_on_hand":"3","par":"2"},{"id":57,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:00:27","deleted_at":null,"name":"Green Scouring Pads","measurement":"1 case","quantity_on_hand":"4","par":"1"},{"id":3,"created_at":"2015-11-29 15:48:27","updated_at":"2015-06-01 09:22:30","deleted_at":null,"name":"Grey Poupon","measurement":"1 jug","quantity_on_hand":"2","par":"2"},{"id":77,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:07:24","deleted_at":null,"name":"Heavy Cream","measurement":"Full Case","quantity_on_hand":"18","par":"13"},{"id":125,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:24:15","deleted_at":null,"name":"Hoagie Clamshell (hot dog containers)","measurement":"1 case","quantity_on_hand":"5","par":"0.75"},{"id":74,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:06:26","deleted_at":null,"name":"Hot Dogs","measurement":"20 Lb Case","quantity_on_hand":"3","par":"3"},{"id":69,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:03:22","deleted_at":null,"name":"Jalapenos","measurement":"1 Jug","quantity_on_hand":"0","par":"1"},{"id":67,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:03:09","deleted_at":null,"name":"Kens Balsamic Vinegrette","measurement":"1 jug","quantity_on_hand":"3","par":"3"},{"id":7,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 17:10:57","deleted_at":null,"name":"Kosher Salt","measurement":"1 carton","quantity_on_hand":"3","par":"3"},{"id":5,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 16:55:47","deleted_at":null,"name":"Labels","measurement":"Roll","quantity_on_hand":"2","par":"2"},{"id":128,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:18:08","deleted_at":null,"name":"Large Deli Sheet Seperators","measurement":"Box","quantity_on_hand":"0","par":"3"},{"id":132,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:24:33","deleted_at":null,"name":"Large Foil Wrappers","measurement":"1 Box","quantity_on_hand":"22","par":"30"},{"id":41,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:55:15","deleted_at":null,"name":"Lea and Perrins Worsectershire","measurement":"1 gallon","quantity_on_hand":"0","par":"1"},{"id":97,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:13:36","deleted_at":null,"name":"Lemonade","measurement":"5 Gallon Bag in Box","quantity_on_hand":"2","par":"2"},{"id":65,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:02:50","deleted_at":null,"name":"Lemons","measurement":"1 case","quantity_on_hand":"1","par":"1"},{"id":21,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:22:02","deleted_at":null,"name":"Louisiana Hot Sauce","measurement":"1 case","quantity_on_hand":"0","par":"0.25"},{"id":88,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-29 10:42:52","deleted_at":null,"name":"Lucky Peach Blueberry Filling","measurement":"1 bucket","quantity_on_hand":"2","par":"1.5"},{"id":112,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:15:54","deleted_at":null,"name":"Magnasol","measurement":"1 case","quantity_on_hand":"1","par":"1"},{"id":70,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:03:42","deleted_at":null,"name":"Margarine","measurement":"Tub","quantity_on_hand":"21","par":"4"},{"id":62,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:02:31","deleted_at":null,"name":"Medium Mushrooms","measurement":"1 Case","quantity_on_hand":"5","par":"5"},{"id":121,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:17:01","deleted_at":null,"name":"Medium Vinyl Powder Free gloves","measurement":"1 box (10\/case)","quantity_on_hand":"30","par":"20"},{"id":37,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:54:52","deleted_at":null,"name":"Mexene Chili Powder","measurement":"1 can","quantity_on_hand":"1","par":"1"},{"id":76,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:06:56","deleted_at":null,"name":"Milk","measurement":"Gallon","quantity_on_hand":"42","par":"40"},{"id":31,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:57:08","deleted_at":null,"name":"Mini Marshmallows","measurement":"1 bag","quantity_on_hand":"9","par":"6"},{"id":10,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 16:56:01","deleted_at":null,"name":"Mint Extract","measurement":"1 Unit","quantity_on_hand":"0","par":"6"},{"id":30,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:57:02","deleted_at":null,"name":"Nutella","measurement":"Jug","quantity_on_hand":"6","par":"6"},{"id":84,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:08:52","deleted_at":null,"name":"Onions","measurement":"1 Sack","quantity_on_hand":"2","par":"2"},{"id":23,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:56:14","deleted_at":null,"name":"Oreo Crumbles","measurement":"Bag","quantity_on_hand":"16","par":"20"},{"id":51,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:59:41","deleted_at":null,"name":"Patty Paper","measurement":"Case","quantity_on_hand":"0","par":"1"},{"id":22,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:11:41","deleted_at":null,"name":"PC BBQ sauce","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":19,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:21:52","deleted_at":null,"name":"PC Mayo","measurement":"Whole Boxes (Ignore partials)","quantity_on_hand":"3","par":"4"},{"id":20,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:21:58","deleted_at":null,"name":"PC Mustard","measurement":"Whole Boxes (Ignore partials)","quantity_on_hand":"0","par":"2"},{"id":28,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:56:49","deleted_at":null,"name":"Peanut Butter Sauce","measurement":"Jar","quantity_on_hand":"4","par":"8"},{"id":14,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:11:24","deleted_at":null,"name":"Pepper Packets","measurement":"1 case","quantity_on_hand":"1","par":"1"},{"id":85,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:08:57","deleted_at":null,"name":"Pickles","measurement":"Tub","quantity_on_hand":"3","par":"4"},{"id":89,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:09:52","deleted_at":null,"name":"Pineapple filling","measurement":"1 bucket","quantity_on_hand":"3","par":"1.5"},{"id":111,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:15:50","deleted_at":null,"name":"Placemats","measurement":"1 case","quantity_on_hand":"3","par":"2"},{"id":11,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 17:11:13","deleted_at":null,"name":"Plastic Forks","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":12,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:11:15","deleted_at":null,"name":"Plastic Knives","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":8,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 17:11:00","deleted_at":null,"name":"Plastic spoons","measurement":"1 case","quantity_on_hand":"3","par":"1"},{"id":108,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:23:31","deleted_at":null,"name":"Plastic Wrap","measurement":"1 each","quantity_on_hand":"2","par":"2"},{"id":66,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:02:57","deleted_at":null,"name":"Poblano Peppers","measurement":"Case","quantity_on_hand":"2","par":"2"},{"id":61,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-29 10:29:41","deleted_at":null,"name":"Portabello Mushrooms","measurement":"Case","quantity_on_hand":"4","par":"9"},{"id":118,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:16:50","deleted_at":null,"name":"Pot and Pan Detergent","measurement":"1 Bucket","quantity_on_hand":"1","par":"1"},{"id":9,"created_at":"2015-11-29 15:48:27","updated_at":"2015-12-31 17:11:10","deleted_at":null,"name":"Potatoes","measurement":"Sack","quantity_on_hand":"17","par":"16"},{"id":32,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:57:12","deleted_at":null,"name":"Pure Almond Extract","measurement":"Bottle","quantity_on_hand":"1","par":"2"},{"id":33,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:57:20","deleted_at":null,"name":"Pure Vanilla Extract","measurement":"Bottle","quantity_on_hand":"5","par":"12"},{"id":68,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:03:25","deleted_at":null,"name":"Relish","measurement":"Jug","quantity_on_hand":"1","par":"1"},{"id":45,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:58:57","deleted_at":null,"name":"Salt","measurement":"25 Lb Bag","quantity_on_hand":"5","par":"7"},{"id":13,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:11:22","deleted_at":null,"name":"Salt Packets","measurement":"1 case","quantity_on_hand":"1","par":"1"},{"id":35,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:54:45","deleted_at":null,"name":"Sambal Olek","measurement":"1 gallon","quantity_on_hand":"1","par":"1"},{"id":119,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:16:48","deleted_at":null,"name":"Sanitizer","measurement":"1 Bucket","quantity_on_hand":"2","par":"1"},{"id":131,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:18:21","deleted_at":null,"name":"sauerkraut","measurement":"1 jar","quantity_on_hand":"1","par":"1"},{"id":127,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:17:56","deleted_at":null,"name":"Slim Jim Garbage Bags","measurement":"1 case","quantity_on_hand":"5","par":"4"},{"id":107,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:23:24","deleted_at":null,"name":"Small Foil Wrappers","measurement":"Box","quantity_on_hand":"18","par":"20"},{"id":34,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:54:38","deleted_at":null,"name":"Smoked Paprika","measurement":"1 carton","quantity_on_hand":"6","par":"4"},{"id":130,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:18:18","deleted_at":null,"name":"Souffle Cup Lids","measurement":"Sleeve","quantity_on_hand":"25","par":"0"},{"id":129,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:18:13","deleted_at":null,"name":"Souffle Cups","measurement":"Sleeve","quantity_on_hand":"23","par":"0"},{"id":40,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:55:02","deleted_at":null,"name":"Soy Sauce","measurement":"1 bottle","quantity_on_hand":"0","par":"2"},{"id":17,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:21:06","deleted_at":null,"name":"Splenda Packets","measurement":"1 case","quantity_on_hand":"5","par":"2"},{"id":90,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:13:15","deleted_at":null,"name":"Sprite","measurement":"5 Gallon Bag in Box","quantity_on_hand":"3","par":"2"},{"id":109,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:23:36","deleted_at":null,"name":"Steel Scrubbers","measurement":"1 bag","quantity_on_hand":"2","par":"1"},{"id":86,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:09:48","deleted_at":null,"name":"Strawberry Pie Filling","measurement":"1 bucket","quantity_on_hand":"8","par":"4"},{"id":46,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:59:03","deleted_at":null,"name":"Sugar","measurement":"25 Lb Bag","quantity_on_hand":"6","par":"5"},{"id":15,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:11:26","deleted_at":null,"name":"Sugar Packets","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":16,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:21:02","deleted_at":null,"name":"Sweet n Low Packets","measurement":"1 case","quantity_on_hand":"3","par":"1.5"},{"id":82,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:08:44","deleted_at":null,"name":"Swiss Cheese","measurement":"Box (12 Lb)","quantity_on_hand":"3","par":"3"},{"id":1,"created_at":"2015-11-29 12:21:40","updated_at":"2015-12-09 17:59:25","deleted_at":null,"name":"test","measurement":null,"quantity_on_hand":"3","par":"0"},{"id":114,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:24:02","deleted_at":null,"name":"Thermal Register Paper","measurement":"1 case","quantity_on_hand":"2","par":"1"},{"id":117,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:16:45","deleted_at":null,"name":"Toilet Tissue","measurement":"1 case","quantity_on_hand":"1","par":"1"},{"id":64,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:02:41","deleted_at":null,"name":"Tomatoes","measurement":"1 Case","quantity_on_hand":"2","par":"3"},{"id":58,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 17:07:35","deleted_at":null,"name":"Turkey","measurement":"Full Roll","quantity_on_hand":"13","par":"5"},{"id":26,"created_at":"2015-11-29 15:48:28","updated_at":"2015-12-31 16:56:38","deleted_at":null,"name":"White Chocolate Sauce","measurement":"Jug","quantity_on_hand":"3","par":"2"},{"id":120,"created_at":"2015-11-29 15:48:29","updated_at":"2015-12-31 17:16:57","deleted_at":null,"name":"XL vinyl powder free gloves","measurement":"1 box (10\/case)","quantity_on_hand":"46","par":"30"}];



    async.each(inv, function (value, callback) {


        // ------------------------------------------------
        // Create new photo object
        //

        var inv = new Inventory({
            name: value.name,
            created_at: Date.now(),
            updated_at: Date.now(),
            measurement: value.measurement,
            quantity_on_hand: {
                quantity: value.quantity_on_hand,
                updated_at: moment(value.updated_at).toDate()
            },
            par_type: 'simple',
            par_value: value.par
        });

        inv.save(function(err, item){
            if (err){
                console.log(err);
            }

            console.log('Saved', item);
            callback();
        });



    }, function (error) {
        if (error) res.json(500, {error: error});

        console.log('Photos saved');
        return res.json(201, {msg: 'Photos updated'} );
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







// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
    if(req.headers.authorization)
        var token = req.headers.authorization.split(' ')[1];

    // check header or url parameters or post parameters for token
   // var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Bearer'] || req.headers['authorization'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.status(400).send({
                    error: 'token_invalid'
                });

            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(400).send({
            error: 'token_not_provided'
        });

    }
});
// Include API Routes
require('./lib/routes/apiRoutes').addRoutes(apiRoutes);

app.get('/api/authenticate/user', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});


app.use('/api', apiRoutes);
