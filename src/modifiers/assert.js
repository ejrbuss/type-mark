type.modify('assert', function assert(test, name) {
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