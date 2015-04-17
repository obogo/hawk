'use strict';

var mongoose = require('mongoose');

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 * Can manage their own account and applications
 * @param req
 * @param res
 * @param next
 */
exports.requiresAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.hasRole('admin')) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 * Can manage all accounts and applications
 * @param req
 * @param res
 * @param next
 */
exports.requiresSystemAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.hasRole('system-admin')) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 * Limited management of all accounts and applications
 * @param req
 * @param res
 * @param next
 */
exports.requiresSystemSupport = function (req, res, next) {
    if (!req.isAuthenticated() || !(req.user.hasRole('system-admin') || req.user.hasRole('system-support'))) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

exports.requiresWrite = function (req, res, next) {
    if (req.authInfo) {
        if (req.authInfo.scope !== 'full') {
            return res.status(401).send('User is not authorized');
        }
    }
    next();
};
