var type = require('../type-mark');

// Extension code
type.extend('positive', function(arg) {
    return typeof arg === 'number' && arg > 0;
}, function(arg) {
    return type.format('Expected {a} number{s} {|not} greater than 0 instead found ' + arg);
});