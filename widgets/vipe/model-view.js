
//const classes = Reactor.classes;

class Socket extends Element {
  port;
  highlight = false;
  constructor({port}) { 
    super();
    this.port = port; 
  }
  render() {
    const atts = {};
    if(this.port.isConnected) atts.connected = true;
    if(this.highlight) atts.highlighted = true;
    return <span.socket {atts} />
  }

  get view() { return this.$p("node").parentElement; }

  positionInDocument() {
    const view = this.view;
    const centerPositionRelToView = this.box("inner", view).pointOf(5);
    return centerPositionRelToView + view.scrollPosition;  
  }

  onmouseenter() { this.componentUpdate({highlight:true}); }
  onmouseleave() { this.componentUpdate({highlight:false}); }
}

class InputSocket extends Socket {
  onmousedragrequest() {
    const port = this.port;
    if(!port.isConnected) 
      this.view.performInputConnection(port,this.positionInDocument());
    return true;
  }
  onmouseenter() { 
    const port = this.port;
    if(!port.isConnected) {
      if(this.view.isAcceptableInputPort(port))
        this.componentUpdate({highlight:true}); 
    }
  }
}

class OutputSocket extends Socket {
  onmousedragrequest() {
    const port = this.port;
    this.view.performOutputConnection(port,this.positionInDocument());  
    return true;
  }
  onmouseenter() { 
    if(this.view.isAcceptableOutputPort(this.port))
      this.componentUpdate({highlight:true}); 
  }
}

function Output({port}) { 
  return <div.port.output index={port.index}>
    <text>{port.name ? printf("%s : %s",port.name,port.type) : port.type}</text>
    <OutputSocket port={port} />
  </div>;
}

function Input({port}) {
  return <div.port.input index={port.index}>
    <text>{port.name ? printf("%s : %s",port.name,port.type) : port.type}</text>
    <InputSocket port={port} />
  </div>;
}

class Controls extends Element {
  node;
  constructor({node}) {
    super();
    this.node = node;
  }
  render() {
    const node = this.node;
    const outputValues = node.getOutputValues();
    const controlValues = node.getControlValues();
    return <div.controls>
      { node.kernel.render(node,controlValues,outputValues) }
    </div>
  }
  ["on change at :root > *"](evt) {
    const namedCtls = this.$$("[name]");
    function reducer(obj,ctl) { obj[ctl.attributes.name] = ctl.value; return obj; }
    this.node.setControlValues( namedCtls.reduce(reducer,{}) );
    this.parentElement.postEvent(new Event("value-change", {bubbles:true}));
    return true;
  }
}

class Caption extends Element {
  node;
  constructor({node}) {
    super();
    this.node = node;
  }
  render() {
    return <caption>{this.node.name}</caption>;
  }

  onmousedragrequest(evt) {
    const nodeView = this.parentElement;
    const offset = evt.position + this.box("inner",nodeView).origin;
    const view = nodeView.parentElement;
    view.performNodeMove(nodeView,offset);
    return true;
  }
}

export class NodeView extends Element {
  node;
  constructor({node}) {
    super();
    this.node = node;
  }

  render(props,kids,parent) {
    const view = parent || this.parentElement;
    const node = this.node;
    view.registerNodeView(node,this);

    const ports = [];
    for(let n = 0; n < Math.max(node.outputs.length,node.inputs.length); ++n) {
      const ip = node.inputs[n];
      const op = node.outputs[n];
      if(ip && op)
        ports.push(<Input port={ip}/>,<Output.break port={op} />);
      else if(ip)
        ports.push(<Input.break port={ip}/>);
      else
        ports.push(<Output.break port={op}/>);
    }
 
    return <node x={node.position.x} y={node.position.y}>
      <Caption node={node} />
      <div.ports>{ports}</div>
      <Controls node={node} />
    </node>;
  }

  inputSocketPosition(inputPort) { // returns center point of the port marker
                                   // relative to NodeView container
    const sock = this.$(`div.port.input[index=${inputPort.index}]>.socket`);
    console.assert(sock.port === inputPort);
    return sock.positionInDocument();
  }
  outputSocketPosition(outputPort) {
    const sock = this.$(`div.port.output[index=${outputPort.index}]>.socket`); 
    console.assert(sock.port === outputPort);
    return sock.positionInDocument();    
  }

  ["on mouseup"](evt) {
    this.scrollIntoView();
  }

  ["on contextmenu"](evt) {
    const deleteNode = () => { 
       console.log("about delete-node", this.node );
       this.postEvent(new Event("delete-node",{ bubbles:true, data: this.node })); 
    }
    const renameNode = () => { 
       //this.postEvent(new Event("delete-node",{ bubbles:true, data: this.node })); 
    }

    const menuItems = [
      <li.remove-node onclick={deleteNode}>Delete Node</li>,
      <li.rename-node onclick={renameNode}>Rename Node</li>
    ];
    evt.source = Element.create(<menu.context>{menuItems}</menu>);
    return true;
  }

  static connect(port1,port2) {
    Node.connect(port1,port2);
    port1.node.componentUpdate();
    port2.node.componentUpdate();
  }

  static disconnect(port1,port2) {
    Node.disconnect(port1,port2);
    port1.node.componentUpdate();
    port2.node.componentUpdate();
  }

}
