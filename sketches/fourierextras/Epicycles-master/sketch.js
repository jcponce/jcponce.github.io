// While drawing shape you can only draw a single loop. if mouse is lifted to draw seperately it will join to previous point. and if drawing is completed the start and end points are joined to make it a closed loop.

var points = []; // The points we draw.. stored as p5.Vector
var canDraw = true; // After hitting start button, to prevent mouseDragged creating extra points
var coeff = {}; // The main object which carries data of { key = angular speed of circle, value = complex number as p5.Vector | which gives size and starting angle of circle => radius = value.mag() and starting angle = value.heading() }
var maxCircles = 100; // this value changes how many circles you want to see on screen. If maxCircles = 100 you will see circles with angular speed -50 to 50 excluding 0.
// maxCircles can be adjusted by circlesSlider (NOTE: maxCircles will only take even value so if circlesSlider is odd it will take circlesSlider.value()+1)

// There are three phases of draws in this program
// 1) the phase where you will give your shape
// 2) the phase where we try to fit the shape by increasing number of circles
// 3) the phase where epicycles try to draw the shape and this phase continues till termination
var drawCounter = 0; // drawCounter indicates the phase you are in (0-indexed)
var animResol = 500; // animResol = number of frames the second phase will stay. You can change it accordingly
var animFram = 0; // animFram keeps count of number of frames passed in second phase
var revolveResol = 1000; // revolveResol = number of frames the third phase will stay. You can change it accordingly
var revolveFrame = 0; // revolveFrame keeps count of number of frames passed in third phase
var ansPoints = {}; // used to draw second phase. This carries data of shapes formed by different number of circles { key = n | circles with angular speed -n to n are used to form shape, value = shape stored in form of array of p5.Vector }.
var cirGr; // cirGr is 'circlesGroup' object which consists of data regarding circles that are drawn in third phase
var previewResol = 300; // This is used in second phase. previewResol = number of points to be shown in the loop in second phase. so ansPoints[i].length = previewResol

function setup() {
  createCanvas(600, 400);
  button = createButton("Start");
  button.position(250, 420);
  button.mousePressed(calcAndStart);
  reset = createButton("Reset");
  reset.position(350, 420);
  reset.mousePressed(ResetAll);
  circlesSlider = createSlider(1, 2 * maxCircles, maxCircles);
  circlesSlider.position(10, 420);
  infoLabel = createElement("label", "Draw a single loop inside canvas");
  infoLabel.position(350, 10);
  var sv = circlesSlider.value();
  sliderLabel = createElement(
    "label",
    "Number of circles = " + (sv + (sv % 2)).toString()
  );
  sliderLabel.position(10, 450);
}

// Resets all parameters and clears screen
function ResetAll() {
  points = [];
  canDraw = true;
  coeff = {};
  maxCircles = 100;
  drawCounter = 0;
  animFram = 0;
  revolveFrame = 0;
  ansPoints = {};
  cirGr = null;
  infoLabel.html("Draw a single loop inside canvas");
}

// can only draw shape in first phase and within boundary of canvas (with a offset of 10 pixels)
function mouseDragged() {
  if (canDraw)
    if (
      mouseX < width - 10 &&
      mouseY < height - 10 &&
      mouseX > 10 &&
      mouseY > 10
    )
      points.push(createVector(mouseX, mouseY));
}

// clicking start button starts this method
function calcAndStart() {
  var sv = circlesSlider.value();
  if (canDraw) {
    // if first time pressed
    animFram = 0;
    revolveFrame = 0;
    points.push(points[0]);
    maxCircles = sv + (sv % 2); // maxCircles should only contain even numbers
    canDraw = false;
    calcAllCoeff();
    finalShapeCalc();
    console.log(points.length);
    console.log("Calculated");
    drawCounter = 1;
    cirGr = new circlesGroup(coeff);
  } else if (maxCircles != sv && maxCircles != sv + 1) {
    animFram = 0;
    revolveFrame = 0;
    maxCircles = sv + (sv % 2); // maxCircles should only contain even numbers
    calcAllCoeff();
    finalShapeCalc();
    drawCounter = 1;
    cirGr = new circlesGroup(coeff);
  }
}

