var assert = require('assert');
var util   = require('../src/util');

describe('util', function() {
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
        it('should return undefined for other types', function() {
            assert.strictEqual(util.length(true), undefined);
            assert.strictEqual(util.length(2), undefined);
            assert.strictEqual(util.length(function() {}), undefined);
        });
    });
});