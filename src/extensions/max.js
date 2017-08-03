// Extension code
type.extendfn('max', function(n, arg) {
    type(n).assert.number;
    return typeof arg === 'number' && arg <= n;
}, function(n, arg) {
    return this.format(['max', n], [this.type, arg]);
});