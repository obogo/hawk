// :: models :: //
require('./models/admin');

exports.init = function(hawk) {
    var route = require('./routes/admins');
    hawk.invoke(route);
};