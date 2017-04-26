var type = require('../type-mark');

// Extension code
type.extend('even', function(arg) {
    return typeof arg === 'number' && arg % 2 === 0;
}, function(arg) {
    return type.format(this, 'Expected {an} {even|odd} number{s} instead found ' + arg);
});