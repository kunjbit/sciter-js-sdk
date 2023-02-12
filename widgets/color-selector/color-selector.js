
function ReRGB({color,cb}) {
  function onChange() {
    const {R,G,B} = this.value;
    cb(Color.RGB(R,G,B));
    return true;
  }
  return <form onchange={onChange}>
               R:<input|integer(R) min="0" max="255" value={color.R}/>&nbsp;
               G:<input|integer(G) min="0" max="255" value={color.G}/>&nbsp;
               B:<input|integer(B) min="0" max="255" value={color.B}/></form>
}

function ReRGBX({color,cb}) {
  const v = printf("#%02x%02x%02x",color.R,color.G,color.B);
  function onChange() {
    cb(new Color( this.value ));
    return true;
  }
  return <input|text.sole value={v} onchange={onChange} />
}

function ReHSV({color,cb}) {
  const [h,s,v] = color.hsv;
  function onChange() {
    const {H,S,V} = this.value;
    cb(Color.hsv(H,S/100,V/100));
    return true;
  }
  return <form onchange={onChange}>
    H:<input|integer(H) min="0" max="360" value={h}/>°&nbsp;
    S:<input|integer(S) min="0" max="100" value={s*100}/>%&nbsp;
    V:<input|integer(V) min="0" max="100" value={v*100}/>%
  </form>
}


function ReHSVs({color,cb}) {
  const [h,s,v] = color.hsv;
  const t = printf("hsv(%d,%d%%,%d%%)",h,s*100,v*100);
  function onChange() {
    cb(new Color(this.value));
    return true;
  }
  return <input|text.sole value={t} onchange={onChange} />;
}

function ReSelector({format,color,cb}) {
  switch(format) {
    default:
    case 0: return <ReRGB color={color} cb={cb} />;
    case 1: return <ReRGBX color={color} cb={cb} />;
    case 2: return <ReHSV color={color} cb={cb} />;
    case 3: return <ReHSVs color={color} cb={cb} />;
  }
}

const gitColors = ["#B80000","#DB3E00","#FCCB00","#008B02","#006B76","#1273DE","#004DCF","#5300EB","#202020", 
                   "#EB9694","#FAD0C3","#FEF3BD","#C1E1C5","#BEDADC","#C4DEF6","#BED3F3","#D4C4FB","#F2F2F2"];

function PredefinedColors() {
  return <div.predefined>{
    gitColors.map( color => <div.color title={color} style=`background-color:${color}`/>) 
  }</div>;
}

export class ColorSelector extends Element 
{
  color = Color.RGB(255,0,0);
  cx = 0;
  cy = 0;
  format = 0;
  predefined = false;

  this({value,predefined}) {
    if(value)
      this.color = value;
    this.predefined = predefined;
  }

  render() {
    const cb = v => this.updateValue(v);
    const [h,s,v] = this.color.hsv;
    const ss = `background:linear-gradient(to right, hsv(${h},100%,100%) 0%, #ffffff 100%)`;
    const cs = `background:hsv(${h},${s*100}%,${v*100}%)`;
    return <widget|color {__DIR__ + "color-selector.css#color-selector"}>
        <div.layers>
          <div.saturation style={ss} />
          <div.value/>
        </div>
        <input|hslider.hue min="0" max="360" value={h}/>
        <section>
           <div.current style={cs} />
           <ReSelector format={ColorSelector.format} color={this.color} cb={cb} />
           <div.switch><icon|up /><icon|down /></div>
        </section>
        { this.predefined ? <PredefinedColors />:[] }
      </widget>;
      // <input|hslider.alpha min="0.0" max="1.0" value="1.0"/>
  }

