/*
----- Coding Tutorial by Patt Vira ----- 
Name: Chladni Patterns (Particles)
Video Tutorial: https://youtu.be/J-siGcsK2k8

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

let particles = []; let num = 4000;
let m = 5; let n = 4; let threshold = 0.05;
let minMN = 1; let maxMN = 8;
let changePattern = true;
let margin = 40; let w1, w2, h1, h2;
let scl = 1;

function setup() {
  createCanvas(450, 450);
  w1 = margin; w2 = width - margin;
  h1 = margin; h2 = height - margin;
  for (let i=0; i<num; i++) {
    particles.push(new Particle());
  }

  cursor('pointer');
  //noCursor();
  
}

function draw() {
  background(0);
  
  if (changePattern) {
    randomPatterns();
  }
  
  for (let i=0; i<particles.length; i++) {
    particles[i].update();
    particles[i].display();
  }
}

function chladni (x, y) {
  let L = 1;
  return cos(n * PI * x / L) * cos(m * PI * y / L) - 
         cos(m * PI * x / L) * cos(n * PI * y / L);
}

function randomPatterns() {
  m = floor(random(minMN, maxMN));
  n = floor(random(minMN, maxMN));
  
  if (m === n) {
    m = floor(random(minMN, maxMN));
  }
  
  changePattern = false;
  
  for (let i=0; i<particles.length; i++) {
    particles[i].velocity = p5.Vector.random2D().mult(random(2, 5));
  }
}

function mousePressed() {
  changePattern = true;
}
