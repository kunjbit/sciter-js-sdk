# Colors


## Syntax

The engine supports following forms of defining color constants:

### Absolute Colors

- `#f00`      - #rgb form.
- `#ff0000`   - #rrggbb form.
- `#aaff0000` - #aarrggbb form.

- `rgb(255,0,0)`      - rgb(0..255,0..255,0..255) form.
- `rgb(100%,0%,0%)`   - rgb(0..100%,0..100%,0..100%) form.
- `rgba(255,0,0,0.5)` - rgba(0..255,0..255,0..255,0..1) form.
- `rgb(255 0 0 / 50%)` - rgba(0..255 0..255 0..255 [/ 0..100%]) modern form.

- `hsl(300,50%,50%)`    - hsl(0..360,0..100%,0..100%) form - HSL color space.
- `hsl(300 50% 50% / 50%)`    - hsl(0..360 0..100% 0..100% [/ 0..100%]) form - HSL color space.

- `hsv(300,50%,50%)`    - hsv(0..360,0..100%,0..100%) form - HSV color space.
- `hsv(300 50% 50% / 50%)`    - hsv(0..360 0..100% 0..100% [/ 0..100%]) form - HSV color space.

- `morph(basecolor, ...)` - color morphing/transformation function: 
  
### Relative Colors - `morph()`

The `morph(basecolor, ... arguments)` 

_basecolor_ is either color value, color constant or a color variable.

The function accepts one or several arguments:

- `hue:Adeg` - creates new color by changing H (Hue) component of basecolor in HSL color space. A is new angle, degree number 0...360 - absolute value of H component. 

- `rotate:Adeg` - changes H by relative rotation from base color, A is a rotation angle : -360deg ... +360deg.

- `lightness:p%` - creates new color by changing L (Lightness) component of basecolor in HSL color space. p is a number 0...100 - absolute value of L component.

- `lighten:p%` - changes Lightness component of basecolor in HSL color space by increasing basecolor::L component. p is a number 0...100 - relative increment of L component.

- `darken:p%` - changes Lightness component of basecolor in HSL color space by decreasing basecolor::L component. p is a number 0...100 - relative decrement of L component.

- `saturation:p%` - creates new color by changing S (Saturation) component of basecolor in HSL color space. p is a number 0...100 - absolute value of S component.

- `saturate:p%` - changes S by increasing Saturation component of basecolor in HSL color space. p is a number 0...100 - relative increment of S component.

- `desaturate:p%` - changes S by decreasing Saturation component of basecolor in HSL color space. p is a number 0...100 - relative decrement of S component.

- `opacity:p%` - creates new color by changing A (alpha) component of basecolor in RGBA color space. p is a number 0...100 - absolute value of A component, if 100% then color is opaque and if 0% then color fully transparent.

- `opacify:p%` - changes A (alpha) by increasing or decreasing current A value of basecolor. p is a number -100%...100% - relative increment/decrement of A component.

- `mix:p%` - creates color that is between basecolor and color2, p is a number 0%...100% - ratio of the mix. If p == 0% then result is basecolor and if 100% - color2.

- `grayscale:p%` - converts the basecolor to grayscale. If p is 100% then result is pure grayscale color (R == G == B).  If p is 0% then result is original basecolor.

- `sepia:p%` - converts the basecolor to sepia. If p is 100% then result is pure sepia color, if p is 0% then result is original basecolor.

Example:

```css
@const BASECOLOR: #0C0;

div {
  background: morph(@BASECOLOR, lighten:25%);
} 
```
