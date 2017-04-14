var type = require('../type-checker');

type.extendfn('range', function(arg, min, max) {
    type(min).assert.number;
    type(max).assert.number;
    return typeof arg === 'number' && arg >= min && arg < max;
}, function(arg, min, max) {
    return 'Expected a value between ' + min + ' and ' + max + ' instead found ' + arg;
});