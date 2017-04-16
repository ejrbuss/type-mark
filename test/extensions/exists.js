var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-mark');
require('../../src/extensions/exists');

describe('.exists', function() {
    helper('exists', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : true,
        'number'    : true,
        'function'  : true,
        'object'    : true,
        'array'     : true
    });
});