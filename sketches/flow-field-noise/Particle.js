class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random()*2-1, random()*2-1);
    this.acc = new Vector(0, 0);
    this.size = 8;
  }
  
  move(acc) {
    if(acc) {
      this.acc.addTo(acc);
    }
    this.vel.addTo(this.acc);
    this.pos.addTo(this.vel);
    if(this.vel.getLength() > 1) {
      this.vel.setLength(1);
    }
    this.acc.setLength(0);
  }
  
  show() {
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
  
  wrap() {
    if(this.pos.x > width) {
      this.pos.x = 0;
    } else if(this.pos.x < -this.size) {
      this.pos.x = width - 1;
    }
    if(this.pos.y > height) {
      this.pos.y = 0;
    } else if(this.pos.y < -this.size) {
      this.pos.y = height - 1;
    }
  }
}
