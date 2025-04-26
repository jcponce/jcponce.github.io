class Particle {
  constructor() {
    this.position = p5.Vector.random2D().mult(random(R)).add(width / 2, height / 2);
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector();
    this.maxSpeed = 2;
    this.maxForce = 0.1;
  }

  edges() {
    let d = dist(this.position.x, this.position.y, width / 2, height / 2);
    if (d > R) {
      let dir = p5.Vector.sub(this.position, createVector(width / 2, height / 2)).normalize().mult(R - 1);
      this.position = createVector(width / 2, height / 2).add(dir);
    }
  }

  seek() {
    let dx = this.position.x - width / 2;
    let dy = this.position.y - height / 2;
    let r = sqrt(dx * dx + dy * dy);
    let theta = atan2(dy, dx);
    let val = besselChladni(r, theta);

    let target = this.position.copy();
    if (abs(val) > threshold) {
      target.x += random(-3, 3);
      target.y += random(-3, 3);
    }

    let desired = p5.Vector.sub(target, this.position).setMag(this.maxSpeed);
    let steering = p5.Vector.sub(desired, this.velocity).limit(this.maxForce);
    return steering;
  }

  update() {
    this.edges();
    this.acceleration.add(this.seek());
    this.velocity.add(this.acceleration).limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    stroke(255);
    circle(this.position.x, this.position.y, 2);
  }
}