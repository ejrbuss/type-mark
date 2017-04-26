var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.even', function() {
        helper(type, 'even', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'even'      : true,
            'odd'       : false,
            'function'  : false,
            'object'    : false,
            'array'     : false
        });
    });
});