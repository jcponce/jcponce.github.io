const FAST_MULTIPLIER = 100; // right clock runs this many times faster
let startRealMs, startRefMs;
let trails = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  strokeCap(ROUND);
  startRealMs = Date.now();
  startRefMs = startRealMs;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(11, 40); // semi-transparent for gentle blending

  const padding = min(width, height) * 0.06;
  const halfW = (width - padding * 3) / 2;
  const clockSize = min(halfW, height - padding * 2);
  const cy = height / 2;
  const leftCx = padding + halfW / 2;
  const rightCx = padding * 2 + halfW + halfW / 2;

  // real-time clock
  drawClock(leftCx, cy, clockSize, Date.now(), false);

  // fast clock
  const nowMs = Date.now();
  const elapsed = nowMs - startRealMs;
  const fastMs = startRefMs + elapsed * FAST_MULTIPLIER;
  drawClock(rightCx, cy, clockSize, fastMs, true);
}

function drawClock(cx, cy, diameter, msTime, isFast = false) {
  push();
  translate(cx, cy);
  const r = diameter / 2;

  // outline
  strokeWeight(max(1, r * 0.02));
  stroke(255, 24);
  noFill();
  ellipse(0, 0, diameter, diameter);

  // time
  const d = new Date(msTime);
  const hours = d.getHours() % 12;
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const ms = d.getMilliseconds();

  const smoothSeconds = seconds + ms / 1000;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = hours + smoothMinutes / 60;

  const hourAngle = map(smoothHours, 0, 12, -HALF_PI, -HALF_PI + TWO_PI);
  const minuteAngle = map(smoothMinutes, 0, 60, -HALF_PI, -HALF_PI + TWO_PI);
  const secondAngle = map(smoothSeconds, 0, 60, -HALF_PI, -HALF_PI + TWO_PI);

  // hour hand
  push();
  rotate(hourAngle);
  stroke(240, 180, 60);
  strokeWeight(max(3, r * 0.045));
  line(0, 0, r * 0.45, 0);
  pop();

  // minute hand
  push();
  rotate(minuteAngle);
  stroke(255);
  strokeWeight(max(2, r * 0.03));
  line(0, 0, r * 0.65, 0);
  pop();

  // second hand
  push();
  rotate(secondAngle);
  stroke(100, 200, 255);
  strokeWeight(max(1.5, r * 0.02));
  line(0, 0, r * 0.85, 0);
  pop();

  // faded trail only for the fast clock
  if (isFast) {
    const tipX = cos(secondAngle) * r * 0.85;
    const tipY = sin(secondAngle) * r * 0.85;
    trails.push({ x: cx + tipX, y: cy + tipY, alpha: 255 });
  }

  pop();

  // draw & fade trails
  if (isFast) {
    noFill();
    for (let t of trails) {
      stroke(100, 200, 255, t.alpha);
      strokeWeight(2);
      point(t.x, t.y);
      t.alpha *= 0.0; // fade
    }
    trails = trails.filter(t => t.alpha > 5);
  }

  // ×speed label
  if (isFast) {
    push();
    translate(cx, cy);
    noStroke();
    fill(255, 50);
    textSize(max(10, r * 0.06));
    textAlign(CENTER, BOTTOM);
    text('×' + FAST_MULTIPLIER, 0, r * 0.65);
    pop();
  }
}
