---
sidebar_position: 2
---


# HTML

Sciter's HTML parser, in general, follows HTML5 *language* syntax with extras:

## Syntax shortcuts

| Sciter | Regular HTML |
| ------ | ------------ |
| `<input #id />`    | `<input id="id" />`
| `<input .class />` | `<input class="class" />`
| `<input \|text />` | `<input type="text" />`
| `<input (name) />` | `<input name="name" />`

Multiple shortcuts can be combined together. This declaration 

```html
<button|radio(group).first>First option</button>
```

is an equivalent of 

```html
<button type="radio" name="group" class="first">First option</button>
```

_NOTE_ In Sciter, the space after the element is optional. Regular html and Sciter html can be mixed in the same document.

## Elements

Those are Sciter specific elements, most of them have a custom [behavior](../behaviors/README.md) assigned.

| Element | Description |
| ------- | ----------- |
| `<popup>` | popup element (preferred to be placed in `<head>`)
| [`<menu .context>`](../behaviors/behavior-menu.md)  | [context-menu styled](../CSS/properties#context-menu) element
| [`<menu .popup>`](../behaviors/behavior-menu.md)  | [context-menu styled](../CSS/properties#context-menu) element
| [`<plaintext>`](../behaviors/behavior-plaintext.md) | Multiline text editor
| [`<htmlarea>`](../behaviors/behavior-richtext.md) | WYSIWYG/richtext/html editor
| [`<frameset>`](../behaviors/behavior-frame-set.md) | child elements to be resizable window blocks
| [`<select|tree>`](../behaviors/behavior-select.md) | Tree-list select element, one of [behavior select](behaviors/README.md) types
| `<include src="some.html"/>` | Inserts HTML fragment file inplace.


## Attributes

| Attribute  | Description |
| ---------  | ----------- |
| `spellcheck` | true/false enable or disable spellcheck
| `selectable` | allow content selection (behavior)
| `novalue`    | synonym of `placeholder`

## Misc

:::warning
Attribute events (onclick..) in static HTML are not supported. (unless you implement method for it to work). But you can use them in JSX:
  ```js
  function func() {...}
  document.body.append(<button onclick={func}>Hello</button>);
  ```
:::

- Sciter allows the use of custom element tags, make sure to give them a default style.
- You can show popup with [`Element.popup`](../DOM/Element#popup).
- String `&platform-cmd-mod;` is replaced with `Ctrl/CMD...`
- [List of input elements](html-inputs)
