// all these functions assume a spherical earth (for now possibly)
// latitude in radians, from -pi/2 (south pole) to pi/2 (north pole)
// longitude in radians, from -pi (-180 deg) to pi (180 deg)
// vector form is [x, y, z], with x being to "right" (in direction of 0 deg longitude), y being to "back" (in direction of 90 deg longitude), and z being "north" (in direction of north pole), stated directions are from the center of earth

// https://www.timeanddate.com/sun/@0,0?month=1&year=1970
// on Jan 1 1970, sunrise occured at 5:59am at 0,0
let EARTH_NON_TILTED_REL_INITAL_ANGLE = 1 / 180 * Math.PI; // guessed to make the sunrise time close
let EARTH_NON_TILTED_REL_EPOCH = 0; // default to unix epoch
// https://en.wikipedia.org/wiki/Sidereal_time
let EARTH_NON_TILTED_REL_DAY_LENGTH = 86_400.002 / 1.002_737_811_911_354_48; // probably accurate
// https://en.wikipedia.org/wiki/Axial_tilt
let EARTH_TILTED_REL_TILT_AMOUNT = 23.44 / 180 * Math.PI;
let SUN_AROUND_EARTH_EPOCH = 0; // default to unix epoch
// https://en.wikipedia.org/wiki/Time_standard
let SUN_AROUND_EARTH_YEAR_LENGTH = 31_556_925.9747;
// calibrations from https://www.timeanddate.com/calendar/seasons.html?year=1950&n=1
// winter solstice that is right before 1970, for Abidjan, Cote d'lvoire (closest place to 0,0) is at Dec 22 12:43 am GMT (exactly 9 days, 83820 seconds before 1970 midnight, which is 861420 seconds)
// below, initial angle of 0 treats earth as to the right of sun, and north pole tilted toward sun (northern summer) at Jan 1 1970 12:00am UTC
// it should at least be 180deg different from that so it is northern winter instead, then add a little bit of time corresponding to 9.X days more, by start of 1970
// angle below is angle of earth relative to sun
let _SUN_AROUND_EARTH_EXTRA_YEAR_FRAC_TO_ADD = 861_420 / SUN_AROUND_EARTH_YEAR_LENGTH;
let SUN_AROUND_EARTH_INITIAL_ANGLE = 0;
let EARTH_TILTED_REL_TILT_PHASE = Math.PI / 2 + _SUN_AROUND_EARTH_EXTRA_YEAR_FRAC_TO_ADD * 2 * Math.PI;


// returns a vector for the normal/zenith (perpendicular to surface) vector and north pointing vector (along surface) given latitude and longitude, in the rotating earth at center frame of reference
function EarthRotRel_LatLong_ZenithAndNorth(lat, lon) {
  // zenith vector is just vector from center of earth to surface point
  let zenith = [Math.cos(lon) * Math.cos(lat), Math.sin(lon) * Math.cos(lat), Math.sin(lat)];
  
  // north vector is just winging it
  let north = [-Math.cos(lon) * Math.sin(lat), -Math.sin(lon) * Math.sin(lat), Math.cos(lat)];
  
  return {
    zenith,
    north,
  }
}

// converts a vector from earth rotation relative to earth non tilted relative (so only a rotation of x and y coordinates based on the time is applied), time is seconds from epoch
function EarthRotRel_To_EarthNonTiltedRel(vec, seconds) {
  let angle = EarthNonTiltedRel_Seconds_To_Angle(seconds);
  
  return rotateXYPlane(vec, angle);
}

// converts a seconds since epoch to an angle
function EarthNonTiltedRel_Seconds_To_Angle(seconds) {
  let revolutionsSinceEpoch = seconds / EARTH_NON_TILTED_REL_DAY_LENGTH % 1;
  let radiansSinceEpoch = revolutionsSinceEpoch * 2 * Math.PI;
  
  return EARTH_NON_TILTED_REL_INITAL_ANGLE + radiansSinceEpoch;
}

// converts a vector from earth non tilted relative, currently does not account for precessional motions
function EarthNonTiltedRel_To_EarthTiltedRel(vec) {
  vec = rotateXYPlane(vec, -EARTH_TILTED_REL_TILT_PHASE);
  
  vec = rotateXZPlane(vec, EARTH_TILTED_REL_TILT_AMOUNT);
  
  vec = rotateXYPlane(vec, EARTH_TILTED_REL_TILT_PHASE);
  
  return vec;
}

