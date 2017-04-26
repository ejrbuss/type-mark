var type = require('../type-mark');

// Extension code
type.extendfn('range', function(min, max, arg) {
    type(min).assert.number;
    type(max).assert.number;
    return typeof arg === 'number' && arg >= min && arg < max;
}, function(min, max, arg) {
    return type.format(this, 'Expected {a} value{s} {between|outside of} ' + min + ' and ' + max + ' instead found ' + arg);
});