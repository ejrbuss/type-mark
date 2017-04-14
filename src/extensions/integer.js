var type = require('../type-checker');

type.extend('integer', function(arg) {
    return typeof arg === 'number' && !isNaN(arg) && (arg | 0) === arg;
}, function(value) {
    return 'Expected an integer instead found ' + value;
});