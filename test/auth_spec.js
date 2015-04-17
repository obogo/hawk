var request = require('supertest');
var assert = require("assert");
var hawk = require('local-lib').hawk;
var promise = hawk.init();
var account = require('./helpers/account_helper');

describe('authentication', function () {

    var user = {email: 'user2@sideclick.io', password: 'password'};
    var Session, session;

    before(function (done) {
        promise.onFulfill(function () {
            Session = require('supertest-session')({
                app: hawk.app
            });
            session = new Session();
            done();
        });
    });

    after(function(){
        session.destroy();
    });

    describe('POST /signup', function () {

        it('respond with success', function (done) {
            request(hawk.app)
                .post('/signup')
                .send(user)
                .expect(200, done);
        });

    });

    describe('POST /login with correct user', function () {

        it('respond with success', function (done) {

            session
                .post('/login')
                .send(user)
                .expect(200)
                .end(function (err, response) {
                    user.id = response.body.id;
                    done();
                });
        });
    });


    describe('GET /account', function () {

        it('respond with success', function (done) {

            session
                .get('/account')
                .expect(200)
                .end(function (err, response) {
                    assert.equal(response.body.email, user.email);
                    done();
                });
        });
    });

    describe('GET /logout', function () {

        it('respond with success', function (done) {

            session
                .get('/logout')
                .expect(200, done);
        });

    });

    describe('POST /login with incorrect user', function () {

        it('respond with success', function (done) {

            request(hawk.app)
                .post('/login')
                .send({user: 'bogus@sideclick.io', password: 'password'})
                .expect(400, done);
        });
    });


    describe('DELETE /accounts/:accountId', function () {

        var scope = account.login(this);

        it('should delete an account with accountId of ' + user.id, function (done) {

            scope.session
                .delete('/accounts/' + user.id)
                .expect(200, done);
        });

    });

});



