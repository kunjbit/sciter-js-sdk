
import {getKernel} from "kernels.js";
const  {Point} = Graphics;

function contains(iter,item) {
  for(const el of iter)
    if(el === item) return true;
  return false;
}

class Port {
  node;
  index; // in node input or output vectors
  isInput;
  name;
  type;
  data;       // current value at this port
  peers = []; // connections: other ports this port is connected with

  constructor(node,index,type,name,isInput) {
    this.node = node;
    this.index = index;
    this.type = type;
    this.name = name;
    this.isInput = isInput;
  }

  connectWith(other /*port*/) {
    console.assert(this.isInput != other.isInput);
    console.assert(!this.peers.find(port => port === other));
    this.peers.push(other);
    this.node.notifyContentChange("connect",this);
  }

  disconnectFrom(other /*port*/) {
    this.node.notifyContentChange("disconnect",this);
    const idx = this.peers.indexOf(other);
    console.assert(idx >= 0);
    this.peers.splice(idx,1);
  }

  get key() {
    return `${this.node.id}:${this.index}`;
  }

  get isConnected() {
    return this.peers.length > 0;
  } 

  isConnectibleWith(other) {
    if(this.isInput == other.isInput) return false; 
    if(this.node === other.node) return false;
    if(this.peers.find(port => port === other)) return false;
    if(other.peers.find(port => port === this)) return false;
    if(this.isInput) {
      if(this.isConnected) return false;
      // prevention of closed loops
      const nodes = this.node.getOutboundNodes();
      if(contains(nodes,other.node)) return false;

    } else {
      if(other.isConnected) return false;
      // prevention of closed loops
      const nodes = other.node.getOutboundNodes();
      if(contains(nodes,this.node)) return false;
    }
    return true;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      data: this.data
    };
  }

  static fromJSON(json, node, isInput, index) {
    const port = new Port(node, index, json.type, json.name, isInput);
    port.data = json.data;
    return port;
  }
}

export class Node {
  #id;   // unique id

  name; // human readable name
  inputs = []; // [ports]
  outputs = []; // [ports]
  controls = {}; // control values
  position = Point(0,0);
  kernel;
  parentGroup = null;

  static lastId = 0;    

  constructor(name, id = null) {
    this.name = name;
    if(id !== null) {
      this.#id = id;
      Node.lastId = Math.max(id,Node.lastId);
    } else {
      this.#id = ++Node.lastId;
    }
  }

  get id() { return this.#id; }

  addInput(type,name=null) {
    const port = new Port(this,this.inputs.length,type,name,true); 
    this.inputs.push(port);
    return port;
  }

  getInput(key) {
    if( typeof key == "number" ) return this.inputs[key];
    else return this.inputs.find(input => input.name == key);
  }

  addOutput(type,name=null) {
    const port = new Port(this,this.outputs.length,type,name,false);
    this.outputs.push(port);
    return port;
  }

  getOutput(key) {
    if( typeof key == "number" ) return this.outputs[key];
    else return this.outputs.find(input => input.name == key);
  }

  getInputValues() { 
    function reducer(obj,port) { obj[port.name] = port.data; return obj; }
    return this.inputs.reduce(reducer,{});
  }

  getControlValues() {
    return this.controls;
  }

  // values is an object {"A+B":val,...}
  setControlValues(values) { 
    this.controls = values;
  }

  getOutputValues() {
    function reducer(obj,port) { obj[port.name] = port.data; return obj; }
    return this.outputs.reduce(reducer,{});
  }

  * connections(dir = null) { // out === null - all 
                              // dir === "out" - only outputs
                              // out === "in" - only inputs
    if(dir != "in") {
      for(const outputPort of this.outputs)
        for( const inputPort of outputPort.peers)
          yield [outputPort,inputPort];
    }
    
    if(dir != "out") {
      for(const inputPort of this.inputs)
        for( const outputPort of inputPort.peers)
          yield [outputPort,inputPort];
    }
  }

// returns list (iterator) of nodes reacheable from output ports of this node.
  // the list contains this node too.
  getOutboundNodes() {
    const nodes = new Set(); // nodes
    nodes.add(this);
    const scanPort = (port) => {
      for(const otherPort of port.peers) {
        const otherNode = otherPort.node;
        if(nodes.has(otherNode)) continue;
        nodes.add(otherNode);
        for(const port of otherNode.outputs)
          scanPort(port);
      }
    };
    for( const outputPort of this.outputs )
      scanPort(outputPort);
    return nodes.keys();
  }

  moveTo(position) {
    this.position = position;
    this.notifyContentChange("position");
  }

  notifyContentChange(what,arg) {
    if( this.parentGroup ) 
      this.parentGroup.notifyContentChange(this,what,arg);
  }

  static connect(thisPort, otherPort) {
    thisPort.connectWith(otherPort);
    otherPort.connectWith(thisPort);
  }

  static disconnect(thisPort, otherPort) {
    thisPort.disconnectFrom(otherPort);
    otherPort.disconnectFrom(thisPort);
  }

  static fromKernel(kernel, position) {
    if(typeof kernel == "string")
      kernel = getKernel(kernel);
    const node = new Node(kernel.name || kernel.id);
    for (const [name, type] of Object.entries(kernel.inputs))
      node.addInput(type,name);
    for (const [name, type] of Object.entries(kernel.outputs))
      node.addOutput(type,name);
    node.kernel = kernel;
    node.position = position || Point(0,0);
    return node;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      inputs: this.inputs.map(input => input.toJSON()),
      outputs: this.outputs.map(output => output.toJSON()),
      controls: this.controls,
      position: [this.position.x, this.position.y],
      kernel: this.kernel.id,
    };
  }

