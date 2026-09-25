// Source: Real-Time Fluid Dynamics for Games by Jos Stam - 
// https://www.dgp.toronto.edu/public_user/stam/reality/Research/pdf/GDC03.pdf

const N = 128;

let size;

let u = [];
let v = [];

let u_prev = [];
let v_prev = [];

let dens = [];
let dens_prev = [];

let om = [];

const source = 10;
const diff = 0.0001;
const visc = 0.000001;
const dt = 0.01;
const dx = 1.0;
const vc = 5.0;


// --------------------------------------------------
// Indexing
// --------------------------------------------------

function IX(i, j) {
  return i + (N + 2) * j;
}

function PX(x, y) {
  return (x + width * y) * 4;
}


// --------------------------------------------------
// Utility
// --------------------------------------------------

function normalize(x, y) {
  const length = Math.sqrt(x * x + y * y) + 1e-5;

  return {
    x: x / length,
    y: y / length
  };
}


// --------------------------------------------------
// Setup
// --------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);

  pixelDensity(1);

  background(0);
  stroke(255, 0, 0);

  cursor('pointer')

  initSim();

  const resetButton = createButton('Reset');
  
  resetButton.position(15, 15);
  resetButton.mousePressed(resetSketch);

  resetButton.style('background', '#222');
  resetButton.style('color', '#fff');
  resetButton.style('border', '1px solid #666');
  resetButton.style('border-radius', '4px');
  resetButton.style('padding', '6px 12px');
  resetButton.style('font-family', 'sans-serif');
  resetButton.style('font-size', '14px');
  resetButton.style('cursor', 'pointer');
}


// --------------------------------------------------
// Initialize simulation
// --------------------------------------------------

function initSim() {
  size = (N + 2) * (N + 2);

  u = new Array(size).fill(0);
  v = new Array(size).fill(0);

  dens = new Array(size).fill(0);
  om = new Array(size).fill(0);

  u_prev = new Array(size).fill(0);
  v_prev = new Array(size).fill(0);
  dens_prev = new Array(size).fill(0);
}


// --------------------------------------------------
// Main loop
// --------------------------------------------------

function draw() {
  background(0);

  // Copy current fields.
  dens_prev = dens.slice();
  u_prev = u.slice();
  v_prev = v.slice();

  add_density();
  add_velocity();

  vel_step();
  dens_step();
  vort_step();

  drawDensity();
  drawVorticity();

  // drawVelocity();
}


// --------------------------------------------------
// Add density
// --------------------------------------------------

function add_density() {

  if (mouseIsPressed) {

    const mx = Math.floor((N / width) * mouseX);
    const my = Math.floor((N / height) * mouseY);

    // Only add density when the mouse is inside the canvas.
    if (mx >= 0 && mx <= N && my >= 0 && my <= N) {

      dens[IX(mx, my)] += source;

      if (mx > 0) {
        dens[IX(mx - 1, my)] += source / 2;
      }

      if (mx < N) {
        dens[IX(mx + 1, my)] += source / 2;
      }

      if (my > 0) {
        dens[IX(mx, my - 1)] += source / 2;
      }

      if (my < N) {
        dens[IX(mx, my + 1)] += source / 2;
      }
    }
  }

  // Continuous source at the bottom.
  dens[IX(Math.floor(N / 2), N - 3)] += source / 4;
}


// --------------------------------------------------
// Add velocity
// --------------------------------------------------

function add_velocity() {

  if (mouseIsPressed) {

    const mx = Math.floor((N / width) * mouseX);
    const my = Math.floor((N / height) * mouseY);

    if (mx >= 0 && mx <= N && my >= 0 && my <= N) {

      const i = IX(mx, my);

      const xv = (N / width) * (mouseX - pmouseX);
      const yv = (N / height) * (mouseY - pmouseY);

      u[i] += xv * (2 / (Math.abs(xv) + 1)) * 15;
      v[i] += yv * (2 / (Math.abs(yv) + 1)) * 15;
    }
  }

  // Continuous upward velocity at the bottom.
  v[IX(Math.floor(N / 2), N - 3)] -= source / 4;
}


// --------------------------------------------------
// Vorticity
// --------------------------------------------------

function calc_vorticity(om0, u0, v0) {

  for (let i = 1; i <= N; i++) {

    for (let j = 1; j <= N; j++) {

      om0[IX(i, j)] =
        (
          u0[IX(i, j + 1)] -
          u0[IX(i, j - 1)]
        ) / dx
        -
        (
          v0[IX(i + 1, j)] -
          v0[IX(i - 1, j)]
        ) / dx;
    }
  }

  set_bnd(1, om0);
}


