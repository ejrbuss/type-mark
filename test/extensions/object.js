var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-mark');
require('../../src/extensions/object');

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