  static fromJSON(json,group) {

    if(json.group)
      return NodeGroup.fromJSON(json,group);

    const node = new Node(json.name,json.id);
    node.inputs = json.inputs.map((json,index) => Port.fromJSON(json,node,true,index));
    node.outputs = json.outputs.map((json,index) => Port.fromJSON(json,node,false,index));
    node.controls = json.controls;
    node.position = Point(json.position[0],json.position[1]);
    node.kernel = getKernel(json.kernel);
    node.parentGroup = group;
    return node;
  }

  async evaluate(valueObserver) {

    valueObserver.onEnterEvaluation(this);

    // get inputs for the evaluator - data from each input port
    const inputValues = this.getInputValues(); // {}
    // get control values for the evaluator - data from each control
    const controlValues = this.getControlValues();
    // initialize outputs map
    const outputValues = {};
    try {
    // call kernel's evaluate and get output values
      this.kernel.evaluate(this,inputValues,controlValues,outputValues);
    } catch(e) {
      valueObserver.onEvaluationError(this,e);
      valueObserver.onLeaveEvaluation(this);
      return;
    }

    const queue = new Set(); // affected output nodes

    //this.setOutputValues(output);

    for(const outputPort of this.outputs) {
      // fill data of each output port of this node
      const val = outputValues[outputPort.name];
      outputPort.data = val;
      // propagate the data to peers - input ports of connected nodes
      for(const inputPort of outputPort.peers) {
        if(inputPort.data == val) continue;
        inputPort.data = val; // set their input data      
        queue.add(inputPort.node);      
      }
    }

    valueObserver.onValueChange(this);

    for(const outputNode of queue)
      outputNode.evaluate(valueObserver);

    valueObserver.onLeaveEvaluation(this);
  }

}

// group content observer, object with the method:
//   observer.onContentChange(node,change:"add"|"remove"|"connected"|"disconnected"|"position", [port])

// value observer, object with theses methods:
//    observer.onEnterEvaluation(node); - evalution of the node started
//    observer.onLeaveEvaluation(node); - evalution of the node ended
//    observer.onValueChange(node) - called on output value[s] change
//    observer.onEvaluationError(node, error) - error


///
/// Group a.k.a. "document" , can be "sub-document"
///

export class Group {
  name;
  nodes = []; 
  #contentObservers; // set or null
  #valueObservers; // set or null

  constructor(name) {
    this.name = name;
  }

  addNode(node) { 
    node.parentGroup = this;
    this.nodes.push(node);
    this.notifyContentChange(node,"add");
    return this; 
  }
  
  deleteNode(node) { 
    console.assert(node.parentGroup === this);
    for(const [outputPort,inputPort] of node.connections())
      Node.disconnect(outputPort,inputPort);
    const idx = this.nodes.indexOf(node);
    console.assert(idx >= 0);
    this.nodes.splice(idx,1);
    this.notifyContentChange(node,"remove");
    node.parentGroup = null;
    return this; 
  }

