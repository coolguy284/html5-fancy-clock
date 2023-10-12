// register event listeners
addEventListener('load', () => {
  if (LOG_DEBUG) console.debug('load');
  resetCanvasSize();
  renderFrame(true);
});

addEventListener('resize', () => {
  if (LOG_DEBUG) console.debug('resize');
  resetCanvasSize();
  renderFrame(true);
});
