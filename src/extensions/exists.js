var type = require('../type-mark');

// Extension code
type.extend('exists', function(arg) {
    return typeof arg !== 'undefined' && arg !== null;
}, function(arg) {
    return type.format(this, 'Expected {} value{s} to {|not} exist instead found ' + arg);
});