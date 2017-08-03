// Extension code
type.extend('integer', function(arg) {
    return typeof arg === 'number' && !isNaN(arg) && (arg | 0) === arg;
});