// used to calculate complex coefficients for respective angular speeds of circles
function calcAllCoeff() {
  var n = maxCircles / 2;
  coeff = {};
  for (i = -1 * n; i <= n; ++i) {
    coeff[i] = calcCoeff(i);
  }
}

// used to calculate ansPoints object for second phase
function finalShapeCalc() {
  ansPoints = {};
  for (var i = 0; i <= maxCircles / 2; ++i) {
    ansPoints[i] = [];
    for (var j = 0; j < previewResol; ++j) {
      var x = map(j, 0, previewResol, -1 * Math.PI, Math.PI);
      var cn = coeff[i];
      var cs = createVector(Math.cos(i * x), Math.sin(i * x));
      var vec = complexMult(cn, cs);
      if (i != 0) {
        vec.add(ansPoints[i - 1][j]);
        cn = coeff[-1 * i];
        cs = createVector(Math.cos(i * x), Math.sin(-1 * i * x));
        vec.add(complexMult(cn, cs));
      }
      ansPoints[i].push(vec);
    }
    ansPoints[i].push(ansPoints[i][0]);
  }
}

// Fourier series implementation to get complex coefficient for a angular speed
function calcCoeff(n) {
  var ans = createVector(0, 0);
  for (var i = 0; i < points.length - 1; ++i) {
    ans.add(integrateLine(i, n));
  }
  return ans;
}

// as complex numbers stored in p5.Vector this function gives complex multiplication of two p5.Vectors
function complexMult(v1, v2) {
  var a = v1.x;
  var b = v1.y;
  var c = v2.x;
  var d = v2.y;
  return createVector(a * c - b * d, b * c + a * d);
}

// Fourier stuff.. formula implementation
function integrateLine(pos, n) {
  var ll = map(pos, 0, points.length - 1, -1 * Math.PI, Math.PI);
  var ul = map(pos + 1, 0, points.length - 1, -1 * Math.PI, Math.PI);
  var ans = createVector(0, 0);
  for (var i = 0; i < 10; i++) {
    var x = map(i, 0, 10, ll, ul);
    var cs = createVector(Math.cos(n * x), Math.sin(-1 * n * x));
    var midvec = p5.Vector.lerp(points[pos], points[pos + 1], i / 10);
    ans.add(complexMult(midvec, cs));
  }
  ans.div(points.length - 1);
  ans.div(10);
  return ans;
}

// always draw the points array.. throughout all phases
function alwaysDraw() {
  noFill();
  stroke(0);
  strokeWeight(1);
  beginShape();
  for (var i = 0; i < points.length; ++i) {
    vertex(points[i].x, points[i].y);
  }
  endShape();
}

// phase 2 drawing..
function drawAnim() {
  stroke(255, 0, 0);
  strokeWeight(1);
  beginShape();
  var curr = map(animFram, 0, animResol, 0, maxCircles / 2);
  var left = Math.floor(curr);
  var right = left + 1;
  for (var i = 0; i <= previewResol; ++i) {
    var temp = p5.Vector.lerp(
      ansPoints[left][i],
      ansPoints[right][i],
      curr - left
    );
    vertex(temp.x, temp.y);
  }
  endShape();
  animFram++;
  infoLabel.html("Showing Frames " + animFram + "/" + animResol);
  if (animFram == animResol) {
    drawCounter++;
  }
}

function draw() {
  background(220);
  alwaysDraw();
  var sv = circlesSlider.value();
  sliderLabel.html("Number of circles = " + (sv + (sv % 2)).toString());
  if (drawCounter == 1) {
    drawAnim();
  }
  if (drawCounter == 2) {
    cirGr.update();
    cirGr.show();
    revolveFrame++;
    infoLabel.html("Showing Frames " + revolveFrame + "/" + revolveResol);
    if (revolveFrame == revolveResol + 20) {
      revolveFrame = 0;
      cirGr = new circlesGroup(coeff);
    }
  }
}
