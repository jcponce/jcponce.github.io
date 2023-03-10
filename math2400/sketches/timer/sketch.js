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
let b1, b2, b3, b4, b5, b6, b7, b8, b9; // Buttons



function setup() {
  createCanvas(400, 400);
  //surface.setResizable(true);
  frameRate(60);
  b1 = new Button(width/2-50-72, height-60, 70, 50, "<");
  b2 = new Button(width/2-50+103, height-60, 70, 50, ">");
  b3 = new Button(width/2-50-145, height-60, 70, 50, "<<");
  b4 = new Button(width/2-50+175, height-60, 70, 50, ">>");
  b5 = new Button(width/2-50, height-60, 100, 50, "START");
  b6 = new Button(width/2-50, height-60, 50, 50, "PAUSE");
  b7 = new Button(width/2-50+50, height-60, 50, 50, "STOP");
  b8 = new Button(10, 10, 50, 40, "DARK");
  b9 = new Button(10, 60, 50, 40, "Reset");
  textFont("Century Gothic Bold", 20);
  //print(PFont.list());
  
  
}


function draw() {
  
  if (darkmode) {
    background(25);
    stroke(210);
    fill(215);
  } else {
    background(245);
    stroke(25);
    fill(35);
  }
  
  push();
  strokeWeight(10);
  //fill(10,0)
  noFill();
  arc(width/2, height/2, 200, 200, -PI/2, (timer/(maxtimer+0.001)) * (PI*2)-PI/2);
  pop();
  
  
  push();
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  textSize(30);
  let h = hour();
  let m = minute();
  let max60 = floor(maxtimer/60);
  text(h + ":" + m, width/2, 50);
  pop();
  
  push();
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  let minstoshow = floor(timer/3600);
  let secstoshow = floor(timer/60) % 60;
  textSize(40);
  text(minstoshow + ":" + ((secstoshow < 10)?"0":"") + secstoshow, width/2, height/2-5);
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
  b9.draw();
 
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

  if(b9.touch){
    if(timeron == 0 || timeron == 1 || timeron == 2){
      timer = 3600;
      maxtimer = 3600;
      timeron = 0;
      return;
    }
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
      strokeWeight(3);
      stroke(200);
      if (this.touch) {
        strokeWeight(4);
        stroke(100);
      }
    } else {
      strokeWeight(3);
      stroke(125);
      if (this.touch) {
        strokeWeight(4);
        stroke(25);
      }
    }
    
    //strokeWeight(3);
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