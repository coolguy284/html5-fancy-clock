// synchronous code before load

function preInit() {
  updateSettingsFromOwnURL();
  
  if (HIDE_SETTINGS_BUTTON) {
    settings_button.style.display = 'none';
  }
}

preInit();

// register event listeners

addEventListener('load', () => {
  if (LOG_DEBUG) console.debug('load');
  resetCanvasSize();
  
  if (SETTINGS_PERSISTENT_STORAGE) {
    loadConstantsFromPersistent();
  }
  
  updateSettingsUI();
  
  // start the rendering frame loop only if framerate is not halted
  if (FRAMERATE == 'Halted') {
    renderFrame(true);
  } else {
    renderFrameLoop();
  }
});

addEventListener('hashchange', () => {
  if (LOG_DEBUG) console.debug('hashchange');
  updateSettingsFromOwnURL(true);
});

addEventListener('resize', () => {
  if (LOG_DEBUG) console.debug('resize');
  resetCanvasSize();
  endFrameWait(true);
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
