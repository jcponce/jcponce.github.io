/*

Chladni patterns in a Circular plate

Author: Juan Carlos Ponce Campuzano
Date: 20/Apr/2025
https://www.patreon.com/c/jcponce

For a circular plate with radius R the solution is given in terms of polar coordinates (r,theta) by

J_n(K * r) (C_1 * cos(n * theta) + C_2 * sin(n * theta))

Where J_n is the n'th order Bessel function. 
If the plate is fixed around the rim (eg: a
drum) then K = Z_{nm} / R, Z_{nm} is the 
m'th zero of the n'th order Bessel function. 
The term "Z_{nm} r / R" means the Bessel
function term goes to zero at the rim as
required by the constraint of the rim 
being fixed.

This simulation was made possible also 
thanks to Patt Vira's tutorial:
https://youtu.be/J-siGcsK2k8

And to Paul Bourke's article:
https://paulbourke.net/geometry/chladni/

Interaction: 
Press mouse to generate a new pattern

*/

let particles = [];
let num = 4000;
let n = 2; // angular mode
let m = 1; // radial mode
let R = 200; // radius of the circular plate
let threshold = 0.05;
let changePattern = false;
let firstRun = true;

let besselZeros = {
  0: [2.4048, 5.5201, 8.6537],
  1: [3.8317, 7.0156, 10.1735],
  2: [5.1356, 8.4172, 11.6198],
  3: [6.3802, 9.7610, 13.0152],
  4: [7.5883, 11.0647, 14.3725],
  5: [8.7715, 12.3386, 15.7002],
  6: [9.9361, 13.5893, 17.0038],
  7: [11.0864, 14.8213, 18.2883],
  8: [12.2251, 16.0378, 19.5576]
};

function setup() {
  createCanvas(450, 450);
  for (let i = 0; i < num; i++) {
    particles.push(new Particle());
  }
  
  cursor('pointer');
  //noCursor();
  
}

function draw() {
  background(0);

  if (changePattern && !firstRun) {
    randomPatterns();
    changePattern = false;
  }
  
  firstRun = false;

  for (let p of particles) {
    p.update();
    p.display();
  }
}

function mousePressed() {
  changePattern = true;
}

function randomPatterns() {
  let nOptions = Object.keys(besselZeros).map(k => int(k));
  n = random(nOptions);
  let mMax = besselZeros[n].length;
  m = floor(random(1, mMax + 1)); // 1-based

  changePattern = false;

  for (let p of particles) {
    p.velocity = p5.Vector.random2D().mult(random(2, 5));
  }
}

function besselJ(n, x) {
  let sum = 0;
  let kMax = 20;
  for (let k = 0; k < kMax; k++) {
    let num = Math.pow(-1, k) * Math.pow(x / 2, 2 * k + n);
    let denom = factorial(k) * factorial(k + n);
    sum += num / denom;
  }
  return sum;
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function besselChladni(r, theta) {
  if (!besselZeros[n] || !besselZeros[n][m - 1]) return 0;

  let Znm = besselZeros[n][m - 1];
  let Kr = Znm * r / R;

  let radial = besselJ(n, Kr);
  let angular = cos(n * theta) + sin(n * theta); // choose any C1 and C2
  return radial * angular;
}


