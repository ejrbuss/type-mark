(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.type = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./type-mark":3,"./util":4}],2:[function(require,module,exports){
// Pull in extensions
require('./extensions');

// Export type-mark
module.exports = require('./type-mark');
},{"./extensions":1,"./type-mark":3}],3:[function(require,module,exports){
var util = require('./util');

/**
 * Returns a new TypeState object that can test your value.
 *
 * @param   {...}       value one or more values to be tested
 * @returns {TypeState}       new TypeState object
 */
function type() {
    return new TypeState([].slice.call(arguments));
}

/**
 * Constructor for TypeState object.
 *
 * @param {Array} value array of values to be tested
 */
function TypeState(val) {
    this.value = val[0];
    this._value = val;
    this._flags = 0;
    this._args  = [];
}
type.TypeState = TypeState;
type.not       = { arrayof : {}, of : {} };
type.arrayof   = { not : {} };
type.of        = { not : {} };
type.util      = util;

TypeState.prototype = {

    /**
     * Resolves a TypeState either to the same TypeState or false.
     *
     * @param   {string}   name    the name of the test to appear in the error
     *                             message
     * @param   {function} test    the test function
     * @param   {string}   message the error message function (optional)
     * @returns {mixed}
     */
    resolve : function(name, test, message) {

        var result = false;
        var state  = this;

        // Default Case
        if(!state._flags) {
            return state.result(test) && state;
        }

        // Swap out test for not test
        if(state._flags & modifiers.not) {
            test = util.not(test);
        }

        // Handle arrayof
        if(state._flags & modifiers.arrayof) {
            if(state._flags & modifiers.collapse) {
                throw new TypeError('arrayof modifier does not support collapse.');
            }
            if(state._flags & modifiers.of) {
                throw new TypeError('arrayof modifier does not suppoer of');
            }
            result = state.result(util.arrayof(test));

        // Handle of
        } else if(state._flags & modifiers.of) {
            if(state._flags & modifiers.collapse) {
                throw new TypeError('of modifier does not support collapse.');
            }
            result = state.result(util.of(test));

        // Handle collapse
        } else if(state._flags & modifiers.collapse) {
            for(var i in state._value) {
                if(state._value.hasOwnProperty(i)) {
                    var arg = state._value[i];
                    if(state.result(test, arg, typeof arg === 'undefined')) {
                        return arg;
                    }
                }
            }
            result = false;

        // Handle default case
        } else {
            result = state.result(test);
        }

        // Handle assert
        if(!result && (state._flags & modifiers.assert)) {
            var error = new TypeError(
                state.result(state._message || message || function() {
                    return type.format(state, 'Expected {} {|non} ' + name + '{s} instead found ' + state.type);
                })
            );
            if(!(state._flags & modifiers.debug) && type(error.stack).string) {
                error.stack = error.stack
                    .replace(/\n.*/, '')
                    .replace(/\n.*/, '');
            }
            throw error;
        }

        return result && state;
    },

    /**
     * Sets a custom error message used with assertions during  test resolution.
     *
     * @param   {function}  message set a custom error message function
     * @returns {TypeState}         this for chaining
     */
    message : function(msg) {
        if(type(msg).string) {
            this._message = function() { return msg };
            return this;
        }
        type(msg).assert.function;
        this._message = msg;
        return this;
    },

    /**
     * Compute the result of a test given the current TypeState. The arguments
     * passed to the test and the test value are passed. The value can be
     * replaced with a new passed value
     *
     * @param   {function} test     the test function
     * @param   {mixed}    argument a replacement argument (optional)
     * @param   {boolean}  undef    true if arg is undefined (optional)
     * @returns {boolean}           true or false result
     */
    result : function(test, arg, undef) {
        arg = typeof arg !== 'undefined' || undef ? arg : this.value
        return test.apply(this, this._args.concat([arg]));
    }
}

/**
 *
 */
type.format = function format(state, fmt) {
    var of     = state._flags & (modifiers.arrayof | modifiers.of);
    var not    = state._flags & modifiers.not;
    var prefix = state._flags & modifiers.arrayof
        ? 'an array of '
        : 'an object of ';
    return fmt
        .replace(/\{s\}/g, of ? 's' : ''  )
        .replace(/\{([^}]*?)\}/, of  ? prefix : '{$1}')
        .replace(/\{([^}]*?)\|([^}]*?)\}/g, not ? '$2' : '$1')
        .replace(/{([^}]*?)}/g, '$1')
        .replace(/\s+/g, ' ');
};

// Define the "type" parameter
util.define(TypeState.prototype, 'type', function() {
    return this.value === null
        ? 'null'
        : typeof this.value
});

/**
 * Creates a new modifier on TypeState. Modifiers or the current flags with
 * themselves.
 *
 * @param {string} name the name of the modifier
 * @param {number} flag the bitwise mask
 */
function modifier(name, flag) {
    util.define(TypeState.prototype, name, function() {
        this._flags |= flag;
        return this;
    });
}

