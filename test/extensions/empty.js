var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

helper.empty    = [{}, [], ''];
helper.notEmpty = [{ a : 1, b : 2, c : 3 }, [1, 2, 3, 4], 'test'];

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.empty', function() {
        helper(type, 'empty', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'number'    : false,
            'function'  : false,
            'empty'     : true,
            'notEmpty'  : false
        });
    });
});