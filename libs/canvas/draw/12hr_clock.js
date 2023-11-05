// helper function to calculate ui element positioning
function renderFrame_Draw12HourClock_UIPosition(uiConfiguration) {
  let minCanvasDim = getMinCanvasDim();
  
  switch (uiConfiguration) {
    case 0: return [canvas.height * 0.5,  minCanvasDim * 0.44, null,                 null,                 null,                 null,                 null                ]; /* DATE:  NO, TIME:  NO, SECONDS:  NO */
    case 1: return [canvas.height * 0.5,  minCanvasDim * 0.44, null,                 null,                 null,                 null,                 null                ]; /* DATE:  NO, TIME:  NO, SECONDS: YES */
    case 2: return [canvas.height * 0.44, minCanvasDim * 0.38, canvas.height * 0.92, canvas.height * 0.12, null,                 null,                 null                ]; /* DATE:  NO, TIME: YES, SECONDS:  NO */
    case 3: return [canvas.height * 0.44, minCanvasDim * 0.38, canvas.height * 0.92, canvas.height * 0.1,  null,                 null,                 null                ]; /* DATE:  NO, TIME: YES, SECONDS: YES */
    case 4: return [canvas.height * 0.44, minCanvasDim * 0.38, null,                 null,                 canvas.height * 0.92, canvas.height * 0.09, 'white'             ]; /* DATE: YES, TIME:  NO, SECONDS:  NO */
    case 5: return [canvas.height * 0.44, minCanvasDim * 0.38, null,                 null,                 canvas.height * 0.92, canvas.height * 0.09, 'white'             ]; /* DATE: YES, TIME:  NO, SECONDS: YES */
    case 6: return [canvas.height * 0.43, minCanvasDim * 0.38, canvas.height * 0.89, canvas.height * 0.1,  canvas.height * 0.96, canvas.height * 0.04, 'rgb(192, 192, 192)']; /* DATE: YES, TIME: YES, SECONDS:  NO */
    case 7: return [canvas.height * 0.43, minCanvasDim * 0.38, canvas.height * 0.89, canvas.height * 0.09, canvas.height * 0.96, canvas.height * 0.04, 'rgb(192, 192, 192)']; /* DATE: YES, TIME: YES, SECONDS: YES */
  }
}

// 12 hour clock section of the renderFrame function
function renderFrame_Draw12HourClock(ctx, now) {
  // calculate clock, date, and time positioning variables
  let [
    clockCenterY,
    clockRadius,
    timeTextPosY,
    timeTextHeight,
    dateTextPosY,
    dateTextHeight,
    dateTextColor,
  ] = renderFrame_Draw12HourClock_UIPosition(CLOCK_DATE_VISIBLE * 4 + CLOCK_TIME_VISIBLE * 2 + CLOCK_SECONDS_VISIBLE);
  
  // draw clock
  // > define variables
  let clockCenterX = canvas.width / 2;
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
    linesInnerRadius: 0.9,
    circleWidth: 0.0184,
    lineWidth: 0.0131,
    numLines: 12,
  });
  
  // > text at each hour
  for (let i = 0; i < 12; i++) {
    let angle = Math.PI * 2 / 12 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    canvasDrawer.drawText({
      x: normalizedX * 0.8,
      y: normalizedY * 0.8,
      text: (i + 11) % 12 + 1,
      size: 0.13,
    });
  }
  
  // > subtle motif for time of day (sun, moon, or sunset)
  if (CLOCK_DRAW_MOTIF) {
    renderFrame_DrawClockMotif(ctx, now, clockCenterX, clockCenterY, clockRadius);
  }
  
  // > hour hand
  {
    // a continuous version of hours that smoothly increases over time
    let smoothedHours = now.getHours() % 12 + now.getMinutes() / 60 + now.getSeconds() / 3600;
    
    let angle = Math.PI * 2 / 12 * smoothedHours - Math.PI / 2;
    
    let handRadiusStart = -0.02;
    let handRadiusEnd = 0.45;
    
    canvasDrawer.drawLine({
      x1: Math.cos(angle) * handRadiusStart,
      y1: Math.sin(angle) * handRadiusStart,
      x2: Math.cos(angle) * handRadiusEnd,
      y2: Math.sin(angle) * handRadiusEnd,
      width: 0.0263,
    });
  }
  
  // > minute hand
  {
    // a continuous version of minutes that smoothly increases over time
    let smoothedMinutes = now.getMinutes() + now.getSeconds() / 60;
    
    let angle = Math.PI * 2 / 60 * smoothedMinutes - Math.PI / 2;
    
    let handRadiusStart = -0.03;
    let handRadiusEnd = 0.65;
    
    canvasDrawer.drawLine({
      x1: Math.cos(angle) * handRadiusStart,
      y1: Math.sin(angle) * handRadiusStart,
      x2: Math.cos(angle) * handRadiusEnd,
      y2: Math.sin(angle) * handRadiusEnd,
      width: 0.0131,
    });
  }
  
  // > second hand
  if (CLOCK_SECONDS_VISIBLE) {
    let seconds = now.getSeconds();
    
    let angle = Math.PI * 2 / 60 * seconds - Math.PI / 2;
    
    let handRadiusStart = -0.05;
    let handRadiusEnd = 0.67;
    
    canvasDrawer.drawLine({
      x1: Math.cos(angle) * handRadiusStart,
      y1: Math.sin(angle) * handRadiusStart,
      x2: Math.cos(angle) * handRadiusEnd,
      y2: Math.sin(angle) * handRadiusEnd,
      color: 'red',
      width: 0.0131,
    });
  }
  
  // print time below clock
  if (CLOCK_TIME_VISIBLE) {
    // > calculate time string
    let timeString;
    if (CLOCK_SECONDS_VISIBLE) {
      timeString =
        ((now.getHours() + 11) % 12 + 1 + '').padStart(2, '0') + ':' +
        (now.getMinutes() + '').padStart(2, '0') + ':' +
        (now.getSeconds() + '').padStart(2, '0') + ' ' +
        (now.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      timeString =
        ((now.getHours() + 11) % 12 + 1 + '').padStart(2, '0') + ':' +
        (now.getMinutes() + '').padStart(2, '0') + ' ' +
        (now.getHours() >= 12 ? 'PM' : 'AM');
    }
    
    // > print time
    canvasDrawer.drawTextFixedWidth({
      x: canvas.width / 2,
      y: timeTextPosY,
      text: timeString,
      size: timeTextHeight,
      coordSystem: 'screen space',
    });
  }
  
  // print date below clock
  if (CLOCK_DATE_VISIBLE) {
    // > calculate date string
    let weekDayString = DAY_OF_WEEK_STRINGS[now.getDay()];
    let monthString = MONTH_OF_YEAR_STRINGS[now.getMonth()];
    let dateString =
      weekDayString + ', ' +
      monthString + ' ' +
      (now.getDate() + '').padStart(2, '0') + ' ' +
      now.getFullYear();
    
    // > print date
    canvasDrawer.drawText({
      x: canvas.width / 2,
      y: dateTextPosY,
      text: dateString,
      color: dateTextColor,
      size: dateTextHeight,
      coordSystem: 'screen space',
    });
  }
}
