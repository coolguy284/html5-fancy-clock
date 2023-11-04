function isLeapYear(year) {
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}

function getYearLength(year) {
  return isLeapYear(year) ? 366 : 365;
}

function monthStartingDayOfYear(year, month) {
  return isLeapYear(year) ?
    MONTH_STARTING_DAY_NON_LEAP[month - 1] :
    MONTH_STARTING_DAY_LEAP[month - 1];
}

// counts from 0
function getDayOfYear(year, month, day) {
  return monthStartingDayOfYear(year, month) + day - 1;
}

// 24 hour clock section of the renderFrame function
function renderFrame_Draw24HourInfoSpamClock_Main(ctx, now) {
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
    
    let inwardLinesInnerRadius = 0.93;
    
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
      clockCenterX + normalizedX * clockRadius * 0.83,
      clockCenterY + normalizedY * clockRadius * 0.85,
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
  renderFrame_DrawClockMotif(ctx, now, clockCenterX, clockCenterY, clockRadius * 0.9, true);
  
  // > subtle circles around day of week and day of year
  ctx.strokeStyle = 'rgb(31, 31, 31)';
  ctx.lineWidth = clockRadius * 0.0046;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.arc(clockCenterX, clockCenterY, clockRadius * 0.7, 0, Math.PI * 2);
  ctx.arc(clockCenterX, clockCenterY, clockRadius * 0.65, 0, Math.PI * 2);
  ctx.arc(clockCenterX, clockCenterY, clockRadius * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  
  // > day of the week lines
  ctx.strokeStyle = 'rgb(127, 127, 127)';
  ctx.lineWidth = clockRadius * 0.007;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    let angle = Math.PI * 2 / 7 * i - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let dotwLinesInnerRadius = 0.65;
    let dotwLinesOuterRadius = 0.7;
    
    ctx.moveTo(
      clockCenterX + normalizedX * clockRadius * dotwLinesInnerRadius,
      clockCenterY + normalizedY * clockRadius * dotwLinesInnerRadius
    );
    ctx.lineTo(
      clockCenterX + normalizedX * clockRadius * dotwLinesOuterRadius,
      clockCenterY + normalizedY * clockRadius * dotwLinesOuterRadius
    );
  }
  ctx.stroke();
  
  // > text for each day of the week
  let dotwTextHeight = clockRadius * 0.04;
  ctx.fillStyle = 'rgb(192, 192, 192)';
  ctx.font = `${dotwTextHeight}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < 7; i++) {
    let angle = Math.PI * 2 / 7 * (i + 0.5) - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let dotwString = DAY_OF_WEEK_STRINGS_CAPS[i];
    
    let dotwTextRadius = 0.675;
    let dotwTextPosX = clockCenterX + normalizedX * clockRadius * dotwTextRadius;
    let dotwTextPosY = clockCenterY + normalizedY * clockRadius * dotwTextRadius;
    
    // rotate text to follow contour of circle
    let dotwTextAngle = angle + Math.PI / 2;
    
    // but if text is more than 50% of the way to being upside down, flip the text 180 degrees
    if (dotwTextAngle > Math.PI / 2 && dotwTextAngle < 3 * Math.PI / 2) {
      dotwTextAngle += Math.PI;
    }
    
    ctx.save();
    ctx.translate(dotwTextPosX, dotwTextPosY);
    ctx.rotate(dotwTextAngle);
    ctx.fillText(dotwString, 0, 0);
    ctx.restore();
  }
  
  // > green line for current time in week
  {
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.lineWidth = clockRadius * 0.007;
    ctx.lineCap = 'butt';
    
    let fractionalDayOfWeek =
      now.getDay() +
      now.getHours() / 24 +
      now.getMinutes() / 24 / 60 +
      now.getSeconds() / 24 / 3600;
    
    let angle = Math.PI * 2 / 7 * fractionalDayOfWeek - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let dotwLinesInnerRadius = 0.65;
    let dotwLinesOuterRadius = 0.7;
    
    ctx.beginPath();
    ctx.moveTo(
      clockCenterX + normalizedX * clockRadius * dotwLinesInnerRadius,
      clockCenterY + normalizedY * clockRadius * dotwLinesInnerRadius
    );
    ctx.lineTo(
      clockCenterX + normalizedX * clockRadius * dotwLinesOuterRadius,
      clockCenterY + normalizedY * clockRadius * dotwLinesOuterRadius
    );
    ctx.stroke();
  }
  
  // > month of the year lines
  let yearLengthDays = getYearLength(now.getYear());
  
  ctx.strokeStyle = 'rgb(127, 127, 127)';
  ctx.lineWidth = clockRadius * 0.007;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    let angle = Math.PI * 2 / yearLengthDays * monthStartingDayOfYear(now.getFullYear(), i + 1) - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let dotwLinesInnerRadius = 0.6;
    let dotwLinesOuterRadius = 0.65;
    
    ctx.moveTo(
      clockCenterX + normalizedX * clockRadius * dotwLinesInnerRadius,
      clockCenterY + normalizedY * clockRadius * dotwLinesInnerRadius
    );
    ctx.lineTo(
      clockCenterX + normalizedX * clockRadius * dotwLinesOuterRadius,
      clockCenterY + normalizedY * clockRadius * dotwLinesOuterRadius
    );
  }
  ctx.stroke();
  
  // > text for each month of the year
  let motyTextHeight = clockRadius * 0.04;
  ctx.fillStyle = 'rgb(192, 192, 192)';
  ctx.font = `${motyTextHeight}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < 12; i++) {
    let monthHalfwayDayOfYear = (monthStartingDayOfYear(now.getFullYear(), i + 1) + monthStartingDayOfYear(now.getFullYear(), i + 2)) / 2;
    
    let angle = Math.PI * 2 / yearLengthDays * monthHalfwayDayOfYear - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let motyString = MONTH_OF_YEAR_STRINGS_CAPS[i];
    
    let motyTextRadius = 0.625;
    let motyTextPosX = clockCenterX + normalizedX * clockRadius * motyTextRadius;
    let motyTextPosY = clockCenterY + normalizedY * clockRadius * motyTextRadius;
    
    // rotate text to follow contour of circle
    let motyTextAngle = angle + Math.PI / 2;
    
    // but if text is more than 50% of the way to being upside down, flip the text 180 degrees
    if (motyTextAngle > Math.PI / 2 && motyTextAngle < 3 * Math.PI / 2) {
      motyTextAngle += Math.PI;
    }
    
    ctx.save();
    ctx.translate(motyTextPosX, motyTextPosY);
    ctx.rotate(motyTextAngle);
    ctx.fillText(motyString, 0, 0);
    ctx.restore();
  }
  
  // > green line for current time in year
  {
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.lineWidth = clockRadius * 0.007;
    ctx.lineCap = 'butt';
    
    let fractionalDayOfYear =
      getDayOfYear(now.getFullYear(), now.getMonth() + 1, now.getDate()) +
      now.getHours() / 24 +
      now.getMinutes() / 24 / 60 +
      now.getSeconds() / 24 / 3600;
    
    let angle = Math.PI * 2 / yearLengthDays * fractionalDayOfYear - Math.PI / 2;
    
    let normalizedX = Math.cos(angle);
    let normalizedY = Math.sin(angle);
    
    let motyLinesInnerRadius = 0.6;
    let motyLinesOuterRadius = 0.65;
    
    ctx.beginPath();
    ctx.moveTo(
      clockCenterX + normalizedX * clockRadius * motyLinesInnerRadius,
      clockCenterY + normalizedY * clockRadius * motyLinesInnerRadius
    );
    ctx.lineTo(
      clockCenterX + normalizedX * clockRadius * motyLinesOuterRadius,
      clockCenterY + normalizedY * clockRadius * motyLinesOuterRadius
    );
    ctx.stroke();
  }
  
  // > print time inside clock
  // >> calculate time string
  let timeString =
    (now.getHours() + '').padStart(2, '0') + ':' +
    (now.getMinutes() + '').padStart(2, '0') + ':' +
    (now.getSeconds() + '').padStart(2, '0');
  
  // >> print time
  let timeTextPosY = clockCenterY - clockRadius * 0.06;
  let timeTextHeight = clockRadius * 0.26;
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
