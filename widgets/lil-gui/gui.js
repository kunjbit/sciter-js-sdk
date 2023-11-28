
class Item {
  object;
  label;  
  property;
  initialValue;
  hidden = false;  
  list;
  vmin;
  vmax;
  vstep;

  constructor(parent,object, property, $1, max, step) {
     this.object = object;
     this.property = this.label = property;
     this.initialValue = object?.[ property ];
     if(Object($1) === $1) this.list = $1; else this.vmin = $1;
     this.vmax = max;
     this.vstep = step;  
     this.hasSlider = this.vmax !== undefined && this.vmin !== undefined; 
  }

  show() { this.hidden = false; this.updateParent(); return this;}
  hide() { this.hidden = true; this.updateParent();  return this;}

  name(n) { this.label = n; return this;} 
  min(n) { this.vmin = n; return this;} 
  max(n) { this.vmax = n; return this;} 
  step(n) { this.vmax = n; return this;} 
  onChange(fcn) { this.onchange = fcn; return this; }
  destroy() { this.parent.remove(this); }

  getValue() {
    return this.object?.[ this.property ];
  } 
  setValue(val) {
    if(!this.object) return;
    const pvalue = this.object[ this.property ];
    if(val !== pvalue) {
      this.object[ this.property ] = val;
      this.onchange?.(val);        
    }
  }

  updateParent() { this.parent?.updateParent(); }

  key() {
    return `${this.parent?.key() ?? ""}/${this.property}`;
  }
  
}

class ColorItem extends Item {
  dataFormat;
  constructor(parent,object, property) {
    super(parent,object, property);
    this.dataFormat = selectColorDataFormat(this.initialValue);
  }
}

class Group extends Item {
  items = [];
  closed = false;

  constructor(parent,title) {
    super(parent,null,title ?? "Controls");
  }

  /**
   * Adds an observable item to the folder, inferring controller type using the `typeof` operator.
   * @example
   * gui.add( object, 'property' );
   * gui.add( object, 'number', 0, 100, 1 );
   * gui.add( object, 'options', [ 1, 2, 3 ] );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
   * selectable values for a dropdown.
   * @param {number} [max] Maximum value for number controllers.
   * @param {number} [step] Step value for number controllers.
   * @returns {Item}
   */
  add(object, property, $1, max, step) {
    const initialValue = object?.[ property ];
    const item = initialValue instanceof Color
          ? new ColorItem(this,object, property)
          : new Item(this,object, property, $1, max, step);
    this.items.push(item);
    this.updateParent();
    return item;
  }

  addColor(object, property ) {
    const item = new ColorItem(this,object, property);
    this.items.push(item);
    this.updateParent();
    return item;
  }


  /**
   * Adds a folder(a.k.a. group) to the group, which is just another Group. This method returns
   * the nested Group so you can add controllers to it.
   * @example
   * const folder = gui.addFolder( 'Position' );
   * folder.add( position, 'x' );
   * folder.add( position, 'y' );
   * folder.add( position, 'z' );
   *
   * @param {string} title Name to display in the folder's title bar.
   * @returns {Group}
   */

  addFolder(title) {
    const item = new Group(this,title);
    this.items.push(item);
    this.updateParent();
    return item;
  }

  close() { this.closed = true; this.updateParent(); return this; }
  open() { this.closed = false; this.updateParent(); return this; }

  title( title ) { this.label = title; this.updateParent(); return this; }

  remove(child) {
    this.items = this.items.filter(item => item !== this); 
    this.updateParent();
  }
}

export class GUI extends Group {

  element;

  constructor(options = {}) {
    super(null,options.title);
    const container = options.container ?? document.body;
    document,post( ()=> {
      container.append(<GUIView var={this.element} options={options} root={this} />);  
    });
  }

}

export function makeFolder(title) {
  return new Group(null, title || "Controls");
}

export class GUIView extends Element {

  root = null;
  options;

  constructor(props,kids) {
    super();
    this.root = props.root;
    this.root.updateParent = () => this.componentUpdate();
    this.options = props.options ?? {};
  }

  render() {
    const atts = {};
    if(this.options.autoPlace ?? true) atts.place = "default";
    if(this.options.width) atts.style = `width:${this.options.width}px`;
    return <widget|gui theme="dark" {atts} styleset={__DIR__ + "gui.css#lil-gui"}><GroupView item={this.root} root={true}/></widget>;
  }

}

