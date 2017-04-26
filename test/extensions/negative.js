var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.negative', function() {
        helper(type, 'negative', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'positive'  : false,
            'negative'  : true,
            'function'  : false,
            'object'    : false,
            'array'     : false
        });
    });
});