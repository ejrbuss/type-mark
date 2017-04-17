var assert = require('assert');
var helper = require('../helper');
var type   = require('../../type-mark.min');

describe('.object', function() {
    helper('object', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'number'    : false,
        'function'  : false,
        'object'    : true,
        'array'     : true
    });
});