var myInterface = {
    name : type.string,
    age  : type.integer,
    coordinate : {
        x : type.number,
        y : type.number,
        z : type.number
    }
};
var a = {
    name : 'bear',
    age  : 14.5,
    coordinate : {
       x : 0.0,
       y : 1.1, 
       z : 0.1
    }
};
var b = {
    name : 'bird',
    age  : 1,
    coordinate : {
        x : 0.0,
        y : 0.0,
        z : 14.0,
        flag : true
    }
};

function isThree(arg) {
    return arg === 3 || /^(3|three|iii)$/i.test(arg);
}

type.extend('isThree', isThree, function(arg) {
    return arg + ' is not three :(';
});

function threeSumTo100(n1, n2, arg) {
    return n1 + n2 + arg === 100;
}

type.extendfn('threeSumTo100', threeSumTo100, function(n1, n2, arg) {
    return n1 + ' + ' + n2 + ' + ' + arg + ' does not equal 100';
});

type.extendfn('re', function(regex, arg) {
    return new RegExp('^' + regex.source + '$').test(arg);
}, function(regex, arg) {
    return this.format(['regex', regex], [this.type, arg]);
});

function nest(that, test, args, value) {
    if(type(value).object) {
        return Object.keys(value).every(function(i) {
            return nest(that, test, args, value[i]);
        });
    }
    return test.apply(that, args.concat([value]));
}

type.modify('nested', function nested(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var value = args.pop();

        return nest(that, test, args, value);
    };
});

var state;

var obj = {}
type.util.define(obj, 'x', function() { return true; })

var fn = type.util.curry(function(a, b, c) { return a + b + c; })