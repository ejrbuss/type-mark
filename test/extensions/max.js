var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.max()', function() {

        type.extend('testMax', type.max(3));

        helper.max = [-1000, -1, 0, 1, 2, 3, -123.3424, 0.000045];
        helper.min = [4, 5, 1000, 45.647476];

        helper(type, 'testMax', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'string'    : false,
            'object'    : false,
            'function'  : false,
            'max'       : true,
            'min'       : false
        });
        it('should throw an error if it not passed a number', function() {
            assert.throws(function() {
                type({}).max('string');
            });
        });
        it('should throw an error with the maximum value', function() {
            assert.throws(function() {
                type(12).assert.max(5);
            }, /TypeError: Asserted: max 5 -- Found: number 12/);
        });
    });
});