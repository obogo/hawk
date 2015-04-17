'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AdminSchema = new Schema({
    app: {type: Schema.ObjectId, ref: 'App', required: true, index: true},
    app_name: {type: String, required: true},
    account: {type: Schema.ObjectId, ref: 'Account', index: true},
    name: {type: String},
    email: {type: String, required: true, index: true},
    role: {type: String, default: 'user', index: true, enum: ['owner', 'admin', 'user']},
    status: {type: String, default: 'pending', index: true, enum: ['pending', 'active']},
    created_at: {type: Date, default: Date.now}
});

AdminSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

if (!AdminSchema.options.toJSON) {
    AdminSchema.options.toJSON = {};
}

AdminSchema.options.toJSON.transform = function (doc, ret, options) {
    ret.id = ret._id;
    ret.type = 'admin';
    delete ret._id;
};

mongoose.model('Admin', AdminSchema);