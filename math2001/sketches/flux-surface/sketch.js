/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 06-Sep-2022
 */

// Updated -- 20/Oct/2022

let easycam; //3D view

let particles = []; // Array for particles
let numMax = 1100; //num of particles
let t = 0; // Initial time
let h = 0.01; // Delta h
let currentParticle = 0;

// settings and presets for UI controls
let parDef = {
  Field: "<-y, x+cos(z), 1>",
  Type: 0,
  Speed: 0.5,
  Particles: true,
  Vectors: true,
  Preset: function () {
    this.Speed = 0.6;
    this.Type = 0;
  },
};

// Setting things up
function setup() {
  // create gui (dat.gui)
  let gui = new dat.GUI({
    width: 330
  });
  gui.add(parDef, "Field");
  gui.add(parDef, "Type", {
      Sphere: 0,
      Torus: 1,
      Box: 2,
    })
    .name("Surface");
  gui.add(parDef, "Speed", 0, 2, 0.01).listen();
  gui.add(parDef, "Particles");
  gui.add(parDef, "Vectors").name("Norm. Vectors");
  gui.add(parDef, "Preset");
  gui.close();

  pixelDensity(2);

  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("antialias", true);

  easycam = new Dw.EasyCam(this._renderer, {
    distance: 9
  });

  // place initial samples
  initSketch();
}

// Plot everything
function draw() {
  // projection
  perspective((60 * PI) / 180, width / height, 1, 5000);

  // BG
  background(0);

  rotateX(0.9);
  rotateY(0);
  rotateZ(0.9);

  if (parDef.Particles == true) {
    //updating and displaying the particles
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      let p = particles[i];
      p.update();
      p.display();
      const lim = 4.5;
      if (
        p.x > lim ||
        p.y > lim ||
        p.z > lim ||
        p.x < -lim ||
        p.y < -lim ||
        p.z < -lim
      ) {
        particles.splice(i, 1);
        currentParticle--;
        particles.push(
          new Particle(
            random(-4.5, 4.5),
            random(-4.5, 4.5),
            random(-4.5, 4.5),
            t,
            h
          )
        );
      }
    }
  }

  // Sphere
  if (parDef.Type == 0) {
    push();

    if (parDef.Vectors) {
      // Normal vectors
      strokeWeight(0.05);
      stroke(102, 255, 255);
      let px = 3;
      let py = 2;
      line(-px, 0, 0, -py, 0, 0);
      line(px, 0, 0, py, 0, 0);
      line(2.77, 0.12, 0, 3, 0, 0);
      line(2.77, -0.12, 0, 3, 0, 0);
      line(-2.77, 0.12, 0, -3, 0, 0);
      line(-2.77, -0.12, 0, -3, 0, 0);

      //stroke(102, 255, 255);
      line(0, -px, 0, 0, -py, 0);
      line(0, px, 0, 0, py, 0);
      line(0.12, 2.77, 0, 0, 3, 0);
      line(-0.12, 2.77, 0, 0, 3, 0);
      line(0.12, -2.77, 0, 0, -3, 0);
      line(-0.12, -2.77, 0, 0, -3, 0);

      //stroke(102, 255, 255);
      line(0, 0, -px, 0, 0, -py);
      line(0, 0, px, 0, 0, py);
      line(0, 0.12, 2.77, 0, 0, 3);
      line(0, -0.12, 2.77, 0, 0, 3);
      line(0, 0.12, -2.77, 0, 0, -3);
      line(0, -0.12, -2.77, 0, 0, -3);
    }

    strokeWeight(0.01);
    stroke(0);
    ambientMaterial(20, 145, 232);
    rotateX(PI / 2);
    sphere(2, 24, 24);
    pop();
  }
  // Torus
  if (parDef.Type == 1) {
    push();

    if (parDef.Vectors) {
      // Normal vectors
      strokeWeight(0.05);
      stroke(102, 255, 255);
      let px = 3;
      let py = 2;
      line(1.75, 0, 0.43, 2.25, 0, 1.3);
      line(2, 0, 1.1, 2.25, 0, 1.3);
      line(2.2, 0, 1, 2.25, 0, 1.3);

      line(-1.75, 0, -0.43, -2.25, 0, -1.3);
      line(-2, 0, -1.1, -2.25, 0, -1.3);
      line(-2.2, 0, -1, -2.25, 0, -1.3);

      stroke(102, 255, 255);
      line(0, px, 0, 0, py, 0);
      line(0, -px, 0, 0, -py, 0);
      line(0.12, 2.77, 0, 0, 3, 0);
      line(-0.12, 2.77, 0, 0, 3, 0);
      line(0.12, -2.77, 0, 0, -3, 0);
      line(-0.12, -2.77, 0, 0, -3, 0);
    }

    strokeWeight(0.01);
    stroke(0);
    ambientMaterial(163, 26, 255);
    torus(1.4, 0.6);
    pop();
  }
  // Box
  if (parDef.Type == 2) {
    push();
    if (parDef.Vectors) {
      // Normal vectors
      strokeWeight(0.05);
      stroke(102, 255, 255);
      let px = 3;
      let py = 2;
      line(-px, 0, 0, -py, 0, 0);
      line(px, 0, 0, py, 0, 0);
      line(2.77, 0.12, 0, 3, 0, 0);
      line(2.77, -0.12, 0, 3, 0, 0);
      line(-2.77, 0.12, 0, -3, 0, 0);
      line(-2.77, -0.12, 0, -3, 0, 0);

      stroke(102, 255, 255);
      line(0, -px, 0, 0, -py, 0);
      line(0, px, 0, 0, py, 0);
      line(0.12, 2.77, 0, 0, 3, 0);
      line(-0.12, 2.77, 0, 0, 3, 0);
      line(0.12, -2.77, 0, 0, -3, 0);
      line(-0.12, -2.77, 0, 0, -3, 0);

      stroke(102, 255, 255);
      line(0, 0, -px, 0, 0, -py);
      line(0, 0, px, 0, 0, py);
      line(0, 0.12, 2.77, 0, 0, 3);
      line(0, -0.12, 2.77, 0, 0, 3);
      line(0, 0.12, -2.77, 0, 0, -3);
      line(0, -0.12, -2.77, 0, 0, -3);
    }

    strokeWeight(0.03);
    stroke(0);
    ambientMaterial(153, 51, 102);
    box(4);
    pop();
  }

}

