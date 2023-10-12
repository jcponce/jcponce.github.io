// a shader variable
let theShader;
let shaderBg;

// Other variables I need for text message
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

  timing = millis() / 1000.0;

  // pass the interactive information to the shader
  theShader.setUniform("iResolution", [width, height]);
  theShader.setUniform("iTime", millis() / 1000.0);
  theShader.setUniform("iMouse", [xMouse, yMouse]);



  // rect gives us some geometry on the screen to draw the shader on
  shaderBg.rect(0, 0, width, height);
  image(shaderBg, 0, 0, width, height);

  // flip coordinate information box
  /*
  let flipX = 0;
  let flipY = 0;
  if (width - mouseX < 200) {
    flipX = -130;
  }
  if (height - mouseY < 100) {
    flipY = -35;
  }
  */

  // draw coordinate information box if you want

  /*
  
  fill(255);
  rect(mouseX + flipX, mouseY + flipY, 60, 40);
  fill(0);
  text("x: " + int(mouseX), mouseX + 15 + flipX, mouseY + 15 + flipY);
  text("y: " + int(mouseY), mouseX + 15 + flipX, mouseY + 30 + flipY);
  fill(0);
  rect(mouseX + 60 + flipX, mouseY + flipY, 70, 40);
  fill(255);
  text("x: " + nfc(xMouse, 3), mouseX + 15 + 60 + flipX, mouseY + 15 + flipY);
  text("y: " + nfc(yMouse, 3), mouseX + 15 + 60 + flipX, mouseY + 30 + flipY);

*/

    // finally, let's draw the text message on top
    textResponsive = width;
    //console.log(timing);
    if(timing < 50){
      push();
      fill(0, sigmoid(timing));
      rect(0,0,width, height);
      pop();
    }

  //console.log(imView);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let imView = false;

function mousePressed() {
  if (imView === false) {
    imView = true;
  }
  cursor('grabbing');
}

function mouseReleased() {
  if (imView === true) {
    imView = false;
  }
  cursor('grab');
}

// A sigmoid function :)
// I need this for the text message to fade away
function sigmoid(t){
  let k = 300.0 - 200.0 / (1.0 + exp(-t + 15.0));
  return k;
}
