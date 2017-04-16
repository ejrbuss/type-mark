var type = require('../type-mark');

// Extension code
type.extend('object', function(arg) {
    return typeof arg === 'object' && arg !== null;
}, function(value) {
    return 'Expected an object instead found ' + this.type;
});