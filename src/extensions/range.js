// Extension code
type.extendfn('range', function(min, max, arg) {
    type(min).assert.number;
    type(max).assert.number;
    return typeof arg === 'number' && arg >= min && arg < max;
}, function(min, max, arg) {
    return this.format(['between', min, 'and', max], [this.type, arg]);
});