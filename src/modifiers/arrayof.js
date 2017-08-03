type.modify('arrayof', function arrayof(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var last = args.pop();

        return Array.isArray(last) && last.every(function(arg) {
            return test.apply(that, args.concat([arg]));
        });
    };
});