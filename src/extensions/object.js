var type = require('../type-checker');

type.extend('object', function(arg) {
    return typeof arg === 'object' && arg !== null;
}, function(value) {
    return 'Expected an object instead found ' + ((value === null)
        ? 'null'
        : typeof value);
});