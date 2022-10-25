let x, y,  h, C = 50, f = 0;
function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 1.0);
}
function draw() {
  background(0);
  rotateX(0.2);
  for (x = -4.5; x < 0.5; x += 0.15) {
    for (y = -4.5; y < 0.5; y += 0.15) {
      push();
      h = noise(x + f, y + f)
      fill(h, 1, 1);
      translate((2 + x) * C, (2 + y) * C);
      box(8, 8, h * 300);
      pop();
    }
  }
  f += 0.007;
}