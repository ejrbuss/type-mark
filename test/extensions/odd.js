var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/odd');

describe('.odd', function() {
    helper('odd', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'even'      : false,
        'odd'       : true,
        'function'  : false,
        'object'    : false,
        'array'     : false
    });
});