// function to show and hide settings menu
function toggleSettingsVisibility() {
  if (settings_div.style.display == 'none') {
    settings_div.style.display = '';
  } else {
    settings_div.style.display = 'none';
  }
}

// updates clock constant vars based on settings elements, then forces a refresh of the view
function updateClockConstants() {
  CLOCK_DRAW_MODE = document.querySelector('input[name=clock_draw_mode]:checked').parentElement.textContent.trim();
  CLOCK_12HR_MOTIF = m12hr_motif_visible.checked;
  renderFrame(true);
}

async function toggleFullscreen() {
  if (document.fullscreenEnabled) {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await canvas.requestFullscreen();
    }
  }
}
