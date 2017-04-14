let assert = require('assert');
let type   = require('../type-checker');

describe('type', function() {
    // Types
    describe('.undefined', function() {
        it('should equal true for undefined', function() {
            assert(type(void(undefined)).undefined);
        });
        it('should equal false for undefined', function() {
            assert(!type(4).undefined);
        });
    });
    describe('.boolean', function() {
        it('should equal true for true', function() {
            assert(type(true).boolean);
        });
        it('should equal true for false', function() {
            assert(type(false).boolean);
        });
        it('should equal false for non booleans', function() {
            assert(!type('string').boolean);
        });
    });
    describe('.number', function() {
        it('should equal true for numbers', function() {
            assert(type(5).number);
        });
        it('should equal false for non numbers', function() {
            assert(!type({}).number);
        });
    });
    describe('.string', function() {
        it('should equal true for strings', function() {
            assert(type('string').string);
        });
        it('should equal false for non string', function() {
            assert(!type([]).string);
        });
    });
    describe('.symbol', function() {
        it('should equal true for symbols', function() {
            assert(type(Symbol()).symbol);
        });
        it('should equal false for non symbols', function() {
            assert(!type(function Symbol() {}).symbol);
        });
    });
    describe('.function', function() {
        it('should equal true for functions', function() {
            assert(type(function() {}).function);
        });
        it('should equal false for non function', function() {
            assert(!type(false).function);
        });
    });
    describe('.array', function() {
        it('should equal true for arrays', function() {
            assert(type([1, 2, 3]).array);
        });
        it('should equal false for non arrays', function() {
            assert(!type({ 0 : 1, 1 : 2, 2 : 3 }).array);
        });
        it('should equal false for array likes', function() {
            assert(!type(arguments).array);
        });
    });
    describe('.object', function() {
        it('should equal true for objects', function() {
            assert(type({ x : 3 }).object);
        });
        it('should equal false for non objects', function() {
            assert(!type('string').object);
        });
        it('should equal false for null', function() {
            assert(!type(null).object);
        });
    });
    describe('.empty', function() {
        it('should equal true for empty arrays', function() {
            assert(type([]).empty);
        });
        it('should equal false for non empty arrays', function() {
            assert(!type([1, 2, 3]).empty);
        });
        it('should equal true for empty objects', function() {
            assert(type({}).empty);
        });
        it('should equal false for non empty object', function() {
            assert(!type({ x : 3 }).empty);
        });
        it('should equal true for empty strings', function() {
            assert(type('').empty);
        });
        it('should equal false for non empty strings', function() {
            assert(!type('string').empty);
        });
        it('shoud equal false for values with no legnth', function() {
            assert(!type(0).empty);
        });
    });
    describe('native', function() {
        it('should equal true for native functions', function() {
            assert(type(Object.prototype.toString).native);
        });
        it('should equal false for non native functions', function() {
            assert(!type(type).native);
        });
    });
    describe('.integer', function() {
        it('should equal true for integers', function() {
            assert(type(42).integer);
        });
        it('should retrurn false for doubles', function() {
            assert(!type(Math.PI).integer);
        });
        it('should equal false for non numbers', function() {
            assert(!type(function() {}).integer);
        });
    });
    describe('positive', function() {
        it('should equal true for positive numbers', function() {
            assert(type(Math.PI).positive);
        });
        it('should equal false for negative numbers', function() {
            assert(!type(-1).positive);
        });
        it('should equal false for non numbers', function() {
            assert(!type('string').positive);
        });
    });
    describe('negative', function() {
        it('should equal true for positive numbers', function() {
            assert(type(-12).negative);
        });
        it('should equal false for negative numbers', function() {
            assert(!type(Math.E).negative);
        });
        it('should equal false for non numbers', function() {
            assert(!type('string').negative);
        });
    });
    describe('even', function() {

    });
    describe('odd', function() {

    });
    describe('exsists', function() {

    });
    // Functions
    describe('lengthof', function() {

    });
    describe('instanceof', function() {

    });
    describe('min', function() {

    });
    describe('max', function() {

    });
    describe('range', function() {

    });
    describe('like', function() {

    });
    // Modifiers
    describe('.not', function() {

    });
    describe('.arrayof', function() {

    });
    describe('.assert', function() {

    });
    describe('.collapse', function() {

    });
    // System
    describe('.extend', function() {

    });
    describe('.extendFunction', function() {

    });
    describe('._debug', function() {

    });
    // Chaining
});
