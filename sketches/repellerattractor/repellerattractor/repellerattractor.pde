/*Original version: http://natureofcode.com/book/chapter-4-particle-systems/

by Daniel Shiffman http://shiffman.net/

I just added some colors and the attraction option by clicking.
*/

import java.util.*;

// One ParticleSystem
ParticleSystem ps;
// One repeller
Repeller repeller;



float strength = -500;

int r = 0;
int g = 255; 
int b = 255;
//77, 184, 255

void setup() {
  //size(screen.width, screen.height);
  size(window.innerWidth,window.innerHeight);
  //fullScreen();
  ps = new ParticleSystem(new PVector(random(width/3,2*width/3),random(4*height/20,6*height/20)));
  background(0);
}

void draw() {
  
  
  
 
  ps.addParticle();
  // We’re applying a universal gravity.
  PVector gravity = new PVector(0,0.1);
  ps.applyForce(gravity);
  
  fill(0,11);
  stroke(0)
  rect(0,0,width,height);
  // Applying the repeller
  repeller = new Repeller(mouseX,mouseY);
  
  ps.applyRepeller(repeller);
  
  
  ps.run();
  repeller.display();
}

void mousePressed() {
  if (strength == -500) {
    strength = 400;
  } else {
    strength = -500;
  }
  
  if (r == 0) {
    r = 214;
  } else {
    r = 0;
  }
  
  if (g == 255) {
    g = 153;
  } else {
    g = 255;
  }
  
  if (b == 255) {
    b = 255;
  } else {
    b = 255;
  }
}

//Particle class
class Particle {
  PVector location;
  PVector velocity;
  PVector acceleration;
  float lifespan;

  // We could vary mass for more interesting results.
  float mass = 2;

  Particle(PVector l) {
    // We now start with acceleration of 0.
    acceleration = new PVector(0,0);
    velocity = new PVector(random(-1,1),random(-2,0));
    location = new PVector(random(width/2,1*width/2),random(4*height/20,6*height/20));
    lifespan = 500.0;
  }

  void run() {
    update();
    display();
  }

  //[full] Newton’s second law & force accumulation
  void applyForce(PVector force) {
    PVector f = force.get();
    f.div(mass);
    acceleration.add(f);
  }
  //[end]

  //[full] Standard update
  void update() {
    velocity.add(acceleration);
    location.add(velocity);
    acceleration.mult(0);
    lifespan -= 0.5;
  }
  //[end]

  //[full] Our Particle is a circle.
  void display() {
    stroke(r-100, g-30, b-40,lifespan);
    fill(r, g, b,lifespan);
    ellipse(location.x,location.y,10,10);
  }
  //[end]

  //[full] Should the Particle be deleted?
  boolean isDead() {
    if (lifespan < 0.0 || location.x > width || location.x < 0 || location.y > height ) {
      return true;
    } else {
      return false;
    }
  }
  //[end]
}

// The ParticleSystem manages all the Particles.
class ParticleSystem {
  ArrayList<Particle> particles;
  PVector origin;

  ParticleSystem(PVector location) {
    origin = location.get();
    particles = new ArrayList<Particle>();
  }

  void addParticle() {
    particles.add(new Particle(origin));
  }

  // Applying a force as a PVector
  void applyForce(PVector f) {
    for (Particle p: particles) {
      p.applyForce(f);
    }
  }

  void applyRepeller(Repeller r) {
    //[full] Calculating a force for each Particle based on a Repeller
    for (Particle p: particles) {
      PVector force = r.repel(p);
      p.applyForce(force);
    }
    //[end]
  }

  void run() {
    Iterator<Particle> it = particles.iterator();
    while (it.hasNext()) {
      Particle p = (Particle) it.next();
      p.run();
      if (p.isDead()) {
        it.remove();
      }
    }
  }
}

class Repeller {

  // How strong is the repeller?
  
  PVector location;
  float r = 40;

  Repeller(float x, float y)  {
    location = new PVector(x,y);
  }

  void display() {
    stroke(254);
    fill(0);
    ellipse(location.x,location.y,r*2,r*2);
  }

  PVector repel(Particle p) {
    //[full] This is the same repel algorithm we used in Chapter 2: forces based on gravitational attraction.
    PVector dir = PVector.sub(location,p.location);
    float d = dir.mag();
    dir.normalize();
    d = constrain(d,5,100);
    float force = -1.5 * strength / (d * d);
    dir.mult(force);
    return dir;
    //[end]
  }
}
