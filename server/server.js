// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
//var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

// mongoose.connect('mongodb://localhost/');     // connect to mongoDB database

//app.use(express.static(__dirname + '/static'));

       app.use(express.static(__dirname + '/../client/dist'));   // set the static files location /public/img will be /img for users
//app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================

app.set('port', (process.env.PORT || 8080));
console.log("App listening on port 8080");

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
// define model =================



app.get('/*', function(req, res) {
    var path = require('path');
    res.sendfile(path.resolve('../client/dist/index.html'));

});
