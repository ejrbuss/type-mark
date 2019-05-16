# Why Use type-mark

Because `typeof` just doesn't cut it. The canonical example being

```lang:js-evaluator:jsEvaluator-immediate-readonly
typeof null
```

With type-mark checking for `null` is as easy as
```lang:js-evaluator:jsEvaluator-immediate-readonly
type(null).object
```
Not to mention the added benefits of [modifiers](#modifiers), [interfaces](#interfaces), and
[custom validation](#writing-your-own-tests).

# Considerations

type-mark is a **dependency free** library clocking in at ~8.5kB. In
terms of browser compatibility you will be safe in the following browser
versions based on [MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

| Firefox (Gecko) | Chrome | Internet Explorer | Opera | Safari |
| ------- | --------------- | ------ | ----------------- | ----- | ------ |
| 4.0 (2) | 5 | 9 | 11.60 | 5.1

# Installing

## On the Client

You can use the rawgit CDN to get the latest minified version

```lang:html-readonly
<script type="text/javascript" src="{{ site.cdn }}"></script>
```

Or you can include your own. Just save a copy of the minified file to your
site's javascript directory.

```lang:html-readonly
<script type="text/javascript" src="js/type-mark.min.js"></script>
```

Using any of the above methods will make type-check available via your
choice of commonjs interface. If `require` is not defined type-check defines
`type` on the window.

## On Node

type-mark is available through [npm](https://www.npmjs.com/). When using
[node.js](https://nodejs.org/en/) you can install using npm

```readonly-nolines
$ npm install type-mark
```

To use type-mark in your Node project you will need to require it
```lang:js-readonly
var type = require('type-mark');
```

## From Scratch

You can also clone the Git repository if you want the full source or are
interested in making modifications. type-check is dependency free so working
with it is as easy as cloning.

```readonly-nolines
$ git clone https://github.com/ejrbuss/type-mark.git
```

To run the npm scripts you will need to run `npm install` as well as have the
following global dependencies

- [mocha](https://mochajs.org/),
- [istanbul](https://istanbul.js.org/),
- [browserify](http://browserify.org/),
- [uglify-js](https://www.npmjs.com/package/uglify-js) and
- [jekyll/bundle](https://jekyllrb.com/).

The following npm scripts are made available

```readonly-nolines
$ npm run test     # run tests and code coverage
$ npm run build    # build type-mark.js and type-mark.min.js for the client
$ npm run site     # run the docs site
$ npm run version  # update version number and cdn
```

# Getting Started

For most checks the following call pattern is used

```lang:js-readonly
type(variable).modifier1.modifier2.check
```

For example if you wanted to check if `x` is a string

```lang:js-readonly
type(x).string
```

If `x` is not a string this will return `false`. If `x` is a string this will
return `true`. The same check can be made by calling the test function directly.

```lang:js-readonly
type.string(x)
```

The following checks can be made using either syntax.

| Check | Description |
| ----- | ----------- |
| `type(x).undefined` | Check if `x` is undefined |
| `type(x).boolean` | Check if `x` is a boolean |
| `type(x).number` | Check if `x` is a number |
| `type(x).integer` | Check if `x` is an integer |
| `type(x).even` | Check if `x` is even |
| `type(x).odd` | Check if `x` is odd |
| `type(x).positive` | Check if `x` is positive |
| `type(x).negative` | Check if `x` is negative |
| `type(x).string` | Check if `x` is a string |
| `type(x).function` | Check if `x` is a function |
| `type(x).native` | Check if `x` is a native function |
| `type(x).object` | Check if `x` is an object and not `null` |
| `type(x).symbol` | Check if `x` is a symbol |
| `type(x).array` | Check if `x` is an array |
| `type(x).empty` | Check if `x` is empty[1] |
| `type(x).exists` | Check if `x` is not `null` or `undefined` |

[1] *Works for `strings`, `arrays`, and `objects` based on keys*

In addition to basic checks there are also checks that take arguments. An
example of this is `instanceof`, which checks to see what constructor
was used to create the given object. For example, to check if `x` is a RegExp

```lang:js-readonly
type(x).instanceof(RegExp)
```

To call the check directly the variable needed to be tested needs to be passed
in second. So the above check becomes

```lang:js-readonly
type.instanceof(RegExp, x);
```

The order of arguments here allows all test functions to be
[curryable](https://en.wikipedia.org/wiki/Currying). This means if you were
constantly checking if variables were instances of `YourClass` you could
instantly create a checking function like so

```lang:js-readonly
checkYourClass = type.instanceof(YourClass);
checkYourClass(x);
```

This functionality applies to your own tests (see the section
on [extending type-mark](#writing-your-own-tests)). The following checks
take arguments just like `instanceof`.

| Check | Description |
| ----- | ----------- |
| `type(x).implements(interface)` | Check if `x` implements `interface`, see the section on [interfaces](#interfaces) |
| `type(x).instanceof(constructor)` | Check if `x` is an instance of `constructor` |
| `type(x).lengthof(n)` | Check if `x` has a length of `n`[1] |
| `type(x).max(n)` | Check if `x` is less than or equal to `n` |
| `type(x).min(n)` | Check if `x` is greater than or equal to `n` |
| `type(x).range(min, max)` | Check if `x` is greater than or equal to `min` and less than `max` |
| `type(x).and(...checks)` | Check if all `checks` pass for `x`[2] |
| `type(x).or(...checks)` | Check if any `checks` pass for `x`[2] |

[1] *Works for `strings`, `arrays`, and `objects` based on keys*

[2] *When curried only accepts two check arguments*

## Modifiers

By themselves these check functions are still limited and only allow for a
surface level checking of primitives. Modifiers are values you can prefix your
check with to modify its effect. Modifiers are applied in a stack, last in first
out, basis. For example

```lang:js-readonly
type(x).arrayof.not.number
```

checks that x is an array of non-number elements whereas


```lang:js-readonly
type(x).not.arrayof.number
```

checks that x is not an array of numbers.

### `not`

Negates the given test. For example

```lang:js-readonly
type(x).not.string
```

checks that `x` is **not** a string. Can also be called

```lang:js-readonly
type.not.string(x)
```

### `assert`

If the given check fails, a `TypeError` is thrown with a message indicating why
the check failed. For example

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(4).assert.string
```

Asserts that 4 is a string, which fails. Can also be called

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.assert.string(4)
```

A custom error message can be specified using the `message` function. `message`
takes a function which is called with the value being tested as well as any
arguments supplied to the test and uses the return result as the error message.
`message` also accepts a string for non-dynamic error messages.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(undefined).message(function(value) {
    return 'Oops I got ' + value
}).assert.exists
```

### `arrayof`

Rather than checking the given value this instead checks the elements of the given
value. Automatically fails if the passed value is not an Array. The following
example asserts that `x` is an array of numbers.

```lang:js-readonly
type(x).arrayof.number
```

Can also be called

```lang:js-readonly
type.arrayof.number(x)
```

### `of`

Rather than checking the passed value, checks the properties of the passed value.
Automatically fails if the passed value is not an object. Note
that this means `of` works as expected with arrays as well. The following
example asserts that `x` is an object whose properties are all strings.

```lang:js-readonly
type(x).of.string
```

Can also be called

```lang:js-readonly
type.of.string(x)
```

### `collapse`

Collapse is useful for functions that take an optional number of out of order
arguments. It returns the first value passed to type that matches the check.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('string', {}, [], 42, true, Math.PI).collapse.number
```

**Note** Collapse does not support the alternate calling syntax.

### All Together

Modifiers can be combined to create a complex check. For example, here we assert
that `x` is not an array of numbers

```lang:js-readonly
type(x).assert.not.arrayof.number
```

## Interfaces

The checks looked at so far don't do much to help define type checkable objects
with a mix of different types. This is where interfaces and type-mark's
alternate syntax comes in. An interface looks like the following

```lang:js-readonly
var myInterface = {
    name : type.string,
    age  : type.integer,
    coordinate : {
        x : type.number,
        y : type.number,
        z : type.number
    }
};
```

Interfaces can be passed to the `implements` check to check if an object meets
a set of structured tests. For instance, based on our interface above we can
test to see if a or b implement the interface.

```lang:js-readonly
var a = {
    name : 'bear',
    age  : 14.5,
    coordinate : {
       x : 0.0,
       y : 1.1, 
       z : 0.1
    }
}
var b = {
    name : 'bird',
    age  : 1,
    coordinate : {
        x : 0.0,
        y : 0.0,
        z : 14.0,
        flag : true
    }
}
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(a).implements(myInterface)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(b).implements(myInterface)
```

A couple of things to note about this example. First notice that `a` fails the
check even though only one of its properties is incorrect. `age` is a float rather than an integer. Also `b` succeeds the check even though it contains additional data `coordinates.flag`. The `implements` check does not care if the object it received contains additional properties.

Interfaces may also be nested within interfaces. You can use `type.implements`
to achieve this. For example

```lang:js-readonly
var nestedInterface = {
    coordinates : type.arrayof.implements({
        x : type.number,
        y : type.number
    })
};
```

is a valid interface that checks if the supplied object contains a property
coordinates that is an array of `{x, y}` objects. Interfaces are just a composed set of validation functions. Because
`type.implements(interface)` returns a function it can also be used for validation.

This also means that you can provide whatever function to the interface you
would like, for instance

```lang:js-readonly
var interface = {
    three : function isThree(arg) {
        return arg === 3 || /^(3|three|iii)$/i.test(arg);
    }
};
```

Is also a valid interface. This makes interfaces extremely flexible especially
when combined with custom tests described in the next section.

## Writing Your Own Tests

type-mark provides two functions for adding tests: `extend` and `extendfn`. The
first allows you to define simple property-based checks, the second allows for
curryable functions.

### `extend`

Creates a new property-based check.

```lang:js-readonly
type.extend('nameOfTest', function test(value) {
    return isValueCorrect(value);
}, function customMessage(value) {
    return value + ' was not correct :(';
});
```

The first argument passed to `extend` is the name of the test, which will be
used for the default error message as well as defining all the access points
ie. `type(x).name`, `type.not.name`, etc.

The second argument passed to `extend` is the test function itself. It receives
the value currently being tested and is expected to return a boolean result.
It is also executed in the context of the `TypeState` object it is being
called on (as `this`). This gives you access to information such as the user specified
message, the currently set modifiers, and more. see the
[API]({{ "/api" | relative_url }}) for all the details.

The third (optional) argument passed to `extend` is the error message function.
This will be called if your test was asserted and failed. It is passed the value
being tested and is also executed in the context of the `TypeState` object.

As an example we will use our previous `isThree` function

```lang:js-readonly
function isThree(arg) {
    return arg === 3 || /^(3|three|iii)$/i.test(arg);
}
```

To create a new property check we would

```lang:js-readonly
type.extend('isThree', isThree, function(arg) {
    return arg + ' is not three :(';
});
```

We can now use isThree in all the ways you would expect.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(3).isThree
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('three').not.isThree
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.arrayof.isThree([3, 'THREE', 'IiI'])
```

## `extendfn`

Creates a new function-based check. Takes the same arguments as `extend`
except it will be passed any number of specified arguments prior to the actual
value being tested. For example, lets create a validation function that asserts
that three numbers sum to 100.

```lang:js-readonly
function threeSumTo100(n1, n2, arg) {
    return n1 + n2 + arg === 100;
}
```

To create a new function check we would

```lang:js-readonly
type.extendfn('threeSumTo100', threeSumTo100, function(n1, n2, arg) {
    return n1 + ' + ' + n2 + ' + ' + arg + ' does not equal 100';
});
```

We can now use threeSumTo100 in all the ways you would expect.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(50).threeSumTo100(25, 25)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('100').threeSumTo100(0, 0)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.arrayof.threeSumTo100(90, 5, [5, 5, 5])
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.threeSumTo100(33)(33)(33)
```

Note that `type.threeSumTo100` is now a curried function. This means we can
partially apply parameters to create new functions. For example

```lang:js-readonly
var twoSumTo50 = type.threeSumTo100(50)
```

# Try it Out
You can type your own type-mark expressions in the editor below. Give it a go!
```lang:js-evaluator:jsEvaluator-placeholder
Try writing some code! eg. type(4).numbeer
```

# Contact

If you are interested in my other work checkout my [website](http://www.ejrbuss.net)

Email [ejrbuss@gmail.com](mailto:ejrbuss@gmail.com)

# License

type-mark is made available under the
[MIT](https://github.com/ejrbuss/type-mark/blob/master/LICENSE) license.
That basically means anything goes! Just don't come crying to me if you
hurt yourself.