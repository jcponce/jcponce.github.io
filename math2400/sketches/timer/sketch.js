/*
Original sketch
https://openprocessing.org/sketch/1185735
by Ayato Coding
https://openprocessing.org/user/233051?view=sketches&o=39

This is a p5js version.
*/

let timer = 3600;
let maxtimer = 3600;
let timeron = 0;
let darkmode = false;
let b1, b2, b3, b4, b5, b6, b7, b8; // Buttons



function setup() {
  createCanvas(400, 400);
  //surface.setResizable(true);
  frameRate(60);
  b1 = new Button(width/2-50-70, height-60, 70, 50, "<");
  b2 = new Button(width/2-50+100, height-60, 70, 50, ">");
  b3 = new Button(width/2-50-140, height-60, 70, 50, "<<");
  b4 = new Button(width/2-50+170, height-60, 70, 50, ">>");
  b5 = new Button(width/2-50, height-60, 100, 50, "START");
  b6 = new Button(width/2-50, height-60, 50, 50, "PAUSE");
  b7 = new Button(width/2-50+50, height-60, 50, 50, "STOP");
  b8 = new Button(10, 10, 50, 50, "DARK\nMODE");
  textFont("Century Gothic Bold", 20);
  //print(PFont.list());
  
  centerX = width / 2;
  centerY = height / 2;
  screenPct = min(height, width) / 1000;
  fontSize = screenPct * 100;
  INNER_RADIUS = screenPct * 200;
  RADIUS_VARIATION = screenPct * 200;
}


function draw() {
  if (darkmode) {
    background(25);
    stroke(245);
    fill(245);
  } else {
    background(245);
    stroke(25);
    fill(25);
  }
  
  push();
  strokeWeight(5);
  noFill();
  arc(width/2, height/2, 200, 200, 0, (timer/(maxtimer+0.001)) * (PI*2));
  pop();
  
  

  
  push();
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  textSize(30);
  let max60 = floor(maxtimer/60);
  text(max60 + " Second Timer", width/2, 50);
  pop();
  
  push();
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  let minstoshow = floor(timer/3600);
  let secstoshow = floor(timer/60) % 60;
  textSize(40);
  text(minstoshow + ":" + ((secstoshow < 10)?"0":"") + secstoshow, width/2, height/2-10);
  pop();
  
 
  b1.draw();
  b2.draw();
  b3.draw();
  b4.draw();
  if (timeron == 2) {
    b6.draw();
    b7.draw();
  }
  if (timeron == 1) {
    b6.draw();
    b7.draw();
    timer -=1;
    if (timer <= 0) {
      timer = maxtimer;
      timeron = 0;
    }
  }
  if (timeron == 0) {
    b5.draw();
    timer = maxtimer;
  }
  b8.message = (darkmode) ? "LIGHT" : "DARK";
  b8.draw();
 
}

function mouseClicked(){
  if(b1.touch && maxtimer-60 > 0){ maxtimer -=60;}
  if(b2.touch){ maxtimer +=60;}
  if(b3.touch && maxtimer-3600 > 0){ maxtimer -=3600;}
  if(b4.touch){ maxtimer +=3600;}
  if(b5.touch){ 
    if(timeron == 0){
      timer = maxtimer;
      timeron = 1;
      return;
    }
  }
  if(b6.touch){ 
    if(timeron == 1){
      timeron = 2;
      b6.message = "START";
      return;
    }
    if(timeron == 2){
      timeron = 1;
      b6.message = "PAUSE";
      return;
    }
  }
  if(b7.touch){ 
    if(timeron == 1 || timeron == 2){
      timer = maxtimer;
      timeron = 0;
      return;
    }
  }
  if(b8.touch){
    darkmode = !darkmode;
    return;
  }
}



class Button {
  constructor(xx, yy, ww, hh, m) {
    this.x = xx;
    this.y = yy;
    this.w = ww;
    this.h = hh;
    this.ox = xx - width / 2;
    this.oy = yy - height / 2;
    this.message = m;
    this.touch = false;
  }

  draw() {
    
    this.x = this.ox + width / 2;
    this.y = this.oy + height / 2;
    this.touch = false;
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.touch = true;
    }
    noFill();
    if (darkmode) {
      stroke(245);
      if (this.touch) {
        stroke(200);
      }
    } else {
      stroke(85);
      if (this.touch) {
        stroke(25);
      }
    }
    
