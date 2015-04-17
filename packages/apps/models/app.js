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
    general: {
        timezone: String,
        gather_social_profiles: {type: Boolean, default: true},
        company_features_enabled: {type: Boolean, default: true},
        test_version_enabled: {type: Boolean, default: true}
    },
    messaging: {
        language: {
            default: {type: String, default: 'en-us'},
            autodetect: {type: Boolean, default: true}
        },
        realtime: {
            enabled: {type: Boolean, default: false},
            direct_message: {
                'en-us': {type: String, default: 'Hi {{first_name | fallback: "there" }},'}
            }
        },
        new_message: {
            assign_to: {type: String, default: ''}
        },
        unsubscribe: {},
        messenger_button: {
            show: {type: Boolean, default: true},
            color: {type: String, default: '#0e659e'}
        },
        welcome_message: {
            show: {type: Boolean, default: true},
            message: {
                'en-us': {type: String, default: 'Ask us anything or share your feedback.'}
            }
        },
        responder: {
            show: {type: Boolean, default: true},
            message: {
                'en-us': {type: String, default: 'Message delivered. We\'ll notify you here and by email when we reply.'}
            }
        },
        messenger_audio: {
            enabled: {type: Boolean, default: false}
        },
        notifications: {
            enabled: {type: Boolean, default: false}
        }
    },
    appearance: {
        user_client_theme: {type: String, default: 'sideclick-light'},
        admin_client_theme: {type: String, default: 'sideclick-light'}
    },
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

mongoose.model('App', schema, 'sideclick_apps');