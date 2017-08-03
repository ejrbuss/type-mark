// Extension code
type.extendfn('and', function(first, second, arg) {

    var args = type.util.toArray(arguments);
    var last = args.pop();

    return args.every(function(test) {
        return test(last);
    });
});