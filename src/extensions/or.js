// Extension code
type.extendfn('or', function(first, second, arg) {

    var args = type.util.toArray(arguments);
    var last = args.pop();

    return args.some(function(test) {
        return test(last);
    });
});