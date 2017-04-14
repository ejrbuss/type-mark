var type = require('../type-checker');

type.extend('exists', function(arg) {
    return typeof arg !== 'undefined' && arg !== null;
}, function() {
    return 'Expected value to exsist.';
});