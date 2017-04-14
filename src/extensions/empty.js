var type = require('../type-checker');

type.extend('empty', function(arg) {
    return (typeof arg === 'object' || typeof arg === 'string') && Object.keys(arg).length === 0;
}, function(arg) {
    return 'Expected an empty object instead found object with length ' + Object.keys(arg).length;
});