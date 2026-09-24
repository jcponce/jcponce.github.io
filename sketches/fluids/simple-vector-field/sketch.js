/*
  Fluido con curl noise + flechas
  -------------------------------
  - Campo sin divergencia (curl noise)
  - Partículas en todo el canvas (wrap-around)
  - Flechas cuya longitud representa la magnitud
  600 x 450

  Author: Juan Carlos Ponce Campuzano
  Date: 24/Sep/2026
  Used here:
  https://bestiariotopologico.blogspot.com/2026/09/las-ecuaciones-de-navierstokes-el.html
  
*/

const W = 600;
const H = 450;

const cols = 22;
const rows = 18;

const marginX = 35;
const marginY = 30;

const gridW = W - 2 * marginX;
const gridH = H - 2 * marginY;

const dx = gridW / cols;
const dy = gridH / rows;

const distortion = 22;

let time = 0;
let particles = [];

const NUM_PARTICLES = 2000;
const NOISE_SCALE = 0.006;
const PARTICLE_SPEED = 1.6;

// Escala de las flechas: sube/baja para cambiar el largo máximo
const ARROW_SCALE = 16;

let trailLayer;

function setup() {
  createCanvas(W, H);

  trailLayer = createGraphics(W, H);
  trailLayer.background(10, 30, 60);
  trailLayer.strokeCap(ROUND);

  noiseSeed(4);
  noiseDetail(3, 0.5);
  strokeCap(ROUND);

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 30, 60);

  time += 0.003;

  // Slowly fade old particle traces
  trailLayer.noStroke();
  trailLayer.fill(10, 30, 60, 18);
  trailLayer.rect(0, 0, width, height);

  for (let p of particles) {
    p.update();
    p.display();
  }

  // Draw the accumulated trails
  image(trailLayer, 0, 0);

  drawGrid();
  drawArrows();
}

// ------------------------------------------------------------
// Campo de velocidad: curl noise con magnitud real
// ------------------------------------------------------------
function flowAt(x, y) {
  const s = NOISE_SCALE;
  const eps = 1.5; // píxeles de diferencia finita

  const nL = noise((x - eps) * s, y * s, time);
  const nR = noise((x + eps) * s, y * s, time);
  const nU = noise(x * s, (y - eps) * s, time);
  const nD = noise(x * s, (y + eps) * s, time);

  // Gradiente del potencial
  const dndx = (nR - nL) / (2 * eps);
  const dndy = (nD - nU) / (2 * eps);

  // curl(psi) = ( dpsi/dy, -dpsi/dx )
  return { x: dndy, y: -dndx };
}

// ------------------------------------------------------------
// Partículas
// ------------------------------------------------------------
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);

    this.px = this.x;
    this.py = this.y;
  }

  update() {
    const v = flowAt(this.x, this.y);
    const m = sqrt(v.x * v.x + v.y * v.y) || 1;

    const speedMod =
      0.7 + 0.6 * noise(
        this.x * 0.01,
        this.y * 0.01,
        time * 2
      );

    const speed = PARTICLE_SPEED * speedMod;

    this.px = this.x;
    this.py = this.y;

    this.x += (v.x / m) * speed;
    this.y += (v.y / m) * speed;

    let wrapped = false;

    if (this.x < 0) {
      this.x += width;
      wrapped = true;
    }

    if (this.x > width) {
      this.x -= width;
      wrapped = true;
    }

    if (this.y < 0) {
      this.y += height;
      wrapped = true;
    }

    if (this.y > height) {
      this.y -= height;
      wrapped = true;
    }

    if (wrapped) {
      this.px = this.x;
      this.py = this.y;
    }
  }

  display() {
    trailLayer.stroke(255, 255, 255, 70);
    trailLayer.strokeWeight(1.5);

    trailLayer.line(
      this.px,
      this.py,
      this.x,
      this.y
    );
  }
}

// ------------------------------------------------------------
// Rejilla deformada
// ------------------------------------------------------------
function drawGrid() {
  stroke(255, 255, 255, 50);
  strokeWeight(1);
  noFill();

  for (let i = 0; i <= cols; i++) {
    beginShape();
    for (let j = 0; j <= rows; j++) {
      const p = gridPoint(i, j);
      vertex(p.x, p.y);
    }
    endShape();
  }

  for (let j = 0; j <= rows; j++) {
    beginShape();
    for (let i = 0; i <= cols; i++) {
      const p = gridPoint(i, j);
      vertex(p.x, p.y);
    }
    endShape();
  }
}

function gridPoint(i, j) {
  const x = marginX + i * dx;
  const y = marginY + j * dy;

  const nx = noise(i * 0.20, j * 0.20, time);
  const ny = noise(i * 0.20 + 50, j * 0.20 + 50, time);

  const offsetX = map(nx, 0, 1, -distortion, distortion);
  const offsetY = map(ny, 0, 1, -distortion, distortion);

  return { x: x + offsetX, y: y + offsetY };
}

// ------------------------------------------------------------
// Flechas proporcionales a la magnitud
// ------------------------------------------------------------
function drawArrows() {

  // Magnitud máxima que queremos representar
  const MAX_SPEED = 0.0025;

  // Longitudes mínima y máxima de las flechas
  const MIN_LEN = 4;
  const MAX_LEN = 12;

  for (let j = 0; j < rows; j++) {

    for (let i = 0; i < cols; i++) {

      const p00 = gridPoint(i,     j);
      const p10 = gridPoint(i + 1, j);
      const p01 = gridPoint(i,     j + 1);
      const p11 = gridPoint(i + 1, j + 1);

      // Centro de la celda
      const cx =
        (p00.x + p10.x + p01.x + p11.x) / 4;

      const cy =
        (p00.y + p10.y + p01.y + p11.y) / 4;

      // Velocidad local
      const v = flowAt(cx, cy);

      // Magnitud de la velocidad
      const m = mag(v.x, v.y);

      if (m < 0.00001) continue;

      // Dirección
      const angle = atan2(v.y, v.x);

      // --------------------------------------------------
      // LONGITUD PROPORCIONAL A LA MAGNITUD
      // --------------------------------------------------

      const len = map(
        constrain(m, 0, MAX_SPEED),
        0,
        MAX_SPEED,
        MIN_LEN,
        MAX_LEN
      );

      const vx = cos(angle) * len;
      const vy = sin(angle) * len;

      drawArrow(cx, cy, vx, vy);
    }
  }
}

function drawArrow(x, y, vx, vy) {
  const lengthVector = sqrt(vx * vx + vy * vy);
  if (lengthVector < 0.01) return;

  stroke(255, 255, 255);
  strokeWeight(1.5);

  line(x, y, x + vx, y + vy);

  const angle = atan2(vy, vx);
  const head = constrain(lengthVector * 0.35, 3, 7);

  push();
  translate(x + vx, y + vy);
  rotate(angle);

  line(0, 0, -head, -head * 0.5);
  line(0, 0, -head, head * 0.5);

  pop();
}