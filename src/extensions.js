var type = require('./type-mark');
// Extension code
type.ef('and', function(first, second, arg) {

    var args = type.util.toArray(arguments);
    var last = args.pop();

    return args.every(function(test) {
        return test(last);
    });
});
// Extension code
type.e('array', Array.isArray);
// Extension code
type.e('empty', function(arg) {
    return type.util.length(arg) === 0;
}, function(arg) {
    return this.format(['empty'], [this.type, 'lengthof', String(type.util.length(arg))]);
});
// Extension code
type.e('even', function(arg) {
    return typeof arg === 'number' && arg % 2 === 0;
});
// Extension code
type.e('exists', function(arg) {
    return typeof arg !== 'undefined' && arg !== null;
});
function _implements(_interface, arg) {
    if(type(_interface).function) {
        return _interface(arg);
    }
    type(_interface).assert.object;
    return Object.keys(_interface).every(function(key) {
        return type(arg).object && _implements(_interface[key], arg[key]);
    });
}

// Extension code
type.ef('implements', _implements, function(_interface, arg) {
    return this.format(['implements', JSON.stringify(_interface, function(key, val) {
        if(key && type(val).function) {
            return (val.name || "function");
        }
        return val;
    })], [JSON.stringify(arg)]);
});
// Extension code
type.ef('instanceof', function(constructor, arg) {
    type(constructor).assert.function;
    return arg instanceof constructor;
}, function(constructor, arg) {
    type(arg).assert.object;
    return this.format(['instanceof', constructor.name], ['instanceof', arg.constructor.name, arg]);
});
// Extension code
type.e('integer', function(arg) {
    return typeof arg === 'number' && !isNaN(arg) && (arg | 0) === arg;
});
// Extension code
type.ef('lengthof', function(n, arg) {
    type(n).assert.number;
    return type.util.length(arg) === n;
}, function(n, arg) {
    return this.format(['lengthof', n], [this.type, 'lengthof', String(type.util.length(arg))]);
});
// Extension code
type.ef('max', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(n, arg) {
    return this.format(['max', n], [this.type, arg]);
});
// Extension code
type.ef('min', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg >= n;
}, function(n, arg) {
    return this.format(['min', n], [this.type, arg]);
});
/* Taken from lodash */
/* https://github.com/lodash/lodash/blob/6cb3460fcefe66cb96e55b82c6febd2153c992cc/isNative.js */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g
var reIsHostCtor = /^\[object .+?Constructor\]$/
var reIsNative   = RegExp('^' +
    Function.prototype.toString.call(Object.prototype.hasOwnProperty)
        .replace(reRegExpChar, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?')
);

// Extension code
type.e('native', function(arg) {
    return (typeof arg === 'function' || typeof arg === 'object')
        && (typeof arg === 'function'
            ? reIsNative.test(Function.prototype.toString.call(arg))
            : reIsHostCtor.test('' + arg)
        );
});
// Extension code
type.e('negative', function(arg) {
    return typeof arg === 'number' && arg < 0;
});
// Extension code
type.e('object', function(arg) {
    return typeof arg === 'object' && arg !== null;
});
// Extension code
type.e('odd', function(arg) {
    return typeof arg === 'number' && (arg - 1) % 2 === 0;
});
// Extension code
type.ef('or', function(first, second, arg) {

    var args = type.util.toArray(arguments);
    var last = args.pop();

    return args.some(function(test) {
        return test(last);
    });
});
// Extension code
type.e('positive', function(arg) {
    return typeof arg === 'number' && arg > 0;
});
// Extension code
type.ef('range', function(min, max, arg) {
    type(min).assert.number;
    type(max).assert.number;
    return typeof arg === 'number' && arg >= min && arg < max;
}, function(min, max, arg) {
    return this.format(['between', min, 'and', max], [this.type, arg]);
});
// Define base types
'undefined boolean number string symbol function'
    .split(' ')
    .forEach(function(name) {
        type.e(name, function(arg) {
            return typeof arg === name;
        });
    });