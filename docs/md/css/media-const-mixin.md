---
sidebar_position: 5
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# @media, @const and @mixin

## @media rule

The @media at-rule may be placed at the top level of CSS file, inside @set at-rule and nested inside any other conditional group at-rule.

```css
@media <condition> {
  ... style rules ...
}
```

A _<condition\>_ declaration in Sciter may accept

1. Single media variable name, like `@media print {...}` or 
2. Expression combining multiple conditions `@media print or handheld {...}` 

### @media queries

:::caution
Format of media queries in Sciter is, at some extent, incompatible with W3C media queries.

This W3C media query
```css
@media screen and (max-width: 600px) {
  ...
}
```
in Sciter is this
```css
@media screen and (width < 600px) {
  ...
}
```
:::

Syntax:

`@media` _<expr\>_ `{` ...rules `}`

where _<expr\>_ is

1. _name_ - name of [built-in media variable](#Built-inMediaVariables) or [application defined media](../DOM/Window#mediavar) variable;
2. _<expr\>_ `and` _<expr\>_ - logical AND of two boolean expressions;
3. _<expr\>_ `or` _<expr\>_ - logical OR of two boolean expressions;
4. _<expr\>_ `<` _<expr\>_  
5. _<expr\>_ `>` _<expr\>_  
6. _<expr\>_ `==` _<expr\>_ 
7. _<expr\>_ `<=` _<expr\>_ 
8. _<expr\>_ `>=` _<expr\>_ 
   
   Comparison expressions

9. `(` _<expr\>_ `)` - expressions can be grouped to avoid ambiguity.

#### Built-in Media Variables

| Name  | Description |
| ----- | ----------- |
| width | window width
| height | window height
| min-width | minimal width if defined in [window-min-size](../HTML/html-window#WindowRootAttributes) else - zero
| min-height | minimal height if defined in [window-min-size](../HTML/html-window#WindowRootAttributes) else - zero 
| max-width | maximal width if defined in [window-max-size](../HTML/html-window#WindowRootAttributes) else - desktop width
| max-height | maximal height if defined in [window-max-size](../HTML/html-window#WindowRootAttributes) else - desktop height
| aspect-ratio | width/height ratio of the window
| monitors | number of connected monitors/displays
| device-width | primary display width
| device-height | primary display height
| device-aspect-ratio | device-width / device-height
| orientation-portrait | = device-height > device-width
| orientation-landscape | = device-height < device-width
| colors | number of bits per pixel
| resolution | number of dots per inch
| resolution-dpcm | number of dots per centimeter
| physical-resolution | (MacOS) backend number of dots per inch
| high-contrast | _true_ if OS uses high-contrast theme now
| has-pen | _true_ if the machine has pen device
| has-mouse | _true_ if the machine has mouse device
| has-mouse-wheel | _true_ if the machine has wheel on mouse device
| has-horizontal-mouse-wheel | _true_ if the machine has horizontal wheel on mouse device
| has-touch-screen | _true_ if the machine has touch screen
| has-pen-screen | _true_ if the machine has pen screen
| has-multi-touch | _true_ if the machine has multi-touch screen
| screen-reader | _true_ if screen reader is running now
| slow-machine | _true_ if OS reports "slow machine" environment (not reliable)
| composition-supported | _true_ if OS supports composition (blur behind windows)
| dropdown-animation-supported | _true_ if user prefers animation in dropdowns
| menu-animation-supported |  _true_ if user prefers animation in menus
| tooltip-animation-supported | _true_ if user prefers animation in tooltips
| ui-blurbehind | alias of composition-supported
| ui-ambience | string, either "dark" or "light" 
| ui-accented-window-decoration | Windows, _true_ if window chrome is using accent colors
| engine | "sciter"
| engine-version-minor | number
| engine-version-major | number
| sciter | _true_
| os | string, name of the OS 
| platform | string: "Windows" | "OSX" | "Linux" | "Android" | "iOS"
| desktop | _true_ for desktop window
| handheld | _true_ for mobile device
| print | _true_ in print and print preview environments
| Windows | _true_ on Windows
| MacOS | _true_ on MacOS
| Linux | _true_ on Linux
| windowless | _true_ when running windowless Sciter.Lite 


## @const

The `@const` at-rule 

```css
@const name : <value> [... <value>];
```

allows to define constants that can be used by their names (prepended by `@`) instead of values:

```css
@const BACKGROUND: no-repeat url(...) 50% 50%;
...
body {
  background: @BACKGROUND;
}

```

## @mixin

The `@mixin` at-rule allows to define set of properties and apply them by name prepended by `@`.

```css title="mixin declaration"
@mixin mname {
  name1: <value>; /* properties */
  name2: <value>; /* of the set */
  ... 
}
```
and the usage:

```css title="mixin usage"
some {
  @mname;
  color: black;
  ...
}
```

### parametric @mixin

The `@mixin` at-rule with parameters allows to define set of properties and apply them by name prepended by `@`.

```css title="mixin declaration"
@mixin mname(paramName1[... , paramNameN]) {
  name1: @paramName1;
  name2: @paramName2;
  name3: <value>;
  ... 
}
```
and the usage:

```css title="mixin usage"
some {
  @mname(val1,val2);
  color: black;
  ...
}
```

Example, defining set of properties for a button:

```css title="mixin declaration"
@mixin LIKE-BUTTON(color) {
  display:inline-block;
  background-color: @color;
  border: 1px solid #000;
  border-radius: 3px;
  padding: 0.5em 1em;
}
```
with such defintion we can use it in various rules:
```css
a[href] {
  @LIKE-BUTTON(#ff0000);
  display:block; /*even it was defined in the mixin
                   we can redefine it after */ 
}
```

