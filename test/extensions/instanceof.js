var assert = require('assert');
var helper = require('../helper');
var type   = require('../../src/type-checker');
require('../../src/extensions/instanceof');

describe('.instanceof()', function() {

    type.extend('testInstanceof', type.instanceof(RegExp));

    helper.instance    = [/test/, new RegExp()];
    helper.notInstance = [{}, { a : 1, b : 2 }, new function() {}];

    helper('testInstanceof', {
        'undefined'   : false,
        'null'        : false,
        'boolean'     : false,
        'number'      : false,
        'string'      : false,
        'function'    : false,
        'array'       : false,
        'instance'    : true,
        'notInstance' : false
    });
});