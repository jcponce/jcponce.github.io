// Source: Real-Time Fluid Dynamics for Games by Jos Stam - http://www.intpowertechcorp.com/GDC03.pdf

/*
  Fast Stable Fluid with Vorticity Confinement
  ---------------------------------------------

  p5.js 2.x

  Performance improvements:
  - Float32Array for simulation fields
  - No per-frame array allocations
  - Simulation rendered at N x N resolution
  - One pixel pass for density + vorticity
  - Small image scaled to canvas
  - Direct array indexing in inner loops
  - Correct vorticity normalization
  - Responsive canvas using windowWidth/windowHeight

  Author: Juan Carlos Ponce Campuzano
*/

const N = 128;
const STRIDE = N + 2;
const SIZE = STRIDE * STRIDE;

// --------------------------------------------------
// Simulation parameters
// --------------------------------------------------

const source = 10;
const diff = 0.0;
const visc = 0.0;

const dt = 0.01;
const dx = 1.0;

const vc = 5.0;

// Try 50 or 30 for more speed.
const PRESSURE_ITERATIONS = 200;


// --------------------------------------------------
// Simulation arrays
// --------------------------------------------------

let u;
let v;

let u_prev;
let v_prev;

let dens;
let dens_prev;

let om;


// --------------------------------------------------
// Rendering
// --------------------------------------------------

let fluidImage;


// --------------------------------------------------
// Setup
// --------------------------------------------------

function setup() {

  createCanvas(windowWidth, windowHeight);

  pixelDensity(1);

  fluidImage = createImage(N, N);

  drawingContext.imageSmoothingEnabled = true;

  initSim();

  background(0);
}


// --------------------------------------------------
// Initialize simulation
// --------------------------------------------------

function initSim() {

  u = new Float32Array(SIZE);
  v = new Float32Array(SIZE);

  u_prev = new Float32Array(SIZE);
  v_prev = new Float32Array(SIZE);

  dens = new Float32Array(SIZE);
  dens_prev = new Float32Array(SIZE);

  om = new Float32Array(SIZE);
}


// --------------------------------------------------
// Index
// --------------------------------------------------

function IX(i, j) {
  return i + STRIDE * j;
}


// ==================================================
// MAIN LOOP
// ==================================================

function draw() {

  background(0);

  // Copy fields without allocating new arrays.
  dens_prev.set(dens);
  u_prev.set(u);
  v_prev.set(v);

  add_density();
  add_velocity();

  vel_step();
  dens_step();

  vort_step();

  drawFluid();

  /*
  // Uncomment for FPS display.

  fill(255);
  noStroke();
  textSize(14);
  text(
    frameRate().toFixed(1) + " FPS",
    10,
    20
  );
  */
}


// ==================================================
// SOURCES
// ==================================================

function add_density() {

  if (mouseIsPressed) {

    // Keep mouse inside simulation domain.
    const x = constrain(
      floor((N / width) * mouseX),
      1,
      N
    );

    const y = constrain(
      floor((N / height) * mouseY),
      1,
      N
    );

    const i = IX(x, y);

    dens[i] += source;

    dens[IX(x - 1, y)] += source * 0.5;
    dens[IX(x + 1, y)] += source * 0.5;

    dens[IX(x, y - 1)] += source * 0.5;
    dens[IX(x, y + 1)] += source * 0.5;
  }

  // Constant source at bottom.
  dens[IX(N >> 1, N - 3)] += source * 0.25;
}


// --------------------------------------------------
// Velocity
// --------------------------------------------------

function add_velocity() {

  if (mouseIsPressed) {

    const x = constrain(
      floor((N / width) * mouseX),
      1,
      N
    );

    const y = constrain(
      floor((N / height) * mouseY),
      1,
      N
    );

    const i = IX(x, y);

    const xv =
      (N / width) *
      (mouseX - pmouseX);

    const yv =
      (N / height) *
      (mouseY - pmouseY);

    u[i] +=
      xv *
      (2 / (abs(xv) + 1)) *
      15;

    v[i] +=
      yv *
      (2 / (abs(yv) + 1)) *
      15;
  }

  // Constant upward velocity.
  v[IX(N >> 1, N - 3)] -= source * 0.25;
}


// ==================================================
// VORTICITY
// ==================================================

function calc_vorticity(om0, u0, v0) {

  for (let j = 1; j <= N; j++) {

    const row = STRIDE * j;
    const rowUp = row + STRIDE;
    const rowDown = row - STRIDE;

    for (let i = 1; i <= N; i++) {

      const id = row + i;

      om0[id] =
        (u0[rowUp + i] -
         u0[rowDown + i]) / dx
        -
        (v0[id + 1] -
         v0[id - 1]) / dx;
    }
  }

  set_bnd(1, om0);
}


