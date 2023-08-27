---
sidebar_position: 1
title: Document
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Document

Note: in Sciter.JS class `Document` extends class [`Element`](../Element) class, global constant `document` represents root element of the document, so `document.documentElement === document`. Therefore all methods of Element class are available in `document` too.

## Properties:

### body

[Element](../Element), `<body>` element reference.

### head

[Element](../Element), `<head>` element reference.

### documentElement

[Element](../Element), `<html>` element reference.

:::note
`document === document.documentElement` in Sciter
:::

### readyState
   
string, values:
- `"interactive"` - operational;
- `"complete"` - operational and finished loading resources;

### globalThis

object, reference of global namespace object associated with this document.

:::note
All global variables and functions declared in the document scripts will be members of this object.
:::

### defaultView

In Sciter it returns the [globalThis](#globalThis) object.

## Methods:

### querySelector()

```js
document.querySelector(selector)
```

parameters:
- *selector* - string, CSS selector 

returns:
- [Element](../Element), first element matching the selector;
- *null* if no element found; 

### $()

```js
document.$(selector)
````

synonym of [`document.querySelector(selector)`](#queryselector)


### querySelectorAll()

```js
document.querySelectorAll(selector)
```

parameters:
- *selector* - string, CSS selector 

returns:
- array of [Element](../Element), list of all elements matching the selector;
- *[]*, empty array if no element found; 

### $$()

```js
document.$$(selector);
```

synonym of [`document.querySelectorAll(selector)`](#queryselectorall)

:::tip 
Enumerate all `<span>`s in the document
```js
for(const span of document.$$("span"))
   console.log(span);
```
:::

### getElementById()

```js
document.getElementById(id)
```

parameters:
- *id* - string, ID of the element (without leading `#`); 

returns:
- [Element](../Element), first element matching the selector;
- *null* if no element found; 

### createElement()

```js
document.createElement(tag[,attributes])
```

parameters:
- *tag* - string, tag of the element ('"div"', '"span"', etc ); 
- *attributes*, object, optional, initial attributes of the element;

returns:
- [Element](../Element), reference of the element.


### createTextNode()

```js
document.createTextNode(text)
```

parameters:
- *text* - string, text of the text node; 

returns:
- [Text](../Node#text), reference of the Text node.


### createComment()

```js
document.createComment(text)
```

parameters:
- *text* - string, text of the comment node; 

returns:
- [Comment](../Node#comment), reference of the Comment node.

### createDocumentFragment()

```js
document.createDocumentFragment()
```

returns:
- [Element](../Element), reference of the document fragment element.


### createNodeIterator()

```js
document.createNodeIterator(root[, whatToShow[, filter]])
```

parameters:

- *root*, [Element](../Element), the root element at which to begin the NodeIterator's traversal.
- *whatToShow* - integer, optional, a bitmask created by combining the constant properties of NodeFilter: 

  | Name   | Meaning      |
  | ------ | ------------ |
  | NodeFilter.SHOW_ALL     | Shows all nodes
  | NodeFilter.SHOW_ELEMENT | Elements
  | NodeFilter.SHOW_TEXT | Text nodes
  | NodeFilter.SHOW_COMMENT | Comment nodes
  | NodeFilter.SHOW_DOCUMENT | Document nodes

- *filter*, function(node):integer, optional, the function will be called for each node satisfying the filter. The function shall return either one of these values:
  
  | Name   | Meaning      |
  | ------ | ------------ |
  | NodeFilter.FILTER_ACCEPT | accept the node for the iteartion
  | NodeFilter.FILTER_REJECT | reject the node and skip its content 
  | NodeFilter.FILTER_SKIP | skip the node but walk through its content 

returns:
- [NodeIterator](../Node/NodeIterator), reference of the node iterator.

### createRange()

```js
document.createRange([startNode,startIndex[,endNode,endIndex])
```

returns:
- [Range](../Node/Range), reference of new Range.

### createDocument()
### createHTMLDocument()

```js
document.createDocument()
```

returns:
- Document, reference of new Document.

## Methods (Sciter specific):

### bindImage()

```js
document.bindImage(url[, img])
```

This method associates the *img* with the arbitrary url so it can be used in CSS.

parameters:
- *url* - string, arbitrary URL; 
- *img* - [Image](../../Graphics/Image) or *null* or *undefined*, image to associate with the URL:
  - if img is ommited or *undefined* then the function returns existing image associated with the URL (if any);
  - if img is *null* then the function removes binding set by previous  `bindImage(url,img)` call;

returns:
- [Image](../../Graphics/Image), reference of an image.
- *null* if image was not found.

examples:

JS:
```js
   document.bindImage("in-memory:dynback");
```
CSS:
```CSS
   div {
     /* uses image supplied by script: */
     background-image: url("in-memory:dynback"); 
   }
```

### url()

```js
document.url([relpath]) : string
```
returns absolute path of _relpath_ using the document URL as a base.

If *relpath* is omitted the method returns url of the document itself.

