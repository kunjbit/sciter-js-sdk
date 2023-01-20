
// runs drag-n-drop loop:
//  element - the draggable
//  targetSelector - the drop target selector
//  evt - mousedragrequest event
//  callback - function(dropTargetElement[, Point]) 
//             dropTargetElement can be null if D&D was cancelled, e.g. by Escape
export function performDrag(element, targetSelector, evt, callback) {

  let windowPosition = evt.windowPosition;
  let lasttarget = null;

  let dropWindowPosition;
  function onmove(evt) { 
    lasttarget = evt.target; 
    dropWindowPosition = evt.windowPosition; 
  }

  document.post( function() { 
    // 1. setup cursor by rendering element into bitmap and making cursor from that bitmap
    let image = new Graphics.Image(element);

    //windowPosition  
    const elementWindowPosition = element.box("inner","window").origin;
    const offset = (windowPosition - elementWindowPosition) * devicePixelRatio;

    document.style.setCursor(image,offset.x, offset.y);

    // 2. hide the element itself
    element.style.visibility = "hidden";
    
    // 3. short circuit mouse moves to the document
    document.state.capture(true);
    document.attributes["dnd"] = "";
    document.on("mousemove",onmove);

    // 4. run "mouse modal loop" until mouse depressed
    let r = Window.this.doEvent("untilMouseUp");

    // 5. return things back
    document.state.capture(false);
    document.off(onmove);
    document.style.setCursor(null);
    element.style.visibility = undefined;
    document.attributes["dnd"] = undefined;

    // 6. notify completion 
    if(r && lasttarget && callback) {
      const droptarget = lasttarget.$p(targetSelector);
      if( droptarget ) {
        //dropWindowPosition
        const position = dropWindowPosition 
                        - droptarget.box("inner","window").origin 
                        + droptarget.scrollPosition;
        callback(droptarget,position);
        return;
      }
    }
    callback(null); // to indicate cancelled D&D
  });

}

/*document.$(".draggable").on("mousedragrequest", function(evt) {
  doDrag(this,evt, where => {
    if(where)
      Window.this.modal(<info>Dropped {this} onto {where}</info>);
  });
  return true;
});*/
