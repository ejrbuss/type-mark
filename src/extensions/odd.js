var type = require('../type-mark');

// Extension code
type.extend('odd', function(arg) {
    return typeof arg === 'number' && arg % 2 !== 0;
}, function(arg) {
    return type.format(this, 'Expected {an} {odd|even} number{s} instead found ' + arg);
});