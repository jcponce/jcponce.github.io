// Pendulum
// Daniel Shiffman <http://www.shiffman.net>

// This p5.js version
// Juan Carlos Ponce Campuzano

// A simple pendulum simulation
// Given a pendulum with an angle theta (0 being the pendulum at rest) and a radius r
// we can use sine to calculate the angular component of the gravitational force.

// Gravity Force = Mass * Gravitational Constant;
// Pendulum Force = Gravity Force * sine(theta)
// Angular Acceleration = Pendulum Force / Mass = gravitational acceleration * sine(theta);

// Note this is an ideal world scenario with no tension in the 
// pendulum arm, a more realistic formula might be:
// Angular Acceleration = (g / R) * sine(theta)

// For a more substantial explanation, visit:
// http://www.myphysicslab.com/pendulum1.html 

let p;

function setup() {
  createCanvas(500,400);
  smooth();
 
  // Make a new Pendulum with an origin location and armlength
  p = new Pendulum(new p5.Vector(width/2,0),200);

}

function draw() {

  background(255);
  p.go();
}

function mousePressed() {
  p.clicked(mouseX,mouseY);
}

function mouseReleased() {
  p.stopDragging();
}
