var type = require('../type-checker');
require('./types');

// Extension code
type.extendfn('max', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(n, arg) {
    return 'Expected no more than ' + n + ' instaed found ' + arg;
});