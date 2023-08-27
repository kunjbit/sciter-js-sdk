---
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Graphics.Path

Represents 2D path. Also known as Path2D in browsers.

## constructor

```js
new Graphics.Path([d:string])
```

Constructs new path object. _d_ accepts SVG's `<path>`s [d attribute value](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).

## properties

N/A

## Methods

### moveTo()

```js
path.moveTo(x, y)
path.moveTo(Point)
```

### lineTo()

```js
path.lineTo(x, y)
path.lineTo(Point)
```

### quadraticCurveTo()

adds a quadratic Bézier curve to the current sub-path.

```js
path.quadraticCurveTo(cpx, cpy, x, y)
path.quadraticCurveTo(cp:Point, pt:Point)
```

### bezierCurveTo()

adds a cubic Bézier curve to the current sub-path.

```js
path.bezierCurveTo(p1x, cp1y, cp2x, cp2y, x, y)
path.bezierCurveTo(cp1:Point, cp2:Point, pt:Point)
```

### arcTo()

adds a circular arc to the current sub-path, using the given control points and radius. The arc is automatically connected to the path's latest point with a straight line, if necessary for the specified parameters.

```js
path.arcTo(x1, y1, x2, y2, radius)
path.arcTo(cp1:Point, cp2:Point, radius)
```

### arc()

adds a circular arc to the current sub-path.

```js
path.arc(x, y, radius, startAngle, endAngle [, anticlockwise])
```

### ellipse()

```js
path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise])
```

### rect()

```js
path.rect(x, y, width, height)
path.rect(Rect)
```

### closePath()

adds a straight line from the current point to the start of the current sub-path. If the path has already been closed or has only one point, this function does nothing.

```js
path.closePath()
```

### isPointInside()

```js
path.isPointInside(x,y):bool
path.isPointInside(Point):bool
```
_true_ if the point is inside the (closed) path

```js
path.isPointOnStroke(distance,x,y):bool
path.isPointOnStroke(distance,Point):bool
```
_true_ if the point is in _distance_ from the stroked path.

### box()

```js
path.box(): Rect
```
Outline box as a rectangle.

### bounds()

```js
path.bounds(): [x1,y1,x2,y2]
```
Outline box as a x1,y1,x2,y2 quad


### combine()

```js
path.combine(how:string, otherPath): Path
```
Combines this and other path using following _how_ modes:

  * `"union"` 
  * `"intersect"`
  * `"xor"`
  * `"exclude"`

