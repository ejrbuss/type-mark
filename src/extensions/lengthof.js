// Extension code
type.extendfn('lengthof', function(n, arg) {
    type(n).assert.number;
    return type.util.length(arg) === n;
}, function(n, arg) {
    return this.format(['lengthof', n], [this.type, 'lengthof', String(type.util.length(arg))]);
});