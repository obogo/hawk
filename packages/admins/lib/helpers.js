'use strict';

var mongoose = require('mongoose'),
    Admin = mongoose.model('Admin');

exports.checkIsSignedUp = function (req, res, next) {

    // check if team.user.status is not pending
    if (req.team.user.status === 'pending') {
        var conds = {
            'email': req.team.user.email
        };

        Admin.count(conds).exec(function (err, count) {
            if (count) {
//                req.teammate = user;
                return next();
            }
            res.redirect('/signup?code=' + req.team._id);
        });
    } else {
        next();
    }

};
