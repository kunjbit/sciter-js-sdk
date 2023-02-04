
import {fs} from "@sys";
import * as srt from "@sciter";
import {View} from "view.js";
import {Node,Group} from "model.js";
import {getKernel, kernelGroupNames, kernelGroupItems} from "kernels.js";
import {performDrag} from "utils.js";

const FILE_FILTER = "ViPE files *.vipe.json|*.vipe.json|JSON files (*.json)|*.json|All Files (*.*)|*.*";

class Toolbar extends Element {
  group;
  state = {};
  vipe;

  this({group,state,vipe}) {
    this.group = group;
    this.state = state;
    this.vipe = vipe;
  }

  get view() { return this.parentElement.view; }

  render() {
    return <toolbar> 
      <button.back state-disabled={ !this.vipe.canGoBack } @title="previous" />
      <button.fore state-disabled={ !this.vipe.canGoForward } @title="next" />
      <hr/>
      <button.open @title="open" />
      <button.save @title="save" />
      <input|text.name value={this.group.name} />
      <select|switch.zoom value={this.state.zoom || 100}>
         <option value="70">70%</option>
         <option value="80">80%</option>
         <option value="90">90%</option>
         <option value="100">100%</option>
         <option value="120">120%</option>
      </select>
    </toolbar>;
  }
  ["on change at select.zoom"](evt,select) {
    this.state.zoom = select.value;
    //this.postEvent( new Event("state-change", {bubbles:true}) )
    this.parentElement.componentUpdate();
  }
  ["on change at input.name"](evt,input) {
    this.vipe.postEvent(new Event("do",{data:{command:"rename", name:input.value}}));
  }

  ["on click at button.save"]() {
    //this.vipe.postEvent(new Event("do",{data:{command:"save"}}));
    const fileName = Window.this.selectFile({mode: "save",filter:FILE_FILTER});
    if(fileName)
      this.vipe.saveFile(fileName);
    return true;
  }
  ["on click at button.open"]() {
    const fileName = Window.this.selectFile({mode: "open",filter:FILE_FILTER});
    if(fileName)
      this.vipe.loadFile(fileName);
    return true;
  }
  ["on click at button.back"]() {
    this.vipe.goBack();
    return true;
  }
  ["on click at button.fore"]() {
    this.vipe.goForward();
    return true;
  }
}

class Library extends Element {
  currentGroup;
  currentItem;

  render() {
    const groups = kernelGroupNames();
    const items = kernelGroupItems(this.currentGroup);
    return <section.library styleset={__DIR__ + "vipe.css#vipe-library"}>
      <header.groups @>Node Groups</header>
      <select|list #groups value={this.currentGroup}>
       { groups.map( gname => <option value={gname}>{gname}</option> ) }
      </select>
      <header.nodes @>Nodes</header>
      <select|list #items value={this.currentItem}>
       { items.map( iname => <option value={iname}>{iname}</option> ) }
      </select>
    </section>;
  }

  ["on change at select#groups"](evt,select) {
    this.componentUpdate({currentGroup:select.value});
    return true;
  }

  ["on mousedragrequest at select#items > option"](evt,option) {
    const ondrop = (target,position) => {
      const data = {
        kernel: `${this.currentGroup}/${option.value}`,
        position
      };
      target.postEvent(new Event("create-node",{data}));
    }
    performDrag(option,".view",evt,ondrop);
  }
}

export class ViPE extends Element {

  stack; // [{state}]
  stackPosition;

  //group;
  //zoom = 1;

  constructor({group}) {
    super();
    if(!group) group = new Group("(New group)");
    this.stack = [{group}];
    this.stackPosition = 0;
    //this.group.attachValueObserver();
    //this.group.attachContentObserver();
  }

  get currentState() {
    return this.stack[this.stackPosition];
  }

  get currentGroup() {
    return this.currentState.group;
  }

  load(json = null) {
    try {
      const group = json ? Group.fromJSON(json) : new Group("(New group)");
      this.loadGroup(group);
    } catch(e) {
      console.error(e.toString() + "\r\n" + e.stack);
    }
  }

  loadGroup(group) {
    if(this.currentGroup.isEmpty) {
      // replace current stack element
      this.stack.length = this.stackPosition; // prune stack
    } else {
      this.stack[this.stackPosition] = this.view.state;
      this.stack.length = this.stackPosition + 1; // prune stack
    }
    this.stack.push({group});
    this.stackPosition = this.stack.length - 1;
    this.componentUpdate();
  }


  get canGoBack() { return this.stackPosition > 0; }
  goBack() {
    this.stack[this.stackPosition] = this.view.state;
    if(this.canGoBack) {
      --this.stackPosition;
      this.componentUpdate();
    }
  }

  get canGoForward() { return this.stackPosition < this.stack.length - 1; }
  goForward() {
    this.stack[this.stackPosition] = this.view.state;
    if(this.canGoForward) {
      ++this.stackPosition;
      this.componentUpdate();
    }
  }

  get view() { return this.$(".view"); }
  get toolbar() { return this.$("toolbar"); }

  render() {
    const cstate = this.currentState;
    return <vipe styleset={__DIR__ + "vipe.css#vipe"}>
      <Toolbar group={cstate.group} state={cstate} vipe={this} />
      <frameset cols="*,200px">
        <View key={cstate.group.id} group={cstate.group} state={cstate} />
        <Library />
      </frameset>
    </vipe>;
  }

  async loadFile(fileName) {
    try {
      const data = await fs.readFile(fileName);
      const text = srt.decode(data,"utf-8");
      const json = JSON.parse(text);
      this.load(json);
    } catch(e) {
      Window.this.modal(<alert>
          <p>Cannot load file: {fileName}</p>
          <p>Error:{e.toString()}</p>
        </alert>);
    }
  }

  async saveFile(fileName) {
    try {
      const file = await fs.open(fileName,"w");
      const text = JSON.stringify(this.currentGroup.toJSON(), null, "  ");
      const data = srt.encode(text,"utf-8");
      await file.write(data);
      await file.close();
    } catch(e) {
      Window.this.modal(<alert>
          <p>Cannot save file: {fileName}</p>
          <p>Error:{e.toString()}</p>
        </alert>);
    }
  }

  ["on edit-group"](evt) {
    const group = evt.data;
    this.loadGroup(group);
  }


}