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

const flock = [];

let Controls = function() {
    this.align = 1.5;
    this.cohesion = 1;
    this.separation = 2;
    //this.quad3 = false;
    this.numPoly = 150;
};

let controls = new Controls();

let quadTree;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 300);
    
    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
    
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 295});
    gui.close();
    gui.add(controls, 'align', 0, 3).name("Align").step(0.1);
    gui.add(controls, 'cohesion', 0, 3).name("Cohesion").step(0.1);
    gui.add(controls, 'separation', 0, 3).name("Separation").step(0.1);
    gui.add(controls, 'numPoly', 0, 300).name("Num Polygons").step(1);
    //gui.add(controls, 'quad3').name("Quadtree").listen();
    gui.add(this, 'sourceCode').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    
    for (let i = 0; i < controls.numPoly; i++) {
        pushRandomBoid();//flock.push(new Boid());
    }
    
}

function sourceCode() {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/tree/master/sketches/flock";
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function draw() {
    
    background(0);
    
    
    quadTree.clear();
    for (const boid of flock) {
        quadTree.addItem(boid.position.x, boid.position.y, boid);
    }
    //if(controls.quad3 == true){
        quadTree.debugRender();
    //}
    
    
    for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        boid.show();
    }
    
    // Adjust the amount of boids on screen according to the slider value
    let maxBoids = controls.numPoly;
    let difference = flock.length - maxBoids;
    if (difference < 0) {
        for (let i = 0; i < -difference; i++) {
            pushRandomBoid(); // Add boids if there are less boids than the slider value
        }
    } else if (difference > 0) {
        for (let i = 0; i < difference; i++) {
            flock.pop(); // Remove boids if there are more boids than the slider value
        }
    }
}

// Make a new boid
function pushRandomBoid() {
    let boid = new Boid(); // Create a new boid
    flock.push(boid); // Add the new boid to the flock
}
