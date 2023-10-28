// all these functions assume a spherical earth (for now possibly)
// latitude in radians, from -pi/2 (south pole) to pi/2 (north pole)
// longitude in radians, from -pi (-180 deg) to pi (180 deg)
// vector form is [x, y, z], with x being to "right" (in direction of 0 deg longitude), y being to "back" (in direction of 90 deg longitude), and z being "north" (in direction of north pole), stated directions are from the center of earth

let EARTH_NON_TILTED_REL_INITAL_ANGLE = 0; // TODO - calibrate
let EARTH_NON_TILTED_REL_EPOCH = 0; // default to unix epoch
let EARTH_NON_TILTED_REL_DAY_LENGTH = 86400.002; // probably accurate; TODO - calibrate
let EARTH_TILTED_REL_TILT_AMOUNT = 22.5 / 180 * Math.PI; // TODO - calibrate
let EARTH_TILTED_REL_TILT_PHASE = 0; // TODO - calibrate
let SUN_AROUND_EARTH_EPOCH = 0; // default to unix epoch
let SUN_AROUND_EARTH_INITIAL_ANGLE = 0; // TODO - calibrate
// https://en.wikipedia.org/wiki/Time_standard
let SUN_AROUND_EARTH_YEAR_LENGTH = 31_556_925.9747; // TODO - calibrate


// clones an array of arrays of arrays (however deeply nested) of primitives / non array objects
function recurseCloneNestedArrays(array) {
  return array.map(x => {
    if (Array.isArray(x)) {
      return recurseCloneNestedArrays(x);
    } else {
      return x;
    }
  });
}


// gets the dot product of 2 vectors
function dotProduct(vec1, vec2) {
  return vec1.reduce((a, c, i) => a + c * vec2[i], 0);
}

// gets the magnitude of a vector
function magVec(vec) {
  return Math.hypot(...vec);
}

// gets the angle between 2 vectors
function angleBetween(vec1, vec2) {
  // https://en.wikipedia.org/wiki/Dot_product
  // cos(angle we want) == dot(vec1, vec2) / (mag(vec1) * mag(vec2))
  // angle we want == acos(dot(vec1, vec2) / (mag(vec1) * mag(vec2)))
  return Math.acos(dotProduct(vec1, vec2) / (magVec(vec1) * magVec(vec2)));
}

// https://math.stackexchange.com/a/501961
function crossProduct(vec1, vec2) {
  return [
    vec1[1] * vec2[2] - vec2[1] * vec1[2],
    vec1[0] * vec2[2] - vec2[0] * vec1[2],
    vec1[0] * vec2[1] - vec2[0] * vec1[1],
  ];
}

function addVectors(vec1, vec2) {
  return vec1.map((x, i) => x + vec2[i]);
}

function negateVector(vec) {
  return vec.map(x => -x);
}

function subtractVectors(vec1, vec2) {
  return addVectors(vec1, negateVector(vec2));
}

// resizes a vector to length 1
function normalize(vec) {
  let scalingFactor = 1 / magVec(vec);
  
  return vec.map(x => x * scalingFactor);
}

function vectorToRowMatrix(vec) {
  return [vec];
}

function vectorToColMatrix(vec) {
  return vec.map(x => [x]);
}

function rowMatrixToVector(mat) {
  return mat.flat();
}

function colMatrixToVector(mat) {
  return mat.flat();
}

function rows(mat) {
  return mat.length;
}

function cols(mat) {
  return mat[0].length;
}

function multiplyMatrices(mat1, mat2) {
  let resultantRows = rows(mat1);
  let resultantCols = cols(mat2);
  let lengthOfDotProduct = cols(mat1);
  
  let resultMatrix = [];
  
  for (let row = 0; row < resultantRows; row++) {
    let resultRow = [];
    
    for (let col = 0; col < resultantCols; col++) {
      let dotSum = 0;
      
      for (let dotIndex = 0; dotIndex < lengthOfDotProduct; dotIndex++) {
        dotSum += mat1[row][dotIndex] * mat2[dotIndex][col];
      }
      
      resultRow.push(dotSum);
    }
    
    resultMatrix.push(resultRow);
  }
  
  return resultMatrix;
}

function transposeMatrix(mat) {
  let resultantRows = cols(mat);
  let resultantCols = rows(mat);
  
  let resultMatrix = [];
  
  for (let row = 0; row < resultantRows; row++) {
    let resultRow = [];
    
    for (let col = 0; col < resultantCols; col++) {
      resultRow.push(mat[col][row]);
    }
    
    resultMatrix.push(resultRow);
  }
  
  return resultMatrix;
}

// https://en.wikipedia.org/wiki/Determinant
function determinant(mat) {
  if (rows(mat) == 1 && cols(mat) == 1) {
    return mat[0][0];
  } else if (rows(mat) == 2 && cols(mat) == 2) {
    return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
  } else if (rows(mat) == 3 && cols(mat) == 3) {
    let a = mat[0][0], b = mat[0][1], c = mat[0][2],
        d = mat[1][0], e = mat[1][1], f = mat[1][2],
        g = mat[2][0], h = mat[2][1], i = mat[2][2];
    return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
  }
  throw new Error();
}