function GroupView(props) {
  const group = props.item;
  const isRoot = props.root;

  function expand() {
    group.closed = false;
    this.$p("widget").componentUpdate();
    return true;
  }
 
  if(group.closed)
    return <header.closed key={group.key()} onClick={expand}><text>{group.label}</text>{ isRoot && <span.fps/> }</header>;

  function collapse() {
    group.closed = true;
    this.$p("widget").componentUpdate();
    return true;
  }

  const elements = [<header key={group.key()} onClick={collapse}><text>{group.label}</text>{ isRoot && <span.fps/> }</header>];

  for(const item of group.items) {
    if (item.hidden) continue;
    if (item instanceof Group) {
      elements.push(<GroupView item={item} />);
      continue;
    }
    if (item instanceof ColorItem) {
      elements.push(<ColorView item={item} />);
      continue;
    }
    if ( item.list ) {
      elements.push(<SelectView item={item} />);
      continue;
    }
    switch ( typeof item.initialValue ) {
      case 'number':   elements.push(<NumberView item={item} />); break;
      case 'boolean':  elements.push(<BooleanView item={item} />); break;
      case 'string':   elements.push(<StringView item={item} />); break;
      case 'function': elements.push(<FunctionView item={item} />); break;
      default: console.error( "GUI.render failed on item:", typeof item ); break;
    }
  }
  return elements;
}

function StringView(props) {
  const item = props.item;
  return [
    <label>{item.label}</label>,
    <input|text key={item.key()} value={item.getValue()} onChange={ function(){item.setValue(this.value)} } />
  ];
}

function BooleanView(props) {
  const item = props.item;
  return [
    <label>{item.label}</label>,
    <input|checkbox key={item.key()} checked={item.getValue()} onChange={ evt => {item.setValue(this.value)} } />
  ];
}

function NumberView(props) {
  const item = props.item;
  const natts = {}, satts = {};
  if(typeof item.vmin === "number") { natts.min = item.vmin; satts.min = item.vmin * 100; }
  if(typeof item.vmax === "number") { natts.max = item.vmax; satts.max = item.vmax * 100; }
  if(typeof item.vstep === "number") { natts.step = item.vstep; satts.step = item.vstep * 100; }
  const val = item.getValue();
  if(item.hasSlider) {
    let slider; function onSliderChange() { item.setValue(number.value = this.value / 100); }
    let number; function onNumberChange() { item.setValue(this.value); slider.value = this.value * 100; }
    return [
      <label>{item.label}</label>,
      <div key={item.key()}>
        <input|hslider var={slider} {satts} value={val * 100} onChange={ onSliderChange } />
        <input|number var={number} {natts} value={val} onChange={ onNumberChange } />
      </div>
    ];
  }
  else 
    return [
      <label>{item.label}</label>,
      <input|number key={item.key()} {natts} value={val} onChange={ function(){item.setValue(this.value)} } />
    ];
}

function FunctionView(props) {
  const item = props.item;
  return <button key={item.key()} onClick={ function(){item.onchange?.()}}>{item.label}</button>;
}

function SelectView(props) {
  const item = props.item;
  const options = [];
  if(Array.isArray(item.list)) {
     for(let v of item.list) 
       options.push(<option>{v}</option>);
  } else {
     for(let [k, v] of Object.entries(item.list)) 
       options.push(<option value={v}>{k}</option>);
  }
  return [
    <label>{item.label}</label>,
    <select|dropdown key={item.key()} value={item.getValue()} onChange={ function(){item.setValue(this.value)} } >{options}</select>
  ];
}

function ColorView(props) {
  const item = props.item;
  const color = item.dataFormat.toColor(item.getValue());
  return [
    <label>{item.label}</label>,
    <input|color embedded key={item.key()} value={color} onChange={ function(){item.setValue( item.dataFormat.fromColor(this.value))} } />
  ];
}


// color utils
const STRING = {
  match(v) { return typeof v === 'string' },
  fromColor(color) { return color.toString("RGB"); },
  toColor(string) { return new Color(string) }
};

const INT = {
  match(v) { return typeof v === 'number' },
  fromColor(color) { return color.valueOf() },
  toColor(int) { return new Color(int); }
};

const ARRAY = {
  match(v) { return Array.isArray(v) },
  fromColor(color) { return [color.r,color.g,color.b] },
  toColor( arr ) { return new Color.rgb(arr[0],arr[1],arr[2]) }
};

const OBJECT = {
  match(v) { return Object( v ) === v },
  fromColor(color) { return {r:color.r,g:color.g,b:color.b} },
  toColor( obj ) { return new Color.rgb(obj.r,obj.g,obj.b) }
};

const COLOR = {
  match(v) { return v instanceof Color },
  fromColor(color) { return color },
  toColor(color) { return color }
};

const FORMATS = [ COLOR, STRING, INT, ARRAY, OBJECT ];

function selectColorDataFormat(data) {
  return FORMATS.find( format => format.match( data ) );
}

export function FPS() {

  const TICKS = 32;
  
  const times = new Int32Array(TICKS);
  let lastTime = Window.ticks();
  let idx = 0;
  let fps = 0;

  const update = () => {
    const avg = times.reduce((acc,val)=>acc+val, 0) / TICKS;
    this.innerText = `fps:${Math.round(1000 / avg) ^ 0}`; 
  }

  this.paintBackground = () => {
     const t = Window.ticks();
     const delta = t - lastTime;
     lastTime = t;  
     idx = (idx + 1) % TICKS;
     times[idx] = delta; 
     if(!idx) this.post(update);
  }
}