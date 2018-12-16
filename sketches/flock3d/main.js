/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Dec-2018
 */

// Original code:
// Flocking by
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

let easycam;

const flock = [];

let Controls = function() {
    this.align = 1.5;
    this.cohesion = 1;
    this.separation = 2;
    
};

let controls = new Controls();

function setup() {
    //createCanvas(windowWidth, windowHeight);
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 1200});
    
    colorMode(HSB, 360, 100, 100, 300);
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 295});
    gui.close();
    gui.add(controls, 'align', 0, 2).name("Align").step(0.1);
    gui.add(controls, 'cohesion', 0, 2).name("Cohesion").step(0.1);
    gui.add(controls, 'separation', 0, 2).name("Separation").step(0.1);
    gui.add(this, 'sourceCode').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    
    for (let i = 0; i < 200; i++) {
        flock.push(new Boid());
    }
    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
    
}

function sourceCode() {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/tree/master/sketches/flock";
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function draw() {
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    background(0);
    
    rotateX(1.5)
    rotateY(0.0);
    rotateZ(0.3);
    
    
    
    ambientLight(80);
    pointLight(100, 0, 100, 90, -50, 50);
    
    
    for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        boid.show();
    }
    stroke(80)
    strokeWeight(2);
    /*
     (1, 1, 1)
     (-1, -1, 1)
     (1, -1, 1)
     (-1, 1, 1)
     (1, 1, -1)
     (-1, -1, -1)
     (1, -1, -1)
     (-1, 1, -1)
     
     */
    //side faces
    line(700, 700, 700, 700,700, -700);
    line(-700, -700, 700, -700, -700, -700);
    line(700, -700, 700, 700, -700, -700);
    line(-700, 700, 700, -700, 700, -700);
    
    //up face
    line(700, 700, 700, 700, -700, 700);
    line(700, -700, 700, -700, -700, 700);
    line(-700, -700, 700, -700, 700, 700);
    line(-700, 700, 700, 700, 700, 700);
    
    //down face
    line(700, 700, -700, 700, -700, -700);
    line(700, -700, -700, -700, -700, -700);
    line(-700, -700, -700, -700, 700, -700);
    line(-700, 700, -700, 700, 700, -700);
    
    /*
    strokeWeight(0.01);
    stroke( 0, 100,  100); line(0,0,0,1,0,0);
    stroke( 30, 100,  100); line(0,0,0,0,1,0);
    stroke( 70, 100,  100); line(0,0,0,0,0,1);
    // Draw the corners of a box showing the space where boids can fly
    stroke(80);
    strokeWeight(1);
    noFill();
    box(700, 700, 700);
     */
    
    
}