// Create modifiers
var modifiers = {
    not      : 1,
    arrayof  : 2,
    of       : 4,
    assert   : 8,
    collapse : 16,
    debug    : 32
};
Object.keys(modifiers).forEach(function(name) {
    modifier(name, modifiers[name])
});

/**
 * Extend TypeState with a new test function that does not need to be called.
 *
 * @param   {string}   name    the name of the test
 * @param   {function} test    the test function
 * @param   {function} message the error message function (optional)
 * @returns {function}         the type function for chaining
 */
type.extend = function extend(name, test, message) {
    util.define(TypeState.prototype, name, function() {
        return this.resolve(name, test, message);
    });
    type[name]             = test;
    type.not[name]         = util.not(test);
    type.not.arrayof[name] = util.arrayof(type.not[name]);
    type.not.of[name]      = util.of(type.not[name]);
    type.arrayof[name]     = util.arrayof(test);
    type.of[name]          = util.of(test);
    type.arrayof.not[name] = type.not.arrayof[name];
    type.of.not[name]      = type.not.of[name];
    return this;
}

/**
 * Extend TypeState with a new test function that recieves arguments.
 *
 * @param   {string}   name    the name of the test
 * @param   {function} test    the test function
 * @param   {function} message the error message function (optional)
 * @returns {function}         the type function for chaining
 */
type.extendfn = function extendfn(name, test, message) {
    TypeState.prototype[name] = function() {
        this._args = [].slice.call(arguments);
        return this.resolve(name, test, message);
    }
    test                   = util.curry(test);
    type[name]             = test;
    type.not[name]         = util.not(test);
    type.not.arrayof[name] = util.arrayof(type.not[name]);
    type.not.of[name]      = util.of(type.not[name]);
    type.arrayof[name]     = util.arrayof(test);
    type.of[name]          = util.of(test);
    type.arrayof.not[name] = type.not.arrayof[name];
    type.of.not[name]      = type.not.of[name];
    return this;
}

module.exports = type;
},{"./util":4}],4:[function(require,module,exports){
var util = {

    /**
     * Returns a new function that returns the notted value of the passed in
     * function. This supports curried function so long as the final function
     * does not return a function.
     *
     * @param   {function} fn the function to not
     * @returns {function}    the notted function
     */
    not : function(fn) {
        return function() {
            var result = fn.apply(this, arguments);
            return typeof result !== 'function'
                ? !result
                : util.not(result);
        }
    },

    /**
     * Returns a new function that returns an array reduced value of passed in
     * function. This supports curried functions so long as the final function
     * does not return a function
     *
     * @param   {function} fn the function to array reduce
     * @returns {function}     the array reduced function
     */
    arrayof : function(fn) {
        return function() {

            var that   = this;
            var result = fn.apply(that, arguments);
            var args   = [].slice.call(arguments);
            var array  = args.pop();

            if(typeof result !== 'function') {
                return Array.isArray(array) && array.every(function(arg) {
                    return fn.apply(that, args.concat([arg]));
                });
            }
            return util.arrayof(result);
        }
    },

    /**
     * Returns a new function that returns an object reduced value of passed in
     * function. This supports curried functions so long as the final function
     * does not return a function
     *
     * @param   {function} fn the function to array reduce
     * @returns {function}     the object reduced function
     */
    of : function(fn) {
        return function() {

            var that   = this;
            var result = fn.apply(that, arguments);
            var args   = [].slice.call(arguments);
            var obj    = args.pop();

            if(typeof result !== 'function') {
                return typeof obj === 'object' && obj !== null && Object.keys(obj).every(function(key) {
                    return fn.apply(that, args.concat([obj[key]]));
                });
            }
            return util.of(result);
        }
    },

    /**
     * Defines a function based property on an object.
     *
     * @param   {object}   obj  the object to define a property on
     * @param   {string}   name the name of the property
     * @param   {function} fn   the property function
     * @returns {object}        the util object for chaining
     */
    define : function(obj, name, fn) {
        Object.defineProperty(obj, name, { get : fn });
    },

    /**
     * Returns the length of the object, array, or string passed to the function. If
     * any other types are passed, undefined is returned.
     *
     * @param   {mixed} arg the value to get the length of
     * @returns {mixed}     the length if applicable or undefined
     */
    length : function(arg) {
        if(typeof arg === 'string' || Array.isArray(arg)) {
            return arg.length;
        }
        if(arg !== null && typeof arg === 'object') {
            return Object.keys(arg).length;
        }
    },

    // http://blog.carbonfive.com/2015/01/14/gettin-freaky-functional-wcurried-javascript/
    curry : function(fn) {
        var arity = fn.length;
        return function f1() {
            var args = [].slice.call(arguments, 0);
            if (args.length >= arity) {
                return fn.apply(null, args);
            } else {
                return function f2() {
                    var args2 = [].slice.call(arguments, 0);
                    return f1.apply(null, args.concat(args2));
                }
            }
        };
    }

};

module.exports = util;
},{}]},{},[2])(2)
});