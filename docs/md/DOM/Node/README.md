---
sidebar_position: 3
title: Node
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Node

Node is an abstract class that is inherited by [Element](../Element), [Text](Text) and [Comment](Comment) classes.

## properties:

### nodeName

string, read-only, one of 

| Value  | Node Type    |
| ------ | ------------ |
| "#comment" | Comment
| "#text" | Text
| "#document" | Document
| The value of element.tagName | Element

### nodeType

read-only, integer, [node type](#nodetypeenum)

### nodeValue

- Text and Comment nodes - read-write, string, text of the node;
- other node types - read-only, _null_

### nodeIndex

read-only, integer, index of the node in its parent collection.

### childNodes

read-only, returns a [NodeList](NodeList)  containing all children.

### firstChild
### lastChild

read-only, returns first/last child Node.

### nextSibling
### previousSibling

read-only, returns next/previous sibling Node.

### parentNode
### parentElement

read-only, reference of parent [element](../Element).

### ownerDocument

read-only, owning [document](../Document) reference. 

### parentWindow
read-only instance of [Window](../Window) that hosts this node;

### textContent

- Text and Comment nodes - read-only, string, text of the node;
- other node types - textual content of an element - concatenation of textContent of all its descendants

## methods:

### cloneNode()

```js
const clone = node.cloneNode();
```
:::warning
In Sciter this method always does deep cloning.
:::

### contains()

```js
node.contains(otherNode): boolean
```
returns _true_ if this node contains other node as a descendant.

~~### compareDocumentPosition()~~

not implemened yet.

### getRootNode()

```js
node.getRootNode(): Document | null
```
read-only, in Sciter it always reports ownerDocument.

### hasChildNodes()

```js
node.hasChildNodes(): bool
```
reports _true_ if it has child nodes.

### isEqualNode()

```js
node.isEqualNode(otherNode): bool
```
reports _true_ if it has child nodes.
 
### isSameNode()

```js
node.isSameNode(otherNode): bool
```
reports _true_ if `node === otherNode`

### remove()

```js
node.remove()
```

method removes the node from the DOM.

## static methods:

### commonParent()

```js
Node.commonParent(nodeA,nodeB):Element
```
returns nearest common parent element of two nodes;

## static constants:

### NodeType {#nodetypeenum}

* `Node.ELEMENT_NODE`
* `Node.ATTRIBUTE_NODE`
* `Node.TEXT_NODE`
* `Node.CDATA_SECTION_NODE`
* `Node.PROCESSING_INSTRUCTION_NODE`
* `Node.COMMENT_NODE`
* `Node.DOCUMENT_NODE`
* `Node.DOCUMENT_TYPE_NODE`
* `Node.DOCUMENT_FRAGMENT_NODE`
