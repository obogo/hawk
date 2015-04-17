'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortId = require('local-lib').shortid;

var schema = new Schema({
    name: {type: String, required: true},
    plan: {type: String, default: 'basic', enum: ['basic', 'pro']},
    api_key: {type: String, unique: true, default: shortId.generate, index: true},
    private_key: {type: String, default: shortId.generate},
    tags: [String], // tags used in the application to mark users
    events: [String], // events that have occurred in the application
    segments: [], // segments that have been created in the application
    settings: {},
    billing: {},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

if (!schema.options.toJSON) {
    schema.options.toJSON = {};
}

schema.options.toJSON.transform = function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
};

mongoose.model('App', schema);