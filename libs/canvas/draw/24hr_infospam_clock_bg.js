// 24 hour clock section of the renderFrame function
function renderFrame_Draw24HourInfoSpamClock_BG(ctx, nowData) {
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
    linesInnerRadius: 0.93,
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
      x: normalizedX * 0.83,
      y: normalizedY * 0.85,
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
  renderFrame_DrawClockMotif(ctx, nowData, clockCenterX, clockCenterY, clockRadius * 0.55 * 0.9, true);
  
  // > subtle circles around day of week and day of year
  canvasDrawer.drawCircle({ x: 0, y: 0, radius: 0.6, color: 'rgb(31, 31, 31)', width: 0.0046 });
  canvasDrawer.drawCircle({ x: 0, y: 0, radius: 0.65, color: 'rgb(31, 31, 31)', width: 0.0046 });
  canvasDrawer.drawCircle({ x: 0, y: 0, radius: 0.7, color: 'rgb(31, 31, 31)', width: 0.0046 });
  
  // > day of the week lines
  for (let i = 0; i < 7; i++) {
    let angle = Math.PI * 2 / 7 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let dotwLinesInnerRadius = 0.65;
    let dotwLinesOuterRadius = 0.7;
    
    canvasDrawer.drawLine({
      x1: normalizedX * dotwLinesInnerRadius,
      y1: normalizedY * dotwLinesInnerRadius,
      x2: normalizedX * dotwLinesOuterRadius,
      y2: normalizedY * dotwLinesOuterRadius,
      color: 'rgb(127, 127, 127)',
      width: 0.007,
    });
  }
  
  // > text for each day of the week
  for (let i = 0; i < 7; i++) {
    let angle = Math.PI * 2 / 7 * (i + 0.5) - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let dotwString = DAY_OF_WEEK_STRINGS_CAPS[i];
    
    let dotwTextRadius = 0.675;
    
    // rotate text to follow contour of circle
    let dotwTextAngle = angle + Math.PI / 2;
    
    // but if text is more than 50% of the way to being upside down, flip the text 180 degrees
    if (dotwTextAngle > Math.PI / 2 && dotwTextAngle < 3 * Math.PI / 2) {
      dotwTextAngle += Math.PI;
    }
    
    canvasDrawer.drawText({
      x: normalizedX * dotwTextRadius,
      y: normalizedY * dotwTextRadius,
      text: dotwString,
      angle: dotwTextAngle,
      size: 0.04,
      color: 'rgb(192, 192, 192)',
    });
  }
  
  // > green line for current time in week
  {
    let fractionalDayOfWeek =
      nowData.dayOfWeek +
      nowData.hour / 24 +
      nowData.minute / 24 / 60 +
      nowData.second / 24 / 3600;
    
    let angle = Math.PI * 2 / 7 * fractionalDayOfWeek - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let dotwLinesInnerRadius = 0.65;
    let dotwLinesOuterRadius = 0.7;
    
    canvasDrawer.drawLine({
      x1: normalizedX * dotwLinesInnerRadius,
      y1: normalizedY * dotwLinesInnerRadius,
      x2: normalizedX * dotwLinesOuterRadius,
      y2: normalizedY * dotwLinesOuterRadius,
      color: 'lime',
      width: 0.007,
    });
  }
  
  // > month of the year lines
  let yearLengthDays = getYearLength(nowData.year);
  
  for (let i = 0; i < 12; i++) {
    let angle = Math.PI * 2 / yearLengthDays * monthStartingDayOfYear(nowData.year, i + 1) - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let motyLinesInnerRadius = 0.6;
    let motyLinesOuterRadius = 0.65;
    
    canvasDrawer.drawLine({
      x1: normalizedX * motyLinesInnerRadius,
      y1: normalizedY * motyLinesInnerRadius,
      x2: normalizedX * motyLinesOuterRadius,
      y2: normalizedY * motyLinesOuterRadius,
      color: 'rgb(127, 127, 127)',
      width: 0.007,
    });
  }
  
  // > text for each month of the year
  for (let i = 0; i < 12; i++) {
    let monthHalfwayDayOfYear = (monthStartingDayOfYear(nowData.year, i + 1) + monthStartingDayOfYear(nowData.year, i + 2)) / 2;
    
    let angle = Math.PI * 2 / yearLengthDays * monthHalfwayDayOfYear - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let motyString = MONTH_OF_YEAR_STRINGS_CAPS[i];
    
    let motyTextRadius = 0.625;
    
    // rotate text to follow contour of circle
    let motyTextAngle = angle + Math.PI / 2;
    
    // but if text is more than 50% of the way to being upside down, flip the text 180 degrees
    if (motyTextAngle > Math.PI / 2 && motyTextAngle < 3 * Math.PI / 2) {
      motyTextAngle += Math.PI;
    }
    
    canvasDrawer.drawText({
      x: normalizedX * motyTextRadius,
      y: normalizedY * motyTextRadius,
      text: motyString,
      angle: motyTextAngle,
      size: 0.04,
      color: 'rgb(192, 192, 192)',
    });
  }
  
  // > green line for current time in year
  {
    let fractionalDayOfYear =
      getDayOfYear(nowData.year, nowData.month, nowData.day) +
      nowData.hour / 24 +
      nowData.minute / 24 / 60 +
      nowData.second / 24 / 3600;
    
    let angle = Math.PI * 2 / yearLengthDays * fractionalDayOfYear - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let motyLinesInnerRadius = 0.6;
    let motyLinesOuterRadius = 0.65;
    
    canvasDrawer.drawLine({
      x1: normalizedX * motyLinesInnerRadius,
      y1: normalizedY * motyLinesInnerRadius,
      x2: normalizedX * motyLinesOuterRadius,
      y2: normalizedY * motyLinesOuterRadius,
      color: 'lime',
      width: 0.007,
    });
  }
  
  // > print time inside clock
  // >> calculate time string
  let timeString =
    (nowData.hour + '').padStart(2, '0') + ':' +
    (nowData.minute + '').padStart(2, '0');
  
  // >> print time
  canvasDrawer.drawTextFixedWidth({
    x: 0,
    y: -0.08,
    text: timeString,
    size: 0.34,
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
    y: 0.14,
    text: dateString,
    size: 0.093,
    color: 'rgb(192, 192, 192)',
  });
  
  // > print elevation and azimuth of sun
  let sunParameters = getSunHeightAndAngle(nowData.dateObj);
  let sunAzimuthString = `Sun Elev.: ${sunParameters.height.toFixed(0)}°, Azim.: ${sunParameters.angle.toFixed(0)}°`;
  canvasDrawer.drawText({
    x: 0,
    y: 0.24,
    text: sunAzimuthString,
    size: 0.055,
    color: 'rgb(192, 192, 192)',
  });
  
  // > print visual for elevation and azimuth of sun
  
  // >> define variables
  let elevAzimVisualY = 0.41;
  let sunElevVisualX = -0.15;
  let sunAzimVisualX = 0.15;
  let elevAzimCircleRadius = 0.08;
  let elevAzimCircleWidth = 0.002;
  
  // >> outer circles with inward lines for every 30 degrees
  canvasDrawer.drawCircleArcWithInwardLines({
    x: sunElevVisualX,
    y: elevAzimVisualY,
    radius: elevAzimCircleRadius,
    circleWidth: elevAzimCircleWidth,
    lineWidth: elevAzimCircleWidth,
    startAngle: -Math.PI / 2,
    endAngle: Math.PI / 2,
    linesInnerRadius: 0.8,
    numLines: 180 / 30 + 1,
  });
  canvasDrawer.drawCircleWithInwardLines({
    x: sunAzimVisualX,
    y: elevAzimVisualY,
    radius: elevAzimCircleRadius,
    circleWidth: elevAzimCircleWidth,
    lineWidth: elevAzimCircleWidth,
    linesInnerRadius: 0.8,
    numLines: 360 / 30,
  });
  
  // >> green wedges for current values
  {
    let currentElevationScaled = (90 - sunParameters.height) / 360;
    
    let angleCenter = Math.PI * 2 * currentElevationScaled - Math.PI / 2;
    let angleLeft = angleCenter - Math.PI * 2 / 24 * 0.7;
    let angleRight = angleCenter + Math.PI * 2 / 24 * 0.7;
    
    let wedgeRadiusInner = elevAzimCircleRadius * 1.01;
    let wedgeRadiusOuter = elevAzimCircleRadius * 1.5;
    
    canvasDrawer.drawFilledTriangle({
      x1: sunElevVisualX + Math.cos(angleLeft) * wedgeRadiusOuter,
      y1: elevAzimVisualY + Math.sin(angleLeft) * wedgeRadiusOuter,
      x2: sunElevVisualX + Math.cos(angleRight) * wedgeRadiusOuter,
      y2: elevAzimVisualY + Math.sin(angleRight) * wedgeRadiusOuter,
      x3: sunElevVisualX + Math.cos(angleCenter) * wedgeRadiusInner,
      y3: elevAzimVisualY + Math.sin(angleCenter) * wedgeRadiusInner,
      color: 'lime',
    });
  }
  
  {
    let currentAzimuthScaled = sunParameters.angle / 360;
    
    let angleCenter = Math.PI * 2 * currentAzimuthScaled - Math.PI / 2;
    let angleLeft = angleCenter - Math.PI * 2 / 24 * 0.7;
    let angleRight = angleCenter + Math.PI * 2 / 24 * 0.7;
    
    let wedgeRadiusInner = elevAzimCircleRadius * 1.01;
    let wedgeRadiusOuter = elevAzimCircleRadius * 1.5;
    
    canvasDrawer.drawFilledTriangle({
      x1: sunAzimVisualX + Math.cos(angleLeft) * wedgeRadiusOuter,
      y1: elevAzimVisualY + Math.sin(angleLeft) * wedgeRadiusOuter,
      x2: sunAzimVisualX + Math.cos(angleRight) * wedgeRadiusOuter,
      y2: elevAzimVisualY + Math.sin(angleRight) * wedgeRadiusOuter,
      x3: sunAzimVisualX + Math.cos(angleCenter) * wedgeRadiusInner,
      y3: elevAzimVisualY + Math.sin(angleCenter) * wedgeRadiusInner,
      color: 'lime',
    });
  }
  
  // >> text in center stating what dial is
  let elevAzimVisualsTextHeight = 0.04;
  let elevAzimVisualsTextColor = 'rgb(170, 170, 170)';
  canvasDrawer.drawText({
    x: sunElevVisualX,
    y: elevAzimVisualY,
    text: 'Elev.',
    size: elevAzimVisualsTextHeight,
    color: elevAzimVisualsTextColor,
  });
  canvasDrawer.drawText({
    x: sunAzimVisualX,
    y: elevAzimVisualY,
    text: 'Azim.',
    size: elevAzimVisualsTextHeight,
    color: elevAzimVisualsTextColor,
  });
}
