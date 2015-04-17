'use strict';

var admins = require('../controllers/admins');

module.exports = function (app, auth) {

    //var bearerAuth = passport.authenticate([ 'bearer' ], { session: false });

    //app.route('/widget_api/admins')
    //    .get(admins.config);

    app.route('/admins')
        .post(admins.requiresAdmin, admins.create)
        .get(admins.requiresAdmin, admins.all);

    app.route('/admins/:adminId')
        .get(admins.requiresAdmin, auth.requiresLogin, admins.show)
        .put(admins.requiresAdmin, auth.requiresLogin, admins.update)
        .delete(admins.requiresAdmin, admins.destroy);

    app.param('adminId', admins.load);

};
