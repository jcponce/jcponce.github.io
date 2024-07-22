// Based upon 
// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: https://www.youtube.com/watch?v=4hA7G3gup-4

// This version by Juan Carlos Ponce Campuzano 26/Oct/2023

let font;
let vehicles = [];

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf');
}

let w, h, points;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  background(0);

  s = w * 0.165
  points = font.textToPoints('∞¡Gracias!', w/2-2.5*s, h/2+s/3, s, {
    sampleFactor: 0.12
    //simplifyThreshold : 0.1
  });

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y,i);
    vehicles.push(vehicle);
  }
}

function draw() {
  cursor(HAND);
  background(0);
  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = windowWidth;
  h = windowHeight;
  s = w * 0.5;
  points = font.textToPoints('∞Thanks!', w/2-2*s, h/2, s, {
    sampleFactor: 0.12
    //simplifyThreshold : 0.1
  });
  redraw();
}
