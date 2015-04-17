'use strict';
/**
 * Module dependencies.
 */
var hawk = require('local-lib').hawk;
var mongoose = require('mongoose');
var apiHelper = require('express-api-helper');
var _ = require('lodash');
var config = require('config');
var App = mongoose.model('App');

var load = function (req, res, next, id) {
    var promise = App.findOne({_id: id}).exec();
    promise.onFulfill(function (app) {
        if (!app) {
            return apiHelper.notFound(req, res);
        }
        req.app = app;
        next();
    });
    promise.onReject(function () {
        apiHelper.notFound(req, res);
    });
};

var all = function (req, res) {
    var conds = {
        account: req.user // user account
    };
    // we use the admin to return the apps the account is assigned to
    var Admin = mongoose.model('Admin');
    var promise = Admin.find(conds).sort('-created').exec();
    promise.onFulfill(function (apps) {
        apiHelper.ok(req, res, {
            type: 'app.list',
            list: apps
        });
    });

    promise.onReject(function (err) {
        apiHelper.serverError(req, res, err);
    });
};

var create = function (req, res) {
    apiHelper.requireParams(req, res, ['name'], function () {
        var app = new App(req.body);

        var promise = app.save();
        promise.onFulfill(function (app) {
            apiHelper.ok(req, res, app);
            hawk.events.emit('app::created', app, req.user);
        });

        promise.onReject(function (err) {
            apiHelper.serverError(req, res, err);
        });
    });
};

var update = function (req, res) {
    var app = req.app;
    app = _.extend(app, req.body);

    var promise = app.save();
    promise.onFulfill(function (account) {
        apiHelper.ok(req, res, account);
        hawk.events.emit('app::updated', account);
    });

    promise.onReject(function (err) {
        apiHelper.serverError(req, res, err);
    });
};

var destroy = function (req, res) {
    var app = req.app;
    app.remove(function (err, app) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the app'
            });
        }
        hawk.events.emit('app::deleted', app);

        res.json(app);

    });
};

var show = function (req, res) {
    res.json(req.app);
};

var config = function (req, res) {

    load(req, res, function () {
        var app = req.app;

        res.send({
            name: app.name,
            appearance: app.appearance,
            general: app.general,
            messaging: app.messaging
        });
    }, req.query.app);
};

exports.load = load;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.show = show;
exports.all = all;
exports.config = config;

// Event
hawk.events.on('event::updated', function (event) {
    App.update({_id: event.app._id}, {$addToSet: {events: event.name}}).exec();
});

hawk.events.on('tag::added', function (tagName) {
    App.update({_id: event.app._id}, {$addToSet: {tags: tagName}}).exec();
});

