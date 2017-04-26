var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.odd', function() {
        helper(type, 'odd', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'even'      : false,
            'odd'       : true,
            'function'  : false,
            'object'    : false,
            'array'     : false
        });
    });
});