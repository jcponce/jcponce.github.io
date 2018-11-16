// Original code by Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/6z7GQewK-Ks
// I just changed the iteration function and color scheme 

function setup() {
  createCanvas(700, 500);
  colorMode(HSB);
  frameRate(60);
}

function draw() {
  background(255);

  // Establish a range of values on the complex plane
  // A different range will allow us to "zoom" in or out on the fractal

  // It all starts with the width, try higher or lower values
  let w = 4.5;
  let h = (w * height) / width;

  // Start at negative half the width and height
  let xmin = -w / 2;
  let ymin = -h / 2;

  // Make sure we can write to the pixels[] array.
  // Only need to do this once since we don't do any other drawing.
  loadPixels();

  // Maximum number of iterations for each point on the complex plane
  let maxiterations = 90;

  // x goes from xmin to xmax
  let xmax = xmin + w;
  // y goes from ymin to ymax
  let ymax = ymin + h;

  // Calculate amount we increment x,y for each pixel
  let dx = (xmax - xmin) / (width);
  let dy = (ymax - ymin) / (height);

  // Start y
  let y = ymin;
  
  let cX = map(mouseX, 0, width, xmin, xmax);
  let cY = map(mouseY, height, 0, ymin, ymax);

  for (let j = 0; j < height; j++) {
    // Start x
    let x = xmin;
    for (let i = 0; i < width; i++) {

      // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
      let a = x;
      let b = -y;
      let n = 0;
      while (n < maxiterations) {
        let aa = a * a;
        let bb = b * b;
        let twoab = 2.0 * a * b;
        
        a = aa - bb + cX;
        b = twoab + cY;
        // Infinty in our finite world is simple, let's just consider it 16
        if (a * a + b * b > 16.0) {
          break; // Bail
        }
        n++;
      }

      // We color each pixel based on how long it takes to get to infinity
      // If we never got there, let's pick the color black
      if (n == maxiterations) {
        set(i, j, color(0));
      } else {
        // Gosh, we could make fancy colors here if we wanted
        let h = map(log(n + sqrt(a * a + b * b)), 0, 0.5 * log(maxiterations), 0, 200);
        //let s = sqrt(abs( 3*sin( 2* PI * (log(sqrt( a * a + b * b ))/log(2) - floor( log(sqrt( a * a + b * b ))/log(2) )) )));
        //let s2 = map(s, 0, 1, 0, 100);
        let b1 = sqrt(sqrt(abs(sin(2 * PI * b) * sin(2 * PI * a))));
        //let b2 = 0.5 * ((1 - s) + b1 + sqrt((1 - s - b1) * (1 - s - b1) + 0.01));
        let b3 = map(b1, 0, 1, 0, 100);
        //set(i, j, color(sqrt(float(n) / maxiterations)));
        set(i, j, color(h, 90, 90));
      }
      x += dx;
    }
    y += dy;
  }
  updatePixels();
  //noLoop();
  //draw constant label
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(18);
  text("c is (" + str(round(cX * 100)/100.0) + "," + str(round(cY * 100)/100.0) + ")", 5, height-15);

  //draw pointer for constant
  fill(0, 0, 100);
  noStroke();
  ellipse(mouseX, mouseY, 8, 8);
}
