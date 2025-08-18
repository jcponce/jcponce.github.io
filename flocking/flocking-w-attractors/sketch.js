/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 16/Aug/2025
 */

const flock = [];
const attractors = [];
let quadTree;

const controls = {
    align: 1.5,
    cohesion: 1,
    separation: 2,
    trace: true,
    numParticles: 600
};

// Palette colors for particles
const palette = [
    [255, 228, 75],   // Bright yellow
    [5, 130, 1],      // Dark green
    [123, 0, 255],    // Vivid purple
    [255, 85, 0],     // Deep orange
    [255, 29, 255],   // Bright pink
    [46, 46, 255],    // Deep blue
    [255, 0, 128]     // Strong pink
];

// Attractor colors
const attractorColors = [
    [0, 191, 255],    // Cyan
    [0, 255, 179],    // Mint
    [255, 0, 0]       // Red
];

const ATTRACTION_RADIUS = 130;
const FORCE_PULSE_SPEED = 0.02;

class Attractor {
    constructor(pos, index) {  // Add index parameter
        this.position = pos;
        this.baseStrength = 0.4;
        this.currentStrength = 0;
        this.pulsePhase = random(TWO_PI);
        this.color = color(attractorColors[index % attractorColors.length]); // Use index to get unique color
        this.radius = random(15, 25);
        this.influenceColor = color(attractorColors[index % attractorColors.length]); // Color to apply to boids
    }

    update() {
        // Pulsing effect using sine wave
        this.pulsePhase += FORCE_PULSE_SPEED;
        this.currentStrength = this.baseStrength * (0.8 + 0.2 * sin(this.pulsePhase));
    }

    display() {
        // Always show attractor
        noStroke();
        // fill(this.color);
        noFill();
        ellipse(this.position.x, this.position.y, this.radius, this.radius);

        // Show pulsating influence radius, if needed
        // noFill();
        // stroke(this.color);
        // strokeWeight(2);
        // let pulseSize = map(sin(this.pulsePhase), -1, 1, 0.8, 1.2);
        // ellipse(this.position.x, this.position.y, 
        //        ATTRACTION_RADIUS * 2 * pulseSize, 
        //        ATTRACTION_RADIUS * 2 * pulseSize);
    }

    getStrength() {
        return this.currentStrength;
    }
}

