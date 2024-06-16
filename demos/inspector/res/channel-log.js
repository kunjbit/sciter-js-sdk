
import {SublimatedObject, SublimatedValue} from "value.js";

const CLASS_NAMES = ["info", "warning", "error"];
const SUBSYTEM_NAMES = ["dom", "csss", "css", "script", "eval"];


// whole log list item, a.k.a. message
function LogListItem(props) {
  const logitem = props.logitem;
  const channel = props.channel;
  if (logitem === "---")
    return <hr/>;
  else { 
    const content = logitem.items.map((val, key) => SublimatedValue(channel, val, key, true));
    return <li role="option" class={ CLASS_NAMES[logitem.severity] + " " + SUBSYTEM_NAMES[logitem.subsystem]}>{content}</li>;
  }
}

export class ChannelLog extends Element {
  channel = null;
  scrollLock = false;
  constructor(props) {
    super();
    this.channel = props.channel;
    this.eval_history_index = -1;
  }

  componentDidMount() {
    // console.log("ChannelLog componentDidMount");
    this.handler = (evt) => {
      if (evt.detail === this.channel) {
        this.componentUpdate(); 
        if(!this.scrollLock)
          this.timer(20, this.autoScroll);
      }
    };
    document.on("log-new", this.handler);
  }

  componentWillUnmount() {
    document.off(this.handler);
  }
  
  autoScroll() {
    this.$("list").lastElementChild?.scrollIntoView({behavior: "smooth"});
  }

  render(props) {
    const channel = this.channel;
    const list = channel.theirLogs.map( item => <LogListItem channel={channel} logitem={item} key={item.key} />);

    return <section#channel-log styleset="facade.css#channel-log">
      <list>{list}</list>
      <textarea #toeval placeholder="eval: this - selected element" spellcheck="false" />
      <button#scroll-lock state-checked={ this.scrollLock } title="Scroll Lock"/>
    </section>; 
  }

  ["on ^keydown at textarea#toeval"](evt, textarea) {
    if (evt.code === "ArrowUp") {
      // populate textarea with the next previous eval (if any)
      const prev_eval = this.getNextPrevEval();
      textarea.value = prev_eval;
      return true; // consume
    } else if (evt.code === "ArrowDown") {
      // populate textarea with next eval
      const next_eval = this.getNextEval();
      textarea.value = next_eval; // set to next eval in history
      return true; // consume
    }
    if (evt.code != "Enter") return;
    if (evt.shiftKey || evt.ctrlKey) return;
    const toeval = textarea.value.trim();
    if (!toeval) return;  // don't eval empty string
    this.channel.theirLogs.push({
      severity: 0,
      subsystem: 4, // "eval"
      items: [toeval],
    });
    this.channel.notify("toeval", toeval);
    textarea.value = ""; // clear textarea after eval
    this.eval_history_index = -1; // reset eval history index
    return true; // do not propagate, consumed
  }

  ["on click at button#scroll-lock"](evt) {
    this.componentUpdate({scrollLock: !this.scrollLock});
    return true;
  }
/*
  ["on focus at list"](evt) {
    this.componentUpdate({scrollLock: true});
    return true;
  }
*/
  

  list2clipboard() {
    let text = "";
    for (const opt of this.$$("list>li:checked")) {
      if (text) text += "\r\n";
      text += opt.textContent;
    }
    Clipboard.writeText(text);
  }

  get evals() {
    return this.channel.theirLogs.map((item) => {
      if (item.subsystem != 4) return null;
      return item.items[0];
    }).filter((item) => item);
  }

  getEvalAtIndex(index) {
    // get the nth eval from the end
    const evals = this.evals;
    if (!evals.length) return null;
    return evals[evals.length - 1 - index];
  }

  getNextEval() {
    // get the next eval in history
    this.eval_history_index = Math.max(this.eval_history_index - 1, -1); // don't go below -1 (aka. no previous eval)
    return this.getEvalAtIndex(this.eval_history_index);
  }

  getNextPrevEval() {
    // get the next previous eval in history
    this.eval_history_index = Math.min(this.eval_history_index + 1, this.evals.length - 1); // don't go above the last eval
    return this.getEvalAtIndex(this.eval_history_index);
  }

  ["on keydown"](evt) {
    if (evt.code === "KeyC" && evt.ctrlKey) {
      this.list2clipboard();
      return true;
    }
    if (evt.code === "KeyA" && evt.ctrlKey) {
      const all = this.$$("list>li");
      const selected = this.$$("list>li:checked");
      if( selected.length == all.length )
        for(let li of selected) li.state.checked = false; // deselect all
      else 
        for(let li of all) li.state.checked = true; // select all
      return true;
    }
  }

  ["on popup-ready at menu#for-log-list"](evt, menu) {
    menu.$("li[command='edit:copy']").state.disabled = !this.$("list>li:checked");
    return true;
  }

  ["on click at menu#for-log-list>li[command='edit:copy']"](evt, menu) {
    this.list2clipboard();
    return true;
  }

  ["on click at menu#for-log-list>li[command='edit:clear']"](evt, menu) {
    this.channel.theirLogs = [];
    this.componentUpdate();
    return true;
  }
}