// --------------------------------------------------
// Vorticity confinement
// --------------------------------------------------

function confine_vorticity(om0, u0, v0) {

  for (let i = 1; i <= N; i++) {

    for (let j = 1; j <= N; j++) {

      let omgrad_x =
        Math.abs(om0[IX(i - 1, j)]) -
        Math.abs(om0[IX(i + 1, j)]);

      let omgrad_y =
        Math.abs(om0[IX(i, j - 1)]) -
        Math.abs(om0[IX(i, j + 1)]);

      // const normalized = normalize(omgrad_x, omgrad_y);

      // omgrad_x = normalized.x;
      // omgrad_y = normalized.y;

      const i0 = IX(i, j);

      u0[i0] +=
        omgrad_y *
        om0[i0] *
        vc *
        dt;

      v0[i0] +=
        -omgrad_x *
        om0[i0] *
        vc *
        dt;
    }
  }
}


// --------------------------------------------------
// Diffusion
// --------------------------------------------------

function diffuse(b, x, x0, diff0) {

  const a = dt * diff0 * N * N;

  for (let k = 0; k < 20; k++) {

    for (let i = 1; i <= N; i++) {

      for (let j = 1; j <= N; j++) {

        const index = IX(i, j);

        x[index] =
          (
            x0[index] +
            a * (
              x[IX(i - 1, j)] +
              x[IX(i + 1, j)] +
              x[IX(i, j - 1)] +
              x[IX(i, j + 1)]
            )
          ) / (1 + 4 * a);
      }
    }

    set_bnd(b, x);
  }
}


// --------------------------------------------------
// Advection
// --------------------------------------------------

function advect(b, d, d0, u0, v0) {

  const dt0 = dt * N;

  for (let i = 1; i <= N; i++) {

    for (let j = 1; j <= N; j++) {

      let x =
        i - dt0 * u0[IX(i, j)];

      let y =
        j - dt0 * v0[IX(i, j)];

      x = Math.max(0.5, Math.min(N + 0.5, x));
      y = Math.max(0.5, Math.min(N + 0.5, y));

      const i0 = Math.floor(x);
      const i1 = i0 + 1;

      const j0 = Math.floor(y);
      const j1 = j0 + 1;

      const s1 = x - i0;
      const s0 = 1 - s1;

      const t1 = y - j0;
      const t0 = 1 - t1;

      d[IX(i, j)] =
        s0 * (
          t0 * d0[IX(i0, j0)] +
          t1 * d0[IX(i0, j1)]
        )
        +
        s1 * (
          t0 * d0[IX(i1, j0)] +
          t1 * d0[IX(i1, j1)]
        );
    }
  }

  set_bnd(b, d);
}


// --------------------------------------------------
// Density step
// --------------------------------------------------

function dens_step() {

  diffuse(0, dens_prev, dens, diff);

  advect(0, dens, dens_prev, u, v);
}


// --------------------------------------------------
// Velocity step
// --------------------------------------------------

function vel_step() {

  diffuse(1, u_prev, u, visc);

  diffuse(2, v_prev, v, visc);

  project(u_prev, v_prev, u, v);

  advect(1, u, u_prev, u_prev, v_prev);

  advect(2, v, v_prev, u_prev, v_prev);

  project(u, v, u_prev, v_prev);
}


// --------------------------------------------------
// Vorticity step
// --------------------------------------------------

function vort_step() {

  calc_vorticity(om, u, v);

  confine_vorticity(om, u, v);
}


// --------------------------------------------------
// Projection
// --------------------------------------------------

function project(u0, v0, p, div) {

  const h = 1.0 / N;

  for (let i = 1; i <= N; i++) {

    for (let j = 1; j <= N; j++) {

      const index = IX(i, j);

      div[index] =
        0.5 * h * (
          u0[IX(i + 1, j)] -
          u0[IX(i - 1, j)] +
          v0[IX(i, j + 1)] -
          v0[IX(i, j - 1)]
        );

      p[index] = 0;
    }
  }

  set_bnd(0, div);
  set_bnd(0, p);

  for (let k = 0; k < 100; k++) {

    for (let i = 1; i <= N; i++) {

      for (let j = 1; j <= N; j++) {

        const index = IX(i, j);

        const residual =
          -4 * p[index] +
          p[IX(i - 1, j)] +
          p[IX(i + 1, j)] +
          p[IX(i, j - 1)] +
          p[IX(i, j + 1)] -
          div[index];

        p[index] += residual * (1.7 / 4);
      }
    }

    set_bnd(0, p);
  }

  for (let i = 1; i <= N; i++) {

    for (let j = 1; j <= N; j++) {

      const index = IX(i, j);

      u0[index] -=
        0.5 *
        (p[IX(i + 1, j)] - p[IX(i - 1, j)]) /
        h;

      v0[index] -=
        0.5 *
        (p[IX(i, j + 1)] - p[IX(i, j - 1)]) /
        h;
    }
  }

  set_bnd(1, u0);
  set_bnd(2, v0);
}


