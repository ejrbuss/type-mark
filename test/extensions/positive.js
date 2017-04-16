var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-mark');
require('../../src/extensions/positive');

describe('.positive', function() {
    helper('positive', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'positive'  : true,
        'negative'  : false,
        'function'  : false,
        'object'    : false,
        'array'     : false
    });
});