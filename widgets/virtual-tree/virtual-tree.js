
export class TreeController {
  keyOf(item) { return item.id ?? item.text }
  textOf(item) { return item.text } // may return VDOM
  isNode(item) { return Array.isArray(item.items) }
  kidsOf(item) { return item.items }
}

export class VirtualTree extends Element {
  roots;
  controller;
  treelines;
  #openNodes = new Set(); // keys of open nodes

  this({roots,controller,treelines}) {
    this.treelines = treelines;
    this.controller = controller ?? new TreeController();
    this.roots = roots || controller.roots;    
  }
  
  rootItems() { return this.roots || []; }

  renderItem(item) {
    const controller = this.controller;
    const key = controller.keyOf(item);
    const text = controller.textOf(item);
    if(controller.isNode(item)) {
      const expanded = this.#openNodes.has(key);
      let children = [];
      if(expanded) {
        const items = controller.kidsOf(item);
        children = items.map(item => this.renderItem(item));
      }
      return <option.node key={key} state-data={item} expanded={expanded}>
        <caption>{text}</caption>
        {children}
      </option>
    } else { // terminal
      return <option key={key} state-data={item}><caption>{text}</caption></option>;
    }
  }

  render() {
    const roots = this.rootItems();
    const atts = this.treelines ? {treelines:true} : {};
    return <select|tree {atts}>{
      roots.map(item => this.renderItem(item))
    }</select>
  }

  ["on expand at option"](e,option) {
     const item = option.data;
     this.#openNodes.add(this.controller.keyOf(item));
     option.patch(this.renderItem(item));
     return true;
  }
  ["on collapse at option"](e,option) {
     const item = option.data;
     this.#openNodes.delete(this.controller.keyOf(item));
     option.patch(this.renderItem(item));
     return true;
  }

  ["on dblclick at option:not(:node)"](e,option) {
     const data = option.data;
     this.postEvent(new Event("item-activate",{bubbles:true,data}));
     //console.log(data);
     return true;
  }


}