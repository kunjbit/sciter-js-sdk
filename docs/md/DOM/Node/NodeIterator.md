---
sidebar_position: 4
title: NodeIterator
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class NodeIterator

Iterable object that can be used in for/of iteration.

## properties:

### root

read-only, returns a [Node](../Node) representing the root node, as specified in [createNodeIterator](../Document#createnodeiterator).

### filter

read-only, returns filter object used in [createNodeIterator](../Document#createnodeiterator)

### whatToShow

read-only, integer, ORed [mask bits](#nodefiltermaskenumeration).

### referenceNode

read-only, current [Node](../Node).

## methods:

### nextNode()
### previousNode()

return the next/previous Node in the document, or _null_ if there are none.

## constants:

### NodeFilter mask bits

| Name   | Meaning      |
| ------ | ------------ |
| NodeFilter.SHOW_ALL     | Shows all nodes
| NodeFilter.SHOW_ELEMENT | Elements
| NodeFilter.SHOW_TEXT | Text nodes
| NodeFilter.SHOW_COMMENT | Comment nodes
| NodeFilter.SHOW_DOCUMENT | Document nodes

