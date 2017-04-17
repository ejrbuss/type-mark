var assert = require('assert');
var helper = require('../helper');
var type   = require('../../type-mark.min');

describe('.max()', function() {

    type.extend('testMax', type.max(3));

    helper.max = [-1000, -1, 0, 1, 2, 3, -123.3424, 0.000045];
    helper.min = [4, 5, 1000, 45.647476];

    helper('testMax', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'string'    : false,
        'object'    : false,
        'function'  : false,
        'max'       : true,
        'min'       : false
    });

    it('should have an error message specifying the maximum value', function() {
        assert.throws(function() {
            type(112).assert.max(99);
        }, /TypeError: Expected a value less than or equal to 99 instead found 112/);
    });
});