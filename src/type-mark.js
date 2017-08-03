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