// Equations for vector field motion
const componentFX = (t, x, y, z) =>
  parDef.Speed * (-y);

const componentFY = (t, x, y, z) =>
  parDef.Speed * (x + cos(z));

const componentFZ = (t, x, y, z) =>
  parDef.Speed * (1);

//Particle definition and motion using Runge-Kutta method
class Particle {
  constructor(_x, _y, _z, _t, _h) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.time = _t;
    this.radius = random(0.025, 0.025);
    this.h = _h;
    this.op = random(200, 200);
    this.r = random(0);
    this.g = random(164, 255);
    this.b = random(255);
  }

  update() {
    let tmp = rungeKutta(this.time, this.x, this.y, this.z, this.h);

    this.x = tmp.u;
    this.y = tmp.v;
    this.z = tmp.w;

    this.time += this.h;
  }

  display() {
    push();
    translate(this.x, -this.y, this.z);
    ambientMaterial(this.r, this.b, this.g);
    noStroke();
    sphere(this.radius, 8, 8);
    pop();
  }
}

// Runge-Kutta method 
// https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
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
  return {
    u: x,
    v: y,
    w: z,
  };
}

// Auxiliary functions
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]);
}

function initSketch() {
  let m = 4;
  for (var i = 0; i < numMax; i++) {
    particles[i] = new Particle(
      random(-m, m),
      random(-m, m),
      random(-m, m),
      t,
      h
    );
  }
}