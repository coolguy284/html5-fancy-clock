function saveConstantsToPersistent() {
  localStorage.html5_fancy_clock_settings = JSON.stringify({
    CLOCK_DRAW_MODE,
    CLOCK_DRAW_MOTIF,
    CLOCK_SECONDS_VISIBLE,
    CLOCK_TIME_VISIBLE,
    CLOCK_DATE_VISIBLE,
    CLOCK_NUDGE_ONES,
    CLOCK_OFFSET_HOURS,
    ADVANCED_MOTIF_CALCULATION,
    LATITUDE,
    LONGITUDE,
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
  if ('CLOCK_NUDGE_ONES' in localStorageData) CLOCK_NUDGE_ONES = localStorageData.CLOCK_NUDGE_ONES;
  if ('CLOCK_OFFSET_HOURS' in localStorageData) CLOCK_OFFSET_HOURS = localStorageData.CLOCK_OFFSET_HOURS;
  if ('ADVANCED_MOTIF_CALCULATION' in localStorageData) ADVANCED_MOTIF_CALCULATION = localStorageData.ADVANCED_MOTIF_CALCULATION;
  if ('LATITUDE' in localStorageData) LATITUDE = localStorageData.LATITUDE;
  if ('LONGITUDE' in localStorageData) LONGITUDE = localStorageData.LONGITUDE;
}