// --------------------------------------------------
// Vorticity confinement
// --------------------------------------------------

function confine_vorticity(om0, u0, v0) {

  for (let j = 1; j <= N; j++) {

    const row = STRIDE * j;
    const rowUp = row + STRIDE;
    const rowDown = row - STRIDE;

    for (let i = 1; i <= N; i++) {

      const id = row + i;

      let gx =
        abs(om0[id - 1]) -
        abs(om0[id + 1]);

      let gy =
        abs(om0[rowDown + i]) -
        abs(om0[rowUp + i]);

      const length =
        Math.sqrt(gx * gx + gy * gy) +
        1e-5;

      gx /= length;
      gy /= length;

      const force =
        om0[id] *
        vc *
        dt;

      u0[id] += gy * force;
      v0[id] -= gx * force;
    }
  }
}


// --------------------------------------------------
// Vorticity step
// --------------------------------------------------

function vort_step() {

  calc_vorticity(om, u, v);

  confine_vorticity(om, u, v);
}


// ==================================================
// DIFFUSION
// ==================================================

function diffuse(b, x, x0, diff0) {

  const a =
    dt *
    diff0 *
    N *
    N;

  const inv =
    1 / (1 + 4 * a);

  for (let k = 0; k < 20; k++) {

    for (let j = 1; j <= N; j++) {

      const row = STRIDE * j;

      for (let i = 1; i <= N; i++) {

        const id = row + i;

        x[id] =
          (
            x0[id]
            +
            a * (
              x[id - 1]
              +
              x[id + 1]
              +
              x[id - STRIDE]
              +
              x[id + STRIDE]
            )
          ) * inv;
      }
    }

    set_bnd(b, x);
  }
}


// ==================================================
// ADVECTION
// ==================================================

function advect(b, d, d0, u0, v0) {

  const dt0 = dt * N;

  for (let j = 1; j <= N; j++) {

    const row = STRIDE * j;

    for (let i = 1; i <= N; i++) {

      const id = row + i;

      let x =
        i -
        dt0 * u0[id];

      let y =
        j -
        dt0 * v0[id];

      if (x < 0.5) {
        x = 0.5;
      }

      if (x > N + 0.5) {
        x = N + 0.5;
      }

      if (y < 0.5) {
        y = 0.5;
      }

      if (y > N + 0.5) {
        y = N + 0.5;
      }

      const i0 = floor(x);
      const i1 = i0 + 1;

      const j0 = floor(y);
      const j1 = j0 + 1;

      const s1 = x - i0;
      const s0 = 1 - s1;

      const t1 = y - j0;
      const t0 = 1 - t1;

      const id00 = IX(i0, j0);
      const id01 = IX(i0, j1);
      const id10 = IX(i1, j0);
      const id11 = IX(i1, j1);

      d[id] =
        s0 *
        (
          t0 * d0[id00]
          +
          t1 * d0[id01]
        )
        +
        s1 *
        (
          t0 * d0[id10]
          +
          t1 * d0[id11]
        );
    }
  }

  set_bnd(b, d);
}


// ==================================================
// DENSITY STEP
// ==================================================

function dens_step() {

  diffuse(
    0,
    dens_prev,
    dens,
    diff
  );

  advect(
    0,
    dens,
    dens_prev,
    u,
    v
  );
}


// ==================================================
// VELOCITY STEP
// ==================================================

function vel_step() {

  diffuse(
    1,
    u_prev,
    u,
    visc
  );

  diffuse(
    2,
    v_prev,
    v,
    visc
  );

  project(
    u_prev,
    v_prev,
    u,
    v
  );

  advect(
    1,
    u,
    u_prev,
    u_prev,
    v_prev
  );

  advect(
    2,
    v,
    v_prev,
    u_prev,
    v_prev
  );

  project(
    u,
    v,
    u_prev,
    v_prev
  );
}


// ==================================================
// PRESSURE PROJECTION
// ==================================================

