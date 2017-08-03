var assert = require('assert');
var multi  = require('./multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('type-mark', function() {
        describe('type()', function() {
            it('should return an instance of TypeState', function() {
                assert(type() instanceof type.TypeState);
            });
        });
        describe('TypeState', function() {
            describe('.value', function() {
                it('should equal the passed value', function() {
                    assert.strictEqual(type('test').value, 'test');
                });
                it('should equal the first passed value', function() {
                    assert.strictEqual(type(1, 2, 3, 4).value, 1);
                });
            });
            describe('.type', function() {
                it('should return null for null', function() {
                    assert.strictEqual(type(null).type, 'null');
                });
                it('should return boolean for true', function() {
                    assert.strictEqual(type(true).type, 'boolean');
                });
                it('should return boolean for false', function() {
                    assert.strictEqual(type(false).type, 'boolean');
                });
                it('should return number for a number', function() {
                    assert.strictEqual(type(Math.PI).type, 'number');
                });
                it('should return string for a string', function() {
                    assert.strictEqual(type('test').type, 'string');
                });
                it('should return function for a function', function() {
                    assert.strictEqual(type(function() {}).type, 'function');
                });
                it('should return object for a object', function() {
                    assert.strictEqual(type([1, 2, 3, 4]).type, 'object');
                });
            });
            describe('.resolve()', function() {
                it('should return true when given a passing test', function() {
                    var ts = type();
                    assert.strictEqual(ts.resolve('', function() {
                        return true;
                    }), true);
                });
                it('should return false when given a failing test', function() {
                    var ts = type();
                    assert.strictEqual(ts.resolve('', function() {
                        return false;
                    }), false);
                });
                it('should return false when given a notted passing test', function() {
                    var ts = type().not;
                    assert.strictEqual(ts.resolve('', function() {
                        return true;
                    }), false);
                });
                it('should return true when given a notted failing test', function() {
                    var ts = type().not;
                    assert.strictEqual(ts.resolve('', function() {
                        return false;
                    }), true);
                });
                it('should pass each item to the test during arrayof', function() {
                    var ts     = type([1, 2, 3, 4]).arrayof;
                    var expect = 1;
                    assert.strictEqual(ts.resolve('', function(arg) {
                        return (arg === expect++);
                    }), true);
                });
                it('should fail when not passed an array', function() {
                    var ts = type({ a : 1, b : 2, c : 3}).arrayof;
                    assert.strictEqual(ts.resolve('', function() {
                        return true;
                    }), false);
                });
                it('should compose arrayof with not', function() {
                    var ts = type([1]).not.arrayof;
                    assert.strictEqual(ts.resolve('', function(arg) {
                        return true;
                    }), false);
                });
                it('should pass each value to the test during of', function() {
                    var ts  = type({ a : 1, b : 2, c : 3}).of;
                    var sum = 0;
                    assert.strictEqual(ts.resolve('', function(arg) {
                        if(typeof arg === 'number') {
                            sum += arg;
                        }
                        return typeof arg === 'number';
                    }), true);
                    assert.strictEqual(sum, 6);
                });
                it('should compose of with not', function() {
                    var ts = type([1]).not.of;
                    assert.strictEqual(ts.resolve('', function(arg) {
                        return true;
                    }), false);
                });
                it('should pass each parameter to the test during collapse until a pass', function() {
                    var ts = type(1, 2, 3, 4).collapse;
                    assert.strictEqual(ts.resolve('', function(arg) {
                        if(arg === 3) {
                            return true;
                        }
                        if(arg === 4) {
                            throw new Error();
                        }
                        return false;
                    }), 3);
                });
                it('should compose collapse with not', function() {
                    var ts = type(1, 2, 3, 4).not.collapse;
                    assert.strictEqual(ts.resolve('', function(arg) {
                        return true;
                    }), false)
                });
                it('should throw a TypeError when failing an assert', function() {
                    var ts = type().assert;
                    assert.throws(function() {
                        ts.resolve('', function(arg) {
                            return false;
                        });
                    }, TypeError, 'Expected instead found undefined');
                });
                it('should throw a TypeError with a specified message function', function() {
                    var ts = type(42).assert.message(function(arg) { return arg; });
                    assert.throws(function() {
                        ts.resolve('', function(arg) {
                            return false;
                        });
                    }, /TypeError: 42/);
                });
                 it('should throw a TypeError with a specified message', function() {
                    var ts = type(42).assert.message('test');
                    assert.throws(function() {
                        ts.resolve('', function(arg) {
                            return false;
                        });
                    }, /TypeError: test/);
                });
            });
            describe('.message()', function() {
                it('should set ._message', function() {
                    var fn = function() { return 'test'; };
                    var ts = type().message(fn);
                    assert.strictEqual(ts._message, fn);
                });
                it('should return itself', function() {
                    var ts = type();
                    assert.strictEqual(ts.message(function() {}), ts);
                })
            });
            describe('.result()', function() {
                it('should apply value to test', function() {
                    var ts = type('test');
                    ts.result(function(arg) {
                        assert.strictEqual(arg, 'test');
                    });
                });
                it('should apply the state context to test', function() {
                    var ts = type('test');
                    ts.result(function(arg) {
                        assert.strictEqual(this, ts);
                    });
                });
                it('should apply ._args to test', function() {
                    var ts = type('test');
                    ts._args = [1, 2, 3, 4];
                    ts.result(function(a, b, c, d, arg) {
                        assert.strictEqual(a, 1);
                        assert.strictEqual(b, 2);
                        assert.strictEqual(c, 3);
                        assert.strictEqual(d, 4);
                        assert.strictEqual(arg, 'test');
                    });
                });
                it('should return the result of test', function() {
                    var ts = type();
                    assert.strictEqual(ts.result(function() {
                        return 'test';
                    }), 'test');
                });
            });

        });
        describe('extend()', function() {
            it('should define type.name as the test', function() {
                var fn = function(arg) {
                    return !!arg;
                };
                var msg = function(arg) {
                    return 'test!';
                };
                type.extend('test', fn, msg);
                assert.strictEqual(type.test, fn);
            });
            it('should create a new valid test', function() {
                var ts = type(true);
                assert.strictEqual(ts.test, true);
            });
            it('should create a test composible with not', function() {
                var ts = type(true).not;
                assert.strictEqual(ts.test, false);
            });
            it('should create a test composible with arrayof', function() {
                var ts = type([1, 2, 3]).arrayof;
                assert.strictEqual(ts.test, true);
                ts = type([1, 2, 3, 0]).arrayof;
                assert.strictEqual(ts.test, false);
            });
            it('should create a test composible with of', function() {
                var ts = type({ a : 1, b : 2, c : 3 }).of;
                assert.strictEqual(ts.test, true);
                ts = type({ a : 1, b : 2, c : 3, d : 0 }).of;
                assert.strictEqual(ts.test, false);
            });
            it('should create a test composible with collape', function()  {
                var ts = type(0, 0, 3).collapse;
                assert.strictEqual(ts.test, 3);
                ts = type(0, false, null).collapse;
                assert.strictEqual(ts.test, false);
            });
            it('should create a test composible with assert', function() {
                var ts = type(false).assert;
                assert.throws(function() {
                    ts.test;
                }, /TypeError: test!/);
            });
        });
        describe('extendfn()', function() {
            it('should define a curried version of test as type.name', function() {
                var fn = function(fn, arg1, arg) {
                    return fn(arg1, arg);
                };
                var msg = function() {
                    return 'testfn!';
                };
                type.extendfn('testfn', fn, msg);
                assert(typeof type.testfn(1) === 'function');
                assert(typeof type.testfn(1, 2) === 'function');
                assert.strictEqual(type.testfn(function(arg1, arg2) {
                    return arg1 + arg2;
                }, 3, 4), 7);
            });
            it('should create a new valid test', function() {
                var ts = type(false);
                assert.strictEqual(ts.testfn(type.test, true), true);
            });
            it('should create a test composible with not', function() {
                var ts = type(false).not;
                assert.strictEqual(ts.testfn(type.test, true), false);
            });
            it('should create a test composible with arrayof', function() {
                var ts     = type([1, 2, 3]).arrayof;
                var expect = 1;
                assert.strictEqual(ts.testfn(function(arg1, arg2) {
                    return arg1 === 1 && arg2 === expect++;
                }, 1), true);
            });
            it('should create a test composible with of', function() {
                var ts     = type({ a : 1, b : 2, c : 3 }).of;
                var sum    = 0;
                assert.strictEqual(ts.testfn(function(arg1, arg2) {
                    if(typeof arg2 === 'number') {
                        sum += arg2;
                    }
                    return arg1 === 1;
                }, 1), true);
                assert.strictEqual(sum , 6);
            });
            it('should create a test composible with collapae', function()  {
                var ts = type(0, 0, 3).collapse;
                assert.strictEqual(ts.testfn(function(arg1, arg) {
                    return type.test(arg);
                }, null), 3);
                ts = type(0, false, null).collapse;
                assert.strictEqual(ts.testfn(type.test, false), false);
            });
            it('should create a test composible with assert', function() {
                var ts = type(true).assert;
                assert.throws(function() {
                    ts.testfn(type.test, false);
                }, /TypeError: testfn!/);
            });
        });
    });
});

