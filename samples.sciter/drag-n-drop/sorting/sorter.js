

export function doDrag(element,evt,callback) {

  let {windowX:x,windowY:y} = evt;
  let lasttarget = null;

  let [ex,ey] = element.state.box("position","inner","window",false);
  x -= ex;
  y -= ey;

  function onmove(evt) { lasttarget = evt.target; }

  document.post(function() { 
    // 1. setup cursor by rendering element into bitmap and making cursor from that bitmap
    let image = new Graphics.Image(element);
    document.style.setCursor(image,x,y);

    // 2. hide the element itself
    //element.style.visibility = "hidden";
    element.classList.add("drag-source");
    
    // 3. short circuit mouse moves to document 
    document.state.capture(true);
    document.attributes["dnd"] = "";
    document.on("mousemove",onmove);

    // 4. run "mouse modal loop" until mouse depressed
    let r = Window.this.doEvent("untilMouseUp");

    // 5. return things back
    document.state.capture(false);
    document.off(onmove);
    document.style.setCursor(null);
    //element.style.visibility = undefined;
    element.classList.remove("drag-source");
    document.attributes["dnd"] = undefined;

    // 6. notify completion 
    if(r && lasttarget && callback) {
      const droptarget = lasttarget.$p(".drop-target");
      if( droptarget ) {
        callback(droptarget);
        return;
      }
    }
    callback(null);
  });

}

export function drag(container,el) {

  let over = el;

  const [elw,elh] = el.state.box("dimension","border");

  function onmove(evt) { 

    const scrollBox = container.box("clip","scroll");
    const contentPosition = evt.contentPosition;
    //console.log(contentPosition.y,scrollBox.top,scrollBox.bottom);

    if( contentPosition.y < scrollBox.top ) {
      container.scrollBy({top:-elh,behavior:"smooth"});
      return true;
    } else if( contentPosition.y >= scrollBox.bottom) {
      //console.log(contentPosition.y, y2);
      //container.scrollTo(scrollBox.left, contentPosition.y - scrollBox.height);
      container.scrollBy({top:elh,behavior:"smooth"});
      return true;
    } else if(el.state.animationType === "scroll") {
      console.log(el.state.animationType);
      return true;
    }
    
    const h = container.$(":root > :hover:not(.drag-source)");
    if(h && h !== over) {
      over = h;
      if( over.elementIndex > el.elementIndex ) {
        for( let i = el.elementIndex; i < over.elementIndex; ++i )
          replaceElement(container.childElement(i),true);
      } else {
        for( let i = el.elementIndex; i > over.elementIndex; --i )
          replaceElement(container.childElement(i),false);
      }
    }

    return true;
    
  }

  el.classList.add("drag-source");
  container.state.capture(true);
  container.on("^mousemove",onmove);

  let r = Window.this.doEvent("untilMouseUp");

  container.state.capture(false);
  container.off(onmove);
  el.classList.remove("drag-source");

}

function swap(nodeA, nodeB) {
    const parentA = nodeA.parentElement;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    // Move `nodeA` to before the `nodeB`
    nodeB.parentElement.insertBefore(nodeA, nodeB);
    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
};

export function replaceElement(el,dir) {

  let [w,h] = el.state.box("dimension","inner","parent");

  let a,b;

  if( dir ) {
    a = el;
    b = el.nextElementSibling;
  }
  else {
    a = el.previousElementSibling;
    b = el;
  }

  a.style.set { transform: "translate(0,-100%)" };
  b.style.set { transform: "translate(0,100%)" };

  swap(a,b);

  Window.this.update();

  a.style.set { transform: "translate(0,0)", transition: "transform 100ms linear" };
  b.style.set { transform: "translate(0,0)", transition: "transform 100ms linear"};

  a.once("transitionend", evt => a.style.removeProperties());
  b.once("transitionend", evt => b.style.removeProperties());
    
}


