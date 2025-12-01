// ==========================================================

//  Two Particle Systems with Noise Motion and Edge Borders
//  System 1: 5-petal flower shapes (left region)
//  System 2: circles (right region)
//  Fullscreen canvas

// p5.js (https://p5js.org/)
// Under Creative Commons License
// https://creativecommons.org/licenses/by-sa/4.0/
// Written by Juan Carlos Ponce Campuzano, 25/Nov/2025

// ==========================================================

let system1 = [];
let system2 = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);

  // Number of particles per system
  const numStaff = 40;
  const numStudents = 350;

  // Left spawn region (30% width)
  for (let i = 0; i < numStaff; i++) {
    let x = random(0.05 * width, 0.35 * width);
    let y = random(0.1 * height, 0.9 * height);
    system1.push(new FlowerParticle(x, y));
  }

  // Right spawn region (30% width)
  for (let i = 0; i < numStudents; i++) {
    let x = random(0.65 * width, 0.95 * width);
    let y = random(0.1 * height, 0.9 * height);
    system2.push(new CircleParticle(x, y));
  }
}

function draw() {
  background(0, 0, 10);

  // Update and display system1 (flowers)
  for (let p of system1) {
    p.update();
    p.edges();
    p.show();
  }

  // Reset glow for all circles first
  for (let p of system2) {
    p.glow = 0;
  }

  // Check proximity and update glow
  for (let flower of system1) {
    for (let circle of system2) {
      let d = dist(flower.pos.x, flower.pos.y, circle.pos.x, circle.pos.y);
      let maxDistance = 70; // Maximum distance for glow effect

      if (d < maxDistance) {
        // Inverse relationship: closer = more glow
        let proximityGlow = map(d, 0, maxDistance, 1, 0);
        circle.glow = max(circle.glow, proximityGlow);
      }
    }
  }

  // Update and display system2 (circles)
  for (let p of system2) {
    p.update();
    p.edges();
    p.show();
  }
}

// ----------------------------------------------------------
//  Particle Base Class
// ----------------------------------------------------------

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(0.5);
    this.t = random(1000); // noise seed
    this.speed = 1.2;
    this.size = random(20, 30);
    this.hue = random(0, 360);
    this.drift = 0; // default, will override in subclasses
  }

  update() {
    // Smooth Perlin noise direction
    let angle = noise(this.t) * TWO_PI * 4;
    let dir = p5.Vector.fromAngle(angle);

    // Smoothly steer towards noise direction
    this.vel.lerp(dir, 0.05);

    // Add system-specific drift
    this.vel.x += this.drift;

    // Move without mutating velocity
    let stepMotion = this.vel.copy().mult(this.speed);
    this.pos.add(stepMotion);

    this.t += 0.01;
  }

  edges() {
    // Soft bounce off borders
    if (this.pos.x < this.size || this.pos.x > width - this.size)
      this.vel.x *= -1;
    if (this.pos.y < this.size || this.pos.y > height - this.size)
      this.vel.y *= -1;
  }
}

// ----------------------------------------------------------
//  System 1: Flower Particles (5-petal shape)
// ----------------------------------------------------------

class FlowerParticle extends Particle {
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.01);

    noStroke();
    fill(this.hue, 80, 100, 0.8);

    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = 0.8 * this.size * (1 + 0.3 * sin(5 * a)); // 5 petals
      let x = r * cos(a);
      let y = r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

// ----------------------------------------------------------
//  System 2: Circle Particles
// ----------------------------------------------------------

class CircleParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.glow = 0; // Glow intensity (0 to 1)
    this.baseSize = this.size; // Store original size
  }

  show() {
    push();

    // Calculate glow effects
    let glowSize = this.baseSize * (1 + this.glow * 0.5); // Size increases with glow
    let glowBrightness = 100; // Maximum brightness when glowing
    let glowAlpha = 0.9 + this.glow * 0.3; // Alpha increases with glow

    // Add a glow effect using multiple concentric circles
    if (this.glow > 0) {
      drawingContext.shadowBlur = 20 * this.glow;
      drawingContext.shadowColor = color(this.hue, 60, glowBrightness, 0.5).toString();

      // Outer glow circle
      noFill();
      stroke(this.hue, 60, glowBrightness, glowAlpha * 0.3);
      strokeWeight(4);
      ellipse(this.pos.x, this.pos.y, glowSize * 1.5, glowSize * 1.5);
    } else {
      drawingContext.shadowBlur = 0;
    }

    // Main circle
    noFill();
    stroke(this.hue, 60, 80 + this.glow * 20, glowAlpha);
    strokeWeight(2 + this.glow * 2);
    ellipse(this.pos.x, this.pos.y, glowSize, glowSize);

    // Inner bright circle when glowing strongly
    if (this.glow > 0.7) {
      fill(this.hue, 40, 100, this.glow * 0.5);
      noStroke();
      ellipse(this.pos.x, this.pos.y, glowSize * 0.5, glowSize * 0.5);
    }

    pop();
  }
}

// ----------------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}