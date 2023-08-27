---
sidebar_position: 5
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Graphics.Point

Data type, represents 2D point (also known as 2D vector).

```js
const position1 = Point(10,10);
const position2 = Point.make(20,20); 
const position3 = Point(Rect(10,10,100,100)); // origin of the rect

// operators
const sum = Point(0,0) + Point(50,50); 
const sub = Point(0,0) - Point(50,50); // [-50,-50]
```

## constructor

Point instances can be constructed by `new Point(...)` or by `Point(...)` "convesrsion" constructor. 

* `Point()`  - constructs 0,0 point;
* `Point(Point)`  - constructs copy of the point;
* `Point(Size)`  - constructs point by converting it from _Size_;
* `Point(x,y)`  - constructs pont from two numbers;

## properties:

### x, y

numbers

### length

number, length of the vector - `sqrt(x*x + y*y)`;


## methods:

### distance()

```js
point.distance(other:Point):number
```

returns distance between this and _other_ point. 

### distanceToLineSegment()

```js
point.distanceToLineSegment(lp1:Point, lp2:Point): [distance:number, lp: Point]
```

Distance from this point to the line segment [_lp1_,_lp2_]. 

Returns the _distance_ and _lp_ - closest point to _this_ point on the line segment or lp1 or lp2 if this point projection falls outside the segment.


### dot()

```js
point.dot(other:Point): number
```
returns [DOT product](https://www.mathsisfun.com/algebra/vectors-dot-product.html) of this and _other_ point.

### unit()

```js
point.unit():Point
```

returns normalized unit vector that goes in the same direction but has length of 1.

### inscribe()

```js
point.inscribe(Rect):Point
```

moves (if needed) copy of the point inside the Rect, returns the copy that is always inside the Rect.

## operators:

Point supports following operators:

* `point * n|size` - per component multiplication by number or size (scaling);
* `point / n|size` - per component division by number or size (scaling); 
* `point + point|size` - sum of two points (vectors);
* `point - point|size` - substraction of two points;
* `point == point` - equality of two points, implementation uses float EPSILON precision;
* `+point` - unary + (copy);
* `-point` - unary - (inversion);

## static methods:

### make()

```js
 Point.make(x,y):Point
```

Constructs point from x,y

