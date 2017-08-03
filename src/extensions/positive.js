// Extension code
type.extend('positive', function(arg) {
    return typeof arg === 'number' && arg > 0;
});