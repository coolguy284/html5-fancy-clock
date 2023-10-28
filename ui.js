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
  CLOCK_DRAW_MOTIF = motif_visible.checked;
  CLOCK_SECONDS_VISIBLE = seconds_visible.checked;
  CLOCK_TIME_VISIBLE = time_visible.checked;
  CLOCK_DATE_VISIBLE = date_visible.checked;
  CLOCK_NUDGE_ONES = nudge_ones.checked;
  saveConstantsToPersistent();
  renderFrame(true);
}

// updates ui checkboxes based on constant values
function updateSettingsUI() {
  // set elem for CLOCK_DRAW_MODE
  Array.from(document.querySelectorAll('input[name=clock_draw_mode]')).map(elem => {
    elem.checked = elem.parentElement.textContent.trim() == CLOCK_DRAW_MODE;
  });
  // set other elems
  motif_visible.checked = CLOCK_DRAW_MOTIF;
  seconds_visible.checked = CLOCK_SECONDS_VISIBLE;
  time_visible.checked = CLOCK_TIME_VISIBLE;
  date_visible.checked = CLOCK_DATE_VISIBLE;
  nudge_ones.checked = CLOCK_NUDGE_ONES;
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
