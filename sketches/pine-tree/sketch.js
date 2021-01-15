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
  branch_len = random(w/12, w/6);
  branch_angle = 55; //random (30,60);
  branch_dec = 0.67; //random (.5,.67);
  wthree = 20;
  angleMode(DEGREES);
  strokeJoin(ROUND);
  noLoop();
}

function draw() {
  stroke('rgb(38, 25, 24)');
  strokeWeight(20);
  line(width / 2, height, width / 2, height * 0.68 - branch_len)
  translate(width / 2, height * 0.68);
  branch(branch_len);
  angleMode(DEGREES);
}

function branch(len) {

  stroke_weight = map(len, 4, branch_len, 1, 20);

  strokeWeight(stroke_weight);

  stroke_green = map(len, 4, branch_len, 255, 0);
  
  /*
  https://coolors.co/474233-756d54-8b9556-abb557-bed558-c4d967
  / SCSS RGB /
  $black-olive: rgba(71, 66, 51, 1);
  $gold-fusion: rgba(117, 109, 84, 1);
  $moss-green: rgba(139, 149, 86, 1);
  $middle-green-yellow: rgba(171, 181, 87, 1);
  $june-bud: rgba(190, 213, 88, 1);
  $june-bud-2: rgba(196, 217, 103, 1);
  */

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