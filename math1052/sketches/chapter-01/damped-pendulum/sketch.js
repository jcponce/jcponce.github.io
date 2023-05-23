// Pendulum
// Daniel Shiffman <http://www.shiffman.net>

// This p5.js version by
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
  fill(0);
  stroke(200);
  strokeWeight(1);
  textSize(10);
  text("By Carlos Ponce Campuzano/@jcponcemath", 5, 15);
  p.go();
}

function mousePressed() {
  p.clicked(mouseX,mouseY);
}

function mouseReleased() {
  p.stopDragging();
}

// Pendulum Class
// Daniel Shiffman <http://www.shiffman.net>

// A Simple Pendulum Class
// Includes functionality for user can click and drag the pendulum

// This p5.js version  by
// Juan Carlos Ponce Campuzano


class Pendulum  {
  //Many, many variables to keep track of the Pendulum’s various properties
    constructor(origin, r){
      this.r = r; // Length of arm
      this.origin = origin.copy(); // Location of arm origin
      this.location = new p5.Vector(); // Location of pendulum ball
  
      this.angle = PI/4; // Pendulum arm angle
   
      this.aVelocity = 0.0; // Angle velocity
      this.aAcceleration = 0.0; // Angle acceleration
  //An arbitrary damping so that the Pendulum slows over time
      this.damping = 0.995; // Arbitary damping amount
      this.ballr = 48.0; // Ball radius
      
      this.dragging = false;
    }
    
  
  
    go() {
      this.update();
      this.drag();  //for user interaction
      this.display();
    }
   
    update() {
      if(!this.dragging){
       
        let gravity = 0.4;
        this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle);  // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
        this.aVelocity += this.aAcceleration;                 // Increment velocity
        this.aVelocity *= this.damping;                       // Arbitrary damping
        this.angle += this.aVelocity;                         // Increment angle
      }
      
    }
   
    display() {
  //Where is the bob relative to the origin? Polar to Cartesian coordinates will tell us!
      this.location.set(this.r*sin(this.angle),this.r*cos(this.angle),0);
      this.location.add(this.origin);
      
      let d = dist(mouseX, mouseY, this.location.x, this.location.y);
      if (d < this.ballr) {
        cursor("grab");
      } else cursor("default");
   
      stroke(90);
      strokeWeight(4);
      // Draw the arm
      line(this.origin.x, this.origin.y, this.location.x, this.location.y);
      ellipseMode(CENTER);
      fill(51, 0, 102);
      
      if (this.dragging) {
        fill(153, 51, 255);
        cursor("grabbing");
      }
      
      // Draw the ball
      ellipse(this.location.x, this.location.y, this.ballr, this.ballr);
    }
    
    // The methods below are for mouse interaction
  
    // This checks to see if we clicked on the pendulum ball
    clicked(mx, my) {
      let d = dist(mx, my, this.location.x, this.location.y);
      if (d < this.ballr) {
        this.dragging = true;
      }
    }
  
    // This tells us we are not longer clicking on the ball
    stopDragging() {
      this.aVelocity = 0; // No velocity once you let go
      this.dragging = false;
    }
  
    drag() {
      // If we are draging the ball, we calculate the angle between the 
      // pendulum origin and mouse location
      // we assign that angle to the pendulum
      if (this.dragging) {
        let diff = p5.Vector.sub(this.origin, new p5.Vector(mouseX, mouseY));      // Difference between 2 points
        this.angle = atan2(-1*diff.y, diff.x) - radians(90);                      // Angle relative to vertical axis
      }
    }
  }
  
