

function isHorzFrameset(el) { return el && el.tag == "frameset" && el.attributes.getNamedItem("cols"); }
function isVertFrameset(el) { return el && el.tag == "frameset" && el.attributes.getNamedItem("rows"); }
function isTabsFrameset(el) { return el && el.tag == "frameset" && el.attributes.getNamedItem("tabs"); }

const MARKER_SIZE = 36;
const MARKER_SIZE2 = MARKER_SIZE / 2;      
const MARKER_LEFT   = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 10 1 V 31 H 31 V 1 Z");
const MARKER_RIGHT  = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 1 V 31 H 22 V 1 Z");
const MARKER_TOP    = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 10 V 31 H 31 V 10 Z");
const MARKER_BOTTOM = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 1 V 22 H 31 V 1 Z");
const MARKER_MIDDLE = new Graphics.Path("m 0 0 V 32 H 32 V 0 Z m 1 7 V 31 H 31 V 7 Z M 16 1 V 6 H 31 V 1 Z");

const WINDOW_WIDTH = 300;
const WINDOW_HEIGHT = 300;

export class Dock extends Element {

  dropLocation = null;
  targetDockable = null; // target dockable

  constructor(props,kids) {
    super();
    this.props = props;
    this.kids = kids;
    globalThis.showWidget = cls => this.showWidget(cls);
  }

  showWidget(widgetClass) {
    // show widget as a window in the middle of the window
    const [w,h] = this.state.box("dimension");
    const x = (w - WINDOW_WIDTH) / 2;
    const y = (h - WINDOW_HEIGHT) / 2;
    let dockable = <DockPanel.window.detached widgetType={widgetClass}/>;
    let list = this.$("popup.windowed");
    list.append(dockable);
    dockable = list.lastElementChild;
    dockable.style.set({width:Length.px(WINDOW_WIDTH),height:Length.px(WINDOW_HEIGHT)});
    dockable.takeOff({x,y, window:"detached", relativeTo:"window"});
    // notify observers:
    widgetClass.shown = true;
    Window.post(new Event("widget-new"));
  }

  doDrag(dockable, xElement,yElement,xOff, yOff) {

      const me = this;

      function onmousemove(evt) {

        const x = evt.screenX - xOff;
        const y = evt.screenY - yOff;

        this.takeOff({ x, y, relativeTo: "screen", window: "detached" });

        me.handleDrag(evt);
        return true;
      }

      let parent = dockable.parentElement;

      //console.log("DD", dockable, dockable instanceof DockPanel);

      let list = this.$("popup.windowed");
      list.append(dockable);
      dockable.classList.add("window","dragging");

      dockable.on("mousemove",onmousemove);
      dockable.state.capture("strict");

      //console.log(parent);
      if(parent !== this && parent.tag == "frameset" && parent.childElementCount == 1) {

        //setup default dimensions of element that will be reparented
        if(isHorzFrameset(parent.parentElement)) {
          const w = parent.firstElementChild.state.box("width");
          parent.firstElementChild.style.set({
            width: Length.px(w),
            height: Length.fx(1) 
          });
        }
        else if(isVertFrameset(parent.parentElement)) {
          const h = parent.firstElementChild.state.box("height");
          parent.firstElementChild.style.set({
            height: Length.px(h),
            width: Length.fx(1) 
          });
        }
        // remove <frameset> that has just one child
        parent.unwrapElement();
      }

      dockable.takeOff({x:xElement,y:yElement,window:"detached", relativeTo:"screen"});
      
      this.paintForeground = this.paintMarkers;

      Window.this.doEvent("untilMouseUp");

      this.paintForeground = null;

      dockable.state.capture(false);
      dockable.off(onmousemove);
      dockable.classList.remove("dragging");
      this.dragEnded(dockable); 
      this.dropLocation = null;
      this.targetDockable = null;
  }

