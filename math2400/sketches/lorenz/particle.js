//Particle definition and motion
class Particle {

  constructor(_x, _y, _z, _t, _h) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.time = _t;
    this.h = _h;
    this.r = random(20, 255); // red color of the butterfly
    this.g = random(0, 70); // green color of the butterfly
    this.b = random(10, 255); // blue color of the butterfly

    this.rotX = random(0.008, 0.029);
    this.sc = random(0.018, 0.033);
  }

  update() {
    let tmp = rungeKutta(this.time, this.x, this.y, this.z, this.h); 
    
    this.x = tmp.u;
    this.y = tmp.v;
    this.z = tmp.w;
    
    this.time += this.h;
  }
  
  updateEuler(){
    
    this.x += this.h * componentFX(this.time, this.x, this.y, this.z);
    this.y += this.h * componentFY(this.time, this.x, this.y, this.z);
    this.z += this.h * componentFZ(this.time, this.x, this.y, this.z);
    this.time += this.h;
  }

  display() {
    noStroke();
    ambientMaterial(this.r, this.g, this.b);

    //normalMaterial();
    let fc = frameCount * 15;

    let o = createVector(this.x, this.y, this.z);
    let p = createVector(this.x - this.h, this.y - this.h, this.z - this.h);
    let v = p.sub(o);

    //Right wing
    push();

    translate(o.x, o.y, o.z);
    rotate(v.heading());
    scale(this.sc);
    rotateY(0.5);
    rotateX(PI / 2 * cos(fc * this.rotX));
    model(wr);
    pop();

    //Left wing
    push();
    translate(o.x, o.y, o.z);
    rotate(v.heading());
    scale(this.sc);
    rotateY(0.5);
    rotateX(-PI / 2 * cos(fc * this.rotX));
    model(wl);
    pop();
  }

}

const componentFX = (t, x, y, z) => parDef.Speed * (attractor.p * (-x + y)); //Change this function

const componentFY = (t, x, y, z) => parDef.Speed * (-x * z + attractor.r * x - y); //Change this function

const componentFZ = (t, x, y, z) => parDef.Speed * (x * y - attractor.b * z); //Change this function

// Runge-Kutta method

function rungeKutta(time, x, y, z, h) {
  let k1 = componentFX(time, x, y, z);
  let j1 = componentFY(time, x, y, z);
  let i1 = componentFZ(time, x, y, z);

  let k2 = componentFX(
    time + (1 / 2) * h,
    x + (1 / 2) * h * k1,
    y + (1 / 2) * h * j1,
    z + (1 / 2) * h * i1
  );
  let j2 = componentFY(
    time + (1 / 2) * h,
    x + (1 / 2) * h * k1,
    y + (1 / 2) * h * j1,
    z + (1 / 2) * h * i1
  );
  let i2 = componentFZ(
    time + (1 / 2) * h,
    x + (1 / 2) * h * k1,
    y + (1 / 2) * h * j1,
    z + (1 / 2) * h * i1
  );
  let k3 = componentFX(
    time + (1 / 2) * h,
    x + (1 / 2) * h * k2,
    y + (1 / 2) * h * j2,
    z + (1 / 2) * h * i2
  );
  let j3 = componentFY(
    time + (1 / 2) * h,
    x + (1 / 2) * h * k2,
    y + (1 / 2) * h * j2,
    z + (1 / 2) * h * i2
  );
  let i3 = componentFZ(
    time + (1 / 2) * h,
    x + (1 / 2) * h * k2,
    y + (1 / 2) * h * j2,
    z + (1 / 2) * h * i2
  );
  let k4 = componentFX(time + h, x + h * k3, y + h * j3, z + h * i3);
  let j4 = componentFY(time + h, x + h * k3, y + h * j3, z + h * i3);
  let i4 = componentFZ(time + h, x + h * k3, y + h * j3, z + h * i3);
  x = x + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  y = y + (h / 6) * (j1 + 2 * j2 + 2 * j3 + j4);
  z = z + (h / 6) * (i1 + 2 * i2 + 2 * i3 + i4);
  return {u: x, v: y, w: z};
}