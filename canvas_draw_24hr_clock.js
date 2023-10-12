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
    
    ctx.fillStyle = 'green';
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
  
  // > calculate string for time
  let timeString =
    (now.getHours() + '').padStart(2, '0') + ':' +
    (now.getMinutes() + '').padStart(2, '0') + ':' +
    (now.getSeconds() + '').padStart(2, '0');
  
  // > print time inside clock
  let timeTextHeight = clockRadius * 0.29;
  ctx.fillStyle = 'white';
  ctx.font = `${timeTextHeight}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawTextWithPerLetterSpacing(
    ctx, timeString, clockCenterX, clockCenterY,
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
}
