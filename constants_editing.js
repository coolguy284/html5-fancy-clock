function saveConstantsToPersistent() {
  localStorage.html5_fancy_clock_settings = JSON.stringify({
    CLOCK_DRAW_MODE,
    CLOCK_DRAW_MOTIF,
    CLOCK_SECONDS_VISIBLE,
    CLOCK_TIME_VISIBLE,
    CLOCK_DATE_VISIBLE,
    CLOCK_DRAW_BORDER,
    CLOCK_NUDGE_ONES,
    CLOCK_OFFSET_HOURS,
    LOCAL_TIMEZONE,
    TIMEZONE_OFFSET_HOURS,
    ADVANCED_MOTIF_CALCULATION,
    SUN_ANGLE_CALCULATION_METHOD,
    LATITUDE,
    LONGITUDE,
    DBLCLICK_TOGGLES_FULLSCREEN,
  });
}

function loadConstantsFromPersistent() {
  let localStorageData;
  try {
    localStorageData = JSON.parse(localStorage.html5_fancy_clock_settings);
  } catch (e) {
    localStorageData = {};
  }
  
  if ('CLOCK_DRAW_MODE' in localStorageData) CLOCK_DRAW_MODE = localStorageData.CLOCK_DRAW_MODE;
  if ('CLOCK_DRAW_MOTIF' in localStorageData) CLOCK_DRAW_MOTIF = localStorageData.CLOCK_DRAW_MOTIF;
  if ('CLOCK_SECONDS_VISIBLE' in localStorageData) CLOCK_SECONDS_VISIBLE = localStorageData.CLOCK_SECONDS_VISIBLE;
  if ('CLOCK_TIME_VISIBLE' in localStorageData) CLOCK_TIME_VISIBLE = localStorageData.CLOCK_TIME_VISIBLE;
  if ('CLOCK_DATE_VISIBLE' in localStorageData) CLOCK_DATE_VISIBLE = localStorageData.CLOCK_DATE_VISIBLE;
  if ('CLOCK_DRAW_BORDER' in localStorageData) CLOCK_DRAW_BORDER = localStorageData.CLOCK_DRAW_BORDER;
  if ('CLOCK_NUDGE_ONES' in localStorageData) CLOCK_NUDGE_ONES = localStorageData.CLOCK_NUDGE_ONES;
  if ('CLOCK_OFFSET_HOURS' in localStorageData) CLOCK_OFFSET_HOURS = localStorageData.CLOCK_OFFSET_HOURS;
  if ('LOCAL_TIMEZONE' in localStorageData) LOCAL_TIMEZONE = localStorageData.LOCAL_TIMEZONE;
  if ('TIMEZONE_OFFSET_HOURS' in localStorageData) TIMEZONE_OFFSET_HOURS = localStorageData.TIMEZONE_OFFSET_HOURS;
  if ('ADVANCED_MOTIF_CALCULATION' in localStorageData) ADVANCED_MOTIF_CALCULATION = localStorageData.ADVANCED_MOTIF_CALCULATION;
  if ('SUN_ANGLE_CALCULATION_METHOD' in localStorageData) SUN_ANGLE_CALCULATION_METHOD = localStorageData.SUN_ANGLE_CALCULATION_METHOD;
  if ('LATITUDE' in localStorageData) LATITUDE = localStorageData.LATITUDE;
  if ('LONGITUDE' in localStorageData) LONGITUDE = localStorageData.LONGITUDE;
  if ('DBLCLICK_TOGGLES_FULLSCREEN' in localStorageData) DBLCLICK_TOGGLES_FULLSCREEN = localStorageData.DBLCLICK_TOGGLES_FULLSCREEN;
}

