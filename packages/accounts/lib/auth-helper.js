'use strict';

var mongoose = require('mongoose');
//var Admin = mongoose.model('Admin');

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
 * Generic require Admin routing middleware
 * Basic Role checking - future release with full permission system
 */
exports.requiresAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.hasRole('admin')) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.requiresSideclickAdmin = function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.hasRole('sideclick-admin')) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

//exports.requiresTeammate = function (req, res, next) {
//    var conds = {
//        'app._id': req.params.app || req.query.app || req.application,
//        'user._id': req.user,
//        'user.status': 'active'
//    };
//
//    Admin.findOne(conds).exec(function (err, teamMember) {
//        if (err || !teamMember) {
//            return res.status(401).send('User is not authorized');
//        }
//        req.teamMember = teamMember;
//        next();
//    });
//};

// TODO: Fix this so it uses req.teamMember if exists
//exports.requiresTeamAdmin = function (req, res, next) {
//    var conds = {
//        'app._id': req.params.app || req.query.app || req.application,
//        'user._id': req.user,
//        'user.status': 'active',
//        $or: [
//            {'user.role': 'owner'},
//            {'user.role': 'admin'}
//        ]
//    };
//
//    Admin.count(conds).exec(function (err, count) {
//        if (!count) {
//            return res.status(401).send('User is not authorized');
//        }
//        next();
//    });
//};

exports.requiresWrite = function (req, res, next) {
    if (req.authInfo) {
        if (req.authInfo.scope !== 'full') {
            return res.status(401).send('User is not authorized');
        }
    }
    next();
};
