---
title: Behaviors
sidebar_position: 8
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Behaviors - native extensions of standard DOM elements

Behaviors in Sciter are native "DOM element controllers" that get attached to DOM elements by CSS:

```CSS
div.editable {
  behavior:edit; // this div behaves as a text editing field
  white-space:pre;
  overflow-x:hidden-scroll;
  border:1px solid;
}
```

Each behavior may have its own methods and properties accessible by JavaScript.

In order to avoid name collisions with standard DOM elements those methods and properties are accessible by dot notation that contains behavior name as an "interface name":

```js
let el = document.$("div.editable");

el.edit.setRange(0,10); // call method of behavior:edit 
```

Here is a list of such built-in behaviors that are available out of the box in Sciter:

* buttons 
  * [button](behavior-button.md) 
  * [clickable](behavior-clickable.md) 
  * [hyperlink](behavior-hyperlink.md) 
  * [check](behavior-check.md) 
  * [radio](behavior-radio.md) 
  * [label](behavior-label.md) 
  * [slider](behavior-slider.md) 
* editors 
  * [edit](behavior-edit.md) 
  * [password](behavior-password.md) 
  * [masked-edit](behavior-masked-edit.md) 
  * [integer](behavior-integer.md) 
  * [decimal](behavior-decimal.md) 
  * [number](behavior-number.md) 
  * [textarea](behavior-textarea.md) 
  * [plaintext](behavior-plaintext.md) - plaintext multiline editor
  * [richtext](behavior-richtext.md) - WYSIWYG HTML editor
* selects 
  * [select,select-multiple,select-checkmarks, tree, tree-checkmarks](behavior-select.md) 
  * [dropdown-select](behavior-select-dropdown.md) - dropdown select and editable dropdown select
* date/time input 
  * [calendar](behavior-calendar.md) 
  * [date](behavior-date.md) 
  * [time](behavior-time.md) 
* containers 
  * [selection](behavior-selection.md) - HTML range selection
  * [form](behavior-form.md) 
  * [frame](behavior-frame.md) 
  * [frameset](behavior-frame-set.md) 
  * [pager](behavior-pager.md) - print and print preview frame
* outputs 
  * [output](behavior-output.md) 
  * [progress](behavior-progress.md) 
  * [video](behavior-video.md) 
  * [lottie](behavior-lottie.md) 
* lists
  * [virtual-list](behavior-virtual-list.md)
  * [expandable-list](behavior-expandable-list.md)
* menu 
  * [menu](behavior-menu.md) 
  * [menu-bar](behavior-menu-bar.md) 
* auxiliary 
  * [scrollbar](behavior-scrollbar.md)
  * [details](behavior-details.md)