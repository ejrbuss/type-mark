var type = require('../type-mark');

function _implements(_interface, arg) {
    if(type(_interface).function) {
        return _interface.apply(this, [arg]);
    }
    type(_interface).assert.object;
    return Object.keys(_interface).every(function(key) {
        return type(arg).object && _implements(_interface[key], arg[key]);
    });
}

// Extension code
type.extendfn('implements', _implements, function(arg) {
    return type.format(this, 'Expected {} object{s} to {|not} implement interface instead found ' + arg);
});