/**
 *
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018 by Thomas Diewald (https://www.thomasdiewald.com)
 *
 *   Source: https://github.com/diwi/p5.EasyCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 *
 *
 * explanatory notes:
 *
 * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg
 * and combines new useful features with the great look and feel of its parent.
 *
 *
 */

// Original from https://openprocessing.org/sketch/583462

let easycam;


// ------ mesh ------
var tileCount;
var zScale;

// ------ noise ------
var noiseXRange;
var noiseYRange;
var octaves;
var falloff;

// ------ mesh coloring ------
var midColor;
var topColor;
var bottomColor;
var strokeColor;
var threshold;

// ------ mouse interaction ------
var offsetX;
var offsetY;
var clickX;
var clickY;
var zoom;
var rotationX;
var rotationZ;
var targetRotationX;
var targetRotationZ;
var clickRotationX;
var clickRotationZ;

function setup() {
	
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    //console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 800});
	
	// ------ mesh ------
  tileCount = 40;
  zScale = 380;

  // ------ noise ------
  noiseXRange = 20;
  noiseYRange = 80;
  octaves = 4;
  falloff = 0.5;

  // ------ mesh coloring ------
  topColor = color(0, 0, 0);
  midColor = color(191,0, 63);
  bottomColor = color(0, 0, 0);
  strokeColor = color(180, 100, 0);
  threshold = 0.10;

  // ------ mouse interaction ------
  offsetX = 0;
  offsetY = 0;
  clickX = 200;
  clickY = 200;
  zoom = -100;
  rotationX = 90;
  rotationZ = 100;
  targetRotationX = PI/3;
  targetRotationZ = 3;
    
   
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
}


function draw(){
    
  // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
	
	rotateX(1.1);
  rotateZ(0);
	
	ambientLight(150);

  // ------ set view ------
  push();
  translate(width * 0.05, height * 0.05, zoom);

  //if (mouseIsPressed && mouseButton == RIGHT) {
    offsetX =  clickX;
    offsetY =  clickY;
    //targetRotationX = min(max(clickRotationX + offsetY/float(width) * TWO_PI, -HALF_PI), HALF_PI);
    //targetRotationZ = clickRotationZ + offsetX/float(height) * TWO_PI;
  //}
  //rotationX += (targetRotationX - rotationX) * 0.25;
  //rotationZ += (targetRotationZ - rotationZ) * 0.25;
  //rotateX(-rotationX);
  //rotateZ(-rotationZ);

  // ------ mesh noise ------
  //if (mouseIsPressed && mouseButton == LEFT) {
    noiseXRange = 900/10;
    noiseYRange = 900/10;
  //}

  noiseDetail(octaves, falloff);
  var noiseYMax = 0;

  var tileSizeY = height / tileCount;
  var noiseStepY = noiseYRange / tileCount;

  for (var meshY = -30; meshY <= tileCount; meshY++) {
    beginShape(TRIANGLE_STRIP);
    for (var meshX = 0; meshX <= tileCount; meshX++) {

      var x = map(meshX, 0, tileCount, -width/2, width/2);
      var y = map(meshY, 0, tileCount, -height/2, height/2);

      var noiseX = map(meshX, 0, tileCount, 0, noiseXRange);
      var noiseY = map(meshY, 0, tileCount, 0, noiseYRange);
      var z1 = noise(noiseX, noiseY);
      var z2 = noise(noiseX, noiseY + noiseStepY);

      noiseYMax = max(noiseYMax, z1);
      var interColor;
      colorMode(RGB);
      var amount;
      if (z1 <= threshold) {
        amount = map(z1, 0, threshold, 0.15, 1);
        interColor = lerpColor(bottomColor, midColor, amount);
      }
      else {
        amount = map(z1, threshold, noiseYMax, 0, 1);
        interColor = lerpColor(midColor, topColor, amount);
      }
      fill(interColor);
      stroke(strokeColor);
      strokeWeight(1);
      vertex(x, y, z1*zScale);
      vertex(x, y+tileSizeY, z2*zScale);
    }
    endShape();
  }
  pop();
  
	/*
    // gizmo
    strokeWeight(5);
    stroke(255, 32,  0); line(0,0,0,2,0,0);
    stroke( 32,255, 32); line(0,0,0,0,2,0);
    stroke(  0, 32,255); line(0,0,0,0,0,2);
	*/
    
}

