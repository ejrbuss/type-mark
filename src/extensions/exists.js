// Extension code
type.extend('exists', function(arg) {
    return typeof arg !== 'undefined' && arg !== null;
});