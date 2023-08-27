---
sidebar_position: 1
---

# Introduction

Sciter uses its own implementation of HTML/CSS rendering engine and JS runtime.

While some efforts are made it to be compatible with W3C browser runtime and rendering there are differences due to different design goals:

1. Sciter is meant to be as compact as possible as it is embeddable. Thus only essential APIs are included;
2. Sciter is designed to serve _desktop_ UIs. Thus its API:
   - is [desktop window](DOM/Window) centric;
   - supports ability to render DOM elements as ["airborns"](DOM/out-of-canvas-elements) - in separate desktop windows;
  
## CSS

CSS 2.1 is implemented in full.

CSS 3 implementation is limited by selected modules that are practical in desktop UI:

* `transform` but only 2D;
* `transition` and `animation`;
* most of CSS3 selectors; 
* `border-radius`  - rounded corners;
* `box-shadow`'s;
* `opacity`;
* `rgba()`,`hsl()` colors;
* `@font face` - embedded fonts;
* `@media` - condition based CSS;
* `var()` - [CSS variables](CSS/variables-and-attributes) and [access to them by JS](DOM/Element/Style#variable);
* [`filter()`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
* [`backdrop-filter()`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
* CSS gradients;

Alternatives:

* `display:flexbox` is not supported but Sciter provides flow/flex (TBD) alternative.
* `display:grid` is not supported but `flow:grid()` and flex units provide reasonable alternative.

Sciter specific:

* style sets - `@set name { ...rules... }`

For more details see [CSS](CSS) section.

## JavaScript

Sciter uses updated [QuickJS](https://bellard.org/quickjs/) that implements ES2020 in full.

The language and its runtime was updated for better serving "language-behind-UI" role:

* UI specific [data types and units](JS/units); 
* Built-in [JSX](Reactor/JSX) support with native compiler; 
* Built-in persistent [Storage](Storage) - NoSQL database available out of the box; 
* Built-in susbset of NodeJS runtime in [@sys module](JS.runtime/module-sys);


