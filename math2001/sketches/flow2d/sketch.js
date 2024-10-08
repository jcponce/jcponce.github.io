/* 
 Flow around a circle simulation designed with p5.js (https://p5js.org/)
 Under Creative Commons License
 https://creativecommons.org/licenses/by-sa/4.0/
 
 Writen by Juan Carlos Ponce Campuzano, 12-Feb-2019
 Update: 24-Aug-2022
 https://jcponce.github.io
*/

let positions = new Array(1 * 2);
// 0,1,2,3,4,5
// 4,5,6,7,8,9
let bx;
let by;
let bs;
let bz = 30;
let bover = false;
let locked = false;
let bdifx = 0.0;
let bdify = 0.0;

let newx, newy;
let whichImage;

var Strength = 40;
var v = 40;
var a = 90;
let numMax = 500;
let t = 0;
let h = 0.001;
let particles = [];
let currentParticle = 0;

let trace = false;

let buttonTrace;

let sliderRadius;
let sliderSpeed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  //seting up particles
  for (let i = 0; i < numMax; i++) {
    let valX = random(-width / 2, width / 2);
    let valY = random(-height / 2, height / 2);
    particles[i] = new Particle(valX, valY, t, h);
  }

  // Setting up button and sliders
  buttonTrace = createButton("Trace");
  buttonTrace.position(45, 16);
  buttonTrace.mousePressed(traceShow);

  sliderRadius = createSlider(0.01, 200, 70, 0.01);
  sliderRadius.position(buttonTrace.x - 25, buttonTrace.y + 50);
  sliderRadius.style("width", "100px");

  sliderSpeed = createSlider(0.01, 100, 30, 0.01);
  sliderSpeed.position(buttonTrace.x - 25, buttonTrace.y + 100);
  sliderSpeed.style("width", "100px");

  bs = sliderRadius.value();

  imageMode(CENTER);

  bx = width / 2.0;
  by = height / 2.0;

  for (let j = 0; j < 1 * 2; j += 2) {
    positions[j] = random(0, 0);
    positions[j + 1] = random(0, 0);
  }

  //fill(153);
}

function draw() {
  cursor(HAND);

  translate(width / 2, height / 2);

  // For drawing streamlines
  if (trace == true) {
    fill(0, 6);
  } else fill(0, 100);
  stroke(0);
  strokeWeight(2);
  rect(-width / 2, -height / 2, width, height);

  t += h; // Update particles

  // Update all particles, remove and reset particles when needed
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    let p = particles[i];
    p.update();
    p.display();
    if (
      p.x > width / 2 ||
      p.y > height / 2 ||
      p.x < -width / 2 ||
      p.y < -height / 2 ||
      pow(p.x + positions[0], 2) + pow(p.y - positions[1], 2) <
        sliderRadius.value()
    ) {
      particles.splice(i, 1);
      currentParticle--;
      particles.push(
        new Particle(width / 2, random(-height / 2, height / 2), t, h)
      );
    }
  }

  // Dragging circle
  for (let j = 0; j < 1; j++) {
    if (bover && whichImage == j) {
      noStroke();
      fill(190); // white
    } else {
      noStroke();
      fill(80);
    }
    ellipse(
      positions[j * 2],
      positions[j * 2 + 1],
      sliderRadius.value() * 2,
      sliderRadius.value() * 2
    );
  }

  // Draw UI with button and sliders
  translate(-width / 2, -height / 2);
  fill(220);
  rect(3, 3, 135, 155, 10);
  fill(0);
  stroke(0);
  strokeWeight(0.3);
  textSize(16);
  text("Radius", buttonTrace.x, buttonTrace.y + 45);
  text("Speed", buttonTrace.x, buttonTrace.y + 95);
  //text("Drag circle!", buttonTrace.x, buttonTrace.y + 155);
}

