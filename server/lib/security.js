var express = require('express');
var passport = require('passport');

var app = express();

var filterUser = function(user) {
    if ( user ) {
        return {
            user : {

                email: user.email
            }
        };
    } else {
        return { user: null };
    }
};

var security = {

    authenticationRequired: function(req, res, next) {
        console.log('authRequired');
        if (req.isAuthenticated()) {
            next();
        } else {
            res.json(401, filterUser(req.user));
        }
    },

    sendCurrentUser: function(req, res, next) {
        res.json(200, filterUser(req.user));
        res.end();
    }
};

module.exports = security;