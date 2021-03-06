var isFunction = function (val) {
    return typeof val === 'function';
};

var toArray = function (value) {
    if (isArguments(value)) {
        return Array.prototype.slice.call(value, 0) || [];
    }
    try {
        if (isArray(value)) {
            return value;
        }
        if (!isUndefined(value)) {
            return [].concat(value);
        }
    } catch (e) {
    }

    return [];
};

var functionArgs = function (fn) {
    var str = (fn || '') + '';
    return str.match(/\(.*\)/)[0].match(/([\$\w])+/gm);
};

var string = 'string', func = 'function', proto = Injector.prototype;

function construct(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }

    F.prototype = constructor.prototype;
    return new F();
}

function Injector() {
    this.registered = {};
    this.preProcessor = null;// this allows for custom manipulation prior to invoke/instantiate
}

// Define API
// get/set values.
proto.val = function (name, value) {
    var n = name.toLowerCase(), override;
    if (value !== undefined) {
        this.registered[n] = value;
    } else if (this.preProcessor) {// only process on a get.
        override = this.preProcessor(name, this.registered[n]);
        if (override !== undefined) {
            this.registered[n] = override;
        }
    }
    return this.registered[n];
};

// determine the args and then execute the function with it's injectable items
proto.invoke = function (fn, locals, scope) {
    return fn.apply(scope, this.prepareArgs(fn, locals, scope));
};

// create a new instance
proto.instantiate = function (fn, locals) {
    return construct(fn, this.prepareArgs(fn, locals));
};

// pass an array or fn and get all of its args back as injectable items.
proto.prepareArgs = function (fn, locals, scope) {
    if (!fn.$inject) {
        fn.$inject = functionArgs(fn);
    }
    var args = fn.$inject ? fn.$inject.slice() : [], i, len = args.length;
    for (i = 0; i < len; i += 1) {
        this.getInjection(args[i], i, args, locals, scope);
    }
    return args;
};
// get the args of a fn.
proto.getArgs = functionArgs;

// handy externally for passing in a scope as the locals so it gets properties right off the scope.
proto.getInjection = function (type, index, list, locals, scope) {
    var result, cacheValue;
    // locals need to check first so they can override.
    if (locals && locals[type]) {
        result = locals[type];
    } else if ((cacheValue = this.val(type)) !== undefined) {
        result = cacheValue;
    }
    if (result === undefined) {
        console.warn("Injection not found for " + type);// leave until reject is fixed.
        throw new Error("Injection not found for " + type);
    }
    if (result instanceof Array && typeof result[0] === string && typeof result[result.length - 1] === func) {
        result = this.invoke(result.concat(), scope);
    }
    list[index] = result;
};

module.exports = function () {
    var injector = new Injector();
    if (arguments.length && isFunction(arguments[0])) {
        return injector.invoke.apply(injector, toArray(arguments));
    }
    return injector;
};
