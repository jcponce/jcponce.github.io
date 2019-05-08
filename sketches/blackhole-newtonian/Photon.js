class Photon {

  constructor(_pos) {
    this.pos = _pos.copy();
    this.vel = createVector(-c, 0, 0);
   // this.col = color(255, 255, 255);
    this.stopped = false;
    
  }

  show() {
		push();
		noStroke();
		ambientMaterial(this.col);
		translate(this.pos.x, this.pos.y, this.pos.z);
		sphere(1.5);
		pop();
  }

  update() {
    if (!this.stopped) {
      //Move forward dt (delta time-step)
      const deltaV = this.vel.copy();
      deltaV.mult(dt);
      this.pos.add(deltaV);
      //Set Color of Particle
      deltaV.normalize().setMag(255);
      this.col = color( round(255 - deltaV.x), round(255 - deltaV.y),  round(255 - deltaV.z));
    }
  }
}
