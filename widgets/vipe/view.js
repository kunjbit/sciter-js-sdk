import {Node,Group} from "model.js";
import {NodeView} from "model-view.js";
const  {Point,Rect} = Graphics;

//function circlePath(c,r) {
//  return `M ${c.x} ${c.y} m -${r} 0 a ${r} ${r} 0 1 0 ${r*2} 0 a ${r} ${r} 0 1 0 -${r*2} 0`
//}

function connectionPath(src /*Point*/, dst/*Point*/, curvature = 0.9) {
  const delta2 = (src - dst) / 2;
  const vertical   = Math.abs(delta2.y);
  const horizontal = Math.abs(delta2.x);;
  const t = Math.max(vertical, horizontal) * curvature;
  const hx1 = src.x + t;
  const hx2 = dst.x - t;
  return `M ${src.x} ${src.y} C ${hx1} ${src.y} ${hx2} ${dst.y} ${dst.x} ${dst.y}`;
}

function connectionKey([outputPort,inputPort]) {
  return `${outputPort.key}:${inputPort.key}`;
}

export class View extends Element {
  state = {};
  group; // NodeGroup, a.k.a. Document
  #nodeViews;  // {node : nodeView}
  
  #connectors; // Map{connectionKey : Graphics.Path}

  #higlightedConnector = null; // Graphics.Path
  #connectingPath = null; // candidate connection Graphics.Path
  #connectingPort = null; // candidate connection port
  #contentObserver = null;

/*  constructor({group,state}) {
    super();
    this.group = group;
    this.state = state;
    this.#nodeViews = new WeakMap(); 
    this.#connectors = new Map(); //{connectionKey:Graphics.Path}
    group.attachContentObserver(this);
    group.attachValueObserver(this);
  }*/

  componentWillUnmount() {
    this.group.detachContentObserver(this);
    this.group.detachValueObserver(this);
  }

  this({group,state}) {
    if(group !== this.group) {
      this.clear();
      if(this.group) {
        this.group.detachContentObserver(this);
        this.group.detachValueObserver(this);
      }
      this.group = group;
      this.state = state;
      this.#nodeViews = new WeakMap(); 
      this.#connectors = new Map(); //{connectionKey:Graphics.Path}
      group.attachContentObserver(this);
      group.attachValueObserver(this);
    }
  }

  render() {
    return <section.view styleset={__DIR__ + "view.css#view"} zoom={this.state.zoom || 100}>    
      {this.nodes.map( node => <NodeView key={node.id} node={node} /> )}
    </section>;
  } 

  get nodes() { return this.group.nodes; }

  get connectors() { // connector paths as a map [connectionKey,Graphics.Path]
    const nodeViews = this.#nodeViews;
    const oldmap = this.#connectors;
    const newmap = new Map();
    for(const nodeView of this.children) {
      if(nodeView.tag !== "node") continue;
      const node = nodeView.node;
      for( const connection of node.connections("out") ) {
        const key = connectionKey(connection);
        //const path = connectors.get(connectionKey);
        const [outputPort,inputPort] = connection;
        const otherNodeView = nodeViews.get(inputPort.node);
        const srcLocation = nodeView.outputSocketPosition(outputPort);
        const dstLocation = otherNodeView.inputSocketPosition(inputPort);
        const oldpath = oldmap.get(key);
        let newpath;
        if( !oldpath || oldpath.src != srcLocation || oldpath.dst != dstLocation ) {
          newpath = new Graphics.Path(connectionPath(srcLocation,dstLocation));
          newpath.src = srcLocation;
          newpath.dst = dstLocation;
          newpath.key = key;
        } else 
          newpath = oldpath;
        newmap.set(key,newpath);
      }
    }
    return this.#connectors = newmap;
  }

