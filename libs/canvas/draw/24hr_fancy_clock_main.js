// 24 hour clock section of the renderFrame function
function renderFrame_Draw24HourFancyClock_Main(ctx, now) {
  // draw clock
  // > define variables
  let clockCenterX = canvas.width / 2;
  let clockCenterY = canvas.height / 2;
  let clockRadius = getMinCanvasDim() * 0.43;
  
  // > outer circle
  ctx.strokeStyle = 'white';
  ctx.lineWidth = clockRadius * 0.0046;
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
  renderFrame_DrawClockMotif(ctx, now, clockCenterX, clockCenterY, clockRadius);
  
  // > print time inside clock
  // >> calculate time string
  let timeString =
    (now.getHours() + '').padStart(2, '0') + ':' +
    (now.getMinutes() + '').padStart(2, '0') + ':' +
    (now.getSeconds() + '').padStart(2, '0');
  
  // >> print time
  let timeTextPosY = clockCenterY - clockRadius * 0.06;
  let timeTextHeight = clockRadius * 0.29;
  ctx.fillStyle = 'white';
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
  
  // > print date inside clock
  // >> calculate date string
  let weekDayString = DAY_OF_WEEK_STRINGS_CAPS[now.getDay()];
  let dateString =
    (now.getFullYear() + '') + '-' +
    (now.getMonth() + 1 + '').padStart(2, '0') + '-' +
    (now.getDate() + '').padStart(2, '0') + ' ' +
    weekDayString;
  
  // >> print date
  let dateTextPosY = clockCenterY + clockRadius * 0.12;
  let dateTextHeight = clockRadius * 0.093;
  ctx.fillStyle = 'rgb(192, 192, 192)';
  ctx.font = `${dateTextHeight}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(dateString, canvas.width / 2, dateTextPosY);
  
  // > print elevation and azimuth of sun
  let sunParameters = getSunHeightAndAngle(now);
  let sunAzimuthString = `Sun Elev.: ${sunParameters.height.toFixed(2)}°, Azim.: ${sunParameters.angle.toFixed(2)}°`;
  let sunAzimuthTextHeight = clockRadius * 0.055;
  ctx.fillStyle = 'rgb(192, 192, 192)';
  ctx.font = `${sunAzimuthTextHeight}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sunAzimuthString, canvas.width / 2, clockCenterY + clockRadius * 0.22);
}
