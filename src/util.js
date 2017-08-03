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