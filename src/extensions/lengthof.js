var type = require('../type-checker');

type.extendfn('lengthof', function(arg, n) {
    type(n).assert.number;
    return Object.keys(arg).length === n;
}, function(value, args) {
    return 'Expected an object of length ' + args[0] + ' instead found object with length ' + Object.keys(value).length;
});