/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 10-Sep-2018
 */

let numMax = 500;
let t = 0;
let h = 0.01;
let particles = [];

let xmax = 4.5;
let xmin = -4.5;
let ymax = 3;
let ymin = -3;
let sc = 0.3;
let xstep = 0.4;
let ystep = 0.4;

let currentParticle = 0;

let fshow = false;
let tshow = false;

let buttonTrace;
let buttonField;

let WIDTH = 900;
let HEIGHT = 600;
let frameWidth = WIDTH/100;
let frameHeight = HEIGHT/100;

function setup() {
    createCanvas(windowWidth, windowHeight);
    controls();
    
}

function fieldShow() {
    
    if(fshow==false) {
        fshow = true;
    } else{
        fshow = false;
    }
    
    if(tshow==true) {
        tshow = false;
    }
    
}

function traceShow() {
    if(tshow==false) {
        tshow = true;
    }else{
        tshow = false;
    }
    
    if(fshow==true) {
        fshow = false;
    }
    
}

function draw() {
    
    //This is for drawing the trace of particles
    if(tshow==true){
        fill(0,6);
    } else{
        fill(0,100);
    }
    stroke(255);
    strokeWeight(0.5);
    rect(0,0,width,height);
    //////////////////////////
    
    translate(width/2, height/2);//we need the oringin at the center
    
    t += h;
    
    if(mouseIsPressed){
        if(mouseButton == LEFT){
            let splatter = 0.4;
            let newx = map(mouseX, 0, width, -5, 5);
            let newy = map(mouseY,  height, 0, -3.5, 3.5);
            particles[currentParticle] = new Particle(newx+random(-splatter,splatter), newy+random(-splatter,splatter), t,h);
            currentParticle++;
            if (currentParticle >= numMax)
            {
                currentParticle = 0;
            }
        }
    }
    
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > 6 ||  p.y > 6 || p.x < -6 ||  p.y < -6 ) {
            particles.splice(i,1);
            currentParticle--;
        }
    }
    
    if(fshow == true){
        field(t);
    }
    
    //println(currentParticle);
    
}

///

let P = (t, x, y) =>  1.5*( cos(y+ t)  );//Change this function

let Q = (t, x, y) => 1.5*(  sin(x- 1/2*t)  );//Change this function


function Particle(_x, _y, _t, _h) {
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(4,6);
    this.h = _h;
    this.rad = random(4,19);
    this.n = Math.round(random(3,10));
    this.op = random(187,200);
    this.r = random(0,255);
    this.g = random(50,155);
    this.b = random(200,255);
    this.lifespan = 700.0;
    
    
    this.update = function() {
        this.k1 = P(this.time, this.x, this.y);
        this.j1 = Q(this.time, this.x, this.y);
        this.k2 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.j2 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.k3 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.j3 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.k4 = P(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.j4 = Q(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.x = this.x + this.h/6 *(this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
        this.y = this.y + this.h/6 *(this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
        this.time += this.h;
        //this.lifespan -= 1.0;
    };
    
    this.display = function() {
        
        fill(this.r, this.g, this.b, this.op);
        stroke(this.r, this.g, this.b);
        beginShape();
        for(let i=0; i<=this.n; i++){
            this.nextx;
            this.nexty;
            this.updatex = map(this.x, -9, 9, -width, width);
            this.updatey = map(-this.y, -7, 7, -height, height);
            this.nextx = this.updatex + this.rad * cos(i*2*PI/this.n);
            this.nexty = this.updatey + this.rad * sin(i*2*PI/this.n);
            vertex(this.nextx, this.nexty);
        }
        endShape(CLOSE);
    };
}

function controls() {
    buttonTrace = createButton('Trace');
    buttonTrace.position(width/20, height*0.05);
    buttonTrace.mousePressed(traceShow);
    
    buttonField = createButton('Field');
    buttonField.position(width/20, height*0.05+40);
    buttonField.mousePressed(fieldShow);
    
}

function field(_time) {
    this.time = _time;
    for(let k=ymin; k<=ymax; k+=ystep){
        for(let j=xmin; j<=xmax; j+=xstep){
            let xx = j + sc * P(this.time, j, k);
            let yy = k + sc * Q(this.time, j, k);
            let lj = map(j, -9.9, 9.9, -width, width);
            let lk = map(-k, -7, 7, -height, height);
            let lx = map(xx, -9.9, 9.9, -width, width);
            let ly = map(-yy, -7, 7, -height, height);
            let angle = atan2(ly-lk, lx-lj);
            let dist = sqrt((lk-ly)*(lk-ly)+(lj-lx)*(lj-lx));
            fill(210,dist);
            noStroke();
            push();
            translate(lj, lk);
            rotate(angle);
            triangle(-10, -4, 10, 0, -10, 4);
            pop();
        }
    }
    
}
