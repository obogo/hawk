'use strict';

var path = require('path');

module.exports = {
    name: 'your_app_name',
    version: '1.0',
    base: path.normalize(__dirname + '/..'),
    checkDependencies: true,
    application: {
        name: 'Sideclick',
        company_name: 'Sideclick.io',
        site_url: 'http://sideclick.io',
        email: {
            support: 'support@sideclick.io'
        }
    },
    http: {
        port: process.env.PORT || 3000
    },
    https: {
        port: false,

        // Paths to key and cert as string
        ssl: {
            key: '',
            cert: ''
        }
    },
    hostname: process.env.HOST || process.env.HOSTNAME,
    db: process.env.MONGOHQ_URL,
    templateEngine: 'swig',

    // The secret should be set to a non-guessable string that
    // is used to compute a session hash
    sessionSecret: 's3ss10nS3cr3t',

    // The name of the MongoDB collection to store sessions in
    sessionCollection: 'sessions',

    // The session cookie settings
    sessionCookie: {
        path: '/',
        httpOnly: true,
        // If secure is set to true then it will cause the cookie to be set
        // only when SSL-enabled (HTTPS) is used, and otherwise it won't
        // set a cookie. 'true' is recommended yet it requires the above
        // mentioned pre-requisite.
        secure: false,
        // Only set the maxAge to null if the cookie shouldn't be expired
        // at all. The cookie will expunge when the browser is closed.
        maxAge: null
    },

    // The session cookie name
    sessionName: 'connect.sid',

    globalSalt: 'gl0b@lS@lt',

    oauth2: {
        expireIn: 60 // seconds
    },

    "mongoose": {
        enabled: true,
        debug: false
    },

    cors: {
        origin: true,
        credentials: true
    },

    i18n: {
        // setup some locales - other locales default to en silently
        locales: ['en', 'de', 'es', 'jp', 'pt', 'fr'],

        // you may alter a site wide default locale
        defaultLocale: 'en',

        // sets a custom cookie name to parse locale settings from  - defaults to NULL
        cookie: 'i18n',

        // where to store json files - defaults to './locales' relative to modules directory
        directory: './locales',

        // whether to write new locale information to disk - defaults to true
//        updateFiles: true,

        // what to use as the indentation unit - defaults to "\t"
//        indent: "\t",

        // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
//        extension: '.json',

        // setting prefix of json files name - default to none '' (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
//        prefix: 'webapp-',

        // enable object notation
        objectNotation: false
    },

    defaultTemplates: {
        user: {
            welcome: 'user-welcome',
            verifyEmail: 'user-verify-email',
            invite: 'user-invite',
            joined: 'user-joined',
            passwordRequest: 'user-password-request',
            passwordReset: 'user-password-reset'
        },
        app: {
            created: 'application-created',
            paymentReceived: 'application-payment-received'
        }
    }
};
