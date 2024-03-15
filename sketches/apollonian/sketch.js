let circles;

function setup() {
  let side = 700;
  createCanvas(side, side);
  background(0);

  //We need three tangent circles to start off with.
  //centers
  let z1 = new complex(side / 2, side / 2);
  let z2 = new complex(side / 2 - 150, side / 2, 200);
  let z3 = new complex(side / 2 + 150, side / 2, 100);

  //radii
  let r1 = 300;
  let r2 = 150;
  let r3 = 150;

  //curvatures
  let k1 = -1 / r1;
  let k2 = 1 / r2;
  let k3 = 1 / r3;

  //initial circles
  let c1 = new Circle(z1.scale(k1), k1);
  let c2 = new Circle(z2.scale(k2), k2);
  let c3 = new Circle(z3.scale(k3), k3);

  //we've set them up to be touching tangent to the other two
  c1.tangentCircles = [c2, c3];
  c2.tangentCircles = [c1, c3];
  c3.tangentCircles = [c2, c1];

  circles = [c1, c2, c3];
  //frameRate(1);
}

function draw() {
  background(0);

  //draw all the circles!
  circles.map((x) => x.show());

  //stop
  if (circles.length > 15000) noLoop();
}

function mousePressed() {
  //update
  let incompleteCircles = circles.filter(
    (x) => x.tangentCircles.length > 0 && x.tangentCircles.length < 5
  );
  let completion = incompleteCircles.reduce(function (acc, obj) {
    return concat(acc, apollonian(obj));
  }, []);
  circles = concat(circles, completion);
}

function apollonian(c) {
  //Apply Decartes theorem iterativly to pack circles within a circle.
  //https://en.wikipedia.org/wiki/Apollonian_gasket
  if (c.tangentCircles.length < 2) return [];
  if (c.tangentCircles.length == 2)
    return decartes(c, c.tangentCircles[0], c.tangentCircles[1]);

  c1 = c.tangentCircles[0];
  c2 = c.tangentCircles[1];
  c3 = c.tangentCircles[2];

  //Each call to decartes returns a pair of circles.
  //One we already have, so we filter it out. We'll also filter out circles that are too small.
  let c23 = decartes(c, c2, c3).filter((x) => !c1.isEqual(x) && x.r > 0.5);
  let c13 = decartes(c, c1, c3).filter((x) => !c2.isEqual(x) && x.r > 0.5);
  let c12 = decartes(c, c1, c2).filter((x) => !c3.isEqual(x) && x.r > 0.5);

  return concat(c23, concat(c12, c13));
}

function decartes(c1, c2, c3) {
  //Decartes Theorem: Given three tangent circles we can find a fourth and a fifth.
  //https://en.wikipedia.org/wiki/Descartes%27_theorem
  let k_plus =
    c1.k + c2.k + c3.k + 2 * sqrt(c1.k * c2.k + c3.k * c2.k + c1.k * c3.k);
  let k_minus =
    c1.k + c2.k + c3.k - 2 * sqrt(c1.k * c2.k + c3.k * c2.k + c1.k * c3.k);

  let c12 = c1.z.mult(c2.z);
  let c23 = c2.z.mult(c3.z);
  let c31 = c3.z.mult(c1.z);

  let t1 = c1.z.add(c2.z.add(c3.z));
  let t2 = c12.add(c23.add(c31));
  let t3 = t2.sqrt().scale(2.0);

  let z_plus = t1.add(t3);
  let z_minus = t1.minus(t3);

  let c_plus = new Circle(z_plus, k_plus);
  let c_minus = new Circle(z_minus, k_minus);

  c_plus.tangentCircles = [c1, c2, c3];
  c_minus.tangentCircles = [c1, c2, c3];

  //These now have a full set so we don't care anymore
  c1.tangentCircles = [];
  c2.tangentCircles = [];
  c3.tangentCircles = [];

  return [c_plus, c_minus];
}

class Circle {
  constructor(z, k) {
    // k is the curvature.
    // z is the position expressed as a
    // complex number and divided by the curvature.
    // This is a convienient quantity for decartes theorem
    this.k = k;
    this.r = 1 / abs(k);
    this.z = z;
    this.x = z.x / k;
    this.y = z.y / k;
    this.tangentCircles = [];
  }

  isEqual(c) {
    let tolerance = 1.0;
    let equalR = abs(this.r - c.r) < tolerance;
    let equalX = abs(this.x - c.x) < tolerance;
    let equalY = abs(this.y - c.y) < tolerance;

    return equalR && equalX && equalY;
  }

  show() {
    noFill();
    stroke(255);
    circle(this.x, this.y, 2 * this.r);
  }
}

class complex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(z) {
    return new complex(this.x + z.x, this.y + z.y);
  }

  minus(z) {
    return new complex(this.x - z.x, this.y - z.y);
  }

  mult(z) {
    return new complex(
      this.x * z.x - this.y * z.y,
      this.x * z.y + this.y * z.x
    );
  }

  scale(s) {
    return new complex(this.x * s, this.y * s);
  }

  sq() {
    return this.mult(this);
  }

  sqrt() {
    let r = Math.sqrt(this.modulus());
    let arg = this.arg() / 2.0;
    return new complex(r * cos(arg), r * sin(arg));
  }

  modulus() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  arg() {
    return atan2(this.y, this.x);
  }
}
