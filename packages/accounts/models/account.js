'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('config'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var AccountSchema = new Schema({
    active: {type: Boolean, default: true},
    provider: {type: String, default: 'local'},
    verified: {type: Boolean, default: false},
    roles: {type: Array, default: ['authenticated']},
    name: {type: String},
    email: {type: String, required: true, index: true},
    profile: {
        tagline: String,
        avatar: String,
        nickname: String
    },
    prefs: {
        lang: {type: String, default: 'en'}
//        notifications: {
//            email: { type: String, unique: true, match: [/.+\@.+\..+/, 'Please enter a valid email'], validate: [validateUniqueEmail, 'E-mail address is already in-use'] },
//            sms: { type: String }
//        }
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},

    // social network
    facebook: {},
    twitter: {},
    github: {},
    google: {}
});

AccountSchema.methods = {
    hasRole: function (role) {
        var roles = this.roles;
        return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
    }
};

if (!AccountSchema.options.toJSON) {
    AccountSchema.options.toJSON = {};
}

AccountSchema.options.toJSON.transform = function (doc, ret, options) {
    ret.id = ret._id;
    ret.type = 'account';
    delete ret._id;
};

AccountSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameUnique: true,
    saltlen: 16,
    keylen: 40,
    lastLoginField: 'last_attempt_at'
    //,
    //selectFields: '-hash -salt -active -provider -__v'
});

mongoose.model('Account', AccountSchema, 'sideclick_accounts');
