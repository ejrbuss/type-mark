var type = require('../type-checker');

type.extendfn('max', function(arg, n) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(value, args) {
    return 'Expected no more than ' + args[0] + ' instaed found ' + value;
});