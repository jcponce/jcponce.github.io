function dft(x) {
  const X = [];
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let sum = new Complex(0, 0);
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;
      const c = new Complex(cos(phi), -sin(phi));
      sum.add(x[n].mult(c));
    }
    sum.re = sum.re / N;
    sum.im = sum.im / N;

    let freq = k;
    let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    let phase = atan2(sum.im, sum.re);
    X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
  }
  return X;
}

//Low frequencies DFT Odd
function dftOdd(x) {

  const X = [];
  const N = x.length;

  for (let k = -(N - 1) / 2; k <= (N - 1) / 2; k++) {
    let sum = new Complex(0, 0);
    for (let l = 0; l < N; l++) {
      const phi = k * 2 * PI * l / N;
      const c = new Complex(cos(phi), -sin(phi));
      sum.add(x[l].mult(c));
    }
    //Average
    sum.re = sum.re / N;
    sum.im = sum.im / N;

    let freq = k;
    let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    let phase = atan2(sum.im, sum.re);
    X[k + (N - 1) / 2] = {
      re: sum.re,
      im: sum.im,
      freq,
      amp,
      phase
    };
  }
  return X;
}

//Low frequencies DFT Even
function dftEven(x) {

  const X = [];
  const N = x.length;

  for (let k = -N / 2; k <= (N - 1) / 2; k++) {
    let sum = new Complex(0, 0);
    for (let l = 0; l < N; l++) {
      const phi = k * 2 * PI * l / N;
      const c = new Complex(cos(phi), -sin(phi));
      sum.add(x[l].mult(c));
    }
    //Average
    sum.re = sum.re / N;
    sum.im = sum.im / N;

    let freq = k;
    let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    let phase = atan2(sum.im, sum.re);
    X[k + N / 2] = {
      re: sum.re,
      im: sum.im,
      freq,
      amp,
      phase
    };
  }
  return X;
}

function testFft(size) {
  let X = [];
  let N = size;
  var inputreal = setValuesX(size);
  var inputimag = setValuesY(size);

  var expectreal = new Array(size);
  var expectimag = new Array(size);
  //naiveDft(inputreal, inputimag, expectreal, expectimag, false);

  var actualreal = inputreal.slice();
  var actualimag = inputimag.slice();
  transform(actualreal, actualimag);
  
  //expectreal.map(x => x * 1/sizeDrawing);
  //expectimag.map(x => x * 1/sizeDrawing);
  //console.log(expectreal);
  //console.log(expectimag);
  
  let avx = actualreal.map(x => x * 1/size);
  let avy = actualimag.map(x => x * 1/size);
  
  //console.log(avx);
  //console.log(avy);

  for (let k = 0; k < N; k++) {

    let freq = k;
    let amp = sqrt(avx[k] * avx[k] + avy[k] * avy[k]);
    let phase = atan2(avy[k], avx[k]);
    X[k] = {
      re: avx[k],
      im: avy[k],
      freq,
      amp,
      phase
    };
  }
  //console.log(X);
  return X;
  
  //I just need to fix frequency and values.
  //At the moment this corresponds with the high frequency DFT
  //https://editor.p5js.org/jcponce/sketches/6TX_8Omm8
}
