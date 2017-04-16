var type = require('../type-checker');
var util = require('../util');

// Extension code
type.extendfn('lengthof', function(n, arg) {
    type(n).assert.number;
    return util.length(arg) === n;
}, function(n, args) {
    return 'Expected an object of length ' + n + ' instead found object with length ' + util.length(arg);
});