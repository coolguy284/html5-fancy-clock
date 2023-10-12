// 12 hour clock section of the renderFrame function
function renderFrame_Draw12HourClock(ctx, now) {
  // print title at top of screen
  ctx.fillStyle = 'white';
  ctx.font = `10vh sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('12-Hour Time', canvas.width / 2, canvas.height * 0.08);
  
  // draw clock
  // > define variables
  let clockCenterX = canvas.width / 2;
  let clockCenterY = canvas.height * 0.5;
  let clockRadius = canvas.height * 0.33;
  
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
  if (CLOCK_12HR_MOTIF) {
    let motif = now.getHours() >= 6 && now.getHours() <= 17 && 0 ? 'sun' : 'moon';
    switch (motif) {
      case 'sun':
        // >> sun motif
        // >>> circle
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.15)';
        ctx.lineWidth = canvas.height * 0.007;
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.arc(clockCenterX, clockCenterY, clockRadius * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        
        // >>> lines around
        let numOfLines = 12;
        
        ctx.beginPath();
        for (let i = 0; i < numOfLines; i++) {
          let angle = Math.PI * 2 / numOfLines * i - Math.PI / 2;
          
          let normalizedX = Math.cos(angle);
          let normalizedY = Math.sin(angle);
          
          let innerRadius = 0.40;
          let outerRadius = 0.55;
          
          ctx.moveTo(
            clockCenterX + normalizedX * clockRadius * innerRadius,
            clockCenterY + normalizedY * clockRadius * innerRadius
          );
          ctx.lineTo(
            clockCenterX + normalizedX * clockRadius * outerRadius,
            clockCenterY + normalizedY * clockRadius * outerRadius
          );
        }
        ctx.stroke();
        break;
      
      case 'moon':
        // >> moon motif
        // >>> arc 1
        ctx.strokeStyle = 'rgba(0, 127, 255, 0.18)';
        ctx.lineWidth = canvas.height * 0.007;
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.arc(
          clockCenterX,
          clockCenterY,
          clockRadius * 0.5,
          Math.PI * 2 * (0.125 - 0.271),
          Math.PI * 2 * (0.125 + 0.271)
        );
        ctx.arc(
          clockCenterX + clockRadius * -0.35,
          clockCenterY + clockRadius * -0.35,
          clockRadius * 0.65,
          Math.PI * 2 * (0.125 + 0.138),
          Math.PI * 2 * (0.125 - 0.138),
          true
        );
        ctx.closePath();
        ctx.stroke();
        
        // >>> arc 2
        break;
    }
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
  {
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
  let timeString =
    ((now.getHours() + 11) % 12 + 1 + '').padStart(2, '0') + ':' +
    (now.getMinutes() + '').padStart(2, '0') + ':' +
    (now.getSeconds() + '').padStart(2, '0') + ' ' +
    (now.getHours() >= 12 ? 'PM' : 'AM');
  
  // print time below clock
  let timeTextHeight = canvas.height * 0.1;
  ctx.fillStyle = 'white';
  ctx.font = `${timeTextHeight}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawTextWithPerLetterSpacing(
    ctx, timeString, canvas.width / 2, canvas.height * 0.92,
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
}
