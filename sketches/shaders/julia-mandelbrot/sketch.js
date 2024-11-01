/*
Learning Shaders 
Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 02/Nov/2024

*/

// a shader variable
let theShader;
let shaderBg;

let parallel = false;

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

  // Get the mouse coordinates and map them to values between -1 and 1
  let yMouse = (map(mouseY, 0, height, height, 0) / height) * 2 - 1;
  let xMouse = (mouseX / width) * 2 - 1;

  // Ensure pixels are square
  xMouse = (xMouse * width) / height;

  // Set the z-component based on whether the mouse is pressed
  let zMouse = mouseIsPressed ? 1.0 : 0.0;

  // pass the interactive information to the shader
  theShader.setUniform("iResolution", [width, height]);
  theShader.setUniform("iTime", millis() / 1000.0);
  theShader.setUniform("iMouse", [xMouse, yMouse, zMouse]);

  // rect gives us some geometry on the screen to draw the shader on
  shaderBg.rect(0, 0, width, height);
  image(shaderBg, 0, 0, width, height);

  if(mouseIsPressed){
    cursor('none');
  } else {
    cursor('crosshair');
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 's' || key ==='S') {
    save('my-julia-set.jpg');
  }

}