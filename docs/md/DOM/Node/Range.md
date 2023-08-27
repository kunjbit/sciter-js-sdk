---
sidebar_position: 3
title: Range
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Range

The Range represents a fragment of a document that can contain nodes and parts of text nodes.

## properties:

### isCollapsed

read-only, boolean, _true_ if the range is collapsed to one position (start == end)

### commonAncestorContainer

read-only, [Element](../Element), nearest container element that encloses as start as end positions.

### endContainer

read-only, the [Node](../Node) within which the Range ends.

### endOffset

read-only, end position in endContainer

### startContainer

read-only, the [Node](../Node) within which the Range starts.

### startOffset

read-only, start position in startContainer

### start

read-only, pair of [startContainer, startOffset].

### end

read-only, pair of [endContainer, endOffset].

## methods:

### setStart()

```js
range.setStart(node,offset)
```

### setEnd()

```js
range.setEnd(node,offset)
```

### setStartBefore()

```js
range.setStartBefore(node)
```
Set start position so it will include start of the _node_.

### setEndBefore()

```js
range.setEndBefore(node)
```

Set end position so it will NOT include start of the _node_.

### setStartAfter()

```js
range.setStartAfter(node)
```
Set start position so it will NOT include start of the _node_.

### setEndAfter()

```js
range.setEndAfter(node)
```
Set start position so it will include end of the _node_.

### selectNode()

```js
range.selectNode(node)
```
Setup range to include start and end positions of the _node_.

### selectNodeContents()

```js
range.selectNodeContents(node)
```

Setup range to do not include start and end positions of the _node_ but its content.


### collapse()

```js
range.collapse([toStart:bool])` - sets either end or start positions.
```
sets either: 
- end = start, toStart is _true_, or 
- start = end, otherwise.

### cloneRange()

```js
range.cloneRange():Range
```
returns copy of this range object.

## Methods (Sciter specific):

### nodes()

```js
range.nodes():array<Node>
```
returns list of nodes covered by the range - all nodes that have either start or end inside the range.

### applyMark()
### highlight()

```js
range.applyMark(name | [name1, name2,...]) // or
range.highlight(name | [name1, name2,...])
```
apply mark or marks to the range so it can be styles by CSS `::mark(name) {...}`.

### clearMark()
### clearHighlight()

```js
range.clearMark(name | [name1, name2,...]) // or
range.clearHighlight(name | [name1, name2,...])
```
removes given mark(s) from the range.

### marks()

```js
range.marks():[]
```
returns list (array) of mark names inside this range.

### setToMark()

```js
range.setToMark(name)
```
setups the range to start/end of character range having _name_ mark set.
