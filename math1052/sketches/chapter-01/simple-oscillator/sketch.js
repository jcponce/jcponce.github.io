/*

 Title: Simulation undamped spring
 Author: Juan Carlos Ponce Campuzano
 Date: 18/Jul/2023
 Instructions: Click on mass and grag to start animation. 
               Press 'R' to reset.

*/

let k = 10; // Spring constant
let m = 30; // mass
let x = 100,
  y; // initial position
let t = 0; // offset to animate

function setup() {
  createCanvas(750, 400);
}

function draw() {
  background(112, 50, 126);

  // set 'y' coordinate
  y = generalSolution(t) + height / 2;

  drawEqPos();
  drawSpringCurve(y - 40, 0, 100);
  updateSpringUser();
  drawMass();
  drawSolutionCurve();

  if (start) {
    t = t + 0.27;
  }
}

/* Auxiliar functions */

// General solution in the form A cos(omega t - phi)
let omega,
  phi,
  A = 0;
function generalSolution(t) {
  omega = k / m;
  phi = 0;
  return A * cos(omega * t + phi);
}

// Equilibrium position line
function drawEqPos() {
  push();
  stroke(190, 90);
  line(0, height / 2, width, height / 2);
  pop();
}

// Define spring curve
function drawSpringCurve(y0, y1, Ap) {
  //2sin(10 * 2π (t - y_1) / (y_0 - y_1)) + x(A2)
  push();
  stroke(0);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let k = -y1; k < y0; k = k + 0.01) {
    let x = 20 * sin((10 * PI * (k - y1)) / (y0 - y1)) + Ap;
    let y = k;
    vertex(x, y);
  }
  endShape();
  pop();
}

let diam = 64;
function drawMass() {
  push();
  stroke(0);
  strokeWeight(4);
  line(100, y - 40, 100, y - 32);
  pop();

  push();
  noStroke();
  if (rollover) {
    fill(200, 200, 220);
  } else {
    fill(45, 197, 244);
  }
  circle(x, y, diam);
  pop();
}

let wave = [];
function drawSolutionCurve() {
  wave.unshift(y);
  translate(100, 0);
  push();
  beginShape();
  noFill();
  stroke(255);
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();
  pop();

  if (wave.length > 1000) {
    wave.pop();
  }
}

let start = false;
let dragging = false; // Is the object being dragged?
let rollover = false; // Is the mouse over the ellipse?

function updateSpringUser() {
  // Test if mouse if over the circle (mass)
  let d = dist(x, y, mouseX, mouseY);
  if (d < diam / 2 && !dragging) {
    rollover = true;
    cursor("grab");
  } else if (d < diam / 2 && dragging) {
    rollover = true;
    cursor("grabbing");
  } else {
    rollover = false;
    cursor("default");
  }
  //console.log(rollover);

  // Adjust location if being dragged
  if (dragging) {
    A = mouseY - height / 2;
  }
}

function mousePressed() {
  if (rollover) {
    dragging = true;
    start = false;
    t = 0;
  }
  //console.log(dragging);
}

function mouseReleased() {
  dragging = false;
  start = true;
  
  //console.log(dragging);
}

function keyPressed() {
  if (keyCode == 82) {
    t = 0;
    start = false;
    A = 0;
  }
}

/*
function changeParameters() {
  if (keyIsDown(UP_ARROW)) {
    A += 2;
    if (A > 160) A = 160;
  }
  if (keyIsDown(DOWN_ARROW)) {
    A -= 2;
    if (A < 0) A = 10;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    k += 1;
    if (k > 20) k = 20;
  }
  if (keyIsDown(LEFT_ARROW)) {
    k -= 1;
    if (k < 0) k = 2;
  }
  
  //console.log(A );
}
*/
