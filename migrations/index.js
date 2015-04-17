process.env.NODE_ENV = process.env.NODE_ENV || "testing";

var debug = require('debug')('migrate'); // for debugging
var async = require('async'); // using as a state machine
var mongoose = require('mongoose'); // connect to mongodb
var config = require('config'); // loads config from "config" dir
var MatchFiles = require('match-files'); // find files (used to find packages)

function init() {

    debug('ENV', process.env.NODE_ENV);

    async.waterfall([
        setupDatabase,
        setupModels,
        populateAccounts
    ], function (err) {
        debug('done');
        process.exit();
    });
}

function setupDatabase(done) {
    var mongooseConfig = config.get('mongoose');
    mongoose.set('debug', mongooseConfig.debug);
    mongoose.connect(config.get('db'));

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        debug('connected to:', config.get('db'));
        done();
    });
}

function setupModels(done) {
    function matchModelFiles(path) {
        return path.match(/models\/\w+.js$/);
    }

    MatchFiles.find(config.get('base') + '/packages', {
        fileFilters: [matchModelFiles]
    }, function (err, files) {
        var i, len;
        len = files.length;
        for (i = 0; i < len; i += 1) {
            //debug('[model]', files[i]);
            require(files[i]);
        }

        done();
    });
}

var populateAccountsSystemAdmin = function (done) {
    var Account = mongoose.model('Account');
    var account = new Account({
        email: config.data.systemAdmin.email,
        verified: config.data.systemAdmin.verified,
        roles: config.data.systemAdmin.roles
    });

    Account.register(account, config.data.systemAdmin.password, function (err) {
        if (err) {
            throw new Error(err.message);
        }
        done();
    });
}

var populateAccountsSystemSupport = function (done) {
    var Account = mongoose.model('Account');
    var account = new Account({
        email: config.data.systemSupport.email,
        verified: config.data.systemSupport.verified,
        roles: config.data.systemSupport.roles
    });

    Account.register(account, config.data.systemSupport.password, function (err) {
        if (err) {
            throw new Error(err.message);
        }
        done();
    });
}

var populateAccounts = function (done) {
    debug('populating accounts');
    async.parallel([
        populateAccountsSystemAdmin,
        populateAccountsSystemSupport
    ], function (err) {
        done()
    });
};

init();