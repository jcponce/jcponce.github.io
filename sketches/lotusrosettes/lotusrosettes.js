/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 9-Oct-2018
 * Based upon Dan Anderson's code
 * https://www.openprocessing.org/sketch/519299
 */

let gridsize = 13;

function setup() {
    createCanvas(550, 550);
    colorMode(HSB);
}

function draw() {
    background(0);
    gridsize = int(map(mouseX, 0, width, 4, 13));
    textAlign(LEFT, CENTER);
    stroke(0, 0, 80);
    fill(0, 0, 80);
    //text("r=asin(cos(a/b * t))", 6, 0 + width / (2 * gridsize));
    textAlign(CENTER, CENTER);
    text("a", width / 2, height / (6 * gridsize));
    text("b", width / (6 * gridsize), height / 2);
    
    for (let a = 1; a <= gridsize; a++) {
        for (let b = 1; b <= gridsize; b++) {
            let cx, cy, r;
            
            cx = map(a, 1, gridsize, 0 + width / gridsize, width - width / gridsize);
            cy = map(b, gridsize, 1, height - height / gridsize, 0 + height / gridsize);
            
            if (a == 1) {
                
                text(str(b), cx - width / (1.4 * gridsize), cy);
                text(str(b), cy, cx - height / (1.4 * gridsize));
            }
            
            
            r = 0.25 * width / (gridsize + 1);
            beginShape();
            noFill();
            
            let x, y, ox, oy;
            
            let t = 0;
            ox = cx + r * asin(cos(1.0 * a / b * t)) * cos(t);
            oy = cy + r * asin(cos(1.0 * a / b * t)) * sin(t);
            
            let done = false;
            while (t < 4 * gridsize * TWO_PI && !done) {
                
                x = cx + r * asin(cos(1.0 * a / b * t)) * cos(t);
                y = cy + r * asin(cos(1.0 * a / b * t)) * sin(t);
                stroke(cx, cy, 100);
                vertex(x, y);
                
                if ((abs(x - ox) + abs(y - oy) < 0.05) && (t > TWO_PI / 150)) {
                    done = true;
                }
                t += TWO_PI / 300;
            }
            endShape(OPEN);
        }
    }
}
