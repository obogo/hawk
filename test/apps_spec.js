var assert = require("assert");
var account = require('./helpers/account_helper');

describe('apps', function () {

    var scope = account.login(this);
    var app = {
        name: 'My App'
    };

    scope.timeout(0);

    describe('create an apps', function () {

        it('should create a new application', function (done) {
            scope.session
                .post('/apps')
                .send(app)
                .expect(200)
                .end(function (err, response) {
                    app.id = response.body.id;
                    done();
                });
        });
    });


    describe('GET /apps', function () {

        it('expect there to be 1 app', function (done) {
            scope.session
                .get('/apps')
                .expect(200)
                .end(function (err, response) {
                    assert.equal(response.body.list.length, 1);
                    done();
                });
        });
    });

    describe('PUT /apps/:appId', function () {
        it('should change the name of the app', function (done) {
            scope.session
                .put('/apps/' + app.id)
                .send({name: 'New name'})
                .expect(200, done);
        });
    });

    describe('DELETE /apps/:appId', function () {
        it('respond with success', function (done) {
            scope.session
                .delete('/apps/' + app.id)
                .expect(200, done);
        });
    });
});

