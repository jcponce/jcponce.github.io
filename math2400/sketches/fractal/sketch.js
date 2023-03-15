/*
Learning Shaders 
Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 05/May/2022

Following the tutorial from the Art of code:
https://youtu.be/u5HAYVHsasc

*/

// a shader variable
let theShader;
let shaderBg;

// Other variable I need
let isPressed = false;
let textResponsive;
let fadeAway;
let timing;

function preload() {
  // load the shader
  theShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  pixelDensity(1);

  createCanvas(windowWidth, windowHeight);
  noStroke();

  // shaders require WEBGL mode to work
  shaderBg = createGraphics(windowWidth, windowHeight, WEBGL);
}

function draw() {
  // we can draw the background each frame or not.
  // if we do we can use transparency in our shader.
  // if we don't it will leave a trailing after image.
  // background(0);
  // shader() sets the active shader with our shader
  shaderBg.shader(theShader);

  // get the mouse coordinates, map them to values between 0-1 space
  let yMouse = (map(mouseY, 0, height, height, 0) / height) * 2 - 1;
  let xMouse = (mouseX / width) * 2 - 1;

  // Make sure pixels are square
  xMouse = (xMouse * width) / height;
  yMouse = yMouse;

  /*
  let isPressed;
  if (mouseIsPressed === true) {
    isPressed = true;
    cursor('grabbing')
  } else {
    isPressed = false;
    cursor('grab')
  }
  */

  timing = millis() / 1000.0;
  // pass the interactive information to the shader
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", timing);
  theShader.setUniform("u_mouse", [xMouse, yMouse]);
  theShader.setUniform("u_pressed", isPressed);

  // rect gives us some geometry on the screen to draw the shader on
  shaderBg.rect(0, 0, width, height);
  image(shaderBg, 0, 0, width, height);

  textResponsive = width;

  push();
  fill(255);
  strokeWeight(1);
  stroke(0, sigmoid(timing));
  textAlign(CENTER)
  textSize(0.045 * textResponsive);
  translate(0,-0.065 * textResponsive);
  text('The beauty of mathematics \n shows itself to patient followers', windowWidth/2, windowHeight/2);
  translate(0,0.065 * textResponsive);
  textSize(0.03 * textResponsive);
  text(' \n                                  — Maryam Mirzakhani', windowWidth/2, windowHeight/2);
  pop();

  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textResponsive = width;
}

function mouseClicked() {
  if (isPressed === false) {
    isPressed = true;
  } else {
    isPressed = false;
    
  }
}

// A sigmoid function :)
function sigmoid(t){
  let k = - 10.0 / (1.0 + exp(t - 15.0));
  return k;
}
