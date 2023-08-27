---
sidebar_position: 4
title: Style Sets
toc_min_heading_level: 2
toc_max_heading_level: 5
---
# Style Sets

Style set is a named set of style declarations – it is a system of selectors and style definitions that are applied as a whole.

Essentially style sets are scoped style modules.

## Style Set Declaration

Style set declaration is an at-rule with syntax similar to `@media` sections: 

```css
@set name [< parent-set-name] {
  /* content rules: */
  :root { ... }
  :root > child { ... }
  child { ... }
  ...
}
```

Element that has style set applied (hosts the set) is a root of the set - can be selected in style set using `:root` selector. 

Rules inside SS can be applied only to the host element and its children.

### Inheritance

Style sets support inheritance using `@set name < parent-set-name {...}` declaration form. In this case new set with the _name_ initially gets all rules from _parent-set-name_ set and its own rules are getting appended to the list.

:::info
Rules inside the set use normal CSS specificity calculation. More specific rules applied after less specific. Inherited rules and self defined rules are not different in this respect - more specific inherited rule may override less specific self defined rule.  
:::

## Style Set Application

Sets can be applied to host elements these ways:
* by CSS
* by HTML
* by JS/JSX

### CSS Application

Style set can be attached to particular elements using [style-set property](properties#stylesets) in CSS:

```css
selector {
  style-set: set-name [url(file.css)];  
} 
```

If _url(file.css)_ is provided it gets loaded on demand and a set is looked up by _set-name_ there. 

### HTML Application

Style sets can be applied to elements using `styleset` attribute:

```html
<div styleset="styles.css#set-name">
  ... content styled by SS ...
</div> 
```

The `styleset` accepts url of CSS file where the set is defined and an anchor (after `#`) that is a name of that `@set` in that file.

### JS/JSX Application

Style sets can be applied in JSX templates using the same _styleset_ attribute:

```js

render() {
  return <div styleset={__DIR__ + "styles.css#set-name"}>
    ...
  </div>
}
```
:::note
`__DIR__ + ...` prefix above is required to make absolute url of that CSS file. It combines url of this .js file with the "styles.css#set-name" relative url.
:::

#### JS/JSX resident CSS declarations

Style sets can be defined locally in js files instead of external CSS files. You may want such local style definitions when designing single JS file based components.

JS/JSX resident style set are declared by using built-in `CSS.set()` function. That function supports [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) usage:

```js
const styleSet = CSS.set`
  :root { ... }
  :root > child { ... }
  child { ... }
  ...
`;
```
:::note
This defines anonymous style set - no _name_ and `{`  `}` brackets are used. The style set gets compiled and stored in the _styleSet_ (or any other) JS variable.
:::

Such code resident style set can be applied by using the same _styleset_ attribute: 

```js

render() {
  return <div styleset={styleSet}>
    ...
  </div>
}
```

## Overriding Style Set Rules from Outside

Rules of style sets are applied on top other rules. To override properties defined in style sets use `!important` in normal style rules:

```css title="<style>"
@set TestSet {
  :root { 
   color:red; 
   background:gold;
  }
}

div {
   style-set: TestSet; 
   color:green !important; /* #1 */
   background:red;         /* #2 */
}
```
Rule #1 will change the color and #2 will NOT change the background here:
```html 
<body>
  <div>This should be green text on gold background</div>
</body>
```
