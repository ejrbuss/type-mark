var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.exists', function() {
        helper(type, 'exists', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : true,
            'number'    : true,
            'function'  : true,
            'object'    : true,
            'array'     : true
        });
    });
});