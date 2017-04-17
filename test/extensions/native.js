var assert = require('assert');
var helper = require('../helper');
var type   = require('../../type-mark.min');

helper.native    = [console.log, [].concat];
helper.notNative = [function() {}, function named() {}];

describe('.native', function() {
    helper('native', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'number'    : false,
        'object'    : false,
        'native'    : true,
        'notNative' : false,
        'array'     : false
    });
});