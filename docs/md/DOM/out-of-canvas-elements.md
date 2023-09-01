# Popup and "Airborn" Elements

Desktop UI and Web UI are different in size of "HTML canvas" - area where HTML is rendered. 
In Web UI HTML rendered in browser's tab that usually spans whole desktop. But desktop windows, where we render our HTML, are tend to  be smaller than that.

In Web UI, when we need to show some popup element, most of the time, it will fit in desktop wide canvas. But it is not so in desktop UI - windows are smaller and we may need to show popups outside of window box. 

That's why Sciter supports so called windowed popup elements. Examples of such popups:
* tooltips,
* dropdown list in `<select>`,
* dropdown calendar in `<input|date>`,
* context `<menu>`s and menu bars.
* custom popups and fly overs. 

## Tooltips

### Static tooltips

Simple text tooltips are defined by `title` attribute on elements that need them:

```html
<some title="text">
```

In Sciter tooltips may have richer content - with HTML inside. Such tooltips are defined by `tooltip` attributes:
```html
<some tooltip="this my <b>rich</b> toolto">
```

### Dynamic tooltips

In some cases you may need provide user with tooltip having dynamic content. In order to accomplish this you may handle `"tooltiprequest"` event in your component:

```js
class Component extends Element {
  cnt = 0;

  ["on tooltiprequest"](evt) {
    evt.source = Element.create(<popup>shown {++this.cnt} times</popup>);
    return true; // handled
  }
}
```

### Styling tooltips

Tooltips are created as `popup` elements with role="tooltip" attribute set. Therefore you can style them as 

```css
popup[role="tooltip"] { 
  background:gold;
  padding: 1em; 
  ...
}
```
If you need tooltip rendering specific to particular element use selector with child combinator:
```css
some > popup[role="tooltip"] { ... }
```

## Context `<menu>`s

Context menu is quite a popluar feature in desktop UIs and so Sciter has support for them. 

In order to define context menu for your component provide `"contextmenu"` event handler: 

```js
class Component extends Element {

  ["on contextmenu"](evt) {
    evt.source = Element.create(<menu.context>
      <li.first>First action</li>
      <li.second>Second action</li>
    </menu>);
    return true; // handled
  }
  // menu item click handler
  ["on click at menu.popup > li.first"]() {
    ...
  }
}
```

:::tip
You may define event handlers inline too:
```js
  ["on contextmenu"](evt) {
    evt.source = Element.create(<menu.context>
      <li onclick={() => this.doFirst()}>First action</li>
      <li onclick={() => this.doSecond()}>Second action</li>
    </menu>);
    return true; // handled
  }
```
:::

## Popup elements

Popup elements are shown in so called "mouse modal mode" - your code just initiates their apperance. Popup elements are closed automatically when the user clicks somewhere outside of them or when the application looses focus.

To initiate popup appearance in your code use [Element.popup()](Element#popup) function, example:

```js
function PopupAwatar({user}) {
   return <popup.awatar> 
     <picture src={user.awatarUrl} />
     <caption>{user.fullName}</caption> 
   </popup>
}

element.popup(Element.create(<PopupAwatar user={...}/>),{options});
```

Popup elements can be styled as any others, for example with style sets:

```js
function PopupAwatar({user}) {
   return <popup.awatar styleset={__DIR__ + "awatar.css#popup"}> 
   </popup>
}
```

:::tip
popup positioning can be defined in CSS by [popup-position](../CSS/properties#popup-position)
::: 

### Popup life-cycle events

* "popup-request" - evt.source is the popup element that is about to be shown, sent to popup anchor/owner element.
* "popup-ready" - evt.source is the popup element when it is shown. 
* "popup-dismissing" - evt.target is the popup element, sent to the popup before its destruction.
* "popup-dismissed" - evt.target is the popup owner element, sent after the popup destruction.

## Airborn elements

Airborn elements are also windowed DOM elements but have determined lifetime: you create and hide them explicitly in your code using [`element.takeOff({options})`](Element#takeoff) method.

Example, showing the element as airborn:
```js
element.takeOff({
  x:posX,
  y:posY,
  relativeTo:"window",
  window:"attached"
});
```
Example, "landing back" the airborn element: 

```js
element.takeOff();
```
