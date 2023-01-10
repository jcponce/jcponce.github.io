/*  

 Author: Juan Carlos Ponce Campuzano
 Website: https://jcponce.github.io/
 Date: 5-Feb-2019
 License: Creative Commons Attribution-NonCommercial 4.0 International License
 http://creativecommons.org/licenses/by-nc/4.0/

 Adapted From the Coding Challenge #130.3: 
 Drawing with Fourier Transform and Epicycles
 by Daniel Shiffman
 https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
 https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
 https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
 https://youtu.be/7_vKzcgpfvU

 Update 23-Jan-2020: 
 In this version I added the DFT for low frequencies.

*/

const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = -1;

let button;
let orbits; //slider
let starting = false;
let canDraw = true;
let size = 1;

let rate = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  //canvas.parent('sketch-holder');

  colorMode(HSB, 1, 1, 1, 1);

  if (state == FOURIER) {
    resetSize();
  }
 
}


function draw() {
  background(0, 0, 1);
  

  //Initial message
  if (starting == false) {
    fill(0);
    stroke(0);
    textAlign(CENTER);
    textSize(32);
    text("Draw Something!", width / 2, height / 2);
  }

  cursor(HAND);

  stroke(0, 0, 0.6);
  strokeWeight(1.2);
  noFill();
  strokeJoin(ROUND);
  beginShape();
  for (let v of drawing) {
    vertex(v.x + width / 2, v.y + height / 2);
  }
  endShape(CLOSE);

  if (state == FOURIER && !canDraw) {
    let v = epicycles(width / 2, height / 2, 0, fourierX, orbits.value());

    path.unshift(v);
    
    
    
    stroke(0, 1, 0);
    strokeWeight(4);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();
    
    
    /*
    //The approximation curve
    strokeWeight(4);
    stroke(0);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    for (let k = -180; k < 180; k++) {
      let vs = fourierSeries(fourierX, radians(k), orbits.value());
      vertex(vs.x + width / 2, vs.y + height / 2);
    }
    endShape(CLOSE);
    */
    if( fourierX.length < 1000){
      rate = 20; 
    } else if(2000 > fourierX.length || fourierX.length > 1000 ){
    	rate = 50;  
    } else if( fourierX.length > 2000){
    	rate = 60; 
    }
    
    frameRate(rate);

    const dt = TWO_PI / fourierX.length;
    time += dt;

    
    fill(0);
    stroke(0);
    strokeWeight(0.5);
    textAlign(CENTER);
    textSize(16);
    text( orbits.value() + ' epicycles', windowWidth/2, 30);

    if (time > TWO_PI) {
      time = 0;
      path = [];
    }
  }
  


  noFill();
  stroke(0);
  strokeWeight(1.2);
  rect(0, 0, width, height);

}

// Other functions

function mouseDragged() {
  if (canDraw) {
    if (
      mouseX < width - 5 &&
      mouseY < height - 5 &&
      mouseX > 5 &&
      mouseY > 5
    ) {
      let point = createVector(mouseX - width / 2, mouseY - height / 2);
      drawing.push(point);
    }
  }
}


function epicycles(x, y, rotation, fourier, size_f) {
  for (let i = 0; i < size_f; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(0.6, 1, 1, 0.7);
    strokeWeight(1);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    //stroke(0, 0, 0.6);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function mousePressed() {
  starting = true;
}

function resetSize() {
  orbits = createSlider(1, size, size, 1);
  orbits.position(windowWidth/2-150, windowHeight-50);
  orbits.style('width', '300px');
  orbits.changed(emptyFourier);
}

function emptyFourier() {
  path = [];
  time = 0;
}

function mouseReleased() {

  if (canDraw) {
    const skip = 1;
    for (let i = 0; i < drawing.length; i += skip) {
      x.push(new Complex(drawing[i].x, drawing[i].y));
    }
    
    if(drawing.length % 2 === 0) {
      fourierX = dftEven(x);
    } else {
      fourierX = dftOdd(x);
    }
    
    //fourierX = dft(x);

    fourierX.sort((a, b) => b.amp - a.amp);
    size = fourierX.length;
    resetSize();
  }
  if (
    mouseX < width - 10 &&
    mouseY < height - 10 &&
    mouseX > 10 &&
    mouseY > 10
  ) {
    canDraw = false;
    state = FOURIER;
  }

}

/*function remakeDrawing() {
  state = -1;
  drawing = [];
  x = [];
  time = 0;
  path = [];

  canDraw = true;
  size = 1;
  resetSize();
}*/