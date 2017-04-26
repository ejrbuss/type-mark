var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.array', function() {
        helper(type, 'array', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'number'    : false,
            'string'    : false,
            'function'  : false,
            'object'    : false,
            'array'     : true,
        });
    });
});