// Extension code
type.extend('odd', function(arg) {
    return typeof arg === 'number' && (arg - 1) % 2 === 0;
});