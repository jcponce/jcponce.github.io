/*

 Title: Simulation damped spring
 Author: Juan Carlos Ponce Campuzano
 Date: 18/Jul/2023
 Updated: 23/05/2025
 Instructions: Click on mass and drag to start animation
 
*/

// Spring drawing constants 
let springHeight = 32,
    left,
    right,
    maxHeight = 400,
    minHeight = 0,
    over = false,
    move = false,
    points = [],
    maxPoints = 100;
    diam = 60;

// Spring simulation constants
let M = 10.8,  // Mass
    K = 0.2,  // Spring constant
    D = 0.99, // Damping
    R = 200;  // Rest position

// Spring simulation constants
let ps = R,   // Position
    vs = 0.0, // Velocity
    as = 0,   // Acceleration
    f = 0;    // Force

function setup() {
  createCanvas(700, 400);
  rectMode(CORNERS);
  noStroke();
  left = width / 2 + 200;
  right = width / 2 - 100;
  
  for (let i=0; i<maxPoints; i++) {
    points[i] = ps; 
  }
  
}

function draw() {
  background(150);

  updateSpring();

  drawSpringCurve(ps - 45, 0, left);
  drawSpringMass();

  drawSpringMass();
  updateGraph();
  drawGraph();
}

/* Auxiliary functions */

function drawSpringCurve(y0, y1, A) {
  //2sin(10 * 2π (t - y_1) / (y_0 - y_1)) + x(A2)
  push();
  stroke(0);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let k = -y1; k < y0; k = k + 0.01) {
    let x = 20 * sin((10 * PI * (k - y1)) / (y0 - y1)) + A;
    let y = k;
    vertex(x, y);
  }
  endShape();
  line(left, ps - 45, left, ps - 20);
  pop();
}

function drawSpringMass() {
  // Set color and draw top bar
  if (over || move) {
    fill(204, 179, 255);
  } else {
    fill(112, 50, 126);
  }
  stroke(200);
  ellipse(left, ps, diam);
}

function updateSpring() {
  // Update the spring position
  if (!move) {
    f = -K * (ps - R); // f=-ky
    as = f / M; // Set the acceleration, f=ma == a=f/m
    vs = D * (vs + as); // Set the velocity
    ps = ps + vs; // Updated position
  }

  if (abs(vs) < 0.1) {
    vs = 0.0;
  }

  // Test if mouse if over the circle (mass)
  let d = dist(left, ps, mouseX, mouseY);
  if (d < diam / 2 && !move) {
    over = true;
    cursor("grab");
  } else if (d < diam / 2 && move) {
    over = true;
    cursor("grabbing");
  } else {
    over = false;
    cursor("default");
  }

  // Set and constrain the position of top bar
  if (move) {
    ps = mouseY - springHeight / 2;
    ps = constrain(ps, minHeight, maxHeight);
  }
}

function updateGraph() {
  points.shift();
  points.push(ps);
}

function drawGraph() {
  push();
  stroke(0, 0, 250);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < maxPoints; i++) {
    vertex(i * 5.25, points[i]);
  }
  endShape();
  pop();
}

function mousePressed() {
  if (over) {
    move = true;
  }
}

function mouseReleased() {
  //cursor('default');
  move = false;
}

