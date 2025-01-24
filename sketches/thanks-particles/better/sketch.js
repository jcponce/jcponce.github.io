// Based upon 
// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: https://www.youtube.com/watch?v=4hA7G3gup-4

// This version by Juan Carlos Ponce Campuzano 26/Oct/2023

let font;
let vehicles = [];

function preload() {
  font = loadFont('../AvenirNextLTPro-Demi.otf');
}

let w, h, points;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  background(0);

  // Array of text lines
  let textLines = ['1K Subscribers', 'Thank You!'];

  // Font size based on width
  let s = w * 0.102;
  // Line spacing
  let lineSpacing = s * 1.5;

  points = [];

  // Generate points for each line
  for (let i = 0; i < textLines.length; i++) {
    let line = textLines[i];
    let yOffset = h / 2 - ((textLines.length - 1) / 2) * lineSpacing + i * lineSpacing;
    let linePoints = font.textToPoints(line, w / 2 - (line.length * s) / 4, yOffset, s, {
      sampleFactor: 0.1
    });
    points = points.concat(linePoints);
  }

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

  // Array of text lines
  let textLines = ['1K Subscribers', 'Thank You!'];

  // Font size and line spacing
  let s = w * 0.1;
  let lineSpacing = s * 1.5;

  // Clear the current points and vehicles
  points = [];
  vehicles = [];

  // Generate updated points for each line
  for (let i = 0; i < textLines.length; i++) {
    let line = textLines[i];
    let yOffset = h / 2 - ((textLines.length - 1) / 2) * lineSpacing + i * lineSpacing;
    let linePoints = font.textToPoints(line, w / 2 - (line.length * s) / 4, yOffset, s, {
      sampleFactor: 0.12
    });
    points = points.concat(linePoints);
  }

  // Reinitialize vehicles with updated points
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let vehicle = new Vehicle(pt.x, pt.y, i);
    vehicles.push(vehicle);
  }
}
