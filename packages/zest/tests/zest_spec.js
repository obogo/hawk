describe('zest', function () {

    describe('GET /v1/bogus', function () {
        it('should return a 404 - Not Found', function (done) {
            global.$http.get(global.baseUrl + '/bogus')
                .then(function (response) {
                    done();
                }, function (response) {
                    expect(response.status).toEqual(404);
                    expect(response.data).toEqual({message: 'Not Found'});
                    done();
                });
        });
    });

});
