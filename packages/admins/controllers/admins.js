'use strict';
var hawk = require('local-lib').hawk;
var mongoose = require('mongoose');
var apiHelper = require('express-api-helper');
var _ = require('lodash');
var config = require('config');
var Admin = mongoose.model('Admin');

// TODO: Add caching on isAdmin
var requiresAdmin = function (req, res, next) {
    var conds = {
        app: req.query.app,
        account: req.user,
        status: 'active'
    };
    var promise = Admin.count(conds).exec();
    promise.onFulfill(function (count) {
        if (!count) {
            return apiHelper.unauthorized(req, res);
        }
        next();
    });
    promise.onReject(function (err) {
        apiHelper.serverError(req, res, err);
    });
};

var load = function (req, res, next, id) {
    var promise = Admin.findOne({_id: id}).exec();
    promise.onFulfill(function (admin) {
        if (!admin) {
            return apiHelper.notFound(req, res);
        }
        req.admin = admin;
        next();
    });
    promise.onReject(function () {
        apiHelper.notFound(req, res);
    });
};

var all = function (req, res) {
    var conds = {
        app: req.query.app
    };
    var promise = Admin.find(conds).sort('-created').exec();
    promise.onFulfill(function (admins) {
        apiHelper.ok(req, res, {
            type: "admin.list",
            list: admins
        });
    });
    promise.onReject(function (err) {
        apiHelper.serverError(req, res, err);
    });
};

var create = function (req, res) {
    var admin = new Admin(req.body);
    //admin.account = req.user; // authenticated user

    admin.save(function (err) {
        if (err) {
            return apiHelper.serverError(req, res, err);
        }
        hawk.events.emit('admin::created', admin, admin);

        res.json(admin);

    });
};

var update = function (req, res) {
    var admin = req.admin;
    admin = _.extend(admin, req.body);

    admin.save(function (err, admin) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the admin'
            });
        }

        hawk.events.emit('admin::updated', admin);

        res.json(admin);

    });
};

var destroy = function (req, res) {
    var admin = req.admin;
    admin.remove(function (err, admin) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the admin'
            });
        }
        hawk.events.emit('admin::deleted', admin);

        res.json(admin);

    });
};

var show = function (req, res) {
    res.json(req.admin);
};

var config = function (req, res) {
    load(req, res, function () {
        var admin = req.admin;

        res.send({
            name: admin.name,
            adminearance: admin.adminearance,
            general: admin.general,
            messaging: admin.messaging
        });
    }, req.query.admin);
};

var activateUser = function(user, teamId) {
    if (teamId) {
        AppTeam.update({
            _id: teamId
        }, {
            'user._id': user._id,
            'user.status': 'active'
        }).exec();
    }
}

exports.load = load;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.show = show;
exports.all = all;
exports.config = config;
exports.requiresAdmin = requiresAdmin;

hawk.events.on('app::created', function (app, account) {
    var admin = new Admin();
    admin.app = app;
    admin.app_name = app.name;
    admin.account = account;
    admin.name = account.name;
    admin.email = account.email;
    admin.role = 'owner';
    admin.status = 'active';
    admin.save();
});

hawk.events.on('app::updated', function (app) {
    Admin.update({app: app}, {app_name: app.name}).exec();
});

hawk.events.on('app::deleted', function (app) {
    Admin.remove({app: app}, {app_name: app.name}).exec();
});

