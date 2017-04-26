var assert = require('assert');
var helper = require('../helper');
var multi  = require('../multi-require');

multi('../src/index.js', '../type-mark.min.js', function(type) {

    function testType(name) {
        var test = {
            'undefined' : false,
            'null'      : false,
            'boolean'   : false,
            'number'    : false,
            'function'  : false,
            'symbol'    : false,
            'object'    : false,
            'array'     : false

        };
        test[name] = true;
        describe(name, function() {
            helper(type, name, test);
        });
    }

    testType('undefined');
    testType('boolean');
    testType('number');
    testType('function');
});