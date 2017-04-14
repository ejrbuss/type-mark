var type = require('../type-checker');

type.extend('negative', function(arg) {
    return typeof arg === 'number' && arg < 0;
}, function(value) {
    return 'Expected a number less than 0 instead found ' + value;
});