function updateSettings(newSettings) {
  if ('CLOCK_DRAW_MODE' in newSettings) CLOCK_DRAW_MODE = newSettings.CLOCK_DRAW_MODE;
  if ('CLOCK_DRAW_MOTIF' in newSettings) CLOCK_DRAW_MOTIF = typeof newSettings.CLOCK_DRAW_MOTIF == 'string' ? stringToBool(newSettings.CLOCK_DRAW_MOTIF) : newSettings.CLOCK_DRAW_MOTIF;
  if ('CLOCK_SECONDS_VISIBLE' in newSettings) CLOCK_SECONDS_VISIBLE = typeof newSettings.CLOCK_SECONDS_VISIBLE == 'string' ? stringToBool(newSettings.CLOCK_SECONDS_VISIBLE) : newSettings.CLOCK_SECONDS_VISIBLE;
  if ('CLOCK_TIME_VISIBLE' in newSettings) CLOCK_TIME_VISIBLE = typeof newSettings.CLOCK_TIME_VISIBLE == 'string' ? stringToBool(newSettings.CLOCK_TIME_VISIBLE) : newSettings.CLOCK_TIME_VISIBLE;
  if ('CLOCK_DATE_VISIBLE' in newSettings) CLOCK_DATE_VISIBLE = typeof newSettings.CLOCK_DATE_VISIBLE == 'string' ? stringToBool(newSettings.CLOCK_DATE_VISIBLE) : newSettings.CLOCK_DATE_VISIBLE;
  if ('CLOCK_DRAW_BORDER' in newSettings) CLOCK_DRAW_BORDER = typeof newSettings.CLOCK_DRAW_BORDER == 'string' ? stringToBool(newSettings.CLOCK_DRAW_BORDER) : newSettings.CLOCK_DRAW_BORDER;
  if ('CLOCK_NUDGE_ONES' in newSettings) CLOCK_NUDGE_ONES = typeof newSettings.CLOCK_NUDGE_ONES == 'string' ? stringToBool(newSettings.CLOCK_NUDGE_ONES) : newSettings.CLOCK_NUDGE_ONES;
  if ('CLOCK_OFFSET_HOURS' in newSettings) CLOCK_OFFSET_HOURS = typeof newSettings.CLOCK_OFFSET_HOURS == 'string' ? Number(newSettings.CLOCK_OFFSET_HOURS) : newSettings.CLOCK_OFFSET_HOURS;
  if ('LOCAL_TIMEZONE' in newSettings) LOCAL_TIMEZONE = typeof newSettings.LOCAL_TIMEZONE == 'string' ? stringToBool(newSettings.LOCAL_TIMEZONE) : newSettings.LOCAL_TIMEZONE;
  if ('TIMEZONE_OFFSET_HOURS' in newSettings) TIMEZONE_OFFSET_HOURS = typeof newSettings.TIMEZONE_OFFSET_HOURS == 'string' ? Number(newSettings.TIMEZONE_OFFSET_HOURS) : newSettings.TIMEZONE_OFFSET_HOURS;
  if ('ADVANCED_MOTIF_CALCULATION' in newSettings) ADVANCED_MOTIF_CALCULATION = typeof newSettings.ADVANCED_MOTIF_CALCULATION == 'string' ? stringToBool(newSettings.ADVANCED_MOTIF_CALCULATION) : newSettings.ADVANCED_MOTIF_CALCULATION;
  if ('SUN_ANGLE_CALCULATION_METHOD' in newSettings) SUN_ANGLE_CALCULATION_METHOD = newSettings.SUN_ANGLE_CALCULATION_METHOD;
  if ('LATITUDE' in newSettings) LATITUDE = typeof newSettings.LATITUDE == 'string' ? Number(newSettings.LATITUDE) : newSettings.LATITUDE;
  if ('LONGITUDE' in newSettings) LONGITUDE = typeof newSettings.LONGITUDE == 'string' ? Number(newSettings.LONGITUDE) : newSettings.LONGITUDE;
  if ('DBLCLICK_TOGGLES_FULLSCREEN' in newSettings) DBLCLICK_TOGGLES_FULLSCREEN = typeof newSettings.DBLCLICK_TOGGLES_FULLSCREEN == 'string' ? stringToBool(newSettings.DBLCLICK_TOGGLES_FULLSCREEN) : newSettings.DBLCLICK_TOGGLES_FULLSCREEN;
  if ('HIDE_SETTINGS_BUTTON' in newSettings) HIDE_SETTINGS_BUTTON = typeof newSettings.HIDE_SETTINGS_BUTTON == 'string' ? stringToBool(newSettings.HIDE_SETTINGS_BUTTON) : newSettings.HIDE_SETTINGS_BUTTON;
  if ('SETTINGS_PERSISTENT_STORAGE' in newSettings) SETTINGS_PERSISTENT_STORAGE = typeof newSettings.SETTINGS_PERSISTENT_STORAGE == 'string' ? stringToBool(newSettings.SETTINGS_PERSISTENT_STORAGE) : newSettings.SETTINGS_PERSISTENT_STORAGE;
  endFrameWait(true);
}
