let max = 70;
let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    smooth();
    for (let i=0; i<max; i++) {
        particles[i] = new Particle();
    }
    
}

function draw() {
    
    for (dot of particles) {
        
        dot.display();
        dot.update();
    }
    
}

class Particle {
    
    constructor() {
        this.x = random(0, width);
        this.y = random(0, height);
        this.r = 250;
        this.R = random(0, 255);
        this.G = random(0, 255);
        this.B = random(0, 255);
    }
    
    display() {
        fill(this.R, this.G, this.B );
        stroke(this.R, this.G, this.B);
        ellipse(this.x, this.y, 2*this.r, 2*this.r);
    }
    
    update() {
        if(this.r >= 0){
            this.r = this.r-0.6;
        }
    }
    
}
