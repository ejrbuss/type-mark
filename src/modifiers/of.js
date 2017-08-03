type.modify('of', function of(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var last = args.pop();

        return typeof last === 'object' && last !== null && Object.keys(last).every(function(key) {
            return test.apply(that, args.concat([last[key]]));
        });
    };
});