var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.or()', function() {

        type.extend('testOr', type.or(type.boolean, type.string));

        helper(type, 'testOr', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : true,
            'number'    : false,
            'string'    : true,
            'function'  : false,
            'object'    : false,
            'array'     : false,
        });

    });
});