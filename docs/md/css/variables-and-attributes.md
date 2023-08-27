---
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Variables and Attributes

## CSS Variables

### Declaration

Sciter supports variable declarations in two forms:

* `--name : ...` - default CSS variable declaration form;
* `var(name) : ...` - Sciter's, ergonomic form;

Examples:

```css
body {
  var(text-color): #000;
  var(base-width): 100px;
  /* 4.4.8.0+ */
  --text-color: #000;
  --base-width : 100px;
}
```

### Usage

Variables are inherited from a parent to a child. 

Variables can be used in other property value declarations - all places where string, color or length units are expected by using either:

- `var(name,defaultValue)` - substitutes the declaration by _defaultValue_ if _name_ not declared;
- `length(name)` - Sciter's length variable specialization form;
- `color(name)` - Sciter's color variable specialization form;

Examples of variable use:

```css
div {
  color: color(text-color);  /* #000 */
  width: length(base-width); /* 100px */
  height: var(base-height,80px); /* 80px as base-height was not defined */
  font-size: var(--base-width); /* 100px */
}
```

## CSS Attributes

### attr(name) declaration

In Sciter you can define default values of attributes in CSS for matching DOM elements using `attr(name) : "..."` declarations: 
```css
select div {
  attr(role) : "option";
}
```
Declarations like these allow to eliminate repeatable declarations in HTML as this:
```html
<select|list> 
  <div role="option">...</div>
  <div role="option">...</div>
  ...
</select>
```

:::note 
CSS based DOM attribute declarations is purely a Sciter feature, standard CSS does not provide anything close. 
:::

### attr(name) usage

The `attr(name)` "function" can also be used as a value of _content_ property and as a value of other attr(name) declarations.

If you have 
```html
<button value="Press me!" />
```
then with the style

```css
  button {
    content: attr(value);
  }
```
You will have the button rendered with "Press me!" text.

:::note
Sciter also supports `parent-attr(name)` value function that gets value of attribute _name_ from parent element.
:::
