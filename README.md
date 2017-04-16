<img src='docs/logo.png'>

A small JavaScript library for type checking.

## Specification

### Type Checks

All type checks return a new `true` object if the type check passes
and `false` otherwise
```
type(x).undefined // checks if 'x' is undefined
type(x).boolean   // checks if 'x' is a boolean
type(x).number    // checks if 'x' is a number
type(x).string    // checks if 'x' is a string
type(x).function  // checks if 'x' is a function
type(x).object    // checks if 'x' is an object (not null)
type(x).array     // checks if 'x' is an array (convenience)
```

Additional utility tests are provided
```
type(x).empty    // checks if 'x' is an empty string, array, or object
type(x).native   // checks if 'x' is native code
type(x).integer  // checks if 'x' is an integer
type(x).positive // checks if 'x' is a positive number
type(x).negative // checks if 'x' is a negative number
type(x).even     // checks if 'x' is an even number
type(x).odd      // check if 'x' is an odd number
type(x).exsists  // checks if 'x' exsists
```

Functional tests allow for parameterized checks
```
type(x).lengthof(size)          // checks if 'x' has a length equal to size
type(x).instanceof(constructor) // checks if 'x' is an instance of constructor
type(x).max(n)                  // checks if 'x' is less than or equal to max
type(x).min(n)                  // checks if 'x' is greater than or equal to min
type(x).range(min, max)         // checks if 'x' is inclusisvely within min and max
type(x).like(duck)              // check if 'x' is like duck
type(x).implements(duck)        // checks if 'x' implements the duck interface
```

### Modifiers

Modifiers change the behavior of a specified test.
```
type(x).not.test            // checks if 'x' fails the test
type(x).arraof.test         // checks if 'x's array elements pass the test
type(x).objectof.test       // check if 'x's object elements pass the test
type(x).of.test             // check if 'x's elements pass the test
type(x, y, z).collapse.test // find the first of 'x', 'y', and 'z' that passes the test
type(x).assert.test         // if 'x' fails a TypeError is thrown
```

Modifiers can be cominded together. For example:
```
type(x, y, z).assert.collapse.not.test // assert that one of x, y, or z fails the test and return that value
```

### Interfaces

Interfaces provide a mechanism for defining data types.
```
let interface = type({
    key1 : type.integer,
    key2 : type.string
})
type(x).implements(interface) // 'x' must contain the members key1 and key2 and they must have the correct types. X may
```

When passed an object not passed through type, implements just checks to
see if the given object contains the same keys.

### Extending

It is easy to extend type checker to feature new tests, use `extend` when
your test does not require parameters. Use `extendfn` when your test
does require parameters. Your test recieves only the value being tested
and the parameters passed. An optional second parameter can be used to
specify a custom TypeError message when your test is used with an assert.
```
type.extend('isthree', function(arg) {
    return arg === 3 || /three/i.test(arg)
})

type(x).isthree

type.extendfn('equals', function(value) {
    return function(arg) {
        return arg === value;
    }
}))

type(x).equals(value)
```

```
TypeState.prototype.on = function(arg, ...patterns) {
    for(var i = 0, j = 1; j < patterns.length; i += 2, j += 2) {
        var condition = patterns[i];
        var fn        = patterns[j];
        if(condition(arg)) {
            return fn();
        }
    }
    return false;
};

let match = function(arg) {
    return function(...patterns) {
        return type(arg).on(...patterns);
    }
}

match(x)(
    type.string, console.log,
    type.number, console.err
);
```