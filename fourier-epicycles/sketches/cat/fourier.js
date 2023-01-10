
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

// new version

function cfft(amplitudes)
{
	var N = amplitudes.length;
	if( N <= 1 )
		return amplitudes;
 
	var hN = N / 2;
	var even = [];
	var odd = [];
	even.length = hN;
	odd.length = hN;
	for(var i = 0; i < hN; ++i)
	{
		even[i] = amplitudes[i*2];
		odd[i] = amplitudes[i*2+1];
	}
	even = cfft(even);
	odd = cfft(odd);
 
	var a = -2*Math.PI;
	for(var k = 0; k < hN; ++k)
	{
		if(!(even[k] instanceof Complex))
			even[k] = new Complex(even[k], 0);
		if(!(odd[k] instanceof Complex))
			odd[k] = new Complex(odd[k], 0);
		var p = k/N;
		var t = new Complex(0, a * p);
		t.cexp(t).mul(odd[k], t);
		amplitudes[k] = even[k].add(t, odd[k]);
		amplitudes[k + hN] = even[k].sub(t, even[k]);
	}

	return amplitudes;
}
 
//test code
//console.log( cfft([1,1,1,1,0,0,0,0]) );
//console.log( icfft(cfft([1,1,1,1,0,0,0,0])) );


/*
basic complex number arithmetic from 
http://rosettacode.org/wiki/Fast_Fourier_transform#Scala
*/
/*
function Complex(re, im) 
{
	this.re = re;
	this.im = im || 0.0;
}
Complex.prototype.add = function(other, dst)
{
	dst.re = this.re + other.re;
	dst.im = this.im + other.im;
	return dst;
}
Complex.prototype.sub = function(other, dst)
{
	dst.re = this.re - other.re;
	dst.im = this.im - other.im;
	return dst;
}
Complex.prototype.mul = function(other, dst)
{
	//cache re in case dst === this
	var r = this.re * other.re - this.im * other.im;
	dst.im = this.re * other.im + this.im * other.re;
	dst.re = r;
	return dst;
}
Complex.prototype.cexp = function(dst)
{
	var er = Math.exp(this.re);
	dst.re = er * Math.cos(this.im);
	dst.im = er * Math.sin(this.im);
	return dst;
}
Complex.prototype.log = function()
{*/

	/*
	although 'It's just a matter of separating out the real and imaginary parts of jw.' is not a helpful quote
	the actual formula I found here and the rest was just fiddling / testing and comparing with correct results.
	http://cboard.cprogramming.com/c-programming/89116-how-implement-complex-exponential-functions-c.html#post637921
	*/
  /*
	if( !this.re )
		console.log(this.im.toString()+'j');
	else if( this.im < 0 )
		console.log(this.re.toString()+this.im.toString()+'j');
	else
		console.log(this.re.toString()+'+'+this.im.toString()+'j');
}*/
