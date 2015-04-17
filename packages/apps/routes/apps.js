'use strict';

var apps = require('../controllers/apps');
//var team = require('../controllers/teams');
//var user = require('../config/user');

// The Package is past automatically as first parameter
//module.exports = function (app, auth, passport) {
module.exports = function (app, auth) {

    //var bearerAuth = passport.authenticate([ 'bearer' ], { session: false });

    //app.route('/v1/team')
    //    .get(bearerAuth, team.teammates);
    //
    //// session login only
    //app.route('/v1/apps')
    //    .get(auth.requiresLogin, team.apps)
    //    .post(auth.requiresLogin, apps.create);
    //
    //// session login only
    //app.route('/v1/apps/:appId')
    //    .get(auth.requiresLogin, auth.requiresTeammate, apps.show)
    //    .put(auth.requiresLogin, auth.requiresTeamAdmin, apps.update)
    //    .delete(auth.requiresLogin, auth.requiresTeamAdmin, apps.destroy);
    //
    //app.route('/v1/apps/:appId/team')
    //    .get(auth.requiresLogin, auth.requiresTeammate, team.teammates)
    //    .post(auth.requiresLogin, auth.requiresTeamAdmin, team.addTeammate);
    //
    //app.route('/v1/apps/:appId/team/:teammate')
    //    .delete(auth.requiresLogin, auth.requiresTeamAdmin, team.removeTeammate);
    //
    //app.get('/invites/:teamId', user.checkIsSignedUp, user.checkIsLoggedIn, team.consumeInvite);
    //
    //app.route('/widget_api/:appId/config')
    //    .get(apps.config);

    //app.param('teammate', team.teammate);
    //app.param('teamId', team.team);

    app.route('/widget_api/config')
        .get(apps.config);

    app.route('/apps')
        .post(apps.create)
        .get(apps.all);

    app.route('/apps/:appId')
        .get(apps.show)
        .put(apps.update)
        .delete(apps.destroy);

    app.param('appId', apps.load);
    //app.param('apiKey', apps.apiKey);

};
