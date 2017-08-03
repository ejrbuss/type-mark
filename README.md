# [type-mark](http://www.ejrbuss.net/type-mark)

[![Build Status](https://travis-ci.org/ejrbuss/type-mark.svg?branch=master)](https://travis-ci.org/ejrbuss/type-mark)
[![npm version](https://badge.fury.io/js/type-mark.svg)](https://badge.fury.io/js/type-mark)
[![Code Climate](https://codeclimate.com/github/ejrbuss/type-mark/badges/gpa.svg)](https://codeclimate.com/github/ejrbuss/type-mark)

## Why use type-mark

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
Not to mention the added benifits of
[modifiers](http://www.ejrbuss.net/type-mark/#modifiers),
[interfaces](http://www.ejrbuss.net/type-mark/#interfaces), and
[custom validation](http://www.ejrbuss.net/type-mark/#writing-your-own-tests).

## Get It

### On the Client

You can use the rawgit CDN to get the latest minified version

```html
<script type="text/javascript" src="https://cdn.rawgit.com/ejrbuss/type-mark/031ad1b84ba47e61e02bdd16f4fa48e38787edb8/type-mark.min.js'"></script>
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

### On Node

type-mark is available through [npm](https://www.npmjs.com/). When using
[node.js](https://nodejs.org/en/) you can install using npm

```bash
$ npm install type-mark
```

To use type-mark in your Node project you will need to require it
```js
var type = require('type-mark');
```

### From Scratch

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

The following npm scripts are made available

```bash
$ npm run test     # run tests and code coverage
$ npm run build    # build type-mark.js and type-mark.min.js for the client
$ npm run site     # run the docs site
$ npm run version  # update version number and cdn
```

## [Getting Started](http://www.ejrbuss.net/type-mark/#getting-started)