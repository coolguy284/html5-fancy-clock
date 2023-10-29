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
