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
  v: 0.34,
  r: 0.76,
  g: Math.random(),
  b: Math.random(),
  reset: function() {
    this.v = Math.random();
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  let gui = new dat.GUI({
    width: 300
  });
  gui.add(ctls, 'n', 0, 10, 1).name("n=");
  gui.add(ctls, 'p', 0, 2, 1).name("p=");
  gui.add(ctls, 'q', 0, 2, 1).name("q=");
  gui.add(ctls, 'reset').name('Change color');
  gui.close();

  c = new polarC();

}

function draw() {
  background(0);
  c.plot();
}

class polarC {

  constructor() {
    this.d = 2.5;
    this.size = width * 0.055;
    this.angle = 0;
  }

  plot() {
    let n = ctls.n;
    translate(width / 2, height / 2);
    colorMode(RGB, 1, 1, 1);
    for (let j = 0; j < 64; j++) {
      let v = [];
      v[j] = j / 64 * (PI / 2 - PI / 56);
      let c = this.changeColor((j + 1) / 64 - this.angle);
      if (ctls.v < 0.3) {
        stroke(c, ctls.g, ctls.blue, c+0.5);
      } else if (0.3 <= ctls.v && ctls.v < 0.6) {
        stroke(ctls.r, c, ctls.b, c+0.5);
      } else if (0.6 <= ctls.v) {
        stroke(ctls.r, ctls.g, c, c+0.5);
      }

      noFill();
      beginShape();
      for (let i = 0; i < 360; i = i + 1.5) {
        let nextx, nexty;
        let t = map(i, 0, 360, 0, TWO_PI);
        nextx = this.size * (this.d * v[j] + pow(cos(n * (t - v[j])), ctls.p) ) * cos(t + this.angle);
        nexty = this.size * (this.d * v[j] + pow(sin(n * (t - v[j])), ctls.q)) * sin(t + this.angle);
        vertex(nextx, -nexty);
      }
      endShape(CLOSE);

    }

    this.render();
    
  }

  changeColor(x_) {
    return cos(4 * x_ + 1) / 2;
  }

  render() {
    this.angle = this.angle + 0.005;
  }


}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  c.size = width * 0.055;

}