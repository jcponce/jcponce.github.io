/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 15-Dec-2018
 */

// Original code:
// Flocking by
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

const flock = [];
var simplex;

let Controls = function() {
    this.align = 1.5;
    this.cohesion = 1;
    this.separation = 2;
    this.numPoly = 50;
};

let controls = new Controls();

let quadTree;

function setup() {
    createCanvas(windowWidth, windowHeight);
    simplex = new SimplexNoise();
    // https://coolors.co/d3bdb0-c1ae9f-89937c-715b64-69213f
    colors = new Gradient();
    colors.addColor(color('#D3BDB0'));
    colors.addColor(color('#C1AE9F'));
    colors.addColor(color('#89937C'));
    colors.addColor(color('#715B64'));
    colors.addColor(color('#D3BDB0'));
    
    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
    
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 295});
    gui.close();
    gui.add(controls, 'align', 0, 2.5).name("Alignment").step(0.1);
    gui.add(controls, 'cohesion', 0, 2.5).name("Cohesion").step(0.1);
    gui.add(controls, 'separation', 0, 2.5).name("Separation").step(0.1);
    gui.add(controls, 'numPoly', 0, 100).name("Num Creatures").step(1);
    gui.add(this, 'sourceCode').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    
    for (let i = 0; i < controls.numPoly; i++) {
        pushRandomBoid();//flock.push(new Boid());
    }
    blendMode(BLEND);
    
    
}

function sourceCode() {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/tree/master/sketches/flockcreatures";
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
    
    quadTree.debugRender();
    
    
    noFill();
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
