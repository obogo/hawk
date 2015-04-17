process.env.NODE_ENV = process.env.NODE_ENV || "testing";

var hawk = require('local-lib').hawk;
var promise = hawk.init();

exports.login = function (scope, email, password) {

    scope.timeout(0);

    email = email || 'user1@sideclick.io';
    password = password = 'password';

    before(function (done) {
        promise.onFulfill(function () {
            var Session = require('supertest-session')({
                app: hawk.app
            });
            scope.session = new Session();
            scope.session
                .post('/login')
                .send({email: email, password: password})
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