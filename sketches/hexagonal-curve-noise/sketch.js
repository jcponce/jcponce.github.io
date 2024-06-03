/*
 * Author: Juan Carlos Ponce Campuzano
 * Date: 03/Jun/2024
 * Site: https://www.dynamicmath.xyz
 * Video: https://youtu.be/vqGeaY188Ew
 */
 
let t = 0, speed = 0.004;
let noiseMax = 1.1;
let aoff = 0;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 1, 1, 1, 1);
}

function draw() {
  background(0, 0, 0, 0.05);

  for (let j = 1; j <= 10; j++) {
    let hue = map(j, 1, 10, 0, 1)
    stroke(hue, 1, 1);
    hexagonalCurve(50, 2.5, 3, j, j * t, PI + j * t);
  }

  t += speed;
  if(t >= TWO_PI) t = 0;
  
  aoff += 0.01;
}

/*
  Hexagonal curve with noise
  https://p5js.org/reference/#/p5/noise
  Defined on the interval [startT, endT]
  Main parameters: n, k, m
*/
function hexagonalCurve(n, k, m, size, startT, endT) {
  noFill();
  strokeWeight(2);
  let view = 70; 
  let x, y;
  beginShape();
  for (let i = startT; i <= endT; i += 0.01) {
    
    let v = pow(
      pow(cos((m * i) / 2), n) + pow(sin((m * i) / 2), n),
      1 / (k * n)
    );
    
    let xoff = map(cos(i), -1, 1, 0, noiseMax) +
        			 map(cos(aoff), -1, 1, 0, noiseMax);
    let yoff = map(sin(i), -1, 1, 0, noiseMax) +
        			 map(sin(aoff), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff), 0, 1, 0, 10);
    
    x = map(cos(i) * (size * r / v), -view, view, 0, width);
    y = map(sin(i) * (size * r / v), -view, view, height, 0);
    vertex(x, y);
  }
  endShape();
}
