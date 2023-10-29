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

function identityMatrix(size) {
  let identity = [];
  
  for (let row = 0; row < size; row++) {
    let identityRow = [];
    
    for (let col = 0; col < size; col++) {
      identityRow.push(row == col ? 1 : 0);
    }
    
    identity.push(identityRow);
  }
  
  return identity;
}
