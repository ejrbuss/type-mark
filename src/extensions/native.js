var type = require('../type-checker');

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