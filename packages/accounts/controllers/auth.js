'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Account = mongoose.model('Account'),
    apiHelper = require('express-api-helper'),
    _ = require('lodash'),
    __ = require('i18n').__,
    config = require('config'),
    crypto = require('crypto');

exports.signup = function (req, res) {

    apiHelper.requireParams(req, res, ['email', 'password'], function () {
        var user = new Account({
            email: req.body.email
        });

        Account.register(user, req.body.password, function (err, user) {
            if (err) {
                return apiHelper.badRequest(req, res, err);
            }
            apiHelper.ok(req, res, user);
        });
    });

};

//exports.signup_OLD = function (req, res) {
//
//    var user = new Account(req.body);
//    user.provider = 'local';
//    user.verified = !!req.query.code; // if there is a code then this came from an invite
//
//    // because we set our user.provider to local our models/user.js validation will always be true
//    req.assert('name', __('You must enter a name')).notEmpty();
//    req.assert('email', __('You must enter a valid email address')).isEmail();
//    req.assert('password', __('Password must be between 8-20 characters long')).len(8, 20);
////    req.assert('username', __('Username cannot be more than 20 characters')).len(1, 20);
//    req.assert('confirmPassword', __('Passwords do not match')).equals(req.body.password);
//
//    var errors = req.validationErrors();
//    if (errors) {
//        return apiHelper.badRequest(req, res, errors);
//    }
//
//    // Hard coded for now. Will address this with the user permissions system in v0.3.5
//    user.roles = ['authenticated'];
//    user.save(function (err) {
//        if (err) {
//            switch (err.code) {
//                case 11000:
//                case 11001:
//                    return apiHelper.badRequest(req, res, {
//                        param: 'email',
//                        msg: __('Username already taken'),
//                        value: req.body.email
//                    });
//                default:
//            }
//            errors = [];
//            for (var e in err.errors) {
//                errors.push({param: err.errors[e].path, msg: err.errors[e].message, value: err.errors[e].value});
//            }
//            return apiHelper.badRequest(req, res, errors);
//        }
//        req.logIn(user, function (err) {
//            if (err) {
//                return res.jsonp(err);
//            }
//            return apiHelper.ok(req, res, {success: true});
//        });
//
//        mean.events.emit('user::signup', user, req.query);
//    });
//};

/**
 * Verifies the email they provided is valid and owned by user
 * @param req
 * @param res
 */
exports.verifyEmail = function (req, res) {
    var emailToken = req.query.tok;
    var verifyToken = crypto.createHash('sha1').update(config.globalSalt + req.query.email).digest('hex');
    if (emailToken === verifyToken) {
        Account.update({email: req.query.email}, {verified: true}).exec(function (err) {
            if (err) {
                // send event
                mean.events.emit('user-email-verify::error');
                // render html
                return res.render('email_verify_error');
            }
            // send event
            mean.events.emit('user-email-verify::success');
            // render html
            return res.render('email_verify_success');
        });
    } else {
        // send event
        mean.events.emit('user-email-verify::error');
        // render html
        res.render('email_verify_error');
    }
};

/**
 * Auth callback
 */
exports.authCallback = function (req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};

/**
 * Logout
 */
//exports.signout = function (req, res) {
//    req.logout();
//    res.redirect('/');
//};

/**
 * Session
 */
//exports.session = function (req, res) {
//    res.redirect('/');
//};

/**
 * Create user
 */
//exports.create = function (req, res, next) {
//    var user = new User(req.body);
//
//    user.provider = 'local';
//
//    // because we set our user.provider to local our models/user.js validation will always be true
//    req.assert('name', 'You must enter a name').notEmpty();
//    req.assert('email', 'You must enter a valid email address').isEmail();
//    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
//    req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
//    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
//
//    var errors = req.validationErrors();
//    if (errors) {
//        return res.status(400).send(errors);
//    }
//
//    // Hard coded for now. Will address this with the user permissions system in v0.3.5
//    user.roles = ['authenticated'];
//    user.save(function (err) {
//        if (err) {
//            switch (err.code) {
//                case 11000:
//                    res.status(400).send([
//                        {
//                            msg: 'Email already taken',
//                            param: 'email'
//                        }
//                    ]);
//                    break;
//                case 11001:
//                    res.status(400).send([
//                        {
//                            msg: 'Username already taken',
//                            param: 'username'
//                        }
//                    ]);
//                    break;
//                default:
//                    var modelErrors = [];
//
//                    if (err.errors) {
//
//                        for (var x in err.errors) {
//                            modelErrors.push({
//                                param: x,
//                                msg: err.errors[x].message,
//                                value: err.errors[x].value
//                            });
//                        }
//
//                        res.status(400).send(modelErrors);
//                    }
//            }
//
//            return res.status(400);
//        }
//        req.logIn(user, function (err) {
//            if (err) return next(err);
//            return res.redirect('/');
//        });
//        res.status(200);
//    });
//};
/**
 * Send User
 */