  paintContent(gfx) {
    // paint connectors
    const highlightedPath = this.#higlightedConnector;
    gfx.strokeStyle = this.style.variable("connector-color");
    gfx.strokeWidth = 3 * this.zoom;
    gfx.pushLayer("client-box");
    gfx.translate(-this.scrollPosition);
    for(const path of this.connectors.values()) {
      if(path !== highlightedPath)
        gfx.stroke(path);
    }
    if(highlightedPath) {
      gfx.strokeStyle = this.style.variable("connector-hover-color");
      gfx.stroke(highlightedPath);
    }
    gfx.popLayer();
  }

  paintForeground(gfx) {
    // paint candidate connector
    if(this.#connectingPath) {
      gfx.strokeWidth = 3 * this.zoom;
      gfx.pushLayer("client-box");
      gfx.translate(-this.scrollPosition);
      gfx.strokeStyle = this.style.variable("connector-hover-color");
      gfx.stroke(this.#connectingPath);
      gfx.popLayer();
    }
  }

  registerNodeView(node,nodeView) {
    this.#nodeViews.set(node,nodeView);
  }

  viewOf(node) /*NodeView*/ {
    return this.#nodeViews.get(node); 
  }

  get zoom() {
    return parseFloat(this.state.zoom || 100) / 100.0; // normalized to 1.0
  }

  performNodeMove(nodeView,offset) {
    this.elementState.capture("strict");
    this.onmousemove = evt => {
      const contentPosition = (evt.contentPosition - offset) / this.zoom;
      nodeView.node.moveTo(contentPosition.inscribe(Rect(0,0,10000,1000)));
      nodeView.patch(nodeView.render());
      Window.this.update(true);
    }
    Window.this.doEvent("untilMouseUp");
    delete this.onmousemove;
    this.elementState.capture(false);
  }

  highlightConnector(pathOrNull) {
    if(this.#higlightedConnector?.key == pathOrNull?.key)
      return;
    this.#higlightedConnector = pathOrNull;
    this.requestPaint();
  }

  onmousemove(evt) {
    if( this.elementState.ownspopup ) 
      return; // we have context menu running, keep selection intact
    let toHighlight = null; // Path
    if(evt.target === this) {
      // find connector (of any) to highlight
      let position = evt.contentPosition;
      for(const path of this.connectors.values()) {
        if(path.isPointOnStroke(10,position)) {
          toHighlight = path;
          break;
        }
      }
    }
    this.highlightConnector(toHighlight);
  }

  oncontextmenu(evt) {
    //if(this.target !== this) return;
    const menuItems = [];
    if(this.#higlightedConnector)
      menuItems.push(<li.remove-connection connection={this.#higlightedConnector.key}>Delete Connection</li>);
    else
      menuItems.push(<li.add-node>Add Node</li>);
    evt.source = Element.create(<menu.context>{menuItems}</menu>);
    return true;
  }

  // get port references from given connection key, string: %d:%d:%d:%d 
  connectionPorts(connectionKey) // returns [outPort,inPort]
  {
    const [outNodeId,outPortId,inNodeId,inPortId] = scanf("%d:%d:%d:%d",connectionKey);
    const outNode = this.nodes.find( node => node.id == outNodeId );
    const inNode = this.nodes.find( node => node.id == inNodeId );
    console.assert(outNode);
    console.assert(inNode);
    return [outNode.outputs[outPortId],inNode.inputs[inPortId]];
  }

  ["on click at li.remove-connection"](evt,li) {
    const connectionKey = li.attributes["connection"];
    const [outPort,inPort] = this.connectionPorts(connectionKey);
    Node.disconnect(outPort,inPort); // remove the connection in model.
  }

  ["on ^mousedown at li.add-node"](evt,li) {
    const group = document.$('select|list#groups').value;
    if (group == null) return;
    const item = document.$('select|list#items').value;
    if (item == null) return;
    const data = {
      kernel: `${group}/${item}`,
      position: evt.position
    };
    this.postEvent(new Event("create-node",{data}));
  }
  
  performOutputConnection(port,position) {
    this.elementState.capture(true);
    let otherPort = null;
    this.#connectingPort = port;
    this.on("mousemove.perform", evt => {
      let {target,contentPosition} = evt;
      const inputSocket = target.$p(".port.input>.socket");
      if(inputSocket && this.isAcceptableInputPort(inputSocket.port)) {
        contentPosition = inputSocket.positionInDocument();
        otherPort = inputSocket.port;
      } else
        otherPort = null;
      this.#connectingPath = new Graphics.Path(connectionPath(position,contentPosition));
      this.requestPaint();
      Window.this.update(true);
    });
    Window.this.doEvent("untilMouseUp");
    this.#connectingPath = null;
    this.#connectingPort = null;    
    this.off(".perform");
    this.elementState.capture(false);
    if(otherPort)
      Node.connect(port,otherPort);
    this.requestPaint();
  }

  performInputConnection(port,position) {
    this.elementState.capture(true);
    let otherPort = null;
    this.#connectingPort = port;
    this.on("mousemove.perform", evt => {
      let {target,contentPosition} = evt;
      const outputSocket = target.$p(".port.output>.socket");
      if(outputSocket && this.isAcceptableInputPort(outputSocket.port)) {
        contentPosition = outputSocket.positionInDocument();
        otherPort = outputSocket.port;
      } else
        otherPort = null;
      this.#connectingPath = new Graphics.Path(connectionPath(contentPosition,position));
      this.requestPaint();
      Window.this.update(true);
    });
    Window.this.doEvent("untilMouseUp");
    this.#connectingPath = null;
    this.#connectingPort = null;
    this.off(".perform");
    this.elementState.capture(false);
    if(otherPort)
      Node.connect(port,otherPort);
    this.requestPaint();
  }

  isAcceptableInputPort(port) {
    if(this.#connectingPort)
      return this.#connectingPort.isConnectibleWith(port);
    return !port.hasConnections;
  }
  isAcceptableOutputPort(port) {
    if(this.#connectingPort)
      return this.#connectingPort.isConnectibleWith(port);
    return true;
  }

  ["on value-change"](evt) {
    const node = evt.data;
    node.evaluate(this);
    return true;
  }

  ["on create-node"](evt) {
    const {kernel,position} = evt.data;
    console.log(kernel, position);
    const node = Node.fromKernel(kernel,position);
    this.group.addNode(node);
    return true;
  }

  ["on delete-node"](evt) {
    const node = evt.data;
    console.log("delete-node",node);
    this.group.deleteNode(node);
    return true;
  }

  // content oserver
  onContentChange(node,how,arg) {
    switch(how) {
      case "add": 
        this.componentUpdate(); 
        break;
      case "remove": 
        this.componentUpdate(); 
        break;
      case "disconnect": 
        {
          const port = arg;
          if(port.isInput) {
            port.data = undefined;
            node.evaluate(this);
          } 
          this.viewOf(node).componentUpdate();
        }
        break;
      case "connect": 
        {
          const port = arg;
          if(port.isInput) {
            port.data = port.peers[0].data;
            node.evaluate(this);
          } 
          this.viewOf(node).componentUpdate();
        }
        break;
      case "position":
        //const nodeView = this.viewOf(node);
        //nodeView.patch(nodeView.render());
        //Window.this.update(true);
        break;
    }
  }

  // evaluation observer 

  #evaluationNestingLevel = 0;

  onEnterEvaluation(node) { // - evalution of the node started
    if(++this.#evaluationNestingLevel == 1) {
      this.postEvent(new Event("evaluation-start"));
    }
  }
  onLeaveEvaluation(node) { // - evalution of the node ended
    if(++this.#evaluationNestingLevel == 0) {
      this.postEvent(new Event("evaluation-end"));
    }
  }
  onValueChange(node) {   // - called on output value[s] change
    const nodeView = this.viewOf(node);
    if(nodeView) nodeView.componentUpdate();
  }
  onEvaluationError(node, error) { // - error
    const nodeView = this.viewOf(node);
    if(nodeView) nodeView.componentUpdate({error: error.toString()});
  }

}

