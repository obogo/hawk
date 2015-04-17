var assert = require("assert");
var account = require('./helpers/account_helper');
var config = require('config');

describe('accounts', function () {

    var scope = account.login(this);

    scope.timeout(0);

    var user = config.data.testUser;

    describe('GET /accounts', function () {

        it('should get a list of accounts', function (done) {
            scope.session
                .get('/accounts')
                .expect(200)
                .end(function (err, response) {
                    assert(response.body.list.length > 0);
                    done();
                });
        });
    });

    describe('POST /accounts', function () {

        it('should create an account', function (done) {
            scope.session
                .post('/accounts')
                .send(user)
                .expect(200)
                .end(function (err, response) {
                    assert(response.body.id !== undefined);
                    user.id = response.body.id;
                    done();
                });
        });
    });

    describe('GET /accounts/:accountId', function () {
        it('should get a single account with the email ' + user.email, function (done) {
            scope.session
                .get('/accounts/' + user.id)
                .expect(200)
                .end(function (err, result) {
                    assert.equal(result.body.email, user.email);
                    done();
                });
        });
    });

    describe('DELETE /accounts/:accountId', function () {
        it('should delete an account', function (done) {
            scope.session
                .delete('/accounts/' + user.id)
                .expect(200, done);
        });
    });
});

