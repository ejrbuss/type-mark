---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
---

{% include banner.html %}

<h3 class="text-center" style="color:#00A79D;">make type checking <i>lovely</i></h3>

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
[custom validation](#extending).

### Considerations

type-mark is a dependecy free library clocking in at about ~10kb. In terms
of browser combatibility you will be safe in the following browser
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

Using any of the above methods will make type-check available via the function `type` on the client.

#### On Node

type-mark is available through [npm](https://www.npmjs.com/). When using
[node.js](https://nodejs.org/en/) you can install using npm

```bash
$ npm install type-mark
```

In order to actually use type-mark in your Node project you will need to
require it in using
```
const type = require('type-mark');
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

#### Basic Checks

#### Modifiers

#### Interfaces

#### Writing Your own Tests

### Change Notes

##### v1.0.0

- Initial Release!

##### v1.0.1

- type-check to type-mark patch

### Contact

Email [ejrbuss@gmail.com](mailto:ejrbuss@gmail.com)

Twitter [@ejrbuss](https://twitter.com/ejrbuss)

### License

type-mark is made available under the
[MIT](https://github.com/ejrbuss/type-mark/blob/master/LICENSE) license.
That baseically means anything goes! Just don't come crying to me if you
hurt yourself.

### Documentation