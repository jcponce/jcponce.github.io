/* 
 Title: Discrete Fourier Transform (Homer Simpson) with lower frequencies
 Author: Juan Carlos Ponce Campuzano
 Website: https://jcponce.github.io/
 Patreon: https://www.patreon.com/jcponce
 Date: 20-May-2020
 License: Creative Commons Attribution-NonCommercial 4.0 International License
 http://creativecommons.org/licenses/by-nc/4.0/
 
 Comments: Finally I was able to make a simplified 
 version of the Discrete Fourier Transform (DFT), 
 now with lower frequencies so you can get a 
 better approximation of the signal. It has 
 also the approximation curve.

 Warning: Your signal must have an odd
 number of terms.
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

  //Compute fourier coefficients with DFT
  const skip = 1;
  if(windowWidth < 1400){
    scl = 0.04 * width;
  } else {
    scl = 0.03 * width;
  }
  for (let i = 0; i < drawing.length; i += skip) {
    const c = new Complex(scl * drawing[i].x, -scl * (drawing[i].y-3));
    x.push(c);
  }
  fourierX = dft(x);
  fourierX.sort((a, b) => b.amp - a.amp);

  //Set initial potition
  time = 0;

  //UI
  sel = createSelect();
  sel.position(-100, -100);
  sel.option('Approx. Curve');
  sel.option('Epicycles');
  sel.style('font-size:16px');
  sel.changed(options);

  sliderTerms = createSlider(1, fourierX.length, 773, 1);
  sliderTerms.style('width', '400px');
  sliderTerms.position(windowWidth/2-200, windowHeight+70);
  sliderTerms.changed(clearPath);

  console.log(fourierX.length);
  //Maybe to change speed
  //frameRate(45);
}

function draw() {

  background(0);
  translate(width / 2, height / 2);

  if (show === true) {

    //The epicycles
    strokeJoin(ROUND);
    
    
    let v = epicycles(0, 0, 0, fourierX, sliderTerms.value(), easingFunction(time));
    
    
    //I want to draw it just once
    if (0 <= time && time <= TWO_PI + PI / 10) {
      path.unshift(v);
    }
    beginShape();
    noFill();
    stroke(1,0,1)
    strokeWeight(5);
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();

    //Message for epycicles
    translate(-width / 2, -height / 2);
    textAlign(CENTER);
    textSize(34);
    strokeWeight(1);
    stroke(0);
    fill(1);
    text('' + sliderTerms.value() + ' circles', windowWidth/2, 50);

  } else {

    console.log(round(easingFunction(time)))
    //The approximation curve
    strokeWeight(4);
    stroke(255);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    for (let k = -180; k < 180; k+=0.5) {
      let vs = fourierSeries(fourierX, radians(k), round(easingFunction(time)));
      vertex(vs.x, vs.y);
    }
    endShape(CLOSE);

    //Message for approx curve
    translate(-width / 2, -height / 2);
    textAlign(CENTER);
    textSize(32);
    strokeWeight(1);
    stroke(0);
    fill(1);
    text('Parametric curve with ' + round(easingFunction(time)) + ' terms', windowWidth/2, 60);

  }

  //Update time: two options
  const dt = 0.002;
  //const dt = TWO_PI / fourierX.length;

  if(time < TWO_PI){
    time += dt;
  } else time += 0;
  

}

function easingFunction(t) {
  return PI * sin(PI / 2 * cos(t / 2 + PI));
  //return 773 / 2 * (sin(PI / 2 * cos(t / 4 + PI)) + 1);
}

// Extra functions

function options() {
  var item = sel.value();
  if (item === 'Epicycles') {
    clearPath();
    time = -PI;
    show = true;
  } else {
    show = false;
  }
}

function clearPath() {
  path = [];
  time = -PI;
}

function epicycles(x, y, rotation, fourier, terms, t) {
  //I believe I don't need 'rotation' variable
  //I will check later
  for (let i = 0; i < terms; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    
    x += radius * cos(freq * t + phase + rotation);
    y += radius * sin(freq * t + phase + rotation);

    
    strokeWeight(1);
    stroke(0,0,0);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(0, 0, 0);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scl = 0.003 * width;
  sliderTerms.position(windowWidth/2-200, windowHeight-70);
}