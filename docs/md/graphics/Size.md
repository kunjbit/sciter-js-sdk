---
sidebar_position: 6
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Graphics.Size

Data type, represents 2D size (dimensions).

```js
const sz1 = Size(10,10);
const sz2 = Size.make(20,20); 
const sz3 = Size(Rect(10,10,100,100)); // size of the rect, 100,100

// operators
const sum = Size(0,0) + Size(50,50); 
const sub = Size(0,0) - Size(50,50); // [-50,-50]
```

## constructor

Size instances can be constructed by `new Size(...)` or by `Size(...)` "convesrsion" constructor. 

* `Size()`  - constructs 0,0 size;
* `Size(Size)`  - constructs copy of the size;
* `Size(Point)`  - constructs size by converting it from _Point_;
* `Size(x,y)`  - constructs size from two numbers;

## properties:

### x, y

* `x` - number;
* `y` - number;

### width, height

* `width` - number, alias of _x_;
* `height` - number, alias of _y_;

### length

number, length of the vector;

## methods:

### isEmpty()

```js
isEmpty():bool
```
returns _true_ if either x or y are <= 0. 

### normalize()

normalize():Size 

returns normalized size with x and y >= 0. 

## operators:

Size supports following operators:

* `size * n|size` - per component multiplication by number or size (scaling);
* `size / n|size` - per component division by number or size (scaling); 
* `size + point|size` - sum of two points (vectors);
* `size - point|size` - substraction of two points;
* `size == size` - equality of two points, implementation uses float EPSILON precision;
* `+size` - unary + (copy);
* `-size` - unary - (inversion);

## static methods:

 * `Size.make(x,y):Size`
 
static constructor that constructs the point from x, y.