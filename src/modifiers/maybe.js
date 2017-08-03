type.modify('maybe', function maybe(test) {
    return function() {

        var args = type.util.toArray(arguments);
        var last = args.pop();

        return last === null || typeof last === 'undefined' || test.apply(this, args.concat([last]));
    };
});