(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.type = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./type-mark":4}],2:[function(require,module,exports){
// Pull in extensions & modifiers
require('./extensions');
require('./modifiers');

// Export type-mark
module.exports = require('./type-mark');
},{"./extensions":1,"./modifiers":3,"./type-mark":4}],3:[function(require,module,exports){
var type = require('./type-mark');
type.m('arrayof', function arrayof(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var last = args.pop();

        return Array.isArray(last) && last.every(function(arg) {
            return test.apply(that, args.concat([arg]));
        });
    };
});
type.m('assert', function assert(test, name) {
    return function() {
        if(!test.apply(this, arguments)) {
            throw type.typeError(this, name);
        }
        return true;
    };
});

/**
 * Returns a type error based of a given TypeState.
 */
type.typeError = function typeError(state, name) {

    type(state).assert.instanceof(type.TypeState);
    type(name).assert.string;

    var message = state._message || state.format([name], [state.type, state.value]);
    var error = new TypeError(type(message).function
        ? state.result(message)
        : message
    );
    error.state = state;
    return error;
};
type.m('collapse', function collapse(test) {
    return function() {

        var args = type.util.toArray(arguments);
        args.pop();

        for(var i in this._value) {
            if(test.apply(this, args.concat([this._value[i]]))) {
                this._return = this._value[i];
                return true;
            }
        }
        return false;
    };
});
type.m('maybe', function maybe(test) {
    return function() {

        var args = type.util.toArray(arguments);
        var last = args.pop();

        return last === null || typeof last === 'undefined' || test.apply(this, args.concat([last]));
    };
});
type.m('not', function not(test) {
    return function() {
        return !test.apply(this, arguments);
    };
});
type.m('of', function of(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var last = args.pop();

        return typeof last === 'object' && last !== null && Object.keys(last).every(function(key) {
            return test.apply(that, args.concat([last[key]]));
        });
    };
});
},{"./type-mark":4}],4:[function(require,module,exports){
var util = require('./util');

/**
 * Returns a new TypeState object that can test your value.
 *
 * @param   {...}       value one or more values to be tested
 * @returns {TypeState}       new TypeState object
 */
function type() {
    return new TypeState(util.toArray(arguments));
}
type.util = util;

/**
 * Constructor for TypeState object.
 *
 * @param {Array} value array of values to be tested
 */
function TypeState(val) {
    this.value   = val[0]; // the value being tested
    this._value  = val;    // all values passed to type
    this._stack  = [];     // modifier stack
    this._args   = [];     // arguments for test
    this._return = true;   // return value on success
}
type.TypeState = TypeState;

TypeState.prototype = {

    /**
     * Given a test resolves that test using the current state.
     *
     * @param   {string}   name the name of the test
     * @param   {function} test the test function
     * @returns {mixed}         return result, typically a boolean
     */
    resolve : function(name, test) {
        for(var i = this._stack.length - 1; i >= 0; i--) {
            test = this._stack[i].call(this, test, name);
        }
        var result = this.result(test);
        return result ? this._return : result;
    },

    /**
     * Calls a function with the same values that a test currently being
     * resolved would be called with.
     *
     * @param   {function} test the function to recieve the arguments
     * @returns {mixed}         the return value of your function
     */
    result : function(test) {
        return test.apply(this, this._args.concat([this.value]));
    },

    /**
     * Provide an error message to use instead of the default for the current
     * type assertion.
     *
     * @param   {function | string} msg the message
     * @returns {TypeState}             the current TypeState for chaining
     */
    message : function(msg) {
        type(msg).string || type(msg).assert.function;
        this._message = msg;
        return this;
    },

    /**
     * Returns a formatted error string given a list of strings for the asserted
     * and found values.
     *
     * @param   {Array} asserted the asserted values
     * @param   {Array} found    the found values
     * @returns {string}         the formatted error string
     */
    format : function(asserted, found) {
        return "Asserted: " + this.stack.filter(function(mod) {
            return mod !== 'assert';
        }).concat(asserted).join(' ') + " -- Found: " + found.join(' ');
    }

};

/**
 * Constructor for ShadowTypeState object.
 */
function ShadowTypeState() {
    this._stack = [];
}

ShadowTypeState.prototype = {

    // Copy from TypeState prototype
    message : TypeState.prototype.message,

    /**
     * Creates a new TypeState from the current ShadowTypeState.
     *
     * @param   {Array}             args    the args to the current test
     * @param   {function | string} message the override message if any
     * @returns {TypeState}                 the newly created TypeState
     */
    toTypeState : function(args, message) {
        var state = new TypeState([args.pop()]);
        state._stack   = this._stack;
        state._message = this._message || message;
        state._args    = args;
        return state;
    }
}

// Define the "type" parameter
util.define(TypeState.prototype, 'type', function() {
    return this.value === null
        ? 'null'
        : typeof this.value
});

// Define a readable modifier stack
util.define(TypeState.prototype, 'stack', function() {
    return this._stack.map(function(mod) {
        return mod.name;
    });
});

/**
 * Extend TypeState with a new test function that does not need to be called.
 *
 * @param   {string}   name    the name of the test
 * @param   {function} test    the test function
 * @param   {function} message the error message function (optional)
 */
type.extend = type.e = function extend(name, test, message) {
    util.define(TypeState.prototype, name, function() {
        this._message = this._message || message;
        return this.resolve(name, test);
    });
    addExtension(name, test, message);
}

/**
 * Extend TypeState with a new test function that recieves arguments.
 *
 * @param   {string}   name    the name of the test
 * @param   {function} test    the test function
 * @param   {function} message the error message function (optional)
 */
type.extendfn = type.ef = function extendfn(name, test, message) {
    TypeState.prototype[name] = function() {
        this._args    = util.toArray(arguments);
        this._message = this._message || message;
        return this.resolve(name, test);
    }
    addExtension(name, test, message);
}

/**
 * Modify TypeState with a new modification function that transorms a test.
 *
 * @param {name}     name the name of the modifier
 * @param {function} mod  the modifier function
 */
type.modify = type.m = function extendmod(name, mod) {
    var fn = function() {
        this._stack.push(mod);
        return this;
    }
    util.define(ShadowTypeState.prototype, name, fn);
    util.define(TypeState.prototype, name, fn);
    util.define(type, name, function() {
        return (new ShadowTypeState())[name];
    });
}

/**
 * Extend type and ShadowTypeState to support a new extension.
 *
 * @param {string}            name    the name of the extension
 * @param {function}          test    the extension test
 * @param {function | string} message the default message for the extension
 */
function addExtension(name, test, message) {
    type[name] = util.curry(test);
    util.define(ShadowTypeState.prototype, name, function() {
        var sstate = this;
        return util.curry(function() {
            return sstate.toTypeState(util.toArray(arguments), message).resolve(name, test);
        }, test.length);
    });
}

module.exports = type;
},{"./util":5}],5:[function(require,module,exports){
/**
 * Defines a function based property on an object.
 *
 * @param   {object}   obj  the object to define a property on
 * @param   {string}   name the name of the property
 * @param   {function} fn   the property function
 * @returns {object}        the util object for chaining
 */
function define(obj, name, fn) {
    Object.defineProperty(obj, name, { get : fn });
}

/**
 * Converts an array like object (arguments) to an Array.
 *
 * @param   {mixed} arg the array like object
 * @returns {Array}     the converted array
 */
function toArray(arg) {
    return Array.prototype.slice.call(arg);
}

/**
 * Returns the length of the object, array, or string passed to the function. If
 * any other types are passed, undefined is returned.
 *
 * @param   {mixed} arg the value to get the length of
 * @returns {mixed}     the length if applicable or undefined
 */
function length(arg) {
    if(typeof arg === 'string' || Array.isArray(arg)) {
        return arg.length;
    }
    if(arg !== null && typeof arg === 'object') {
        return Object.keys(arg).length;
    }
}

/**
 * Based off implementation developed here:
 * http://blog.carbonfive.com/2015/01/14/gettin-freaky-functional-wcurried-javascript/
 *
 * @param   {function} fn    the function to curry
 * @param   {number}   arity the arity (optional)
 * @returns {function}       the curried function
 */
function curry(fn, arity) {
    arity = arity || fn.length;
    if(arity <= 1) {
        return fn;
    }
    return function f1() {
        var args1 = toArray(arguments);
        if (args1.length >= arity) {
            return fn.apply(null, args1);
        } else {
            return function f2() {
                var args2 = toArray(arguments);
                return f1.apply(null, args1.concat(args2));
            }
        }
    };
}

module.exports = {
    define      : define,
    toArray     : toArray,
    length      : length,
    curry       : curry
};
},{}]},{},[2])(2)
});