class Boid {
    constructor() {
        this.position = createVector(random(0, width), random(0, height));
        this.velocity = p5.Vector.random2D().mult(random(1.5, 3.5));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 2.5;
        this.col = color(random(palette));

        this.originalCol = color(random(palette)); // Store original color
        this.currentCol = this.originalCol; // Current display color
        this.colorTransitionSpeed = 0.05; // How fast color changes
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    align(boids) {
        let perceptionRadius = 30;
        let perceptionCount = 5;
        let steering = createVector();
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            steering.add(other.velocity);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 30;
        let perceptionCount = 5;
        let steering = createVector();
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            const diff = p5.Vector.sub(this.position, other.position);
            const d = diff.mag();
            if (d === 0) continue;
            diff.div(d * d);
            steering.add(diff);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 50;
        let perceptionCount = 5;
        let steering = createVector();
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            steering.add(other.position);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment.mult(controls.align);
        cohesion.mult(controls.cohesion);
        separation.mult(controls.separation);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    applyAttractors() {
        let totalForce = createVector(0, 0);
        let attractorCount = 0;

        // Accumulate forces from all nearby attractors
        for (let attractor of attractors) {
            let d = p5.Vector.dist(this.position, attractor.position);
            if (d < ATTRACTION_RADIUS) {
                // Calculate attraction force (stronger when closer)
                let strength = attractor.getStrength() * (1 - d / ATTRACTION_RADIUS);
                let desired = p5.Vector.sub(attractor.position, this.position);
                desired.normalize();
                desired.mult(strength);
                totalForce.add(desired);
                attractorCount++;
            }
        }

        // Apply average force if we found any attractors
        if (attractorCount > 0) {
            totalForce.div(attractorCount);
            this.acceleration.add(totalForce);
        }
    }

    updateColor() {
        let closestAttractor = null;
        let minDist = Infinity;
        let targetColor = this.originalCol;

        // Find closest attractor
        for (let attractor of attractors) {
            let d = p5.Vector.dist(this.position, attractor.position);
            if (d < ATTRACTION_RADIUS && d < minDist) {
                minDist = d;
                closestAttractor = attractor;
            }
        }

        // If near an attractor, set target to attractor's color
        if (closestAttractor) {
            // Calculate color intensity based on distance (closer = stronger color)
            let intensity = map(minDist, 0, ATTRACTION_RADIUS, 1, 0);
            targetColor = lerpColor(this.originalCol, closestAttractor.influenceColor, intensity);
        }

        // Smoothly transition to target color
        this.currentCol = lerpColor(this.currentCol, targetColor, this.colorTransitionSpeed);
    }

    update() {
        this.applyAttractors();
        this.updateColor();
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show() {
        noStroke();
        fill(this.currentCol); // Use currentCol instead of this.col
        circle(this.position.x, this.position.y, 13);
    }
}

class QuadTreeItem {

    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.data = data;
    }

}

class QuadTreeBin {

    /*
     * @param maxDepth The maximum number of permitted subdivisions.
     * @param maxItemsPerBin The maximum number of items in a single bin before it is subdivided.
     * @param extent A `Rect` instance specifying the bounds of this `QuadTreeBin` instance within the QuadTree domain.
     * @param depth For internal use only.
     */
    constructor(maxDepth, maxItemsPerBin, extent, depth = 0) {
        this.rect = extent.copy();
        this.bins = null;
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.items = [];
        this.depth = depth;
    }

    /*
     * Check if a point is within the extent of a `QuadTreeBin` instance.
     * Returns true if so, false otherwise.
     * @param range Used to check if a point is within a radius of the extent border.
     */
    checkWithinExtent(x, y, range = 0) {
        return x >= this.rect.x - range && x < this.rect.x + this.rect.width + range &&
            y >= this.rect.y - range && y < this.rect.y + this.rect.height + range;
    }

    /*
     * Adds an item to the `QuadTreeBin`.
     * @param item An instance of `QuadTreeItem`.
     */
    addItem(item) {
        if (this.bins === null) {
            this.items.push(item);
            if (this.depth < this.maxDepth && this.items !== null && this.items.length > this.maxItemsPerBin)
                this.subDivide();
        } else {
            const binIndex = this._getBinIndex(item.x, item.y);
            if (binIndex != -1)
                this.bins[binIndex].addItem(item);
        }
    }

    /*
     * Returns a list of items from the bin within the specified radius of the coordinates provided.
     */
    getItemsInRadius(x, y, radius, maxItems) {
        const radiusSqrd = radius ** 2;
        let items = [];

        if (this.bins) {
            for (let b of this.bins)
                if (b.checkWithinExtent(x, y, radius))
                    items.push(...b.getItemsInRadius(x, y, radius, maxItems));
        } else {
            for (let item of this.items) {
                const distSqrd = (item.x - x) ** 2 + (item.y - y) ** 2;
                if (distSqrd <= radiusSqrd)
                    items.push({ distSqrd: distSqrd, data: item.data });
            }
        }

        return items;
    }

    /*
     * Split a `QuadTreeBin` into 4 smaller `QuadTreeBin`s.
     * Removes all `QuadTreeItem`s from the bin and adds them to the appropriate child bins.
     */
    subDivide() {
        if (this.bins !== null) return;
        this.bins = [];
        let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
        for (let i = 0; i < 4; ++i)
            this.bins.push(new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(this.rect.x + i % 2 * w, this.rect.y + Math.floor(i * 0.5) * h, w, h), this.depth + 1));

        for (let item of this.items) {
            const binIndex = this._getBinIndex(item.x, item.y);
            if (binIndex != -1)
                this.bins[binIndex].addItem(item);
        }

        this.items = null;
    }

    /*
     * Renders the borders of the `QuadTreeBin`s within this `QuadTreeBin`.
     * For debugging purposes.
     */
    debugRender(renderingContext) {
        noFill();
        //stroke('#aaa');
        //strokeWeight(1);
        noStroke();
        rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        if (this.bins)
            for (let b of this.bins)
                b.debugRender(renderingContext);
    }

    /*
     * Private.
     */
    _getBinIndex(x, y, range = 0) {
        if (!this.checkWithinExtent(x, y)) return -1;
        let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
        let xx = Math.floor((x - this.rect.x) / w);
        let yy = Math.floor((y - this.rect.y) / h);
        return xx + yy * 2;
    }

}

class QuadTree {

    /*
     * @param maxDepth The maximum number of permitted subdivisions.
     * @param maxItemsPerBin The maximum number of items in a single bin before it is subdivided.
     * @param extent A `Rect` instance specifying the bounds of this `QuadTreeBin` instance within the QuadTree domain.
     */
    constructor(maxDepth, maxItemsPerBin, extent) {
        this.extent = extent.copy();
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.clear();
    }

    /*
     * Remove all `QuadTreeItem`s and `QuadTreeBin`s from the QuadTree leaving it completely empty.
     */
    clear() {
        this.rootBin = new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(0, 0, this.extent.width, this.extent.height));
    }

