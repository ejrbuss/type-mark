(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('array', Array.isArray);
},{"../type-mark":20}],2:[function(require,module,exports){
var type = require('../type-mark');
var util = require('../util');

// Extension code
type.extend('empty', function(arg) {
    return util.length(arg) === 0;
}, function(arg) {
    if(typeof arg === 'string' || Array.isArray(arg)) {
        return arg.length === 0;
    }
    if(arg !== null && typeof arg === 'object') {
        return Object.keys(arg).length === 0;
    }
    return 'Expected an empty object instead found object with length ' + util.length(arg);
});


},{"../type-mark":20,"../util":21}],3:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('even', function(arg) {
    return typeof arg === 'number' && arg % 2 === 0;
}, function(arg) {
    return 'Expected an even number instead found ' + arg;
});
},{"../type-mark":20}],4:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('exists', function(arg) {
    return typeof arg !== 'undefined' && arg !== null;
}, function() {
    return 'Expected value to exsist.';
});
},{"../type-mark":20}],5:[function(require,module,exports){
var type = require('../type-mark');
require('./types');
require('./object');

function implements(interface, arg) {
    if(type(interface).function) {
        return interface.apply(this, [arg]);
    }
    type(interface).assert.object;
    return Object.keys(interface).every(function(key) {
        return type(arg).object && implements(interface[key], arg[key]);
    });
}

// Extension code
type.extendfn('implements', implements, function(interface, arg) {
    return arg + ' fails to implement interface';
});
},{"../type-mark":20,"./object":13,"./types":17}],6:[function(require,module,exports){
var type = require('../type-mark');
require('./types');

// Extension code
type.extendfn('instanceof', function(constructor, arg) {
    type(constructor).assert.function;
    return arg instanceof constructor;
}, function(constructor, arg) {
    return 'Expected instance of ' + constructor.name + ' instead found ' + arg;
});
},{"../type-mark":20,"./types":17}],7:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('integer', function(arg) {
    return typeof arg === 'number' && !isNaN(arg) && (arg | 0) === arg;
}, function(value) {
    return 'Expected an integer instead found ' + value;
});
},{"../type-mark":20}],8:[function(require,module,exports){
var type = require('../type-mark');
var util = require('../util');

// Extension code
type.extendfn('lengthof', function(n, arg) {
    type(n).assert.number;
    return util.length(arg) === n;
}, function(n, arg) {
    return 'Expected an object of length ' + n + ' instead found object of length ' + util.length(arg);
});
},{"../type-mark":20,"../util":21}],9:[function(require,module,exports){
var type = require('../type-mark');
require('./types');

// Extension code
type.extendfn('max', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(n, arg) {
    return 'Expected a value less than or equal to ' + n + ' instead found ' + arg;
});
},{"../type-mark":20,"./types":17}],10:[function(require,module,exports){
var type = require('../type-mark');
require('./types');

// Extension code
type.extendfn('min', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg >= n;
}, function(n, arg) {
    return 'Expected a value greater than or equal to ' + n + ' instead found ' + arg;
});
},{"../type-mark":20,"./types":17}],11:[function(require,module,exports){
var type = require('../type-mark');

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
}, function(value) {
    return 'Expected a native function instead found ' + value;
});
},{"../type-mark":20}],12:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('negative', function(arg) {
    return typeof arg === 'number' && arg < 0;
}, function(value) {
    return 'Expected a number less than 0 instead found ' + value;
});
},{"../type-mark":20}],13:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('object', function(arg) {
    return typeof arg === 'object' && arg !== null;
}, function(value) {
    return 'Expected an object instead found ' + this.type;
});
},{"../type-mark":20}],14:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('odd', function(arg) {
    return typeof arg === 'number' && arg % 2 !== 0;
}, function(value) {
    return 'Expected an odd number instaed found ' + value;
});
},{"../type-mark":20}],15:[function(require,module,exports){
var type = require('../type-mark');

// Extension code
type.extend('positive', function(arg) {
    return typeof arg === 'number' && arg > 0;
}, function(value) {
    return 'Expected a number greater than 0 instead found ' + value;
});
},{"../type-mark":20}],16:[function(require,module,exports){
var type = require('../type-mark');

type.extendfn('range', function(min, max, arg) {
    type(min).assert.number;
    type(max).assert.number;
    return typeof arg === 'number' && arg >= min && arg < max;
}, function(min, max, arg) {
    return 'Expected a value between ' + min + ' and ' + max + ' instead found ' + arg;
});
},{"../type-mark":20}],17:[function(require,module,exports){
var type = require('../type-mark');

// Define base types
'undefined boolean number string symbol function'
    .split(' ')
    .forEach(function(name) {
        type.extend(name, function(arg) {
            return typeof arg === name;
        });
    });
},{"../type-mark":20}],18:[function(require,module,exports){
require('./polyfills')
require('./extensions/types');
require('./extensions/array');
require('./extensions/object');
require('./extensions/integer');
require('./extensions/empty');
require('./extensions/native');
require('./extensions/positive');
require('./extensions/negative');
require('./extensions/even');
require('./extensions/odd');
require('./extensions/exists');
require('./extensions/lengthof');
require('./extensions/instanceof');
require('./extensions/min');
require('./extensions/max');
require('./extensions/range');
require('./extensions/implements');

var type = require('./type-mark');

if(typeof window !== 'undefined' && typeof require === 'undefiend') {
    window.type = type;
}
module.exports = type;
},{"./extensions/array":1,"./extensions/empty":2,"./extensions/even":3,"./extensions/exists":4,"./extensions/implements":5,"./extensions/instanceof":6,"./extensions/integer":7,"./extensions/lengthof":8,"./extensions/max":9,"./extensions/min":10,"./extensions/native":11,"./extensions/negative":12,"./extensions/object":13,"./extensions/odd":14,"./extensions/positive":15,"./extensions/range":16,"./extensions/types":17,"./polyfills":19,"./type-mark":20}],19:[function(require,module,exports){
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback/*, thisArg*/) {

        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If isCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
    // 8. return undefined
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
        'use strict';
        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the this
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method
        //    of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
        if (typeof callbackfn !== 'function') {
            throw new TypeError();
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method
                //    of O with argument Pk.
                kValue = O[k];

                // ii. Let testResult be the result of calling the Call internal method
                //     of callbackfn with T as the this value and argument list
                //     containing kValue, k, and O.
                var testResult = callbackfn.call(T, kValue, k, O);

                // iii. If ToBoolean(testResult) is false, return false.
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value : function(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        }
    });
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function() {

        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}
},{}],20:[function(require,module,exports){
var util = require('./util');

/**
 * Returns a new TypeState object that can test your value.
 *
 * @param   {...}       value one or more values to be tested
 * @returns {TypeState}       new TypeState object
 */
function type() {
    return new TypeState(Array.prototype.slice.call(arguments));
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
    _resolve : function(name, test, message) {

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
            var ret = false;
            result  = state._value.find(function(arg) {
                return (ret = state.result(test, arg, typeof arg === 'undefined'));
            });
            if(ret) {
                return result;
            }
            result = false;

        // Handle default case
        } else {
            result = state.result(test);
        }

        // Handle assert
        if(!result && (state._flags & modifiers.assert)) {
             var error = new TypeError(
                state.result(state._message || message || function() {}) ||
                'Expected ' + name + ' instead found ' + state.type
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

// Define the "type" parameter
util.define(TypeState.prototype, 'type', function() {
    return this.value === null
        ? 'null'
        : typeof this.value
});

/**
 *
 * @param {*} name
 * @param {*} flag
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
        return this._resolve(name, test, message);
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
        this._args = Array.prototype.slice.call(arguments);
        return this._resolve(name, test, message);
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
},{"./util":21}],21:[function(require,module,exports){
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
            if(typeof result !== 'function') {
                return !result;
            }
            return util.not(result);
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
            var args   = Array.prototype.slice.call(arguments);
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
            var args   = Array.prototype.slice.call(arguments);
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
        Object.defineProperty(obj, name, {
            get : fn
        });
    },

    /**
     * Returns the length of the object, array, or string passed to the function. If
     * any other types are passed, null is returned.
     *
     * @param   {mixed} arg the value to get the length of
     * @returns {mixed}     the length if applicable or null
     */
    length : function(arg) {
        if(typeof arg === 'string' || Array.isArray(arg)) {
            return arg.length;
        }
        if(arg !== null && typeof arg === 'object') {
            return Object.keys(arg).length;
        }
        return null;
    },

    // http://blog.carbonfive.com/2015/01/14/gettin-freaky-functional-wcurried-javascript/
    curry : function(fn) {
        var arity = fn.length;
        return function f1() {
            var args = Array.prototype.slice.call(arguments, 0);
            if (args.length >= arity) {
                return fn.apply(null, args);
            } else {
                return function f2() {
                    var args2 = Array.prototype.slice.call(arguments, 0);
                    return f1.apply(null, args.concat(args2));
                }
            }
        };
    }

}

module.exports = util;
},{}]},{},[18]);
