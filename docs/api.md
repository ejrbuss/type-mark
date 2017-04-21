---
layout: home
---

<br />
<br />

# type-mark API (WIP)

### Introduction

Note if you just want a quick understanding of type-mark it is recommended you
start with the [Getting Started]({{ site.baseurl }}/#getting-started) section this site's
homepage.

Everything you could possibly need to know and probably a way more. This
page breaks down the internals of type-checker into 5 key sections.

 - **[Invovled Examples](#involved-examples)** Some more intense examples than
 what appears in
 [Getting Started]({{ "/#getting-started" | relative_url }})
 - **[TypeState](#typestate)** A detailed look at the TypeSate object itself that
 makes type-mark tick
 - **[Extensions](#extensions)** Also referred to as tests or checks. This
 section details each extension individually
 - **[Util](#util)** Overview of type-mark's utility library
 - **[Other](#other)*** Polyfills, ARM management, building, and anything else
 not mentioned in the other sections

When going through this API guide it may be useful to test examples. Open
up your browser's console with <kbd>Ctrl + Shift + i</kbd> and you can
test right on this page.

### Involved Examples

#### Creating a Regex Test

Regular expressions are a common method of validation. type-mark does not
include support for regex by default, but adding support is a straightforward
task.

##### Motivation

Before designing a regex interface for type-mark we should first consider what
purpose it will serve, considering we have `/regex/.test` already. Here are a
few benifits which may motivate us

 - Allows us to quickly modify our use of a given regex using type-mark's `not`,
 `arrayof`, `of`, `collapse`, and `assert` modifiers
 - Allows us to use regex validation in interfaces without having to create a
 closure for every regex test
 - Limit regex recompilation

##### Implementation

Below is an implementation of regex support for type-mark with the test name
`re`.

```js
type.extendfn('re', function(regex, arg) {
    return new RegExp('^' + regex.source + '$').test(arg);
}, function(regex, arg) {
    return arg + ' does not match ' + regex;
});
```

##### Usage

There are a variety of ways we might use this new test. For simple patterns
we can use the standard api.

```js
> type('aaaab').re(/a+b/)
TypeState {...}
> type.re(/\d+/, '1.1')
false
```

We may wish to use this test as the basis for another test. We could use
`extend` to create a test for a specific regex. Let's imagine we wanted to
validate a url.

```js
var reUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

type.extend('url', type.re(reUrl), function(arg) {
    return arg + 'is not a valid url';
});
```

We can now validate urls using the standard type-mark api, as well as use it
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

#### Simple Pattern Matching

Pattern matching is a common feature found in functional programming languages.
In this example we will use type-mark to implement a simple pattern matching
function that matches only based on type-mark extensions.

##### Motivation

Pattern matching can be fun, but it can also be useful. A couple of reasons we
may be interested in pattern matching in JavaScript could be

 - switch statements are prone to bugs when used for pattern matching thanks to
 their control flow falling through
 - if statements are noisy and decrease the readability of code

##### Implementation

First we will define a `on` function on the TypeState prototype. This is the
first example of extending `TypeState`. This is a useful approach when doing
more complex extensions to TypeCheck. In this case we want TypeCheck to run
a function, but only if a given extension passes.

```js
type.TypeState.prototype.on = function on(test, fn) {
    if(this._resolve('on', test)) {
        return fn(this.value);
    }
}
```

Whoa what's with that `_resolve`? Let's break down
what this is doing line by line.

```js
type.TypeState.prototype.on = function on(test, fn) {
```

Here we are simply defining a function on the `TypeState` object (the object
returned by any calls to `type`). This function takes two arguments, a test,
and a function.

```js
if(this._resolve('on', test)) {
```

Here is where the magic happens. We are using `TypeState`'s built in `_resolve`
function to evaluate the test and get the result. This takes into account any
flags like `not`, `assert`, `arrayof`, etc. If that result is truthy we want
to call our function.

```js
return fn(this.value);
```

Here we call our passed function with the `this.value`. This is the value
originally passed to `type`. For details about this and other fields look at
the documentation on [TypeState](#typestate). We return the value of our
function here, that will be useful for our pattern matching function later.

For the next step we are going drop in some beautiful ES6 to make our lives
easier. This is the final step.

```js
function pairs(array) {
    type(array).assert.array;
    let pairs = [];
    let i;
    let j;
    for(i = 0, j = 1; j < array.length; i += 2, j += 2) {
        pairs.push([array[i], array[j]]);
    }
    return pairs;
}

const match = type.util.curry((value, c, ...conditions) => {
    conditions.unshift(c);
    conditions = pairs(conditions);
    let ret;
    conditions.find(pair => type(ret = type(value).on(...pair)).not.undefined);
    return ret;
});
```

So let's break this down a little. First the `pairs` function. This is just
used to make the syntax of our function a little cleaner. This function takes
and array like `[1, 2, 3, 4]` and breaks it into pairs like `[[1, 2], [3, 4]]`,

Now let's look at the match function itself.

```js
const match = type.util.curry((value, c, ...conditions) => {
```

This defines a curried function `match`. We use type-mark's util library here
accessible via `type.util`. Read more about type-mark's utilities [here](#util).
Next we see that our function accepts a value and then an array of conditions.
These conditions should be ordered `[test, fn]` just like our `do` extension
expects.

We have to specify an extra argument `c` so that type-mark's curry
function knows how to handle the number of arguments. That also explains
the next line where we just add `c` to the start of `arguments`.

```js
conditions = pairs(conditions);
```

Here we are just calling that previously mentioned utility function to break
conditions into pairs.

```js
let ret;
conditions.find(pair => type(ret = type(value).on(...pair)).not.undefined);
return ret;
```

Here the real magic happens. We find the first result of `[test, fn]` pairs
which does not return `undefined` using type-mark twice in the process.

One final step is to define a default wildcard `_`.

```js
const _ = () => true;
```

##### Usage

We now have simple pattern matching in JavaScript. Let's see what this looks
like in action.

```js
> match(4)(
    type.number, $ => $ + ' is a number!',
    type.string, $ => $ + ' is a string!',
    _,           $ => 'I don\'t know what ' + $ + ' is :('
  )
"4 is a number"
> match(/regex/,
    type.number, $ => $ + ' is a number!',
    type.string, $ => $ + ' is a string!',
    _,           $ => 'I don\'t know what ' + $ + ' is :('
  )
"I don't know what /regex/ is :("
```

In this example we saw how type-maker can be at the base of complex functions.
We also got to see how type-mark can be used for validation in a real example
such as in the case of `type(array).assert.array` in the `pairs` utility
function.

### TypeState

TypeState is the core object that powers type-mark. It is instantiated
inderictly through every call to `type`. It recieve

```js
> type()
TypeState {...}
> new type.TypeState()
TypeState {...}
```

##### `new TypeState(values : Array)`

**values** is an array of values to test, where `values[0]` is used for
most tests and `values[...]` is used for collapse

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

#### `._value`

The array of elements passed to the constructor of `TypeState`. Used by
the `collapse` modifier.

```js
> type(1, 2, 3, 4)._values
[1, 2, 3, 4]
> new TypeState([1, 2, 3, 4])._values
[1, 2, 3, 4]
```

#### `._flags`

A number used to represent the current modifier state. Modifiers are bitwise
masks. The following modifiers are available.

| Modifier | Mask | Purprose |
| -------- | ---- | -------- |
| `not` | `0b000001` | invert test result |
| `arrayof` | `0b000010` | test elements of `.value` |
| `of` | `0b000100` | test properties of `.value` |
| `assert` | `0b001000` | if test fails throw a `TypeError` |
| `collapse` | `0b010000` | return first valid result of `._values` |
| `debug` | `0b100000` | do not remove TypeState calls from the `TypeError` stack |

```js
> type().not._flags
1
> type().arrayof.debug._flags
34
```

#### `._args`

Stores the arguments used when calling an extension that takes parameters.

```js
> type([]).lengthof(0)._args
[0]
> type(/regex/).instanceof(RegExp)._args
[RegExp]
```

#### `._message`

The user specified function set by `.message()` used in place of the default
and extension specified `TypeError` message.

```js
> state = type(4)
TypeState {...}
> state._message = function() { return 'overriden'; }
function() {...}
> state.assert.string
Uncaught TypeError: overriden
```

#### `.message(message : function)`

**message** the overrideing message function

**returns** the `TypeState` object for chaining

A function that sets `._message`. The function passed to `.message()` is
used in place of the defautl and extension specified `TypeError` message.

```js
> type(null).message(function(arg) { return 'Oops ' + arg; }).assert.exists
Uncaught TypeError: Oops null
> type().message(function() { return 'Oops' })._message()
"Oops"
```

#### `.result(test : function, [argument : mixed], [undef : boolean])`

**test** the test to compute the result of

**argument** an optional argument to replace `.value` with

**undef** an optional argument indicating whether argument was passed but
is `undefined`

***returns** a boolean value indicating if the test passed or failed

A function for computing the result of an extension on a given `TypeState`
object outside the context of modifiers, but within the context of its
initial value and arguments.

```js
> type(/regex/).not.result(type.instanceof(RegExp))
true
> type(4).result(type.number, undefined, true)
false
```

#### `._resolve(name : string, test : function, [message : function])`

**name** the name of the extension test

**test** the extension test function

**message** an optional error message function

Resolves a `TypeState` to either itself or `false`. The primary computing
function behind type-mark.

```js
> type(4).not.resolve('string', type.string)
TypeState {...}
> type(5).arrayof('instanceof', type.min(4))
false
```

### Extensions

#### `boolean`

#### `.extend()`

#### `.extendfn()`

#### `array`

#### `empty`

#### `even`

#### `exists`

#### `function`

#### `implements(interface : object)`

#### `instanceof(inteface : function)`

#### `integer`

#### `lengthof(n : number)`

#### `max(n : number)`

#### `min(n : number)`

#### `native`

#### `negative`

#### `number`

#### `object`

#### `odd`

#### `positive`

#### `range`

#### `string`

#### `function`

#### `undefined`

### Util

#### `not(fn : function)`

#### `arrayof(fn : function)`

#### `of(fn : function)`

#### `length(arg : mixed)`

#### `curry(fn : function)`

### Other

#### Polyfills

#### AMD Support

#### Testing