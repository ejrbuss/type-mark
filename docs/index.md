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
object
```
With type-mark checking for `null` is as easy as
```js
> type(null).object
false
```
Not to mention the added benifits of [modifiers](#modifiers), [interfaces](#interfaces), and
[custom validation](#extending).

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

Using either method type-check will now be available via the function
`type`.

#### On Node

...not yet :(

### Getting Started

#### Basic Checks

#### Modifiers

#### Interfaces

#### Writing Your own Tests

### Change Notes

#### v1.0.0
 - Initial Release!

### Contact

### License

type-mark is made available under the
[MIT](https://github.com/ejrbuss/type-mark/blob/master/LICENSE) license.
That baseically means anything goes! Just don't come crying to me if you
hurt yourself.

### Documentation