// function to show and hide settings menu
function toggleSettingsVisibility() {
  if (settings_div.style.display == 'none') {
    settings_div.style.display = '';
  } else {
    settings_div.style.display = 'none';
    location_settings_div.style.display = 'none';
  }
}

function toggleLocationSettings() {
  if (location_settings_div.style.display == 'none') {
    location_settings_div.style.display = '';
  } else {
    location_settings_div.style.display = 'none';
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
  
  CLOCK_OFFSET_HOURS = Number(clock_offset_hours.value);
  if (!Number.isFinite(CLOCK_OFFSET_HOURS)) CLOCK_OFFSET_HOURS = 0;
  
  ADVANCED_MOTIF_CALCULATION = advanced_motif_calculation.checked;
  
  LATITUDE = Number(latitude.value);
  if (!Number.isFinite(LATITUDE)) LATITUDE = 0;
  
  LONGITUDE = Number(longitude.value);
  if (!Number.isFinite(LONGITUDE)) LONGITUDE = 0;
  
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
  clock_offset_hours.value = numberToStringWithMinimumDecimalPlaces(CLOCK_OFFSET_HOURS, 0);
  advanced_motif_calculation.checked = ADVANCED_MOTIF_CALCULATION;
  latitude.value = numberToStringWithMinimumDecimalPlaces(LATITUDE, 3);
  longitude.value = numberToStringWithMinimumDecimalPlaces(LONGITUDE, 3);
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
