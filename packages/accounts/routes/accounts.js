'use strict';

var accounts = require('../controllers/accounts');

module.exports = function (hawk, app, auth) {

    app.get('/account', auth.requiresLogin, accounts.show);

    app.route('/accounts')
        .post(auth.requiresSideclickAdmin, accounts.create)
        .get(auth.requiresSideclickAdmin, accounts.all);

    app.route('/accounts/:accountId')
        .get(auth.requiresSideclickAdmin, accounts.show)
        .put(auth.requiresSideclickAdmin, accounts.update)
        .delete(auth.requiresSideclickAdmin, accounts.destroy);

    app.param('accountId', accounts.load);
};
