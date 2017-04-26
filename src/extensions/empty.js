var type = require('../type-mark');
var util = require('../util');

// Extension code
type.extend('empty', function(arg) {
    return util.length(arg) === 0;
}, function(arg) {
    return type.format(this, 'Expected {a|an} {|non} empty object{s} instead found an object with length ' + util.length(arg));
});