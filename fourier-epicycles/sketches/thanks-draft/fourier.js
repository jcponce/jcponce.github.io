class Complex {

  constructor(a, b) {
    this.re = a;
    this.im = b;
  }

  add(c) {
    this.re += c.re;
    this.im += c.im;
  }

  mult(c) {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complex(re, im);
  }
}

//Lower frequencies DFT 
function dft(x) {

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

//Fourier series representation using the fourier coefficients
function fourierSeries(fourier, t, terms) {
  let c = fourier;
  let sumX = 0;
  let sumY = 0;
  let k = 0;
  while (k < terms) {
    let f = c[k].freq;
    let r = c[k].re;
    let i = c[k].im;
    sumX += cos(f * t) * r - sin(f * t) * i;
    sumY += cos(f * t) * i + sin(f * t) * r;
    k++
  }
  return createVector(sumX, sumY);
}