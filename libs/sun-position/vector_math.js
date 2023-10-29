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
