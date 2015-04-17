'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    NameParse = require('local-lib')['parse-names'],
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
    type: { type: String, default: 'user' },
    app: { type: Schema.ObjectId, ref: 'App', index: true },
    user_id: { type: String, index: true },
    email: { type: String, trim: true, index: true }, // The email you have defined for the user
    signed_up_at: { type: Date }, // The time the user signed up
    name: String, // The name of the user
    avatar: { type: String}, // An avatar image URL (do we need this?)
    prefs: {
        lang: { type: String, default: 'en' }
    },
    last_seen_user_agent: {
//        platform: { type: String },
        os: { type: String, index: true },
        browser: { type: String, index: true },
        version: { type: String, index: true }
//        source: String
    },
//    tags: {type: String }, // hot, cold, close, archive
    last_seen_location: {
        ip: String, // '72.229.28.185',
        timezone: String, // 'America/New_York',
        region_code: String, // 'NY',
        country: String, // 'United States',
        area_code: String, // '0',
        region: String, // 'New York',
        continent_code: String, // 'NA',
        city: String, // 'New York',
        postal_code: String, // '10014',
        longitude: String, // '-74.0078',
        latitude: String, // '40.733',
        country_code: String, // 'US',
        country_code3: String // 'USA'
    },
    unsubscribed_from_emails: { type: Boolean, default: false }, // Whether the user is subscribed to emails
    custom_attributes: {}, // The custom attributes you have set on the user
    created_at: { type: Date }, // The time the user was added to Obogo
    session_count: { type: Number, default: 1 }, // How many sessions the user has recorded
    updated_at: { type: Date, default: Date.now },
    activity: {
        last_request_at: { type: Date, index: true, default: Date.now }, // The time the user last recorded making a request
        last_contacted_at: { type: Date, index: true, default: Date.now },
        last_heard_from: { type: Date, index: true, default: Date.now }
    },
    event_summaries: {},
    social_accounts: {

    },
//    socialProfiles: [
//        {
//            id: { type: String },
//            name: { type: String },
//            username: { type: String },
//            url: { type: String }
//        }
//    ], // A list of social profiles associated with the user
    companies: [
        {
            _id: false,
            id: { type: Schema.ObjectId, ref: 'AppCompany', index: true }
        }
    ], // A list of companies for the user
    segments: [
        {
            _id: false,
            id: { type: Schema.ObjectId, ref: 'AppSegment', index: true }
        }
    ], // A list of segments the user.
    tags: [
        {
            _id: false,
            id: { type: Schema.ObjectId, ref: 'AppTag', index: true }
        }
    ] // A list of tags associated with the user.
});

// Statics
UserSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

//UserSchema.statics.findByUserId = function(user) {
//
//};
//
//UserSchema.statics.findByEmail = function (user, email, cb) {
//    var query = this.findOne({
//        'user': user,
//        'email': email
//    });
//    query.exec(cb);
//};

UserSchema.statics.paginate = function (q, pageNumber, resultsPerPage, callback, options) {
    var model = this;
    var columns = options.columns || null;
    var sortBy = options.sortBy || {_id: 1};
    var query = {};
    options = options || {};
    callback = callback || function () {
    };

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;

    if (columns === null) {
        query = model.find(q).skip(skipFrom).limit(resultsPerPage).sort(sortBy);
    } else {
        query = model.find(q).select(options.columns).skip(skipFrom).limit(resultsPerPage).sort(sortBy);
    }

    query.exec(function (error, results) {
        if (error) {
            callback(error, null, null);
        } else {
            model.count(q, function (error, count) {
                if (error) {
                    callback(error, null, null);
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    if (pageCount === 0) {
                        pageCount = 1;
                    }
                    callback(null, pageCount, results);
                }
            });
        }
    });
};

UserSchema.virtual('first_name').get(function () {
    var parsedName = NameParse.parse(this.name || '');
    return parsedName.firstName;
});

if (!UserSchema.options.toJSON) {
    UserSchema.options.toJSON = {};
}

UserSchema.options.toJSON.transform = function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
};

mongoose.model('User', UserSchema, 'app_users');
