/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

const flock = [];

let alignSlider, cohesionSlider, separationSlider;

function setup() {
    createCanvas(700, 500);
    colorMode(HSB, 360, 100, 100, 300);
    alignSlider = createSlider(0, 2, 1.5, 0.1);
    alignSlider.style('width', '150px');
    alignSlider.position(30, 160);
    cohesionSlider = createSlider(0, 2, 1, 0.1);
    cohesionSlider.style('width', '150px');
    cohesionSlider.position(30, 260);
    separationSlider = createSlider(0, 2, 2, 0.1);
    separationSlider.style('width', '150px');
    separationSlider.position(30, 360);
    for (let i = 0; i < 200; i++) {
        flock.push(new Boid());
    }
    
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
