/*Original version: http://natureofcode.com/book/chapter-4-particle-systems/
 by Daniel Shiffman http://shiffman.net/
 I just wrote the P5 version and added some colors and the attraction option by clicking.
 */

let system;

let repeller;

let strength = -500;

let r = 0;
let g = 255;
let b = 255;

function setup() {
    createCanvas(windowWidth, windowHeight);
    system = new ParticleSystem(createVector(random(width/2,1*width/2),random(7*height/20,10*height/20)));
    background(0);
}

function draw() {
    cursor(HAND);
    system.addParticle();
    
    // We're applying a universal gravity.
    let gravity = createVector(0, 0.1);
    system.applyForce(gravity);
    
    fill(0,11);
    noStroke();
    rect(0, 0, width, height);
    // Applying the repeller
    repeller = new Repeller(mouseX, mouseY);
    
    system.applyRepeller(repeller);
    
    system.run();
    repeller.display();
}

//Change the colors
function mousePressed() {
    if (strength == -500) {
        strength = 400;
    } else {
        strength = -500;
    }
    
    if (r == 0) {
        r = 230;
    } else {
        r = 0;
    }
    
    if (g == 255) {
        g = 0;
    } else {
        g = 255;
    }
    
    if (b == 255) {
        b = 230;
    } else {
        b = 255;
    }
}

class Particle {
    constructor(position){
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(random(-1,1),random(-2,0));
        this.position = position.copy();
        this.lifespan = 500.0;
        this.radius = 5;
        this.mass = 2;
    }
    
    run(){
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
    update(){
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.lifespan -= 2;
        this.radius -= 0.01;
    }
    
    // Method to display
    display() {
        stroke(r-100, g-30, b-40,this.lifespan);
        strokeWeight(0.7);
        fill(r, g, b, this.lifespan);
        ellipse(this.position.x, this.position.y, 2* this.radius, 2* this.radius);
    }
    
    // Is the particle still useful?
    isDead(){
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
        for (var i = this.particles.length-1; i >= 0; i--) {
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
        ellipse(this.position.x, this.position.y,this.r*2,this.r*2);
    }

    repel(p) {
    //[full] This is the same repel algorithm used in Chapter 2: forces based on gravitational attraction: https://natureofcode.com/book/chapter-2-forces/
        this.dir = new p5.Vector.sub(this.position, p.position);
        this.d = this.dir.mag();
        this.dir.normalize();
        this.d = constrain(this.d, 5, 100);
        this.force = -1.5 * strength / (this.d * this.d);
        this.dir.mult(this.force);
        return this.dir;
    //[end]
    }
    
}
