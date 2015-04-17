// :: models :: //
require('./models/app');

exports.init = function (hawk) {
    var route = require('./routes/apps');
    hawk.invoke(route);
};