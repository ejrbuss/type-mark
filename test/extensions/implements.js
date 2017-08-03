var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {
    describe('.implements', function() {

        type.extend('testImplements', type.implements({
            a : type.string,
            b : type.number,
            c : type.array,
            d : {
                a : type.arrayof.function,
                b : type.of.boolean
            }
        }));

        helper.interface = [{
                a : 'test',
                b : 4,
                c : [],
                d : {
                    a : [function() {}, console.log],
                    b : { a : true }
                }
            }, {
                a : 'test!',
                b : 1435.456,
                c : ['string', 4, true],
                d : {
                    a : [],
                    b : [false]
                },
                e : 'test',
                f : {
                    a : [/regex/]
                }
            }
        ];

        helper.notInterface = [{
                a : 'test',
                b : 1.34,
                c : [],
                d : {
                    a : [],
                    b : 0
                }
            }, {
                a : 'test',
                b : 1,
                c : [],
                d : {}
            }
        ];

        helper(type, 'testImplements', {
            'undefined'    : false,
            'null'         : false,
            'boolean'      : false,
            'number'       : false,
            'string'       : false,
            'function'     : false,
            'object'       : false,
            'array'        : false,
            'interface'    : true,
            'notInterface' : false
        });
        it('should throw an error if passed a non object as an interface', function() {
            assert.throws(function() {
                type({}).implements(12);
            });
        });
        it('should throw an error if passed an object with non function kes', function() {
            assert.throws(function() {
                type({}).implements({ x : 12 });
            });
        });
        it('should throw an error showing the interface and given object', function() {
            var interface = {
                x : function testX() { return false; },
                y : function testY() { return false; }
            };
            assert.throws(function() {
                type({ x : 2, y : 3 }).assert.implements(interface);
            }, /TypeError: Asserted: implements {"x":"testX","y":"testY"} -- Found: {"x":2,"y":3}/);
        });
    });
});