var type = require('../type-checker');

type.extendfn('instanceof', function(arg, constructor) {

    type(constructor).assert.function;
    type(constructor.name).assert.string;

    return arg instanceof constructor;
}, function(value, args) {
    return 'Expected instanceof ' + args[0].name + ' instead found ' + value;
});