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

        it('should have an error message specifying the interface and object', function() {
            assert.throws(function() {
                type({}).assert.implements({ a : type.array });
            }, /TypeError: Expected object to implement interface instead found \[object Object\]/);
        });
    });
});