class Particle {
  constructor() {
    this.position = createVector(random(w1, w2), random(h1, h2));
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector();
    
    this.maxSpeed = 2; 
    this.maxForce = 0.1;
  }
  
  edges() {
    if (this.position.x > w2) {
      this.position.x = w1;
    } else if (this.position.x < w1) {
      this.position.x = w2;
    }
    
    if (this.position.y > h2) {
      this.position.y = h1;
    } else if (this.position.y < h1) {
      this.position.y = h2;
    }
    
  }
  
  seek() {
    let x = map(this.position.x, w1, w2, -1, 1) * scl;
    let y = map(this.position.y, h1, h2, -1, 1) * scl;
    let val = chladni(x, y); 
    
    let target = this.position.copy();

    if (abs(val) > threshold) {
      target.x += random(-3, 3);
      target.y += random(-3, 3);
    } 
    
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed);
    let steering = p5.Vector.sub(desired, this.velocity);
    steering.limit(this.maxForce);
    
    return steering;
  }
  
  update() {
    this.edges();
    
    this.acceleration.add(this.seek());
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  
  display() {
    stroke(255);
    circle(this.position.x, this.position.y, 2);
  }
}