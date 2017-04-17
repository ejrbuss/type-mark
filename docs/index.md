---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
---

{% include banner.html %}

<h3 class="text-center no-nav" style="color:#00A79D;">make type checking <i>lovely</i></h3>

### Why use type-mark

Because `typeof` just doesn't cut it. The canonical example being
```js
> typeof null
"object"
```
With type-mark checking for `null` is as easy as
```js
> type(null).object
false
```
Not to mention the added benifits of [modifiers](#modifiers), [interfaces](#interfaces), and
[custom validation](#writing-your-own-tests).

### Considerations

type-mark is a **dependecy free** library clocking in at about ~10kb. In
terms of browser combatibility you will be safe in the following browser
versions based on [MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

| Firefox (Gecko) | Chrome | Internet Explorer | Opera | Safari |
| ------- | --------------- | ------ | ----------------- | ----- | ------ |
| 4.0 (2) | 5 | 9 | 11.60 | 5.1

### Installing

#### On the Client

You can use the rawgit CDN to get the latest minified version

```html
<script type="text/javascript" src="{{ site.cdn }}"></script>
```

Or you can include your own. Just save a copy of the minified file to your
site's javascript directory.

```html
<script type="text/javascript" src="js/type-mark.min.js"></script>
```

Using any of the above methods will make type-check available via your
choice of commonjs interface. If `require` is not defined type-check defines
`type` on the window. You can use `type.collision` to access any previous
value of `window.type`.

#### On Node

type-mark is available through [npm](https://www.npmjs.com/). When using
[node.js](https://nodejs.org/en/) you can install using npm

```bash
$ npm install type-mark
```

In order to actually use type-mark in your Node project you will need to
require it in using
```js
var type = require('type-mark');
```

#### From Scratch

You can also clone the git repository if you want the full source or are
interested in making modifications. type-check is dependency free so working
with it is as easy as cloning.

```bash
$ git clone https://github.com/ejrbuss/type-mark.git
```

To run the npm scripts you will need to run `npm install` as well as the
following global dependencies

- [mocha](https://mochajs.org/),
- [istanbul](https://istanbul.js.org/),
- [browserify](http://browserify.org/),
- [uglify-js](https://www.npmjs.com/package/uglify-js) and
- [jekyll/bundle](https://jekyllrb.com/).

The following npm scripts are made avaialble

```bash
$ npm run test     # run tests
$ npm run coverage # generate istanbul html report
$ npm run build    # build type-mark.js and type-mark.min.js for the client
$ npm run site     # run the docs site
```

### Getting Started

For most checks the following call pattern is used

```js
> type(variable).modifer.check
```

For example if you wanted to check if `x` is a string

```js
> type(x).string
```

If `x` is not a string this will return `false`. If `x` is a string this will
return the `TypeState` object back to you, this is useful if you want to
[chain multiple assertions together](#assert). The same check can be made
by calling the test function directly.

```js
> type.string(x)
```

The following checks can be made using either of these syntax.

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
| `type(x).exists` | Check `x` is not `null` or `undefined` |

[1] *Works for `strings`, `arrays`, and `objects` based on keys*

In addition to basic checks there are also checks that take arguments. An
example of this is the `instanceof` check which checks to see what constructor
was used to create the given object. For example to check if `x` is a RegExp

```js
> type(x).instanceof(RegExp)
```

To call the check directly the variable needed to be tested needs to be passed
in second. So the above check becomes

```js
> type.instanceof(RegExp, x);
```

The order of arguments here allows all test functions to be
[curryable](https://en.wikipedia.org/wiki/Currying). This means if you were
constantly checking if variables were instances of `YourClass` you could
instantly create a checking function like so

```js
> checkYourClass = type.instanceof(YourClass)
function() {...}
> checkYourClass(x)
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

[1] *Works for `strings`, `arrays`, and `objects` based on keys*

#### Modifiers

By themselves these check functions are still limited and only allow for a
surface level checking of primitives. Modifiers (or predicates) are values
you can prefix your check with to modify its effect.

##### `not`

Negates the given test. For example

```js
> type(x).not.string
```

checks that `x` is **not** a string. Can also be called

```js
> type.not.string(x)
```

Plays nicely with the other modifiers `assert`, `arrayof`, `of`, and
`collapse`.

##### `assert`

If the given check fails a `TypeError` is thrown with a message indicating why
the check failed.

```js
> type(4).assert.string
Uncaught TypeError: Expected string instead found number
```

Because checks return the `TypeState` object for chaining mutliple assertions
can be made in the same expression. The following example asserts that `x` is
an array with length 10.

```js
> type(x).assert.array.lengthof(10)
```

Assert **cannot** be called via the alternate call pattern.

A custom error message can be specified using the `message` function. `message`
takes a function which is called with the value being tested as well as any
arguments supplied to the test and uses the return result as the error message.

```js
> type(undefined).message(function(value) {
    return 'Oops I got ' + value
  }).assert.exists
Uncaught TypeError: Oops I got undefined
```

Plays nicely with the other modifiers `not`, `arrayof`, `of`, and `collapse`

##### `arrayof`

Rather than checking the passed value checks the array elements of the passed
values. Automatically fails if the passed value is not an Array. The following
example asserts that `x` is an array of numbers.

```js
> type(x).arrayof.number
```

Can also be called

```js
> type.arrayof.number(x)
```

Does not play nicely with `of` or `collapse`, but gets along just fine with
`not` and `assert`.

##### `of`

Rather than checkign the passed value checks the properties of the passed value.
Automatically fails if the passed value is not an object or is `null`. Note
that this means `of` works as expected with arrays as well. The following
example asserts that `x` is an object whose properties are all strings.

```js
> type(x).of.string
```

Can also be called

```js
> type.of.string(x)
```

Does not play nicely with `arrayof` or `collapse`, but gets along just fine
with `not` and `assert`.

##### `collapse`

Collapse is useful for functions that take an optional number of out of order
arguments. It returns the first value passed to type that matches the check.

```js
> type('string', {}, [], 42, true, Math.PI).collapse.number
42
```

Collapse **cannot** be called via the alternate call pattern.

Does not play nicely with `arrayof` or `of`, but gets along just fine with
`not` and `assert`.

##### All Together

Modifiers can be combined to create a complex check. For example here we assert
that `x` is not an array of numbers

```js
type(x).assert.not.arrayof.number
```

#### Interfaces

The checks looked at so far don't do much to help define type checkable objects
with a mix of different types. This is where interfaces and type-mark's
alternate syntax comes in. An interface looks like the following

```js
var interface = {
    name : type.string,
    age  : type.integer,
    coordinate : {
        x : type.number,
        y : type.number,
        z : type.number
    }
}
```

Interfaces can be passed to the `implements` check to check if an object meets
a set of structured tests. For instance, based on our interface above we can
test to see if a or b implement the interface.

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
TypeState {...}
```

A couple of things to note about this example. First notice that `a` fails the
check even though only one of it properties is incorrect `age` is a float rather
than an integer. Also `b` succeeds the check even though it contains additional
data `coordinates.flag`. The `implements` check does not care if the object it
recieved contains additionaly properties.

Interfaces can also be nested within interfaces. You can use `type.implements`
to achieve this. For example

```js
var nestedInterface = {
    coordinates : type.arrayof.implements({
        x : type.number,
        y : type.number
    })
}
```

is a valid interface that checks if the supplied object contains a property
ccordinates that is an arrayh of `{x, y}` objects. This is possible because
interfaces are just a composed set of validation functions, and because
`type.implements(interface)` returns a function it can be used.

This also means that you can provide whatever function to the interface you
would like, for instance

```js
var interface {
    three : function isThree(arg) {
        return arg === 3 || /3|three|iii/i.test(arg);
    }
}
```

Is also a valid interface. This makes interfaces extremely flexible especially
when combined with custom tests described in the next section.

#### Writing Your own Tests

type-mark provides to functions for adding tests `extend` and `extendfn`. The
first allows you to define simple property based checks, the second allows for
curryable functions.

##### `extend`

Creates a new property based check.

```js
type.extend('nameOfTest', function test(value) {
    return isValueCorrect(value);
}, function customMessage(value) {
    return value + ' was not correct :('
});
```

The first argument passed to `extend` is the name of the test, which will be
used for the default error message as well as defining all the access points
ie. `type(x).name`, `type.not.name`, etc.

The sceond argument passed to `extend` is the test function itself, it recieves
the value currently being tested and is expected to return a boolean result.
It is also executed in the context of the `TypeState` object it is being
called on. This gives you access to information such as the user specified
message, the currently set modidfiers, and more. see the [API]() for all the
details.

The third (optional) argument passed to `extend` is the error message function.
This will be called if your test was assered and failed. It is passed the value
being tested and is also executed in the context of the `TypeState` object.

As an example we will use our previous `isThree` function

```js
function isThree(arg) {
    return arg === 3 || /3|three|iii/i.test(arg);
}
```

To create a new property check we would

```js
type.extend('isThree', isThree, function(arg) {
    return arg + ' is not three :(';
});
```

We can now use isThree in all the ways you would expect.

```js
> type(3).isThree
TypeState {...}
> type('three').not.isThree
false
> type.arrayof.isThree([3, 'THREE', 'IiI'])
TypeState {...}
```

#### `extendfn`

Creates a new function based check. Takes the same arguments as `extend`
except it will be passed any number of specified arguments prior to the actual
value being tested. For example lets create a validation function that asserts
that three numbers sum to 100.

```js
function threeSumTo100(n1, n2, arg) {
    return n1 + n2 + arg === 100;
}
```

To create a new function check we would

```js
type.extendfn('threeSumTo100', threeSumTo100, function(n1, n2, arg) {
    return n1 + ' + ' + n2 + ' + ' + arg + ' does not equal 1000';
});
```

We can now use threeSumTo100 in all the ways you would expect.

```js
> type(50).threeSumTo100(25, 25)
TypeState {...}
> type('100').threeSumTo100(0, 0)
false
> type.not.arrayof.threeSumTo100(90, 5, [5, 5, 5])
TypeState {...}
> type.threeSumTo100(33)(33)(33)
false
```

Note that `type.threeSumTo100` is now a curried function. This means we can
partially apply parameters to create new functions. For example

```js
var twoSumTo50 = type.threeSumTo100(50)
```

**Note** that in order to support currying with the mofidiers `not`, `arrayof`,
`collapse`, etc. your function may be called additional times during a test
with values that do not directly relate to the values being tested. For this
reason it is best your tests be pure. To demonstrate this take the following
example

```js
> type.extend('log', function(arg) {
    console.log(arg);
    return arg;
  })
function type() {...}
> type.arrayof.log([1, 2, 3, 4])
< [1, 2, 3, 4]
< 1
< 2
< 3
< 4
true
```

### Change Notes

| Version | Changes |
| ------- | ------- |
| v1.0.0 | Initial Release |
| v1.0.1 | Name changed from type-check to type-mark |
| v1.0.2 | Fixed `window is not defined` bug on node |

### Contact

Email [ejrbuss@gmail.com](mailto:ejrbuss@gmail.com)

Twitter [@ejrbuss](https://twitter.com/ejrbuss)

If you are interested in my other work checkout my [website](http://www.ejrbuss.net)

### License

type-mark is made available under the
[MIT](https://github.com/ejrbuss/type-mark/blob/master/LICENSE) license.
That baseically means anything goes! Just don't come crying to me if you
hurt yourself.