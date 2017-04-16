var type = require('../type-mark');
require('./types');

// Extension code
type.extendfn('instanceof', function(constructor, arg) {
    type(constructor).assert.function;
    return arg instanceof constructor;
}, function(constructor, arg) {
    return 'Expected instance of ' + constructor.name + ' instead found ' + arg;
});