// draws text to screen per letter, spaced using the letterSpacings array
function drawTextWithPerLetterSpacing(ctx, text, centerX, centerY, textHeight, letterSpacings) {
  // nudge printed text if "1" is on left side to make it visually centered
  if (CLOCK_NUDGE_ONES && text.length > 1 && text[0] == '1') {
    centerX -= 0.05 * textHeight;
  }
  
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