  dragEnded(dockable)
  {

    if(!this.dropLocation) { 
      dockable.classList.add("detached");
      return; //this.setupWindowed;
    }

    //console.assert(dockable instanceof DockPanel,"must be DockPanel");    
    //console.log("DDD", this.targetDockable, this.targetDockable.parentElement, this.dropLocation);

    let target,before,after;

    const createSubFrame = (rowscols) => {
      // target ...
      //console.log(target,dockable,this.targetDockable);
      const atts = { [rowscols]: "" };
      const subFrame = document.createElement("frameset",atts);

      this.targetDockable.parentElement.insertBefore(subFrame,this.targetDockable);
      subFrame.insertBefore(this.targetDockable);

      target = subFrame;

      // set that initial frame to span whole frameset
      this.targetDockable.style.set({
        width:Length.fx(1), 
        height:Length.fx(1)
      });
        
      return this.targetDockable;
    
    };

    if( this.dropLocation == "L" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       before = createSubFrame("cols");
       this.dropLocation = "l"; 
    } 
    else if( this.dropLocation == "R" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       after = createSubFrame("cols");
       this.dropLocation = "r";
    } 
    else if( this.dropLocation == "T" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       before = createSubFrame("rows");
       this.dropLocation = "t"; 
    } 
    else if( this.dropLocation == "B" ) {
       this.targetDockable = this.targetDockable.$p("frameset");
       after = createSubFrame("rows");
       this.dropLocation = "t"; 
    } 
    else if( this.dropLocation == "m" ) {
      DockTabs.convert(this.targetDockable).appendTab(dockable);
    }
    else if(isHorzFrameset(this.targetDockable.parentElement)) {
      target = this.targetDockable.parentElement;
      if(this.dropLocation == "t")
        before = createSubFrame("rows");
      else if(this.dropLocation == "b")
        after = createSubFrame("rows");
      else if(this.dropLocation == "l")
        before = this.targetDockable;
      else if(this.dropLocation == "r")
        after = this.targetDockable;
    }
    else if(isVertFrameset(this.targetDockable.parentElement)) {
      target = this.targetDockable.parentElement;
      if(this.dropLocation == "l")
        before = createSubFrame("cols");
      else if(this.dropLocation == "r")
        after = createSubFrame("cols");
      else if(this.dropLocation == "t")
        before = this.targetDockable;
      else if(this.dropLocation == "b")
        after = this.targetDockable;
    }

    else {
      target = this.targetDockable.parentElement;
      if(this.dropLocation == "l")
        before = createSubFrame("cols");
      else if(this.dropLocation == "r")
        after = createSubFrame("cols");
      else if(this.dropLocation == "t")
        before = createSubFrame("rows");
      else if(this.dropLocation == "b")
        after = createSubFrame("rows");
    }

    //console.log(target,before,after);

    if(after)
      target.insertAfter(dockable,after);
    else if(before)
      target.insertBefore(dockable,before);

    dockable.style.removeProperties();
    dockable.classList.remove("detached","window");
    dockable.takeOff();

    this.markers = null;
    this.requestPaint();

  }

  generateMarkers(elementUnder) {

    let dockable = elementUnder.$p(".dockable,.dockable-content");

    let markers;

    if(dockable) {

      let [x1,y1,x2,y2] = dockable.state.box("rect","padding",this);
      let xc = (x2 + x1) / 2 , yc = (y2 + y1) / 2;
      
      markers = {
        "t": [xc - MARKER_SIZE2, yc - MARKER_SIZE2 - 4 - MARKER_SIZE],
        "l": [xc - MARKER_SIZE2 - 4 - MARKER_SIZE, yc - MARKER_SIZE2],
        "r": [xc + MARKER_SIZE2 + 4, yc - MARKER_SIZE2],
        "b": [xc - MARKER_SIZE2, yc + MARKER_SIZE2 + 4],
      };

      if(!dockable.$is(".dockable-content"))
        markers["m"] = [xc - MARKER_SIZE2, yc - MARKER_SIZE2];

    } else {
      dockable = elementUnder.$p("frameset");
      markers = {};
    }

    let parentFrameSet = elementUnder.$p("frameset");
    if(isHorzFrameset(parentFrameSet)) {
      let [x1,y1,x2,y2] = parentFrameSet.state.box("rect","padding",this);
      markers["T"] = [ (x1 + x2) / 2 - MARKER_SIZE2, y1 ];
      markers["B"] = [ (x1 + x2) / 2 - MARKER_SIZE2, y2 - MARKER_SIZE];
    }
    if(isVertFrameset(parentFrameSet)) {
      let [x1,y1,x2,y2] = parentFrameSet.state.box("rect","padding",this);
      markers["L"] = [ x1, (y1 + y2) / 2 - MARKER_SIZE2 ];
      markers["R"] = [ x2 - MARKER_SIZE, (y1 + y2) / 2 - MARKER_SIZE2];
    }
    this.markers = markers;
    return dockable;
  }

