var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.integer', function() {
        helper(type, 'integer', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'integer'   : true,
            'float'     : false,
            'function'  : false,
            'object'    : false,
            'array'     : false
        });
    });
});