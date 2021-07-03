/*
Under Creative Commons License
https://creativecommons.org/licenses/by-sa/4.0/
Written by Juan Carlos Ponce Campuzano, 17-Feb-2020
https://jcponce.github.io/
*/

let c;

let ctls = {
  n: 5,
  p: 2,
  q: 1,
  trace: true,
  reset: randomVal
};

function setup() {

  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 1, 1, 1, 1);
  pixelDensity(1);
  background(0);

  let gui = new dat.GUI({
    width: 290
  });
  gui.add(ctls, 'n', 0, 10, 1).name("n=");
  gui.add(ctls, 'p', 0, 2, 1).name("p=");
  gui.add(ctls, 'q', 0, 2, 1).name("q=");
  gui.add(ctls, 'reset').name("Change color");
  gui.add(ctls, 'trace').name("Glow");
  gui.close();

  c = new polarC();

}

function draw() {

  if (ctls.trace) {
    background(0, 0, 0, 0.08);
  } else background(0, 0, 0, 1);

  c.plot();

}

function randomVal() {
  c.randomize();
}

class polarC {

  constructor() {
    this.d = 2.5;
    this.size = width * 0.055;
    this.angle = 0;
    this.v = 0.34;
    this.r = 0.76;
    this.g = Math.random();
    this.b = Math.random();
  }

  plot() {
    let n = ctls.n;
    translate(width / 2, height / 2);

    for (let j = 0; j < 64; j++) {
      let v = [];
      v[j] = j / 64 * (PI / 2 - PI / 56);

      if (this.v < 0.3) {
        stroke(this.effects((j) / 64 - this.angle), this.g, this.b, this.effects((j) / 64 - this.angle) + 1 / 2);
      } else if (0.3 <= this.v && this.v < 0.6) {
        stroke(this.r, this.effects((j) / 64 - this.angle), this.b, this.effects((j) / 64 - this.angle) + 1 / 2);
      } else if (0.6 <= this.v) {
        stroke(this.r, this.g, this.effects((j) / 64 - this.angle), this.effects((j) / 64 - this.angle) + 1 / 2);
      }

      noFill();
      beginShape();
      for (let i = 0; i < 360; i = i + 1.5) {
        let nextx, nexty;
        let t = map(i, 0, 360, 0, TWO_PI);
        nextx = this.size * (this.d * v[j] + pow(cos(n * (t - v[j])), ctls.p)) * cos(t + this.angle);
        nexty = this.size * (this.d * v[j] + pow(sin(n * (t - v[j])), ctls.q)) * sin(t + this.angle);
        vertex(nextx, -nexty);
      }
      endShape(CLOSE);

    }

    this.render();

  }

  effects(x_) {
    return cos(4 * x_ + 1) / 2;
  }

  render() {
    this.angle = this.angle + 0.005;
  }

  randomize() {
    this.v = Math.random();
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  c.size = width * 0.055;

}