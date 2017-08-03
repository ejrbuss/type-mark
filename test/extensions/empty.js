var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

helper.empty    = [{}, [], ''];
helper.notEmpty = [{ a : 1, b : 2, c : 3 }, [1, 2, 3, 4], 'test'];

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.empty', function() {
        helper(type, 'empty', {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'number'    : false,
            'function'  : false,
            'empty'     : true,
            'notEmpty'  : false
        });
        it('should give an error message showing the length of an array', function() {
            assert.throws(function() {
                type([1, 2, 3]).assert.empty();
            }, /TypeError: Asserted: empty -- Found: object lengthof 3/);
        });
        it('should give an error message showing the length of a string', function() {
            assert.throws(function() {
                type('test').assert.empty();
            }, /TypeError: Asserted: empty -- Found: string lengthof 4/);
        });
        it('should give an error message showing the length as undefined for non enumerable types', function() {
            assert.throws(function() {
                type(12).assert.empty();
            }, /TypeError: Asserted: empty -- Found: number lengthof undefined/);
        });
    });
});

