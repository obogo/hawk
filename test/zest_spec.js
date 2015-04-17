var request = require('supertest');
var assert = require("assert");
var hawk = require('local-lib').hawk;
var promise = hawk.init();

describe('zest', function () {

    beforeEach(function (done) {
        promise.onFulfill(function(){
            done();
        });
    });

    //describe('GET /', function () {
    //
    //    it('respond with json', function(done){
    //        request(hawk.app)
    //            .get('/')
    //            .expect(200, done);
    //    });
    //
    //});

    describe('GET /bogus', function () {

        it('respond with json', function(done){
            request(hawk.app)
                .get('/bogus')
                .expect(404, done);
        });

    });

});
