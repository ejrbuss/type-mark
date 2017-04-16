var type = require('../type-checker');
require('./types');

// Extension code
type.extendfn('min', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg >= n;
}, function(n, arg) {
    return 'Expected at least ' + n + ' instead found ' + arg;
});