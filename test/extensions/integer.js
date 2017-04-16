var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/integer');

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