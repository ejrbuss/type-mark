var assert = require('assert');
var helper = require('../helper');
var type   = require('../../type-mark.min');

helper.empty    = [{}, [], ''];
helper.notEmpty = [{ a : 1, b : 2, c : 3 }, [1, 2, 3, 4], 'test'];

describe('.empty', function() {
    helper('empty', {
        'undefined' : false,
        'null'      : false,
        'boolean'   : false,
        'number'    : false,
        'function'  : false,
        'empty'     : true,
        'notEmpty'  : false
    });
});