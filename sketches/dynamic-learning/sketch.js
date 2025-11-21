/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 08-Feb-2020
 * https://jcponce.github.io/
 */

const flock = [];

let Controls = function() {
  this.align = 1;
  this.cohesion = 1;
  this.separation = 1.5;
  this.numPoly = 80;
  this.n = 4;
};

let controls = new Controls();

let quadTree;

function setup() {
  createCanvas(windowWidth, windowHeight);

  quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));

  for (let i = 0; i < controls.numPoly; i++) {
    pushRandomBoid(); //flock.push(new Boid());
  }

}

function draw() {

  background(0);

  quadTree.clear();
  for (const boid of flock) {
    quadTree.addItem(boid.position.x, boid.position.y, boid);
  }

  quadTree.debugRender();


  noFill();
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  // Adjust the amount of boids on screen according to the slider value
  let maxBoids = controls.numPoly;
  let difference = flock.length - maxBoids;
  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      pushRandomBoid(); // Add boids if there are less boids than the slider value
    }
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      flock.pop(); // Remove boids if there are more boids than the slider value
    }
  }
}

// Make a new boid
function pushRandomBoid() {
  let boid = new Boid(); // Create a new boid
  flock.push(boid); // Add the new boid to the flock
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Boid {
    constructor() {
        this.position = createVector(random(2*width/5, 3*width/5), random(2*height/5, 3*height/5));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(1, 2.5));
        this.acceleration = createVector(0,0);
        this.maxForce = 0.2;
        this.maxSpeed = 2;
        this.sz = random(7, 10);
        this.a = 3
        this.b = 3
        this.red = random(150, 255)
        this.green = random(80, 255);
        this.blue = random(290,255);
        this.alpha = random(240,255);
        this.n = (random()< 0.3) ? 4 : -4;
    }
    
    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }
    
    align(boids) {
        let perceptionRadius = 50;
        let perceptionCount = 5;
        let steering = createVector(0,0);
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            steering.add(other.velocity);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    
    separation(boids) {
        let perceptionRadius = 50;
        let perceptionCount = 5;
        let steering = createVector(0,0);
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            const diff = p5.Vector.sub(this.position, other.position);
            const d = diff.mag();
            if (d === 0) continue;
            diff.div(d * d);
            steering.add(diff);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    
    cohesion(boids) {
        let perceptionRadius = 80;
        let perceptionCount = 5;
        let steering = createVector(0,0);
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            steering.add(other.position);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    
    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        
        alignment.mult(controls.align);
        cohesion.mult(controls.cohesion);
        separation.mult(controls.separation);
        
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }
    
    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }
    
    show() {
        let theta = this.velocity.heading() + PI / 2;
        let size =  width * 0.2 / 10 * 0.2 * 0.2;
        stroke(this.red, this.green , 166, 255);
        strokeWeight(1.5);
        noFill();
        push();
        translate(this.position.x, this.position.y)
        rotate(theta);
        beginShape();
        for (let i = 0; i <= 360; i=i+1.5) {
            let nextx, nexty;
            let t = map(i, 0, 360, 0, TWO_PI);
            nextx = this.sz * size * ( sin(this.a*t) + sin( Math.sign(this.a-this.b)*this.b*t ) + sin(this.n * t));
            nexty = this.sz * size *( cos(this.a*t) + cos( Math.sign(this.a-this.b)*this.b*t  ) + cos(this.n *t ));
            vertex(nextx, nexty);
        }
        endShape();
        pop();
    }
}

class Rect {
    
    // By default, positioned at [0, 0] with a width and height of 1
    constructor(x = 0, y = 0, width = 1, height = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    /*
     * Return a new rectangle instance with the same values
     */
    copy() {
        return new Rect(this.x, this.y, this.width, this.height);
    }
    
}
