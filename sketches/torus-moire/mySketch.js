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

/*

This is a p5js version of Torus

https://openprocessing.org/sketch/844154

by https://openprocessing.org/user/207921?view=sketches

*/

let easycam;

let detail = 40;

let maxSize = 100;

let f = 0; //Float-eri esker benetako zenbakizko balioak irudikatzen ditu; kasu honetan f parametroari balio bat ematen dio.

function setup() {
	
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    //console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 800});
	
	  noFill();
    strokeWeight(3);
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
  
    // gizmo
    //strokeWeight(5);
    //stroke(255, 32,  0); line(0,0,0,2,0,0);
    //stroke( 32,255, 32); line(0,0,0,0,2,0);
    //stroke(  0, 32,255); line(0,0,0,0,0,2);
  
  rotateX(PI/5.0);//Borobilaren inklinazioa X ardatzarekiko.
  rotateY(PI/5.0);//Borobilaren inklinazioa Y ardatzarekiko.
 
  for (let i = f; i < TWO_PI+f; i+= TWO_PI / detail) {
    push();
    translate(8, 0, cos(i) * 100.0);
    stroke(max(10 + cos(i) * 250, 10));
    //ellipse(0, 0, maxSize*2 + sin(i) * maxSize, maxSize*2 + sin(i) * maxSize);
		drawCircle(0, 0, maxSize*2 + sin(i) * maxSize) 
    pop();
  }
  f+= 0.007;
    
}


function drawCircle(x, y, r) {
    noFill();
    beginShape();
    for(let i = 0; i <= TWO_PI; i+=PI/90){
        let xc = r * cos(i) + x;
        let yc = r * sin(i) + y;
        vertex(xc, yc);
    }
    endShape();
    
}


