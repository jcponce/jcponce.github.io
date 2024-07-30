/*
 * Original Processing project: My Life Aquatic 
 * by David Leibovic and Sunah Suh
 * https://github.com/dasl-/my-life-aquatic
 */

class Bubble extends Boid {
	constructor(myColor) {
		let location = createVector(int(random(0, width - 1)), height - 1);
		let velocity = createVector(0, -1);
		super(location, 0.8, 0.2, velocity);
		this.diameter = int(random(30, 50));
		this.mainColor = myColor;
	}

	render() {
		smooth();
		stroke(this.mainColor);
		strokeWeight(3);
		noFill();
		ellipseMode(CENTER);
		ellipse(this.location.x, this.location.y, this.diameter, this.diameter);
	}

	update() {
		this.velocity.x = random(-0.4, 0.4);
		super.update();
	}
}