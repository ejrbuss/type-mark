var type = require('../type-mark');
var util = require('../util');

// Extension code
type.extend('empty', function(arg) {
    return util.length(arg) === 0;
}, function(arg) {
    return 'Expected an empty object instead found object with length ' + util.length(arg);
});

