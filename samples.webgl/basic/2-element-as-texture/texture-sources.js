
const styleset = CSS.set`
  :root > div {
    flow:horizontal;
    border-spacing:4px; 
    padding:4px;
  }

  :root > div > * {
    size:100px;
    border:1px solid #888;
  }

  :root > div > *:current {
    outline:3px solid orange;
  }

  clock {
    display:block;
    text-align:center;
    vertical-align:middle;
    background:gold;
  }
`;

export class TextureSources extends Element {
  elCurrent = null;
  callback;
  constructor(props,kids) {
    super();
    this.callback = props.callback;
  }
  render() {
    return <section styleset={styleset}>
       <header>Click on one of elements to select it as a texture source:</header>
       <div>
         <Video current={ this.elCurrent } />
         <Clock current={ this.elCurrent } />
       </div>
    </section>;
  }

  ["on mousedown at div>:not(:current)"](evt, sourceElement) {
    this.callback(sourceElement);
    this.componentUpdate({elCurrent:sourceElement});
    return true; // consume
  }
}

class Video extends Element {

  isCurrent = false;
  isDisabled = true;

  this({current}) {
     this.isCurrent = this === current;
  }

  render() {
    return <video 
       src={__DIR__ + "../../../samples.sciter/video/movies/carribean.wmv"} 
       state-disabled = { this.isDisabled }
       state-current ={ this.isCurrent }  />
  } 

  ["on video-start"](evt)  {
    this.componentUpdate({isDisabled:false});
  }

  ["on video-stop"](evt)  {
    this.video.rewind(); // loop
    this.video.play();    
  }

  get textureSource() {
    return this;
  }
}

class Clock extends Element {
  time = new Date();
  image = null;
  isCurrent = false;

  this({current}) {
     this.isCurrent = this === current;
  }

  render() {
    return <clock state-current={ this.isCurrent }>
      <div>Time now</div>
      <div>{ this.time.toLocaleTimeString() }</div>
    </clock>;
  } 

  componentDidMount() {
    this.timer(1s, () => {
      this.componentUpdate({time: new Date(), image:null});
      return true; // keep ticking
    });
  }

  get textureSource() {
    if( !this.image)
      this.image = new Graphics.Image(this);
    return this.image;
  }


}