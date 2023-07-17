/*
@name Spring
@frame 710, 400
@description Click, drag, and release the horizontal bar to start the spring.
*/
// Spring drawing constants for top bar
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

// Spring simulation letiables
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
  push();
  translate(0,0)
  springCurve(ps-50, 0, left);
  line(left, ps-50, left, ps-32);
  pop();
  //cursor('default');
  updateSpring();
  drawSpring();
  updateGraph();
  drawGraph();
  
}

function drawSpring() {
  // Draw base
  //fill(0.2);
  //let baseWidth = 0.5 * ps + -8;
  //ellipse(width / 2 - baseWidth, ps + springHeight, 20);
  //rect(width / 2 - baseWidth, ps + springHeight, width / 2 + baseWidth, height);

  // Set color and draw top bar
  if (over || move) {
    fill(204, 179, 255);
  } else {
    fill(112, 50, 126);
  }

  stroke(200);
  ellipse(left, ps, diam);
  //rect(left, ps, right, ps + springHeight);
}

function updateSpring() {
  // Update the spring position
  if ( !move ) {
    f = -K * ( ps - R ); // f=-ky
    as = f / M;          // Set the acceleration, f=ma == a=f/m
    vs = D * (vs + as);  // Set the velocity
    ps = ps + vs;        // Updated position
  }

  if (abs(vs) < 0.1) {
    vs = 0.0;
  }

  // Test if mouse if over the top bar
  let d = dist(left, ps, mouseX, mouseY);
  if (d < diam/2) {
    over = true;
    cursor('grab');
  } else {
    over = false;
    cursor('default');
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
  stroke(0,0,250);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i=0; i<maxPoints; i++) {
    vertex(i*5.2, points[i]);
  }
  endShape();
  pop();
}

function springCurve(y0, y1, A){
  //2sin(10 * 2π (t - y_1) / (y_0 - y_1)) + x(A2)
  stroke(0);
  strokeWeight(4);
  noFill();
  beginShape();
  for(let k = -y1; k<y0; k=k+0.01){
    let x = (20* sin( 10*PI*(k - y1) / (y0 - y1)) + A);
    let y = k;
    vertex(x, y);
    
  }
  endShape();
  
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
