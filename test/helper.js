var assert = require('assert');
var type   = require('../src/type-checker');

function helper(test, mapping) {

    var names   = [];
    var values  = [];
    var results = [];

    Object.keys(mapping).forEach(function(key) {
        names.push(key);
        values.push(helper[key]);
        results.push(mapping[key]);
    });

    values.forEach(function(valueSet, key) {

        var result = results[key];
        var name   = names[key];

        // Check test ant not.test
        it('should return ' + result + ' for ' + name, function() {
            valueSet.forEach(function(value) {
                assert.strictEqual(!!type(value)[test], result);
                assert.strictEqual(!!type[test](value), result);
            });
        });
        it('should return ' + !result + ' for .not ' + name, function() {
            valueSet.forEach(function(value) {
                assert.strictEqual(!!type(value).not[test], !result);
                assert.strictEqual(!!type.not[test](value), !result);
            });
        });

        // Check arrayof.test and not.arrayof.test
        it('should return ' + result + ' for .arrayof ' + name + 's', function() {
            assert.strictEqual(!!type(valueSet).arrayof[test], result);
            assert.strictEqual(!!type.arrayof[test](valueSet), result);
        });
        it('should return ' + result + ' for .not.arrayof ' + name + 's', function() {
            assert.strictEqual(!!type(valueSet).not.arrayof[test], !result);
            assert.strictEqual(!!type.not.arrayof[test](valueSet), !result);
        });

        // Check of.test and not.of.test
        it('should return ' + result + ' for .of ' + name + 's', function() {
            assert.strictEqual(!!type(valueSet).of[test], result);
            assert.strictEqual(!!type.of[test](valueSet), result);
        });
        it('should return ' + !result + ' for .not.of ' + name + 's', function() {
            assert.strictEqual(!!type(valueSet).not.of[test], !result);
            assert.strictEqual(!!type.not.of[test](valueSet), !result);
        });

        // Check collapse.test and not.collapse.test
        it('should .collapse to return the first ' + test, function() {
            assert.strictEqual(type.apply(null, valueSet).collapse[test],     result  ? valueSet[0] : result);
            assert.strictEqual(type.apply(null, valueSet).not.collapse[test], !result ? valueSet[0] : !result);
        });

        // Check assert.test
        valueSet.forEach(function(value) {
            assert.throws(function() {
                result ? type(value).not.assert[test] : type(value).assert[test];
            }, TypeError);
        });
    });
}

helper.undefined = [undefined];
helper.null      = [null];
helper.boolean   = [true, false];
helper.positive  = [2, 4, 56000, 1, 3, 1025, 0.0000082, 98.312, Math.PI, Math.E];
helper.negative  = [-2, -4, -1024, -1, -3, -97, -112.45];
helper.even      = [2, 4, 0, -2, -4, 56000, -1024];
helper.odd       = [1, 3, -1, -3, 1025, -97];
helper.integer   = helper.even.concat(helper.odd).concat([0]);
helper.float     = [-112.45, 0.0000082, 98.312, Math.PI, Math.E, NaN]
helper.number    = helper.integer.concat(helper.float);
helper.string    = ['', 'test', 'a much longer string with \nescaped \t characters'];
helper.function  = [function() {}, function nameed() {}, console.log];
helper.symbol    = [Symbol(), Symbol('name')];
helper.object    = [{}, new Object(), /regex/, new function() {}];
helper.array     = [[], [1, 2, 3, 4], new Array(4), new Array(1, 2, 3, 4)];

module.exports = helper;