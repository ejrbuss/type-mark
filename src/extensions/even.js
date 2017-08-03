// Extension code
type.extend('even', function(arg) {
    return typeof arg === 'number' && arg % 2 === 0;
});