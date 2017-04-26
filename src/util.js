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