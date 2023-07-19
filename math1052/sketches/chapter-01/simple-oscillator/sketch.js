let k = 10;
let m = 30;
let omega;
let phi;
let A = 0;
let x = 100;
let y;
let diam = 64;

let t = 0;

let wave = [];
let start = false; // Start animation

let dragging = false; // Is the object being dragged?
let rollover = false; // Is the mouse over the ellipse?

function setup() {
  createCanvas(750, 400);
}

function draw() {
  background(112, 50, 126);

  y = generalSolution(t) + height / 2;

  if (start) {
    t = t + 0.27;
  }

  push();
  stroke(190, 90);
  line(0, height / 2, width, height / 2);
  pop();

  // Draw spring curve
  push();
  translate(0, 0);
  springCurve(y - 40, 0, 100);
  pop();

  push();
  stroke(0);
  strokeWeight(4);
  line(100, y - 40, 100, y - 32);
  pop();

  // Test if mouse if over the circle (mass)
  let d = dist(x, y, mouseX, mouseY);
  if (d < diam / 2) {
    //over = true;
    rollover = true;
    cursor("grab");
  } else {
    //over = false;
    rollover = false;
    cursor("default");
  }
  //console.log(rollover);

  // Set and constrain the position of top bar
  // Adjust location if being dragged
  if (dragging) {
    A = mouseY - height / 2;
  }

  push();
  noStroke();
  if (rollover) {
    fill(200, 200, 220);
  } else {
    fill(45, 197, 244);
  }
  circle(x, y, diam);
  pop();

  //if (start) {

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
  //}

  changeParameters();

  //console.log(y )
}

function generalSolution(t) {
  omega = k / m;
  phi = 0;
  return A * cos(omega * t + phi);
}

function changeParameters() {
  if (keyIsDown(UP_ARROW)) {
    A += 2;
    if (A > 160) A = 160;
  }
  if (keyIsDown(DOWN_ARROW)) {
    A -= 2;
    if (A < 0) A = 10;
  }
  /*
  if (keyIsDown(RIGHT_ARROW)) {
    k += 1;
    if (k > 20) k = 20;
  }
  if (keyIsDown(LEFT_ARROW)) {
    k -= 1;
    if (k < 0) k = 2;
  }
  */
  //console.log(A );
}

// Define spring curve
function springCurve(y0, y1, Ap) {
  //2sin(10 * 2π (t - y_1) / (y_0 - y_1)) + x(A2)
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
  //cursor('default');
  dragging = false;
  start = true;
  //console.log(dragging);
}

function keyPressed() {
  //https://www.toptal.com/developers/keycode
  if (keyCode == 82) {
    t = 0;
    start = false;
    A = 0;
  }
}