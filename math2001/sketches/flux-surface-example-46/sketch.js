/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 06-Sep-2022
 */

// Updated -- 18/Oct-2022

let easycam; //3D view

let obj;

function preload() {
  obj = loadModel("solid.obj");
}

let particles = [];

let numMax = 1000; //num of particles
let t = 0;
let h = 0.01;
let currentParticle = 0;

// settings and presets
let parDef = {
  Speed: 1.0,
  Particles: true,
  Preset: function () {
    this.Speed = 1.0;
    this.Type = 0;
  },
};

function backAttractors() {
  window.location.href = "https://jcponce.github.io/strange-attractors/#aizawa";
}

function setup() {
  // create gui (dat.gui)
  let gui = new dat.GUI({ width: 240 });
  gui.add(parDef, "Speed", 0, 3, 0.01).listen();
  gui.add(parDef, "Particles");

  pixelDensity(2);

  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("antialias", true);

  //console.log(Dw.EasyCam.INFO);

  easycam = new Dw.EasyCam(this._renderer, { distance: 9 });

  // place initial samples
  initSketch();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]);
}

let attractor;

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

function draw() {
  // projection
  perspective((60 * PI) / 180, width / height, 1, 5000);

  // BG
  background(0);

  translate(0, 1, 0)
  rotateX(1.3);
  rotateY(0);
  rotateZ(2.3);

  if (parDef.Particles == true) {
    //updating and displaying the particles
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      let p = particles[i];
      p.update();
      p.display();
      const lim = 5;
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
            random(-4, 4),
            random(-4, 4),
            random(-4, 4),
            t,
            h
          )
        );
      }
    }
  }

 
    push();
    // Unit normal vectors
    strokeWeight(0.05);
    // red
    //stroke(255, 32, 0);
    stroke(102, 255, 255);
    let px = 2;
    let py = 1;
    line(-px, 0, 1, -py, 0, 1);
    line(px, 0, 1, py, 0, 1);
    line(1.77, 0.12, 1, 2, 0, 1);
    line(1.77, -0.12, 1, 2, 0, 1);
    line(-1.77, 0.12, 1, -2, 0, 1);
    line(-1.77, -0.12, 1, -2, 0, 1);

    // green
    //stroke(32, 255, 32);
    stroke(102, 255, 255);
    line(0, -px, 0.5, 0, -py, 0.5);
    line(0, px, 0.5, 0, py, 0.5);
    line(0.12, 1.77, 0.5, 0, 2, 0.5);
    line(-0.12, 1.77, 0.5, 0, 2, 0.5);
    line(0.12, -1.77, 0.5, 0, -2, 0.5);
    line(-0.12, -1.77, 0.5, 0, -2, 0.5);

    // blue
    //stroke(0, 32, 255);
    stroke(102, 255, 255);
    line(0, 0, 0, 0, 0, -1);
    line(0, 0, 2, 0, -0.7, 2.7);
    
    line(0, -0.7, 2.5, 0, -0.7, 2.7);
    line(0, -0.4, 2.6, 0, -0.7, 2.7);
    line(0, 0.12, -0.77, 0, 0, -1);
    line(0, -0.12, -0.77, 0, 0, -1);
    pop();

    // Cylinder
    push();
    strokeWeight(0);
    stroke(0);
    rotateZ(PI);
    ambientMaterial(20, 145, 232);
    scale(0.1);
    model(obj);
    pop();
    
    // Top ellipse
    push();
    strokeWeight(0.01);
    stroke(0);
    translate(0,0,2);
    rotateX(PI/4);
    ellipse(0, 0, 1.99, 2.89);
    pop();

    // Bottom circle
    push();
    strokeWeight(0.01);
    stroke(0);
    ellipse(0, 0, 2);
    pop();

    

    // Axes
    push();
    strokeWeight(0.02);

    // x-Axis
    stroke(255, 32, 0);
    line(0, 0, 0, 4, 0, 0);
    line(3.87, 0.12, 0, 4, 0, 0);
    line(3.87, -0.12, 0, 4, 0, 0);

    // y-Axis
    stroke(32, 255, 32);
    line(0, 0, 0, 0, -4, 0);
    line(0.12, -3.87,  0, 0, -4, 0);
    line(-0.12, -3.87, 0, 0, -4, 0);

    // z-Axis
    stroke(0, 32, 255);
    line(0, 0, 0, 0, 0, 4);
    line(0, 0.12, 3.87, 0, 0, 4);
    line(0, -0.12, 3.87, 0, 0, 4);
    pop();

    // xy-Plane
    push();
    noStroke();
    ambientMaterial(150, 150, 150, 80);
    translate(0,0,-0.01)
    plane(8, 8);
    pop();
  
}

// Equations for field motion
const componentFX = (t, x, y, z) => parDef.Speed * y * y; //Change this function

const componentFY = (t, x, y, z) => parDef.Speed * x; //Change this function

const componentFZ = (t, x, y, z) => parDef.Speed * z * z; //Change this function

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
  return {
    u: x,
    v: y,
    w: z,
  };
}

//Particle definition and motion
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
