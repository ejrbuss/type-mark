var type = require('../type-checker');
var util = require('../util');

// Extension code
type.extend('empty', function(arg) {
    return util.length(arg) === 0;
}, function(arg) {
    if(typeof arg === 'string' || Array.isArray(arg)) {
        return arg.length === 0;
    }
    if(arg !== null && typeof arg === 'object') {
        return Object.keys(arg).length === 0;
    }
    return 'Expected an empty object instead found object with length ' + util.length(arg);
});

