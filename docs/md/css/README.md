---
sidebar_position: 3
---

# CSS

Sciter supports following units:

  * [Color](units/color) units;
  * [Dimensional](units/dimentional) units;
  * [Angle](https://developer.mozilla.org/en-US/docs/Web/CSS/angle) - standard angle units (rad,deg,grad,turn);
  * [Duration](https://developer.mozilla.org/en-US/docs/Web/CSS/time) - standard time/duration units (s, ms);


## Constants

Constants can be declared globally as followed:

```CSS
@const DARK : #222;
body {
  background: @DARK;
}
```

## Media Queries

Media queries behave a bit differently in Sciter.js when it comes to syntax and updating behavior.

#### Differences from browser behavior
* Minimum and maximum constraints (like `width < 600px` and `width >= 600px`) trigger on _screen_ size changes, _not_ on window size changes like in browsers. For window size change behavior, check [this example](https://sciter.com/forums/topic/media-with-css-only/#post-76753)

#### Syntax
The media query expression syntax is based on Javascript syntax:
  * `and` is `&&`
  * `min-width: 600px` is `width >= 600px`
  * E.g. `@media screen and (min-width: 600px)` becomes `@media screen && (width >= 600px)` in Sciter.js

You can even declare your own variables, dynamically set and change their values through Javascript, and put conditions on what CSS rules to run depending on the value:

```CSS
@media (viewport == "narrow") { div:nth-child(1n) { clear:after; } }
@media (viewport == "normal") { div:nth-child(2n) { clear:after; } }
@media isMobile { .columns { flow: vertical; } }
```
```javascript
// set value in JS
Window.this.mediaVars({ viewport: "normal" });
Window.this.mediaVars({ isMobile: false });
```

## StyleSet

Style set is a named block of style rules declarations that are applied to elements DOM sub-tree.
it allow style declaration scoping like used in LESS and SASS

```CSS
div { 
  style-set: myStyle;
  style-set-base: parentStyle //| inherit styleset from
}

@set myStyle //| inheritance is allowed, myStyle < parentStyle
{ 
  :root { //| Element itself (div)
    ...
  }
  p {     //| Child element
    ...
  }
}
```

You can assign it from HTML, `file.css#myStyle` if the style file is not included.

```XML
<div styleset="#myStyle"></div>
```

## Mixin

Named set of CSS properties that can be applied by @name to CSS rules, can use params.

```CSS
@mixin LIKE-BUTTON(basecolor)
{
  behavior:button;
  color: #ffffff;
  background: linear-gradient(top, tint(basecolor,+0.3), basecolor);
}

div {
  @LIKE-BUTTON(#fff);
  ...
}
```

## ImageMap

```CSS
@image-map std-tree-icons
{
  src: url(sciter:tree-icons-x1.png) 100dpi,
       url(sciter:tree-icons-x2.png);
  cells:2 1; /* 2 columns, 1 row */
  /* logical names of the parts, see radios.png */ 
  items:
    plus,
    minus;
}
```

# MISC

- [Sciter CSS support map (incomplete)](https://sciter.com/docs/content/css/cssmap.html)

- [Style sets in Sciter](https://sciter.com/style-sets-in-h-smile-core/)

- [Sciter CSS and Browser CSS in single file](https://sciter.com/road-to-sciter-js-step-i-supports-px-ppx-dip/)

- [@mixin feature in Sciter’s CSS](https://sciter.com/mixin-feature-in-sciters-css/)
