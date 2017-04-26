var type = require('../type-mark');

// Extension code
type.extendfn('instanceof', function(constructor, arg) {
    type(constructor).assert.function;
    return arg instanceof constructor;
}, function(constructor, arg) {
    return type.format(this, 'Expected {an|a} {|non} instance{s} of ' + constructor.name + ' instead found ' + arg);
});