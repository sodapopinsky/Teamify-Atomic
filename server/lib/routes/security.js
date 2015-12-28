exports.addRoutes = function(app, security) {

// Retrieve the current user only if they are authenticated
    app.get('/authenticated-user', function(req, res) {
        security.authenticationRequired(req, res, function() { security.sendCurrentUser(req, res); });
    });


};