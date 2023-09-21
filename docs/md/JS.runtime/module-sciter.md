---
sidebar_position: 1
---

# module `@sciter`

The module contains Sciter specific functions.

Constants and functions from this module can be exported and used individually:

```js
import {on,off,once} from "@sciter";

on("click", event => {...});
```
or as a namespace:

```js
import * as sctr from "@sciter";

sctr.on("click", event => {...});
```

## Constants

### VERSION

String, readonly, current engine version in the form "X.X.X.X";

### REVISION

String, readonly, SVN build revision;

### QUICKJS_VERSION

String, readonly, QuickJS version

## Functions

### import()

```js
sctr.import(path:string):object
```

That is a synchronous equivalent of standard JS [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports), so it can be used synchronously as

```js
const module = sctr.import('my-module.js');
```

That above is essentially a dynamic equivalent of static _import_ statement in JS:

```js
import * as module from 'my-module.js';
```

For more information, check the `samples.sciter/runtime` demo.

### setModuleUrlResolver()

```js
sctr.setModuleUrlResolver(func):string|false
````

Set url resolver for names in `import ... from "name"`.

The function is expected to have the following signature:

```js
function resolver(name:string, documentDir:string, srcDir:string) {}
```

and to return a string with **fully qualified absolute url** of the module to load. Example:

```js
// NPM style module resolver:
sctr.setModuleUrlResolver((name,documentDir)=>{
  return `${documentDir}node_modules/${name}/index.js`;
});
```

### loadLibrary()

```js
sctr.loadLibrary("name"): any
```

Loads Sciter extension native library (dll,so,dylib). 

The "name" is the name of DLL without extension. 

The dll shall reside in the same folder as app executable. See /sqlite project that can be used to produce sciter-sqlite extension dll.

### parseValue()

```js
sctr.parseValue(string): any
```

Parses _string_ value by "JSON++ rules", here are valid inputs:

* `"true"` -> _true_ value;
* `"null"` -> _null_ value;
* `"1234"` ->  Numeric value 1234;
* `"0xFF"` ->  Numeric value 255 (hex);
* `"2021-12-01"` -> date 2021-12-01 (in ISO format);
* `"12px"` -> value of Length class;
* `"1rad"` -> value of Angle class;
* `"{name1:val1, name2:val2,...}"` -> object value;
* `"{some-name1:val1; some-name2:val2; ...}"` -> CSS kind of object value;
* `"[val1, val2, ...]"` -> array;

### devicePixels()

```js
sctr.devicePixels(length: int | string[,axis])
```
   
Converts _length_ to device (screen) pixels:

- _length_ can be integer - number of dips (a.k.a. "CSS pixels")  
- or a string like "2in" to get number of screen pixels in 2 inches of a ruler placed on screen.
- _axis_ is either "width" or "height", note axis parameter makes sense only for devices that have different resolution on x/y axis.


### on()

```js
sctr.on(eventname: string, [selector: string,] handler: function) : eventTarget
```

jQuery style event subscription, parameters:

- *eventname* - string, name of event that 
  + may start with `^` for handling events in capturing phase;
  * may contain namespace part: `"click.myns"`;
- *selector* - string, optional, CSS selector of target element; 
- *handler* - function(evt,target), event handling function that:
  + is called with `this` set to element the element this handler is attached to;
  + is called with two parameters `handler(evt,matchedElement)` - event and the element matching the *selector* if it was given;

returns:
- an event handler that allows to chain `on` calls;


### off()

```js
sctr.off(eventname): eventTarget
```
Unsubscribe event handlers either by name  `"click"` or by namespace `".myns"`.

```js
sctr.off(handler: function): eventTarget
```
Unsubscribe event handlers by function reference.

### once()

```js
sctr.once(eventname: string, [selector: string,] handler: function): eventTarget
```
Same as `sctr.on()` but calls `sctr.off(handler)` after handling the event once.

---

### onGlobalEvent()

```js
sctr.onGlobalEvent(eventname: string, handler: function): eventTarget
```

event subscription to application wide events (a.k.a. "global events"):

parameters:  
- *eventname*, string, arbitrary event name, may contain namespace part: `"click.myns"`;
- *handler*, function,
  * the handler is called with `this` set to the element;
returns
- element itself allowing to chain `onGlobalEvent` calls.

:::tip
The handler gets unsubscribed automatically when the document gets unloaded making offGlobalEvent() call optional.  
:::

Global events can be sent or posted by static [Window.send(event)](../DOM/Window#Window-send) and [Window.post(event)](../DOM/Window#Window-post) and are delivered to all subscribers in all windows of the application.


### offGlobalEvent()

```js
sctr.offGlobalEvent(eventname: string): eventTarget
```
Unsubscribe event handler by event name (like `"click"`) or by namespace (like `".myns"`).

```js
sctr.offGlobalEvent(handler: function): Element
```
Unsubscribe event handler by its reference.

---

### $()

```js
sctr.$("selector"): Element
```

Returns first matched DOM element in current document.

### $$()

```js
sctr.$$("selector"): array(Element)
```

Returns list (array) of matched DOM elements.

---

### uuid()

```js
sctr.uuid():String
```

Returns [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier) as a string.

### encode()

```js
sctr.encode(text:string, [encoding:string="utf-8"]):arrayBuffer
```

Encodes text to sequence of bytes (ArrayBuffer). Default _encoding_ is "utf-8".

_encoding_ here is [IANA encoding](https://www.iana.org/assignments/character-sets/character-sets.xhtml) identifier

### decode()

```js
sctr.decode(bytes:arrayBuffer, [encoding:string="utf-8"]):String
```
Decodes sequence of bytes in the buffer to string. Default _encoding_ is "utf-8".

### compress()

```js
sctr.compress(in:arrayBuffer,[method]):arrayBuffer
```

returns compressed _in_ buffer.

_method_ is one of "gz","gzip" or "lzf" (default).

### decompress()

```js
sctr.decompress(in:arrayBuffer,[method]):arrayBuffer
```
Returns decompressed _in_ buffer.

_method_ is one of "gz","gzip" or "lzf" (default).

### toBase64()

```js
sctr.toBase64(in:arrayBuffer):string
```
Returns string - base64 encoded _in_ buffer.

### fromBase64()

```js
sctr.fromBase64(in:string):arrayBuffer
```

Restores array buffer from base64 encoded string.

### md5()

```js
sctr.md5(in:arrayBuffer):string
```

Returns md5 digest (a.k.a. hash) of the _in_ data.

### crc32()

```js
sctr.crc32(in:arrayBuffer):integer
```

Returns crc32 hash of the _in_ data.

