var type = require('../type-checker');

type.extend('positive', function(arg) {
    return typeof arg === 'number' && arg > 0;
}, function(value) {
    return 'Expected a number greater than 0 instead found ' + value;
});