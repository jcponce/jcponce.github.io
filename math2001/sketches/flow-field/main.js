/* 
 Original code by 
 Johan Karlsson (https://codepen.io/DonKarlssonSan/pen/aLRVbw)
 
 This version by Juan Carlos Ponce Campuzano, 15-Nov-2022
 Update: 
 https://jcponce.github.io
*/

class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(Math.random()*2-1, Math.random()*2-1);
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
  
  draw() {
    //ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    ctx.beginPath();
    ctx.ellipse(this.pos.x, this.pos.y, this.size/2, this.size/2,  0, 0, 2 * Math.PI);
    //ctx.stroke();
    ctx.fill();
  }
  
  wrap() {
    if(this.pos.x > w) {
      this.pos.x = 0;
    } else if(this.pos.x < -this.size) {
      this.pos.x = w - 1;
    }
    if(this.pos.y > h) {
      this.pos.y = 0;
    } else if(this.pos.y < -this.size) {
      this.pos.y = h - 1;
    }
  }
}

let canvas;
let ctx;
let field;
let w, h;
let size;
let columns;
let rows;
let noiseZ;
let particles;
let hue;

function setup() {
  size = 20;
  hue = 0;
  noiseZ = 0;
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  reset();
  window.addEventListener("resize", reset);  
}

function initParticles() {
  particles = [];
  let numberOfParticles = w * h / 1500;
  for(let i = 0; i < numberOfParticles; i++) {
    let particle = new Particle(Math.random() * w, Math.random() * h);
    particles.push(particle);
  }
}

function initField() {
  field = new Array(columns);
  for(let x = 0; x < columns; x++) {
    field[x] = new Array(columns);
    for(let y = 0; y < rows; y++) {
      let v = new Vector(0, 0);
      field[x][y] = v;
    }
  }
}

function calculateField() {
  for(let x = 0; x < columns; x++) {
    for(let y = 0; y < rows; y++) {
      let angle = noise.simplex3(x/20, y/20, noiseZ) * Math.PI * 2;
      let length = noise.simplex3(x/40 + 40000, y/40 + 40000, noiseZ) * 0.5;
      field[x][y].setLength(length);
      field[x][y].setAngle(angle);
    }
  }
}

function reset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  ctx.strokeStyle = "white";
  noise.seed(Math.random());
  columns = Math.round(w / size) + 1;
  rows = Math.round(h / size) + 1;
  initParticles();
  initField();
}

function draw(now) {
  requestAnimationFrame(draw);
  calculateField();
  noiseZ = now * 0.0002;
  drawBackground();
  drawFlowField();
  drawParticles();
}

function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
}

function drawParticles() {
  hue += 0.5;
  ctx.fillStyle = `hsla(${hue}, 50%, 50%, 0.86)`;
  particles.forEach(p => {
    p.draw();
    let pos = p.pos.div(size);
    let v;
    if(pos.x >= 0 && pos.x < columns && pos.y >= 0 && pos.y < rows) {
      v = field[Math.floor(pos.x)][Math.floor(pos.y)];
    }
    p.move(v);
    p.wrap();
  });
}

function drawFlowField() {
  for(let x = 0; x < columns; x++) {
    for(let y = 0; y < rows; y++) {
      ctx.beginPath();
      let x1 = x*size;
      let y1 = y*size;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + field[x][y].x*size*2, y1 + field[x][y].y*size*2);
      ctx.stroke();
    }
  }
}

setup();
draw(performance.now());