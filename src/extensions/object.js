var type = require('../type-checker');

// Extension code
type.extend('object', function(arg) {
    return typeof arg === 'object' && arg !== null;
}, function(value) {
    return 'Expected an object instead found ' + this.type;
});