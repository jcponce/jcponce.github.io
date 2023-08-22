let numB = 150;
let ballArray = [];
let colors = [
	'#390099', '#9e0059', '#ff0054', '#ff5400', '#ffbd00'

];

let gravity = 0.26;
let friction = 0.95;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	for(let i = 0; i < numB; i++) {
		let radius = random(8, 23);
		let x = random(radius, width - radius);
		let y = random(0, height - radius - 150);
		let dx = random(-3, 3)
		let dy = random(-1, 1)
	  ballArray.push(new Ball(x, y, dx, dy, radius, random(colors)));
	
	}
	
}

function draw() {
	background(255);
	
	fill(255,10);
	rect(0,0,width-0.5, height-0.5);

	if(mouseIsPressed){
		gravity = -0.0000000000001;
	} else{
		gravity = 0.26;
	}
	
	for (let v of ballArray) {
		v.update();
	}
}

// Class for bouncing balls
function Ball(x, y, dx, dy, radius, color) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = color;

	this.update = function() {
		if (this.y + this.radius + this.dy > height || this.y + this.radius + this.dy <= -400) {
			this.dy = -this.dy;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
		} else {
			this.dy += gravity;
		}

		if (this.x + this.radius >= width || this.x - this.radius <= 0) {
			this.dx = -this.dx * friction;
		}

		this.x += this.dx;
		this.y += this.dy;
		this.display();
	};

	this.display = function() {
		fill(this.color);
		ellipse(this.x, this.y, 2*this.radius);	
	};
}