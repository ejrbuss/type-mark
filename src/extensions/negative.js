// Extension code
type.extend('negative', function(arg) {
    return typeof arg === 'number' && arg < 0;
});