    strokeWeight(3);
    rect(this.x, this.y, this.w, this.h, 2);
    if (darkmode) {
      fill(245);
    } else {
      fill(25);
    }
    strokeWeight(1);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.message, this.x + this.w / 2, this.y + this.h / 2 - 5);
    
  }
  
}




/*
int timer = 3600;
int maxtimer = 3600;
float PI = 3.14159;
int timeron = 0;
boolean darkmode = false;
Button b1;
Button b2;
Button b3;
Button b4;
Button b5; //start button
Button b6; //pause
Button b7; //stop
Button b8; //darkmode
void setup(){
  size(600, 600);
  //surface.setResizable(true);
  frameRate(60);
  b1 = new Button(width/2-50-120, height-100, 100, 50, "<");
  b2 = new Button(width/2-50+120, height-100, 100, 50, ">");
  b3 = new Button(width/2-50-240, height-100, 100, 50, "<<");
  b4 = new Button(width/2-50+240, height-100, 100, 50, ">>");
  b5 = new Button(width/2-50, height-100, 100, 50, "START");
  b6 = new Button(width/2-50, height-100, 50, 50, "PAUSE");
  b7 = new Button(width/2-50+50, height-100, 50, 50, "STOP");
  b8 = new Button(10, 10, 50, 50, "DARK\nMODE");
  textFont(createFont("Century Gothic Bold", 20));
  //println(PFont.list());
}
void draw(){
  if(darkmode){
    background(25);
  }
  else{
    background(245);
  }
  strokeWeight(5);
  if(darkmode){
    stroke(245);
  }
  else{
    stroke(25);
  }
  noFill();
  arc(width/2, height/2, 300, 300, 0, (timer/(maxtimer+0.001)) * (PI*2));
  noStroke();
  if(darkmode){
    fill(245);
  }
  else{
    fill(25);
  }
  textAlign(CENTER, CENTER);
  textSize(30);
  int max60 = maxtimer/60;
  text(max60 + " Second Timer", width/2, 50);  
  int minstoshow = floor(timer/3600);
  int secstoshow = floor(timer/60)%60;
  textSize(40);
  text(minstoshow + ":" + ((secstoshow < 10)?"0":"") + secstoshow, width/2, height/2-10);
  b1.draw();
  b2.draw();
  b3.draw();
  b4.draw();
  if(timeron == 2){
    b6.draw();
    b7.draw();
  }
  if(timeron == 1){
    b6.draw();
    b7.draw();
    timer -=1;
    if(timer <= 0){
      timer = maxtimer;
      timeron = 0;
    }
  }
  if(timeron == 0){
    b5.draw();
    timer = maxtimer;
  }
  if(darkmode){
    b8.message = "LIGHT";
  }
  else{
    b8.message = "DARK";
  }
  b8.draw();
}
void mouseClicked(){
  if(b1.touch && maxtimer-60 > 0){ maxtimer -=60;}
  if(b2.touch){ maxtimer +=60;}
  if(b3.touch && maxtimer-3600 > 0){ maxtimer -=3600;}
  if(b4.touch){ maxtimer +=3600;}
  if(b5.touch){ 
    if(timeron == 0){
      timer = maxtimer;
      timeron = 1;
      return;
    }
  }
  if(b6.touch){ 
    if(timeron == 1){
      timeron = 2;
      b6.message = "START";
      return;
    }
    if(timeron == 2){
      timeron = 1;
      b6.message = "PAUSE";
      return;
    }
  }
  if(b7.touch){ 
    if(timeron == 1 || timeron == 2){
      timer = maxtimer;
      timeron = 0;
      return;
    }
  }
  if(b8.touch){
    darkmode = !darkmode;
    return;
  }
}
class Button {
  float x;
  float y;
  float w;
  float h;
  float ox;
  float oy;
  String message;
  boolean touch = false;
  Button(float xx, float yy, float ww, float hh, String m){
    x = xx;
    y = yy;
    w = ww;
    h = hh;
    ox = xx-width/2;
    oy = yy-height/2;
    message = m;
  }
  void draw(){
    x = ox+width/2;
    y = oy+height/2;
    touch = false;
    if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h){
      touch = true;
    }
    noFill();
    if(darkmode){
      stroke(245);
      if(touch){ stroke(200);}
    }
    else{
      stroke(85);
      if(touch){ stroke(25);}
    }
    strokeWeight(3);
    rect(x, y, w, h, 2);
    if(darkmode){
      fill(245);
    }
    else{
      fill(25);
    }
    textSize(16);
    textAlign(CENTER, CENTER);
    text(message, x+w/2, y+h/2-5);
  }
}
*/
