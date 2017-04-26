var type = require('../type-mark');

// Extension code
type.extend('object', function(arg) {
    return typeof arg === 'object' && arg !== null;
});