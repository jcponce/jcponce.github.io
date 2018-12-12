/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
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
    
};

let controls = new Controls();

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 300);
    // create gui (dat.gui)
    let gui = new dat.GUI({width: 295});
    gui.close();
    gui.add(controls, 'align', 0, 2).name("Align").step(0.1);
    gui.add(controls, 'cohesion', 0, 2).name("Cohesion").step(0.1);
    gui.add(controls, 'separation', 0, 2).name("Separation").step(0.1);
    gui.add(this, 'backHome').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    
    for (let i = 0; i < 200; i++) {
        flock.push(new Boid());
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
    for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        boid.show();
    }
}
