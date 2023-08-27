---
sidebar_position: 7
title: Storage
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Storage and Storage.Index classes provide built-in data persistence - transparent data storage and retrieval using just JavaScript means.

[Introduction](introduction.md) and usage manual.

[Architecture](architecture.md) explained.

# class Storage

Represents persistent storage.

## Properties

### `root`

object, root object in the storage. Read/write property.

## Methods

### open()

```js
Storage.open(filename : string [,allowWrite: true] ) : storage | null
```

Static method. Opens storage and returns an instance of Storage object. If *allowWrite* is *false* then storage is opened in read-only mode. 

### close()

```js
storage.close()
```

Closes underlying Storage. Commits all data before closing. After closing the storage all persistent objects that are still in use are set to non-persistent state.


### commit()

```js
storage.commit()
````

Commits (writes) all persistent objects reachable from its root into storage. Does not close the storage.

:::tip
Use this method after complex or critical data modifications.
:::

### createIndex()

```js
storage.createIndex(type : string [, unique: bool]) returns: Index | null
```

Creates an index of given type and returns the index object. Index can have unique or duplicated keys depending on _unique_ argument.

parameters:
- _type_, string, one of:
  + "integer" - int32 keys
  + "long" - int64 keys
  + "float"
  + "date" 
  + "string" 
- *unique*, boolean, if _true_ then the index supports only unique keys. Default value for  is *true*.

### registerClass()

```js
storage.registerClass(cls)
```

Registers class (a.k.a. constructor function in terms of ES5) of persistable objects.

When an object is stored into DB, name of its class is also stored. When the object is fetched from the DB, it gets the class assigned automatically if that class was registered before.