// gets vector of sun position around earth, time is seconds from epoch
function EarthTiltedRel_SunPosition(seconds) {
  let angle = SunAroundEarth_Seconds_To_Angle(seconds);
  
  return [-Math.cos(angle), -Math.sin(angle), 0];
}

// converts a seconds since epoch to an angle
function SunAroundEarth_Seconds_To_Angle(seconds) {
  let revolutionsSinceEpoch = seconds / SUN_AROUND_EARTH_YEAR_LENGTH % 1;
  let radiansSinceEpoch = revolutionsSinceEpoch * 2 * Math.PI;
  
  return SUN_AROUND_EARTH_INITIAL_ANGLE + radiansSinceEpoch;
}


function EarthNonTiltedRel_DateObjectToEpoch(date) {
  return date.getTime() / 1000 - EARTH_NON_TILTED_REL_EPOCH;
}

function SunAroundEarth_DateObjectToEpoch(date) {
  return date.getTime() / 1000 - SUN_AROUND_EARTH_EPOCH;
}

function LatLon_DegreesToRadians(lat, lon) {
  return [
    lat / 180 * Math.PI,
    lon / 180 * Math.PI,
  ];
}

function HeightAngle_RadiansToDegrees(height, angle) {
  return {
    // height goes from -90 to 90
    height: height / Math.PI * 180,
    // angle goes from -180 to 180
    angle: angle / Math.PI * 180,
  };
}

function GetHeightAndAngleOfSun(lat, lon, date) {
  let secondsEarthNonTiltedRel = EarthNonTiltedRel_DateObjectToEpoch(date);
  let secondsSunAroundEarth = SunAroundEarth_DateObjectToEpoch(date);
  
  let earthRotRelVecs = EarthRotRel_LatLong_ZenithAndNorth(lat, lon);
  let earthNonTiltedRelVecs = {
    zenith: EarthRotRel_To_EarthNonTiltedRel(earthRotRelVecs.zenith, secondsEarthNonTiltedRel),
    north: EarthRotRel_To_EarthNonTiltedRel(earthRotRelVecs.north, secondsEarthNonTiltedRel),
  };
  let earthTiltedRelVecs = {
    zenith: EarthNonTiltedRel_To_EarthTiltedRel(earthNonTiltedRelVecs.zenith),
    north: EarthNonTiltedRel_To_EarthTiltedRel(earthNonTiltedRelVecs.north),
  };
  let zenithVector = earthTiltedRelVecs.zenith;
  let northVector = earthTiltedRelVecs.north;
  
  let sunPositionVec = EarthTiltedRel_SunPosition(secondsSunAroundEarth);
  
  let angleBetweenSunAndZenith = angleBetween(zenithVector, sunPositionVec);
  
  let sunHeight = Math.PI / 2 - angleBetweenSunAndZenith;
  
  let sunPositionRelEarthSurface_basisI = normalize(crossProduct(northVector, zenithVector));
  let sunPositionRelEarthSurface_basisJ = normalize(northVector);
  let sunPositionRelEarthSurface_basisK = normalize(zenithVector);
  
  let sunPositionRelEarthSurface = getVectorInBasis(
    sunPositionVec,
    sunPositionRelEarthSurface_basisI,
    sunPositionRelEarthSurface_basisJ,
    sunPositionRelEarthSurface_basisK
  );
  
  let sunPositionFlattenedToEarthSurface = normalize([
    sunPositionRelEarthSurface[0],
    sunPositionRelEarthSurface[1],
  ]);
  
  return {
    height: sunHeight,
    angle: Math.atan2(
      sunPositionFlattenedToEarthSurface[1],
      sunPositionFlattenedToEarthSurface[0]
    ), // 0 is east, goes CCW, range is -pi/2 to pi/2
  };
}

// same as above function but takes in degrees as input and outputs degrees
function GetHeightAndAngleOfSun_Degrees(lat, lon, date) {
  let radiansOutput = GetHeightAndAngleOfSun(...LatLon_DegreesToRadians(lat, lon), date);
  
  let degreesOutput = HeightAngle_RadiansToDegrees(radiansOutput.height, radiansOutput.angle);
  
  return degreesOutput;
}

// same as above function but takes in degrees as input and outputs conventional degrees (north is 0, going CCW)
function GetHeightAndAngleOfSun_ConventionalDegrees(lat, lon, date) {
  let degreesOutput = GetHeightAndAngleOfSun_Degrees(lat, lon, date);
  
  return {
    height: degreesOutput.height,
    // should convert from 0 to 360, to 90 to 90, going backwards
    angle: (-degreesOutput.angle + 90 + 360) % 360,
  };
}
