var type = require('../type-checker');

type.extendfn('min', function(arg, n) {
    type(n).assert.number;
    return typeof arg === 'number' && arg >= n;
}, function(value, args) {
    return 'Expected at least ' + args[0] + ' instead found ' + value;
});