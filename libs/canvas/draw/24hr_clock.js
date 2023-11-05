// helper function to calculate ui element positioning
function renderFrame_Draw24HourClock_UIPosition(uiConfiguration) {
  switch (uiConfiguration) {
    case 0: return [null,  null, null, null,  null                ]; /* DATE:  NO, TIME:  NO, SECONDS:  NO */
    case 1: return [null,  null, null, null,  null                ]; /* DATE:  NO, TIME:  NO, SECONDS: YES */
    case 2: return [0,     0.34, null, null,  null                ]; /* DATE:  NO, TIME: YES, SECONDS:  NO */
    case 3: return [0,     0.29, null, null,  null                ]; /* DATE:  NO, TIME: YES, SECONDS: YES */
    case 4: return [null,  null, 0,    0.128, 'white'             ]; /* DATE: YES, TIME:  NO, SECONDS:  NO */
    case 5: return [null,  null, 0,    0.128, 'white'             ]; /* DATE: YES, TIME:  NO, SECONDS: YES */
    case 6: return [-0.08, 0.34, 0.14, 0.093, 'rgb(192, 192, 192)']; /* DATE: YES, TIME: YES, SECONDS:  NO */
    case 7: return [-0.06, 0.29, 0.12, 0.093, 'rgb(192, 192, 192)']; /* DATE: YES, TIME: YES, SECONDS: YES */
  }
}

// 24 hour clock section of the renderFrame function
function renderFrame_Draw24HourClock(ctx, now) {
  // draw clock
  // > define variables
  let clockCenterX = canvas.width / 2;
  let clockCenterY = canvas.height / 2;
  let clockRadius = getMinCanvasDim() * 0.43;
  let canvasDrawer = new CanvasDrawer(ctx, clockCenterX, clockCenterY, clockRadius);
  canvasDrawer.setDefaults({
    color: 'white',
    cap: 'butt',
    font: 'sans-serif',
    coordSystem: 'clock relative',
    nudgeOnes: CLOCK_NUDGE_ONES,
  });
  
  // > outer circle with inward lines at each hour
  canvasDrawer.drawCircleWithInwardLines({
    x: 0,
    y: 0,
    radius: 1,
    linesInnerRadius: 0.85,
    circleWidth: 0.0046,
    lineWidth: 0.0046,
    numLines: 24,
  });
  
  // > text at each hour
  for (let i = 0; i < 24; i++) {
    let angle = Math.PI * 2 / 24 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    canvasDrawer.drawTextFixedWidth({
      x: normalizedX * 0.75,
      y: normalizedY * 0.77,
      text: (i + '').padStart(2, '0') + '00',
      size: 0.065,
    });
  }
  
  // > green external wedge on the current time
  {
    // a continuous version of hours that smoothly increases over time
    let smoothedHours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    
    let angleCenter = Math.PI * 2 / 24 * smoothedHours - Math.PI / 2;
    let angleLeft = angleCenter - Math.PI * 2 / 24 * 0.29;
    let angleRight = angleCenter + Math.PI * 2 / 24 * 0.29;
    
    let wedgeRadiusInner = 1.01;
    let wedgeRadiusOuter = 1.13;
    
    canvasDrawer.drawFilledTriangle({
      x1: Math.cos(angleLeft) * wedgeRadiusOuter,
      y1: Math.sin(angleLeft) * wedgeRadiusOuter,
      x2: Math.cos(angleRight) * wedgeRadiusOuter,
      y2: Math.sin(angleRight) * wedgeRadiusOuter,
      x3: Math.cos(angleCenter) * wedgeRadiusInner,
      y3: Math.sin(angleCenter) * wedgeRadiusInner,
      color: 'lime',
    });
  }
  
  // > subtle motif for time of day (sun, moon, or sunset)
  if (CLOCK_DRAW_MOTIF) {
    renderFrame_DrawClockMotif(ctx, now, clockCenterX, clockCenterY, clockRadius);
  }
  
  // > calculate date and time positioning variables
  let [
    timeTextPosY,
    timeTextHeight,
    dateTextPosY,
    dateTextHeight,
    dateTextColor,
  ] = renderFrame_Draw24HourClock_UIPosition(
    CLOCK_DATE_VISIBLE * 4 + CLOCK_TIME_VISIBLE * 2 + CLOCK_SECONDS_VISIBLE
  );
  
  // > print time inside clock
  if (CLOCK_TIME_VISIBLE) {
    // >> calculate time string
    let timeString;
    
    if (CLOCK_SECONDS_VISIBLE) {
      timeString =
        (now.getHours() + '').padStart(2, '0') + ':' +
        (now.getMinutes() + '').padStart(2, '0') + ':' +
        (now.getSeconds() + '').padStart(2, '0');
    } else {
      timeString =
        (now.getHours() + '').padStart(2, '0') + ':' +
        (now.getMinutes() + '').padStart(2, '0');
    }
    
    // >> print time
    canvasDrawer.drawTextFixedWidth({
      x: 0,
      y: timeTextPosY,
      text: timeString,
      size: timeTextHeight,
    });
  }
  
  // > print date inside clock
  if (CLOCK_DATE_VISIBLE) {
    // >> calculate date string
    let weekDayString = DAY_OF_WEEK_STRINGS_CAPS[now.getDay()];
    let dateString =
      (now.getFullYear() + '') + '-' +
      (now.getMonth() + 1 + '').padStart(2, '0') + '-' +
      (now.getDate() + '').padStart(2, '0') + ' ' +
      weekDayString;
    
    // >> print date
    canvasDrawer.drawText({
      x: 0,
      y: dateTextPosY,
      text: dateString,
      size: dateTextHeight,
      color: dateTextColor,
    });
  }
}
