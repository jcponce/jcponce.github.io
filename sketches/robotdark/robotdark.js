/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 17-Nov-2018
 */

// Last update ??

// based on Daniel Shiffman's example on www.natureofcode.com
// and this https://www.openprocessing.org/sketch/629040/ by
// Tianyao Dai https://www.openprocessing.org/user/140248

let particles = [];
let pushed = false;
let color = 360;

//let beating = 0;
//let speed;

let clts = {
    
title: 'Particle system',
inst: 'Click mouse',
Up: false,
    
};

let gv = -1;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 300);
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 295});
    gui.close();
    gui.add(clts, 'title').name("Polygons:");
    gui.add(clts, 'inst').name("Instructions:");
    gui.add(clts, 'Up').name("Gravity").onChange(applyGravity);
    gui.add(this, 'backHome').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
}

function applyGravity() {
    if(clts.Up == false){
        gv = -1;
    }else {
        gv = 1;
    }
}

function sourceCode() {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/tree/master/sketches/robotdark";
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function draw() {
    background('black');
    cursor(HAND);
    
    
    
    if (pushed) {
        particles.push(new Particle(createVector(mouseX, mouseY)));
    } else {
        particles.push(new Particle(createVector(width / 2, height/2+70))); //chu shi zhi
    }
    for (var i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].paint();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
    console.log(paint);
    
    robot();
    
}

function Particle(_loc) {
    
    var loc = _loc.copy();
    var vel = createVector(random(-1, 1), random(-2, 0));
    var acc = createVector(0, gv * 0.04);
    var lifespan = 255;
    var h = random(360);
    var sz = random(9, 32);
    var n = Math.round(random(3,10));
    
    // Method to update location
    this.update = function() {
        vel.add(acc);
        loc.add(vel);
        lifespan -= 2;
    }
    
    // Method to display
    this.paint = function() {
        stroke(h, 98, 98, lifespan);
        strokeWeight(2);
        fill(h, 98, 58, lifespan);
        //ellipse(loc.x, loc.y, sz, sz);
        beginShape();
        for(let i=0; i<=n; i++){
            let nextx, nexty;
            nextx = loc.x + sz * cos(i*2*PI/n);
            nexty = loc.y + sz * sin(i*2*PI/n);
            vertex(nextx, nexty);
        }
        endShape(CLOSE);
    }
    
    // Is the particle still useful?
    this.isDead = function() {
        if (lifespan < 0.0) {
            return true;
        } else {
            return false;
        }
    }
}

function mouseReleased() {
    pushed = !pushed;
    paint = !paint;
}

//function windowResized() {
//   resizeCanvas(windowWidth, windowHeight - 4);
//}

function hearts(x, y, w, h) {
    w /= 2
    h /= 2
    push();
    translate(x, y - h * 0.7);
    beginShape();
    vertex(0, 0.3 * h);
    bezierVertex(0.25 * w, -0.5 * h, 1 * w, -0.5 * h, 1 * w, 0.25 * h);
    bezierVertex(1 * w, 0.5 * h, 1 * w, 1 * h, 0 * w, 1.6 * h);
    vertex(0, 1.60 * h);
    bezierVertex(-1 * w, 1 * h, -1 * w, 0.5 * h, -1 * w, 0.25 * h);
    bezierVertex(-1 * w, -0.5 * h, -0.25 * w, -0.5 * h, 0 * w, 0.3 * h);
    endShape(CLOSE);
    pop();
    //print(lerp(-0.5, 1.6, 0.5))
}

let paint = false;

function robot(){
    rectMode(CENTER);
    //Body
    if (pushed) {
        fill(0, 0, 20);
    }else {
        fill(0);
    }
    rect(width/2,2*height/8+75,15,20);//neck
    
    if (pushed) {
        stroke(0, 0, 70);
    }else {
        stroke(20);
    }
    
    
    rect(width/2,2*height/8+40,100,70);//head
    
    rect(width/2,2*height/8+125,80,80);//chest
    
    rect(width/2-58,2*height/8+40,10,30);//right ear
    rect(width/2+58,2*height/8+40,10,30);//left ear
    
    rect(width/2-50,2*height/8+130,15,60);//right arm
    rect(width/2+50,2*height/8+130,15,60);//left arm
    
    rect(width/2-15,2*height/8+195,15,55);//right leg
    rect(width/2+15,2*height/8+195,15,55);//left leg
    
    rect(width/2-25,2*height/8-3,10,10);//right antena
    rect(width/2+25,2*height/8-3,10,10);//left antena
    
    //Eyes
    eye("LeftEye",width/2-20,2*height/8+30,20,0.8);
    eye("RightEye",width/2+20,2*height/8+30,20,0.8);
    
    //mouth
    if (paint==true) {
        fill(60);
    } else {
        fill(0);
    }
    arc(width/2-4, 2*height/8+55, 20, 20, 0, PI + QUARTER_PI, CHORD);
    stroke(70);
    noFill();
    arc(width/2-4, 2*height/8+55, 20, 20, 0, PI + QUARTER_PI, OPEN);
}


function eye(spec,xpos,ypos,size,sens){
name: spec;
    
    let xDis = width-xpos+size;
    let yDis = height-ypos+size;
    //print(xpos-size);
    //let d = dist(xpos, ypos, mouseX, mouseY);
    let upXpos= map(mouseX,-size,width+size,-(size*sens),width+size);
    let upYpos= map(mouseY,-size,height+size,-(size*0.5*sens),height+(size*0.5));
    
    
    //How do you creat a circular constraint area??
    let pubXpos= constrain(upXpos, xpos-(size/4),xpos+(size/4));
    let pubYpos= constrain(upYpos, ypos-(size/4),ypos+(size/4));
    
    noStroke();
    fill(255);
    ellipseMode(CENTER);
    ellipse(xpos,ypos,size);
    
    //Pupil
    fill(0);
    ellipse(pubXpos,pubYpos,size/3);
}
