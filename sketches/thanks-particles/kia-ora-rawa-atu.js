// Based upon 
// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: https://www.youtube.com/watch?v=4hA7G3gup-4

// This version by Juan Carlos Ponce Campuzano 2/Feb/2026

let font;
let vehicles = [];

let w, h;
let points = [];

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf');
}

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  background(0);

  buildText();
}

function draw() {
  cursor(HAND);
  background(0);

  for (let v of vehicles) {
    v.behaviors();
    v.update();
    v.show();
  }
}

function buildText() {
  vehicles = [];
  points = [];

  const line1 = '∞Kia ora';
  const line2 = 'rawa atu';

  let s = w * 0.18;
  let lineHeight = s * 0.9;

  // total height of the block (2 lines)
  let totalHeight = lineHeight;
  let startY = h / 2 - totalHeight / 3;

  // --- First line (measure width first) ---
  let bounds1 = font.textBounds(line1, 0, 0, s);
  let x1 = w / 2 - bounds1.w / 2;

  let pts1 = font.textToPoints(
    line1,
    x1,
    startY,
    s,
    { sampleFactor: 0.12 }
  );

  // --- Second line ---
  let bounds2 = font.textBounds(line2, 0, 0, s);
  let x2 = w / 2 - bounds2.w / 2;

  let pts2 = font.textToPoints(
    line2,
    x2,
    startY + lineHeight,
    s,
    { sampleFactor: 0.12 }
  );

  points = pts1.concat(pts2);

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let col = map(i, 0, points.length, 0, 1);
    vehicles.push(new Vehicle(pt.x, pt.y, col));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = windowWidth;
  h = windowHeight;
  buildText();
}
