var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.lengthof()', function() {

        type.extend('testLengthof', type.lengthof(3));

        helper.lengthof    = [[1, 2, 3], { a : 1, b : 2, c : 3 }, 'tes'];
        helper.notLengthof = [[], [1, 2, 3, 4], {}, '', 'test'];

        helper(type, 'testLengthof', {
            'undefined'   : false,
            'null'        : false,
            'boolean'     : false,
            'number'      : false,
            'string'      : false,
            'function'    : false,
            'lengthof'    : true,
            'notLengthof' : false
        });
        it('should throw an error if it not passed a number', function() {
            assert.throws(function() {
                type({}).lengthof('string');
            });
        });
        it('should throw an error with the expected and actual length', function() {
            assert.throws(function() {
                type([1, 2, 3]).assert.lengthof(5);
            }, /TypeError: Asserted: lengthof 5 -- Found: object lengthof 3/);
        });
        it('should throw an error with the expected and undefined if the argument is unemerable', function() {
            assert.throws(function() {
                type(12).assert.lengthof(5);
            }, /TypeError: Asserted: lengthof 5 -- Found: number lengthof undefined/);
        });
    });
});