// --------------------------------------------------
// Boundary conditions
// --------------------------------------------------

function set_bnd(b, x) {

  for (let i = 1; i <= N; i++) {

    x[IX(0, i)] =
      b === 1
        ? -x[IX(1, i)]
        : x[IX(1, i)];

    x[IX(N + 1, i)] =
      b === 1
        ? -x[IX(N, i)]
        : x[IX(N, i)];

    x[IX(i, 0)] =
      b === 2
        ? -x[IX(i, 1)]
        : x[IX(i, 1)];

    x[IX(i, N + 1)] =
      b === 2
        ? -x[IX(i, N)]
        : x[IX(i, N)];
  }

  x[IX(0, 0)] =
    0.5 * (
      x[IX(1, 0)] +
      x[IX(0, 1)]
    );

  x[IX(0, N + 1)] =
    0.5 * (
      x[IX(1, N + 1)] +
      x[IX(0, N)]
    );

  x[IX(N + 1, 0)] =
    0.5 * (
      x[IX(N, 0)] +
      x[IX(N + 1, 1)]
    );

  x[IX(N + 1, N + 1)] =
    0.5 * (
      x[IX(N, N + 1)] +
      x[IX(N + 1, N)]
    );
}


// --------------------------------------------------
// Density rendering
// --------------------------------------------------

function drawDensity() {

  loadPixels();

  for (let y = 0; y < height; y++) {

    for (let x = 0; x < width; x++) {

      const dx = (N / width) * x;
      const dy = (N / height) * y;

      const x0 = Math.floor(dx);
      const x1 = Math.ceil(dx);

      const y0 = Math.floor(dy);
      const y1 = Math.ceil(dy);

      const ddx = dx - x0;
      const ddy = dy - y0;

      const df =
        (
          dens[IX(x0, y0)] * (1 - ddx) +
          dens[IX(x1, y0)] * ddx
        ) * (1 - ddy)
        +
        (
          dens[IX(x0, y1)] * (1 - ddx) +
          dens[IX(x1, y1)] * ddx
        ) * ddy;

      let di = Math.floor(df * 255);

      di = Math.max(0, Math.min(255, di));

      const index = PX(x, y);

      pixels[index] = 0;
      pixels[index + 1] = 0;
      pixels[index + 2] = pixels[index] * (1 - df) + di * df;
      pixels[index + 3] = 255;
    }
  }

  updatePixels();
}


// --------------------------------------------------
// Vorticity rendering
// --------------------------------------------------

function drawVorticity() {

  loadPixels();

  for (let y = 0; y < height; y++) {

    for (let x = 0; x < width; x++) {

      const dx = (N / width) * x;
      const dy = (N / height) * y;

      const x0 = Math.floor(dx);
      const x1 = Math.ceil(dx);

      const y0 = Math.floor(dy);
      const y1 = Math.ceil(dy);

      const ddx = dx - x0;
      const ddy = dy - y0;

      const df =
        (
          om[IX(x0, y0)] * (1 - ddx) +
          om[IX(x1, y0)] * ddx
        ) * (1 - ddy)
        +
        (
          om[IX(x0, y1)] * (1 - ddx) +
          om[IX(x1, y1)] * ddx
        ) * ddy;

      let di = Math.floor(df * 255);
      let din = -di;

      di = Math.max(0, Math.min(255, di));
      din = Math.max(0, Math.min(255, din));

      const index = PX(x, y);

      pixels[index ] = di;
      pixels[index + 1] = din;
    }
  }

  updatePixels();
}


// --------------------------------------------------
// Velocity visualization
// --------------------------------------------------

function drawVelocity() {

  const sx = width / N;
  const sy = height / N;

  for (let x = 1; x <= N; x++) {

    for (let y = 1; y <= N; y++) {

      const index = IX(x, y);

      line(
        Math.floor((x - 0.5) * sx),
        Math.floor((y - 0.5) * sy),

        Math.floor(
          (x - 0.5) * sx +
          u[index] * 50
        ),

        Math.floor(
          (y - 0.5) * sy +
          v[index] * 50
        )
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

// ==================================================
// RESET SKETCH
// ==================================================
function resetSketch() {
  initSim();
  background(0);
}