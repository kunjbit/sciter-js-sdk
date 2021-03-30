# class Node 

Node is an abstract class that is inherited by [Element](Element.md), [Text](#TextNode) and [Comment](#CommentNode) classes.

#### properties:

* `node.nodeName`
* `node.nodeType`
* `node.nodeValue`
* `node.firstChild`
* `node.lastChild`
* `node.nextSibling`
* `node.previousSibling`
* `node.ownerDocument`
* `node.parentNode`
* `node.parentElement`
* `node.textContent`

#### methods:

* `node.cloneNode()`
* `node.contains()`
* `node.compareDocumentPosition()` - not yet
* `node.getRootNode()`
* `node.hasChildNodes()`
* `node.isEqualNode()`
* `node.isSameNode()`


# <a name="Text"></a>class Text, extends class Node

The Text represents html text nodes.

#### properties:

* `text.data` read-write
* `text.length` read-only
* `text.wholeText` read-only

# <a name="Comment"></a>class Comment, extends class Node

The Comment represents html comment nodes.

#### properties:

* `comment.data` read-write
* `comment.length` read-only