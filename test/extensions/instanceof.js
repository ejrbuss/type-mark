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
        it('should throw an error if it is not passed a function', function() {
            assert.throws(function() {
                type({}).assert.instanceof(12);
            });
        });
        it('should throw an error showing the names of both instances', function() {
            assert.throws(function() {
                type(new Date()).assert.instanceof(Array);
            }, /TypeError: Asserted: instanceof Array -- Found: instanceof Date/);
        });
        it('should throw an error if the argument is not an object', function() {
            assert.throws(function() {
                type(12).assert.instanceof(Date);
            }, /TypeError: Asserted: object -- Found: number 12/);
        });
    });
});