
// aspect to be applied in CSS as
//  span { aspect: FPS url(thisfile) }
export function FPS() {
  
  const times = new Int32Array(32);
  let lastTime = Window.ticks();
  let idx = 0;
  let fps = 0;

  const update = () => {
    const avg = times.reduce((acc,val)=>acc+val, 0) / 32;
    this.innerText = (1000 / avg) ^ 0; 
  }

  this.paintBackground = () => {
     const t = Window.ticks();
     const delta = t - lastTime;
     lastTime = t;  
     idx = (idx + 1) % 32;
     times[idx] = delta; 
     if(!idx) this.post(update);
  }
}