// A fork from Aaron Reuland
// https://openprocessing.org/user/183691?view=sketches&o=48

let bubbles=[]
let self, c

function preload(){
self= loadImage('self.jpg');

}

function setup() {
	createCanvas(200,200);
	for(let i=0; i<200; i++){
		bubbles.push(new colorbubble());
	}
}

function draw() {
	clear();
	for(let i=0; i<100; i++){
	bubbles.push(new colorbubble())
	}
	for(let colorbubble of bubbles){
		colorbubble.move();
		colorbubble.delete();
		colorbubble.display();
	}
}

class colorbubble {
	constructor(){
		this.pos= new p5.Vector(randomGaussian(width/2, 10), random(0, height))
		this.vel= new p5.Vector(0, 0)
		this.acc= new p5.Vector(random(-0.1, 0.1), -0.03)
		this.size= random (0.5, 5)
	}
	
	move(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}
	
	delete(){
		if (this.pos.x > width + this.size*2 || this.pos.x < 0- this.size*2) {
      let index = bubbles.indexOf(this);
      bubbles.splice(index, 1);
    }
	}
	
	display(){
		noStroke();
		c=self.get(this.pos.x, this.pos.y)
		fill(c)
		ellipse(this.pos.x, this.pos.y, this.size)
	}
}