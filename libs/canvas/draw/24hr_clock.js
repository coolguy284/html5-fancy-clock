// helper function to calculate ui element positioning
function renderFrame_Draw24HourClock_UIPosition(uiConfiguration, clockCenterY, clockRadius) {
  switch (uiConfiguration) {
    case 0: return [null,                              null,               null,    null,                              null,                null                ]; /* DATE:  NO, TIME:  NO, SECONDS:  NO */
    case 1: return [null,                              null,               null,    null,                              null,                null                ]; /* DATE:  NO, TIME:  NO, SECONDS: YES */
    case 2: return [clockCenterY,                      clockRadius * 0.34, 'white', null,                              null,                null                ]; /* DATE:  NO, TIME: YES, SECONDS:  NO */
    case 3: return [clockCenterY,                      clockRadius * 0.29, 'white', null,                              null,                null                ]; /* DATE:  NO, TIME: YES, SECONDS: YES */
    case 4: return [null,                              null,               null,    clockCenterY,                      clockRadius * 0.128, 'white'             ]; /* DATE: YES, TIME:  NO, SECONDS:  NO */
    case 5: return [null,                              null,               null,    clockCenterY,                      clockRadius * 0.128, 'white'             ]; /* DATE: YES, TIME:  NO, SECONDS: YES */
    case 6: return [clockCenterY - clockRadius * 0.08, clockRadius * 0.34, 'white', clockCenterY + clockRadius * 0.14, clockRadius * 0.093, 'rgb(192, 192, 192)']; /* DATE: YES, TIME: YES, SECONDS:  NO */
    case 7: return [clockCenterY - clockRadius * 0.06, clockRadius * 0.29, 'white', clockCenterY + clockRadius * 0.12, clockRadius * 0.093, 'rgb(192, 192, 192)']; /* DATE: YES, TIME: YES, SECONDS: YES */
  }
}

// 24 hour clock section of the renderFrame function
function renderFrame_Draw24HourClock(ctx, now) {
  // draw clock
  // > define variables
  let clockCenterX = canvas.width / 2;
  let clockCenterY = canvas.height / 2;
  let clockRadius = canvas.height * 0.43;
  
  // > outer circle
  ctx.strokeStyle = 'white';
  ctx.lineWidth = canvas.height * 0.002;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.arc(clockCenterX, clockCenterY, clockRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // > inward lines at each hour
  ctx.beginPath();
  for (let i = 0; i < 24; i++) {
    let angle = Math.PI * 2 / 24 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let inwardLinesInnerRadius = 0.85;
    
    ctx.moveTo(
      clockCenterX + normalizedX * clockRadius * inwardLinesInnerRadius,
      clockCenterY + normalizedY * clockRadius * inwardLinesInnerRadius
    );
    ctx.lineTo(
      clockCenterX + normalizedX * clockRadius,
      clockCenterY + normalizedY * clockRadius
    );
  }
  ctx.stroke();
  
  // > text at each hour
  for (let i = 0; i < 24; i++) {
    let angle = Math.PI * 2 / 24 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let hourTextHeight = clockRadius * 0.065;
    ctx.fillStyle = 'white';
    ctx.font = `${hourTextHeight}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawTextWithPerLetterSpacing(
      ctx, (i + '').padStart(2, '0') + '00',
      clockCenterX + normalizedX * clockRadius * 0.75,
      clockCenterY + normalizedY * clockRadius * 0.77,
      hourTextHeight,
      [
        0,
        hourTextHeight * 0.55,
        hourTextHeight * 0.55,
        hourTextHeight * 0.55,
      ]
    );
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
    
    ctx.fillStyle = 'lime';
    ctx.beginPath();
    ctx.moveTo(
      clockCenterX + Math.cos(angleLeft) * clockRadius * wedgeRadiusOuter,
      clockCenterY + Math.sin(angleLeft) * clockRadius * wedgeRadiusOuter,
    );
    ctx.lineTo(
      clockCenterX + Math.cos(angleRight) * clockRadius * wedgeRadiusOuter,
      clockCenterY + Math.sin(angleRight) * clockRadius * wedgeRadiusOuter,
    );
    ctx.lineTo(
      clockCenterX + Math.cos(angleCenter) * clockRadius * wedgeRadiusInner,
      clockCenterY + Math.sin(angleCenter) * clockRadius * wedgeRadiusInner,
    );
    ctx.fill();
  }
  
  // > subtle motif for time of day (6AM-6PM is sun, else is crescent moon)
  if (CLOCK_DRAW_MOTIF) {
    renderFrame_DrawClockMotif(ctx, now, clockCenterX, clockCenterY, clockRadius);
  }
  
  // > calculate date and time positioning variables
  let [
    timeTextPosY,
    timeTextHeight,
    timeTextColor,
    dateTextPosY,
    dateTextHeight,
    dateTextColor,
  ] = renderFrame_Draw24HourClock_UIPosition(
    CLOCK_DATE_VISIBLE * 4 + CLOCK_TIME_VISIBLE * 2 + CLOCK_SECONDS_VISIBLE,
    clockCenterY, clockRadius
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
    if (CLOCK_SECONDS_VISIBLE) {
      ctx.fillStyle = timeTextColor;
      ctx.font = `${timeTextHeight}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawTextWithPerLetterSpacing(
        ctx, timeString, clockCenterX, timeTextPosY, timeTextHeight,
        [
          0,
          timeTextHeight * 0.55,
          timeTextHeight * 0.4,
          timeTextHeight * 0.4,
          timeTextHeight * 0.55,
          timeTextHeight * 0.4,
          timeTextHeight * 0.4,
          timeTextHeight * 0.55,
        ]
      );
    } else {
      ctx.fillStyle = timeTextColor;
      ctx.font = `${timeTextHeight}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawTextWithPerLetterSpacing(
        ctx, timeString, clockCenterX, timeTextPosY, timeTextHeight,
        [
          0,
          timeTextHeight * 0.55,
          timeTextHeight * 0.4,
          timeTextHeight * 0.4,
          timeTextHeight * 0.55,
        ]
      );
    }
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
    ctx.fillStyle = dateTextColor;
    ctx.font = `${dateTextHeight}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateString, canvas.width / 2, dateTextPosY);
  }
}
