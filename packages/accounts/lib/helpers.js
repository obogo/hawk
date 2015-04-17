'use strict';

var mongoose = require('mongoose');

var actions = {};

actions.$timestamp = function () {
    return Date.now();
};

actions.$inc = function (amount) {
    if (amount === undefined) {
        amount = 1;
    }
    return amount;
};

exports.toMongo = function (props, data, isNew) {
    var result = {};

    var hasCustomAttributes = false;
    var customAttributes = {};

    var hasInc = false;
    var $inc = {};

    var hasRemove = false;
    var $remove = {};

    var value, type, action;
    props = props.split(' ');

    for (var e in data) {
        value = data[e];
        type = typeof value;
        action = '';

        if (type === 'string' && value.substr(0, 1) === '$') { //possible action
            value = value.split(':');
            action = value.shift();
            if (typeof actions[action] === 'function') {
                value = actions[action].apply(null, value);
            }
        }

        if (type !== 'object') {
            if (props.indexOf(e) === -1) {

                if (isNaN(value)) {
                    value = value;
                } else {
                    value = Number(value);
                }

                if (isNew) {
                    hasCustomAttributes = true;
                    customAttributes[e] = value;
                } else {
                    if (action === '$inc') {
                        hasInc = true;
                        $inc['custom_attributes.' + e] = value;
                    } else if (action === '$remove') {
                        hasRemove = true;
                        $remove['custom_attributes.' + e] = '';
                    } else {
                        result['custom_attributes.' + e] = value;
                    }
                }
            } else {
                if (action === '$inc') {
                    hasInc = true;
                    $inc[e] = value;
                } else {
                    result[e] = value;
                }
            }
        }
    }

    if (hasCustomAttributes) {
        result.customAttributes = customAttributes;
    }

    if (hasInc) {
        result.$inc = $inc;
    }

    if (hasRemove) {
        result.$unset = $remove;
    }

    return result;
};

exports.checkIsLoggedIn = function (req, res, next) {
    // check if team.user.status is not pending
    if (req.team.user.status === 'pending') {
        if (req.isAuthenticated()) {
            if (req.team.user.email === req.user.email) {
                return next();
            }
        }
        res.redirect('/login?code=' + req.team._id);
    } else {
        next();
    }

};