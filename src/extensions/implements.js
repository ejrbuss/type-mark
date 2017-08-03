function _implements(_interface, arg) {
    if(type(_interface).function) {
        return _interface(arg);
    }
    type(_interface).assert.object;
    return Object.keys(_interface).every(function(key) {
        return type(arg).object && _implements(_interface[key], arg[key]);
    });
}

// Extension code
type.extendfn('implements', _implements, function(_interface, arg) {
    return this.format(['implements', JSON.stringify(_interface, function(key, val) {
        if(key && type(val).function) {
            return (val.name || "function");
        }
        return val;
    })], [JSON.stringify(arg)]);
});