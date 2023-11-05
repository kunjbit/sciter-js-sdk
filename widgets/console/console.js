import * as env from "@env";

let wnd = null;
let logView = null;
let messages = [];
const MAXLEN = 128;

document.on("document-created", function(e) {
  // setup this console in the newly created document (in frames)
  const dst = e.target.globalThis.console;
  const src = globalThis.console;
  dst.log = src.log;
  dst.info = src.info;
  dst.warn = src.warn;
  dst.error = src.error;
});

function Val({val,asvalue}) {
  switch(typeof val) {
    case "string": return asvalue ? <var.string>"{val}"</var> : crackText(val); 
    case "undefined": return <var.undefined>undefined</var>; 
    case "number": return <var.number>{val.toString()}</var>;
    case "bigint": return <var.bigint>{val.toString()}</var>;
    case "boolean": return <var.boolean>{val.toString()}</var>;
    case "function": return <FunctionView val={val}/>;
    case "object":
        if(val === null) 
          return <var.null>null</var>;
        else if(Array.isArray(val)) 
          return <ArrayView val={val} />;
        else
          return <ObjectView val={val}/>; 
  }
}

function Message({args}) {
  const content = [];
  for(let part of args) {
    if(content.length) content.push(" ");
    content.push(<Val val={part} />);
  }
  return <text>{content}</text>;
}

function updateView() {
  if(!logView) createWindow();
  if(messages.length > MAXLEN) messages.shift();  
  logView.componentUpdate();
}

let counter = 0;

globalThis.console.log = function(...args) {
  messages.push(["log",++counter, args]);
  updateView();
}

globalThis.console.info = function(...args) {
  messages.push(["info",++counter, args]);
  updateView();
}

globalThis.console.warn = function(...args) {
  messages.push(["warn",++counter, args]);
  updateView();
}
globalThis.console.error = function(...args) {
  messages.push(["error",++counter, args]);
  updateView();
}

function FunctionView({val}) {
  return <var.function>{val.name ?? val.toString()}()</var>;
}

class ObjectView extends Element {
  val;
  constructor({val}) {
    super();
    this.val = val;
  }

  render() {
    return <var.object>{this.val?.constructor?.name}&#x007B;&#x007D;</var>;
  }

  onpopuprequest(evt) {
    const items = [];
    for(var key in this.val) 
      items.push(<label>{key}:</label>,<Val val={this.val[key]} asvalue="true" />);
    evt.relatedTarget = Element.create(<menu.context.val>{items}</menu>);
    return true;
  }
}

class ArrayView extends Element {
  val;
  constructor({val}) {
    super();
    this.val = val;
  }

  render() {
    return <var.array>{this.val.constructor.name}[]</var>;
  }

  onpopuprequest(evt) {
    const items = [];
    for(let i = 0; i < Math.min(this.val.length,16); ++i) 
      items.push(<label>{i}:</label>,<Val val={this.val[i]} asvalue="true" />);
    const more = this.val.length - 16;
    if(more > 0) items.push(<text>{more} items more...</text>);
    evt.relatedTarget = Element.create(<menu.context.val>{items}</menu>);
    return true;
  }
}

function createWindow() {
  wnd = new Window({
     type: Window.FRAME_WINDOW,
     html: <LogWindow />, // Note: use of VDOM as window content
     parent: Window.this,
     caption:"log",
     alignment: 9, // right top of desktop
     state: Window.WINDOW_SHOWN
  });

  wnd.on("closerequest", function(evt) {
    wnd = null;
    logView = null;
    messages = [];
  });

}

const styles = CSS.set`
   body { margin:0 }
   plaintext {size:*; border:none;}
   var { display:inline-block; width:max-content; max-width:10em; overflow-x:hidden; white-space:no-wrap; text-overflow:ellipsis; }
   var.undefined { color:#5300eb; }
   var.null { color:#5300eb; }
   var.number { color:#004dcf; }
   var.bigint { color:#1273de; }
   var.boolean { color:#006b76; }
   var.string { color: #004dcf; }
   plaintext text.error { color: #b80000; }
   plaintext text.warning { background: #fef3bd; }
   menu.val { 
     flow:row(label,var); 
     border-spacing: 4px 2px; 
     width:*; 
     overflow-y:scroll-indicator;
     height:max-content;
     max-height:480px;
   }
   menu.val > label {display: block; text-align: right; }
   var.array, var.object, var.function { 
     cursor:pointer;
     background:var(button-face);
     padding:1px 11px 1px 4px;
     behavior:clickable popup-menu; 
     border-radius:0.5em;
     background-image:url(stock:chevron-down);
     background-size:7dip;
     background-repeat: no-repeat;
     background-position: top 50% right 2px;
   }
`;

function LogWindow() {
  return <html window-width="480px"
               window-height="600px">
          <body styleset={styles}>
             <LogView />
          </body>
        </html>;
}

class LogView extends Element {

   render() {
     const lines = [];
     for(let msg of messages) {
        const [type,key,args] = msg;
        lines.push(<Message class={type} key={key} args={args} />)
     }
     return <plaintext var={logView} readonly="" >{lines}</plaintext>
   }

   ["on ^click at a[href]"](e,a) {
     const href = a.attributes["href"];
     const line = a.attributes["lineno"];
     if(env.PLATFORM == "Windows") {
       try { env.exec("C:/Program Files/Sublime Text/subl", URL.toPath(href) + ":" + line); return true; } catch(e) { }
       try { env.exec("code", "-g", URL.toPath(href) + ":" + line); return true; } catch(e) { }     
       try { env.exec("notepad++", "-n" + line, URL.toPath(href)); return true; } catch(e) { }     
       try { env.launch(href); return true; } catch(e) { } 
     } else if(env.PLATFORM == "Linux") {
       try { env.exec("gedit", URL.toPath(href) + "+" + line); return true; } catch(e) { }
     }
     return true;
   }
}

const RE_FILE_LINE = /[(](\w+:[^()]+(?:[:]\d+|[(]\d+[)]))[)]/g;

function crackText(text) {
  const t = text.split(RE_FILE_LINE);
  if (t.length == 1)
    return text;

  const content = [];
  for (let i = 0; i < t.length; ++i) {
    const chunk = t[i];
    if (!chunk) continue;
    if (i & 1) {
      const RE_URL_LINENO = /(\w+:[^()]+)(?:[:](\d+)|[(](\d+)[)])/g;
      const [src, url, ln1, ln2] = RE_URL_LINENO.exec(chunk);
      content.push(<a.location href={url} lineno={ln1 || ln2}>{chunk}</a>);
    }
    else
      content.push(chunk);
  }
  return content;
}
