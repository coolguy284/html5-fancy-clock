// draws clock onto canvas
function renderFrame(forceRerender) {
  // get current date
  let now = new Date();
  
  // only rerender if seconds changed or force rerender
  if ((now.getSeconds() != oldSecondsValue) || forceRerender) {
    // get context
    let ctx = canvas.getContext('2d');
    
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (CLOCK_DRAW_MODE) {
      case '12 Hour':
        renderFrame_Draw12HourClock(ctx, now);
        break;
      
      case '24 Hour':
        renderFrame_Draw24HourClock(ctx, now);
        break;
    }
    
    oldSecondsValue = now.getSeconds();
  }
  
  // queue next frame render
  requestAnimationFrame(renderFrameCallback);
}

// render frame callback used by requestAnimationFrame, this is done to ignore args passed in by requestAnimationFrame
function renderFrameCallback() {
  renderFrame();
}
