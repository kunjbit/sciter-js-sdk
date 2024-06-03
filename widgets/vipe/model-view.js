
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

  /*return <div.port.output index={port.index}>
    <text>{port.name ? printf("%s : %s",port.name,port.type) : port.type}</text>
    <OutputSocket port={port} />
  </div>;*/
  const val = port.data ?? port.type;
  return <div.port.output index={port.index}>
    <div><label>{port.name}:</label><var>{val}</var></div>
    <OutputSocket port={port} />
  </div>;
}

function Input({port}) {
  //return <div.port.input index={port.index}>
  //  <text>{port.name ? printf("%s : %s",port.name, port.type) : port.type}</text>
  //  <InputSocket port={port} />
  //</div>;
  const val = port.data ?? port.type;
  return <div.port.input index={port.index}>
    <div><label>{port.name}:</label><var>{val}</var></div>
    <InputSocket port={port} />
  </div>;
}

class NodeControls extends Element {
  node;
  constructor({node}) {
    super();
    this.node = node;
  }
  render() {
    const node = this.node;
    const outputValues = node.getOutputValues();
    const controlValues = node.getControlValues();
    const content = node.kernel.render ? node.kernel.render(node,controlValues,outputValues) : [];
    return <div.controls>{ content }</div>;
  }
  ["on change at :root > *"](evt) {
    const namedCtls = this.$$("[name]");
    function reducer(obj,ctl) { obj[ctl.attributes.name] = ctl.value; return obj; }
    this.node.setControlValues( namedCtls.reduce(reducer,{}) );
    this.parentElement.postEvent(new Event("value-change", {bubbles:true,data:this.node}));
  }
}

class GroupControls extends Element {
  node;
  group;
  constructor({node}) {
    super();
    this.node = node;
    this.group = node.group;
  }
  render() {
    const list = [];
    for( const node of this.group.getInputNodes() ) {
      list.push(<label>{node.name}:</label>);
      list.push(<Controls node={node}/>);
    }
    return <div.group.controls>{ list }</div>;
  }
  ["on change"](evt) {
    this.parentElement.postEvent(new Event("value-change", {bubbles:true,data:this.node}));
  }

}

function Controls(props,kids) {
  const node = props.node;
  return node.group?<GroupControls node={node} />:<NodeControls node={node} />; 
}

class Caption extends Element {
  node;
  renaming = false;
  originalName;
  this({node}) {
    this.node = node;
  }
  render() {
    if(this.renaming) {
      this.post(() => { 
        this.originalName = this.value;
        this.edit.selectAll();
        this.state.focus = true;
      });
      return <caption.renaming>{this.node.name}</caption>;
    }
    else
      return <caption>{this.node.name}</caption>;
  }

  onchange() {
    this.node.name = this.value;
    return true;
  }

  onblur() {
    this.componentUpdate({renaming:false});
  }

  onkeyup(evt) {
    switch(evt.code) {
      case "Enter": this.componentUpdate({renaming:false}); return true;
      case "Escape": this.node.name = this.value = this.originalName; this.componentUpdate({renaming:false}); return true;
    }
  }

  onmousedragrequest(evt) {
    if(this.renaming) return false;
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

    const atts = node.group ? {group:true} : {};
 
    return <node x={node.position.x} y={node.position.y} {atts} >
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
       //console.log("about delete-node", this.node );
       this.postEvent(new Event("delete-node",{ bubbles:true, data: this.node })); 
    }
    const renameNode = () => { 
       //this.postEvent(new Event("delete-node",{ bubbles:true, data: this.node })); 
       this.$("caption").componentUpdate({renaming:true});
    }

    const editGroup = () => { 
       //console.log("about delete-node", this.node );
       this.postEvent(new Event("edit-group",{ bubbles:true, data: this.node.group })); 
    }
    
    const duplicateNode = () => {
      const data = {
        kernel: this.node.kernel,
        position: this.node.position + 30,
      };
      this.postEvent(new Event("create-node", { bubbles:true, data: data }));
    }    

    const menuItems = [
      <li.remove-node onclick={deleteNode}>Delete Node</li>,
      <li.rename-node onclick={renameNode}>Rename Node</li>
    ];
    if( this.node.group ){
      menuItems.push(<li.edit-group onclick={editGroup}>Edit Group Node</li>);
    }
    else {
      menuItems.push(<li.duplicate-node onclick={duplicateNode}>Duplicate Node</li>);
    }  
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
