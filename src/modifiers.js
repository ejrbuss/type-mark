var type = require('./type-mark');
type.m('arrayof', function arrayof(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var last = args.pop();

        return Array.isArray(last) && last.every(function(arg) {
            return test.apply(that, args.concat([arg]));
        });
    };
});
type.m('assert', function assert(test, name) {
    return function() {
        if(!test.apply(this, arguments)) {
            throw type.typeError(this, name);
        }
        return true;
    };
});

/**
 * Returns a type error based of a given TypeState.
 */
type.typeError = function typeError(state, name) {

    type(state).assert.instanceof(type.TypeState);
    type(name).assert.string;

    var message = state._message || state.format([name], [state.type, state.value]);
    var error = new TypeError(type(message).function
        ? state.result(message)
        : message
    );
    error.state = state;
    return error;
};
type.m('collapse', function collapse(test) {
    return function() {

        var args = type.util.toArray(arguments);
        args.pop();

        for(var i in this._value) {
            if(test.apply(this, args.concat([this._value[i]]))) {
                this._return = this._value[i];
                return true;
            }
        }
        return false;
    };
});
type.m('maybe', function maybe(test) {
    return function() {

        var args = type.util.toArray(arguments);
        var last = args.pop();

        return last === null || typeof last === 'undefined' || test.apply(this, args.concat([last]));
    };
});
type.m('not', function not(test) {
    return function() {
        return !test.apply(this, arguments);
    };
});
type.m('of', function of(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var last = args.pop();

        return typeof last === 'object' && last !== null && Object.keys(last).every(function(key) {
            return test.apply(that, args.concat([last[key]]));
        });
    };
});