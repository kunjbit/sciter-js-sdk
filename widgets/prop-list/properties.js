
class Row extends Element {
    active = false;
    def;
    value;

    constructor(props) {
        super();
        this.def = props.def;
        this.value = this.def.value;
    }

    ["on ^focusout"](evt) { 
        console.log("focusout", evt.target);
        this.deactivate(); 
    }
    ["on ^change"](evt) { 
        //this.value = evt.target.value; 
        this.componentUpdate({value:evt.target.value});
    }

    activeValue() { return this.value; }
    activateValue() {}

    activate() { 
        this.componentUpdate({ active: true }); 
        this.post(this.activateValue);
    }
    deactivate() { 
        this.componentUpdate({ active: false, value:this.activeValue() }) 
    }

    render() {
      const def = this.def;
      return <prop-row state-current={this.active}>
        <label>{def.label}</label>
        {this.renderContent(def,this.active)}
      </prop-row>;
    }
}

class TextRow extends Row {
    renderContent(def,active) {
      if(active)
        return <span><input|text value={this.value || ""} /></span>;
      else
        return <span>{this.value || ""}</span>;
    }

    activeValue() {
        return this.$("input")?.value;
    }

    activateValue() {
        const input = this.$("input");
        input.edit.selectAll();   
        input.state.focus = true;   
    }
}

class CheckBoxRow extends Row {
    renderContent(def,active) {
      return <span><input|checkbox value={this.value} /></span>;
    }

    activeValue() {
        return this.$("input").value;
    }

    activateValue() {
        const input = this.$("input");
        input.state.focus = true;
    }
}

class NumericRow extends Row {
    renderContent(def,active) {
      if(active)
        return <span><input|number value={this.value} step="1" /></span>;
      else
        return <span>{this.value ?? ""} {def.units || ""}</span>;
    }

    activeValue() {
        return this.$("input")?.value;
    }

    activateValue() {
        const edit = this.$("input").firstElementChild;
        edit.edit.selectAll();
        this.$("input").state.focus = true;   
    }
}


class SelectRow extends Row {

    renderContent(def,active) {
      //if(active)
      //  return <span><input|text value={this.value || ""} /></span>;
      //else
      return <span.select>{this.currentLabel}</span>;
    }

    activateValue() {
        const input = this.$("span");
        input.state.focus = true;   
    }

    get currentLabel() {
        const v = this.value ?? this.def.value;
        for(const opt of this.def.options) 
          if(opt.value == v)
            return opt.label;
        return "";
    }

    ["on click at span"](evt,span) {
        const select = span.popup(this.generatePopup(), {anchorAt:3,popupAt:9});
        select.state.focus = true;
        select.value = this.value ?? this.def.value;
    }

    ["on ^mouseup at select"](evt,select) {
        select.state.popup = false;
    }

    ["on keydown at select"](evt,select) {
        if( evt.code == "Enter" || evt.code == "Escape" )
            select.state.popup = false;
    }

    generatePopup() {
        return <select|list>
          {this.def.options.map(opt => <option value={opt.value}>{opt.label}</option>) }
        </select>;
    }
}


class RowGroup extends Element {

    group = null;

    constructor(props) {
        super();
        this.group = props.group;
    }

    render() {
      let items = [];
      const group = this.group;
      const collapsed = group.collapsed;
      //console.log(group,collapsed);
      if(!collapsed)
          for(const def of group.items) {
            let item;
            switch(def.type) {
              case "select": if(def.options) { item = <SelectRow def={def} />; break; }
                             //else fall through
              case "text": item = <TextRow def={def} />; break;
              case "checkbox": item = <CheckBoxRow def={def} />; break;              
              //case "date": item = <Date def={def} />; break;
              case "numeric": item = <NumericRow def={def} />; break;
            }
            items.push(item);
          }
      if(group.label)
        return <prop-group name={group.name}>
          <header state-collapsed={!!collapsed}>{group.label}</header>
          {items}
        </prop-group>;
      else 
        return <prop-group>{items}</prop-group>;
    }

   ["on mousedown at header"](evt,header) {
      console.log(evt,evt.isOnIcon);
      if(evt.isOnIcon) {
        this.group.collapsed = !this.group.collapsed;
        this.componentUpdate();
      }
    }

}

export class Properties extends Element {

    defs;
    vals;

    constructor(props) {
        super();
        this.defs = props.defs;
        this.vals = props.values;
    }

    render() {
      let items = [];
      for(const def of this.defs) {
        if(def.items) {
          items.push(<RowGroup group={def} />);
        }
        /*else switch(def.type) {
          case "text": item = <TextRow def={def} />; break;
          case "select": item = <Select def={def} />; break;
          case "checkbox": item = <CheckBox def={def} />; break;
          case "date": item = <Date def={def} />; break;
          case "integer": item = <Integer def={def} />; break;
        }*/
      }
      return <div.properties #test styleset={__DIR__ + "properties.css#properties"}>{items}</div>;
    }

    ["on ^mousedown at prop-row"](evt,row) {
      const activeRow = this.$("row:current");
      if(activeRow === row) return;
      if(activeRow) activeRow.deactivate();
      row.activate();
    }

 
}