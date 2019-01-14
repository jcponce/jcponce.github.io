let springRate = 0.25;
let dampingFactor = 0.5;
let gravity = -0.0;
let mouseTouchRadius = 65;
let mouseSpringRate = 0.05;
let maxBalls = 150;

let clts = {
    
title: 'Collisions',
num: 50,
grav: 0.0,
damp: 0.5,
spr: 0.25,
show: false,
    
};

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
 
    
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 330});
    gui.close();
    gui.add(clts, 'title').name("Title:");
    gui.add(clts, 'num', 0, 150).name("Num. of balls").step(1);
    gui.add(clts, 'grav', -0.1, 0.1).name("Gravity").step(0.01).listen();
    gui.add(clts, 'damp', 0.01, 0.7).name("Damping").step(0.01).listen();
    gui.add(clts, 'spr', 0.01, 0.4).name("Spring").step(0.01).listen();
    gui.add(this, 'sourceCode').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    for (let i = 0; i < clts.num; i++) {
        pushRandom();
    }
    
    
}

// Make a new ball
function pushRandom() {
    let bll = new ball(); // Create a new ball
    ballArray.push(bll); // Add the new balls to the array
}

function sourceCode() {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/tree/master/sketches/collisions";
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function draw() {
  background(0);
    cursor(HAND);
  for (let i = 0; i < ballArray.length; i++) {
    for (let j = 0; j < i; j++) {
      let distance = dist(ballArray[i].x, ballArray[i].y, ballArray[j].x, ballArray[j].y);
      let touchDist = ballArray[i].diameter / 2 + ballArray[j].diameter / 2;
      if (distance < touchDist) {
        var dx = ballArray[i].x - ballArray[j].x;
        var dy = ballArray[i].y - ballArray[j].y;
        //var force = springRate * (touchDist - distance);
          var force = clts.spr * (touchDist - distance);
        dx /= distance;
        dy /= distance;
        var tfx = dx * force;
        var tfy = dy * force;
        ballArray[i].fsumx += tfx;
        ballArray[i].fsumy += tfy;
        ballArray[j].fsumx -= tfx;
        ballArray[j].fsumy -= tfy;
        var dspeedx = ballArray[i].speedx - ballArray[j].speedx;
        var dspeedy = ballArray[i].speedy - ballArray[j].speedy;
        var dotProduct = dspeedx * dx + dspeedy * dy;
        //var damping = dotProduct * dampingFactor;
        var damping = dotProduct * clts.damp;
        var sfx = dx * damping;
        var sfy = dy * damping;
        ballArray[i].fsumx -= sfx;
        ballArray[i].fsumy -= sfy;
        ballArray[j].fsumx += sfx;
        ballArray[j].fsumy += sfy;
      }
    }
  }
  for (let ball of ballArray) {
    ball.display();
    ball.move();
  }
    
    
    // Adjust the amount of balls on screen according to the slider value
    let maxBalls = clts.num;
    let difference = ballArray.length - maxBalls;
    if (difference < 0) {
        for (let i = 0; i < -difference; i++) {
            pushRandom(); // Add balls if there are less balls than the slider value
        }
    } else if (difference > 0) {
        for (let i = 0; i < difference; i++) {
            ballArray.pop(); // Remove balls if there are more balls than the slider value
        }
    }
}

class ball {

  constructor() {
    this.x = random(windowWidth);
    this.y = random(windowHeight);
    this.diameter = random(10, 30);
    let speed = 1;
    let dir = random(0, 2 * PI);
    this.speedx = speed * cos(dir);
    this.speedy = speed * sin(dir);
    this.fsumx = 0;
    this.fsumy = 0;
    this.red = 5;
    this.green = 200;
    this.blue = 250;
    
  }

  move() {
    if (mouseIsPressed) {
      var distance = dist(this.x, this.y, mouseX, mouseY);
      var touchDist = mouseTouchRadius;
      if (distance < touchDist) {
          
        var dx = this.x - mouseX;
        var dy = this.y - mouseY;
        var force = mouseSpringRate * (touchDist - distance);
        dx /= distance;
        dy /= distance;
        var tfx = dx * force;
        var tfy = dy * force;
        this.fsumx += tfx;
        this.fsumy += tfy;
      }
    }
    if (this.x < this.diameter / 2) {
      this.fsumx -= clts.spr * (this.x - this.diameter / 2);
    }
    if (this.y < this.diameter / 2) {
      this.fsumy -= clts.spr * (this.y - this.diameter / 2);
    }
    if (this.x > windowWidth - this.diameter / 2) {
      this.fsumx -= clts.spr * (this.x - (windowWidth - this.diameter / 2));
    }
    if (this.y > windowHeight - this.diameter / 2) {
      this.fsumy -= clts.spr * (this.y - (windowHeight - this.diameter / 2));
      this.fsumy -= this.speedy * 0.01;
    }
    this.speedx += this.fsumx;
    this.speedy += this.fsumy;
    this.fsumx = 0;
    this.fsumy = clts.grav;
    this.x += this.speedx;
    this.y += this.speedy;
  }

  display() {
    var colorShift = 200 * mag(this.fsumx, this.fsumy);
    fill(this.red, this.green - colorShift, this.blue - colorShift, 255);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

}
