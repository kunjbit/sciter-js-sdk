---
sidebar_position: 10
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Components and Aspects

CSS assignable scripting behaviors - DOM element controllers.

Sciter allows to define custom elements by using [prototype CSS property](../CSS/behaviors-and-aspects#class-controllers).

The _prototype_ property expects custom class derived from built-in Element. 
```js
class MyComponent extends Element {
  constructor() {}
  componentDidMount() {}
  componentWillUnmount() {}
}
```

## Custom Class Components

:::info  
This protocol deliberately shares functionality with [Reactor components](../Reactor/component-lifecycle). This allows to design classes that may work as DOM Components as Reactor Components.
:::

### Methods

These methods have special meaning

#### constructor()

In case of DOM Component the constructor is called without parameters. 

At the moment of call _this_ is just an object and does not connected to real DOM element.

#### componentDidMount()

Called without parameters immediately after _this_ was connected to real DOM element. 

At this point of time all methods of [Element](Element) class are available and operational.

Component may wish to populate/update internal DOM structure by using explicit DOM creation methods or by using JSX:

```js
class Hello extends Element {
  componentDidMount() {
    this.content(<>
      Hello <b>World</b>
    </> );
  }
}
```
#### componentWillUnmount()

Called without parameters immediately before _this_ is disconnected from the DOM element. 

At this point of time all methods of [Element](Element) class are still available and operational.

The engine will call componentWillUnmount() in two circumstances:

* when the element is removed from the DOM, or
* when CSS _prototype_ property on the element changes to a different class.

### Event handlers

To handle events in components simply define them as methods with special "event" notation:

```js
["on eventname [at selector]"] (event [,target]) {
}
```
where :
* _eventname_ - an event name like: _click_, _mousedown_, etc.
* _selector_ - optional, CSS selector to filter events from particualr children matching the selector;
* _event_ - name of argument that will receive [Event](Event) instance of the event;
* _target_ - optional, if the _selector_ is used, will receive the element matching the _selector_;

Examples: 

```js

lass Hello extends Element {
  componentDidMount() {
    this.content(<>
      <label>Name</label><input|text.name/>
      <button.update>Update</button>
    </> );
  }
  ["on click at button.update"] () {
     ... 
  }
  ["on change at input.name"] (evt, input) {
     let name = input.value; 
     ... 
  }
}
```
:::tip
_selector_ supports `:root` selector that designates the component DOM element itself.
So to select exactly immediate child use selector like this: `:root > button`.
:::

## Custom Aspect Functions

Aspects are plain JS functions that are called on selected DOM element by request of CSS and its [aspect CSS property](../CSS/behaviors-and-aspects#aspect-functional-controllers).

There is nothing special about aspect functions except of:

* _this_ - the aspect function is called with _this_ set to the DOM element;
* The function is called when the element is mounted so _this_ is operational instance of Element class;
* The function is called once in life time of the element;
* The function may receive [parameters from CSS](http://localhost:3000/docs/CSS/behaviors-and-aspects#parametrized-aspect-definition);
* The function may modify content of the element by using explicit DOM manipulation functions of Element class as JSX;
* The function may setup event handlers on the element itself and its children;

Example:

```css title="micro-charts.css"
chart {
  display:block;
  size:64px;
}
chart.donut { 
  aspect: Donut(fill: #f00 #0f0 #00f, thickness:0.2 ) url(micro-charts.js); 
}
```
Such paramateres will be passed as an object with keys:  
```js title="micro-charts.js"
function Donut({fill,thickness}) {
  // fill will be [ Color.RGB(255,0,0), Color.RGB(0,255,0), Color.RGB(0,0,255) ]
  // thickness will be 0.2
  this.paintContent = function(gfx) {
    ... code to draw donut chart here ...
  }
}
```
