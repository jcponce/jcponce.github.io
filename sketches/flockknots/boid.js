/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 30-Jul-2018
 *
 * Adapted from the original code:
 * Flocking by
 * Daniel Shiffman
 * https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
 * https://youtu.be/mhjuuHl6qHM
 *
 * The knot creatures are inspired by skizzm: https://www.openprocessing.org/user/105743
 * from this beautiful sketch: https://www.openprocessing.org/user/105743
 *
 */

class Boid {
    constructor() {
        this.position = createVector(random(2*width/5, 3*width/5), random(2*height/5, 3*height/5));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(1, 2.5));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 2;
        this.sz = random(8, 13);
        this.a = Math.round(random(3, 11));
        this.b = Math.round(random(3, 11));
        this.red = random(150, 255);
        this.green = random(150, 255);
        this.blue = random(100,255);
        this.alpha = random(200,255);
        this.ri = int(random(0, controls.numPoly));
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
        let perceptionRadius = 50;
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
        let perceptionRadius = 80;
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
        stroke(this.red, this.green, this.blue, this.alpha);
        noFill();
        push();
        translate(this.position.x, this.position.y)
        rotate(theta);
        strokeWeight(1.5);
        let size = width * 0.9 / 8 * 0.4 * 0.4;
        let a, x, y;
        
        let ts = 0.005;
        let cs = 0.001;
        
        let ns = map(simplex.noise2D(frameCount*ts,this.ri), -1,1,0.2,1);
        
        let verts = []
        
        for(let r = 0; r < 60; r++){
            a = r / 60 * TWO_PI;
            x = simplex.noise3D(cos(a) * ns, sin(a) * ns, this.ri + 10 + frameCount*ts) * size;
            y = simplex.noise3D(cos(a) * ns, sin(a) * ns, this.ri + 20 + frameCount*ts) * size;
            verts.push(createVector(x,y));
        }
        
        beginShape();
        for(let r = 0; r < verts.length; r++){
            vertex(verts[r].x,verts[r].y);
        }
        endShape(CLOSE);
        
        beginShape();
        for(let r = 0; r < verts.length; r++){
            vertex(-verts[r].x,verts[r].y);
        }
        endShape(CLOSE);
        
        pop();
    }
}