function project(u0, v0, p, div) {

  const h = 1.0 / N;
  const halfH = 0.5 * h;

  // Divergence.
  for (let j = 1; j <= N; j++) {

    const row = STRIDE * j;

    for (let i = 1; i <= N; i++) {

      const id = row + i;

      div[id] =
        halfH *
        (
          u0[id + 1]
          -
          u0[id - 1]
          +
          v0[id + STRIDE]
          -
          v0[id - STRIDE]
        );

      p[id] = 0;
    }
  }

  set_bnd(0, div);
  set_bnd(0, p);

  const relaxation = 1.7 / 4;

  // Pressure solve.
  for (
    let k = 0;
    k < PRESSURE_ITERATIONS;
    k++
  ) {

    for (let j = 1; j <= N; j++) {

      const row = STRIDE * j;

      for (let i = 1; i <= N; i++) {

        const id = row + i;

        const residual =
          -4 * p[id]
          +
          p[id - 1]
          +
          p[id + 1]
          +
          p[id - STRIDE]
          +
          p[id + STRIDE]
          -
          div[id];

        p[id] +=
          residual *
          relaxation;
      }
    }

    set_bnd(0, p);
  }

  // Pressure gradient.
  const scale = 0.5 / h;

  for (let j = 1; j <= N; j++) {

    const row = STRIDE * j;

    for (let i = 1; i <= N; i++) {

      const id = row + i;

      u0[id] -=
        scale *
        (
          p[id + 1]
          -
          p[id - 1]
        );

      v0[id] -=
        scale *
        (
          p[id + STRIDE]
          -
          p[id - STRIDE]
        );
    }
  }

  set_bnd(1, u0);
  set_bnd(2, v0);
}


// ==================================================
// BOUNDARIES
// ==================================================

function set_bnd(b, x) {

  // Left/right boundaries.
  for (let i = 1; i <= N; i++) {

    const leftBoundary = IX(0, i);
    const left = IX(1, i);

    const rightBoundary = IX(N + 1, i);
    const right = IX(N, i);

    x[leftBoundary] =
      b === 1
        ? -x[left]
        : x[left];

    x[rightBoundary] =
      b === 1
        ? -x[right]
        : x[right];
  }

  // Top/bottom boundaries.
  for (let i = 1; i <= N; i++) {

    const topBoundary = IX(i, 0);
    const top = IX(i, 1);

    const bottomBoundary = IX(i, N + 1);
    const bottom = IX(i, N);

    x[topBoundary] =
      b === 2
        ? -x[top]
        : x[top];

    x[bottomBoundary] =
      b === 2
        ? -x[bottom]
        : x[bottom];
  }

  // Corners.
  x[IX(0, 0)] =
    0.5 *
    (
      x[IX(1, 0)]
      +
      x[IX(0, 1)]
    );

  x[IX(0, N + 1)] =
    0.5 *
    (
      x[IX(1, N + 1)]
      +
      x[IX(0, N)]
    );

  x[IX(N + 1, 0)] =
    0.5 *
    (
      x[IX(N, 0)]
      +
      x[IX(N + 1, 1)]
    );

  x[IX(N + 1, N + 1)] =
    0.5 *
    (
      x[IX(N, N + 1)]
      +
      x[IX(N + 1, N)]
    );
}


// ==================================================
// RENDER
// ==================================================

function drawFluid() {

  fluidImage.loadPixels();

  const pixels = fluidImage.pixels;

  for (let y = 0; y < N; y++) {

    const row =
      STRIDE * (y + 1);

    const imageRow =
      N * y;

    for (let x = 0; x < N; x++) {

      const id =
        row + x + 1;

      const p =
        4 * (imageRow + x);

      // --------------------------------------------
      // Density
      // --------------------------------------------

      let d =
        dens[id] * 255;

      if (d < 0) {
        d = 0;
      }

      if (d > 255) {
        d = 255;
      }

      // --------------------------------------------
      // Vorticity
      // --------------------------------------------

      let w =
        om[id] * 255;

      let positive = w;
      let negative = -w;

      if (positive < 0) {
        positive = 0;
      }

      if (positive > 255) {
        positive = 255;
      }

      if (negative < 0) {
        negative = 0;
      }

      if (negative > 255) {
        negative = 255;
      }

      // --------------------------------------------
      // RGB
      // --------------------------------------------

      pixels[p] =
        d;

      pixels[p + 1] =
        positive;

      pixels[p + 2] =
        negative;

      pixels[p + 3] =
        255;
    }
  }

  fluidImage.updatePixels();

  // ------------------------------------------------
  // Scale simulation to the window.
  // ------------------------------------------------

  image(
    fluidImage,
    0,
    0,
    width,
    height
  );
}


// ==================================================
// VELOCITY VISUALIZATION
// ==================================================

function drawVelocity() {

  const sx = width / N;
  const sy = height / N;

  stroke(255, 255, 255, 100);
  strokeWeight(1);

  for (let y = 1; y <= N; y++) {

    for (let x = 1; x <= N; x++) {

      const id = IX(x, y);

      const px =
        (x - 0.5) * sx;

      const py =
        (y - 0.5) * sy;

      line(
        px,
        py,
        px + u[id] * 50,
        py + v[id] * 50
      );
    }
  }
}


// ==================================================
// RESIZE
// ==================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  drawingContext.imageSmoothingEnabled = true;
}