    /*
     * Add an item at a specified position in the `QuadTree`.
     * @param x The x coordinate of the item.
     * @param y The y coordinate of the item.
     * @param item The user-defined data structure to store in the `QuadTree`.
     */
    addItem(x, y, item) {
        this.rootBin.addItem(new QuadTreeItem(x, y, item));
    }

    /*
     * Returns a list of items within the specified radius of the specified coordinates.
     */
    getItemsInRadius(x, y, radius, maxItems) {
        if (maxItems === undefined) {
            return this.rootBin.getItemsInRadius(x, y, radius);
        } else {
            return this.rootBin.getItemsInRadius(x, y, radius)
                .sort((a, b) => a.distSqrd - b.distSqrd)
                .slice(0, maxItems)
                .map(v => v.data);
        }
    }

    /*
     * Renders the borders of the `QuadTreeBin`s within this `QuadTree`.
     * For debugging purposes.
     */
    debugRender(renderingContext) {
        this.rootBin.debugRender(renderingContext);
    }

}

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

// Add this at the end of your code, after all class definitions
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Update quad tree bounds
    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));

    // Reset attractor positions (same logic as setup)
    const frame = 100;
    if (attractors.length >= 1) {
        attractors[0].position = createVector(
            random(frame, width / 3 - frame),
            random(frame, 2 * height / 3 - frame)
        );
    }
    if (attractors.length >= 2) {
        attractors[1].position = createVector(
            random(width / 3 + frame, 2 * width / 3 - frame),
            random(2 * height / 3 - frame, height - frame)
        );
    }
    if (attractors.length >= 3) {
        attractors[2].position = createVector(
            random(2 * width / 3 + frame, width - frame),
            random(height / 3 - frame, 2 * height / 3 - frame)
        );
    }

    // Reset the trace if not in trace mode
    if (!controls.trace) {
        background(0);
    }
}

// Function to toggle full screen mode
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Event listener for keydown event
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        toggleFullScreen();
    }
});

// Make a new boid
function pushRandomBoid() {
    let boid = new Boid(); // Create a new boid
    flock.push(boid); // Add the new boid to the flock
}

/* Setup and Draw functions */
function setup() {
    createCanvas(windowWidth, windowHeight);

    quadTree = new QuadTree(6, 20, new Rect(0, 0, width, height));

    // Update your attractor creation in setup():
    const frame = 100;
    posA = createVector(random(frame, width / 3 - frame), random(frame, 2 * height / 3 - frame));
    attractors.push(new Attractor(posA, 0)); // Pass index 0
    posB = createVector(random(width / 3 + frame, 2 * width / 3 - frame), random(2 * height / 3 - frame, 3 * height / 3 - frame));
    attractors.push(new Attractor(posB, 1)); // Pass index 1
    posC = createVector(random(2 * width / 3 + frame, 3 * width / 3 - frame), random(height / 3 - frame, 2 * height / 3 - frame));
    attractors.push(new Attractor(posC, 2)); // Pass index 2

    // // create gui (dat.gui) if needed
    // let gui = new dat.GUI({
    //     width: 295
    // });
    // gui.add(controls, 'align', 0, 3).name("Align").step(0.1);
    // gui.add(controls, 'cohesion', 0, 3).name("Cohesion").step(0.1);
    // gui.add(controls, 'separation', 0, 3).name("Separation").step(0.1);
    // gui.add(controls, 'numParticles', 0, 800).name("Num Particles").step(1);
    // gui.add(controls, 'trace').name("Trace").listen();
    // for (let i = 0; i < controls.numParticles; i++) {
    //     pushRandomBoid(); 
    // }
    // gui.close();

    // Initialize all particles
    for (let i = 0; i < controls.numParticles; i++) {
        pushRandomBoid();
    }

}

function draw() {

    //This is for drawing the trace of particles
    if (controls.trace == true) {
        background(0, 10);
    } else {
        background(0);
    }

    quadTree.clear();
    for (const boid of flock) {
        quadTree.addItem(boid.position.x, boid.position.y, boid);
    }
    //if(controls.quad3 == true){
    // quadTree.debugRender();
    //}

    // Update and display attractors
    for (let attractor of attractors) {
        attractor.update();
        attractor.display();
    }

    for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        boid.show();
    }

    // Adjust the amount of boids on screen according to the slider value
    // let maxBoids = controls.numParticles;
    // let difference = flock.length - maxBoids;
    // if (difference < 0) {
    //     for (let i = 0; i < -difference; i++) {
    //         pushRandomBoid(); // Add boids if there are less boids than the slider value
    //     }
    // } else if (difference > 0) {
    //     for (let i = 0; i < difference; i++) {
    //         flock.pop(); // Remove boids if there are more boids than the slider value
    //     }
    // }
}