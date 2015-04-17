process.env.NODE_ENV = process.env.NODE_ENV || "testing";

var hawk = require('local-lib').hawk;
var promise = hawk.init();
var config = require('config');

exports.login = function (scope, email, password) {

    scope.timeout(0);

    var user = config.data.systemAdmin;

    before(function (done) {
        promise.onFulfill(function () {
            var Session = require('supertest-session')({
                app: hawk.app
            });
            scope.session = new Session();
            scope.session
                .post('/login')
                .send({email: user.email, password: user.password})
                .expect(200, done);
        });
    });

    after(function (done) {
        if(scope.session) {
            scope.session.destroy();
        }
        done();
    });

    return scope;
};

exports.logout = function (scope) {
    if(scope.session) {
        scope.session.destroy();
        delete scope.session;
    }
};