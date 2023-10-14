// 12 hour clock section of the renderFrame function
function renderFrame_Draw12HourClock(ctx, now) {
  // calculate clock, date, and time positioning variables
  let [
    clockCenterY,
    clockRadius,
    timeTextPosY,
    timeTextHeight,
    timeTextColor,
    dateTextPosY,
    dateTextHeight,
    dateTextColor,
  ] = [
    [canvas.height * 0.5,  canvas.height * 0.44, null,                 null,                 null,    null,                 null,                 null                ], /* DATE:  NO, TIME:  NO, SECONDS:  NO */
    [canvas.height * 0.5,  canvas.height * 0.44, null,                 null,                 null,    null,                 null,                 null                ], /* DATE:  NO, TIME:  NO, SECONDS: YES */
    [canvas.height * 0.44, canvas.height * 0.38, canvas.height * 0.92, canvas.height * 0.12, 'white', null,                 null,                 null                ], /* DATE:  NO, TIME: YES, SECONDS:  NO */
    [canvas.height * 0.44, canvas.height * 0.38, canvas.height * 0.92, canvas.height * 0.1,  'white', null,                 null,                 null                ], /* DATE:  NO, TIME: YES, SECONDS: YES */
    [canvas.height * 0.44, canvas.height * 0.38, null,                 null,                 null,    canvas.height * 0.92, canvas.height * 0.09, 'white'             ], /* DATE: YES, TIME:  NO, SECONDS:  NO */
    [canvas.height * 0.44, canvas.height * 0.38, null,                 null,                 null,    canvas.height * 0.92, canvas.height * 0.09, 'white'             ], /* DATE: YES, TIME:  NO, SECONDS: YES */
    [canvas.height * 0.43, canvas.height * 0.38, canvas.height * 0.89, canvas.height * 0.1,  'white', canvas.height * 0.96, canvas.height * 0.04, 'rgb(192, 192, 192)'], /* DATE: YES, TIME: YES, SECONDS:  NO */
    [canvas.height * 0.43, canvas.height * 0.38, canvas.height * 0.89, canvas.height * 0.09, 'white', canvas.height * 0.96, canvas.height * 0.04, 'rgb(192, 192, 192)'], /* DATE: YES, TIME: YES, SECONDS: YES */
  ][CLOCK_DATE_VISIBLE * 4 + CLOCK_TIME_VISIBLE * 2 + CLOCK_SECONDS_VISIBLE];
  
  // draw clock
  // > define variables
  let clockCenterX = canvas.width / 2;
  
  // > outer circle
  ctx.strokeStyle = 'white';
  ctx.lineWidth = canvas.height * 0.007;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.arc(clockCenterX, clockCenterY, clockRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // > inward lines at each hour
  ctx.lineWidth = canvas.height * 0.005;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    let angle = Math.PI * 2 / 12 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let inwardLinesInnerRadius = 0.9;
    
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
  for (let i = 0; i < 12; i++) {
    let angle = Math.PI * 2 / 12 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let hourTextHeight = clockRadius * 0.13;
    ctx.fillStyle = 'white';
    ctx.font = `${hourTextHeight}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      (i + 11) % 12 + 1,
      clockCenterX + normalizedX * clockRadius * 0.8,
      clockCenterY + normalizedY * clockRadius * 0.8,
    );
  }
  
  // > subtle motif for time of day (6AM-6PM is sun, else is crescent moon)
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
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = canvas.height * 0.01;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(
      clockCenterX + Math.cos(angle) * clockRadius * handRadiusStart,
      clockCenterY + Math.sin(angle) * clockRadius * handRadiusStart,
    );
    ctx.lineTo(
      clockCenterX + Math.cos(angle) * clockRadius * handRadiusEnd,
      clockCenterY + Math.sin(angle) * clockRadius * handRadiusEnd,
    );
    ctx.stroke();
  }
  
  // > minute hand
  {
    // a continuous version of minutes that smoothly increases over time
    let smoothedMinutes = now.getMinutes() + now.getSeconds() / 60;
    
    let angle = Math.PI * 2 / 60 * smoothedMinutes - Math.PI / 2;
    
    let handRadiusStart = -0.03;
    let handRadiusEnd = 0.65;
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = canvas.height * 0.005;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(
      clockCenterX + Math.cos(angle) * clockRadius * handRadiusStart,
      clockCenterY + Math.sin(angle) * clockRadius * handRadiusStart,
    );
    ctx.lineTo(
      clockCenterX + Math.cos(angle) * clockRadius * handRadiusEnd,
      clockCenterY + Math.sin(angle) * clockRadius * handRadiusEnd,
    );
    ctx.stroke();
  }
  
  // > second hand
  if (CLOCK_SECONDS_VISIBLE) {
    let seconds = now.getSeconds();
    
    let angle = Math.PI * 2 / 60 * seconds - Math.PI / 2;
    
    let handRadiusStart = -0.05;
    let handRadiusEnd = 0.67;
    
    ctx.strokeStyle = 'red';
    ctx.lineWidth = canvas.height * 0.005;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(
      clockCenterX + Math.cos(angle) * clockRadius * handRadiusStart,
      clockCenterY + Math.sin(angle) * clockRadius * handRadiusStart,
    );
    ctx.lineTo(
      clockCenterX + Math.cos(angle) * clockRadius * handRadiusEnd,
      clockCenterY + Math.sin(angle) * clockRadius * handRadiusEnd,
    );
    ctx.stroke();
  }
  
  // calculate string for time
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
  
  // print time below clock
  if (CLOCK_TIME_VISIBLE) {
    if (CLOCK_SECONDS_VISIBLE) {
      ctx.fillStyle = timeTextColor;
      ctx.font = `${timeTextHeight}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawTextWithPerLetterSpacing(
        ctx, timeString, canvas.width / 2, timeTextPosY,
        [
          0,
          timeTextHeight * 0.55,
          timeTextHeight * 0.4,
          timeTextHeight * 0.4,
          timeTextHeight * 0.55,
          timeTextHeight * 0.4,
          timeTextHeight * 0.4,
          timeTextHeight * 0.55,
          timeTextHeight * 0.55,
          timeTextHeight * 0.55,
          timeTextHeight * 0.75,
        ]
      );
    } else {
      ctx.fillStyle = timeTextColor;
      ctx.font = `${timeTextHeight}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawTextWithPerLetterSpacing(
        ctx, timeString, canvas.width / 2, timeTextPosY,
        [
          0,
          timeTextHeight * 0.55,
          timeTextHeight * 0.4,
          timeTextHeight * 0.4,
          timeTextHeight * 0.55,
          timeTextHeight * 0.55,
          timeTextHeight * 0.55,
          timeTextHeight * 0.75,
        ]
      );
    }
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
    ctx.fillStyle = dateTextColor;
    ctx.font = `${dateTextHeight}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateString, canvas.width / 2, dateTextPosY);
  }
}
