var type = require('../type-checker');

type.extend('even', function(arg) {
    return typeof arg === 'number' && arg % 2 === 0;
}, function(arg) {
    return 'Expected an even number instead found ' + arg;
});