type.modify('not', function not(test) {
    return function() {
        return !test.apply(this, arguments);
    };
});