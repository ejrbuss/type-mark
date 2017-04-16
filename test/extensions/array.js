var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/array');

describe('.array', function() {
    helper('array', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'number'    : false,
        'string'    : false,
        'function'  : false,
        'object'    : false,
        'array'     : true,
    });
});