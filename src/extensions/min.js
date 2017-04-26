var type = require('../type-mark');

// Extension code
type.extendfn('min', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg >= n;
}, function(n, arg) {
    return type.format(this, 'Expected {a} value{s} {greater than or equal to|less than} ' + n + ' instead found ' + arg);
});