var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.range()', function() {

        type.extend('testRange', type.range(-1.1, 72));

        helper.range    = [-1.1, -1, 0, 1, 2, 70, 71.9];
        helper.notRange = [-1.1002, -2, -5636.324, 100, 73];

        helper(type, 'testRange', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'string'    : false,
            'object'    : false,
            'function'  : false,
            'range'     : true,
            'notRange'  : false
        });
        it('should throw an error if it not passed numbers', function() {
            assert.throws(function() {
                type({}).lengthof('string', []);
            });
        });
        it('should throw an error with the minimum and maximum values', function() {
            assert.throws(function() {
                type(200).assert.range(0, 100);
            }, /TypeError: Asserted: between 0 and 100 -- Found: number 200/);
        });
    });
});