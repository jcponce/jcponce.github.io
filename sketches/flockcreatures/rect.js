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

/*
 * A rectangle with `x` and `y` coordinates specifying the top-left corner and a `width` and `height`
 */

// Quadtree by
// https://github.com/TheTastefulToastie

class Rect {
    
    // By default, positioned at [0, 0] with a width and height of 1
    constructor(x = 0, y = 0, width = 1, height = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    /*
     * Return a new rectangle instance with the same values
     */
    copy() {
        return new Rect(this.x, this.y, this.width, this.height);
    }
    
}
