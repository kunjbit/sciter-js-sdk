
export class EditableLabel extends Element {

  #textBefore;

  componentDidMount() {
    this.#textBefore = this.innerText; // <label.editable>text</label>
  }
  
  get value() { return this.innerText; }
  set value(v) {
    this.#textBefore = v;
    this.innerText = v;
  }

  startEditing()  { 
    this.classList.add("editing"); 
    this.#textBefore = this.innerText;    
    this.post(() => { 
      this.state.value = this.#textBefore;
      this.edit.selectAll();
      this.state.focus = true;
    }); 
  }
  commitEditing() { this.classList.remove("editing"); }
  cancelEditing() { this.classList.remove("editing"); this.innerText = this.#textBefore; }

  onblur() { this.commitEditing(); }

  onkeyup(evt) {
    switch(evt.code) {
      case "Enter":  this.commitEditing(); break;
      case "Escape": this.cancelEditing(); break;
    }
  }

  onmouseup(evt) {
    if(evt.isOnIcon)
      this.classList.contains("editing") ? this.commitEditing() : this.startEditing();
  }

}

