var api = require('express-api-helper');
var config = require('config');

// The Package is past automatically as first parameter
module.exports = function (app) {

    app.route('/').all(function (req, res) {
        api.ok(req, res, {
            name: config.name,
            version: config.version
        });
    });

    app.route('*').all(function (req, res) {
        return api.notFound(req, res);
    });
};