  componentDidMount() {
    if( this.children.length == 0 )
      this.patch(this.render(),true);
    const valLayer = this.$("div.value");

    this.updateValue(this.color);    

    valLayer.paintForeground = gfx => {
      const color = this.color;
      gfx.strokeStyle = Color.RGB(255-color.R,255-color.G,255-color.B);
      gfx.strokeWidth = 1;
      gfx.beginPath();
      gfx.ellipse(this.cx,this.cy,4,4,0deg,360deg);
      gfx.stroke();
    }

    const me = this;
    valLayer.on("^mousedown", evt => { 
      if(evt.button == 1) {
        me.selectColorByXY(evt); 
        valLayer.state.capture("strict");
      }
    });
    valLayer.on("^mousemove", evt => { 
      if(evt.button == 1) 
        this.selectColorByXY(evt);
    });
    valLayer.on("^mouseup", evt => { 
      valLayer.state.capture(false);
    });
    this.requestPaint();
  }

  selectColorByXY({x,y,target}) {
     const [sx,sy] = target.state.box("dimension","inner");
     x = Math.min(sx,Math.max(0.0,x));
     y = Math.min(sy,Math.max(0.0,y));
     this.cx = x;
     this.cy = y;
     const v = 1.0 - y / sy; 
     const s = 1.0 - x / sx; 
     const [h] = this.color.hsv;
     this.postEvent(new Event("change", {bubbles:true}));
     this.requestPaint();
     this.componentUpdate({color:Color.hsv(h,s,v)})
     this.flushPaint();
  }

  ["on change at input.hue"](evt,elHue) {
     const hv = elHue.value;
     const [h,s,v] = this.color.hsv;
     this.componentUpdate({color:Color.hsv(hv,s,v)});
     this.postEvent(new Event("change", {bubbles:true}));
  }

  ["on click at div.color"](e,dc){ 
    const color = Color(dc.attributes["title"]);
    this.updateValue(color);
    this.postEvent(new Event("change", {bubbles:true}));
    return true; 
  }

  updateValue(color) {
    const [h,s,v] = color.hsv;
    const valEl = this.$("div.value");
    const [sx,sy] = valEl.state.box("dimension","inner");
    this.componentUpdate({color,cx:sx-sx*s,cy:sy-sy*v});
  }

  get value() {
    return this.color;
  }

  set value(color) {

    if(typeof color == "string")
      color = new Color(color);

    if(this.value.valueOf() == color.valueOf())
      return;

    this.componentUpdate({color});
  }

  ["on click at icon|up"](){ 
    ColorSelector.format = ColorSelector.format ? ColorSelector.format-1: 3;
    this.componentUpdate(); 
    return true; 
  }
  ["on click at icon|down"](){ 
    ColorSelector.format = (ColorSelector.format + 1) % 4;
    this.componentUpdate(); 
    return true; 
  }


}

export class ColorInput extends Element {
  color;
  shown = false;
  predefined;

  this({value,predefined}) {
    if(value)
      this.color = value;
    this.predefined = predefined;
  }

  componentDidMount() {
    if( this.children.length == 0 ) {
      this.patch(this.render(),true);  
      this.predefined = this.attributes["predefined"] !== undefined;
    }
  }

  render() {
    const c1 = this.color ? this.color.toString("RGB"):"color(button-face)"; 
    const c2 = this.color ? this.color.toString("RGB"):"|"; 
    return <input|color styleset={__DIR__ + "color-selector.css#color-input"}>
      <span.current style=`background:${c1}` />
      <caption filter="#0~9A~Fa~f" value={c2}/>
      <button/>
    </input>;
  }

  ["on click at button"](evt,button) {
    if(!this.shown) {
      this.shown = true;
      this.popup(<ColorSelector value={this.color} predefined={this.predefined} />, {
        anchorAt:1,
        popupAt:7
      });
    }
  }
  ["on change at :popup"](e,popup) {
    this.componentUpdate({color:popup.value});
  }
  ["on popupdismissing at :popup"](e,popup) {
    this.timer(420ms, ()=>{this.shown = false})
  }

  get value() { return this.color; }
  set value(color) { this.color = color; }

}