function scalarMul(mat, scalar) {
  return mat.map(x => x.map(y => y * scalar));
}

// https://www.cuemath.com/algebra/adjoint-of-a-matrix/ for all the 3x3 and beyond inverse stuff

// creates a new matrix chopping out the given row and column
function chopRowAndColFromMatrix(mat, row, col) {
  let choppedTotalRows = rows(mat) - 1;
  let choppedTotalCols = cols(mat) - 1;
  
  let choppedMatrix = [];
  
  for (let choppedRow = 0; choppedRow < choppedTotalRows; choppedRow++) {
    let choppedMatrixRow = [];
    
    for (let choppedCol = 0; choppedCol < choppedTotalCols; choppedCol++) {
      let trueRow = choppedRow < row ? choppedRow : choppedRow + 1;
      let trueCol = choppedCol < col ? choppedCol : choppedCol + 1;
      
      choppedMatrixRow.push(mat[trueRow][trueCol]);
    }
    
    choppedMatrix.push(choppedMatrixRow);
  }
  
  return choppedMatrix;
}

// returns the minor of the row and col of the matrix
function minorMatrixElem(mat, row, col) {
  // create new matrix from deleting row and col from given matrix
  let choppedMatrix = chopRowAndColFromMatrix(mat, row, col);
  
  // minor of element is determinant of this matrix
  return determinant(choppedMatrix);
}

function minorMatrix(mat) {
  let minor = [];
  
  for (let row = 0; row < rows(mat); row++) {
    let minorRow = [];
    
    for (let col = 0; col < cols(mat); col++) {
      minorRow.push(minorMatrixElem(mat, row, col));
    }
    
    minor.push(minorRow);
  }
  
  return minor;
}

function cofactorMatrix(mat) {
  let minor = minorMatrix(mat);
  
  return minor.map((rowArray, row) => rowArray.map((elem, col) => {
    return elem * (-1) ** (row + col);
  }));
}

function adjointMatrix(mat) {
  return transposeMatrix(cofactorMatrix(mat));
}

function inverseMatrix(mat) {
  return scalarMul(adjointMatrix(mat), 1 / determinant(mat));
}

function getTestMatrix(num) {
  switch (num) {
    case 0:
      return [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 10],
      ];
  }
}

function printMatrix(mat) {
  console.log(mat.map(x => x.join(', ')).join('\n'));
}


// converts a vector that is represented in basis form to "raw" xyz form
function getVectorFromBasis(vec, basisI, basisJ, basisK) {
  // operation is mat(basisI <col>, basisJ <col>, basisK <col>) * vec
  let matToMultiplyWith = transposeMatrix([basisI, basisJ, basisK]);
  
  return colMatrixToVector(multiplyMatrices(matToMultiplyWith, vectorToColMatrix(vec)));
}

// converts a vector that is represented in "raw" xyz form to basis form
function getVectorInBasis(vec, basisI, basisJ, basisK) {
  // operation is inverse(mat(basisI <col>, basisJ <col>, basisK <col>)) * vec
  let matToMultiplyWith = inverseMatrix(transposeMatrix([basisI, basisJ, basisK]));
  
  return colMatrixToVector(multiplyMatrices(matToMultiplyWith, vectorToColMatrix(vec)));
}

// rotates a 2d vector
function rotate2D(vec2d, angle) {
  return [
    vec2d[0] * Math.cos(angle) - vec2d[1] * Math.sin(angle),
    vec2d[1] * Math.cos(angle) + vec2d[0] * Math.sin(angle),
  ];
}

// rotates a given vector on the x y plane
function rotateXYPlane(vec, angle) {
  let rotatedCoords = rotate2D([vec[0], vec[1]], angle);
  
  return [
    rotatedCoords[0],
    rotatedCoords[1],
    vec[2],
  ];
}

// rotates a given vector on the y z plane
function rotateYZPlane(vec, angle) {
  let rotatedCoords = rotate2D([vec[1], vec[2]], angle);
  
  return [
    vec[0],
    rotatedCoords[0],
    rotatedCoords[1],
  ];
}

// rotates a given vector on the x z plane
function rotateXZPlane(vec, angle) {
  let rotatedCoords = rotate2D([vec[0], vec[2]], angle);
  
  return [
    rotatedCoords[0],
    vec[1],
    rotatedCoords[1],
  ];
}


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
  vec = rotateXYPlane(-EARTH_TILTED_REL_TILT_PHASE);
  
  vec = rotateXZPlane(EARTH_TILTED_REL_TILT_AMOUNT);
  
  vec = rotateXYPlane(EARTH_TILTED_REL_TILT_PHASE);
  
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
  return date.now() / 1000 - EARTH_NON_TILTED_REL_EPOCH;
}

function SunAroundEarth_DateObjectToEpoch(date) {
  return date.now() / 1000 - SUN_AROUND_EARTH_EPOCH;
}

function LatLon_DegreesToRadians(lat, lon) {
  return [
    lat / 180 * Math.PI,
    lon / 180 * Math.PI,
  ];
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
    ), // 0 is east, goes CCW
  };
}
