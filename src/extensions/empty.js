// Extension code
type.extend('empty', function(arg) {
    return type.util.length(arg) === 0;
}, function(arg) {
    return this.format(['empty'], [this.type, 'lengthof', String(type.util.length(arg))]);
});