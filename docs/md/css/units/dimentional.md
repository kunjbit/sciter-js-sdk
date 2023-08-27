# Dimentional

The engine supports following length units:

## Absolute Lengths

|  Unit  | Description   |
| ------ | ------------- |
| **px**   | pixels, either dip unit or ppx unit - depends on engine configuration. By default 1px === 1dip
| **in**   | inches - 1 inch is equal to 2.54 centimeters
| **cm**   | centimeters
| **mm**   | millimeters
| **pt**   | points - the points used by CSS 2.1 are equal to 1/72nd of an inch
| **pc**   | picas - 1 pica is equal to 12 points
| **dip**  | device independent pixels - logical units. 1dip = 1/96 of inch therefore on 96DPI display this will be one pixel. On high-dpi screens it will be resolved to larger number of physical pixels. For example: 2dip will take 3px on 120DPI screen. On printer 'dip' and 'px' units are equivalent.
| **ppx**  | physical pixel. On screen 1ppx is exactly one device pixel. On printer 1ppx is equal to 1/96 of inch.

## Relative Lengths

|  Unit  | Description   |
| ------ | ------------- |
| **em**   | the font-size of the relevant font;
| **rem**  | the font-size of the root font;
| **ex**   | the x-height of the relevant font;
| **ch**   | width of `0` character in the relevant font;
| **%**    | percent - usually equals to precentage value of correspondent metric of parent element. But not always, see CSS specification.
| **vw**   | 1/100th of view (window) width;
| **vh**   | 1/100th of view (window) height;
| **vmin** | 1/100th of view's smallest side;
| **vmax** | 1/100th of view's largest view(window) size.

## Width/Height Based Lengths

|  Unit  | Description   |
| ------ | ------------- |
| **width(X%)**  | percentage of `width` property value. If _width_ is undefined it is treated as _auto_ 
| **height(Y%)** | percentage of `height` property value. If _height_ is undefined it is treated as _auto_ 

```css
p { 
  height: 1.6em;
  line-height: height(100%);
}
```

## Flexes

|  Unit  | Description   |
| ------ | ------------- |
| **N\***   | flex unit, reflects weight in distribution of free space 
| **\***    | flex unit, shortcut of `1*`

See [Flows and Flexes](../flows-and-flexes)

## calc()

[The calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) function is supported, but flex units cannot be used inside the calc.
