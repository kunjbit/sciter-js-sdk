# Clipboard namespace

Includes functions dealing with system clipboard. 

## Methods:

### read()

```js
Clipboard.read():ClipboardDataObject
```

returns [object containing clipboard data](#clipboard-data)

### readText()

returns either string or _undefined_ if clipboard does not contain textual data.

### write()

```js
Clipboard.write(data:ClipboardDataObject):boolean
```

Puts [data](#clipboard-data) into clipboard.  

### writeText()

```js
Clipboard.writeText(string):boolean
```
Puts the string into clipboard.  

### has()

```js
Clipboard.has(type:string):boolean
```
Checks if clipboard contains data of given _type_: "text" | "html" | "image" | "file" | "json" | "link".

## Clipboard Data Object {#clipboard-data}

Clipboard data object is a plain JS object that may contain following properties:

* `text`: string - text;
* `html`: string - html fragment;
* `json`: value - arbitrary JSON data;
* `file`: [path0,path1, ...] - list of file paths;
* `link`: { caption: string, url: string} - link to some file / location;
* `image`: Graphics.Image - image object;

