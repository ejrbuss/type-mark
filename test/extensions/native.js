var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

helper.native    = [console.log, [].concat];
helper.notNative = [function() {}, function named() {}];

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.native', function() {
        helper(type, 'native', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'number'    : false,
            'object'    : false,
            'native'    : true,
            'notNative' : false,
            'array'     : false
        });
    });
});