//exports.me = function (req, res) {
//    res.json(req.user || null);
//};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
    Account
        .findOne({
            _id: id
        })
        .cache(true)
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};


/**
 * Resets the password
 */

//exports.resetpassword = function (req, res, next) {
//    User.findOne({
//        resetPasswordToken: req.params.token,
//        resetPasswordExpires: {
//            $gt: Date.now()
//        }
//    }, function (err, user) {
//        if (err) {
//            return res.status(400).json({
//                msg: err
//            });
//        }
//        if (!user) {
//            return res.status(400).json({
//                msg: 'Token invalid or expired'
//            });
//        }
//        req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
//        req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
//        var errors = req.validationErrors();
//        if (errors) {
//            return res.status(400).send(errors);
//        }
//        user.password = req.body.password;
//        user.resetPasswordToken = undefined;
//        user.resetPasswordExpires = undefined;
//        user.save(function (err) {
//            req.logIn(user, function (err) {
//                if (err) return next(err);
//                return res.send({
//                    user: user
//                });
//            });
//        });
//    });
//};

/**
 * Send reset password email
 */
//function sendMail(mailOptions) {
//    var transport = nodemailer.createTransport('SMTP', config.mailer);
//    transport.sendMail(mailOptions, function (err, response) {
//        if (err) return err;
//        return response;
//    });
//}

/**
 * Callback for forgot password link
 */
//exports.forgotpassword = function (req, res, next) {
//    async.waterfall([
//
//            function (done) {
//                crypto.randomBytes(20, function (err, buf) {
//                    var token = buf.toString('hex');
//                    done(err, token);
//                });
//            },
//            function (token, done) {
//                User.findOne({
//                    $or: [
//                        {
//                            email: req.body.text
//                        },
//                        {
//                            username: req.body.text
//                        }
//                    ]
//                }, function (err, user) {
//                    if (err || !user) return done(true);
//                    done(err, user, token);
//                });
//            },
//            function (user, token, done) {
//                user.resetPasswordToken = token;
//                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//                user.save(function (err) {
//                    done(err, token, user);
//                });
//            },
//            function (token, user, done) {
//                var mailOptions = {
//                    to: user.email,
//                    from: config.emailFrom
//                };
//                mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
//                sendMail(mailOptions);
//                done(null, true);
//            }
//        ],
//        function (err, status) {
//            var response = {
//                message: 'Mail successfully sent',
//                status: 'success'
//            };
//            if (err) {
//                response.message = 'User does not exist';
//                response.status = 'danger';
//            }
//            res.json(response);
//        }
//    );
//};

/**
 * Create an user
 */
exports.create = function (req, res) {
    var user = new Account(req.body);
    user.save(function (err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the user'
            });
        }

        mean.events.emit('account::created', user);

        res.json(user);

    });
};

/**
 * Update an user
 */
exports.update = function (req, res) {
    var account = req.user;

    account = _.extend(account, req.body);

    account.save(function (err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the user'
            });
        }

        mean.events.emit('account::updated', account);

        res.json(account);

    });
};

/**
 * Delete an user
 */
exports.destroy = function (req, res) {
    var account = req.user;

    account.remove(function (err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the user'
            });
        }

        mean.events.emit('account::destroyed', account);

        res.json(account);

    });
};

/**
 * Show an user
 */
exports.show = function (req, res) {
    res.json(req.user);
};

/**
 * List of Users
 */
exports.all = function (req, res) {
    var conds = {
        apps: req.query.app
    };
    Account.find(conds).sort('-created').exec(function (err, accounts) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the accounts'
            });
        }
        res.json(accounts);

    });
};

// :: Event Listeners :: //
//mean.events.on('app::created', _.debounce(function (app) {
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
