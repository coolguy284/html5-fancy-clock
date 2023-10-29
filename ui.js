function showSettingsPage() {
  settings_div.style.display = '';
}

function hideSettingsPage() {
  settings_div.style.display = 'none';
  location_settings_div.style.display = 'none';
}

// function to show and hide settings menu
function toggleSettingsVisibility() {
  if (settings_div.style.display == 'none') {
    showSettingsPage();
  } else {
    hideSettingsPage();
  }
}

function toggleLocationSettings() {
  if (location_settings_div.style.display == 'none') {
    location_settings_div.style.display = '';
  } else {
    location_settings_div.style.display = 'none';
  }
}

function revealAboutPage() {
  hideSettingsPage();
  about_div.style.display = '';
}

function closeAboutPage() {
  about_div.style.display = 'none';
}

// updates clock constant vars based on settings elements, then forces a refresh of the view
function updateClockConstants() {
  CLOCK_DRAW_MODE = clock_draw_mode.value;
  CLOCK_DRAW_MOTIF = motif_visible.checked;
  CLOCK_SECONDS_VISIBLE = seconds_visible.checked;
  CLOCK_TIME_VISIBLE = time_visible.checked;
  CLOCK_DATE_VISIBLE = date_visible.checked;
  CLOCK_NUDGE_ONES = nudge_ones.checked;
  
  CLOCK_OFFSET_HOURS = Number(clock_offset_hours.value);
  if (!Number.isFinite(CLOCK_OFFSET_HOURS)) CLOCK_OFFSET_HOURS = 0;
  
  ADVANCED_MOTIF_CALCULATION = advanced_motif_calculation.checked;
  SUN_ANGLE_CALCULATION_METHOD = sun_angle_calculation_method.value;
  
  LATITUDE = Number(latitude.value);
  if (!Number.isFinite(LATITUDE)) LATITUDE = 0;
  
  LONGITUDE = Number(longitude.value);
  if (!Number.isFinite(LONGITUDE)) LONGITUDE = 0;
  
  saveConstantsToPersistent();
  updateSettingsElemVisibilities();
  renderFrame(true);
}

// updates ui checkboxes based on constant values
function updateSettingsUI() {
  // set elems
  clock_draw_mode.value = CLOCK_DRAW_MODE;
  motif_visible.checked = CLOCK_DRAW_MOTIF;
  seconds_visible.checked = CLOCK_SECONDS_VISIBLE;
  time_visible.checked = CLOCK_TIME_VISIBLE;
  date_visible.checked = CLOCK_DATE_VISIBLE;
  nudge_ones.checked = CLOCK_NUDGE_ONES;
  clock_offset_hours.value = numberToStringWithMinimumDecimalPlaces(CLOCK_OFFSET_HOURS, 0);
  advanced_motif_calculation.checked = ADVANCED_MOTIF_CALCULATION;
  sun_angle_calculation_method.value = SUN_ANGLE_CALCULATION_METHOD;
  latitude.value = numberToStringWithMinimumDecimalPlaces(LATITUDE, 3);
  longitude.value = numberToStringWithMinimumDecimalPlaces(LONGITUDE, 3);
  
  // update elem visibilities
  updateSettingsElemVisibilities();
}

// updates visiblity of checkboxes based on clock mode
function updateSettingsElemVisibilities() {
  switch (CLOCK_DRAW_MODE) {
    case '12 Hour':
    case '24 Hour':
      motif_visible.parentElement.style.display = '';
      seconds_visible.parentElement.style.display = '';
      time_visible.parentElement.style.display = '';
      date_visible.parentElement.style.display = '';
      nudge_ones.parentElement.style.display = '';
      advanced_motif_calculation.parentElement.style.display = '';
      break;
    
    case '24 Hour Fancy (Main)':
    case '24 Hour Fancy (Background)':
      motif_visible.parentElement.style.display = 'none';
      seconds_visible.parentElement.style.display = 'none';
      time_visible.parentElement.style.display = 'none';
      date_visible.parentElement.style.display = 'none';
      nudge_ones.parentElement.style.display = 'none';
      advanced_motif_calculation.parentElement.style.display = 'none';
      break;
  }
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
