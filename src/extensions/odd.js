var type = require('../type-checker');

// Extension code
type.extend('odd', function(arg) {
    return typeof arg === 'number' && arg % 2 !== 0;
}, function(value) {
    return 'Expected an odd number instaed found ' + value;
});