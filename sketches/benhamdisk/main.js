/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 28-Nov-2018
 */

// Last update ??

let slider;
let t = 0;
let pw;

let ar1, ar2, ar3, ar4;

function setup() {
    createCanvas(500, 500);
    cursor(HAND);
    pw = width*0.35;
    
    slider = createSlider(-0.7853, 0.7853, 0, 0.0001);
    slider.style('width:300px')
    slider.parent('slider');
    
    let dif = 0.03;
    ar1 = new ArcBenham(0, 0, pw*0.20, 0, 1 * PI / 4-dif);
    ar2 = new ArcBenham(0, 0, pw*(0.20+0.18), 1 * PI / 4+dif, 2 * PI / 4-dif);
    ar3 = new ArcBenham(0, 0, pw*(0.20+0.18*2), 2 * PI / 4+dif, 3 * PI / 4-dif);
    ar4 = new ArcBenham(0, 0, pw*(0.20+0.18*3), 3 * PI / 4+dif, 4 * PI / 4-dif);
}

function draw() {
    background(255);
    
    translate(width / 2, height / 2);
    
    //These lines are just for reference
    //fill(0);
    //ellipse(0, 0, 10);
    //ellipse(pw, 0, 10);
    //ellipse(0, -pw, 10);
    
    scale(1.2);
    
    //circle
    push();
    noFill();
    strokeWeight(1);
    beginShape();
    for (let k = 0; k < 2 * PI; k += 0.01) {
        let x = pw*(0.20+0.18*4)*(cos(k) * cos(t) - sin(k) * sin(t));
        let y = pw*(0.20+0.18*4)*(cos(k) * sin(t) + sin(k) * cos(t));
        vertex(x, y);
    }
    endShape(CLOSE);
    pop();
    push();
    
    
    //black semi-circle
    fill(0);
    strokeWeight(1);
    beginShape();
    for (let k = 0; k < PI; k += 0.01) {
        let x = pw*(0.20+0.18*4)*(cos(k) * cos(t) - sin(k) * sin(t));
        let y = pw*(0.20+0.18*4)*(cos(k) * sin(t) + sin(k) * cos(t));
        vertex(x, y);
    }
    endShape(CLOSE);
    pop();
    
    
    //arcs show and updated
    ar1.show();
    ar2.show();
    ar3.show();
    ar4.show();
    
    let s = slider.value();
    
    ar1.update(s);
    ar2.update(s);
    ar3.update(s);
    ar4.update(s);
    
    //rotate circle and semicircle
    t += s;
    
}

class ArcBenham {
    constructor(x, y, r, ip, fp) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ip = ip;
        this.fp = fp;
        this.t = 0;
    }
    
    show() {
        noFill();
        push();
        for (let i = 0; i < 3; i ++) {
            let p = PI;
            let rw = this.r;
            let sep = 10;
            strokeWeight(6);
            beginShape();
            for (let k = this.ip; k < this.fp; k += 0.01) {
                let vx = (rw + i*sep ) * (cos(k) * cos(this.t + p) - sin(k) * sin(this.t + p)) + this.x;
                let vy = (rw + i*sep ) * (cos(k) * sin(this.t + p) + sin(k) * cos(this.t + p)) + this.y;
                vertex(vx, vy);
            }
            endShape();
        }
        pop();
    }
    
    update(speed) {
        this.speed = speed;
        this.t += this.speed;
    }
    
}
