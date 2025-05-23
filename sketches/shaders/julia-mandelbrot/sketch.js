/*

Julia sets exploration with Mandelbrot set
Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 04/Nov/2024

*/

// a shader variable
let theShader;
let shaderBg;

let parallel = false;

function preload() {
  // load the shader
  theShader = loadShader("shader.vert", "shader.frag");
}

let gui;
let params = {
  red: 1.1,
  green: 1.2,
  blue: 0.8,
  d: 0.5
};

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  pixelDensity(1);

  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  
  // Initialize the lil-gui
  gui = new lil.GUI();
  
  // Add controls for variables
  gui.add(params, 'red', 0, 3, 0.01);
  gui.add(params, 'green', 0, 3, 0.01);
  gui.add(params, 'blue', 0, 3, 0.01);
  gui.add(params, 'd', 0.3, 1.5, 0.01);
  gui.close();

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
  theShader.setUniform("iColor", [params.red, params.green, params.blue, params.d]);

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