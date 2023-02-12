

export function FocusAnimator() {

  const focusColor = Color.RGB(255,0,0);
  const focusWidth = 3;

  let prevFocus = null;
  let focus = null;
  let that = this;  
  let fx1 = null,fy1,fx2,fy2;
  let sx1,sy1,sx2,sy2;
  let tx1,ty1,tx2,ty2;
  let isAnimating = false;

  function morph(start,end,progress) {
    return start * (1 - progress) + end * progress;
  }

  function step(progress) {
    if( fx1 === null) return false;
    fx1 = morph(sx1,tx1,progress);
    fy1 = morph(sy1,ty1,progress);
    fx2 = morph(sx2,tx2,progress);
    fy2 = morph(sy2,ty2,progress);
    document.requestPaint();
    return true;
  }

  document.on("focus", (evt) => {
    [sx1,sy1,sx2,sy2] = evt.relatedTarget.state.box("rect","border","document"); // lost focus
    [tx1,ty1,tx2,ty2] = evt.target.state.box("rect","border","document"); // got focus
    if( evt.target === document ) {
      fx1 = null;
      document.requestPaint();
    }
    else if( fx1 === null) {
      fx1 = tx1; fy1 = ty1; fx2 = tx2; fy2 = ty2;
      document.requestPaint();
    }
    else if(!isAnimating)
      document.morphContent(step,{duration:300});
  });

  document.on("focusout", () => {
    fx1 = null;
    document.requestPaint();
  });

  // paint this at outline level - on top of everything
  document.paintOutline = function(gfx) {
    if( fx1 === null) return;
    gfx.strokeStyle = focusColor;
    gfx.strokeWidth = focusWidth;
    gfx.strokeRect(fx1,fy1,fx2-fx1,fy2-fy1);
  }

}