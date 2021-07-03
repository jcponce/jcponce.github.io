/*
 Fractal pine
 Juan Carlos Ponce Campuzano
 15 Jan 2020
*/

let branch_len;
let branch_angle;
let branch_dec; //decrement factor for subsequent branches
let wtree;

function setup() {
  let w = windowWidth;
  let h = windowHeight;
  createCanvas(w, h);
  background(500);
  branch_len = random(w / 12, w / 6);
  branch_angle = 55; //random (30,60);
  branch_dec = 0.67; //random (.5,.67);
  wthree = 20;
  angleMode(DEGREES);
  strokeJoin(ROUND);
  noLoop();
}

function draw() {
  
  let sc = 0.68;

  push();
  stroke('rgb(38, 25, 24)');
  strokeWeight(20);
  line(width / 2, height, width / 2, height * sc - branch_len)
  pop();

  translate(width / 2, height * sc);
  branch(branch_len);
  
}

function branch(len) {

  stroke_weight = map(len, 4, branch_len, 1, 20);
  strokeWeight(stroke_weight);
  stroke_green = map(len, 4, branch_len, 255, 0);
  
  stroke('rgb(38, 25, 24)');
  if (len < 100) {
    stroke('rgb(54, 41, 33)');
  }
  if (len < 50) {
    stroke('rgb(69, 57, 41)');
  }
  if (len < 20) {
    stroke('rgb(85, 128, 39)');
  }
  if (len < 12) {
    stroke('rgb(84, 130, 38)');
  }
  if (len === 6) {
    stroke('rgb(83, 132, 37)');
  }

  line(0, 0, 0, -len);

  translate(0, -len);
  if (len > 5) {

    push();
    let a1 = 0.55
    rotate(branch_angle * random(-a1, a1));
    branch(len * branch_dec);
    pop();

    push();
    rotate(branch_angle);
    branch(len * branch_dec);
    pop();

    push();
    rotate(-branch_angle);
    branch(len * branch_dec)
    pop();
  }

}