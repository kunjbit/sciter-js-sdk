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
  
## HTML

* [Extended set of input elements](HTML/html-inputs);
* `<frame>` can appear at any place where block elements are allowed;
* `<frame type=pager>` –  print and print preview frame;
* `<frameset>` can appear anywhere as a split container. It can also contain explicit `<splitter>` elements that can be styled to match your design. `<frameset>` may contain not only frame elements but other block containers like `<div>`, `<section>`, etc.
* Elements with custom tags are fully supported. If, for example, you feel that `<toolbar>` looks better then `<div class="toolbar">` you can use `<toolbar>` tag. The only thing that you will need to do is to define style for it: toolbar `{display:block; flow:horizontal; }` in your CSS.
* Real menus and popup elements:
   * `<menu class=popup>` – popup menu that is normal DOM element but gets rendered in separate popup window so can appear outside of host window;
   * `<menu class=context>` – popup context menu that can be attached to a DOM element by Sciter specific context-menu CSS property;
   * `<popup>` – generic popup element rendered in special popup window. Popup elements can be shown by [Element.popup()](DOM/Element#popup) function in script;
* [HTML shortcuts](HTML#syntaxshortcuts) –  instead of typing `<div id="component" class="super">` you can just write `<div#component.super>`;
* [HTML Windows](HTML/html-window) – desktop windows defined by HTML.
* [HTML `<include>`](HTML/html-include) – assemble final HTML from HTML fragments.
* [Built-in set of HTML tags](HTML/html-elements).

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

* [flow/flex](CSS/flows-and-flexes) as an alternative to `display:flexbox`.
* [`flow:grid()`](CSS/flows-and-flexes#flowgrid) and flex units provide reasonable alternative to `display:grid`.

Sciter specific:

* [Style sets](CSS/style-sets) - `@set name { ...rules... }`
* [CSS constants and mixins](CSS/media-const-mixin)
* [context-menu: selector(...)](CSS/properties#contextmenu) property – allows to define `<menu class=context>`  to be used as a context menu for other element(s).
* [@image-map](CSS/image-map) - ergonomic CSS sprites.
* [Scripting behaviors and aspects](CSS/behaviors-and-aspects) – declarative script code assignment (binding) by CSS.

For more details see [CSS](CSS) section.

## JavaScript

Sciter uses updated [QuickJS](https://bellard.org/quickjs/) that implements ES2020 in full.

The language and its runtime was updated for better serving "language-behind-UI" role:

* UI specific [data types and units](JS/units); 
* Built-in [JSX](Reactor/JSX) support with native compiler; 
* Built-in persistent [Storage](Storage) - NoSQL database available out of the box; 
* Built-in susbset of NodeJS runtime in [@sys module](JS.runtime/module-sys);
