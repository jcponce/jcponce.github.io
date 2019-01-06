/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 28-Dec-2018
 */

// Last update ??

let numBalls = 500;
let numRedballs = 100;
let balls = [];

let c;

let setcolor = false;
let clts = {
    
title: 'Brownian-Motion-Collision',
//inst: 'Click mouse',
grav: 0.0,
fric: 0.001,
spr: 0.02,
show: false,
    
};


function setup() {
    
    c = color(255, random(15,20));
    //createCanvas(500, 500);
    createCanvas(windowWidth, windowHeight);
    
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 330});
    gui.close();
    gui.add(clts, 'title').name("Title:");
    gui.add(clts, 'grav', -0.06, 0.06).name("Gravity").step(0.0001).listen();
    //gui.add(clts, 'fric', 0, 0.002).name("Friction").step(0.0001).listen();
    //gui.add(clts, 'spr',0, 0.03).name("Spring").step(0.00001).listen();
    gui.add(clts, 'show').name("Show more");
    gui.add(this, 'reset').name("Reset");
    gui.add(this, 'sourceCode').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    
    reset();
}

function reset(){
    for (let i = 0; i < numBalls; i++) {
        let r = random(2, 6);
        balls[i] = (
                    new Ball(
                             round(random(r, width - r)),
                             round(random(r, height - r)),
                             r, i, balls
                             )
                    );
    }
}

function sourceCode() {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/tree/master/sketches/brownianmotion";
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function draw() {
    background(0);
    
    noFill();
    stroke(190);
    strokeWeight(6);
    rect(0, 0, width, height);
    
    if (clts.show) {
        c = color(255, 255, 255, round(random(200, 220)));
        setcolor = true;
    } else {
        c = color(255, 255, 255, round(random(15, 20)));
        setcolor = false;
    }
    
    for (let i = 0; i < numBalls; i++) {
        balls[i].collide();
        balls[i].move();
        balls[i].display();
        
    }
}



class Ball {
    
    constructor(x, y, r, id, others) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = id;
        this.others = others;
        
        this.bx = 1;
        this.by = 1;
        this.d = color(0, 255, 255, round(random(230, 255)));
        //this.spring = clts.spr;
        //this.gravity = clts.grav;
        this.friction = clts.fric;
        
        this.xt = random(-1, 1) * 0.125;
        this.yt = random(-1, 1) * 0.125;
    }
    
    collide() {
        this.k = this.id + 1;
        
        for (let i = this.k; i < this.others.length; i++) {
            this.ii = (i + this.k) % this.others.length;
            
            this.bx = this.others[i].x;
            this.by = this.others[i].y;
            this.dx = this.bx - this.x;
            this.dy = this.by - this.y;
            
            this.dist = sqrt(this.dx * this.dx + this.dy * this.dy);
            this.md = this.others[i].r +  this.r;
            
            if (this.dist <= this.md) {
                this.ang = atan2(this.dy, this.dx);
                this.tx = this.x + cos(this.ang) * this.md;
                this.ty = this.y + sin(this.ang) * this.md;
                this.ax = (this.tx - this.others[i].x) * clts.spr;
                this.ay = (this.ty - this.others[i].y) * clts.spr;
                this.xt -= this.ax;
                this.yt -= this.ay;
                this.others[i].xt += this.ax;
                this.others[i].yt += this.ay;
            }
            
            if (this.dist <= this.md + 40) {
                stroke(16, 16, 255, 255);
                strokeWeight(1);
                //line(this.others[i].x, this.others[i].y,this.x,this.y);
            }
        }
    }
    
    move() {
        this.yt += clts.grav;
        this.x += this.xt;
        this.y += this.yt;
        
        if (this.x > (width - this.r)) {
            this.x = width - this.r;
            this.xt *= -this.bx * clts.fric;
        } else if (this.x < this.r) {
            this.x = this.r;
            this.xt *= -this.bx * clts.fric;
        }
        if (this.y > (height - this.r)) {
            this.y = height - this.r;
            this.yt *= -this.by * clts.fric;
        } else if (this.y < this.r) {
            this.y = this.r;
            this.yt *= -this.by * clts.fric;
        }
    }
    
    display() {
        ellipseMode(RADIUS);
        noStroke();
        if (this.id < numBalls - numRedballs) {
            fill(c);
        } else
            fill(this.d);
        ellipse(this.x, this.y, this.r, this.r);
    }
    
}
