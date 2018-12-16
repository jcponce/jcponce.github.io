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
        this.m = 700
        this.position = createVector(random(-10, 10), random(-10, 10), random(-10, 10));
        this.velocity = p5.Vector.random3D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 5;
        this.sz = 10;
        //this.n = Math.round(random(3, 10));
        this.h = random(360);
    }
    
    edges() {
        if (this.position.x > this.m) {
            this.position.x = -this.m;
        } else if (this.position.x < -this.m) {
            this.position.x = this.m;
        }
        if (this.position.y > this.m) {
            this.position.y = -this.m;
        } else if (this.position.y < -this.m) {
            this.position.y = this.m;
        }
        if (this.position.z > this.m) {
            this.position.z = -this.m;
        } else if (this.position.z < -this.m) {
            this.position.z = this.m;
        }
    }
    
    align(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, this.position.z, other.position.x, other.position.y, other.position.z);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
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
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, this.position.z, other.position.x, other.position.y, other.position.z);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
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
        let perceptionRadius = 100;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, this.position.z, other.position.x, other.position.y, other.position.z);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
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
        //strokeWeight(6);
        //stroke(255);
        //point(this.position.x, this.position.y);
        //stroke(this.h, 98, 98);
        //strokeWeight(1);
        //fill(this.h, 98, 58);
        let theta = this.velocity.heading() + PI / 2;
        push();
        translate(this.position.x, this.position.y, this.position.z);
        rotate(theta);
        ambientMaterial(this.h, 98, 98);
        noStroke();
        //sphere(this.sz);
        torus(15, 6);
        pop();
    }
}
