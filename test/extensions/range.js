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

        it('should have an error message specifying the range', function() {
            assert.throws(function() {
                type(12).assert.range(0, 10);
            }, /TypeError: Expected a value between 0 and 10 instead found 12/);
        });
    });
});