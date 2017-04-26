var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.positive', function() {
        helper(type, 'positive', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'positive'  : true,
            'negative'  : false,
            'function'  : false,
            'object'    : false,
            'array'     : false
        });
    });
});