// Written in p5.js (https://p5js.org/)
// Under Creative Commons License
// https://creativecommons.org/licenses/by-sa/4.0/
// Title: Collatz Sea Tree
// Author: Juan Carlos Ponce Campuzano, @PonceCampuzano
// Created: Oct. 29, 2019
// Web editor: https://editor.p5js.org/jcponce/sketches/vh0HVREJH
//
// Forked from:
//   https://editor.p5js.org/codingtrain/sketches/XjLDE7gu6
//   by Daniel Shiffman
//   https://thecodingtrain.com/CodingInTheCabana/002-collatz-conjecture.html
//   https://youtu.be/EYLWxwo1Ed8

let start = 1;
let reset = start;
let angle;
let inc = 300;
let len, sw;

let colRed, colBlue, colGreen;
let message = true;

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0);
  colorMode(RGB, 1, 1, 1, 1);

  let minDimension = min(width, height)

  sw = map(minDimension, 300, 1000, 2, 7);
  strokeWeight(sw);

  len = map(minDimension, 300, 1000, 3, 8);

  angle = random(-0.25, 0.25);

  colRed = random(0, 1);
  //colBlue = random(0, 1);
  colGreen = random(0, 1);
  
  cursor(HAND);
    
    document.getElementById("save").onclick = () => {
        saveTree();
    }

}

function draw() {
  if (message) {
    fill(0);
    noStroke();
    rect(0, 0, width, height * 0.25);
    textSize(24);
    fill(255);
    textAlign(CENTER);
    noStroke();
    text("Click mouse to toggle", width / 2, height * 0.2);
  }
  drawMyplant();

}

function collatz(n) {
  // even
  if (n % 2 == 0) {
    return n / 2;
    // odd
  } else {
    return (n * 3 + 1) / 2;
  }
}
let sequence;

function drawMyplant() {
  sequence = [];
  let n = start;
  do {
    sequence.push(n);
    n = collatz(n);
  } while (n != 1);
  sequence.push(1);
  sequence.reverse();

  resetMatrix();
  translate(width / 2, height);
  for (let j = 0; j < sequence.length; j++) {
    let value = sequence[j];
    if (value % 2 == 0) {
      rotate(angle);
    } else {
      rotate(-angle);
    }
    stroke(colRed, j / sequence.length, colGreen, 0.07);
    let w = map(j / sequence.length, 0, 1, 15, 0.5)
    strokeWeight(w);
    line(0, 0, 0, -len);
    translate(0, -len);
  }
  start += inc;

  // reset the starting number before it gets too large
  if (start > 50000) {
    reset++
    start = reset
  }

  if (mouseIsPressed && mouseY > 45) {
    if(mouseButton == LEFT){
      background(0);
    }
  }
}
                
function touchStarted() {
  if(mouseButton == LEFT && mouseY > 45){
    message = false;
    angle = random(-0.25, 0.25);
    colRed = random(0, 1);
    //colBlue = random(0, 1);
    colGreen = random(0, 1);
    sequence.length = 0;
  }
}

function mousePressed() {
  if(mouseButton == LEFT && mouseY > 45){
    message = false;
    angle = random(-0.25, 0.25);
    colRed = random(0, 1);
    //colBlue = random(0, 1);
    colGreen = random(0, 1);
    sequence.length = 0;
  }
}
                
            
function saveTree(){
    save('collatz.png');
}
