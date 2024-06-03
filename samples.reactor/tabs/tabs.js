
export class Tabs extends Element {

    labels = [];  // tab labels
    current = 0; 

    constructor({labels,sections,current}) {
      super();
      this.labels = labels;     // string or <>...</>
      this.sections = sections; // class name
      this.current = current ?? 0;
    }

    render() {
       const labels = this.labels.map((label,index) => <label key={index} current={index == this.current}>{label}</label>);
       const currentTab = JSX(this.sections[this.current],{},[]);
       return <tabs styleset={__DIR__ + "tabs.css#tabs"}>
         <labels>{labels}</labels>
         {currentTab}
       </tabs>;
    }

    get tab() { return this.current; }
    set tab(index) { this.componentUpdate({current:index}) }

    ["on press at label[current=false]"](evt,label) {
       const index = label.attributes["key"];
       this.tab = index;
       return true;
    }
}
