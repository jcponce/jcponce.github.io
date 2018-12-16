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

let depth = 350; // The Z location of the boid tend to stay between +depth/2 and -depth/2
let gap = 100; // Boids can go further than the edges, this further distance is the gap


let quadTree; // A quad tree to minimize the cost of distance calculation
let unitX, unitY, unitZ; // Unit vectors pointing in the X, Y, and Z directions

let useQuadTree = true; // Toogle the use of a quad tree
let showPerceptionRadius = false; // Toogle vizualization of perception radius
let goMiddle = false; // Pressing "a" toogle it, making all boids go to the center

let t = 0; // Counts the frame from the time boids go out of the middle of space

const flock = [];

let Controls = function() {
    this.perception = 90;
    this.align = 1;
    this.cohesion = 1;
    this.separation = 1;
    
};

let controls = new Controls();

function setup() {
    //createCanvas(windowWidth, windowHeight);
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 1300});
    
    colorMode(HSB, 360, 100, 100, 300);
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 295});
    gui.close();
    gui.add(controls, 'perception', 0, 900).name("Perception").step(1);
    gui.add(controls, 'align', 0, 5).name("Align").step(0.1);
    gui.add(controls, 'cohesion', 0, 5).name("Cohesion").step(0.1);
    gui.add(controls, 'separation', 0, 5).name("Separation").step(0.1);
    gui.add(this, 'sourceCode').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    
    for (let i = 0; i < 200; i++) {
         pushRandomBoid();//flock.push(new Boid());
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
    
    
    // Make the quad tree
    let boundary = new Cube(0, 0, 0, 700, 700, 700);
    quadTree = new QuadTree(boundary, 4);
    for (let boid of flock) {
        quadTree.insert(boid);
    }
    
    // Each boid determines its acceleration for the next frame
    for (let boid of flock) {
        boid.flock(flock, quadTree);
    }
    // Each boid updates its position and velocity, and is displayed on screen
    for (let boid of flock) {
        boid.update(gap);
        boid.show();
    }
    
    /*
    for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        boid.show();
    }
     */
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
    t++; // t counts the number of frames, it is used to not have cohesion in the first 40 frames
    
}

// Make a new boid
function pushRandomBoid() {
    //let pos = createVector(random(width), random(height), random(-depth/2, depth/2)); // Uncomment and comment next line to create boids at random position
    let pos = createVector(0, 0, 0); // Create a boid at the center of space
    let vel = p5.Vector.random3D().mult(random(0.5, 3)); // Give a random velocity
    let boid = new Boid(pos, vel); // Create a new boid
    flock.push(boid); // Add the new boid to the flock
}
