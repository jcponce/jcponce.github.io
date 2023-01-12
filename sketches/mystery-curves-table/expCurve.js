/*
This class defines the parametric curve.

Inspired from Frank Farris' book:

Creating Symmetry: The Artful Mathematics of Wallpaper Patterns

Chapter 3.

https://press.princeton.edu/books/hardcover/9780691161730/creating-symmetry

*/

class expCurve {

  constructor(m) {
    this.set();
  }

  set() {
    this.m = getRndInteger(2, 4);

    this.complex = [];
    let s = 1;
    for (let i = 0; i < 4; i++) {
      this.complex[i] = new p5.Vector(random(-s, s), random(-s, s));
    }

    this.n = [];
    for (let i = 0; i < 4; i++) {
      this.n[i] = getRndInteger(-30, 30);
    }
  }

  sumC(t) {
    let sumX = 0;
    let sumY = 0;
    let k = 0;
    while (k < this.m) {
      let x = this.complex[k].x;
      let y = this.complex[k].y;
      let c = this.n[k];
      sumX += x * cos(c * t) - y * sin(c * t);
      sumY += x * sin(c * t) + y * cos(c * t);
      k++
    }
    sumX = sumX * size;
    sumY = sumY * size;

    return createVector(sumX, sumY);
  }

  show() {
    strokeJoin(ROUND);
    noFill();
    beginShape();
    for (let k = 0; k < 360; k += 0.3) {
      let t = map(k, 0, 360, 0, TWO_PI);
      let vs = this.sumC(t);
      vertex(vs.x, vs.y);
    }
    endShape(CLOSE);
  }


}