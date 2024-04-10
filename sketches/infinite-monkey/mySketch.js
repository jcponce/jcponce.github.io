/*
 A fun experiment! 
 
 Monkey typewritting animation
 
 The infinite monkey theorem states that if you let 
 a monkey hit the keys of a typewriter at random an 
 infinite amount of times, eventually the monkey will 
 type out the entire works of Shakespeare. 
 
 Author: Juan Carlos Ponce Campuzano
 https://dynamicmath.xyz
 26/March/2024
 
 I still need to improve it! I will be back to that soon :)
 
*/

let system; // For storing the particles

let repeller;
let strength = -300;

let img1, img2;
let currentImage;

function preload() {
	// Monkey images made with GeoGebra
	// https://www.geogebra.org/m/ke9sdhex
  img1 = loadImage('monkey-curves-left.png');
  img2 = loadImage('monkey-curves-right.png');
}

let letters = "abcdefghijklmnopqrstuvwxyz"; // Array of characters

let initialPositionX, initialPositionY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  currentImage = img1; // Start with img1 displayed
  
  initialValues();
  
  system = new ParticleSystem(
    createVector(initialPositionX, initialPositionY)
  );
	
	// Add a general description of the canvas.
  describe('The infinite monkey theorem states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will almost surely type any given text, including the complete works of William Shakespeare. ∞ 🤯 ');
}

function draw() {
  background(0);
  cursor(HAND);
	
	/* Add monkey animation */
	
	// Calculate the scale factor based on the canvas size
  let scaleFactor = min(width / img1.width, height / img1.height) * 0.5;
  
  // Calculate the scaled image size
  let scaledWidth = img1.width * scaleFactor;
  let scaledHeight = img1.height * scaleFactor;
  
  // Calculate the position for the scaled image
  let posX = width * 8 / 10 - scaledWidth / 2;
  let posY = height * 8 / 10 - scaledHeight / 2;
  
  // Display the current image at the specified position with scaled size
  image(currentImage, posX, posY, scaledWidth, scaledHeight);
  
  // Alternate between img1 and img2 every second
  if (frameCount % 15 == 0) { // 60 frames per second
    if (currentImage === img1) {
      currentImage = img2;
    } else {
      currentImage = img1;
    }
  }
	
	/* Add particles */
	
  system.addParticle();

  // We're applying a universal gravity.
  let gravity = createVector(0, 0.1);
  system.applyForce(gravity);

  
  // Applying the repeller
  repeller = new Repeller(0, 0);

  system.applyRepeller(repeller);

  system.run();
  //repeller1.display();
  
}

function initialValues() {
  initialPositionX = width - (width * 3.5) / 12;
  initialPositionY = height - (height * 1.9) / 10;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initialValues();
	system = new ParticleSystem(
    createVector(initialPositionX, initialPositionY)
  );
}

class Particle {
  constructor(position) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 600;
    this.mass = 2;
    this.letter = letters.charAt(floor(random(letters.length))); // Choose a random letter from the array
  }

  run() {
    this.update();
    this.display();
  }

  applyForce(force) {
    this.force = force.copy();
    force.div(this.mass);
    this.acceleration.add(force);
    this.display();
  }

  // Method to update position
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 2;
    this.radius -= 0.01;
  }

  // Method to display
  display() {
    push();
    fill(255, this.lifespan);
    stroke(0, this.lifespan);
    strokeWeight(1.7);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(this.letter, this.position.x, this.position.y);
    pop();
  }

  // Is the particle still useful?
  isDead() {
    return this.lifespan < 0;
  }
}

class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }

  addParticle() {
    this.particles.push(new Particle(this.origin));
  }

  applyForce(force) {
    for (let p of this.particles) {
      p.applyForce(force);
    }
  }

  applyRepeller(r) {
    for (let p of this.particles) {
      this.force = r.repel(p);
      p.applyForce(this.force);
    }
  }

  run() {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}

// Repeller class
class Repeller {
  constructor(x, y) {
    this.position = new p5.Vector(x, y);
    this.r = 35;
  }

  display() {
    stroke(140);
    fill(0);
    ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
  }

  repel(p) {
    // [full] This is the same repel algorithm used in Chapter 2:
    // forces based on gravitational attraction:
		// https://natureofcode.com/forces/
    this.dir = new p5.Vector.sub(this.position, p.position);
    this.d = this.dir.mag();
    this.dir.normalize();
    this.d = constrain(this.d, 5, 100);
    this.force = (-1.5 * strength) / (this.d * this.d);
    this.dir.mult(this.force);
    return this.dir;
    //[end]
  }
}