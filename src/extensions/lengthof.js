var type = require('../type-checker');
var util = require('../util');

// Extension code
type.extendfn('lengthof', function(n, arg) {
    type(n).assert.number;
    return util.length(arg) === n;
}, function(n, arg) {
    return 'Expected an object of length ' + n + ' instead found object of length ' + util.length(arg);
});