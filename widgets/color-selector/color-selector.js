
function ReRGB({color,cb}) {
  function onChange() {
    const {R,G,B,A} = this.value;
    cb(Color.RGB(R,G,B,A));
    return true;
  }
  return <form onchange={onChange}>
               R:<input|integer(R) min="0" max="255" value={color.R}/>&nbsp;
               G:<input|integer(G) min="0" max="255" value={color.G}/>&nbsp;
               B:<input|integer(B) min="0" max="255" value={color.B}/>&nbsp;
               A:<input|integer(A) min="0" max="255" value={color.A}/></form>
}

function ReRGBX({color,cb}) {
  const v = color.A == 255 ? printf("#%02x%02x%02x",color.R,color.G,color.B)
                           : printf("#%02x%02x%02x%02x",color.R,color.G,color.B,color.A);
  function onChange() {
    cb(new Color( this.value ));
    return true;
  }
  return <input|text.sole value={v} onchange={onChange} />
}

function ReHSV({color,cb}) {
  const [h,s,v,a] = color.hsv;
  function onChange(e) {
    const {H,S,V,A} = this.value;
    cb(Color.hsv(H,S/100,V/100,A/100));
    return true;
  }
  return <form onchange={onChange}>
    H:<input|integer(H) min="0" max="360" value={h}/>°&nbsp;
    S:<input|integer(S) min="0" max="100" value={s*100}/>&nbsp;
    V:<input|integer(V) min="0" max="100" value={v*100}/>&nbsp;
    A:<input|integer(A) min="0" max="100" value={a*100}/>%
  </form>
}


function ReHSVs({color,cb}) {
  const [h,s,v,a] = color.hsv;
  const t = a == 1.0 ? printf("hsv(%d, %d%%, %d%%)",h,s*100,v*100)
                     : printf("hsv(%d, %d%%, %d%% / %d%%)",h,s*100,v*100,a*100);
  function onChange() {
    cb(new Color(this.value));
    return true;
  }
  return <input|text.sole value={t} onchange={onChange} />;
}

// editable representation
class Rep extends Element {
  format;
  color;
  cb;

  this({format,color,cb}) {
    this.format = format;
    this.color = color;
    this.cb = cb;
  }

  render()  {
    let rep;
    switch(this.format) {
      default:
      case 0: rep = <ReRGB color={this.color} cb={this.cb} />; break;
      case 1: rep = <ReRGBX color={this.color} cb={this.cb} />; break;
      case 2: rep = <ReHSV color={this.color} cb={this.cb} />; break;
      case 3: rep = <ReHSVs color={this.color} cb={this.cb} />; break;
    }
    return <div.rep>{rep}</div>;
  }
}

const gitColors = ["#B80000","#DB3E00","#FCCB00","#008B02","#006B76","#1273DE","#004DCF","#5300EB","#202020", 
                   "#EB9694","#FAD0C3","#FEF3BD","#C1E1C5","#BEDADC","#C4DEF6","#BED3F3","#D4C4FB","#F2F2F2"];

function PredefinedColors({colors}) {
  if(!colors || colors.length == 0) return [];
  if(!Array.isArray(colors))
    colors = gitColors;
  return <div.predefined>{
    colors.map( color => <span.color title={color} style=`background-color:${color}`/>) 
  }</div>;
}

export class ColorSelector extends Element 
{
  color = Color.RGB(255,0,0);
  cx = 0;
  cy = 0;
  format = 0;
  colors = false; // colors color set
  extra; // extra JSX node - custom stuff

  constructor(props,kids) {
    super();
    this.colors = props?.colors;
    this.extra = kids?.[0]; 
  }

  this({value,colors}) {
    if(value)
      this.color = value;
  }

  render() {
    const cb = v => this.updateValue(v,true);
    const [h,s,v] = this.color.hsv;
    const a = this.color.A;
    return <widget|color {__DIR__ + "color-selector.css#color-selector"}>
        <div.layers>
          <div.saturation />
          <div.value/>
        </div>
        <form.sliders>
           <div.current />
           <input|hslider(h) min="0" max="359" value={h}/>
           <input|hslider(a) min="0" max="255" value={a}/>
        </form>
        <div.numerics>
           <Rep format={ColorSelector.format} color={this.color} cb={cb} />
           <div.switch><icon|up /><icon|down /></div>
        </div>
        { this.extra ? (this.extra[1].color = this.color, this.extra[1].name = "extra", this.extra) : [] }
        <PredefinedColors colors={this.colors} />
      </widget>;
      // <input|hslider.alpha min="0.0" max="1.0" value="1.0"/>
  }

  componentDidMount(byCss) {
    if( this.children.length == 0 ) {
      // mounted by CSS::prototype declaration
      this.color = new Color(this.attributes["value"] ?? "#f00");
      this.patch(this.render(),true);
    }
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
     const [h,d1,d2,a] = this.color.hsv;
     this.postEvent(new Event("change", {bubbles:true}));
     this.updateValue(Color.hsv(h,s,v,a));
     this.flushPaint();
  }

  /*["on change at input.hue"](evt,elHue) {
     const hv = elHue.value;
     const [h,s,v] = this.color.hsv;
     //this.componentUpdate({color:Color.hsv(hv,s,v)});
     this.updateValue(Color.hsv(hv,s,v,this.color.a));
     this.postEvent(new Event("change", {bubbles:true}));
  }

  ["on change at input.alpha"](evt,elAlpha) {
     const av = elAlpha.value;
     const [h,s,v] = this.color.hsv;
     //this.componentUpdate({color:Color.hsv(h,s,v,av/255)});
     this.updateValue(Color.hsv(h,s,v,av/255));
     this.postEvent(new Event("change", {bubbles:true}));
  }*/

  ["on change at form.sliders"](evt,sliders) {
    const {h,a} = sliders.value;
    const [ch,cs,cv] = this.color.hsv;
    this.updateValue(Color.hsv(h,cs,cv,a));
    this.postEvent(new Event("change", {bubbles:true}));
  }

  ["on click at span.color"](e,dc){ 
    const color = Color(dc.attributes["title"]);
    this.updateValue(color);
    this.postEvent(new Event("change", {bubbles:true}));
    return true; 
  }

  updateValue(color,byRep) {
    const [h,s,v,a] = color.hsv;
    const valEl = this.$("div.value");
    const [sx,sy] = valEl.state.box("dimension","inner");
    this.cx = sx-sx*s;
    this.cy = sy-sy*v;
    this.color = color;    
    this.style?.variable("clr",color);
    this.$("form.sliders").value = {h,a:a*255};
    if(this.extra) {
      this.extra[1].color = color;
      this.$("[name='extra']").patch(this.extra);
    }
    if(!byRep)
      this.$("div.rep").componentUpdate({color});
    this.requestPaint();
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
  colors;
  extra;

  constructor(props,kids) {
    super();
    this.colors = props?.colors;
    this.extra = kids?.[0]; 
  }

  this({value,colors}) {
    if(value)
      this.color = value;
  }

  componentDidMount() {
    if( this.children.length == 0 ) {
      this.colors = this.attributes["colors"]?.split(",");   
      this.color = new Color(this.attributes["value"] ?? "#f00");
      this.patch(this.render(),true);  
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
      if(this.extra) {
        this.extra[1].color = this.color;
        this.popup(<ColorSelector value={this.color} colors={this.colors}>{this.extra}</ColorSelector>, { anchorAt:1, popupAt:7 });
      }
      else
        this.popup(<ColorSelector value={this.color} colors={this.colors} />, { anchorAt:1, popupAt:7 });
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