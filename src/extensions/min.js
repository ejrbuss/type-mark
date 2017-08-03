// Extension code
type.extendfn('min', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg >= n;
}, function(n, arg) {
    return this.format(['min', n], [this.type, arg]);
});