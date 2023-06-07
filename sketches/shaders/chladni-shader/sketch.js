/*

  Juan Carlos Ponce Campuzano
  https://jcponce.github.io
  14 Feb 2021

*/

let theShader;

function preload() {
  // load the shader
  theShader = loadShader("shader.vert", "shader.frag");
  //pixelDensity(1);
}

// Uniform values to use in the fragment file
let a, b, m, n, p;

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  cursor(HAND);

  a = 3.0;
  b = 3.0;
  m = 7.0;
  n = 3.0;
  p1 = 1.0;
  p2 = 1.0;
  p3 = -1.0;
  p4 = -1.0;

}

function draw() {

   // shader() sets the active shader with our shader

  shader(theShader);

  // here we're using setUniform() to send our uniform values to the shader
  // set uniform is smart enough to figure out what kind of variable we are sending it,
  // so there's no need to cast (unlike processing)
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("iFrame", frameCount);
  theShader.setUniform("av", a);
  theShader.setUniform("bv", b);
  theShader.setUniform("mv", m);
  theShader.setUniform("nv", n);
  theShader.setUniform("pv1", p1);
  theShader.setUniform("pv2", p2);
  theShader.setUniform("pv3", p3);
  theShader.setUniform("pv4", p4);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  a = random(0.1, 4);
  b = random(0.1, 4);
  m = random(1, 9);
  n = random(1, 9);
  p1 = powNegPos(5);
  p2 = powNegPos(5);
  p3 = powNegPos(5);
  p4 = powNegPos(5);
}


function touchStarted() {
  a = random(0.1, 4);
  b = random(0.1, 4);
  m = random(1, 9);
  n = random(1, 9);
  p1 = powNegPos(5);
  p2 = powNegPos(5);
  p3 = powNegPos(5);
  p4 = powNegPos(5);
}


function powNegPos(m) {
  return pow((-1), int(random(0, m)))
}