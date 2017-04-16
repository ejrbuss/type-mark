var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-mark');
require('../../src/extensions/even');

describe('.even', function() {
    helper('even', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'even'      : true,
        'odd'       : false,
        'function'  : false,
        'object'    : false,
        'array'     : false
    });
});