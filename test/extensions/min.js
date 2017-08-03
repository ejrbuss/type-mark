var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.min()', function() {

        type.extend('testMin', type.min(4));

        helper.max = [-1000, -1, 0, 1, 2, 3, -123.3424, 0.000045];
        helper.min = [4, 5, 1000, 45.647476];

        helper(type, 'testMin', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'string'    : false,
            'object'    : false,
            'function'  : false,
            'max'       : false,
            'min'       : true
        });
        it('should throw an error if it not passed a number', function() {
            assert.throws(function() {
                type({}).min('string');
            });
        });
        it('should throw an error with the minimum value', function() {
            assert.throws(function() {
                type(-0.379).assert.min(0);
            }, /TypeError: Asserted: min 0 -- Found: number -0.379/);
        });
    });
});