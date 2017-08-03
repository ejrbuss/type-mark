var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

helper.and    = [[1, 2, 3], [true, "false", {}]];
helper.notAnd = [{ '0' : 1, '1' : 2, '2' : 3 }, [1, 2], "123"];

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.or()', function() {

        type.extend('testAnd', type.and(type.array, type.lengthof(3)));

        helper(type, 'testAnd', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'number'    : false,
            'string'    : false,
            'function'  : false,
            'object'    : false,
            'and'       : true,
            'notAnd'    : false
        });

    });
});