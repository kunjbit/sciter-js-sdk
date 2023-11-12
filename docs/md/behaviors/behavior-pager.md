# behavior: pager

This element provides print and print preview functionality.

## Elements

These elements have behavior:label applied by default:

* `<frame type="pager">`
* `<frame|pager">`

## Attributes

* `src="url"` - url of document to print / preview;
* `page-template="url"` - url of page template document;

## Events

`pagination-start` - pagination did start.
`pagination-end` - pagination did end.
`pagination-page` - pagination of a page with `event.reason` number is complete.

## Propertie

### pages

```js
frame.pager.pages: integer
```
Read-only, number of pages

### pages

```js
frame.pager.page: integer
```
Read-write, current page

### document

```js
frame.pager.document: Document
```
Read-only, reference of loaded document to be printed.

### documentName

```js
frame.pager.documentName: string
```
Read-write, name of the document (can be seen in printing jobs queue)

## Methods

### loadFile()

```js
frame.pager.loadFile(docUrl:string [,templateUrl:string]) : boolean
```
Loads document and optionally template into the pager.

### loadHtml()

```js
frame.pager.loadHtml(html: ArrayBuffer | string , baseUrl : string [, templateUrl: string]) : boolean
```
Loads document from memory buffer or string and optionally template into the pager.

_baseUrl_ is used to resolve relative urls inside the _html_

### selectPrinterDialog()

Presents to the user system's "Select Printer" dialog and makes that printer as a current.

### selectDefaultPrinter()

Selects default system printer as a current.

### selectPrinter()

```js
frame.pager.selectPrinter(printerId : string)
```

Selects dprinter by its Id.

### printers()

```js
let printersList = frame.pager.printers();
```
Returns list (array) of printer definition structures:
```js
{
  id : string,
  name : string,
  shareName : string,
  comment : string,
  location : string,
  isDefault : boolean
}
```

### print()

```js
frame.pager.print([arrayOfPageNumbers]);
```

Starts printing of whole document or particular pages contained in _arrayOfPageNumbers_ (like `[1,3,5]`)

## Value

N/A

## Page Template

[TBD]