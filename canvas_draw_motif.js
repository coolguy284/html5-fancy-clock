function renderFrame_DrawClockMotif(ctx, now, clockCenterX, clockCenterY, clockRadius) {
  let motif;
  
  if (ADVANCED_MOTIF_CALCULATION) {
    let sunHeight = GetHeightAndAngleOfSun_ConventionalDegrees(LATITUDE, LONGITUDE, now).height;
    
    let motifEntry;
    for (motifEntry of ADVANCED_MOTIF_HEIGHT_CHART) {
      if (motifEntry[0] >= sunHeight) break;
    }
    
    motif = motifEntry[1];
  } else {
    let minuteOfDay = now.getHours() * 60 + now.getMinutes();
    
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
      ctx.lineWidth = canvas.height * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.arc(clockCenterX, clockCenterY, clockRadius * 0.35, 0, Math.PI * 2);
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
          clockCenterX + normalizedX * clockRadius * innerRadius,
          clockCenterY + normalizedY * clockRadius * innerRadius
        );
        ctx.lineTo(
          clockCenterX + normalizedX * clockRadius * outerRadius,
          clockCenterY + normalizedY * clockRadius * outerRadius
        );
      }
      ctx.stroke();
      } break;
    
    case 'sunrise': {
      // >> sunrise motif
      // >>> upper circle
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.15)';
      ctx.lineWidth = canvas.height * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.arc(clockCenterX, clockCenterY, clockRadius * 0.35, Math.PI * 0.99, Math.PI * 2.01);
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
          clockCenterX + normalizedX * clockRadius * innerRadius,
          clockCenterY + normalizedY * clockRadius * innerRadius
        );
        ctx.lineTo(
          clockCenterX + normalizedX * clockRadius * outerRadius,
          clockCenterY + normalizedY * clockRadius * outerRadius
        );
      }
      ctx.stroke();
      
      // >>> white line below
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = canvas.height * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(
        clockCenterX - clockRadius * outerRadius,
        clockCenterY + clockRadius * 0.07
      );
      ctx.lineTo(
        clockCenterX + clockRadius * outerRadius,
        clockCenterY + clockRadius * 0.07
      );
      ctx.stroke();
      } break;
    
    case 'moon': {
      // >> moon motif
      ctx.strokeStyle = 'rgba(0, 127, 255, 0.18)';
      ctx.lineWidth = canvas.height * 0.007;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      // >>> arc 1
      ctx.arc(
        clockCenterX,
        clockCenterY,
        clockRadius * 0.5,
        Math.PI * 2 * (0.125 - 0.271),
        Math.PI * 2 * (0.125 + 0.271)
      );
      // >>> arc 2
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
      } break;
  }
}
