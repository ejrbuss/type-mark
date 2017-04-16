var type = require('../type-checker');
require('./types');

// Extension code
type.extendfn('max', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(n, arg) {
    return 'Expected a value less than or equal to ' + n + ' instead found ' + arg;
});