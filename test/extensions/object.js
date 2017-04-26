var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.object', function() {
        helper(type, 'object', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'number'    : false,
            'function'  : false,
            'object'    : true,
            'array'     : true
        });
    });
});