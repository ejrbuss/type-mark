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
                it('should throw a TypeError with a message indicating why the check failed', function() {
                    assert.throws(function() {
                        type(4).assert.string;
                    }, /TypeError: Expected string instead found number/);
                });
                it('should assert that x is an array with length 10', function() {
                    var x;
                    x = 4;
                    assert.throws(function() {
                        type(x).assert.array.lengthof(10);
                    }, /TypeError: Expected array instead found number/);
                    x = [1, 2, 3];
                    assert.throws(function() {
                        type(x).assert.array.lengthof(10);
                    }, /TypeError: Expected an object of length 10 instead found an object of length 3/);
                    x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    assert(type(x).assert.array.lengthof(10));
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
                it('should return the first valid passe to type that matches the check', function() {
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

        });
        describe('extend', function() {

        });
        describe('extendfn', function() {

        });
    });
    describe('api', function() {

    });
});