# class Graphics.Path

Represents 2D path. Also known as Path2D in browsers.

## Constructor

`new Graphics.Path([d:string])`

Constructs new path object. _d_ accepts SVG's `<path>`s [d attribute value](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).

## Properties

N/A

## Methods

* ### `path.moveTo(x, y)`
* ### `path.lineTo(x, y)`
* ### `path.quadraticCurveTo(cpx, cpy, x, y)`
* ### `path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)`
* ### `path.arc(x, y, radius, startAngle, endAngle [, anticlockwise])`
* ### `path.arcTo(x1, y1, x2, y2, radius)`
* ### `path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise])`
* ### `path.rect(x, y, width, height)`
* ### `path.closePath()`

* ### `path.isPointInside(x,y)`
* ### `path.bounds(): [x1,y1,x2,y2]`
* ### `path.combine(how:string, otherPath): Path`
  
  combines this and other paths using following _how_ modes:

  * `"union"` 
  * `"intersect"`
  * `"xor"`
  * `"exclude"`

