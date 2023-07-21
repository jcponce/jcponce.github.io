let numMax = 200;
let appleArray = []; 

let gravity = 0.55;
let friction = 0.32;

let currentBall = 0;

function preload() {
  // preload() runs once
  img = loadImage('green-apple.png');
}

let c;

let imgWidth;
let imgHeight;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  img.loadPixels();
  // get color of middle pixel
  c = img.get(img.width / 2, img.height / 2);

  cursor('pointer');
}

function draw() {
  background(179, 217, 255);
  
  strokeWeight(2);
  stroke(0);
  fill(191, 128, 64);
  rect(0, height-70, width, height - 70)

  fill(255, 10);
  rect(0, 0, width - 0.5, height - 0.5);

  for (var i = appleArray.length - 1; i >= 0; i -= 1) {
    var p = appleArray[i];
    p.update();
    p.display();
    //if (p.x > 600 || p.y > 0 || p.x < 0 || p.y < 400) {
    //  appleArray.splice(i, 1);
    //  currentBall--;
    //}
  }
}

function mousePressed() {
  let radius = 1;
  let x = mouseX;
  let y = mouseY;
  let dx = (0, 0);
  let dy = (0, 0);
  appleArray[currentBall] = new Ball(x, y, dx, dy);
  currentBall++;
  if (currentBall >= numMax) {
    currentBall = 0;
  }
}

function touchStarted() {
  let radius = 1;
  let x = mouseX;
  let y = mouseY;
  let dx = (0, 0);
  let dy = (0, 0);
  appleArray[currentBall] = new Ball(x, y, dx, dy);
  currentBall++;
  if (currentBall >= numMax) {
    currentBall = 0;
  }
}

// Object
function Ball(x, y, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.size = 0.35;

  this.update = function () {
    if (
      this.y + this.size * img.height  > height || this.y +
      this.dy + this.size * img.height  <= -400
    ) {
      this.dy = -this.dy;
      this.dy = this.dy * friction;
      this.dx = this.dx * friction;
    } else {
      this.dy += gravity;
    }

    if (this.x  >= width || this.x  <= 0) {
      this.dx = -this.dx * friction;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.display();
  };

  this.display = function () {
    let size = 0.3;
    let cx = img.width/2 * size; 
    let cy = img.height/2 * size;
    let dx = img.width * size; 
    let dy = img.height * size; 
    image(img, this.x - cx, this.y - cy , dx, dy);
  };
}
