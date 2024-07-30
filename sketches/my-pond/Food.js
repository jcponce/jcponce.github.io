/*
 * Original Processing project: My Life Aquatic 
 * by David Leibovic and Sunah Suh
 * https://github.com/dasl-/my-life-aquatic
 */

class Food {
	constructor(location) {
		this.velocity = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
		this.age = 0;
		this.colors = ['#C96164', '#E8C64D', '#9EB53F', '#5D966C'];
		let c = int(random(4));

		this.numSides = 8;
		this.verts = new Array(this.numSides).fill().map(() => new Array(2).fill(0));

		this.createFood(location, this.colors[c], false);
	}

	createFood(location, color, isDead) {
		this.location = location;
		this.ageSpan = 300; // or random(100, 200);
		this.color = color;
		this.isDead = isDead;
		this.isDummy = false;

		let k = TWO_PI / this.numSides;
		for (let i = 0; i < this.numSides; i++) {
			this.verts[i][0] = cos(k * i) * random(3, 15);
			this.verts[i][1] = sin(k * i) * random(3, 15);
		}
	}

	update() {
		this.location.add(this.velocity);
		this.age++;
		if (this.age >= this.ageSpan) {
			this.isDead = true;
		}
	}

	render() {
		noStroke();
		fill(this.color);
		push();
		translate(this.location.x, this.location.y);
		scale(1 - this.age / this.ageSpan);
		beginShape(TRIANGLE_FAN);
		for (let i = 0; i < this.numSides; i++) {
			vertex(this.verts[i][0], this.verts[i][1]);
		}
		endShape();
		pop();
	}

	getIsDead() {
		return this.isDead;
	}

	setIsDead(isDead) {
		this.isDead = isDead;
	}

	getVelocity() {
		return this.velocity;
	}

	getLocation() {
		return this.location;
	}

	setLocation(location) {
		this.location = location;
	}

	getColor() {
		return this.color;
	}

	getAge() {
		return this.age;
	}

	setAge(age) {
		this.age = age;
	}

	setIsDummy(isDummy) {
		this.isDummy = isDummy;
	}

	getIsDummy() {
		return this.isDummy;
	}
}