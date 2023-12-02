/*

Learning Shaders 
Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 31/May/2022

*/

// a shader variable
let theShader;
let shaderBg;

function preload() {
  // load the shader
  theShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  pixelDensity(1);

 // shaders require WEBGL mode to work
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
	//shader(theShader);
  
   // get the mouse coordinates, map them to values between 0-1 space
  let yMouse = (map(mouseY, 0, height, height, 0) / height) * 2 - 1;
  let xMouse = (mouseX / width) * 2 - 1;

  // Make sure pixels are square
  xMouse = (xMouse * width) / height;
  yMouse = yMouse;

  // pass the interactive information to the shader
  theShader.setUniform("iResolution", [width, height]);
  theShader.setUniform("iTime", millis() / 1000.0);
  theShader.setUniform("iFrame", frameRate());
  theShader.setUniform("iMouse", [xMouse, yMouse]);

  // rect gives us some geometry on the screen to draw the shader on
  // rect gives us some geometry on the screen to draw the shader on
  shaderBg.rect(0, 0, width, height);
  image(shaderBg, 0, 0, width, height);
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
