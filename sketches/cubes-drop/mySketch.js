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

Original sketch by KomaTebe
https://openprocessing.org/user/281256

Source:
https://openprocessing.org/sketch/1605344

In this version I used the p5easycam and modified a little the colors 
and moebius stripe :)

*/

let easycam;

let inflag = false;
let firstX, firstY;
let angleXtoRotate = 0, angleYtoRotate = 0, oldXAngle = 0, oldYAngle = 0;

let blocks;

function setup() {
	
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    //console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {
        distance : 400,
        //viewport : [1, 1, 0, 1],   
        //rotation: [1, 1, 0, 0]
    });

	colorMode(HSB);
  blocks = [];
  rectMode(CENTER);
  smooth();

}




function draw(){

  // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);

    rotateX(PI / 3);
    rotateZ(frameCount * 0.000001);
  
    rotateY(oldYAngle+angleYtoRotate);
    rotateX(oldXAngle+angleXtoRotate);
 
    
  
  	//fill(199, 159, 185);  //pink bottom plate
  	//noStroke();
 	//rect(0, 0, width, height);
  	//fill(102, 102, 255, 120);
  	//stroke(5);
	// lights
	ambientLight(100);
	pointLight(255, 255, 255, -100, 0, 200);
  	let nextBlocks = [];
 	 for(let block of blocks){
   	 block.display();
    	block.update();
    	if(!block.isDisappeared()){
     	 nextBlocks.push(block);
    	}
  	}
  	blocks = nextBlocks;
  	if(random(1) < 0.5){
  	  blocks.push(new Block());
  	}
    
    /*
    // gizmo
    strokeWeight(5);
    stroke(255, 32,  0); line(0,0,0,200,0,0);
    stroke( 32,255, 32); line(0,0,0,0,200,0);
    stroke(  0, 32,255); line(0,0,0,0,0,200);
    */
    
    
}

class Block{
	constructor(){
	  this.value = -0.9; //This variable stablishes where the cubes start to show
	  this.radian = random(TWO_PI);
	  this.clr = random(200,300);
	}
	
	update(){
	  this.value += 0.003; //*Speed of translation
	  this.radian += PI / 190; //*Rotation speed
	}
	
	display(){
	  let h = map(this.value, 0, 1, 0, 160);
	  let size = map(this.value, 0, 1, 20, 0);
	  let radious = map(pow(this.value,2), 0, 1, 110, 0);
	  //*The variable "radious" stablishes the shape of the rotation. 
	  //*Change the operation: "pow(this.value,2)". For example: "sin(4*this.value)" or "exp(this.value)", and see what happens...
	  push();
	  noStroke();
	  translate(radious * sin(this.radian), radious * cos(this.radian), h);
	  stroke(1);
	  ambientMaterial(this.clr,215,305);
	  box(size);
	  pop();  
	} 
	
	isDisappeared(){
	  return this.value > 1.0;
	}
  }
  

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
}

