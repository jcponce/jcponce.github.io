class Blackhole {

  constructor(x, y, z, m) {

    this.pos = new createVector(x, y, z);
    this.mass = m;
    this.rs = (2 * controls.G * this.mass) / (controls.c * controls.c);
      
  }

  show() {
    translate(this.pos.x, this.pos.y, this.pos.z);
    
    //Black hole itself (colored red)
    fill(0, 0, 0);
    noStroke();
    sphere(this.rs);
    
    //Photon Sphere (radius at which light orbits)
    fill(0, 0, 255, 10);
    sphere(this.rs*1.5);

    //Scharzschild Radius
    fill(250, 10);
    sphere(this.rs*3);

    translate(-this.pos.x, -this.pos.y, -this.pos.z);
  }

  pull(p) {
    const force = createVector(this.pos.x - p.pos.x, this.pos.y - p.pos.y, this.pos.z - p.pos.z);
    const r = force.mag();
    const fg = controls.G * this.mass / (r * r);
    //force.setMag(fg);
      //p.vel.add(force);
      //p.vel.setMag(c);

    force.setMag(c).mult(fg * (dt / c)).mult(1/abs(1.0 - 2.0 * controls.G * this.mass / (r * controls.c * controls.c)));

    p.vel.add(force).setMag(controls.c);

    if (r <= this.rs+ 0.5) {
      p.stopped = true;
    }
  }
}
