var type = require('../type-mark');
var util = require('../util');

// Extension code
type.extendfn('lengthof', function(n, arg) {
    type(n).assert.number;
    return util.length(arg) === n;
}, function(n, arg) {
    return type.format(this, 'Expected {an|a} object {|not} of length ' + n + ' instead found an object of length ' + util.length(arg));
});