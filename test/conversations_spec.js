var request = require('supertest');
var assert = require("assert");
var hawk = require('local-lib').hawk;
var promise = hawk.init();

describe('conversations', function () {

    beforeEach(function (done) {
        promise.onFulfill(function () {
            done();
        });
    });

    //describe('GET /conversations', function () {
    //
    //    it('respond with json', function (done) {
    //        request(hawk.app)
    //            .get('/conversations')
    //            .expect(200, done);
    //    });
    //
    //});

});


