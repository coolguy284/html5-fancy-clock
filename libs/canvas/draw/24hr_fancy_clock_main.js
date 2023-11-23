// 24 hour clock section of the renderFrame function
function renderFrame_Draw24HourFancyClock_Main(ctx, nowData) {
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
    nudgeOnes: false,
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
    let smoothedHours = nowData.hour + nowData.minute / 60 + nowData.second / 3600;
    
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
  renderFrame_DrawClockMotif(ctx, nowData, clockCenterX, clockCenterY, clockRadius * 0.55, true);
  
  // > print time inside clock
  // >> calculate time string
  let timeString =
    (nowData.hour + '').padStart(2, '0') + ':' +
    (nowData.minute + '').padStart(2, '0') + ':' +
    (nowData.second + '').padStart(2, '0');
  
  // >> print time
  canvasDrawer.drawTextFixedWidth({
    x: 0,
    y: -0.06,
    text: timeString,
    size: 0.29,
  });
  
  // > print date inside clock
  // >> calculate date string
  let weekDayString = DAY_OF_WEEK_STRINGS_CAPS[nowData.dayOfWeek];
  let dateString =
    (nowData.year + '') + '-' +
    (nowData.month + '').padStart(2, '0') + '-' +
    (nowData.day + '').padStart(2, '0') + ' ' +
    weekDayString;
  
  // >> print date
  canvasDrawer.drawText({
    x: 0,
    y: 0.12,
    text: dateString,
    size: 0.093,
    color: 'rgb(192, 192, 192)',
  });
  
  // > print elevation and azimuth of sun
  let sunParameters = getSunHeightAndAngle(nowData.dateObj);
  let sunAzimuthString = `Sun Elev.: ${sunParameters.height.toFixed(2)}°, Azim.: ${sunParameters.angle.toFixed(2)}°`;
  canvasDrawer.drawText({
    x: 0,
    y: 0.22,
    text: sunAzimuthString,
    size: 0.055,
    color: 'rgb(192, 192, 192)',
  });
}
