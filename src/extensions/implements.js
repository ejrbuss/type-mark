var type = require('../type-checker');
require('./types');
require('./object');

function implements(interface, arg) {
    if(type(interface).function) {
        return interface.apply(this, [arg]);
    }
    type(interface).assert.object;
    return Object.keys(interface).every(function(key) {
        return type(arg).object && implements(interface[key], arg[key]);
    });
}

// Extension code
type.extendfn('implements', implements, function(interface, ag) {
    return arg + ' fails to implement ' + interface;
});