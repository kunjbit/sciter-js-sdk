---
sidebar_position: 3
title: Storage.Index
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# class Storage.Index

Index object in persistent storage.

Indexes are by themselves persistable collections:

```js
storage.root = {
  version:1,
  notes: storage.createIndex("string") // note by id (string, GUID) index
}
```

## Properties

### length

integer, read-only, length of an index, number of items (objects) in the index. 

### unique

boolean, read-only, true if the index was declared as unique. 

### type

string, read-only, key type as it was declared at creation time. Read-only property.

## Enumeration

Indexes support `for(of)` enumeration style:

```js
// log all objects in the index 
for( let obj of index ) 
  console.log(obj);
```

Order of enumeration is ascending. 

:::tip
To enumarate index items in descending order use `index.select()`.
:::

## Methods

### set()

```js
index.set( key, obj [, replace: true|false ] ) : true|false
```

Inserts *obj* object into the index and associates it with the *key* value. Optionally, in-case of non-unique index, replaces it with existing object if such key is already present in the index and _replace_ is _true_.

### get()

```js
index.get( key ) returns: object | [objects...]
```

Returns object at the *key* position or null. *key* has to be of the same type as the type of the index object. If the index was created as non unique then the return value is an array - list of items under the key (array can be empty if no items under such key).

### delete()

```js
index.delete( key [,obj] ) returns: true | false
```

Method removes object *obj* by key from the index. Method returns true on success, otherwise false. If the index is unique, obj is optional.

### select()

```js
index.select( minKey, maxKey [, ascending [, startInclusive [, endInclusive]]] ) returns: Iterator.
```

returns selection in the Index based on min-key/ max-key criteria , ascent or descent order, start-inclusive, end-inclusive. 

parameters:

- _minKey_, _maxKey_ - of index type, min/max values of key to select;
- _ascending_ - boolean, _true_ if to enumerate items in ascending order, _false_ - in descending. Default value `ascending:true`.
- _startInclusive_, _endInclusive_ - boolean, _true_ if start/end of enumeration shall include _minKey_/_maxKey_ themselves.

This method is intended to be used in `for(of)` enumerations:

 ```js
for( const obj in index.select(minVal, maxVal) ) { 
  ... 
}
 ```

:::tip
_minKey_ or _maxKey_ can be *null* - means search from very first or very last key in the index.
:::

### clear()

```js
index.clear()
``` 

Removes all items from the index object - makes it empty.