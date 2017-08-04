---
layout: home
---

<br />
<br />

# type-mark API

### Introduction

Note if you just want a quick understanding of type-mark it is recommended you
start with the [Getting Started]({{ site.baseurl }}/#getting-started) section on
this site's homepage.

This page breaks down the internals of type-checker into 5 key sections.

 - **[Involved Examples](#involved-examples)** Some more intense examples than
 what appears in
 [Getting Started]({{ "/#getting-started" | relative_url }})
 - **[TypeState](#typestate)** A detailed look at the `TypeSate` object itself
 that makes type-mark tick
 - **[Extensions](#extensions)** Also referred to as tests or checks. This
 section details each extension individually
 - **[Modifiers](#modifiers)** A look at extension modifiers and how they stack
 together
 - **[Util](#util)** Overview of type-mark's utility library

When going through this API guide it may be useful to test examples. Open
up your browser's console with <kbd>Ctrl/Cmd + Shift + i</kbd> and you can
test right on this page.

### Involved Examples

#### Creating a Regex Test

Regular expressions are a common method of validation. type-mark does not
include support for regex by default, but adding support is a straightforward
task.

##### Motivation

Before designing a regex interface for type-mark we should first consider what
purpose it will serve, considering we have `/regex/.test` already. Here are a
couple benefits that may motivate us

 - Allows us to quickly modify our use of a given regex using type-mark's `not`,
 `arrayof`, `of`, `collapse`, and `assert` modifiers
 - Allows us to use regex validation in interfaces without having to create an
 anonymous function for every regex test

##### Implementation

Below is an implementation of regex support for type-mark with the test name
`re`. The [.format](#formatasserted--array-found--array) is a method
provided by `TypeState` for creating default error messages. The first parameter
appears in the *Asserted* section of the message and the second parameter appears
in the *Found* section of the message.

```js
type.extendfn('re', function(regex, arg) {
    return new RegExp('^' + regex.source + '$').test(arg);
}, function(regex, arg) {
    return this.format(['regex', regex], [this.type, arg]);
});
```

##### Usage

There are a variety of ways we might use this new test. For simple patterns
we can use the standard API.

```js
> type('aaaab').re(/a+b/)
true
> type.re(/\d+/, '1.1')
false
```

We may wish to use this test as the basis for another test. We could use
[extend](#extendname--string-test--function-message--mixed) to create a test for a specific regex. Let's imagine we wanted
to validate a url.

```js
var reUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

type.extend('url', type.re(reUrl));
```

We can now validate urls using the standard type-mark API, as well as use it
in interfaces. For instance you could define an interface like so

```js
var website = {
    url    : type.url,
    name   : type.string,
    author : type.string,
    hits   : type.integer
};
```

We can now use this interface to validate that our list of websites meets
our expected format.

```js
> type(websiteList).arrayof.implements(website)
```

In this example we saw how type-mark treats user extensions as first class
citizens. Expanding type-mark is a process that builds on itself and is often
self referential.

#### Adding a Nested Modiifer

type-mark provides several modifiers for introspecting objects and arrays,
but these only go one level deep. We will implement a nested modifier which
inspects all values in a nested set of array/objects.

##### Motivation

Before creating a new modifiers we should first consider what purpose it will
serve. Here are a couple benefits that may motivate us

 - Saves us time when creating interfaces with homogenous types
 - Allows us to filter out unwanted types, for instance we may want to check
 that a record does not contain any strings

##### Implementation

We will use recursion to check deeply nested objects. The first step is to
create a function that will return the correct results. We will call this
function `nest`. Let’s take a look at it

```js
function nest(that, test, args, value) {
    if(type(value).object) {
        return Object.keys(value).every(function(i) {
            return nest(that, test, args, value[i]);
        });
    }
    return test.apply(that, args.concat([value]));
}
```

Lets break this down line by line.

```js
function nest(that, test, args, value) {
```

Here our function signature tells us what we are going to need to pass in later
from our modifier. `that` is the current `TypeState` being resolved. `test` is the
check that our modifier is modifying. `args` is an array of arguments that may
need to be passed to the test (such as with `instanceof`, `lengthof`, etc.). And
finally value is the value we want to know the nested result of.

```js
if(type(value).object) {
```

If value is an object (which includes Arrays) then we want to do our nested
check. That is for every key in the object we want to check that its value also
passes the nested check.

```js
return Object.keys(value).every(function(i) {
    return nest(that, test, args, value[i]);
});
```

Here is the implementation of what we described above. For each item in our
value we are just going to recurse into nest. `that`, `test`, and `args` will
all remain the same, the only thing changing will be value!

```js
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

```js
type.modify('nested', function nested(test) {
    return function() {

        var that = this;
        var args = type.util.toArray(arguments);
        var value = args.pop();

        return nest(that, test, args, value);
    };
});
```

Lets break this down too.

```js
type.modify('nested', function nested(test) {
    return function() {
```

Modifiers are added to type-mark using the [modify](#modify) function. It expects a name
and a function which will take a test and return a new (modified) test. This is
why the first thing we do inside our modifier is return a new function, this
will replace test in the type-mark resolution process. In fact there is a good
chance that the test we are being passed has already been modified!

```js
var that = this;
var args = type.util.toArray(arguments);
var value = args.pop();
```

Here we are getting the required values for `nest`. Because all tests are called
with `this` as the current `TypeState`, that means that `this` in our function
will be a `TypeState` too since we are a test! So `this` will become `that`. `args`
are just the arguments that got passed to our very own function, and the value
will be the final argument.

```js
return nest(that, test, args, value);
```

Finally, we just call nest with our starting values.

##### Usage

Nested calls will work even with no nesting at all. This means we can call it
with primitive types and will be like there is no modifier at all

```js
> type(12).nested.number
true
```

In the case of a flat array or object though, nested behaves a lot like `of`. In
fact the code shown here is based off the implementation of `of`.

```js
> type([Math.PI]).nested.number
true
```

What makes it special is that it can weed out values that are a away
from the surface

```js
> type([[1, 2, 3, 4], { x : -1, y : 2.5, z : [0]}]).nested.number
true
> type([{ x : 12 }, { y : [42, ['string!']]}]).nested.number
false
```

In this example, we saw how type-mark allows you to define your own modifiers.
Creating modifiers is not as simple as extensions, but they are significantly
more powerful since they change the way all other tests behave.

### TypeState

`TypeState` is the core object that powers type-mark. It is instantiated
indirectly through every call to `type`

```js
> type()
TypeState {...}
> new type.TypeState([])
TypeState {...}
```

#### `new TypeState(values : Array)`

**values** is an array of values to test, where `values[0]` is used for
most tests and `values[...]` is used for tests with the collapse modifier.

#### `.value`

The first element of the array argument given to the `TypeState`
constructor. This will correspond to the first argument passed to `type`.

```js
> state = type('value')
TypeState {...}
> state.value
"value"
```

#### `.type`

The type of the `.value`. This value is computed upon access and is
equivalent to the result of `typeof` except that `null` will return
`null`.

```js
> type(Math.PI).type
"number"
> type(null).type
"null"
```

#### `.stack`

An array of strings representing the current modifier stack on the `TypeState`.
This value is computed upon access and is equivalent to mapping over `._stack`
and replacing each modifier function with its name. Used by `.format`.

```js
> type().assert.not.arrayof.stack
[ 'assert', 'not', 'arrayof' ]
```

#### `._value`

The array of elements passed to the constructor of `TypeState`. Used by
the `collapse` modifier.

```js
> type(1, 2, 3, 4)._values
[1, 2, 3, 4]
> new TypeState([1, 2, 3, 4])._values
[1, 2, 3, 4]
```

#### `._stack`

The current modifier stack on the `TypeState` instance. Each modifier is passed
the result of the return value of the previous modifier (starting right to left)
with the first modifier receiving the expected test.

```js
> type().assert.not.arrayof._stack
[ [Function: assert], [Function: not], [Function: arrayof] ]
```

#### `._args`

Stores the arguments used when calling an extension that takes parameters.

```js
> type([]).lengthof(0)._args
[0]
> type(/regex/).instanceof(RegExp)._args
[RegExp]
```

#### `._return`

Used by modifiers to modify the return result for when a test passed. By default
this is `true`, but in the case of `collapse` this is modified to be the first
matching argument.

```js
> state = type(4)
TypeState {...}
> state._return = "Wha???"
'Wha???'
> state.number
'Wha???'
```

#### `._message`

The user specified string or function set by `.message()` used in place of the
default or extension specified `TypeError` message.

```js
> state = type(4)
TypeState {...}
> state._message = function() { return 'overriden'; }
function() {...}
> state.assert.string
Uncaught TypeError: overriden
```

#### `.resolve(name : string, test : function)`

**name** the name of the extension test

**test** the extension test function

Resolves a `TypeState` to either `._return` or `false`. The primary computing
function behind type-mark. Does *not* directly modify the modifier stack.

```js
> type(4).not.resolve('string', type.string)
true
> type(5).arrayof.resolve('instanceof', type.min(4))
false
```

#### `.result(test : function)`

**test** the test to compute the result of

**returns** the return value of the given test

A function for computing the result of an extension on a given `TypeState`
object outside the context of modifiers, but within the context of its
initial value and arguments. Used internally for consistency.

```js
> type(/regex/).not.result(type.instanceof(RegExp))
true
> type().result(type.number)
false
```

#### `.message(message : mixed)`

**message** the overrideing message string or function

**returns** the `TypeState` object for chaining

A function that sets `._message`. If a string is passed to `.message` this
string will be used for any `TypeError`s that occur. If a function is passed it
will be called with the same arguments as the current test and used instead of
the default or extension specified `TypeError` message.

```js
> type(null).message(':(').assert.exists
Uncaught TypeError: :(
> type(null).message(function(arg) { return 'Oops ' + arg; }).assert.exists
Uncaught TypeError: Oops null
> type().message(function() { return 'Oops' })._message()
"Oops"
```

#### `.format(asserted : Array, found : Array)`

**asserted** an Array of asserted values/names

**found** an Array of found values/names

**returns** the formatted error string

A function the combines the current modifier stack with a list of asserted and
found values to create an error message in the default format.

```js
> type().format(['hello', 'world'], ['maybe?', undefined])
'Asserted: hello world -- Found: maybe? '
```

### Extensions

Extensions, also known as tests or checks, are what make type-mark useful.

#### `.extend(name : string, test : function, [message : mixed])`

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

```js
type.extend('array', Array.isArray);
```

By default a new extension's error message will use the format
```js
Uncaught TypeError: Expected <ExtenstionName> -- Found : <type> <value>
```

To provide a custom dynamic error message see
[.format](#formatasserted--array-found--array). Or alternatively access
[.stack](#stack) directly and create an appropriate error message. The error
message function is called with the same arguments as the test function,

#### `.extendfn(name : string, test : function, [message : functino])`

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

```js
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

```js
> type([1, 2, 3]).assert.not.lengthof(3)
Uncaught TypeError: Asserted: not lengthof 3 -- Found: object lengthof 3
```

To provide a custom dynamic error message see
[.format](#formatasserted--array-found--array). Or alternatively access
[.stack](#stack) directly and create an appropriate error message. The error
message function is called with the same arguments as the test function,

#### `and(...checks : function)`

**checks** any number of test functions

Returns true if the all the checks provided to `and` pass for the current
value. When using the standard syntax any number of test functions can be
passed, but when using the alternate syntax in an interface, only two checks
may be provided. This is to prevent currying from continuing indefinitely.

```js
> type([1, 2, 3]).and(type.array, type.lengthof(3), type.exists)
true
> type({ x : [1, 2, 3] }).implements({ x : type.and(type.array, type.lengthof(3)) })
true
```

If you try to use `and` as a function with more than 2 arguments, you will get
an error message

```js
> type({ x : [1, 2, 3]}).implements({ x : type.and(
    type.array,
    type.lengthof(3),
    type.exists
  )})
Uncaught TypeError: Asserted: object -- Found: boolean false
```

#### `array`

Returns true if the current value is an array.

```js
> type([1, 2, 3]).array
true
> type('string').array
false
```

#### `boolean`

Returns true if the current value is a boolean.

```js
> type(true).boolean
true
> type(false).boolean
true
> type(0).boolean
false
```

#### `empty`

Returns true if the current value is either an empty array, object, or string.

```js
> type([]).empty
true
> type({}).empty
true
> type('').empty
true
> type(' ').empty
false
```

#### `even`

Returns true if the current value is an even integer.

```js
> type(-2).even
true
> type(4.04).even
false
```

#### `exists`

Returns true if the current value is neither `null` nor `undefined`.

```js
> type([]).exists
true
> type(null).exists
false
> type(undefined).exists
false
```

#### `function`

Returns true if the current value is a function.

```js
> type(function() {}).function
true
> type(Array).function
true
> type(new Array()).function
false
```

#### `implements(interface : object)`

**interface** an object of nested functions representing an interface

Returns true if the current value implements the given interface. An interface
should be composed exclusively of objects and functions. Each key in the object
should map to either a validation function (that when failing means the current
value does not implement the interface) or a nested object, representing a
nested object in the current value itself.

Below is an example interface

```js
var interface = {
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

```js
> a = {
  name : 'bear',
  age  : 14.5,
    coordinate : {
      x : 0.0,
      y : 1.1,
      z : 0.1
    }
  }
Object {...}
> b = {
  name : 'bird',
  age  : 1,
    coordinate : {
      x : 0.0,
      y : 0.0,
      z : 14.0,
      flag : true
    }
  }
Object {...}
> type(a).implements(interface)
false
> type(b).implements(interface)
true
```

`a` due to `age` being a float rather than an integer. `b` succeeds because
additional properties are ignored.

Interfaces may also be nested within interfaces. For example

```js
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

```js
var interface = {
    three : function isThree(arg) {
        return arg === 3 || /^(3|three|iii)$/i.test(arg);
    }
};
```

#### `instanceof(constructor : function)`

**constructor** the object constructor

Returns true if the current value was constructed by `constructor`.

```js
> type(new Date).instanceof(Date)
true
> type([]).instanceof(Date)
false
```

#### `integer`

Returns true if the current value is an "integer" that is it is equal to the
floored version of itself.

```js
> type(3).integer
true
> type(3.14).integer
false
```

#### `lengthof(n : number)`

**n** the desired number

Returns true if the current value is either an array, string or object with `n`
keys.

```js
> type([1, 2, 3]).lengthof(3)
true
> type('hi!').lengthof(3)
true
> type({ x : 'x' , y : 'y', z : 'z' }).lengthof(3)
true
> type({}).lengthof(3)
false
```

#### `max(n : number)`

**n** the maximum number

Returns true if the current value is less than or equal to max.

```js
> type(Math.E).max(Math.PI)
true
> type(0).max(-1)
false
```

#### `min(n : number)`

**n** the minimum number

Returns true if the current value is greater than or equal to min.

```js
> type(Math.PI).min(Math.E)
true
> type(-1).min(0)
false
```

#### `native`

Returns true if the current value is a native function. Based off the
implementation of [lodash's](https://lodash.com/) isNative function.

```js
> type(Array).native
true
> type({}).native
false
>
```

#### `negative`

Returns true if the current value is a negative number.

```js
> type(-3.14).negative
true
> type(-12000).negative
true
> type(0).negative
false
```

#### `number`

Returns true if the current value is a number.

```js
> type(Math.PI).number
true
> type([]).number
false
```

#### `object`

Returns true if the current value is an object (and not `null`).

```js
> type([]).object
true
> type(/regex/).object
true
> type(null).object
false
```

#### `odd`

Returns true if the current value is an odd integer.

```js
> type(17).odd
true
> type(1.04).odd
false
```

#### `or(...checks : function)`

**checks** any number of test functions

Returns true if the any of the checks provided to `or` pass for the current
value. When using the standard syntax any number of test functions can be
passed, but when using the alternate syntax in an interface, only two checks
may be provided. This is to prevent currying from continuing indefinitely.

```js
> type('test').or(type.number, type.boolean, type.string)
true
> type({ x : [1, 2, 3] }).implements({ x : type.or(type.function, type.lengthof(3)) })
true
```

If you try to use `or` as a function with more than 2 arguments, you will get
an error message

```js
> type({ x : [1, 2, 3] }).implements({ x : type.or(
    type.function,
    type.lengthof(3),
    type.exists
  )})
Uncaught TypeError: Asserted: object -- Found: boolean true
```

#### `positive`

Returns true if the current value is a positive number.

```js
> type(3.14).positive
true
> type(0).positive
false
> type(-42).positive
false
```

#### `range(min : number, max : number)`

**min** the minimum number

**max** the maximum number

Returns true if the current value is greater than or equal to min and strictly
less than the maximum.

```js
> type(97).range(0, 100)
true
> type(-42).range(-50, 25)
true
> type(10).range(0, 10)
false
```

#### `string`

Returns true if the current value is a string.

```js
> type('string').string
true
> type(true).string
false
```

#### `symbol`

Returns true if the current value is a symbol.

```js
> type(Symbol()).symbol
true
> type('string').symbol
false
```

#### `undefined`

Returns true if the current value is `undefined`.

```js
> type(void 0).undefined
true
> type([]).undefined
false
```

### Modifiers

Modifiers wrap around extensions, changing their default behavior. Modifiers are
applied in a stack, last in first out, basis. For example

```js
type(x).arrayof.not.number
```

checks that x is an array of non-number elements whereas

```js
type(x).not.arrayof.number
```

checks that x is not an array of numbers.

#### `.modify(name : string, mod : function)`

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

```js
type.modify('not', function not(test) {
    return function() {
        return !test.apply(this, arguments);
    };
});
```

#### `arrayof`

Modifies the test function to return true only if the current value is an array
of values that all pass the test.

```js
> type([1, 2, 3]).arrayof.number
true
> type({ 0 : 1, 1 : 2, 2 : 3 }).arrayof.number
false
```

#### `assert`

Modifies the test function to throw a `TypeError` if the test fails.

```js
> type(42).assert.string
Uncaught TypeError: Asserted: string -- Found: number 42
> type('string').assert.not.string
Uncaught TypeError: Asserted: not string -- Found: string string
```

#### `collapse`

Modifies the test function to be called on all values passed to type, returning
the first value that passes the test. Returns false otherwise.

```js
> type('string', {}, [], 42, true, Math.PI).collapse.number
42
> type(1, function() {}, []).collapse.string
false
```

**Note** Collapse does not support the alternate calling syntax.

#### `maybe`

Modifies the test function to return true for null and undefined values.

```js
> type(null).maybe.number
true
> type(12).maybe.number
true
```

#### `not`

Modifies the test function, negating its result.

```js
> type('string').not.number
true
> type(Math.PI).not.exists
false
```

#### `of`

Similar to [arrayof]($arrayof) but supports all objects.

```js
> type({ 0 : 1, 1 : 2, 2 : 3 }).arrayof.number
true
> type([1, 2, 3]).arrayof.number
true
```

### Util

type-mark comes packed with a small utility library for common tasks needed
elsewhere by the API.

#### `.util.define(obj : object, name : string, fn : function)`

**object** the object to define a property on

**name** the name of the property

**fn** the function that returns the value of that property

Defines a readonly property on an object. Used to simplify calling
[defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

```js
> obj = {}
Object {}
> type.util.define(obj, 'x', function() { return true; })
undefined
> obj.x
true
```

#### `.util.toArray(arg : mixed)`

**arg** an array-like object

**returns** an array containing the values of the array-like object

Used to convert `arguments` to an array, or similar objects.

```js
> obj = { 0 : 1, 1 : 2, 2 : 3, length : 3 }
Object {...}
> type.util.toArray(obj)
(3) [1, 2, 3]
```

#### `.util.length(arg : mixed)`

**arg** a value to get the length of

**returns** the length of the value or undefined if not applicable

Returns a meaningful length value for a given argument. For arrays and strings
this means `.length`. For objects this means the number of key value pairs they
contain (excluding Symbols). For all other values `undefined` is returned.

```js
> type.util.length([1, 2, 3])
3
> type.util.length('Hello World!')
12
> type.util.length({ x : 'x', y : 'y' })
2
> type.util.length(12)
undefined
```

#### `.util.curry(fn : function, [arity : number])`

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

```js
> fn = type.util.curry(function(a, b, c) { return a + b + c; })
function {...}
> fn(1)(2)(3)
6
> fn(1, 2)(3)
6
> fn(1)(2, 3)
6
> fn(1, 2, 3)
6
```