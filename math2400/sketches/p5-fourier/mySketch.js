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

let easycam;

function setup() {
	
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    //console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {
        distance : 10,
        //viewport : [1, 1, 0, 1],   
        //rotation: [1, 1, 0, 0]
    });
    
   
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

    rotateX(0.9)
    rotateY(0.0);
    rotateZ(0.3);

    curves();
    
    // gizmo
    strokeWeight(5);
    stroke(255, 32,  0); line(0,0,0,2,0,0);
    stroke( 32,255, 32); line(0,0,0,0,2,0);
    stroke(  0, 32,255); line(0,0,0,0,0,2);

    
    
}

function curves(){
    push();
    stroke(255,0,0);
    noFill();
    strokeWeight(3);
    beginShape();
    for(let i = 0; i <= 2*PI; i+=0.2){
        
        
        let xc = i;
        let yc = 0;
        let zc =  sin(i);
        vertex(xc, yc, zc);
        
    }
    endShape();
    pop();
}

