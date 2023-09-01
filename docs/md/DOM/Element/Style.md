---
sidebar_position: 1
title: Style
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Element.Style

Instances of Element.Style class represent list of CSS properties set on element.

To get reference to style collection use `element.style` property.

## properties:

### get/set CSS property

To get/set a property use either camelCase notation as: 

```js
var bgColor = element.style.backgroundColor;
```

or the "hyphen-case" form:

```js
var bgColor = element.style["background-color"];
```

### cssText

The cssText property returns or sets the text of the element's inline style declaration only.

## methods:

### getPropertyValue()

```js
element.style.getPropertyValue(name)
```
returns a string containing the value of a specified CSS property.

### setProperty()

```js
element.style.setProperty(name, value [,important])
```
sets a new value for a CSS property.


### set()
```js
element.style.set({ prop1:value1 [, ... prop2:value2] })
```
sets multiple style properties at once.

:::info
Sciter specific feature - updates style properties in transactional manner.
:::

### removeProperty()

```js
element.style.removeProperty(name)
```

removes a property value previously set by setProperty.

### colorOf()

```js
element.style.colorOf(name): Color
```
reports a value of property _name_ as an instance of [`Graphics.Color`](../../Graphics/Color) class. Returns null if the propety is not a color.

### pixelsOf()

```js
element.style.pixelsOf(name): number
```
reports used value of property _name_ as a number of CSS pixels. Returns null if the propety is not a length.

### imageOf()

```js
element.style.imageOf(name):Image
```
reports used value of property _name_ as an instance of [`Graphics.Image`](../../Graphics/Image). Returns null if the propety is not an image.

### variables()

```js
element.style.variables([{name:value,...}]):{name:value, ...}
```

if the parameter object is not provided reports CSS variables seen by the element, returns the set as a `{name:value, ...}` map.

Otherwise, if the parameter is an object (name/value map), sets CSS variables on the element.

### variable()

```js
element.style.variable(name [, value]): value
```
if _value_ parameter is not provided, returns value of CSS variable seen by the element.

Otherwise sets CSS variable on the element.

### setCursor()

```js
element.style.setCursor(null | image, hotspotX, hotspotY)
```
sets/resets element's cursor by the image and hotspot coordinates.

