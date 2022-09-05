/*

Original shader by
Thomas Hooper https://twitter.com/tdhooper
Link: https://www.shadertoy.com/view/NtcyRB

This version by Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 09/Aug/2022

*/

// Shader variables
let theShader;
let shaderBg;

// For uniform variables
let xMouse;
let yMouse;
let imView = false;
let slider;

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
    cursor('grab');

    // create gui (dat.gui), not needed anymore
    //let gui = new dat.GUI({
    //    width: 280,
    //});
    //gui.add(param, 'Approx', 0, 1, 0.01).listen();

    slider = createSlider(0, 1, 1, 0.01);
    slider.position(windowWidth/2-200, windowHeight-80);
    slider.style('width', '400px');

}

function draw() {
    // we can draw the background each frame or not.
    // if we do we can use transparency in our shader.
    // if we don't it will leave a trailing after image.
    // background(0);
    // shader() sets the active shader with our shader
    shaderBg.shader(theShader);

    // get the mouse coordinates, map them to values between 0-1 space
    yMouse = (map(mouseY, 0, height, height, 0) / height) * 2 - 1;
    xMouse = (mouseX / width) * 2 - 1;

    // Make sure pixels are square
    xMouse = (xMouse * width) / height;
    yMouse = yMouse;

    // pass the interactive information to the shader
    theShader.setUniform("iResolution", [width, height]);
    theShader.setUniform("iTime", millis() / 1000.0);
    theShader.setUniform("iMouse", [xMouse, yMouse]);
    theShader.setUniform("iView", imView);
    theShader.setUniform("iParam", slider.value());


    // rect gives us some geometry on the screen to draw the shader on
    shaderBg.rect(0, 0, width, height);
    image(shaderBg, 0, 0, width, height);

    /*
    // I just need the following code to display
    // information for position reference.
    // flip coordinate information box
    let flipX = 0;
    let flipY = 0;
    if (width - mouseX < 200) {
        flipX = -130;
    }
    if (height - mouseY < 100) {
        flipY = -35;
    }

    // draw coordinate information box if you want

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

    //console.log(imView);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    slider.position(windowWidth/2-150, windowHeight-70);
}

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