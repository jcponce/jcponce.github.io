/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Sept-2019
 *
 */

let gridsize = 10;
let slider;

function setup() {
    let canvas = createCanvas(600, 600);
    colorMode(HSB);
    slider = createSlider(4, 10, 1);
    slider.position(200, height - 38);
    slider.style('width', '200px');
}

let phase = 1.57;

function draw() {
    background(0);
    let val = slider.value();
    gridsize = val;
    textAlign(LEFT, CENTER);
    stroke(0, 0, 80);
    fill(0, 0, 80);
    
    textAlign(CENTER, CENTER);
   
    circlesColRow(true);
    
    circlesColRow(false);
    
    for (let a = 1; a <= gridsize; a++) {
        for (let b = 1; b <= gridsize; b++) {
            let cx, cy, r;
            
            cx = map(a, 1, gridsize, 10 + width / gridsize, width - width / gridsize);
            cy = map(b, gridsize, 1, height - height / gridsize, 10 + height / gridsize);
            
            if (a == 1) {
                let change = map(slider.value(), 4, 10, 1.55, 1.2)
                text(str(b), cx - width / (change * gridsize), cy);
                text(str(b), cy, cx - height / (change * gridsize));
            }
            
            
            r = 0.25 * width / (gridsize + 1);
            
            
            beginShape();
            noFill();
            
            let x, y, ox, oy;
            
            let t = 0;
            ox = cx + r * (sin(b * t + phase));
            oy = cy + r * (sin(a * t));
            
            let done = false;
            while (t < 4 * gridsize * TWO_PI && !done) {
                
                x = cx + r * (sin(b * t + phase));
                y = (cy + r * (sin(a * t)));
                
                stroke((cx + cy) % 360, 80, 100);
                vertex(x, y);
                
                if ((abs(x - ox) + abs(y - oy) < 0.0001) && (t > TWO_PI)) {
                    done = true;
                }
                t += TWO_PI / 360;
            }
            endShape(CLOSE);
        }
    }
    
    let stepChange = map(slider.value(), 4, 10, 0.01, 0.08)
    phase += stepChange;
    if (phase > 1.57 + 2 * PI) {
        phase = 1.57
    }
}

function circlesColRow(h) {
    for (let i = 1; i <= gridsize; i++) {
        let Cx, Cy, R;
        
        if (h == true) {
            
            Cx = map(0, 1, gridsize, 10 + width / gridsize, width - width / gridsize);
            Cy = map(i, gridsize, 1, height - height / gridsize, 10 + height / gridsize);
        } else {
            Cx = map(i, 1, gridsize, 10 + width / gridsize, width - width / gridsize);
            Cy = map(0, gridsize, 1, height - height / gridsize, 10 + height / gridsize);
            
        }
        R = 0.25 * width / (gridsize + 1);
        
        
        beginShape();
        noFill();
        
        let x, y, ox, oy;
        
        let t = 0;
        ox = Cx + R * (sin(t));
        oy = Cy + R * (cos(t));
        
        let Done = false;
        while (t < 4 * gridsize * TWO_PI && !Done) {
            
            x = Cx + R * (sin(t));
            y = (Cy + R * (cos(t)));
            
            stroke((Cx + Cy) % 360, 80, 100);
            vertex(x, y);
            
            if ((abs(x - ox) + abs(y - oy) < 0.0001) && (t > TWO_PI)) {
                Done = true;
            }
            t += TWO_PI / 360;
        }
        endShape(CLOSE);
    }
}
