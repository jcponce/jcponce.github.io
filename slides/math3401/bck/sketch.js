var dots = [];
var count = 60;
var noiseval = 0.01;


function setup() {
  createCanvas(windowWidth, windowHeight);

  pointinit();
  for (var i = 0; i < count; i++) {
    dots[i].initMe();
  }


}

function draw() {
  background(255);
  for (var i = 0; i < count; i++) {
    dots[i].drawMe();
    dots[i].updateMe();
  }
}

function pointinit() {
  for (var i = 0; i < count; i++) {
    dots[i] = new SnowObj();
  }
}

function SnowObj() {
  var x, y;
  var sizeScale, sz, g, blue;
  var rotAngle;
  var rotSpeed;
  var speed, xnoise;
  var imgCol;
}

SnowObj.prototype.initMe = function() {
  this.x = random(0, width);
  this.y = random(0, height);
  this.imgCol = floor(random(0, 3));
  this.sizeScale = random(0.05, 0.3);
  this.rotAngle = 0;
  this.rotSpeed = random(-3, 3);
  this.speed = random(0.5, 2);
  this.xnoise = random(100);
  this.sz = random(9, 50);
  this.a = Math.round(random(3, 12));
  this.b = Math.round(random(3, 12));
  this.red = random(90,90);
  this.green = random(160, 255);
  this.blue = random(200, 255);
}

SnowObj.prototype.updateMe = function() {
  this.x = this.x + noise(this.xnoise) * 2 - 1;
  this.xnoise = this.xnoise + noiseval;
  this.y = this.y + this.speed;
  if (this.y > height + 100) {
    this.initMe();
    this.y = -100;
  }
  this.rotAngle += this.rotSpeed;
}

SnowObj.prototype.drawMe = function() {
  push();
  translate(this.x, this.y);
  rotate(radians(this.rotAngle));
  scale(this.sizeScale, this.sizeScale);
  stroke(this.red, this.green, this.blue);
  strokeWeight(0.9);
  noFill();
  beginShape();
  for (let i = 0; i <= 360; i++) {
    let nextx, nexty;
    nextx = this.sz * (cos(1.0 * this.a * i) + pow(cos(1.0 * this.b * i), 2)) * cos(i);
    nexty = this.sz * (cos(1.0 * this.a * i) + pow(cos(1.0 * this.b * i), 2)) * sin(i);
    vertex(nextx, nexty);
  }
  endShape();
  pop();
}