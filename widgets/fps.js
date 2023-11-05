
// aspect to be applied in CSS as
//  span { aspect: FPS url(thisfile) }
export function FPS() {
  
  const times = new Int32Array(16);
  let lastTime = Window.ticks();
  let idx = 0;
  let fps = 0;

  const update = () => {
    const avg = times.reduce((acc,val)=>acc+val, 0) / 16;
    this.innerText = 1000 / avg; 
  }

  this.paintBackground = () => {
     const t = Window.ticks();
     const delta = t - lastTime;
     lastTime = t;  
     idx = (idx + 1) % 16;
     times[idx] = delta; 
     if(!idx) this.post(update);
  }
}