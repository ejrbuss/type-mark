var assert = require('assert');
var util   = require('../type-mark.min').util;

describe('util', function() {
    describe('.not()', function() {
        it('should take a function that returns true and returns false', function() {
            assert.strictEqual(util.not(function() {
                return true;
            })(), false);
        });
        it('should take a function that returns false and return true', function() {
            assert.strictEqual(util.not(function() {
                return false;
            })(), true);
        });
        it('should return the not of a function', function() {
            var fn = util.not(function(arg) {
                return arg;
            });
            assert.strictEqual(fn(true), false);
            assert.strictEqual(fn(false), true);
        });
        it('should return a still curryable function if not all arguments are supplied', function() {
            var fn = util.not(util.curry(function(a, b) {
                return a === b;
            }));
            assert.strictEqual(typeof fn(1), 'function');
            assert.strictEqual(fn(1)(2), true);
            assert.strictEqual(fn(1)(1), false);
        });
    });
    describe('.arrayof()', function() {
        it('should pass each eleement of the tested value to the function', function() {
            var expect = 0; // -1 for curry check
            var fn     = util.arrayof(function(arg) {
                return arg === expect++;
            });
            assert.strictEqual(fn([1, 2, 3, 4]), true);
        });
        it('should return false for non arrays', function() {
            assert.strictEqual(util.arrayof(function() {})(1), false);
        });
        it('should return the reduced value of the test', function() {
            var fn = util.arrayof(function(arg) {
                return arg < 3;
            });
            assert.strictEqual(fn([0, 1, 2]), true);
            assert.strictEqual(fn([1, 2, 3]), false);
        });
        it('should return a still curryable function if not all arguments are supplied', function() {
            var fn = util.arrayof(util.curry(function(max, arg) {
                return arg <= max;
            }));
            var fn2 = fn(3);
            assert.strictEqual(typeof fn2, 'function');
            assert.strictEqual(fn2([0, 1, 2, 3]), true);
            assert.strictEqual(fn2([1, 2, 3, 4]), false);
        });
    });
    describe('.of()', function() {
        it('should pass each eleement of the tested value to the function', function() {
            var sum = 0; // -1 for curry check
            var fn  = util.of(function(arg) {
                if(typeof arg === 'number') {
                    sum += arg;
                }
                return true;
            });
            assert.strictEqual(fn({ a : 1, b : 2, c : 3 }), true);
            assert.strictEqual(sum, 6);
        });
        it('should return the reduced value of the test', function() {
            var fn = util.of(function(arg) {
                return arg < 3;
            });
            assert.strictEqual(fn([0, 1, 2]), true);
            assert.strictEqual(fn([1, 2, 3]), false);
        });
        it('should return a still curryable function if not all arguments are supplied', function() {
            var fn = util.of(util.curry(function(max, arg) {
                return arg <= max;
            }));
            var fn2 = fn(3);
            assert.strictEqual(typeof fn2, 'function');
            assert.strictEqual(fn2([0, 1, 2, 3]), true);
            assert.strictEqual(fn2([1, 2, 3, 4]), false);
        });
    });
    describe('.define()', function() {
        it('should define a property on the object', function() {
            var obj = {};
            util.define(obj, 'test', function() { return true; });
            assert.strictEqual(obj.test, true);
        });
        it('should define a property with a value equal to the functions return value', function() {
            var obj = {};
            var i   = 0;
            util.define(obj, 'test', function() {
                return i++;
            });
            assert.strictEqual(obj.test, 0);
            assert.strictEqual(obj.test, 1);
        });
    });
    describe('.length()', function() {
        it('should return the length of an Array', function() {
            assert.strictEqual(util.length([]), 0);
            assert.strictEqual(util.length([1, 2, 3]), 3);
        });
        it('should return the length of a string', function() {
            assert.strictEqual(util.length({}), 0);
            assert.strictEqual(util.length({ a : 1, b : 2 }), 2);
        });
        it('should return the number of keys in an object', function() {
            assert.strictEqual(util.length(''), 0);
            assert.strictEqual(util.length('test'), 4);
        });
        it('should return null for other types', function() {
            assert.strictEqual(util.length(true), null);
            assert.strictEqual(util.length(2), null);
            assert.strictEqual(util.length(function() {}), null);
        });
    });
});