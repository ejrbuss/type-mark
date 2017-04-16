var type = require('../type-mark');

// Define base types
'undefined boolean number string symbol function'
    .split(' ')
    .forEach(function(name) {
        type.extend(name, function(arg) {
            return typeof arg === name;
        });
    });