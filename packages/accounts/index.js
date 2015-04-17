var hawk = require('local-lib').hawk;
var mongoose = require('mongoose');

// :: models :: //
require('./models/account');

// :: libraries :: //
require('./lib/helpers');

var authHelper = require('./lib/auth-helper');
hawk.register('auth', authHelper);

// :: routes :: //
exports.init = function(hawk, passport) {

    // setup local strategy (username / password authentication)
    var Account = mongoose.model('Account');
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());

    //passport._userProperty = 'account';

    // allow IoC
    hawk.invoke(require('./routes/auth'));
    hawk.invoke(require('./routes/accounts'));
};
