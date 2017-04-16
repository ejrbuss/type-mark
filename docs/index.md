---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
---

{% include banner.html %}

<h3 class="text-center" style="color:#00A79D;">make type checking <i>lovely</i></h3>

### Why use type-check

Because `typeof` just doesn't cut it. The canonical example being
```js
> typeof null
object
```
With type-checker checking for `null` is as easy as
```js
> type(null).object
false
```
Not to mention the added benifits of [modifiers](#modifiers), [interfaces](#interfaces), and
[custom validation](#extending).

### Getting Started

You can use this repo's CDN to get the latest version.

```html
<script type="text/javascript" src=""></script>
```

Or you can include your own. Just save a copy of the minified file to your
site's javascript directory.

```html
<script type="text/javascript" src="js/type-checker.min.js"></script>
```