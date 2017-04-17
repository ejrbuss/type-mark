var assert = require('assert');
var helper = require('../helper');
var type   = require('../../type-mark.min');

describe('.negative', function() {
    helper('negative', {
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