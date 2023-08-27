---
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Graphics.Color

Represents color value with red, blue. green and alpha components.

## Properties:

### r, g, b, a

read-only, color channels as decimals in range [0.0 ... 1.0]

* `color.r` - red channel.
* `color.g` - green channel.
* `color.b` - blue channel.
* `color.a` - alpha channel, 0.0 - fully transparent, 1.0 - fully opaque.

### R, G, B, A

read-only, color channels as integer in range [0 ... 255]

* `color.R` - read/only, int(0..255), red channel.
* `color.G` - read/only, int(0..255), green channel.
* `color.B` - read/only, int(0..255), blue channel.
* `color.A` - read/only, int(0..255), alpha channel, 0.0 - fully transparent, 1.0 - fully opaque.

### hsv

read/only, reports [hue:0..360, saturation:0..1, value: 0..1, alpha: 0..1], [HSV](https://en.wikipedia.org/wiki/HSL_and_HSV) representation of the color.

```js
const [h,s,v] = color.hsv; 
```

### hsl

read/only, reports [hue:0..360, saturation:0..1, lightness: 0..1], [HSL](https://en.wikipedia.org/wiki/HSL_and_HSV) color representation.

```js
const [h,s,l] = color.hsl; 
```

## Methods:

### toString()

```js
const ste = toString(type);
```

parameters:

- _type_, string, representation type, one of:
   + "RGB" - returns "#RRGGBB"
   + "RGBA" - returns "#RRGGBBAA" 
   + "rgb" - returns "rgb(255,255,255)"
   + "rgba" - returns "rgba(255,255,255,1.0)"


### valueOf()

```js
color.valueOf()
```
returns integer of the color, packaged to uint32 as `(a << 24) | (b << 16) | (g << 8) | (r)`

## Static methods:

### rgb()

```js
Color.rgb( r, g, b [,a]) : Color
```
constructs color instance from r,g,b,a components - float numbers in `0.0 .. 1.0` range.

### RGB()

```js
Color.RGB(0..255,0..255,0..255[,0..255]) : Color
```
constructs color instance from r,g,b,a components - integes in 0...255 range.

### hsv()

```js
Color.hsv( h, s, v [,a]) : Color
```
creates color instance from HSV components - float numbers in `0.0 .. 1.0` range but `h` is in `0.0 .. 360.0` range.

### hsl()

```js
Color.hsl( h, s, l [,a]) : Color
```
creates color instance from HSL components - float numbers in `0.0 .. 1.0` range but `h` is in `0.0 .. 360.0` range.

### morph()

```js
Color.morph(from:Color,to:Color,ratio:0...1):Color
```

Morph _from_ color into _to_ color value according to _ratio_. If _ratio_ == 0.0 it returns _from_ and if _ratio_ == 1.0 it returns _to_ value. Color morphing is done in premultipled color space.
