function renderFrame_DrawClockMotif(ctx, now, clockCenterX, clockCenterY, clockRadius) {
  let motif;
  
  if (ADVANCED_MOTIF_CALCULATION) {
    motif = GetHeightAndAngleOfSun_ConventionalDegrees(LATITUDE, LONGITUDE, now).height >= 0 ? 'sun' : 'moon';
  } else {
    motif = now.getHours() >= 6 && now.getHours() <= 17 ? 'sun' : 'moon';
  }
  
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
