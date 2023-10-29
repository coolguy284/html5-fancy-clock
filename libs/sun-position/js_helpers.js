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