  handleDrag(evt) {
    let {clientX,clientY} = evt;
    const [docx,docy] = this.state.box("position","inner","document");
    clientX -= docx; clientY -= docy;
    const elementUnder = this.elementFromPoint(clientX,clientY);
    let location;
    if(elementUnder) {
        this.targetDockable = this.generateMarkers(elementUnder);
        for( const [loc,origin] of Object.entries(this.markers)) {
          const [x,y] = origin;
          if( clientX > x && clientX < (x + MARKER_SIZE) && 
              clientY > y && clientY < (y + MARKER_SIZE) ) {
            location = loc;
            break;
          }
        } 
      //}
    }

    if(this.dropLocation != location) {
      //console.log(location,dockable,elementUnder);
      this.dropLocation = location;
    }
    this.requestPaint();
  }

  paintMarkers(gfx) {
    if( !this.markers ) return;  
    
    for( const [location,origin] of Object.entries(this.markers)) {
      gfx.fillStyle = Color.RGB(255,255,255);
      gfx.fillRect(origin[0],origin[1],MARKER_SIZE,MARKER_SIZE);
      const x = origin[0] + 2,y = origin[1] + 2;
      gfx.fillStyle = this.dropLocation == location? Color.RGB(255,129,0): Color.RGB(0,129,255);
      switch(location) {
        case "B": case "b" : gfx.draw(MARKER_BOTTOM, {x,y}); break;
        case "L": case "l" : gfx.draw(MARKER_LEFT, {x,y}); break;
        case "R": case "r" : gfx.draw(MARKER_RIGHT, {x,y}); break;
        case "T": case "t" : gfx.draw(MARKER_TOP, {x,y}); break;
        case "m" : gfx.draw(MARKER_MIDDLE, {x,y}); break;
      }
    }
  }

  render() {
    return <main.dock styleset={__DIR__ + "docks.css#dock"} {this.props}>
      {this.kids}
      <popup.windowed />
    </main>;
  }

  ["on do-close-panel"](evt) {
    const dockable = evt.target;
    const widgetClass = dockable.classOf;
    widgetClass.shown = false;
    Window.post(new Event("widget-close"));
    dockable.remove();
  }


}

export function DockableWindow() {
   /*this.on("mousedragrequest.dockablewindow",".dockable caption", function(evt,caption) {
      let dockable = caption.$p(".dockable");
      if(!dockable.isWindowed) return false;
      this.$p(".dock").doDrag(dockable,evt.x * devicePixelRatio,evt.y * devicePixelRatio);
      return true;
   });*/
}

DockableWindow.detached = function() {
  //this.off(".dockablewindow")
};

export class DockCaption extends Element {

  #text = "";

  this(props) {
    this.#text = props.text;
  }

  render() {
    return <caption><text>{this.#text}</text><b.close/></caption>;
  }

  getDockTabs() {
    const parent = this.parentElement;
    return parent.tag == "header" &&
           parent.parentElement instanceof DockTabs ? parent.parentElement : null;
  }

  ["on mousedragrequest"](evt) {
    const dock = this.$p(".dock");

    const dockTabs = this.getDockTabs();

    let dockable = dockTabs ? dockTabs.takeoffTab(this)
                            : this.$p(".dockable");

    let [x,y,width,height] = dockable.state.box("xywh","inner","screen",true);
    dockable.style.set({
        width: Length.px(width / devicePixelRatio),
        height: Length.px(height / devicePixelRatio),
    });
    dock.doDrag(dockable,x, y, evt.x * devicePixelRatio,evt.y * devicePixelRatio);
    return true;
  }

}

class DockContent extends Element {

  this(props,kids) {
    this.props = props;
    this.kids = kids;
  }

  render() {
    return <div.content {this.props}>{this.kids}</div>;
  }
  
}

export class DockPanel extends Element {

  props = {};
  kids = [];
  caption = "{unnamed}";
  type = null;

