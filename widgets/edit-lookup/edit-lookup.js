

const SuggestionsStyle = CSS.set`
   :root {
     width:*;
     margin-top:3px;
   }
`;

function suggestionMenu(host,provider) {

  let menu;
  let tags;

  function renderMenuFor(text) {
     tags = provider(text);
     return <menu.popup.suggestions styleset={SuggestionsStyle}>
       { tags.map( tag => <li key={tag}>{tag}</li>) }
     </menu>;
  }

  function onclick(evt,li) {
    let tag = tags[li.elementIndex];
    host.value = tag;
    host.post(new Event("lookup",{bubbles:true,data:tag}));
    host.edit.selectAll();
    host.state.focus = true;
    return true;
  }

  function hide() {
    if(menu?.state)
      menu.state.popup = false;
  }

  function show(text) {
    let vmenu = renderMenuFor(text);
    if(menu)
      menu.patch(vmenu);
    else {
      menu = Element.create(vmenu);
      menu.on("click","li",onclick);
    }
    if(!tags || !tags.length )
      return false;
    host.popup(menu);
    return true;
  }

  function focus() {
    if(menu)
      menu.state.focus = true;
  }

  host.on("keydown",function(evt) {
    if( evt.code == "ArrowDown") {
      this.suggestionMenu.show(host.value);
      menu.firstElementChild.state.current = true;
      menu.state.focus = true;
      return true;
    }
  });

  return {
    hide,
    show
  }     
}

const EditLookupStyle = CSS.set`
   :root {
      border-radius:1em;
      padding-left:1em;
      padding-right:2em;
      foreground: no-repeat top 50% right 0.5em;
      foreground-image: url(icon:search);
      foreground-size:1em;
      fill: var(widget-border);
   }
`;

export class EditLookup extends Element {

  suggestionMenu = null;
  suggestor= null;

  constructor({suggestor}) {
    super();
    this.suggestor = suggestor;
  }

  componentDidMount() {
    if(typeof this.suggestor == "string")
      this.suggestor = eval(this.suggestor);
    this.suggestionMenu = suggestionMenu(this,this.suggestor);
  }

  componentWillUnmount() {
    this.suggestionMenu.hide();
  }

  render() {
    return <input|text styleset={EditLookupStyle} />
  }

  ["on change"](evt) {
    if(!this.suggestionMenu) 
      this.suggestionMenu = suggestionMenu(this,this.suggestor);
    if(this.value)
      this.suggestionMenu.show(this.value);
    else 
      this.suggestionMenu.hide();
  }

  ["on keydown"](evt) {
    if( evt.code == "Enter" && this.value) {
      this.post(new Event("lookup",{bubbles:true,data:this.value}));
      return true;
    } else if( evt.code == "Escape" ) {
      this.suggestionMenu.hide();   
      this.value = "";
      this.state.focus = true;
      return true;
    }
  }
}

globalThis.EditLookup = EditLookup;