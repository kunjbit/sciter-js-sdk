---
sidebar_position: 4
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Graphics.Brush

Represents painting brushes: solid, gradient, bitmap, etc.

Brushes are used as values of [graphics.fillStyle](../Graphics#fillstyle) and [graphics.strokeStyle](../Graphics#strokestyle)

## Properties:

### type

integer, reports brush type, one of:

- `Graphlcs.Brush.HOLLOW`
- `Graphlcs.Brush.SOLID`
- `Graphlcs.Brush.LINEAR`
- `Graphlcs.Brush.RADIAL`
- `Graphlcs.Brush.TILE`
- `Graphlcs.Brush.EXPAND`

## Methods:

### addColorStop()

adds color stop to this linear or radial gradient brush;

```js
brush.addColorStop(pos:0.0...1.0, color: Color):brush
```

## Static (Class) Methods:

### createLinearGradient()

Creates linear gradient brush along the line from x1/y1 to x2/y2.

```js
Brush.createLinearGradient(x1, y1, x2, y2): Brush
```

### createRadialGradient()

Creates radial gradient brush with the center at x/y and radius r.

```js
Brush.createRadialGradient(x, y, r): Brush
```

### createTile()

Creates tiled image brush.

```js
Brush.createTile(img:Image): Brush
```

### createSolid()


```js
Brush.createSolid(clr:Color): Brush
```

Creates solid color brush.
