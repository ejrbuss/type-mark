var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/lengthof');

describe('.lengthof()', function() {

    type.extend('testLengthof', type.lengthof(3));

    helper.lengthof    = [[1, 2, 3], { a : 1, b : 2, c : 3 }, 'tes'];
    helper.notLengthof = [[], [1, 2, 3, 4], {}, '', 'test'];

    helper('testLengthof', {
        'undefined'   : false,
        'null'        : false,
        'boolean'     : false,
        'number'      : false,
        'string'      : false,
        'function'    : false,
        'lengthof'    : true,
        'notLengthof' : false
    });
});