'use strict';

var hawk = require('local-lib').hawk;
var mongoose = require('mongoose');
var apiHelper = require('express-api-helper');
var _ = require('lodash');
var config = require('config');
var Account = mongoose.model('Account');

var load = function (req, res, next, id) {
    var promise = Account.findOne({_id: id}).exec();
    promise.onFulfill(function (account) {
        if (!account) {
            return apiHelper.notFound(req, res);
        }
        req.account = account;
        next();
    });
    promise.onReject(function () {
        apiHelper.notFound(req, res);
    });
};

var create = function (req, res) {
    apiHelper.requireParams(req, res, ['email', 'password'], function () {
        var account = new Account({
            email: req.body.email
        });

        Account.register(account, req.body.password, function (err, user) {
            if (err) {
                return apiHelper.badRequest(req, res, err);
            }
            apiHelper.ok(req, res, user);
        });
    });
};

var update = function (req, res) {
    var account = req.account;

    account = _.extend(account, req.body);

    var promise = account.save();
    promise.onFulfill(function (account) {
        apiHelper.ok(req, res, account);
        hawk.events.emit('account::updated', account);
    });

    promise.onReject(function (err) {
        apiHelper.serverError(req, res, err);
    });
};

var destroy = function (req, res) {
    var account = req.account;

    var promise = account.remove();
    promise.onFulfill(function (account) {
        apiHelper.ok(req, res, account);
        hawk.events.emit('account::removed', account);
    });

    promise.onReject(function (err) {
        apiHelper.serverError(req, res, err);
    });
};

var show = function (req, res) {
    res.json(req.account || req.user);
};

var all = function (req, res) {
    var conds = {
        apps: req.query.app
    };
    var promise = Account.find(conds).sort('-created').exec();
    promise.onFulfill(function (accounts) {
        apiHelper.ok(req, res, {
            type: "account.list",
            list: accounts
        });
    });
    promise.onReject(function (err) {
        apiHelper.serverError(req, res, err);
    });
};

exports.load = load;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.show = show;
exports.all = all;

// :: Event Listeners :: //
//hawk.events.on('app::created', _.debounce(function (app) {
//    var teammate = app.team[0];
//    var query = { _id: teammate.user};
//    User.update(query, {
//        $push: {
//            apps: {
//                app: app._id,
//                name: app.name,
//                role: 'owner'
//            }
//        }
//    }, function (err, affected) {
//        console.log('result', err, affected);
//    });
//}));
