var type = require('../type-mark');

type.extendfn('range', function(min, max, arg) {
    type(min).assert.number;
    type(max).assert.number;
    return typeof arg === 'number' && arg >= min && arg < max;
}, function(min, max, arg) {
    return 'Expected a value between ' + min + ' and ' + max + ' instead found ' + arg;
});