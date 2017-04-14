/**
 *
 * @param {*} value
 * @param {*} message
 */
function type(...val) {
    return new TypeState(val);
}

/**
 *
 * @param {*} val
 * @param {*} msg
 * @param {*} args
 */
function TypeState(val) {
    this.value = val[0];
    this._value = val;
    this._flags = 0;
    this._args  = null;
}

TypeState.prototype = {

    /**
     *
     * @param {*} name
     * @param {*} test
     * @param {*} message
     */
    _resolve(name, test, message) {

        var result = false;
        var state  = this;

        // Default Case
        if(!state._flags) {
            return test.apply(state, state.args()) ? this : false;
        }

        // Swap out test for not test
        if(state._flags & modifiers.not) {
            var old = test;
            test = function() {
                return old.apply(state, arguments);
            }
        }

        // Handle arrayof
        if(state._flags & modifiers.arrayof) {
            if(state._flags & modifiers.collapse) {
                throw new TypeError('arrayof modifier does not support collapse.');
            }
            result = this._value.every(function(arg) {
                test.apply(state, state.args(arg));
            });

        // Handle collapse
        } else if(state._flags & modifiers.collapse) {
            for(var i = 0, len = state._value.length; i < len; i++) {
                if(test.apply(state, state.args(state._value[i]))) {
                    return state._value[i];
                }
            }

        // Handle default case
        } else {
            result = test.apply(state, state.args());
        }

        if(!result && (state._flags & modifiers.assert)) {
             var error = new TypeError(
                this._message ||
                (message || function() {}).apply(state, state.args()) ||
                'Expected ' + name + ' instead found ' + typeof this.value
            );
            if(!(this._flags & modifiers.debug) && type(error.stack).string) {
                error.stack = error.stack
                    .replace(/\n.*/, '')
                    .replace(/\n.*/, '');
            }
            throw error;
        }

        return result && this;
    },

    /**
     *
     * @param {*} value
     * @param {*} message
     */
    new(...val) {
        this._value        = val;
        this._flags        = 0;
        this._functionArgs = null;
        return this;
    },

    /**
     *
     * @param {*} msg
     */
    message(msg) {
        this._message = msg;
        return this;
    },

    /**
     *
     * @param {*} i
     */
    args(i) {
        return typeof i === 'undefined'
            ? [this._value[0]].concat(this._args)
            : [i].concat(this._args);
    }
}

/**
 *
 * @param {*} name
 * @param {*} flag
 */
function modifier(name, flag) {
    define(name, function() {
        this._flags |= flag;
        return this;
    });
}

/**
 *
 * @param {*} name
 * @param {*} fn
 */
function define(name, fn) {
    Object.defineProperty(TypeState.prototype, name, {
        get : fn
    });
}

/**
 *
 * @param {*} name
 * @param {*} test
 * @param {*} special
 */
function extend(name, test, special) {
    define(name, function() {
        return this._resolve(name, test, special)
    });
    type[name] = test;
}

/**
 *
 * @param {*} name
 * @param {*} test
 * @param {*} message
 */
function extendfn(name, test, message) {
    TypeState.prototype[name] = function() {
        this._args = Array.prototype.slice.call(arguments);
        return this._resolve(name, test, message);
    }
    type[name] = function() {
        return test.apply(this, aeguments);
    }
}

type.extend    = extend;
type.extendfn  = extendfn;
type.TypeState = TypeState;

// Create modifiers
var modifiers = {
    not      : 1,
    arrayof  : 2,
    assert   : 4,
    collapse : 8,
    debug    : 16
};

/**
 *
 */
Object.keys(modifiers).forEach(function(name) {
    modifier(name, modifiers[name])
});

module.exports = type;