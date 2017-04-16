var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/min');

describe('.min()', function() {

    type.extend('testMin', type.min(4));

    helper.max = [-1000, -1, 0, 1, 2, 3, -123.3424, 0.000045];
    helper.min = [4, 5, 1000, 45.647476];

    helper('testMin', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'string'    : false,
        'object'    : false,
        'function'  : false,
        'max'       : false,
        'min'       : true
    });

    it('should have an error message specifying the minimum value', function() {
        assert.throws(function() {
            type(-101).assert.min(0);
        }, /TypeError: Expected a value greater than or equal to 0 instead found -101/);
    });
});