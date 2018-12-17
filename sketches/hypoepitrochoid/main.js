/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 28-Nov-2018
 */

// Last update ??

//The following code is an adaptation found here https://gist.github.com/fogleman/c11a5cbcd845946b851518adedbf6a32
// written by Fogleman

let Controls = function() {
    this.type = 0;
    this.R = 7;
    this.r = 3;
    this.d = 3;
    this.rotation = 0;
    this.scale = 0.6;
};

let controls = new Controls();

let stepTheta;
let maxTheta;

function setup() {
    
    createCanvas(520, 520);
    pixelDensity(1);
    
    let gui = new dat.GUI({
                          width: 260
                          });
    gui.add(controls, 'type', {
            Hypotrochoid: 0,
            Epitrochoid: 1
            }).name("Type");
    gui.add(controls, 'R', 1, 30).step(1);
    gui.add(controls, 'r', 1, 30).step(1);
    gui.add(controls, 'd', 0, 30).step(0.1);
    gui.add(controls, 'rotation', 0, 360).step(1);
    gui.add(controls, 'scale', 0.1, 0.8).step(0.1);
    
    
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
    
    
    let R = controls.R;
    let r = controls.r;
    let d = controls.d;
    let N = reduceFraction(R, r)[1];
    let rS = controls.scale;
    
    translate(width / 2, height / 2);
    rotate(radians(270 + controls.rotation));
    background(0);
    
    maxTheta += stepTheta;
    
    noFill();
    
    let func = hypotrochoid;
    if (controls.type != 0) {
        func = epitrochoid;
    }
    
    let lo = createVector(0, 0);
    let hi = createVector(0, 0);
    for (let i = 0; i < 360 * N; i++) {
        let v = func(R, r, d, radians(i));
        lo.x = min(lo.x, v.x);
        lo.y = min(lo.y, v.y);
        hi.x = max(hi.x, v.x);
        hi.y = max(hi.y, v.y);
    }
    //var w = hi.x - lo.x;
    //var h = hi.y - lo.y;
    let sx = (width * rS) / w;
    let sy = (height * rS) / h;
    let s = min(sx, sy);
    
    if (controls.type != 0) {
        stroke(224, 102, 255);
    } else {
        stroke(0, 230, 77);
    }
    strokeWeight(4);
    strokeJoin(ROUND);
    beginShape();
    for (let k = 0; k < 360 * N; k++) {
        let vs = func(R, r, d, radians(k));
        vertex(vs.x * s, vs.y * s);
    }
    endShape(CLOSE);
    
    //Drawing Extra circles and points
    let mP = func(R, r, d, radians(maxTheta));
    
    stroke(255);
    ellipse(0, 0, R * 2 * s); //R circle
    
    noFill();
    let setCircle;
    if (controls.type != 0) {
        setCircle = r + R;
    } else {
        setCircle = R - r;
    }
    let xP = s * setCircle * cos(radians(maxTheta));
    let yP = s * setCircle * sin(radians(maxTheta));
    stroke(255, 12, 12);
    ellipse(xP, yP, 2 * (r) * s); //r Circle tracing curve
    stroke(26, 255, 255);
    line(xP, yP, mP.x * s, mP.y * s);//Segment d
    stroke(120, 22, 220);
    ellipse(xP, yP, 4);//Centre r Circle
    
    fill(255, 209, 26);
    stroke(255, 209, 26)
    ellipse(mP.x * s, mP.y * s, 10);//Point tracing curve
    
}

function hypotrochoid(R, r, d, theta) {
    let x = (R - r) * cos(theta) + d * cos((R - r) / r * theta);
    let y = (R - r) * sin(theta) - d * sin((R - r) / r * theta);
    return createVector(x, y);
}

function epitrochoid(R, r, d, theta) {
    let x = (R + r) * cos(theta) - d * cos((R + r) / r * theta);
    let y = (R + r) * sin(theta) - d * sin((R + r) / r * theta);
    return createVector(x, y);
}

function reduceFraction(n, d) {
    let gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(n, d);
    return [n / gcd, d / gcd];
}


