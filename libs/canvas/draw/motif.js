function getSunHeightAndAngle(date) {
  switch (SUN_ANGLE_CALCULATION_METHOD) {
    case 'Personal (Intuitive)':
      return GetHeightAndAngleOfSun_ConventionalDegrees(LATITUDE, LONGITUDE, date);
    
    case 'Stackoverflow (Accurate)':
      return GetHeightAndAngleOfSun_ConventionalDegrees_StackOverflow(LATITUDE, LONGITUDE, date);
  }
}

function getSunHeight(date) {
  return getSunHeightAndAngle(date).height;
}

function renderFrame_DrawClockMotif(ctx, nowData, x, y, radius, forceAdvancedMotif) {
  // radius variable was originally based off of clockradius
  radius /= 0.55;
  
  let motif;
  
  if (ADVANCED_MOTIF_CALCULATION || forceAdvancedMotif) {
    let sunHeight = getSunHeight(nowData.dateObj);
    
    let motifEntry;
    for (motifEntry of ADVANCED_MOTIF_HEIGHT_CHART) {
      if (motifEntry[0] >= sunHeight) break;
    }
    
    motif = motifEntry[1];
  } else {
    let minuteOfDay = nowData.hour * 60 + nowData.minute;
    
    let motifEntry;
    for (motifEntry of SIMPLE_MOTIF_MINUTE_CHART) {
      if (motifEntry[0] >= minuteOfDay) break;
    }
    
    motif = motifEntry[1];
  }
  
  switch (motif) {
    case 'sun': {
      // >> sun motif
      // >>> circle
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.15)';
      ctx.lineWidth = radius / 0.43 / 0.9 * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      
      // >>> lines around
      let numOfLines = 12;
      
      let innerRadius = 0.40;
      let outerRadius = 0.55;
      
      ctx.beginPath();
      for (let i = 0; i < numOfLines; i++) {
        let angle = Math.PI * 2 / numOfLines * i - Math.PI / 2;
        
        let normalizedX = Math.cos(angle);
        let normalizedY = Math.sin(angle);
        
        ctx.moveTo(
          x + normalizedX * radius * innerRadius,
          y + normalizedY * radius * innerRadius
        );
        ctx.lineTo(
          x + normalizedX * radius * outerRadius,
          y + normalizedY * radius * outerRadius
        );
      }
      ctx.stroke();
      } break;
    
    case 'sunrise': {
      // >> sunrise motif
      // >>> upper circle
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.15)';
      ctx.lineWidth = radius / 0.43 / 0.9 * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.35, Math.PI * 0.99, Math.PI * 2.01);
      ctx.stroke();
      
      // >>> lines around
      let numOfLines = 6;
        
      let innerRadius = 0.40;
      let outerRadius = 0.55;
      
      ctx.beginPath();
      for (let i = 0; i <= numOfLines; i++) {
        let angle = -Math.PI / numOfLines * i;
        
        let normalizedX = Math.cos(angle);
        let normalizedY = Math.sin(angle);
        
        ctx.moveTo(
          x + normalizedX * radius * innerRadius,
          y + normalizedY * radius * innerRadius
        );
        ctx.lineTo(
          x + normalizedX * radius * outerRadius,
          y + normalizedY * radius * outerRadius
        );
      }
      ctx.stroke();
      
      // >>> white line below
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = radius / 0.43 / 0.9 * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(
        x - radius * outerRadius,
        y + radius * 0.07
      );
      ctx.lineTo(
        x + radius * outerRadius,
        y + radius * 0.07
      );
      ctx.stroke();
      } break;
    
    case 'moon': {
      // >> moon motif
      ctx.strokeStyle = 'rgba(0, 127, 255, 0.18)';
      ctx.lineWidth = radius / 0.43 / 0.9 * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      // >>> arc 1
      ctx.arc(
        x,
        y,
        radius * 0.5,
        Math.PI * 2 * (0.125 - 0.271),
        Math.PI * 2 * (0.125 + 0.271)
      );
      // >>> arc 2
      ctx.arc(
        x + radius * -0.35,
        y + radius * -0.35,
        radius * 0.65,
        Math.PI * 2 * (0.125 + 0.138),
        Math.PI * 2 * (0.125 - 0.138),
        true
      );
      ctx.closePath();
      ctx.stroke();
      } break;
  }
}
