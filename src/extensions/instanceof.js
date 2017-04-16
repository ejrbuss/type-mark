var type = require('../type-checker');
require('./types');

// Extension code
type.extendfn('instanceof', function(constructor, arg) {
    type(constructor).assert.function;
    return arg instanceof constructor;
}, function(constructor, arg) {
    return 'Expected instanceof ' + constructor.name + ' instead found ' + arg;
});