let P = (t, x, y) =>
  -Strength *
  (sliderSpeed.value() -
    (sliderSpeed.value() *
      (sliderRadius.value() * sliderRadius.value()) *
      (pow(x + positions[0], 2) - pow(y - positions[1], 2))) /
      ((pow(x + positions[0], 2) + pow(y - positions[1], 2)) *
        (pow(x + positions[0], 2) + pow(y - positions[1], 2))));

let Q = (t, x, y) =>
  -Strength *
  ((-2 *
    sliderSpeed.value() *
    (sliderRadius.value() * sliderRadius.value()) *
    (x + positions[0]) *
    (y - positions[1])) /
    ((pow(x + positions[0], 2) + pow(y - positions[1], 2)) *
      (pow(x + positions[0], 2) + pow(y - positions[1], 2))));

//Define particles and how they are moved with Runge–Kutta method of 4th degree.
class Particle {
  constructor(_x, _y, _t, _h) {
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(3, 4);
    this.h = _h;
    this.op = random(199, 200);
    this.r = random(10);
    this.g = random(164, 255);
    this.b = random(255);
  }

  update() {
    this.k1 = P(this.time, this.x, this.y);
    this.j1 = Q(this.time, this.x, this.y);
    this.k2 = P(
      this.time + (1 / 2) * this.h,
      this.x + (1 / 2) * this.h * this.k1,
      this.y + (1 / 2) * this.h * this.j1
    );
    this.j2 = Q(
      this.time + (1 / 2) * this.h,
      this.x + (1 / 2) * this.h * this.k1,
      this.y + (1 / 2) * this.h * this.j1
    );
    this.k3 = P(
      this.time + (1 / 2) * this.h,
      this.x + (1 / 2) * this.h * this.k2,
      this.y + (1 / 2) * this.h * this.j2
    );
    this.j3 = Q(
      this.time + (1 / 2) * this.h,
      this.x + (1 / 2) * this.h * this.k2,
      this.y + (1 / 2) * this.h * this.j2
    );
    this.k4 = P(
      this.time + this.h,
      this.x + this.h * this.k3,
      this.y + this.h * this.j3
    );
    this.j4 = Q(
      this.time + this.h,
      this.x + this.h * this.k3,
      this.y + this.h * this.j3
    );
    this.x =
      this.x + (this.h / 6) * (this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
    this.y =
      this.y + (this.h / 6) * (this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
    this.time += this.h;
  }

  display() {
    fill(this.r, this.b, this.g, this.op);
    noStroke();
    //this.updatex = map(this.x, -7, 7, -width, width);
    //this.updatey = map(-this.y, -5, 5, -height, height);
    ellipse(-this.x, this.y, 2 * this.radius, 2 * this.radius);
  }
}

let traceShow = (_) => {
  if (trace == false) {
    trace = true;
  } else {
    trace = false;
  }
};

//function doubleClicked() {
//  if (a > 10) {
//    a = 0.02;
//  }
//}

function mousePressed() {
  checkOver();
  if (bover) {
    locked = true;
  } else {
    locked = false;
  }
}

function mouseReleased() {
  locked = false;
  bover = false;
}

function mouseDragged() {
  if (locked) {
    newx = mouseX - width / 2;
    newy = mouseY - height / 2;
  }

  positions[whichImage * 2] = newx;
  positions[whichImage * 2 + 1] = newy;
}
//
function checkOver() {
  for (let i = 0; i < 1; i++) {
    // Test if the cursor is over the box
    if (
      mouseX - width / 2 > positions[i * 2] - bs &&
      mouseX - width / 2 < positions[i * 2] + bs &&
      mouseY - height / 2 > positions[i * 2 + 1] - bs &&
      mouseY - height / 2 < positions[i * 2 + 1] + bs
    ) {
      //print("mouseover image: "+i);
      whichImage = i;
      bover = true;
      break; // leave here !!!!!!!!!!!!!!!!!
    } else {
      bover = false;
    }
  } // for
}
