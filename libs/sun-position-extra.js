function PrintSunAngleOverTime(lat, lon, year, month, day, timezoneOffsetMinutes, minuteStep, heightAndAngleFunc) {
  if (minuteStep == null) minuteStep = 60;
  
  for (let minute = 0; minute < 24 * 60; minute += minuteStep) {
    let startOfDayMillisUTC = new Date(
      `${year < 0 ? '-' + (-year + '').padStart(6, '0') : (year + '').padStart(4, '0')}-${(month + '').padStart(2, '0')}-${(day + '').padStart(2, '0')}T00:00:00.000Z`
    ).getTime();
    let minuteInDayOffsetUTC = (timezoneOffsetMinutes + minute) * 60_000;
    
    let { height, angle } = heightAndAngleFunc(
      lat, lon,
      new Date(startOfDayMillisUTC + minuteInDayOffsetUTC)
    );
    
    console.log(
      (Math.floor(minute / 60) + '').padStart(2, '0') + ':' +
      (minute % 60 + '').padStart(2, '0') + ' ' +
      (height >= -0.75 ? 'DAY  ' : 'NIGHT') + ' ' + // rule of thumb is near the horizon, sun will refract upwards by a full sun width cause of the atmosphere, so sunrise starts when the center of the sun is 1.5 sun widths below horizon
      height + ' ' +
      angle
    );
  }
}

function PrintSunAngleOverTime_V1(lat, lon, year, month, day, timezoneOffsetMinutes, minuteStep) {
  return PrintSunAngleOverTime(
    lat, lon,
    year, month, day,
    timezoneOffsetMinutes,
    minuteStep,
    GetHeightAndAngleOfSun_ConventionalDegrees
  );
}

function PrintSunAngleOverTime_V2(lat, lon, year, month, day, timezoneOffsetMinutes, minuteStep) {
  return PrintSunAngleOverTime(
    lat, lon,
    year, month, day,
    timezoneOffsetMinutes,
    minuteStep,
    GetHeightAndAngleOfSun_ConventionalDegrees_StackOverflow
  );
}

function PrintSunAngleOverTime_CurrentDay_V2(lat, lon, minuteStep) {
  let now = new Date();
  
  PrintSunAngleOverTime_V2(
    lat, lon,
    now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(),
    now.getTimezoneOffset(),
    minuteStep
  );
}
