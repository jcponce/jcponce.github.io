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

Based on Daniel Shiffman' 4D Hypercube
http://youtube.com/thecodingtrain
http://codingtra.in
JavaScript transcription: Chuck England

Coding Challenge #113: 4D Hypercube
https://youtu.be/XE3YDVdQSPo

Matrix Multiplication
https://youtu.be/tzsgS19RRc8

This version uses p5easycam
Juan Carlos Ponce Campuzano
15/12/2023

*/

let easycam;

let angle = 0;

let points = [];

function setup() {
  pixelDensity(1);

  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("antialias", true);

  //console.log(Dw.EasyCam.INFO);

  easycam = new Dw.EasyCam(this._renderer, { distance: 450 });

  points[0] = new P4Vector(-1, -1, -1, 1);
  points[1] = new P4Vector(1, -1, -1, 1);
  points[2] = new P4Vector(1, 1, -1, 1);
  points[3] = new P4Vector(-1, 1, -1, 1);
  points[4] = new P4Vector(-1, -1, 1, 1);
  points[5] = new P4Vector(1, -1, 1, 1);
  points[6] = new P4Vector(1, 1, 1, 1);
  points[7] = new P4Vector(-1, 1, 1, 1);
  points[8] = new P4Vector(-1, -1, -1, -1);
  points[9] = new P4Vector(1, -1, -1, -1);
  points[10] = new P4Vector(1, 1, -1, -1);
  points[11] = new P4Vector(-1, 1, -1, -1);
  points[12] = new P4Vector(-1, -1, 1, -1);
  points[13] = new P4Vector(1, -1, 1, -1);
  points[14] = new P4Vector(1, 1, 1, -1);
  points[15] = new P4Vector(-1, 1, 1, -1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]);
}

function draw() {
  // projection
  perspective((60 * PI) / 180, width / height, 1, 5000);

  // BG
  background(0);

  noStroke();
  ambientLight(60, 60, 60);
  pointLight(255, 255, 255, 0, 0, 100);
  rotateX(-PI / 2);
  let projected3d = [];

  for (let i = 0; i < points.length; i++) {
    const v = points[i];

    const rotationXY = [
      [cos(angle), -sin(angle), 0, 0],
      [sin(angle), cos(angle), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const rotationZW = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, cos(angle), -sin(angle)],
      [0, 0, sin(angle), cos(angle)],
    ];

    let rotated = matmul(rotationXY, v);
    rotated = matmul(rotationZW, rotated);

    let distance = 2;
    let w = 1 / (distance - rotated.w);

    const projection = [
      [w, 0, 0, 0],
      [0, w, 0, 0],
      [0, 0, w, 0],
    ];

    let projected = matmul(projection, rotated);
    projected.mult(width / 8);
    projected3d[i] = projected;

    //stroke(255, 200);
    //strokeWeight(0);
    //noFill();

    //point(projected.x, projected.y, projected.z);
    push();
    translate(projected.x, projected.y, projected.z);
    ambientMaterial(250);
    sphere(8);
    pop();
  }

  // Connecting
  for (let i = 0; i < 4; i++) {
    edge(0, i, (i + 1) % 4, projected3d);
    edge(0, i + 4, ((i + 1) % 4) + 4, projected3d);
    edge(0, i, i + 4, projected3d);
  }

  for (let i = 0; i < 4; i++) {
    edge(8, i, (i + 1) % 4, projected3d);
    edge(8, i + 4, ((i + 1) % 4) + 4, projected3d);
    edge(8, i, i + 4, projected3d);
  }

  for (let i = 0; i < 8; i++) {
    edge(0, i, i + 8, projected3d);
  }

  //angle = map(mouseX, 0, width, 0, TWO_PI);
  angle += 0.0072;

  /*
    // gizmo
    strokeWeight(5);
    stroke(255, 32,  0); line(0,0,0,2,0,0);
    stroke( 32,255, 32); line(0,0,0,0,2,0);
    stroke(  0, 32,255); line(0,0,0,0,0,2);
	*/
}

function edge(offset, i, j, points) {
  strokeWeight(3);
  stroke(255);
  const a = points[i + offset];
  const b = points[j + offset];
  line(a.x, a.y, a.z, b.x, b.y, b.z);
}
