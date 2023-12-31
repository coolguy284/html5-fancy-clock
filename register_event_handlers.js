// register event listeners
addEventListener('load', () => {
  if (LOG_DEBUG) console.debug('load');
  resetCanvasSize();
  
  loadConstantsFromPersistent();
  updateSettingsUI();
  
  // start the rendering frame loop
  renderFrameLoop();
});

addEventListener('resize', () => {
  if (LOG_DEBUG) console.debug('resize');
  resetCanvasSize();
  renderFrame(true);
});

addEventListener('dblclick', async () => {
  if (LOG_DEBUG) console.debug('dblclick');
  if (DBLCLICK_TOGGLES_FULLSCREEN) {
    await toggleFullscreen();
  }
});

addEventListener('keydown', evt => {
  switch (evt.key) {
    case 'Escape':
      hideSettingsPage();
      break;
  }
});
