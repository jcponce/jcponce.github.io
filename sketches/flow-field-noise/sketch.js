let field;
let w, h;
let sizeField;
let columns;
let rows;
let noiseZ;
let particles;
let hue;
let now;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  w = width;
  h = height;
  
  colorMode(HSL, 100);
  sizeField = 20; // size of field
  hue = 0;
  noiseZ = 0;
  noiseSeed(random());
  columns = round(w / sizeField) + 1;
  rows = round(h / sizeField) + 1;

  initParticles();
  initField();
}

function draw() {
  background(0);
  
  calculateField();
  now = millis();
  noiseZ = now * 0.00009;
  
  drawFlowField();
  //drawParticles();
}

