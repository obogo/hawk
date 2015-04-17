var debug = require('debug')('hawk'); // for debugging
var david = require('david'); // check to make sure packages are up-to-date
var express = require('express'); // web framework
var passport = require('passport'); // for authentication
var async = require('async'); // using as a state machine
var mongoose = require('mongoose'); // connect to mongodb
//var mongooseCachebox = require('mongoose-cachebox');
var EventEmitter = require('eventemitter3').EventEmitter; // faster event emitter than native
var MatchFiles = require('match-files'); // find files (used to find packages)
var config = require('config'); // loads config from "config" dir
var bodyParser = require('body-parser'); // used to parse text/plain as JSON (avoid preflight)
var Promise = require('mpromise'); // mongoose promise (simple promise layer)
var injector = require('./lib/injector')(); // inject use to register and allow IoC
var cookieParser = require('cookie-parser'); // parse string, JSON cookies
var session = require('cookie-session'); // allows session cookies to be stored
//var Cacheman = require('cacheman');

var packages = [];
var initialized = false;
var promise = new Promise();

// Make these things injectable
injector.val('hawk', exports);
injector.val('passport', passport);

function init() {
    if (!initialized) {
        initialized = true;
        async.waterfall([
            setupCheckDependencies,
            setupDispatcher,
            setupExpress,
            setupSession,
            setupStaticDir,
            setupDatabase,
            setupPackages,
            setupServer,
            setupCache
        ], function (err) {
            debug('Server ready');
            promise.resolve();
        });
    }
    return promise;
}

// :: david :: //
function listDependencies(deps) {
    Object.keys(deps).forEach(function (depName) {
        var required = deps[depName].required || '*';
        var stable = deps[depName].stable || 'None';
        var latest = deps[depName].latest;
        debug('%s Required: %s Stable: %s Latest: %s', depName, required, stable, latest);
    });
}

// :: Finds packages :: //
function matchPackageFiles(path) {
    return path.match(/^\w+\/index.js$/);
}

function setupCheckDependencies(callback) {
    if (config.get('checkDependencies')) {
        // this is only for checking if deps are update-to-date
        var manifest = require(config.get('base') + '/package.json');

        david.getUpdatedDependencies(manifest, {stable: true}, function (er, deps) {
            if (deps.length) {
                debug('Dependencies with newer STABLE versions for', manifest.name);
                listDependencies(deps);
                callback();
            } else {
                debug('All dependencies are up-to-date!');
                callback();
            }
        });
    } else {
        callback()
    }
}

function setupDispatcher(callback) {
    exports.events = new EventEmitter();
    callback(null);
}

function setupDatabase(done) {
    var mongooseConfig = config.get('mongoose');
    mongoose.set('debug', mongooseConfig.debug);
    mongoose.connect(config.get('db'));

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        debug('connected to:', config.get('db'));
        done();
    });


    //mongooseCachbox(mongoose, {cache: true, ttl: 30});
}

function setupPackages(done) {
    var cache = [];
    MatchFiles.find(config.get('base') + '/packages', {
        fileFilters: [matchPackageFiles]
    }, function (err, files) {
        var i, len, pkg;

        len = files.length;
        for (i = 0; i < len; i += 1) {
            debug('[package]', files[i]);
            packages = files[i];
            pkg = require(files[i]);
            if (typeof pkg.init === 'function') {
                cache.push(pkg.init);
            }
        }

        len = cache.length;
        for (i = 0; i < len; i += 1) {
            injector.invoke(cache[i]);
            //cache[i](exports.app, exports.config)
        }

        done();
    });
}

function setupExpress(done) {
    exports.app = express();

    // parse as JSON
    exports.app.use(bodyParser.json());
    // parse plain text as JSON
    exports.app.use(bodyParser.json({
        type: 'text/plain'
    }));
    //mean.app.use(bodyParser.text({defaultCharset: 'utf-8'}));
    exports.app.use(bodyParser.urlencoded({extended: false}));

    exports.register('app', exports.app);

    done();
}

function setupCache(done) {
    //var cacheman = new Cacheman();
    //exports.cache = cacheman;

    //exports.register('cache', function (seconds, property) {
    //    return function (req, res, next) {
    //        cacheman.get(req.url, function (error, value) {
    //            if(value) {
    //                console.log('found it###');
    //                if(property) {
    //                    return req[property] = value;
    //                    next();
    //                }
    //                return res.send('you are here');
    //            }
    //            console.log('NOT FOUND###');
    //            var send = res.send.bind(res);
    //            res.send = function(body) {
    //                console.log('###CACHING', req.url);
    //                cacheman.set(req.url, body, seconds);
    //                send(body);
    //            };
    //            next();
    //        });
    //    }
    //});

    //var options = {
    //    cache: true, // start caching
    //    ttl: 30 // 30 seconds
    //};

// adding mongoose cachebox
//    mongooseCachebox(mongoose, options);

    //mongooseCache(mongoose, {
    //    cache : true,
    //    ttl   : 60,
    //    store: 'memory',
    //    prefix: 'cache'
    //});

    //mongooseCache(mongoose);

    done();
}

function setupSession(done) {
    var app = exports.app;
    app.use(cookieParser());
    app.use(session({
        name: config.sessionName,
        secret: config.sessionSecret
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    done();
}

function setupStaticDir(done) {
    exports.app.use(express.static(config.get('base') + '/public'));
    done();
}

function setupServer(done) {
    exports.server = exports.app.listen(config.http.port, function () {
        var host = exports.server.address().address;
        if (host === '0.0.0.0') {
            host = 'localhost';
        }
        var port = exports.server.address().port;
        console.log('\nListening at http://%s:%s', host, port);

        done();
    });
}

function setupMigrations(done) {
    //if (config.migrations && config.migrations.enabled) {
    //    exports.app.post('/migrations');
    //}
    done();
}

function register(name, value) {
    //registry[name] = entry;
    injector.val(name, value);
}

function load(name) {
    injector.val(name);
    //return registry[name];
}

exports.packages = packages;
exports.app = null; // instance of express
exports.init = init;
exports.register = register;
exports.load = load;
exports.invoke = injector.invoke.bind(injector);
