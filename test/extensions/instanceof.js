var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.instanceof()', function() {

        type.extend('testInstanceof', type.instanceof(RegExp));

        helper.instance    = [/test/, new RegExp()];
        helper.notInstance = [{}, { a : 1, b : 2 }, new function() {}];

        helper(type, 'testInstanceof', {
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

        it('should have an error message specifying the instance', function() {
            assert.throws(function() {
                type({}).assert.instanceof(RegExp);
            }, /TypeError: Expected an instance of RegExp instead found \[object Object\]/);
        });
    });
});