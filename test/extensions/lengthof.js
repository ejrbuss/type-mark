var assert = require('assert');
var helper = require('../helper');
var type   = require('../../type-mark.min');

describe('.lengthof()', function() {

    type.extend('testLengthof', type.lengthof(3));

    helper.lengthof    = [[1, 2, 3], { a : 1, b : 2, c : 3 }, 'tes'];
    helper.notLengthof = [[], [1, 2, 3, 4], {}, '', 'test'];

    helper('testLengthof', {
        'undefined'   : false,
        'null'        : false,
        'boolean'     : false,
        'number'      : false,
        'string'      : false,
        'function'    : false,
        'lengthof'    : true,
        'notLengthof' : false
    });

    it('should have an error message specifying the correct length', function() {
        assert.throws(function() {
            type([1, 2, 3]).assert.lengthof(12);
        }, /TypeError: Expected an object of length 12 instead found object of length 3/);
    });
});