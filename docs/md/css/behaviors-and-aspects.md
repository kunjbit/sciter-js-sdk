---
sidebar_position: 7
title: Behaviors and Aspects
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Declarative behavior assignment by CSS: `prototype` and `aspect` properties

Behavior, in Sciter sense, is a controller of a DOM element. JS based behaviors can be either

* classes extending Element class (class controllers), or
* free functions handling various UI aspects of an element.

## Class Controllers

Class Controllers allow to define new types of interactive UI elements.

Consider declaration of custom `<user-card>` element in your CSS:

```css
user-card {
  display: block;
  flow:vertical;
  prototype: UserCard url(users-ui.js); /* <<<< */
}
```
and 
```html title="HTML"
<user-card id="current-user" />
```
Sciter, while parsing and creating DOM, will load _users-ui.js_ file and create instance of _UserCard_ (or any other name of your choice) class for it.

That class shall extend built-in Element class and define needed methods, event handlers, etc.:

```js title="users-ui.js"
class UserCard extends Element {

  componentDidMount() { 
    // called with 'this' set to the DOM element 
    // being subclassed on DOM construction
    // Use this.content(), this.append(), etc. to define DOM of the element
  } 

  componentWillUnmount() {  
    // called when the element gets "declassed" - 
    // removed from the DOM or get subclassed by other class.
  } 
  // ... other specific methods and handlers here
}
```

It is being said that such defined `<user-card>` will behave as a DOM element of specific UserCard class, hence the _behavior_ term.

For more information see [DOM Components chapter](../DOM/Components); 

### The `prototype` CSS property

```css
prototype: class-name [url(file.js)];
```
where:
* _class-name_ - the name of JS defined class;
* _url(file.js)_ - url of a JS **module** file where the class is defined;

## Aspect functional controllers

The only problem with prototypes – at any given moment of time particular DOM element can have one and only one scripting class-controller. JavaScript do not support multiple inheritance.

Imagine that we may have multiple functions in script aimed to configure some DOM element to serve some specific functionality.
In other words each of such functions should add its own aspect (partial functionality) to the element it is called on. 

And here is why the _aspect_ mechanism in Sciter.

Let's consider the OnClickAspect implementation:

```js title="ui-helpers.js"
function OnClickAspect() {
  // adds onClick handler defined by "click" element attribute in html
  this.on("click", () => { 
    let attrClick = element.attributes["click"];  
    eval(attrClick); // evaluate the expression
  });
}
```
and 
```css title="ui-helpers.css"
*[onclick] {
  aspect : OnClickAspect url(ui-helpers.js);
}
```

These two pieces above do the following: "for any element with _onclick_ attribute defined add _click_ event handler that eval'uates content of onclick attribute".

### The aspect CSS property

```css
  aspect: function-name[( ...parameters... )] [ url(file.js) ];
```

where:
* _function-name_ - the name of JS defined function;
* _url(file.js)_ - url of a JS file where the function is defined;

:::info
The aspect CSS property has unusual inheritance: all rules that are applied to an element have their aspect functions invoked for the element.

So these two rules:
```css
[onclick] { aspect : OnClickAspect url(ui-helpers.js); }
[onchange] { aspect : OnChangeAspect url(ui-helpers.js); }
```
will cause both _OnClickAspect_ and _OnChangeAspect_ to be called for the element.
:::

#### Parametrized aspect definition

CSS can pass additional parameters to aspect function call:
```css
chart { 
  aspect: Donut(fill: #f00 #0f0 #00f, thickness:0.2 ) url(micro-charts.js); 
}
```
Such paramateres will be passed as an object with keys:  
```js
const params = {
  fill: [ Color.RGB(255,0,0), Color.RGB(0,255,0), Color.RGB(0,0,255) ],
  thickness: 0.2
};
Donut(params); // in fact as MicroChart.Donut.call(domElement,params);
```