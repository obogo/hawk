'use strict';

var auth = require('../controllers/auth');
var api = require('express-api-helper');

module.exports = function (hawk, app, passport) {

    //app.get('/verify', teammates.verifyEmail);
    //
    //app.post('/signup', teammates.signup);

    app.post('/signup', auth.signup);

    app.post('/login', function (req, res, next) {
            req.logout();
            next();
        },

        passport.authenticate('local', {session: true}),

        function (req, res) {

            hawk.events.emit('user::login', req.user, req.query);

            api.ok(req, res, req.user);
        }
    );

    app.get('/logout', function (req, res) {
        req.logout();
        api.ok(req, res, {success: true});
    });

};
