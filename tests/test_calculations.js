let NUMBER_EQUALITY_EPSILON = 1e-15;

// designed for nested arrays of primitives
function somewhatDeepEqual(obj1, obj2) {
  if (Array.isArray(obj1)) {
    if (Array.isArray(obj2)) {
      if (obj1.length == obj2.length) {
        for (let i = 0; i < obj1.length; i++) {
          if (!somewhatDeepEqual(obj1[i], obj2[i])) {
            return false;
          }
        }
        
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    if (typeof obj1 == 'number' && typeof obj2 == 'number') {
      return Math.abs(obj1 - obj2) < NUMBER_EQUALITY_EPSILON;
    } else {
      return Object.is(obj1, obj2);
    }
  }
}

function assertEqual(obj1, obj2) {
  if (!somewhatDeepEqual(obj1, obj2)) {
    console.log('unequal', obj1, obj2);
    throw new Error();
  }
}

function assertNotEqual(obj1, obj2) {
  if (somewhatDeepEqual(obj1, obj2)) {
    console.log('equal', obj1, obj2);
    throw new Error();
  }
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


function test_inverse_matrix() {
  let matrix = getTestMatrix(0);
  let inverse = inverseMatrix(matrix);
  let identity = identityMatrix(rows(matrix));
  
  let multiplied1 = multiplyMatrices(matrix, inverse);
  let multiplied2 = multiplyMatrices(inverse, matrix);
  
  assertEqual(multiplied1, identity);
  assertEqual(multiplied2, identity);
  
  console.log('inverse matrix test passed');
}

function test_vector_componentization() {
  let inputVector = [1, 2, 3];
  let basisI = [0, 1, 0], basisJ = [1, 10, 0], basisK = [100, 1000, 10000];
  let rawVector = getVectorFromBasis(inputVector, basisI, basisJ, basisK);
  assertNotEqual(inputVector, rawVector);
  let newVector = getVectorInBasis(rawVector, basisI, basisJ, basisK);
  assertEqual(inputVector, newVector);
  
  console.log('vector componentization test passed');
}

function test_all() {
  test_inverse_matrix();
  test_vector_componentization();
}
