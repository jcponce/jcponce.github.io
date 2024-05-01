let slopefield;
let megaLines = true;
let size = 3; // Density
let showLines;

function setup() {
  createCanvas(480, 480);
  colorMode(HSB, 255);
  slopefield = createGraphics(width, height);
  createBWSlopefield();
  cursor(HAND);
  showLines = false;
}

function draw() {
  //background(255);
  //draw slopefield
  image(slopefield, 0, 0);

  //draw individual slope line
  //drawSlopeLine();

  //draw slopefield
  drawSlopeField();

  //draw solution curve using Euler's method
  if (showLines) eulerMethod();
}

function slopefn(x, y) {
  return -y*(y-1.5)*(y+1.5);
}

function eulerMethod() {
  for (let offset = -50; offset <= 50; offset += 20) {
    let dt = 0.01;
    let mx = map(mouseX, 0, width, -size, size);
    let my = map(mouseY + offset, height, 0, -size, size);

    let m;

    let h;

    //step forward

    strokeWeight(2);

    let old = new p5.Vector(mouseX, mouseY + offset);
    while (mx < size) {
      m = slopefn(mx, my);

      mx += dt;
      my += m * dt;

      let xp = map(mx, -size, size, 0, width);
      let yp = map(my, -size, size, height, 0);
      let next = new p5.Vector(xp, yp);

      h = map(atan(slopefn(mx, my)), -PI / 2, PI / 2, 0, 255);
      stroke(color(h, 255, 255));
      line(old.x, old.y, next.x, next.y);

      old = next;
      if (yp > 100 * height || yp < -100 * height) {
        break;
      }
    }

    //step back
    mx = map(mouseX, 0, width, -size, size);
    my = map(mouseY + offset, height, 0, -size, size);
    old = new p5.Vector(mouseX, mouseY + offset);
    while (mx > -size) {
      m = slopefn(mx, my);

      mx -= dt;
      my -= m * dt;

      let xp = map(mx, -size, size, 0, width);
      let yp = map(my, -size, size, height, 0);
      let next = new p5.Vector(xp, yp);

      h = map(atan(slopefn(mx, my)), -PI / 2, PI / 2, 0, 255);
      stroke(color(h, 255, 255));
      line(old.x, old.y, next.x, next.y);

      old = next;
      if (yp > 100 * height || yp < -100 * height) {
        break;
      }
    }
  }
}

function drawSlopeField() {
  for (let x = 0; x < width; x += width / (12 * size)) {
    for (let y = 0; y < height; y += height / (12 * size)) {
      let mx = map(x, 0, width, -size, size);
      let my = map(y, height, 0, -size, size);

      let m = slopefn(mx, my);
      let A = atan(m);

      let sc = 1.5;
      let s = new createVector(x + sc * size * cos(A), y - sc * size * sin(A));
      let e = new createVector(x - sc * size * cos(A), y + sc * size * sin(A));

      let h = map(atan(m), -PI / 2, PI / 2, 0, 255);
      stroke((h + 127) % 255);
      strokeWeight(1.5);
      line(s.x, s.y, e.x, e.y);
    }
  }
}

function drawSlopeLine() {
  //clear();
  //background(0);
  let mx = map(mouseX, 0, width, -size, size);
  let my = map(mouseY, height, 0, -size, size);

  let m = slopefn(mx, my);
  let A = atan(m);

  lenghtLine = 4;
  let s = new p5.Vector(
    mouseX + lenghtLine * size * cos(A),
    mouseY - lenghtLine * size * sin(A)
  );
  let e = new p5.Vector(
    mouseX - lenghtLine * size * cos(A),
    mouseY + lenghtLine * size * sin(A)
  );

  let h = map(atan(m), -PI / 2, PI / 2, 0, 255);
  stroke((h + 127) % 255);
  strokeWeight(3);
  line(s.x, s.y, e.x, e.y);
}

function createBWSlopefield() {
  //slopefield.createGraphics();
  slopefield.loadPixels();
  for (let xp = 0; xp < width; xp++) {
    for (let yp = 0; yp < height; yp++) {
      let x = map(xp, 0, width, -size, size);
      let y = map(yp, height, 0, -size, size);

      let m = slopefn(x, y);

      let h = map(atan(m), -PI / 2, PI / 2, 0, 255);

      //slopefield.pixels[xp + yp*width] = color(h);
      slopefield.set(xp, yp, color(h));
    }
  }
  slopefield.updatePixels();
  //slopefield.endDraw();
}

function mousePressed() {
  if (showLines === true) {
    showLines = false;
  } else {
    showLines = true;
  }
}
