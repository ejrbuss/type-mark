var assert = require('assert');
var multi  = require('./multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('getting started', function() {
        describe('introduction', function() {
            it('can with type-mark checking for null is as easy as', function() {
                assert.strictEqual(type(null).object, false);
            });
            it('can check if x is a string', function() {
                var x;
                x = 4;
                assert.strictEqual(type(x).string, false);
                assert.strictEqual(type.string(x), false);
                x = 'test';
                assert(type(x).string);
                assert(type.string(x));
            });
            it('can check if x is a RegExp', function() {
                var x;
                x = 4;
                assert.strictEqual(type(x).instanceof(RegExp), false);
                assert.strictEqual(type.instanceof(RegExp, x), false);
                x = /regex/;
                assert(type(x).instanceof(RegExp));
                assert(type.instanceof(RegExp, x));
            });
            it('can create a checking function', function() {
                function YourClass() {}
                function NotYourClass() {}
                var checkYourClass = type.instanceof(YourClass);
                var x;
                x = new YourClass;
                assert(checkYourClass(x));
                x = new NotYourClass();
                assert.strictEqual(checkYourClass(x), false);
            });
        });
        describe('modifiers', function() {
            describe('not', function() {
                it('should negate the given test', function() {
                    assert.strictEqual(type('test').not.string, false);
                });
                it('should be callable with alternative syntax', function() {
                    assert.strictEqual(type.not.string('test'), false);
                });
            });
            describe('assert', function() {
                it('should assert that x is an array with length 10', function() {
                    var x;
                    x = 4;
                    assert.throws(function() {
                        type(x).assert.and(type.array, type.lengthof(10));
                    }, TypeError);
                    x = [1, 2, 3];
                    assert.throws(function() {
                        type(x).assert.and(type.array, type.lengthof(10));
                    }, TypeError);
                    x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    assert(type(x).assert.and(type.array, type.lengthof(10)));
                });
                it('should allow for a custom error message', function() {
                    assert.throws(function() {
                        type(undefined).message(function(value) {
                            return 'Oops I got ' + value
                        }).assert.exists
                    }, /TypeError: Oops I got undefined/);
                    assert.throws(function() {
                        type(undefined).message('Oops').assert.exists;
                    }, /TypeError: Oops/);
                });
            });
            describe('arrayof', function() {
                it('should check if x is an array of numbers', function() {
                    var x;
                    x = ['a', 'b', 'c'];
                    assert.strictEqual(type(x).arrayof.number, false);
                    x = [1, 2, 3];
                    assert(type(x).arrayof.number);
                });
                it('should be callable with alternaive syntax', function() {
                    var x;
                    x = ['a', 'b', 'c'];
                    assert.strictEqual(type.arrayof.number(x), false);
                    x = [1, 2, 3];
                    assert(type.arrayof.number(x));
                });
            });
            describe('of', function() {
                it('should check that x is an object whose properties are all strings', function() {
                    var x;
                    x = { a : 1, b : 2, c : 3 };
                    assert.strictEqual(type(x).of.string, false);
                    x = { a : 'a', b : '2' };
                    assert(type(x).of.string);
                });
                it('should be callable with the alternative syntax', function() {
                    var x;
                    x = { a : 1, b : 2, c : 3 };
                    assert.strictEqual(type.of.string(x), false);
                    x = { a : 'a', b : '2' };
                    assert(type.of.string(x));
                });
            });
            describe('collapse', function() {
                it('should return the first valid value passed to type that matches the check', function() {
                    assert.strictEqual(type('string', {}, [], 42, true, Math.PI).collapse.number, 42);
                });
            });
            describe('all together', function() {
                it('should check that x is not an array of number', function() {
                    var x;
                    x = [1, 2, 3];
                    assert.strictEqual(type(x).not.arrayof.number, false);
                    assert.strictEqual(type.not.arrayof.number(x), false);
                    x = ['a'];
                    assert(type(x).not.arrayof.number);
                    assert(type.not.arrayof.number(x));
                });
            });
        });
        describe('interfaces', function() {
            it('should test if a or b implement the interface', function() {
                var interface = {
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
                assert.strictEqual(type(a).implements(interface), false);
                assert(type(b).implements(interface));
            });
            it('should support nested interfaces', function() {
                var nestedInterface = {
                    coordinates : type.arrayof.implements({
                        x : type.number,
                        y : type.number
                    })
                };
                var a = {
                    coordinates : { x : 4, y : 6 }
                };
                var b = {
                    coordinates : [
                        { x : 1, y : 2 },
                        { x : 3, y : 4 }
                    ]
                }
                assert.strictEqual(type(a).implements(nestedInterface), false);
                assert(type(b).implements(nestedInterface));
            });
            it('should support arbitrary functions', function() {
                var interface = {
                    three : function isThree(arg) {
                        return arg === 3 || /^(3|three|iii)$/i.test(arg);
                    }
                };
                var a = { three : 3 };
                var b = { three : '3' };
                var c = { three : 'III' };
                var d = { three : 3.1 };
                var e = { three : 'iiiv' };
                assert(type(a).implements(interface));
                assert(type(b).implements(interface));
                assert(type(c).implements(interface));
                assert.strictEqual(type(d).implements(interface), false);
                assert.strictEqual(type(e).implements(interface), false);
            });
        });
        describe('extend', function() {
            it('should allow you to implement custom tests', function() {
                function isThree(arg) {
                    return arg === 3 || /3|three|iii/i.test(arg);
                }
                type.extend('isThree', isThree, function(arg) {
                    return arg + ' is not three :(';
                });
                assert(type(3).isThree);
                assert(type.arrayof.isThree([3, 'THREE', 'IiI']));
                assert.throws(function() {
                    type('three').assert.not.isThree;
                }, /TypeError: three is not three :\(/)
            });
        });
        describe('extendfn', function() {
            it('should allow you to implement custom tests', function() {
                function threeSumTo100(n1, n2, arg) {
                    return n1 + n2 + arg === 100;
                }
                type.extendfn('threeSumTo100', threeSumTo100, function(n1, n2, arg) {
                    return n1 + ' + ' + n2 + ' + ' + arg + ' does not equal 100';
                });
                assert(type(50).threeSumTo100(25, 25));
                assert.strictEqual(type('100').threeSumTo100(0, 0), false);
                assert(type.arrayof.threeSumTo100(90, 5, [5, 5, 5]));
                assert.strictEqual(type.threeSumTo100(33)(33)(33), false);
            });
            it('should be curryable', function() {
                var twoSumTo50 = type.threeSumTo100(50);
                assert(twoSumTo50(25, 25));
                assert.strictEqual(twoSumTo50(50, 50), false);
            });
        });
    });
    describe('api', function() {

    });
});