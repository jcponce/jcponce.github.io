/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-June-2018
 */

/*
 This is a p5 version of the amazing code from
 Collision Detection by Jeff Thompson
 http://www.jeffreythompson.org/collision-detection/index.php
 
 I am still working on fixing some details.
 */

// The midi notes of a scale
let notes = [60, 62, 64, 65, 67, 69, 71];
let notesR = [ 51, 52, 55, 57, 58, 59, 61 ];
let index = 0;

let trigger = 0;
let autoplay = false;
let osc;

let numEach = 20;

// circle, controlled by the mouse
let cx = 0;
let cy = 0;
let cr = 30;

// lots of other objects!
let circles = [];
let rectangles = [];
let lines = [];


function setup() {
    //createCanvas(600,400);
    createCanvas(windowWidth, windowHeight);
    background(0);
    // make some cirlces
    for (let i=0; i<numEach; i++) {
        //let c =
        circles[i] = new Circle(random(width), random(-height, height));
        
    }
    
    /*
    // rectangles
    for (let i=0; i<numEach; i++) {
        //let r = new Rectangle(random(width), random(-height,height));
        rectangles[i] =  new Rectangle(random(width), random(-height,height));
        
    }
     */
    
    /*
    // lines
    for (let i=0; i<numEach-10; i++) {
        let x = random(width);
        let y = random(-height,height);
        //let l = new Line(x,y, x+random(-20,20), y+random(-20,20));
        lines[i] = new Line(x,y, x+random(-40,40), y+random(-40,40));
        
    }*/
    //print(lines);
    // and polygons
    //  for (int i=0; i<30; i++) {
    //    Polygon p = new Polygon(random(width), random(-height,height));
    //    Polygon.add(p);
    //  }
    
    // A triangle oscillator
    osc = new p5.TriOsc();
    // Start silent
    osc.start();
    osc.setType('triangle');
    osc.freq(140);
    //osc.amp(0);
    osc.amp(0);
}

function draw() {
    background(255);
    cursor(HAND);
    // update main circle to mouse coordinates
    cx = mouseX;
    cy = mouseY;
    
    // draw us!
    fill(0,150);
    noStroke();
    ellipse(cx, cy, cr*2,cr*2);
    
    // draw the other shapes
    for (let circle of circles) {
        circle.update();
        circle.display();
    }
    //print(circles.length)
    
    for (let rectangle of rectangles) {
        rectangle.update();
        rectangle.display();
    }
    
    for (let line of lines) {
        line.update();
        line.display();
    }
    /* */
    
    
}

// A function to play a note
function playNote(note, duration) {
    osc.freq(midiToFreq(note));
    // Fade it in
    osc.fade(0.4,0.1);
    
    // If we set a duration, fade it out
    if (duration) {
        setTimeout(function() {
                   osc.fade(0,0.1);
                   }, duration-50);
    }
}
