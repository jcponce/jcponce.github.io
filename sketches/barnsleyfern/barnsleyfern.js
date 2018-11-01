/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-June-2018
 * Based upon Daniel Shiffman's code
 * http://codingtra.in
 * Barnsley Fern
 * https://youtu.be/JFugGF1URNo
 */

let x = 0;
let y = 0;

function setup() {
    createCanvas(450, 450);
    background(0);
}
function nextPoint() {
    let nextX;
    let nextY;
    
    let r = random(1);
    
    if (r < 0.01) {
        // 1
        nextX =  0;
        nextY =  0.16 * y;
    } else if (r < 0.86) {
        // 2
        nextX =  0.85 * x +  0.04 * y;
        nextY = -0.04 * x +  0.85 * y + 1.6;
    } else if (r < 0.93) {
        // 3
        nextX =  0.20 * x + -0.26 * y;
        nextY =  0.23 * x +  0.22 * y + 1.6;
    } else {
        // 4
        nextX = -0.15 * x +  0.28 * y;
        nextY =  0.26 * x +  0.24 * y + 0.44;
    }
    
    x = nextX;
    y = nextY;
}

// −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983
function drawPoint() {
    colorMode(HSB,255,255,255);
    stroke(map(y, 0, 9.9983,0,255),255,255,200);
    strokeWeight(2);
    let px = map(x, -2.1820, 2.6558, 0, width);
    let py = map(y, 0, 9.9983, height, 0);
    point(px, py);
}

function draw() {
    for (let i = 0; i < 200; i++) {
        drawPoint();
        nextPoint();
    }
}
