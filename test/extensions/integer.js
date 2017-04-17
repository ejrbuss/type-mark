var assert = require('assert');
var helper = require('../helper');
var type   = require('../../type-mark.min');

describe('.integer', function() {
    helper('integer', {
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