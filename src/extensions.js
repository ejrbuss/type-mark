var type = require('./type-mark');
var util = require('./util');


// Extension code
type.extend('array', Array.isArray);


// Extension code
type.extend('empty', function(arg) {
    return util.length(arg) === 0;
}, function(arg) {
    return type.format(this, 'Expected {a|an} {|non} empty object{s} instead found an object with length ' + util.length(arg));
});

// Extension code
type.extend('even', function(arg) {
    return typeof arg === 'number' && arg % 2 === 0;
}, function(arg) {
    return type.format(this, 'Expected {an} {even|odd} number{s} instead found ' + arg);
});

// Extension code
type.extend('exists', function(arg) {
    return typeof arg !== 'undefined' && arg !== null;
}, function(arg) {
    return type.format(this, 'Expected {} value{s} to {|not} exist instead found ' + arg);
});

function _implements(_interface, arg) {
    if(type(_interface).function) {
        return _interface.apply(this, [arg]);
    }
    type(_interface).assert.object;
    return Object.keys(_interface).every(function(key) {
        return type(arg).object && _implements(_interface[key], arg[key]);
    });
}

// Extension code
type.extendfn('implements', _implements, function(arg) {
    return type.format(this, 'Expected {} object{s} to {|not} implement interface instead found ' + arg);
});

// Extension code
type.extendfn('instanceof', function(constructor, arg) {
    type(constructor).assert.function;
    return arg instanceof constructor;
}, function(constructor, arg) {
    return type.format(this, 'Expected {an|a} {|non} instance{s} of ' + constructor.name + ' instead found ' + arg);
});

// Extension code
type.extend('integer', function(arg) {
    return typeof arg === 'number' && !isNaN(arg) && (arg | 0) === arg;
}, function(arg) {
    return type.format(this, 'Expected {an|a} {|non} integer{s} instead found ' + arg);
});


// Extension code
type.extendfn('lengthof', function(n, arg) {
    type(n).assert.number;
    return util.length(arg) === n;
}, function(n, arg) {
    return type.format(this, 'Expected {an|a} object {|not} of length ' + n + ' instead found an object of length ' + util.length(arg));
});

// Extension code
type.extendfn('max', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(n, arg) {
    return type.format(this, 'Expected {a} value{s} {less than or equal to|greater than} ' + n + ' instead found ' + arg);
});

// Extension code
type.extendfn('min', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg >= n;
}, function(n, arg) {
    return type.format(this, 'Expected {a} value{s} {greater than or equal to|less than} ' + n + ' instead found ' + arg);
});

/* Taken from lodash */
/* https://github.com/lodash/lodash/blob/6cb3460fcefe66cb96e55b82c6febd2153c992cc/isNative.js */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g
var reIsHostCtor = /^\[object .+?Constructor\]$/
var reIsNative = RegExp('^' +
    Function.prototype.toString.call(Object.prototype.hasOwnProperty)
        .replace(reRegExpChar, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?')
);

// Extension code
type.extend('native', function(arg) {
    return (typeof arg === 'function' || typeof arg === 'object')
        && (typeof arg === 'function'
            ? reIsNative.test(Function.prototype.toString.call(arg))
            : reIsHostCtor.test('' + arg)
        );
}, function(arg) {
    type.format(this, 'Expected {a} native function{s} instead found ' + arg);
});

// Extension code
type.extend('negative', function(arg) {
    return typeof arg === 'number' && arg < 0;
}, function(arg) {
    return type.format('Expected {a} number{s} {|not} less than 0 instead found ' + arg);
});

// Extension code
type.extend('object', function(arg) {
    return typeof arg === 'object' && arg !== null;
});

// Extension code
type.extend('odd', function(arg) {
    return typeof arg === 'number' && arg % 2 !== 0;
}, function(arg) {
    return type.format(this, 'Expected {an} {odd|even} number{s} instead found ' + arg);
});

// Extension code
type.extend('positive', function(arg) {
    return typeof arg === 'number' && arg > 0;
}, function(arg) {
    return type.format('Expected {a} number{s} {|not} greater than 0 instead found ' + arg);
});

// Extension code
type.extendfn('range', function(min, max, arg) {
    type(min).assert.number;
    type(max).assert.number;
    return typeof arg === 'number' && arg >= min && arg < max;
}, function(min, max, arg) {
    return type.format(this, 'Expected {a} value{s} {between|outside of} ' + min + ' and ' + max + ' instead found ' + arg);
});

// Define base types
'undefined boolean number string symbol function'
    .split(' ')
    .forEach(function(name) {
        type.extend(name, function(arg) {
            return typeof arg === name;
        });
    });