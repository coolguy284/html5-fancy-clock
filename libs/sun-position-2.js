// https://stackoverflow.com/questions/8708048/position-of-the-sun-given-time-of-day-latitude-and-longitude
// https://stackoverflow.com/a/8764866
let rValue_pi = Math.PI;

function rFunction_c(...elems) {
  // r arrays appear to start at 1, so there is a padding element
  return [null, ...elems];
}

function rFunction_cumsum(vec) {
  let newVec = [null];
  
  if (vec.length > 1) {
    newVec.push(vec[1]);
    
    for (let i = 2; i < vec.length; i++) {
      newVec.push(newVec[newVec.length - 1] + vec[i]);
    }
  }
  
  return newVec;
}

function rFunction_trunc(num) {
  return Math.trunc(num);
}

function rFunction_sin(num) {
  return Math.sin(num);
}

function rFunction_cos(num) {
  return Math.cos(num);
}

function rFunction_atan(num) {
  return Math.atan(num);
}

function rFunction_asin(num) {
  return Math.asin(num);
}

function GetSunPosition_StackOverflow(year, month, day, hour, min, sec, lat, long) {
  let twopi = 2 * rValue_pi;
  let deg2rad = rValue_pi / 180;
  
  // Get day of the year, e.g. Feb 1 = 32, Mar 1 = 61 on leap years
  let month_days = rFunction_c(0,31,28,31,30,31,30,31,31,30,31,30);
  day += rFunction_cumsum(month_days)[month];
  let leapdays = year % 4 == 0 && (year % 400 == 0 || year % 100 != 0) && day >= 60 && !(month == 2 && day == 60);
  if (leapdays) day++;
  
  // Get Julian date - 2400000
  hour = hour + min / 60 + sec / 3600; // hour plus fraction
  let delta = year - 1949;
  let leap = rFunction_trunc(delta / 4); // former leapyears
  let jd = 32916.5 + delta * 365 + leap + day + hour / 24;
  
  // The input to the Atronomer's almanach is the difference between
  // the Julian date and JD 2451545.0 (noon, 1 January 2000)
  let time = jd - 51545;
  
  // Ecliptic coordinates
  
  // Mean longitude
  let mnlong = 280.460 + .9856474 * time;
  mnlong %= 360;
  if (mnlong < 0) mnlong += 360;
  
  // Mean anomaly
  let mnanom = 357.528 + .9856003 * time;
  mnanom %= 360;
  if (mnanom < 0) mnanom += 360;
  mnanom *= deg2rad;
  
  // Ecliptic longitude and obliquity of ecliptic
  let eclong = mnlong + 1.915 * rFunction_sin(mnanom) + 0.020 * rFunction_sin(2 * mnanom);
  eclong %= 360;
  if (eclong < 0) eclong += 360;
  let oblqec = 23.439 - 0.0000004 * time;
  eclong *= deg2rad;
  oblqec *= deg2rad;
  
  // Celestial coordinates
  // Right ascension and declination
  let num = rFunction_cos(oblqec) * rFunction_sin(eclong);
  let den = rFunction_cos(eclong);
  let ra = rFunction_atan(num / den);
  if (den < 0) ra += rValue_pi;
  if (den >= 0 && num < 0) ra += twopi;
  let dec = rFunction_asin(rFunction_sin(oblqec) * rFunction_sin(eclong));
  
  // Local coordinates
  // Greenwich mean sidereal time
  let gmst = 6.697375 + .0657098242 * time + hour;
  gmst %= 24;
  if (gmst < 0) gmst += 24.;
  
  // Local mean sidereal time
  let lmst = gmst + long / 15.;
  lmst %= 24.;
  if (lmst < 0) lmst += 24.;
  lmst = lmst * 15. * deg2rad;
  
  // Hour angle
  let ha = lmst - ra;
  if (ha < -rValue_pi) ha += twopi;
  if (ha > rValue_pi) ha -= twopi;
  
  // Latitude to radians
  lat *= deg2rad;
  
  // Azimuth and elevation
  let el = rFunction_asin(rFunction_sin(dec) * rFunction_sin(lat) + rFunction_cos(dec) * rFunction_cos(lat) * rFunction_cos(ha));
  let az = rFunction_asin(-rFunction_cos(dec) * rFunction_sin(ha) / rFunction_cos(el));
  
  // For logic and names, see Spencer, J.W. 1989. Solar Energy. 42(4):353
  let cosAzPos = (0 <= rFunction_sin(dec) - rFunction_sin(el) * rFunction_sin(lat));
  let sinAzNeg = (rFunction_sin(az) < 0);
  if (cosAzPos && sinAzNeg) az += twopi;
  if (!cosAzPos) az = rValue_pi - az;
  
  // if (0 < rFunction_sin(dec) - rFunction_sin(el) * rFunction_sin(lat)) {
  //     if(rFunction_sin(az) < 0) az = az + twopi;
  // } else {
  //     az = rValue_pi - az;
  // }
  
  
  el /= deg2rad;
  az /= deg2rad;
  lat /= deg2rad;
  
  return {
    elevation: el,
    azimuth: az,
  };
}

function GetHeightAndAngleOfSun_ConventionalDegrees_StackOverflow(lat, lon, date) {
  let result = GetSunPosition_StackOverflow(
    date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
    lat, lon
  );
  
  return {
    height: result.elevation,
    angle: result.azimuth,
  };
}
