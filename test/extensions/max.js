var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/max');

describe('.max()', function() {

    type.extend('testMax', type.max(3));

    helper.max = [-1000, -1, 0, 1, 2, 3, -123.3424, 0.000045];
    helper.min = [4, 5, 1000, 45.647476];

    helper('testMax', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'string'    : false,
        'object'    : false,
        'function'  : false,
        'max'       : true,
        'min'       : false
    });
});