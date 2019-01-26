/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Dec-2018
 */

// Original code:
// Flocking by
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

class Boid {
    constructor() {
        this.position = createVector(random(2*width/5, 3*width/5), random(2*height/5, 3*height/5));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(1.2, 3.8));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 3.8;
        this.sz = 7;
        this.n = Math.round(random(3, 8));
        this.h = random(360);
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
        let perceptionRadius = 30;
        let perceptionCount = 5;
        let steering = createVector();
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
        let perceptionRadius = 30;
        let perceptionCount = 5;
        let steering = createVector();
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
        let perceptionRadius = 50;
        let perceptionCount = 5;
        let steering = createVector();
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
        stroke(this.h, 98, 98);
        strokeWeight(1);
        fill(this.h, 98, 58);
        push();
        translate(this.position.x, this.position.y)
        rotate(theta);
        beginShape();
        for (let i = 0; i <= 360; i++) {
            let nextx, nexty;
            nextx = this.sz * (sin(1.0 * 9 * radians(i)) + pow(sin(1.0 * 10 * radians(i)), 2)) * cos(radians(i));
            nexty = this.sz * (sin(1.0 * 9 * radians(i)) + pow(sin(1.0 * 10 * radians(i)), 2)) * sin(radians(i));
            vertex(nextx, nexty);
        }
        endShape(CLOSE);
        pop();
    }
}
