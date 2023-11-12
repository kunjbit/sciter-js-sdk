---
sidebar_position: 5
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Graphics.Image

Represents an image.

## Properties:

### src

read-only, string, url of the image.

### width

read-only, integer, width.

### height

read-only, integer, height.

### size

read-only, [Size](Size)

### packaging

read-only, string, "png","webp", etc.

## constructor:

```js
new Graphics.Image(width, height, painter(graphics) [,initColor]);
```
constructs new Image by rendering arbitrary drawing on the bitmap.

parameters:
- _width_, _height_ - dimensions of the image;
- _painter_ - function(graphics), drawing function to produce its content.
- _initColor_ - [Color](Color), initial color to initialize bitmap bits.

:::note
Resolution of the graphics in _painter_ is set to 1 bitmap pixel. 
:::

```js
new Graphics.Image(width, height, element [,initColor])
```
new Image by rendering a DOM element on the bitmap.

parameters:
- _width_, _height_ - dimensions of the image;
- _element_ - [Element](../DOM/Element) to render;
- _initColor_ - [Color](Color), initial color to initialize bitmap bits.

## Methods:

### update()

```js
image.update(painter(graphics)[,initColor])
```
update the bitmap by drawing on the image's surface.

### toBytes()

```js
image.toBytes(packaging [,compression:int]) : ArrayBuffer
```
parameters:
- _packaging_ - string, is one of "png","jpeg","webp","bgra".
- _compression_ - integer, 0 ... 100, compression factor (for jpeg).

### colorAt()

```js
image.colorAt(x,y): Color | null
```
returns color of a pixel at x/y.

### compose()

```js
image.compose(src, op, [dstx,dsty[,srcx,srcy,srcw,srch]]): Image
```

compose this image with _src_ image, parameters:

- _src_ - image to compose with;
- _op_, string, composition method, is one of: "src-over", "dst-over", "src-in", "dst-in", "src-out", "dst-out", "src-atop", "dst-atop", "xor", "copy".

Returns composed image. 

## Static methods:

### fromBytes()

```js
Graphics.Image.fromBytes( data: ArrayBuffer ) : Image
```
constructs image from bytes (PNG,JPEG, etc). Throws an error in case of failures

### load()

```js
async Graphics.Image.load( url: string | request : Request [, sync: bool = false] ) : Promise(Image) | Image | null
```

loads image from url. 

:::note
* If _sync_ is _false_ it is an async function (returns promise) so it needs to be `await`'ed. 
* If _sync_ is _true_ it is a sync operation - returns either Image instance or _null_. 
:::
  
:::note
this method allows to cancel load request, see [Fetch](../JS.runtime/Fetch).
:::