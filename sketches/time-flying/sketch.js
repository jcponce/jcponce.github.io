const FAST_MULTIPLIER = 35; // right clock runs this many times faster
let startRealMs, startRefMs;
let trails = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  strokeCap(ROUND);
  startRealMs = Date.now();
  startRefMs = startRealMs;

  //blendMode(HARD_LIGHT);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(11, 35); // semi-transparent for gentle blending

  const padding = min(width, height) * 0.09;
  const halfW = (width - padding * 3) / 2;
  const clockSize = min(halfW, height - padding * 2);
  const cy = height / 2;
  const leftCx = padding + halfW / 2;
  const rightCx = padding * 2 + halfW + halfW / 2;

  // real-time clock (discrete seconds)
  drawClock(leftCx, cy, clockSize, Date.now(), false, '#80d4ff');

  // fast clock (smooth seconds + trail)
  const nowMs = Date.now();
  const elapsed = nowMs - startRealMs;
  const fastMs = startRefMs + elapsed * FAST_MULTIPLIER;
  drawClock(rightCx, cy, clockSize, fastMs, true, '#ffd11a');
}

function drawClock(cx, cy, diameter, msTime, isFast = false, color = '#ffffff') {
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

  // smooth only for the fast clock
  const smoothSeconds = isFast ? seconds + ms / 1000 : seconds;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = hours + smoothMinutes / 60;

  const hourAngle = map(smoothHours, 0, 12, -HALF_PI, -HALF_PI + TWO_PI);
  const minuteAngle = map(smoothMinutes, 0, 60, -HALF_PI, -HALF_PI + TWO_PI);
  const secondAngle = map(smoothSeconds, 0, 60, -HALF_PI, -HALF_PI + TWO_PI);

  // hour hand
  push();
  rotate(hourAngle);
  stroke(color);
  strokeWeight(max(3, r * 0.045));
  line(0, 0, r * 0.45, 0);
  pop();

  // minute hand
  push();
  rotate(minuteAngle);
  stroke(color);
  strokeWeight(max(2, r * 0.03));
  line(0, 0, r * 0.65, 0);
  pop();

  // second hand
  push();
  rotate(secondAngle);
  stroke(color);
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
    for (let t of trails) {
      fill(color, t.alpha);
      stroke(color, t.alpha);
      strokeWeight(1);
      circle(t.x, t.y, 6);
      t.alpha *= 0.51; // fade
    }
    trails = trails.filter(t => t.alpha > 5);
  }

  // ×speed label
  // if (isFast) {
  //   push();
  //   translate(cx, cy);
  //   noStroke();
  //   fill(255, 50);
  //   textSize(max(10, r * 0.06));
  //   textAlign(CENTER, BOTTOM);
  //   text('×' + FAST_MULTIPLIER, 0, r * 0.65);
  //   pop();
  // }
}

// Function to toggle full screen mode
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Event listener for keydown event
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        toggleFullScreen();
    }
});