  this(props,kids) {
    let {widgetType,caption,...rest} = props; 
    this.type = widgetType || DockContent; // should be JS class
    this.caption = caption || this.type.className;
    this.props = rest;
    this.kids = kids;
  }
  
  get classOf() { // class of content controller
    return Object.getPrototypeOf(this.lastElementChild).constructor;
  }

  get contentElement() {
    return this.lastElementChild;
  }

  /*componentWillUnmount() {
    throw new Error("DockPanel!");
  }*/

  render() {
    if(this.props._empty)
      return <widget.dockable />;
    else
      return <widget.dockable>
        <DockCaption text={this.caption}  />
        { this.type && JSX(this.type,this.props,this.kids) }
      </widget>;
  }

  ["on click at b.close"]() {
    this.post(new Event("do-close-panel",{bubbles:true}));
    return true;
  }
}

export class DockTabs extends Element {

  captions = [];

  render() {
    //console.log("render",this);
    return <frameset.dockable tabs><header></header></frameset>;
  }

  get captionBar() { return this.firstElementChild; }
  get contentElement() { return this.lastElementChild; }

  appendTab(dockable) {
    let caption = dockable.$(">caption"); 
    console.assert(dockable instanceof DockPanel,"must be DockPanel");
    console.assert(caption,"caption");
    this.captions.push(caption);
    caption.contentElement = dockable.contentElement;
    console.assert(caption.contentElement,"content");
    this.captionBar.append(caption);
    this.contentElement.detach();
    this.append(dockable.contentElement);
    caption.value = true; // set it as current
  }

  initTab(dockable/*Panel*/) {
    let caption = dockable.$(">caption");
    //console.assert(dockable instanceof DockPanel,"must be DockPanel");
    //if(!(dockable instanceof DockPanel))
    //  console.log("dockable", dockable);
    console.assert(caption,"caption");
    caption.contentElement = dockable.contentElement;
    console.assert(caption.contentElement,"content");
    this.captionBar.append(caption);
    this.captions = [caption];
  }

  switchTab(caption) {
    this.contentElement.detach();
    this.append(caption.contentElement);
    caption.value = true; // set it as current
  }

  takeoffTab(caption) {
    const dock = caption.$p(".dock");
    const [w,h] = this.state.box("dimension","inner");
    
    const header = this.$(">header");
    if(header.childElementCount > 2) {
      if(caption.nextElementSibling)
        this.switchTab(caption.nextElementSibling);
      else
        this.switchTab(caption.previousElementSibling);
    }

    function createDockable(caption) {
      const dockable = Element.create(<DockPanel _empty={true} />); //Element.create(<widget.dockable/>);
      dockable.append(caption);
      dockable.append(caption.contentElement);
      dock.append(dockable);
      dockable.style.set({width:Length.px(w),height:Length.px(h)});
      return dockable;
    }  

    const dockable = createDockable(caption);

    if(header.childElementCount == 1) { // only one left
       const last = createDockable(header.firstElementChild);
       this.parentElement.insertBefore(last,this);
       this.remove();
    }

    return dockable;
  }
  

  ["on click at caption"](evt,caption) {
    this.switchTab(caption);
    return true; // consume the event
  }

  //componentWillUnmount() {
  //  throw new Error("UNM");
  //}

  static convert(element) {

    //console.log("convert",element, element.constructor.name);

    if(element instanceof DockTabs) return element;
    
    console.assert(element instanceof DockPanel);

    const caption = element.caption; 

    const subFrame = Element.create(<DockTabs />);

    element.parentElement.insertBefore(subFrame,element);
    subFrame.append(element);

    subFrame.initTab(element);

    return subFrame;
  }

}

export function DockGroup(props,kids) {
  function cr() {
    let def = [];
    let flexes = 0;
    for(const kid of kids) {
      const tag = Reactor.tagOf(kid);
      if( tag === DockPanel || tag == DockTabs || tag == DockGroup )
        def.push("200px");
      else {
        def.push("*");
        ++flexes;
      }
    }
    if(!flexes) def[def.length / 2] = "*";
    return def.join(",");
  }
  switch(props.type) {
    case "cols": return <frameset cols={cr()}>{kids}</frameset>;
    case "rows": return <frameset rows={cr()}>{kids}</frameset>;
    case "tabs": return <DockTabs>{kids}</DockTabs>;
  }
}

