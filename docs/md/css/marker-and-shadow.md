---
sidebar_position: 6
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Pseudo Elements ::marker and ::shadow

Together with standard `::after` and `::before` pseudo elements Sciter supports `::marker` and 
`:shadow` pseudos.

The main difference of `::marker` and `::shadow` is that they supposed to be used as _block_ elements assosicated with the element. These elements are replaced as if their container uses `flow:stack` layout and the pseudos themselves are `display:block`. Therefore margins can be used to position them: 

```css
div { 
  size: 64px; 
  border:3px solid blue;
}
div::marker { 
  size:32px; 
  margin: 0 * * 0; /* attached to top-left corner */
  background: rgba(255,0,0,0.5);
  z-index:1; /* on top of content layer */
}
```

Such pseudo elements can cover their host element in full if the following is used:

```css
div::marker { 
  size:*; /* covers whole padding box */
  background: rgba(255,0,0,0.5);
  z-index:1; /* on top of content layer */
}
```

`::shadow` and `::marker` provide similar functionality. You can use them both if you need two additional layers out of element's DOM.

## Shadow DOM

In some cases you may want to design compound componet with non-trivial content outside of the DOM of host document. We can use [prototype](properties#prototype) property for that:

```css title="css"
div::shade { 
  size:*; /* covers whole padding box */
  prototype: MyShadow url(shadow.js); 
}
```
```js title="shadow.js"
class MyShadow extends Element {
   componentDidMount() {
     // note 'this' here is a shade pseudo element 
     this.content(<>
        <h1>This is shadow DOM!</h1>
        <div> 
          ... some complex content ...
        </div>
     </>);
   }
}
```
Content of ::shade sub-element can be styled separately using style sets:

```css title="css"
div::shade { 
  style-set: MyShade;
}

@set MyShade {
  :root { ... } /* style of ::shade itself */
  :root:hover { ... } /* style of ::shade itself */
  /*... other rules for children go here */
}
```
