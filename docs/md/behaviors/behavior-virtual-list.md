# behavior: virtual-list

This helper behavior implements logic of "sliding window" scrollable list.

It is used to present to a user potentially large set of records in a list. This behavior uses always fixed number of DOM elements in sliding window.


## Elements

By default the behavior is not applied to any element - you should assign it explicitly in CSS:

```
div.list {
  behavior:virtual-list;
  overflow-y:scroll;
}
```

## Attributes

N/A.

But the behavior uses `vertical-align: top | bottom` CSS property to determine initial rendering. If it is `vertical-align: bottom` then 
the list initially appears scrolled to the end.

## Events

Together with the standard set of events (mouse, keyboard, focus) *behavior: virtual-list* generates:

* `"contentrequired"` - generated when the behavior needs more elements due to scrolling.

`event.data` contains the following structure

```
{ 
  where:int   // 0 - to replace current content, -1 - to add before first element, 1 - to add after last element
  start:int,  // index of first record
  length:int, // that number of records required to be added or replaced by script.
}
```

By handling the event the script shall populate requested number of elements and return the follwing object
in the data field:

```
{
  morebefore: int, // estimated number of items before the buffer start
  moreafter: int // estimated number of records after the buffer end
}
```
This information is used to setup scrollbar appropriately. 


## Value

N/A

## Methods

### navigateTo()

```js
element.vlist.navigateTo(to: int | string)
``` 
scroll to given record, where `to` is either:

+ integer - absolute record number;
+ "start" - very first record;
+ "end" - very last record;
+ "pagenext" - next page;
+ "pageprior" - previous page;
+ "itemnext" - next record;
+ "itemprior" - previous record;

### advanceTo()

```js
element.vlist.advanceTo(recNo: int) : Element`
```  
scroll to given record number. By default it performs animated scroll.

Returns DOM element representing the record.

### scrollBy()

```js
element.vlist.scrollBy(pixels) : boolean`
```  
scroll by given number of CSS pixels. By default it performs animated scroll.

Returns true if actuall scroll occured.

## Properties

### firstVisibleItem

```js
element.vlist.firstVisibleItem: Element
```
read-only, reference of first visible item in the buffer.

### lastVisibleItem

```js
element.vlist.lastVisibleItem: Element
````  
read-only, reference of last visible item in the buffer.

### firstVisibleItemIndex

```js
element.vlist.firstVisibleItemIndex: Element
```
read-only, index of first visible item in the recordset.

### lastVisibleItemIndex

```js
element.vlist.lastVisibleItemIndex: int
````  
read-only, index of last visible item in the recordset.

### firstBufferIndex

```js 
element.vlist.firstBufferIndex: int
````
read-only, that many of records expected before first element in the sliding buffer.

### lastBufferIndex
  
```js 
element.vlist.lastBufferIndex: int
```
read-only, firstBufferIndex - lastBufferIndex + 1 is the current size of sliding window.

### itemsBefore

```js
element.vlist.itemsBefore: int
````
  
read-write, how many items were reported before the buffer (sliding window).

:::tip
Assign new value to the itemsBefore/After when new records appeared before/after the sliding window.
:::

### itemsAfter

```js
element.vlist.itemsAfter: int`
```
read-write, how many items were reported after the buffer (sliding window).

### itemsTotal

```js
element.vlist.itemsTotal: int
````
read-only, how many items, are in total (itemsBefore + element.children.length + itemsAfter) .

### slidingWindowSize

```js
element.vlist.slidingWindowSize: int`
```
read-write, how many items (DOM elements) are in the sliding window.

:::tip
Ideally it should be twice as large of number of expected visible items (DOM elements representing each record) 
:::
