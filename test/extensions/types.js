var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/types');

function testType(type) {
    var test = {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'number'    : false,
        'function'  : false,
        'symbol'    : false,
        'object'    : false,
        'array'     : false

    };
    test[type] = true;
    describe(type, function() {
        helper(type, test);
    });
}

testType('undefined');
testType('boolean');
testType('number');
testType('function');
testType('symbol');