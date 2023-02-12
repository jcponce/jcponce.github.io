// Written by Juan Carlos Ponce Campuzano
// https://jcponce.github.io/

// Blob with text inspired by https://www.openprocessing.org/user/65884
// from this sketch https://www.openprocessing.org/sketch/697891

const textToWrite = "404";
const SEGMENTS = 200;

//auto start variables
let centerX, centerY, screenPct, fontSize, INNER_RADIUS, RADIUS_VARIATION;

let myFont;

function preload() {
  myFont = loadFont('font/Lacquer-Regular.ttf');
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  resetObject();
  textFont(myFont);

}

function draw() {

  background(220);
  cursor(HAND);

  textSize(fontSize);

  fill(0);
  noStroke();

  //draw blob
  beginShape();
  for (let i = 0; i < SEGMENTS; i++) {
    let p0 = pointForIndex(i / SEGMENTS);
    vertex(p0.x, p0.y);
  }
  endShape(CLOSE);

  //draw text
  let pct = atan2(mouseY - centerY, mouseX - centerX) / TWO_PI; //follow mouse
  //let pct = 0;//dont follow mouse
  let pixToAngularPct = 1 / ((INNER_RADIUS + RADIUS_VARIATION / 2) * TWO_PI);
  for (var i = 0; i < textToWrite.length; i++) {
    let charWidth = textWidth(textToWrite.charAt(i));
    pct += charWidth / 2 * pixToAngularPct;

    //calculate angle
    let leftP = pointForIndex(pct - 0.01);
    let rightP = pointForIndex(pct + 0.01);
    let angle = atan2(leftP.y - rightP.y, leftP.x - rightP.x) + PI;

    push();
    let p = pointForIndex(pct);
    //apply angle
    translate(p.x, p.y);
    rotate(angle);
    translate(-p.x, -p.y);

    text(textToWrite.charAt(i), p.x - charWidth / 2, p.y);
    pop();

    pct += charWidth / 2 * pixToAngularPct;
  } //ends for


  //Draw Eyes
  eye("LeftEye", centerX - 31, centerY, 36, 0.9);
  eye("RightEye", centerX + 31, centerY, 36, 0.9);

  push();
  textSize(130);
  fill(190);
  textAlign(CENTER, CENTER);
  text('oo', centerX, centerY - 35);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetObject();
}

function resetObject() {
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  screenPct = min(height, width) / 1000;
  fontSize = screenPct * 100;
  INNER_RADIUS = screenPct * 200;
  RADIUS_VARIATION = screenPct * 200;
}

//code adapted from @GoToLoop
//generates a circular noise with perfect looping
//https://forum.processing.org/one/topic/how-to-make-perlin-noise-loop.html
function pointForIndex(pct) {
  const NOISE_SCALE = 1.5;
  let angle = pct * TWO_PI;
  let cosAngle = cos(angle);
  let sinAngle = sin(angle);
  let time = frameCount / 100;
  let noiseValue = noise(NOISE_SCALE * cosAngle + NOISE_SCALE, NOISE_SCALE * sinAngle + NOISE_SCALE, time);
  let radius = INNER_RADIUS + RADIUS_VARIATION * noiseValue;
  return {
    x: radius * cosAngle + centerX,
    y: radius * sinAngle + centerY
  };
}

function eye(spec, xpos, ypos, size, sens) {
  name: spec;

  let xDis = width - xpos + size;
  let yDis = height - ypos + size;
  //print(xpos-size);
  //let d = dist(xpos, ypos, mouseX, mouseY);
  let upXpos = map(mouseX, -size, width + size, -(size * sens), width + size);
  let upYpos = map(mouseY, -size, height + size, -(size * 0.5 * sens), height + (size * 0.5));

  //How do you creat a circular constraint area??
  let pubXpos = constrain(upXpos, xpos - (size / 4), xpos + (size / 4));
  let pubYpos = constrain(upYpos, ypos - (size / 4), ypos + (size / 4));

  noStroke();
  fill(255);
  ellipseMode(CENTER);
  ellipse(xpos, ypos, size);

  //Pupil
  fill(0);
  ellipse(pubXpos, pubYpos, size / 3);
}