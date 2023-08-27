---
sidebar_position: 5
title: CSS
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# CSS namespace

This namespace object contains CSS helper functions.

## Methods:

### `CSS.supports(prop,value):bool`

Reports if the engine supports given property name and value.

### getComputedStyle()

```js
CSS.getComputedStyle(element[, pseudoEl]): Style
```

The method gets the computed CSS properties and values of an element. The computed style is the style used on the element after all styling sources have been applied.

:::note
This function can be used without `CSS.` prefix - as a global one.
:::


### `CSS.set(string):StyleSet`

Sciter specific, StyleSet constructor.

This function allows to construct style set objects at runtime. Primary purpose is to be used in Reactor components to define component styles in the same JS file as the component itself:

```js 

const h = 64;

const myStyles = CSS.set`
  :root { // the component itself
     width: 100px;
     height: ${h}px;
  }
  :root > span {
     color:red;
  } 
`;

class MyComponent extends Element {
  render() {
    return <div styleset={myStyles}>
       Hello <span>embedded</span> CSS
    </div>
  } 
}

```
Content of CSS.set literal is normal `@set`  declaration but without `@set name` preambula and without enclosing `{`,`}` brackets.