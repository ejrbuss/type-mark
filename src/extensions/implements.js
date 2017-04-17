var type = require('../type-mark');
require('./types');
require('./object');

function _implements(interface, arg) {
    if(type(interface).function) {
        return interface.apply(this, [arg]);
    }
    type(interface).assert.object;
    return Object.keys(interface).every(function(key) {
        return type(arg).object && _implements(interface[key], arg[key]);
    });
}

// Extension code
type.extendfn('implements', _implements, function(interface, arg) {
    return arg + ' fails to implement interface';
});