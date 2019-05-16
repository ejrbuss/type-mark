# Introduction

Note if you just want a quick understanding of type-mark it is recommended you
start with the [Getting Started](/type-mark/index/#getting-started) section on
this site's homepage.

This page breaks down the internals of type-checker into 5 key sections.

 - **[Involved Examples](#involved-examples)** Some more intense examples than
 what appears in
 [Getting Started](/type-mark/index/#getting-started)
 - **[TypeState](#typestate)** A detailed look at the `TypeSate` object itself
 that makes type-mark tick
 - **[Extensions](#extensions)** Also referred to as tests or checks. This
 section details each extension individually
 - **[Modifiers](#modifiers)** A look at extension modifiers and how they stack
 together
 - **[Util](#util)** Overview of type-mark's utility library

# Involved Examples

## Creating a Regex Test

Regular expressions are a common method of validation. type-mark does not
include support for regex by default, but adding support is a straightforward
task.

### Motivation

Before designing a regex interface for type-mark we should first consider what
purpose it will serve, considering we have `/regex/.test` already. Here are a
couple benefits that may motivate us

 - Allows us to quickly modify our use of a given regex using type-mark's `not`,
 `arrayof`, `of`, `collapse`, and `assert` modifiers
 - Allows us to use regex validation in interfaces without having to create an
 anonymous function for every regex test

### Implementation

Below is an implementation of regex support for type-mark with the test name
`re`. The [.format](#formatasserted--array-found--array) is a method
provided by `TypeState` for creating default error messages. The first parameter
appears in the *Asserted* section of the message and the second parameter appears
in the *Found* section of the message.

```lang:js-readonly
type.extendfn('re', function(regex, arg) {
    return new RegExp('^' + regex.source + '$').test(arg);
}, function(regex, arg) {
    return this.format(['regex', regex], [this.type, arg]);
});
```

### Usage

There are a variety of ways we might use this new test. For simple patterns
we can use the standard API.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type('aaaab').re(/a+b/)
```
```lang:js-readonly-evaluator:jsEvaluator-immediate
type.re(/\d+/, '1.1')
```

We may wish to use this test as the basis for another test. We could use
[extend](#extendname--string-test--function-message--mixed) to create a test for a specific regex. Let's imagine we wanted
to validate a url.

```lang:js-readonly
var reUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

type.extend('url', type.re(reUrl));
```

We can now validate urls using the standard type-mark API, as well as use it
in interfaces. For instance you could define an interface like so

```lang:js-readonly
var website = {
    url    : type.url,
    name   : type.string,
    author : type.string,
    hits   : type.integer
};
```

We can now use this interface to validate that our list of websites meets
our expected format.

```lang:js-readonly
type(websiteList).arrayof.implements(website)
```

In this example we saw how type-mark treats user extensions as first class
citizens. Expanding type-mark is a process that builds on itself and is often
self referential.

## Adding a Nested Modiifer

type-mark provides several modifiers for introspecting objects and arrays,
but these only go one level deep. We will implement a nested modifier which
inspects all values in a nested set of array/objects.

### Motivation

Before creating a new modifiers we should first consider what purpose it will
serve. Here are a couple benefits that may motivate us

 - Saves us time when creating interfaces with homogenous types
 - Allows us to filter out unwanted types, for instance we may want to check
 that a record does not contain any strings

### Implementation

We will use recursion to check deeply nested objects. The first step is to
create a function that will return the correct results. We will call this
function `nest`. Let’s take a look at it

```lang:js-readonly
function nest(that, test, args, value) {
    if(type(value).object) {
        return Object.keys(value).every(function(i) {
            return nest(that, test, args, value[i]);
        });
    }
    return test.apply(that, args.concat([value]));
}
```

Let's break this down line by line.

```lang:js-readonly-nolines
function nest(that, test, args, value) {
```

Here our function signature tells us what we are going to need to pass in later
from our modifier. `that` is the current `TypeState` being resolved. `test` is the
check that our modifier is modifying. `args` is an array of arguments that may
need to be passed to the test (such as with `instanceof`, `lengthof`, etc.). And
finally value is the value we want to know the nested result of.

```lang:js-readonly-nolines
if(type(value).object) {
```

If value is an object (which includes Arrays) then we want to do our nested
check. That is for every key in the object we want to check that its value also
passes the nested check.

```lang:js-readonly-nolines
return Object.keys(value).every(function(i) {
    return nest(that, test, args, value[i]);
});
```

Here is the implementation of what we described above. For each item in our
value we are just going to recurse into nest. `that`, `test`, and `args` will
all remain the same, the only thing changing will be value!

```lang:js-readonly-nolines
return test.apply(that, args.concat([value]));
```

This is our else case, when our value is not an Array or object. Calling a test
from a modifier is not nearly as easy as `test(value)`. We have to make sure
to pass the calling context (the that argument) as well as pass in the expected
arguments (hence why we concat value to the end of arguments). Even the `not`
modifier must use `apply` to achieve this.

Now that we've broken down nest, all we have to do is write our modifier, which
is as easy as calling the right part of type-mark's API and then returning a call
to `nest`.

```lang:js-readonly
type.modify('nested', function nested(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var value = args.pop();

        return nest(that, test, args, value);
    };
});
```

Let's break this down too.

```lang:js-readonly-nolines
type.modify('nested', function nested(test) {
    return function() {
```

Modifiers are added to type-mark using the [modify](#modify) function. It expects a name
and a function which will take a test and return a new (modified) test. This is
why the first thing we do inside our modifier is return a new function, this
will replace test in the type-mark resolution process. In fact there is a good
chance that the test we are being passed has already been modified!

```lang:js-readonly-nolines
var that = this;
var args = type.util.toArray(arguments);
var value = args.pop();
```

Here we are getting the required values for `nest`. Because all tests are called
with `this` as the current `TypeState`, that means that `this` in our function
will be a `TypeState` too since we are a test! So `this` will become `that`. `args`
are just the arguments that got passed to our very own function, and the value
will be the final argument.

```lang:js-readonly-nolines
return nest(that, test, args, value);
```

Finally, we just call nest with our starting values.

### Usage

Nested calls will work even with no nesting at all. This means we can call it
with primitive types and will be like there is no modifier at all

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(12).nested.number
```

In the case of a flat array or object though, nested behaves a lot like `of`. In
fact the code shown here is based off the implementation of `of`.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([Math.PI]).nested.number
```

What makes it special is that it can weed out values that are a away
from the surface

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([[1, 2, 3, 4], { x : -1, y : 2.5, z : [0]}]).nested.number
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([{ x : 12 }, { y : [42, ['string!']]}]).nested.number
```

In this example, we saw how type-mark allows you to define your own modifiers.
Creating modifiers is not as simple as extensions, but they are significantly
more powerful since they change the way all other tests behave.

# TypeState

`TypeState` is the core object that powers type-mark. It is instantiated
indirectly through every call to `type`

## `new TypeState(values : Array)`

**values** is an array of values to test, where `values[0]` is used for
most tests and `values[...]` is used for tests with the collapse modifier.

## `.value`

The first element of the array argument given to the `TypeState`
constructor. This will correspond to the first argument passed to `type`.

```lang:js-readonly-evaluator:jsEvaluator-immediate
state = type('value')
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
state.value
```

## `.type`

The type of the `.value`. This value is computed upon access and is
equivalent to the result of `typeof` except that `null` will return
`null`.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(Math.PI).type
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(null).type
```

## `.stack`

An array of strings representing the current modifier stack on the `TypeState`.
This value is computed upon access and is equivalent to mapping over `._stack`
and replacing each modifier function with its name. Used by `.format`.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type().assert.not.arrayof.stack
```

## `._value`

The array of elements passed to the constructor of `TypeState`. Used by
the `collapse` modifier.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(1, 2, 3, 4)._value
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
new type.TypeState([1, 2, 3, 4])._value
```

## `._stack`

The current modifier stack on the `TypeState` instance. Each modifier is passed
the result of the return value of the previous modifier (starting right to left)
with the first modifier receiving the expected test.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type().assert.not.arrayof._stack
```

## `._args`

Stores the arguments used when calling an extension that takes parameters.

## `._return`

Used by modifiers to modify the return result for when a test passed. By default
this is `true`, but in the case of `collapse` this is modified to be the first
matching argument.

```lang:js-readonly-evaluator:jsEvaluator-immediate
state = type(4)
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
state._return = "Wha???"
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
state.number
```

## `._message`

The user specified string or function set by `.message()` used in place of the
default or extension specified `TypeError` message.

```lang:js-readonly-evaluator:jsEvaluator-immediate
state = type(4)
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
state._message = function() { return 'overridden'; }
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
state.assert.string
```

## `.resolve(name : string, test : function)`

**name** the name of the extension test

**test** the extension test function

Resolves a `TypeState` to either `._return` or `false`. The primary computing
function behind type-mark. Does *not* directly modify the modifier stack.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(4).not.resolve('string', type.string)
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(5).arrayof.resolve('instanceof', type.min(4))
```

## `.result(test : function)`

**test** the test to compute the result of

**returns** the return value of the given test

A function for computing the result of an extension on a given `TypeState`
object outside the context of modifiers, but within the context of its
initial value and arguments. Used internally for consistency.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(/regex/).not.result(type.instanceof(RegExp))
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type().result(type.number)
```

## `.message(message : mixed)`

**message** the overrideing message string or function

**returns** the `TypeState` object for chaining

A function that sets `._message`. If a string is passed to `.message` this
string will be used for any `TypeError`s that occur. If a function is passed it
will be called with the same arguments as the current test and used instead of
the default or extension specified `TypeError` message.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(null).message(':(').assert.exists
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(null).message(function(arg) { return 'Oops ' + arg; }).assert.exists
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type().message(function() { return 'Oops' })._message()
```

## `.format(asserted : Array, found : Array)`

**asserted** an Array of asserted values/names

**found** an Array of found values/names

**returns** the formatted error string

A function the combines the current modifier stack with a list of asserted and
found values to create an error message in the default format.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type().format(['hello', 'world'], ['maybe?', undefined])
```

# Extensions

Extensions, also known as tests or checks, are what make type-mark useful.

## `.extend(name : string, test : function, [message : mixed])`

**name** the name of the new test/check

**test** the test function

**message** an optional argument to specify the default error message

Extends `TypeState` with a new test function that will be called when accessed.
This function manages all the details required to ensure that the new test
is correctly modified by modifiers. Even though the test is a function, it is
run when it as accessed as a property. This is done using
[defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

The test function should expect one argument (the current value being tested)
and should always return a boolean result.

As an example, here is the implementation of the `array` extension

```lang:js-readonly
type.extend('array', Array.isArray);
```

By default a new extension's error message will use the format
```readonly-nolines
Uncaught TypeError: Expected <ExtenstionName> -- Found : <type> <value>
```

To provide a custom dynamic error message see
[.format](#formatasserted--array-found--array). Or alternatively access
[.stack](#stack) directly and create an appropriate error message. The error
message function is called with the same arguments as the test function,

## `.extendfn(name : string, test : function, [message : function])`

**name** the name of the new test/check

**test** the test function

**message** an optional argument to specify the default error message

Extends `TypeState` with a new test function that expects arguments. This
function manages all the details required to ensure that the new test is
correctly modified by modifiers. Additionally, the test function will be
converted to a curried function when accessed using type-mark's alternate
syntax.

The test function can expect any number of arguments greater than or equal to
one. The final argument received by the function will be the value being tested.
This is to ensure that currying works as expected. The function should always
return a boolean result.

As an example, here is the implementation of the `lengthof` extension

```lang:js-readonly
type.extendfn('lengthof', function(n, arg) {
    type(n).assert.number;
    return type.util.length(arg) === n;
}, function(n, arg) {
    return this.format(
        ['lengthof', n],
        [this.type, 'lengthof', String(type.util.length(arg))]
    );
});
```

It is more common for `extendfn` extensions to modify their error messages in
order to display the arguments passed to them. The above creates error messages
like the following

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([1, 2, 3]).assert.not.lengthof(3)
```

To provide a custom dynamic error message see
[.format](#formatasserted--array-found--array). Or alternatively access
[.stack](#stack) directly and create an appropriate error message. The error
message function is called with the same arguments as the test function,

## `and(...checks : function)`

**checks** any number of test functions

Returns true if the all the checks provided to `and` pass for the current
value. When using the standard syntax any number of test functions can be
passed, but when using the alternate syntax in an interface, only two checks
may be provided. This is to prevent currying from continuing indefinitely.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([1, 2, 3]).and(type.array, type.lengthof(3), type.exists)
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type({ x : [1, 2, 3] }).implements({ x : type.and(type.array, type.lengthof(3)) })
```

If you try to use `and` as a function with more than 2 arguments, you will get
an error message

```lang:js-readonly-evaluator:jsEvaluator-immediate
type({ x : [1, 2, 3]}).implements({ x : type.and(
    type.array,
    type.lengthof(3),
    type.exists
)})
```

## `array`

Returns true if the current value is an array.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([1, 2, 3]).array
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type('string').array
```

## `boolean`

Returns true if the current value is a boolean.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(true).boolean
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(false).boolean
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(0).boolean
```

## `empty`

Returns true if the current value is either an empty array, object, or string.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([]).empty
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type({}).empty
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type('').empty
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(' ').empty
```

## `even`

Returns true if the current value is an even integer.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(-2).even
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(4.04).even
```

## `exists`

Returns true if the current value is neither `null` nor `undefined`.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type([]).exists
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(null).exists
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(undefined).exists
```

## `function`

Returns true if the current value is a function.

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(function() {}).function
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(Array).function
```

```lang:js-readonly-evaluator:jsEvaluator-immediate
type(new Array()).function
```

## `implements(interface : object)`

**interface** an object of nested functions representing an interface

Returns true if the current value implements the given interface. An interface
should be composed exclusively of objects and functions. Each key in the object
should map to either a validation function (that when failing means the current
value does not implement the interface) or a nested object, representing a
nested object in the current value itself.

Below is an example interface

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

Based on the interface above we can test to see if a or b implement the
interface.

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

`a` due to `age` being a float rather than an integer. `b` succeeds because
additional properties are ignored.

Interfaces may also be nested within interfaces. For example

```lang:js-readonly
var nestedInterface = {
    coordinates : type.arrayof.implements({
        x : type.number,
        y : type.number
    })
};
```

is a valid interface that checks if the supplied object contains a property
coordinates that is an array of `{x, y}` objects.

User defined validation functions may also be used in an interface, for instance

```lang:js-readonly
var interface = {
    three : function isThree(arg) {
        return arg === 3 || /^(3|three|iii)$/i.test(arg);
    }
};
```

## `instanceof(constructor : function)`

**constructor** the object constructor

Returns true if the current value was constructed by `constructor`.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(new Date).instanceof(Date)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type([]).instanceof(Date)
```

## `integer`

Returns true if the current value is an "integer" that is it is equal to the
floored version of itself.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(3).integer
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(3.14).integer
```

## `lengthof(n : number)`

**n** the desired number

Returns true if the current value is either an array, string or object with `n`
keys.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type([1, 2, 3]).lengthof(3)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('hi!').lengthof(3)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type({ x : 'x' , y : 'y', z : 'z' }).lengthof(3)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type({}).lengthof(3)
```

## `max(n : number)`

**n** the maximum number

Returns true if the current value is less than or equal to max.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(Math.E).max(Math.PI)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(0).max(-1)
```

## `min(n : number)`

**n** the minimum number

Returns true if the current value is greater than or equal to min.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(Math.PI).min(Math.E)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(-1).min(0)
```

## `native`

Returns true if the current value is a native function. Based off the
implementation of [lodash's](https://lodash.com/) isNative function.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(Array).native
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type({}).native
```

## `negative`

Returns true if the current value is a negative number.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(-3.14).negative
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(-12000).negative
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(0).negative
```

## `number`

Returns true if the current value is a number.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(Math.PI).number
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type([]).number
```

## `object`

Returns true if the current value is an object (and not `null`).

```lang:js-evaluator:jsEvaluator-immediate-readonly
type([]).object
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(/regex/).object
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(null).object
```

## `odd`

Returns true if the current value is an odd integer.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(17).odd
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(1.04).odd
```

## `or(...checks : function)`

**checks** any number of test functions

Returns true if the any of the checks provided to `or` pass for the current
value. When using the standard syntax any number of test functions can be
passed, but when using the alternate syntax in an interface, only two checks
may be provided. This is to prevent currying from continuing indefinitely.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('test').or(type.number, type.boolean, type.string)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type({ x : [1, 2, 3] }).implements({ x : type.or(type.function, type.lengthof(3)) })
```

If you try to use `or` as a function with more than 2 arguments, you will get
an error message

```lang:js-evaluator:jsEvaluator-immediate-readonly
type({ x : [1, 2, 3] }).implements({ x : type.or(
    type.function,
    type.lengthof(3),
    type.exists
)})
```

## `positive`

Returns true if the current value is a positive number.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(3.14).positive
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(0).positive
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(-42).positive
```

## `range(min : number, max : number)`

**min** the minimum number

**max** the maximum number

Returns true if the current value is greater than or equal to min and strictly
less than the maximum.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(97).range(0, 100)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(-42).range(-50, 25)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(10).range(0, 10)
```

## `string`

Returns true if the current value is a string.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('string').string
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(true).string
```

## `symbol`

Returns true if the current value is a symbol.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(Symbol()).symbol
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('string').symbol
```

## `undefined`

Returns true if the current value is `undefined`.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(void 0).undefined
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type([]).undefined
```

# Modifiers

Modifiers wrap around extensions, changing their default behaviour. Modifiers are
applied in a stack, last in first out, basis. For example

```lang:js-readonly
type(x).arrayof.not.number
```

checks that x is an array of non-number elements whereas

```lang:js-readonly
type(x).not.arrayof.number
```

checks that x is not an array of numbers.

## `.modify(name : string, mod : function)`

**name** the name of the new modifier

**mod** the modifier function

Defines a new modifier. In addition to the `name` argument, the modifier
function's `.name` property should also be set to an appropriate value as it
is used in default error messages.

The modifier function is expected to accept a test function, for example the
array extension's test function `Array.isArray` and return a new modified test.
The modifier is expected to provide all arguments it received to the original
test function if appropriate, include the `this` value.

As an example, here is the implementation of the `not` modifier

```lang:js-readonly
type.modify('not', function not(test) {
    return function() {
        return !test.apply(this, arguments);
    };
});
```

## `arrayof`

Modifies the test function to return true only if the current value is an array
of values that all pass the test.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type([1, 2, 3]).arrayof.number
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type({ 0 : 1, 1 : 2, 2 : 3 }).arrayof.number
```

## `assert`

Modifies the test function to throw a `TypeError` if the test fails.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(42).assert.string
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('string').assert.not.string
```

## `collapse`

Modifies the test function to be called on all values passed to type, returning
the first value that passes the test. Returns false otherwise.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('string', {}, [], 42, true, Math.PI).collapse.number
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(1, function() {}, []).collapse.string
```

**Note** Collapse does not support the alternate calling syntax.

## `maybe`

Modifies the test function to return true for null and undefined values.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(null).maybe.number
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(12).maybe.number
```

## `not`

Modifies the test function, negating its result.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type('string').not.number
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type(Math.PI).not.exists
```

## `of`

Similar to [arrayof]($arrayof) but supports all objects.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type({ 0 : 1, 1 : 2, 2 : 3 }).arrayof.number
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type([1, 2, 3]).arrayof.number
```

# Util

type-mark comes packed with a small utility library for common tasks needed
elsewhere by the API.

## `.util.define(obj : object, name : string, fn : function)`

**object** the object to define a property on

**name** the name of the property

**fn** the function that returns the value of that property

Defines a readonly property on an object. Used to simplify calling
[defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

```lang:js-readonly
obj = {}
type.util.define(obj, 'x', function() { return true; })
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
obj.x
```

## `.util.toArray(arg : mixed)`

**arg** an array-like object

**returns** an array containing the values of the array-like object

Used to convert `arguments` to an array, or similar objects.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.util.toArray({ 0 : 1, 1 : 2, 2 : 3, length : 3 })
```

## `.util.length(arg : mixed)`

**arg** a value to get the length of

**returns** the length of the value or undefined if not applicable

Returns a meaningful length value for a given argument. For arrays and strings
this means `.length`. For objects this means the number of key value pairs they
contain (excluding Symbols). For all other values `undefined` is returned.

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.util.length([1, 2, 3])
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.util.length('Hello World!')
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.util.length({ x : 'x', y : 'y' })
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
type.util.length(12)
```

## `.util.curry(fn : function, [arity : number])`

**fn** the function to curry

**arity** an optional argument specifying the arity of the function

**returns** the curried function

Curries a function so that if it receives less than the functions's arity in
arguments it returns a new function expecting arity minus the number of
arguments received arguments. The returned function will also behave in this
way.

By default the `.length` property of the function is used for arity.

Based off the implementation explained
[here](http://blog.carbonfive.com/2015/01/14/gettin-freaky-functional-wcurried-javascript/).

```lang:js-readonly
fn = type.util.curry(function(a, b, c) { return a + b + c; })
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
fn(1)(2)(3)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
fn(1, 2)(3)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
fn(1)(2, 3)
```

```lang:js-evaluator:jsEvaluator-immediate-readonly
fn(1, 2, 3)
```