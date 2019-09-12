/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Sept-2019
 *
 */

let gridsize = 13;
let slider;

function setup() {
    let canvas = createCanvas(600, 600);
    colorMode(HSB);
    slider = createSlider(4, 10, 1);
    slider.position(200, height-40);
    slider.style('width', '200px');
}

let phase = 1.57;

function draw() {
    background(0);
    let val = slider.value();
    gridsize = val;//int(map(mouseX, 0, width, 4, 13));
    textAlign(LEFT, CENTER);
    stroke(0, 0, 80);
    fill(0, 0, 80);
    //text("r=asin(cos(a/b * t))", 6, 0 + width / (2 * gridsize));
    textAlign(CENTER, CENTER);
    //text("a", width / 2, height / (6 * gridsize));
    //text("b", width / (6 * gridsize), height / 2);
    
    for (let a = 1; a <= gridsize; a++) {
        let cxh, cyh, rh;
        
        cxh = map(a, 1, gridsize, 10 + width / gridsize, width - width / gridsize);
        cyh = map(0, gridsize, 1, height - height / gridsize, 10 + height / gridsize);
        rh = 0.25 * width / (gridsize + 1);
        
        
        beginShape();
        noFill();
        
        let xh, yh, oxh, oyh;
        
        let th = 0;
        oxh = cxh + rh * (sin(th ));
        oyh = cyh + rh * (cos(th));
        
        let doneh = false;
        while (th < 4 * gridsize * TWO_PI && !doneh) {
            
            xh = cxh + rh * (sin( th ));
            yh = (cyh + rh * (cos(th)));
            
            stroke((cxh + cyh) % 360, 80, 100);
            vertex(xh, yh);
            
            if ((abs(xh - oxh) + abs(yh - oyh) < 0.0001) && (th > TWO_PI )) {
                doneh = true;
            }
            th += TWO_PI / 360;
        }
        endShape(OPEN);
    }
    
    for (let b = 1; b <= gridsize; b++) {
        let cxv, cyv, rv;
        
        cxv = map(0, 1, gridsize, 10 + width / gridsize, width - width / gridsize);
        cyv = map(b, gridsize, 1, height - height / gridsize, 10 + height / gridsize);
        rv = 0.25 * width / (gridsize + 1);
        
        
        beginShape();
        noFill();
        
        let xv, yv, oxv, oyv;
        
        let tv = 0;
        oxv = cxv + rv * (sin(tv ));
        oyv = cyv + rv * (cos(tv));
        
        let donev = false;
        while (tv < 4 * gridsize * TWO_PI && !donev) {
            
            xv = cxv + rv * (sin( tv ));
            yv = (cyv + rv * (cos(tv)));
            
            stroke((cxv + cyv) % 360, 80, 100);
            vertex(xv, yv);
            
            if ((abs(xv - oxv) + abs(yv - oyv) < 0.0001) && (tv > TWO_PI )) {
                donev = true;
            }
            tv += TWO_PI / 360;
        }
        endShape(OPEN);
    }
    
    for (let a = 1; a <= gridsize; a++) {
        for (let b = 1; b <= gridsize; b++) {
            let cx, cy, r;
            
            cx = map(a, 1, gridsize, 10 + width / gridsize, width - width / gridsize);
            cy = map(b, gridsize, 1, height - height / gridsize, 10 + height / gridsize);
            
            if (a == 1) {
                let change = map(slider.value(), 4, 10, 1.55, 1.2)
                text(str(b), cx - width / ( change * gridsize), cy);
                text(str(b), cy, cx - height / ( change * gridsize));
            }
            
            
            r = 0.25 * width / (gridsize + 1);
            
        
            beginShape();
            noFill();
            
            let x, y, ox, oy;
            
            let t = 0;
            ox = cx + r * (sin(b * t +phase));
            oy = cy + r * (sin(a * t));
            
            let done = false;
            while (t < 4 * gridsize * TWO_PI && !done) {
                
                    x = cx + r * (sin(b * t +phase));
                    y = (cy + r * (sin(a * t)));
                
                stroke((cx + cy) % 360, 80, 100);
                vertex(x, y);
                
                if ((abs(x - ox) + abs(y - oy) < 0.0001) && (t > TWO_PI )) {
                    done = true;
                }
                t += TWO_PI / 360;
            }
            endShape(OPEN);
        }
    }
    
    let stepChange = map(slider.value(), 4, 10, 0.01, 0.08)
    phase+=stepChange;
    if(phase> 1.57 + 2*PI ){phase = 1.57}
}

function circlesColRow(a, b){
    for (let a = 1; a <= gridsize; a++) {
        let cx, cy, r;
        
        cx = map(a, 1, gridsize, 0 + width / gridsize, width - width / gridsize);
        cy = map(b, gridsize, 1, height - height / gridsize, 0 + height / gridsize);
        r = 0.25 * width / (gridsize + 1);
        
        
        beginShape();
        noFill();
        
        let x, y, ox, oy;
        
        let t = 0;
        ox = cxv + r * (sin(t ));
        oy = cyv + r * (cos(t));
        
        let done = false;
        while (t < 4 * gridsize * TWO_PI && !done) {
            
            x = cx + r * (sin( t ));
            y = (cy + r * (cos(t)));
            
            stroke((cx + cy) % 360, 80, 100);
            vertex(x, y);
            
            if ((abs(x - ox) + abs(y - oy) < 0.0001) && (t > TWO_PI )) {
                donev = true;
            }
            tv += TWO_PI / 360;
        }
        endShape(OPEN);
    }
}

