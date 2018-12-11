/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 28-Nov-2018
 */

// Last update ??

//The following code is an adaptation found here https://gist.github.com/fogleman/c11a5cbcd845946b851518adedbf6a32
// written by Fogleman

function hypotrochoid(R, r, d, theta) {
    var x = (R - r) * cos(theta) + d * cos((R - r) / r * theta);
    var y = (R - r) * sin(theta) - d * sin((R - r) / r * theta);
    return createVector(x, y);
}

function epitrochoid(R, r, d, theta) {
    var x = (R + r) * cos(theta) - d * cos((R + r) / r * theta);
    var y = (R + r) * sin(theta) - d * sin((R + r) / r * theta);
    return createVector(x, y);
}

function reduceFraction(n, d) {
    var gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(n, d);
    return [n / gcd, d / gcd];
}

var Controls = function() {
    this.type = 0;
    this.R = 7;
    this.r = 3;
    this.d = 3;
    this.rotation = 0;
    this.scale = 0.6;
};

var controls = new Controls();

//var rotating = 0;

//var points = [];

//var polygons = [];


let stepTheta;
let maxTheta;

function setup() {
    var gui = new dat.GUI({
                          width: 300
                          });
    gui.add(controls, 'type', {
            hypotrochoid: 0,
            epitrochoid: 1
            });
    gui.add(controls, 'R', 1, 30).step(1);
    gui.add(controls, 'r', 1, 30).step(1);
    gui.add(controls, 'd', 0, 30).step(0.1);
    gui.add(controls, 'rotation', 0, 360).step(1);
    gui.add(controls, 'scale', 0.3, 0.8).step(0.1);
    createCanvas(520, 520);
    pixelDensity(1);
    
    maxTheta = 0;
    stepTheta = 0.9;
}

function windowResized() {
    resizeCanvas(520, 520);
}



function draw() {
    
    // It all starts with the width, try higher or lower values
    let w = 17;
    let h = (w * height) / width;
    
    // Start at negative half the width and height
    let xmin = -w / 2;
    let ymin = -h / 2;
    
    
    var R = controls.R;
    var r = controls.r;
    var d = controls.d;
    var N = reduceFraction(R, r)[1];
    var rS = controls.scale;
    
    
    
    translate(width / 2, height / 2);
    rotate(radians(270 + controls.rotation));
    background(0);
    
    maxTheta += stepTheta;
    
    noFill();
    
    var func = hypotrochoid;
    if (controls.type != 0) {
        func = epitrochoid;
    }
    
    var lo = createVector(0, 0);
    var hi = createVector(0, 0);
    for (var i = 0; i < 360 * N; i++) {
        var v = func(R, r, d, radians(i));
        lo.x = min(lo.x, v.x);
        lo.y = min(lo.y, v.y);
        hi.x = max(hi.x, v.x);
        hi.y = max(hi.y, v.y);
    }
    //var w = hi.x - lo.x;
    //var h = hi.y - lo.y;
    var sx = (width * rS) / w;
    var sy = (height * rS) / h;
    var s = min(sx, sy);
    
    if (controls.type != 0) {
        stroke(224, 102, 255);
    } else {
        stroke(0, 230, 77);
    }
    strokeWeight(4);
    strokeJoin(ROUND);
    beginShape();
    for (var k = 0; k < 360 * N; k++) {
        var vs = func(R, r, d, radians(k));
        vertex(vs.x * s, vs.y * s);
    }
    endShape(CLOSE);
    
    var mP = func(R, r, d, radians(maxTheta));
    
    stroke(255);
    ellipse(0, 0, R * 2 * s); //R circle
    
    noFill();
    var setCircle;
    if (controls.type != 0) {
        setCircle = abs(r + R);
    } else {
        setCircle = abs(r - R);
    }
    var xP = s * setCircle * cos(radians(maxTheta));
    var yP = s * setCircle * sin(radians(maxTheta));
    stroke(255, 12, 12);
    ellipse(xP, yP, 2 * (r) * s); //r Circle tracing curve
    stroke(26, 255, 255);
    line(xP, yP, mP.x * s, mP.y * s);//Segment d
    stroke(120, 22, 220);
    ellipse(xP, yP, 4);//Centre r Circle
    
    
    
    fill(255, 209, 26);
    stroke(255, 209, 26)
    ellipse(mP.x * s, mP.y * s, 10);//Pont tracing curve
    
}

//Maybe I don't need the following class
class regularPolygon {
    
    constructor(_x, _y, _r, _n) {
        this.x = _x;
        this.y = _y;
        this.r = _r;
        this.n = _n;
    }
    
    display() {
        push();
        beginShape();
        for (let i = 0; i <= this.n; i++) {
            let nextx, nexty;
            nextx = this.x + this.r * cos(i * 2 * PI / this.n);
            nexty = this.y + this.r * sin(i * 2 * PI / this.n);
            vertex(nextx, nexty);
        }
        endShape(CLOSE);
        pop();
    }
    
}
