---
sidebar_position: 1
title: Properties
toc_min_heading_level: 2
toc_max_heading_level: 5
---

## CSS properties

:::note 
If not stated otherwise these properties behave as defined in W3C specs. 
:::

#### direction
- `direction`

#### display and visibility

- `display`
- `visibility` - standard, but also supports `none` value that is treated as `display:none`

#### floats
- `clear`
- `float`

#### color and font
- `color`
- `font`
- `font-family`
- `font-size`
- `font-style`
- `font-variant`
- `font-variant-ligatures`
- `font-variant-caps`
- `font-weight`
- `letter-spacing`
- `line-height`
- `baseline-shift`
- `font-rendering-mode` :
  + `sub-pixel` - default mode, glyphs may start on fractions of pixels;
  + `snap-pixel` - glyphs start on pixel boundary, used in edit fields to show caret properly;

#### text rendering

- `text-decoration`
- `text-decoration-style`
- `text-decoration-line`
- `text-decoration-color`
- `text-decoration-thickness`
- `text-indent`
- `text-overflow`
- `text-shadow`
- `text-transform`
- `white-space`
- `text-wrap`
- `word-wrap`
- `word-break`
---
- `tab-size`

#### selection

- `text-selection-color`
- `text-selection-background-color`
- `text-selection-caret-color`
- `text-selection`
 
#### dimensions

- `min-height`
- `min-width`
- `max-height`
- `max-width`
- `height`
- `width`
- `size` - in Sciter the size is shortcut property for width and height, accepts one or two length / flex values:
  + `size: 100px` - `width:100px` and `height:100px`;
  + `size: 100px 200px` - `width:100px` and `height:200px`;
- `box-sizing` - standard, but also supports `padding-box` value.

#### alignments
- `text-align`
- `vertical-align` - standard for display:inline and display:inline-block elements, for other elements is treated as `content-vertical-align`;
- `horizontal-align` - (Sciter) alias of `content-horizontal-align`
- `content-vertical-align` - (Sciter) block vertical alignment inside this element: 
  + `top`
  + `middle`
  + `bottom`
- `content-horizontal-align` - (Sciter) block horizontal alignment inside this element:
  + `start` - either _left_ or _right_, depending of direction;  
  + `end` - either _right_ or _left_, depending of direction;  
  + `left`
  + `center`
  + `right`


#### background
- `background`
- `background-attachment`
- `background-color`
- `background-image`
- `background-position`
- `background-position-top`
- `background-position-left`
- `background-position-right`
- `background-position-bottom`
- `background-repeat`
- `background-offset`
- `background-offset-top`
- `background-offset-left`
- `background-offset-right`
- `background-offset-bottom`
- `background-size`
- `background-width`
- `background-height`
- `background-clip`
- `background-image-frame`
- `background-blend-mode`

#### borders

- `border`
- `border-bottom`
- `border-bottom-color`
- `border-bottom-style`
- `border-bottom-width`
- `border-collapse`
- `border-color`
- `border-left`
- `border-left-color`
- `border-left-style`
- `border-left-width`
- `border-right`
- `border-right-color`
- `border-right-style`
- `border-right-width`
- `border-style`
- `border-top`
- `border-top-color`
- `border-top-style`
- `border-top-width`
- `border-width`
- `border-radius`
- `border-top-right-radius`
- `border-bottom-right-radius` 
- `border-bottom-left-radius`
- `border-top-left-radius`
- `border-top-right-radius-x`
- `border-top-right-radius-y`
- `border-bottom-right-radius-x` 
- `border-bottom-right-radius-y`
- `border-bottom-left-radius-x`
- `border-bottom-left-radius-y`
- `border-top-left-radius-x`
- `border-top-left-radius-y`
---
- `box-shadow`

#### outlines

- `outline-color`
- `outline-width`
- `outline-style` - accepts these values: 
  + `none`
  + `solid`
  + `dotted`
  + `dashed`
  + `glow` - (Sciter specific) draws box-shadow with `blur-radius == outline-width` and `spread-radius == outline-offest` 
  + `nwse-hatch` - (Sciter specific) uses `\\\\` hatch brush for painting; 
  + `nesw-hatch` - (Sciter specific) uses `////` hatch brush for painting; 
