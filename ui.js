function showSettingsPage() {
  settings_div.style.display = '';
}

function hideSettingsPage() {
  if (settings_div.style.display != 'none') {
    settings_div.style.display = 'none';
    location_settings_div.style.display = 'none';
  }
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
  CLOCK_DRAW_BORDER = draw_border.checked;
  CLOCK_NUDGE_ONES = nudge_ones.checked;
  
  CLOCK_OFFSET_HOURS = Number(clock_offset_hours.value);
  if (!Number.isFinite(CLOCK_OFFSET_HOURS)) CLOCK_OFFSET_HOURS = 0;
  
  LOCAL_TIMEZONE = timezone_offset_select.value == 'Local';
  
  TIMEZONE_OFFSET_HOURS = Number(timezone_offset_input.value);
  if (!Number.isFinite(TIMEZONE_OFFSET_HOURS)) TIMEZONE_OFFSET_HOURS = 0;
  
  ADVANCED_MOTIF_CALCULATION = advanced_motif_calculation.checked;
  SUN_ANGLE_CALCULATION_METHOD = sun_angle_calculation_method.value;
  
  LATITUDE = Number(latitude.value);
  if (!Number.isFinite(LATITUDE)) LATITUDE = 0;
  
  LONGITUDE = Number(longitude.value);
  if (!Number.isFinite(LONGITUDE)) LONGITUDE = 0;
  
  DBLCLICK_TOGGLES_FULLSCREEN = double_click_toggles_fullscreen.checked;
  
  let restartRenderLoop = false;
  
  if (FRAMERATE == 'Halted' && framerate.value != 'Halted') {
    restartRenderLoop = true;
  }
  
  FRAMERATE = framerate.value;
  
  if (restartRenderLoop) {
    renderFrameLoop();
  }
  
  if (SETTINGS_PERSISTENT_STORAGE) {
    saveConstantsToPersistent();
  }
  
  updateSettingsElemVisibilities();
  endFrameWait(true);
}

// updates ui checkboxes based on constant values
function updateSettingsUI() {
  // set elems
  clock_draw_mode.value = CLOCK_DRAW_MODE;
  motif_visible.checked = CLOCK_DRAW_MOTIF;
  seconds_visible.checked = CLOCK_SECONDS_VISIBLE;
  time_visible.checked = CLOCK_TIME_VISIBLE;
  date_visible.checked = CLOCK_DATE_VISIBLE;
  draw_border.checked = CLOCK_DRAW_BORDER;
  nudge_ones.checked = CLOCK_NUDGE_ONES;
  clock_offset_hours.value = numberToStringWithMinimumDecimalPlaces(CLOCK_OFFSET_HOURS, 0);
  timezone_offset_select.value = LOCAL_TIMEZONE ? 'Local' : 'Custom';
  timezone_offset_input.value = numberToStringWithMinimumDecimalPlaces(TIMEZONE_OFFSET_HOURS, 0);
  advanced_motif_calculation.checked = ADVANCED_MOTIF_CALCULATION;
  sun_angle_calculation_method.value = SUN_ANGLE_CALCULATION_METHOD;
  latitude.value = numberToStringWithMinimumDecimalPlaces(LATITUDE, 3);
  longitude.value = numberToStringWithMinimumDecimalPlaces(LONGITUDE, 3);
  double_click_toggles_fullscreen.checked = DBLCLICK_TOGGLES_FULLSCREEN;
  
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
      draw_border.parentElement.style.display = '';
      nudge_ones.parentElement.style.display = '';
      advanced_motif_calculation.parentElement.style.display = '';
      break;
    
    case '24 Hour Fancy (Main)':
    case '24 Hour Fancy (Background)':
    case '24 Hour Infospam (Main)':
    case '24 Hour Infospam (Background)':
      motif_visible.parentElement.style.display = 'none';
      seconds_visible.parentElement.style.display = 'none';
      time_visible.parentElement.style.display = 'none';
      date_visible.parentElement.style.display = 'none';
      draw_border.parentElement.style.display = 'none';
      nudge_ones.parentElement.style.display = 'none';
      advanced_motif_calculation.parentElement.style.display = 'none';
      break;
  }
  
  if (timezone_offset_select.value == 'Local') {
    timezone_offset_input.style.display = 'none';
  } else {
    timezone_offset_input.style.display = '';
  }
}

async function setLocationVarsToCurrentLocation() {
  if (currentlyGettingLocation) return;
  
  set_to_current_location_btn.setAttribute('disabled', '');
  currentlyGettingLocation = true;
  
  try {
    let position = await new Promise(
      (r, j) =>
        navigator.geolocation.getCurrentPosition(r, j, {
          maximumAge: 0,
          timeout: 60_000,
          enableHighAccuracy: true,
        })
    );
    
    LATITUDE = position.coords.latitude;
    LONGITUDE = position.coords.longitude;
    
    updateSettingsUI();
  } catch (err) {
    alert(`Geolocation Error:\n${err.message}`);
  }
  
  currentlyGettingLocation = false;
  set_to_current_location_btn.removeAttribute('disabled');
}

function updateSettingsFromUrlSearchLikeSegment(searchSegment) {
  let searchSplit = searchSegment.split('?');
  if (searchSplit.length > 1) {
    let paramString = searchSplit.slice(1).join('?');
    let params = Object.fromEntries(paramString.split('&').map(x => {
      let [ param, value ] = x.split('=');
      return [param, decodeURIComponent(value)];
    }));
    
    updateSettings(params);
  }
}

function updateSettingsFromOwnURL(hashOnly) {
  if (!hashOnly) {
    updateSettingsFromUrlSearchLikeSegment(location.search);
  }
  updateSettingsFromUrlSearchLikeSegment(location.hash);
}

async function stopFullscreen() {
  await document.exitFullscreen();
}

async function goFullscreen() {
  if (document.fullscreenEnabled) {
    await canvas.requestFullscreen();
    hideSettingsPage();
  }
}

async function toggleFullscreen() {
  if (document.fullscreenEnabled) {
    if (document.fullscreenElement) {
      await stopFullscreen();
    } else {
      await goFullscreen();
    }
  }
}
