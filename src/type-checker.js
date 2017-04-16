var util = require('./util');

/**
 * Returns a new TypeState object that can test your value.
 *
 * @param   {...}       value one or more values to be tested
 * @returns {TypeState}       new TypeState object
 */
function type(...val) {
    return new TypeState(val);
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
    _resolve(name, test, message) {

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
    message(msg) {
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
    result(test, arg, undef) {
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