- `outline-offset`
- `outline`

#### filters

- `filter`
- `backdrop-filter`
 
#### transform

- `transform`
- `transform-origin`
- `transform-origin-x`
- `transform-origin-y`

#### printing

- `page-break-before`
- `page-break-after`
- `page-break-inside`

#### margin

- `margin`
- `margin-bottom`
- `margin-left`
- `margin-right`
- `margin-top`
---
- `hit-margin` - Sciter specific, non-visual margin that extends hit box of the element. Affects where E:hover will detect the element. 

#### padding

- `padding`
- `padding-bottom`
- `padding-left`
- `padding-right`
- `padding-top`

#### border spacing

- `border-spacing`
- `border-spacing-x`
- `border-spacing-y` - standard, but in Sciter `border-spacing` is applied to content of any block element. So `div { border-spacing:2em }` will make 2em margins between div's children. 

#### lists

- `list-style`
- `list-style-image`
- `list-style-position`
- `list-style-type`
- `list-marker-color`
- `list-marker-size`
- `list-marker-style`

#### overflow

- `overflow`
- `overflow-x`
- `overflow-y` - standard, but also supports `scroll-indicator` value to show not-taking-space scrollbar, as on mobiles. 

#### cursor

- `cursor`

#### image rendering

- `image-rendering` - the image-rendering property provides a hint about the algorithm it should use to scale images. Supports one of the following values:
  + `inherit` inherit value from parent
  + `auto` bilinear or bicubic interpolation
  + `crisp-edges` linear interpolation
  + `pixelated` nearest-neighbour interpolation
  + `default` alias of crisp-edges
  + `optimize-quality` alias of auto
  + `optimize-speed` alias of pixelated

#### opacity

- `opacity`

#### positioning

- `z-index`
- `position`
- `left`
- `right`
- `top`
- `bottom`

#### transitions

- `transition`
- `transition-delay`
- `transition-duration`
- `transition-property`
- `transition-timing-function`

#### animations
- `animation`
- `animation-name`
- `animation-duration`
- `animation-delay`
- `animation-iteration-count`
- `animation-direction`
- `animation-timing-function`
- `animation-fill-mode`
- `animation-play-state`

#### auxiliaries

- `appearance` - only `none` value is used to suppress default rendering of `<input>`s and `<buttons>`s
- `zoom`
- `pointer-events`

## Sciter specific properties

#### content

- `content` - in Sciter content can be defined for any element, not just ::after and ::before

#### layers

- `layer` : 
  + `auto` - default value, no layer;
  + `force` - creates bitmap buffer for the element, used in cases when element has complex drawing inside;
  + `disabled` - disable buffering;
   
- `content-isolate` : 
  + `isolate` - default, content of style-sets are not redifinable by user's styles; 
  + `none` - content of style-sets can be redifined by user's styles; 

#### border shape

- `border-shape` - declares elements of arbitrary shapes.

  Accepts SVG `path(m ... z)` values that define the shape. If combined with `overflow:hidden` then clips content of the element by that path.

#### clip box

- `clip-box` defines area clipped when overflow:hidden is used, accepts:
  + `default`- either content-box or padding-box, depends on context;
  + `content-box` 
  + `padding-box` 
  + `border-box` 
  + `margin-box` 
  + `hit-margin-box` 

#### fills and strokes

- `fill`
- `fill-opacity`
- `fill-rule`
- `stroke`
- `stroke-width`
- `stroke-linecap`
- `stroke-linejoin`
- `stroke-miterlimit`
- `stroke-dasharray`
- `stroke-dashoffset`
- `stroke-opacity`
- `stop-color`
- `stop-opacity`
- `marker`
- `marker-start`
- `marker-mid`
- `marker-end`
  
  These are standard SVG properties but in Sciter they are applied to vector images of any element: 

  ```css
    button {
      background: path(m 0 0 ... z) no-repeat;
      fill:red;
      stroke: blue;
    }
  ```
#### flow - layout managers

- `flow` - see [Flows and Flexes](flows-and-flexes).
- `flow-rows`
- `flow-columns`

#### scrolling

