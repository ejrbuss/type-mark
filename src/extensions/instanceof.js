// Extension code
type.extendfn('instanceof', function(constructor, arg) {
    type(constructor).assert.function;
    return arg instanceof constructor;
}, function(constructor, arg) {
    type(arg).assert.object;
    return this.format(['instanceof', constructor.name], ['instanceof', arg.constructor.name, arg]);
});