// draws clock onto canvas
function renderFrame(forceRerender) {
  if (LOG_DEBUG) console.debug('rendering frame');
  
  // get current date
  let now, nowData;
  
  if (CLOCK_OFFSET_HOURS == 0) {
    now = new Date();
  } else {
    now = new Date(Date.now() + CLOCK_OFFSET_HOURS * 3_600_000);
  }
  
  if (!LOCAL_TIMEZONE) {
    let tzNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 3_600_000);
    
    nowData = {
      dateObj: now,
      year: tzNow.getUTCFullYear(),
      month: tzNow.getUTCMonth() + 1,
      day: tzNow.getUTCDate(),
      hour: tzNow.getUTCHours(),
      minute: tzNow.getUTCMinutes(),
      second: tzNow.getUTCSeconds(),
      dayOfWeek: tzNow.getUTCDay(),
    };
  } else {
    nowData = {
      dateObj: now,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      dayOfWeek: now.getDay(),
    };
  }
  
  // only rerender if seconds changed or force rerender
  
  let rerender = false;
  
  if (nowData.second != oldSecondsValue || FRAMERATE != 'Every Frame, Re-Render Every Second') {
    rerender = true;
  }
  
  if (forceRerenderAfterLoopWait) {
    forceRerenderAfterLoopWait = false;
    rerender = true;
  }
  
  if (forceRerender) {
    rerender = true;
  }
  
  if (rerender) {
    // get context
    let ctx = canvas.getContext('2d');
    
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (CLOCK_DRAW_MODE) {
      case '12 Hour':
        renderFrame_Draw12HourClock(ctx, nowData);
        break;
      
      case '24 Hour':
        renderFrame_Draw24HourClock(ctx, nowData);
        break;
      
      case '24 Hour Fancy (Main)':
        renderFrame_Draw24HourFancyClock_Main(ctx, nowData);
        break;
      
      case '24 Hour Fancy (Background)':
        renderFrame_Draw24HourFancyClock_BG(ctx, nowData);
        break;
      
      case '24 Hour Infospam (Main)':
        renderFrame_Draw24HourInfoSpamClock_Main(ctx, nowData);
        break;
      
      case '24 Hour Infospam (Background)':
        renderFrame_Draw24HourInfoSpamClock_BG(ctx, nowData);
        break;
    }
    
    oldSecondsValue = nowData.second;
  }
}

// render frame loop, intended to only be run once (at page load)
async function renderFrameLoop() {
  if (renderFrameLoopStarted) return;
  
  renderFrameLoopStarted = true;
  
  while (FRAMERATE != 'Halted') {
    renderFrame();
    
    switch (FRAMERATE) {
      case 'Every Frame':
      case 'Every Frame, Re-Render Every Second':
        await new Promise(r => {
          _endFrameWait = r;
          
          requestAnimationFrame(r);
        });
        
        _endFrameWait = null;
        break;
      
      case 'Re-Render Every Second':
        await new Promise(r => {
          let timeoutID = callbackInSecond(() => {
            r();
            _endFrameWait = null;
          });
          
          _endFrameWait = () => {
            r();
            clearTimeout(timeoutID);
            _endFrameWait = null;
          };
        });
        break;
      
      case 'Re-Render Every Minute':
        await new Promise(r => {
          let timeoutID = callbackInMinute(() => {
            r();
            _endFrameWait = null;
          });
          
          _endFrameWait = () => {
            r();
            clearTimeout(timeoutID);
            _endFrameWait = null;
          };
        });
        break;
      
      default:
        // ignored
        break;
    }
  }
  
  renderFrameLoopStarted = false;
}
