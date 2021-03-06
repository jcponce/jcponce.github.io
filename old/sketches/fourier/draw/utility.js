/*---- Utility functions ----*/

var maxLogError = Number.NEGATIVE_INFINITY;

function log10RmsErr(xreal, ximag, yreal, yimag) {
  const n = xreal.length;
  if (n != ximag.length || n != yreal.length || n != yimag.length)
    throw "Mismatched lengths";

  let err = Math.pow(10, -99 * 2);
  for (let i = 0; i < n; i++)
    err += (xreal[i] - yreal[i]) * (xreal[i] - yreal[i]) + (ximag[i] - yimag[i]) * (ximag[i] - yimag[i]);
  err = Math.sqrt(err / Math.max(n, 1)); // Now this is a root mean square (RMS) error
  err = Math.log(err) / Math.log(10);
  maxLogError = Math.max(err, maxLogError);
  return err;
}


function randomReals(size) {
  let result = new Array(size);
  for (let i = 0; i < result.length; i++)
    result[i] = Math.random() * 2 - 1;
  return result;
}

function setValuesX(size) {
  let result = new Array(size);
  for (var i = 0; i < result.length; i++)
    result[i] = drawing[i].x;
  return result;
}

function setValuesY(size) {
  let result = new Array(size);
  for (var i = 0; i < result.length; i++)
    result[i] = drawing[i].y;
  return result;
}