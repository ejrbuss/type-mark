var type = require('../type-checker');

type.extendfn('implements', function(arg, interface) {

    type(interface).assert.object;

    var state = this;

    if(type(interface).instanceof(type.TypeState)) {
        return Object.keys(interface.value).every(function(name) {
            return arg.hasOwnProperty(name) && interface.value[name].apply(state, state.args(arg[name]));
        });
    } else {
        return Object.keys(interface).every(function(name) {
            return arg.hasOwnProperty(name);
        });
    }

}, function(arg, interface) {
    return arg + ' fails to implement the interface ' + interface
});