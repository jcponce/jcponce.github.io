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

let f = 0;

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

}




function draw(){

  // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);

    moebius();
    
    /*
    // gizmo
    strokeWeight(5);
    stroke(255, 32,  0); line(0,0,0,2,0,0);
    stroke( 32,255, 32); line(0,0,0,0,2,0);
    stroke(  0, 32,255); line(0,0,0,0,0,2);
    */
    
    
}

function moebius(){
    [2, -2, 1].map(i => spotLight(255, 255, 255, 0, -400 * i, 400 * i, 0, i, -i));

    noStroke();
	// Backdrop
	push();
	scale(1, 0.5, 1);
	translate(0, -1700);
	fill(220);
	sphere(2000, 33);
	pop();

	// Moebius strip
	rotate(PI / 2);
	rotateY(f / 450);
	fill(230, 255, 255);
	let max = 400;
	for (i = 0; i < max; i++) {
		let I = i * (PI * 2 / max);
		let J = i * (PI * 4 / max);
		push();
		rotateX(J + f/500);
		rotate(I);
		translate(sin(I) * 90, cos(I) * 90);
		cylinder(3, 80);

		// ball
		///*
		if (f % max == i) {
			translate(30, 0);
			pointLight([255], 0, 400, 0);
			pointLight([255], 0, -400, 0);
			fill('#2dcded');
			sphere(28);
		}//*/
		pop();
	}
	f++;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
}

