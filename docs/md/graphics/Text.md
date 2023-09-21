---
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Graphics.Text

Block of text to be drawn on graphics. 

It can represent and render as single as multi-line texts.

`Graphics.Text` instances can be styled as by implicit `text.style = "..."` as by CSS in document styles using class names `text.class = "..."`.

Full set of block and text CSS styles is supported, so you may define

```js
  text.style = "border:1px solid red; font: 12pt Roboto, sans-serif; width:max-content";  
```

to have a bordered text box.

## constructor

```js
let textLayout = new Graphics.Text(text:String [, cssClassName: String ])
```

constructs new instance of the Text with the _text_ and optionally _class_

## properties:

### lines

read-only, number of text lines in the text layout at current width.

### chars

string, read/write, text to render.

### style

string, read/write, style of the text including fonts, alignment, borders and background.

### class

string, read/write, class name of the text in document's CSS styles.

## Methods:

### width()

```js
text.width(): [minWidth,maxWidth,usedWidth]
```
reports text layout metrics: minimal, maximal and used width of the text block.

```js
text.width(usedWidth): Text
```

sets used width of the text block. 

:::note
`text.lines` property may change after the call.
:::

### height()

```js
text.height(): [contentHeight,usedHeight]
```
reports content and used height of the text block. 

```js
text.height(usedHeight): Text
```
sets used height of the text block. 

:::note
vertical-align of text style may change location of glyphs on screen.
:::

### lineMetrics()

```js
text.lineMetrics(lineNo) : [yPos, height, baselineOffset]
```
reports line metrics;

### lineChars()

```js
text.lineChars(lineNo)
```
returns string - text of line at _lineNo_.

