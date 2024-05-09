/* 
 Title: Discrete Fourier Transform (MAA logo) with lower frequencies
 Author: Juan Carlos Ponce Campuzano
 Website: https://jcponce.github.io/
 Date: 29-Nov-2020
 License: Creative Commons Attribution-NonCommercial 4.0 International License
 http://creativecommons.org/licenses/by-nc/4.0/
 
 Comments: Finally I was able to make a simplified 
 version of the Discrete Fourier Transform (DFT), 
 now with lower frequencies so you can get a 
 better approximation of the signal. It has 
 also the approximation curve.

*/

let x = [];
let fourierX;
let time;
let path = [];

let sliderTerms;
let sel;
let show = true;
let scl;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1, 1, 1);

  // Compute fourier coefficients with DFT
  const skip = 1;
  const size = 1;
  if (windowWidth < 1400) {
    scl = 0.05 * width;
  } else {
    scl = 0.04 * width;
  }
  for (let i = 0; i < drawing.length; i += skip) {
    const c = new Complex(scl * (drawing[i].x * size), -scl * (drawing[i].y * size));
    x.push(c);
  }

  if (drawing.length % 2 === 0) {
    fourierX = dftEven(x); //DFT low frequencies even
  } else {
    fourierX = dftOdd(x); //DFT low frequencies odd
  }

  fourierX.sort((a, b) => b.amp - a.amp);

  // Set initial potition
  time = 0;

  //UI
  sel = createSelect();
  sel.position(10, 10);
  sel.option('Epicycles');
  sel.option('Approx. Curve');
  sel.style('font-size:16px');
  sel.changed(options);

  sliderTerms = createSlider(1, fourierX.length, 1000, 1);
  sliderTerms.style('width', '400px');
  sliderTerms.position(windowWidth / 2 - 200, windowHeight - 70);
  sliderTerms.changed(clearPath);

  console.log(fourierX.length);
  // Maybe to change speed
  frameRate(47);
}

function draw() {

  background(1);
  translate(width / 2 - 70, height / 2);

  if (show === true) {

    // The epicycles
    strokeJoin(ROUND);

    let v = epicycles(0, 0, 0, fourierX, sliderTerms.value(), time);
    //I want to draw it just once
    if (0 <= time && time <= TWO_PI + PI / 10) {
      path.unshift(v);
    }
    beginShape();
    noFill();
    strokeWeight(4);
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();

    // Message for epycicles
    translate(-width / 2, -height / 2);
    textAlign(CENTER);
    textSize(17);
    strokeWeight(1);
    stroke(0);
    fill(0);
    text('' + sliderTerms.value() + ' epicycles', windowWidth / 2, 30);

  } else {

    // The approximation curve
    strokeWeight(4);
    stroke(0);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    for (let k = 0; k < 360; k+=0.5) {
      let vs = fourierSeries(fourierX, radians(k), sliderTerms.value());
      vertex(vs.x, vs.y);
    }
    endShape(CLOSE);

    // Message for approx curve
    translate(-width / 2, -height / 2);
    textAlign(CENTER);
    textSize(17);
    strokeWeight(1);
    stroke(0);
    fill(0);
    text('Parametric curve with n=' + sliderTerms.value() + ' terms', windowWidth / 2, 30);

  }

  // Update time: two options
  const dt = 0.005;
  //const dt = TWO_PI / fourierX.length;
  time += dt;

}

// Extra functions

function options() {
  var item = sel.value();
  if (item === 'Epicycles') {
    clearPath();
    time = 0;
    show = true;
  } else {
    show = false;
  }
}

function clearPath() {
  path = [];
  time = 0;
}

function epicycles(x, y, rotation, fourier, terms, t) {
  // I believe I don't need 'rotation' variable
  // I will check later :)
  for (let i = 0; i < terms; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    x += radius * cos(freq * t + phase + rotation);
    y += radius * sin(freq * t + phase + rotation);


    strokeWeight(1.2);
    stroke(0.7, 1, 1);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(1, 1, 0);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scl = 0.003 * width;
  sliderTerms.position(windowWidth / 2 - 200, windowHeight - 70);
}