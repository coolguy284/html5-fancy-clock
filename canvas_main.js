// draws clock onto canvas
function renderFrame(forceRerender) {
  if (LOG_DEBUG) console.debug('rendering frame');
  
  // get current date
  let now;
  
  if (CLOCK_OFFSET_HOURS == 0) {
    now = new Date();
  } else {
    now = new Date(Date.now() + CLOCK_OFFSET_HOURS * 3_600_000);
  }
  
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
}

// render frame loop, intended to only be run once (at page load)
async function renderFrameLoop() {
  if (renderFrameLoopStarted) return;
  
  renderFrameLoopStarted = true;
  
  while (true) {
    renderFrame();
    
    await new Promise(r => requestAnimationFrame(r));
  }
}
