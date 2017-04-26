var type = require('../type-mark');

// Extension code
type.extendfn('max', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(n, arg) {
    return type.format(this, 'Expected {a} value{s} {less than or equal to|greater than} ' + n + ' instead found ' + arg);
});