- `scroll-manner`
- `scroll-manner-x`
- `scroll-manner-y` 
  Accepts `scroll-manner(prop1:val1[, ...propN:valN])` with the following prop/value arguments:
  + `animation:true|false` - on/off animated scroll;
  + `step: <length>` - advance of one scroll step (click on next/previous buttons on scrollbar);
  + `page: <length>` - advance of one scroll page;    
  + `wheel-step: <length>` - advance of one mouse wheel click;

#### behavior and component support

- `behavior`: `<name-of-native-behavior>` see [behaviors](../behaviors) 
---
- `prototype`
- `aspect` - see [DOM components and aspects](../CSS/behaviors-and-aspects)

#### foreground

- `foreground`
- `foreground-attachment`
- `foreground-image`
- `foreground-position`
- `foreground-position-top`
- `foreground-position-left`
- `foreground-position-right`
- `foreground-position-bottom`
- `foreground-repeat`
- `foreground-size`
- `foreground-width`
- `foreground-height`
- `foreground-clip`
- `foreground-image-frame`
- `foreground-image-cursor`
- `foreground-blend-mode` 
  
  Elements in Sciter may have foreground image defined that is defined exactly as a background image but rendered on top of the content; 

- `foreground-color`
  
  In some cases you may highlight element by defining semitransparent `foreground-color: rgba(255,0,0,0.5)`. That foreground-color layer will be drawn on top of element's background and content; 

#### role

- `role` - string, defines role of the element, for example `tr {role : "option"}` will allow selectable table rows as options in select; 

#### image transformations

- `background-image-transformation`
- `foreground-image-transformation` - whitespace separated list of various image transformations methods
  + `contrast(0 ... 1.0)`
  + `brightness(0 ... 1.0)`
  + `gamma(0 ... 4.0)`
  + `hue(0..360deg)`
  + `saturation(0 ... 1.0)`
  + `opacity(0 ... 1.0)`
  + `flip-x()` - flip image horizontally; 
  + `flip-y()` - flip image vertically;
  
#### scrollbar styling

- `vertical-scrollbar`
- `horizontal-scrollbar`

  These properties accept name of styleset that defines scrollbar look and feel, see [Scrollbar Styling](scroll-bar-styling).

- `overscroll-behavior`
- `overscroll-behavior-x`
- `overscroll-behavior-y` 
  
  These properties define what happens when scrollable reaches the boundary of a scrolling area: 
  + `auto` - on touch scrolling performs rollback animation, on mouse wheel scroll - no overscroll;
  + `contain` - overscroll with rollback animation;
  + `none` - no overscroll at all;


#### context menu

- `context-menu` accepts either : 
  + `selector(...)` that defines selector of menu element that will be used as a context menu, or 
  + `url(...)` url of partial HTML that defines `<menu>` element; 

#### style sets

- `style-set` - see [Style Sets](style-sets)

#### mapping, RTL support

- `mapping` - accepts function `left-to-right(part1 , ... partN )` where parts are :
  + `margin` - swaps left and right margins;
  + `border` - swaps left and right borders; 
  + `background` - swaps left and right background props and image; 
  + `background-image` - mirrors image horizontally; 
  + `background-position` - swaps left and right background image position;
  + `foreground` - swaps left and right foreground props and image; 
  + `layout` - swaps direction between ltr and rtl;
  + `alignment` - changes text-align from left to right;

#### popup position:
- `popup-position` : `<popup-reference-point>` `<anchor-reference-point>`
- `popup-anchor-reference-point` 
- `popup-reference-point` - these two accept named reference point values:
  * `top-left`
  * `top-center`
  * `top-right`
  * `middle-left`
  * `middle-center`
  * `middle-right`
  * `bottom-left`
  * `bottom-center`
  * `bottom-right`

#### popup animation:
- `popup-animation`: `popup-animation(param:value, ...)` where params are:
  * _type_ : one of `blend` | `inflate` | `slide` | `roll` - type of window appearance animation;
  * _axis_ : one of `horizontal` | `vertical`;
  * _heading_ : one of `start-to-end` | `end-to-start`;
  * _duration_ : duration of the animation, e.g. `100ms`;