  // observers and notifications
  attachContentObserver(co) { 
    if(!this.#contentObservers)
      this.#contentObservers = new Set();
    this.#contentObservers.add(co); 
  }
  detachContentObserver(co) { 
    this.#contentObservers.delete(co); 
    if(!this.#contentObservers.size)
      this.#contentObservers = null;
  }

  attachValueObserver(eo) { 
    if(!this.#valueObservers)
      this.#valueObservers = new Set();
    this.#valueObservers.add(eo); 
  }

  detachValueObserver(eo) { 
    this.#valueObservers.delete(eo); 
    if(!this.#valueObservers.size)
      this.#valueObservers = null;
  }

  notifyContentChange(node,change,arg) {
    if(this.#contentObservers)
      this.#contentObservers.forEach(observer => observer.onContentChange(node,change,arg));
  }

  notifyValueChange(node) {
    if(this.#valueObservers)
      this.#valueObservers.forEach(observer => observer.onValueChange(node));
  }

  get isEmpty() {
    return this.nodes.length == 0; 
  }

  // finds diconnected ports 
  getDanglingPorts(dir /* "in"|"out" */) {
     const out = [];
     for(const node of this.nodes) {
       const ports = dir == "in" ? node.inputs : node.outputs;
       for(const port of ports) {
         if(!port.isConnected)
           out.push(port);
       }
     }
     return out;
  }

  getInputNodes() {
    return this.nodes.filter(node => node.kernel.id.startsWith("input"));
  }

  getNode(nodeId) {
    return this.nodes.find(node => node.id == nodeId);
  }

  toJSON() {

    const connections = [];
    for(const node of this.nodes) 
      for( const connection of node.connections("out") ) {
        const [outputPort,inputPort] = connection;
        connections.push([outputPort.node.id,outputPort.index,
                          inputPort.node.id,inputPort.index]);
      }

    return {
      //id: this.id,
      name: this.name,
      nodes: this.nodes.map(node => node.toJSON()),
      connections: connections
    };
  }

  static fromJSON(json) {
    const group = new Group(json.name);
    group.nodes = json.nodes.map(json => Node.fromJSON(json,group));
    //const map = new Map(); for(const node of group.nodes) map.set(node.id,node);
    for(const [srcNodeId,srcPortId,dstNodeId,dstPortId] of json.connections) {
       const srcNode = group.getNode(srcNodeId); console.assert(srcNode);
       const dstNode = group.getNode(dstNodeId); console.assert(dstNode);
       const srcPort = srcNode.getOutput(srcPortId); console.assert(srcPort);
       const dstPort = dstNode.getInput(dstPortId); console.assert(dstPort);
       Node.connect(srcPort, dstPort);
    }
    return group;
  }
  
}


// this is a proxy port from outside to inners of sub group
class ProxyPort extends Port {
  otherPort;
  constructor(node,index, otherPort) {
    super(node,index,otherPort.type,otherPort.name,otherPort.isInput);
    this.otherPort = otherPort;
    this.data = otherPort.data;
  }
}

// Node that wraps Group
export class NodeGroup extends Node {
  group;

  constructor(group, id = null) {
    super(group.name, id);
    this.group = group;
    this.kernel = {id:"group"};
    this.inputs = group.getDanglingPorts("in").map((port,index) => new ProxyPort(this,index,port));
    this.outputs = group.getDanglingPorts("out").map((port,index) => new ProxyPort(this,index,port));
  }

  async evaluate(valueObserver) {

    valueObserver.onEnterEvaluation(this);

    // I. propagate inputs to internal inputs

    const inputNodes = new Set(); // affected output nodes

    for(const port of this.inputs) {
      port.otherPort.data = port.data;    
      inputNodes.add(port.otherPort.node);
    }

    // evaluate internal input nodes 
    for(const inputNode of inputNodes) {
      await inputNode.evaluate(valueObserver);
    }

    // II. propagate outputs

    const queue = new Set(); // affected output nodes

    for(const outputPort of this.outputs) {
      // fill data of each output port from internal port
      const val = outputPort.data = outputPort.otherPort.data;
      // propagate the data to peers - input ports of connected nodes
      for(const inputPort of outputPort.peers) {
        if(inputPort.data == val) continue;
        inputPort.data = val; // set their input data      
        queue.add(inputPort.node);      
      }
    }

    valueObserver.onValueChange(this);

    for(const outputNode of queue) {
      outputNode.evaluate(valueObserver);
    }

    valueObserver.onLeaveEvaluation(this);

  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      inputs: this.inputs.map(input => input.toJSON()),
      outputs: this.outputs.map(output => output.toJSON()),
      position: [this.position.x, this.position.y],
      group: this.group.toJSON(),
    };
  }

  static fromJSON(json,parentGroup) {

    if(json.kernel)
      return new Node(json,parentGroup);

    const group = Group.fromJSON(json.group);
    const node = new NodeGroup(group,json.id);
    node.position = Point(json.position[0],json.position[1]);
    node.parentGroup = parentGroup;
    return node;
  }


}


