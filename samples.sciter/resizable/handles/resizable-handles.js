
export function Resizable({handleSize}) {

  handleSize = handleSize?.valueOf() ?? 3;

  let handles = [{numpad:1},{numpad:2},{numpad:3},{numpad:4},{numpad:6},{numpad:7},{numpad:8},{numpad:9}];
  let currentHandle = null;
  let isResizing = false;
  let mouseDownPos;

  const replaceHandles = () => {
    const box = this.box("border");
    function replace(handle) {
      const center = box.pointOf(handle.numpad);
      handle.box = Graphics.Rect(center) >> handleSize;
    }
    for(const handle of handles)
      replace(handle);
  };

  this.paintOutline = gfx => {
    replaceHandles();
    gfx.fillStyle = "#007f00";
    gfx.strokeStyle = "#000000";
    gfx.strokeWidth = 1;
    for( const h of handles) {
      gfx.fillRect(h.box);
      gfx.strokeRect(h.box);
    }
    if(currentHandle) {
      gfx.fillStyle = "#00ff00";
      gfx.fillRect(currentHandle.box);
      gfx.strokeRect(currentHandle.box);
    }
  }

  this.on("mousedown.resizable", evt => { 

    mouseDownPos = evt.position;
    this.state.capture(true);
    isResizing = true;
    Window.this.doEvent("untilMouseUp");
    isResizing = false;
    this.state.capture(false);
    return true;
  });

  this.on("^mousemove.resizable", evt => { 
  
    if(isResizing) {
      let {left,top,right,bottom} = this.box("border","parent");
      let pos = evt.position;
      switch(currentHandle?.numpad) {
          // resizing
        case 1: left += pos.x; bottom = top + pos.y; break;
        case 2: bottom = top + pos.y; break;
        case 3: right = left + pos.x; bottom = top + pos.y; break;
        case 4: left += pos.x; break;
        case 6: right = left + pos.x; break;
        case 7: left += pos.x; top += pos.y; break;
        case 8: top += pos.y; break;
        case 9: right = left + pos.x; top += pos.y; break;
        default: {
          // moving
          left += pos.x - mouseDownPos.x;
          top += pos.y - mouseDownPos.y;
          this.style.set({top:Length.px(top),left:Length.px(left)});
          Window.this.update();
          return true;
        }
      }
      this.style.set({top:Length.px(top),left:Length.px(left), width: Length.px(right - left), height: Length.px(bottom - top)});
      Window.this.update();
      return true;
    }
    else {
      let current = null;
      const pos = evt.position;
      for(const h of handles) {
        if(h.box.contains(pos)) { current = h; break; }
      }
      if( current !== currentHandle ) {
        currentHandle = current;
        this.requestPaint();
      }
    }
    return false; 
  });
  
}

Resizable.detached = function() {
   this.off(".resizable");
}

