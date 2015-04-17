'use strict';

var accounts = require('../controllers/accounts');

module.exports = function (hawk, app, auth) {

    app.get('/account', auth.requiresLogin, accounts.show);

    app.route('/accounts')
        .post(auth.requiresSystemAdmin, accounts.create)
        .get(auth.requiresSystemSupport, accounts.all);

    app.route('/accounts/:accountId')
        .get(auth.requiresSystemSupport, accounts.show)
        .put(auth.requiresSystemSupport, accounts.update)
        .delete(auth.requiresSystemAdmin, accounts.destroy);

    app.param('accountId', accounts.load);
};
