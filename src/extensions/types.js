var type = require('../type-checker');

'undefined boolean number string symbol function'
    .split(' ')
    .forEach(function(name) {
        type.extend(name, function(arg) {
            return typeof arg === name;
        });
    });