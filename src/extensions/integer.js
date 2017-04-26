var type = require('../type-mark');

// Extension code
type.extend('integer', function(arg) {
    return typeof arg === 'number' && !isNaN(arg) && (arg | 0) === arg;
}, function(arg) {
    return type.format(this, 'Expected {an|a} {|non} integer{s} instead found ' + arg);
});