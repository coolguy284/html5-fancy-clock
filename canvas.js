// sets canvas pixel width and height to its css width and height
function resetCanvasSize() {
  let canvasStyle = getComputedStyle(canvas);
  
  let canvasWidth = parseInt(canvasStyle.width);
  let canvasHeight = parseInt(canvasStyle.height);
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

// draws text to screen per letter, spaced using the letterSpacings array
function drawTextWithPerLetterSpacing(ctx, text, centerX, centerY, letterSpacings) {
  // calculate cumulative version of letterSpacings array
  let letterSpacingsCumulative = letterSpacings.reduce((a, c) => {
    a.push(a.length == 0 ? c : a[a.length - 1] + c);
    return a;
  }, []);
  
  // calculate offset from centerX all letters will be drawn from
  let centerXOffset = (letterSpacingsCumulative[0] + letterSpacingsCumulative[letterSpacingsCumulative.length - 1]) / 2 * -1;
  
  // draw spaced letters
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], centerX + centerXOffset + letterSpacingsCumulative[i], centerY);
  }
}

// draws clock onto canvas
function renderFrame(forceRerender) {
  // get current date
  let now = new Date();
  
  // only rerender if seconds changed or force rerender
  if ((now.getSeconds() != oldSecondsValue) || forceRerender) {
    // get context
    let ctx = canvas.getContext('2d');
    
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (CLOCK_DRAW_MODE) {
      case '12 Hour':
        {
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
            
            let handRadiusStart = -0.01;
            let handRadiusEnd = 0.55;
            
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
            
            let handRadiusStart = -0.05;
            let handRadiusEnd = 0.55;
            
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
        break;
      
      case '24 Hour':
        {
          // print title at top of screen
          ctx.fillStyle = 'white';
          ctx.font = `10vh sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('24-Hour Time', canvas.width / 2, canvas.height * 0.08);
          
          // draw clock
          // > define variables
          let clockCenterX = canvas.width / 2;
          let clockCenterY = canvas.height * 0.55;
          let clockRadius = canvas.height * 0.35;
          
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
        break;
    }
    
    oldSecondsValue = now.getSeconds();
  }
  
  // queue next frame render
  requestAnimationFrame(renderFrameCallback);
}

// render frame callback used by requestAnimationFrame, this is done to ignore args passed in by requestAnimationFrame
function renderFrameCallback() {
  renderFrame();
}
