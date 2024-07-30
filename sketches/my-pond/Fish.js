/*
 * Original Processing project: My Life Aquatic 
 * by David Leibovic and Sunah Suh
 * https://github.com/dasl-/my-life-aquatic
 */

class Fish extends Boid {
	constructor(location, maxSpeed, maxForce) {
		super(location, maxSpeed, maxForce);
		this.stripeColor = color(int(random(255)), int(random(255)), int(random(255)));
		this.bodySizeW = random(100, 200);
		this.bodySizeH = this.bodySizeW * 0.3 + random(5);
		this.mousePosition = createVector(0, 0);
		this.lastAteTimer = 0;
		this.isExploding = false;
		this.foodEaten = 0;
		this.transparency = 255;

		this.createFish(location, maxSpeed, maxForce);
	}

	createFish(location, maxSpeed, maxForce) {
		this.mousePositionOld = createVector(this.mousePosition.x, this.mousePosition.y);
		this.mainColor = color(0, 0, 0);
		this.outlineColor = color(216, 216, 192);

		this.numBodySegments = 10;

		this.numTailSegments = 10;
		this.tailSizeW = this.bodySizeW * 0.6;
		this.tailSizeH = this.bodySizeH * 0.25;

		this.body = new Flagellum(this.bodySizeW, this.bodySizeH, this.numBodySegments);

		this.tailR = new Flagellum(this.tailSizeW, this.tailSizeH, this.numTailSegments);
		this.tailL = new Flagellum(this.tailSizeW * 0.8, this.tailSizeH * 0.8, this.numTailSegments);

		this.numFinSegments = 9;
		this.finR = new Flagellum(this.tailSizeW * 0.5, this.tailSizeH, this.numFinSegments);
		this.finL = new Flagellum(this.tailSizeW * 0.5, this.tailSizeH, this.numFinSegments);
	}

	update() {
		super.update();

		this.checkBorders();
		this.body.muscleFreq = map(this.velocity.mag(), 0, 1, 0, 0.05);

		// Align body to velocity
		this.body.theta = this.velocity.heading();
		this.body.swim();

		let diffX = this.body.spine[this.numBodySegments - 1][0] - this.body.spine[this.numBodySegments - 2][0];
		let diffY = this.body.spine[this.numBodySegments - 1][1] - this.body.spine[this.numBodySegments - 2][1];
		let angle = atan2(diffY, diffX);

		this.tailR.muscleFreq = map(this.velocity.mag(), 0, 1, 0, 0.08);
		this.tailR.theta = angle + PI * 0.95;
		this.tailR.swim();

		this.tailL.muscleFreq = map(this.velocity.mag(), 0, 1, 0, 0.08);
		this.tailL.theta = angle + PI * 1.05;
		this.tailL.swim();

		this.finR.muscleFreq = map(this.velocity.mag(), 0, 1, 0, 0.04);
		this.finR.swim();

		this.finL.muscleFreq = map(this.velocity.mag(), 0, 1, 0, 0.04);
		this.finL.swim();

		if (this.mousePosition.x !== this.mousePositionOld.x || this.mousePosition.y !== this.mousePositionOld.y) {
			this.seek(this.mousePosition);
		}
		this.mousePositionOld.set(this.mousePosition);

		if (this.isExploding) {
			this.bodySizeW *= 1.3;
			this.bodySizeH *= 1.3;

			this.transparency = (this.explosionTimer / frameRate()) * 255;

			this.explosionTimer--;
		}
	}

	render() {
		noStroke();

		let finLLocation = createVector(this.location.x + this.body.spine[3][0], this.location.y + this.body.spine[3][1]);
		let finRLocation = createVector(this.location.x + this.body.spine[3][0], this.location.y + this.body.spine[3][1]);

		fill(this.mainColor, this.transparency);
		this.renderFin(this.finR, finLLocation, this.bodySizeH * 0.5, 1);
		fill(this.mainColor, this.transparency);
		this.renderFin(this.finL, finRLocation, -this.bodySizeH * 0.5, -1);

		fill(this.outlineColor, this.transparency);
		this.renderBody(this.body, this.location, 1.1, 0.1);
		fill(this.stripeColor, this.transparency);
		this.renderBody(this.body, this.location, 0.8, 0.15);
		fill(this.mainColor, this.transparency);
		this.renderBody(this.body, this.location, 0.5, 0.25);

		let tailLocation = createVector(this.location.x + this.body.spine[this.numBodySegments - 1][0], this.location.y + this.body.spine[this.numBodySegments - 1][1]);
		fill(this.mainColor, this.transparency);
		this.renderTail(this.tailR, tailLocation, 0.75);
		fill(this.mainColor, this.transparency);
		this.renderTail(this.tailL, tailLocation, 0.75);

		let headLocation = createVector(this.location.x + this.body.spine[1][0], this.location.y + this.body.spine[1][1]);
		this.renderHead(headLocation, this.bodySizeW * 0.1, this.bodySizeW * 0.06);

		fill(250, 128, 114, this.transparency);
		if (this.lastAteTimer > 0) {
			this.lastAteTimer--;
			let mouthSize = (this.bodySizeW * 0.05) * (float(this.lastAteTimer) / (frameRate() / 2));
			ellipse(this.location.x, this.location.y, mouthSize, mouthSize);
		}

		if (this.getFoodEaten() > 11 && this.isExploding) {
			textAlign(CENTER);
			fill(240);
			textSize(36);
			text("😢 Oh no! You gave it too much food,\n I guess you did not have anything else to do.", width / 2, height / 2);
		}
	}

	renderHead(_location, _eyeSize, _eyeDist) { //Correct
		let diffX = this.body.spine[2][0] - this.body.spine[1][0];
		let diffY = this.body.spine[2][1] - this.body.spine[1][1];
		let angle = atan2(diffY, diffX);

		push();
		translate(_location.x, _location.y);
		rotate(angle);

		fill(this.mainColor, this.transparency);
		ellipse(0, _eyeDist, _eyeSize, _eyeSize);

		fill(this.stripeColor, this.transparency);
		ellipse(-3, _eyeDist, _eyeSize * 0.35, _eyeSize * 0.35);

		pop();

		push();
		translate(_location.x, _location.y);
		rotate(angle);

		fill(this.mainColor, this.transparency);
		ellipse(0, -_eyeDist, _eyeSize, _eyeSize);

		fill(this.stripeColor, this.transparency);
		ellipse(-3, -_eyeDist, _eyeSize * 0.35, _eyeSize * 0.35);

		pop();
	}

	renderBody(_flag, _location, _sizeOffsetA, _sizeOffsetB) { //Correct
		push();
		translate(_location.x, _location.y);
		beginShape(TRIANGLE_STRIP);
		for (let n = 0; n < _flag.numNodes; n++) {
			let dx, dy;
			if (n == 0) {
				dx = _flag.spine[1][0] - _flag.spine[0][0];
				dy = _flag.spine[1][1] - _flag.spine[0][1];
			} else {
				dx = _flag.spine[n][0] - _flag.spine[n - 1][0];
				dy = _flag.spine[n][1] - _flag.spine[n - 1][1];
			}

			let theta = -atan2(dy, dx);

			let t = n / float(_flag.numNodes - 1);
			let b = bezierPoint(3, this.bodySizeH * _sizeOffsetA, this.bodySizeH * _sizeOffsetB, 2, t);

			let x1 = _flag.spine[n][0] - sin(theta) * b;
			let y1 = _flag.spine[n][1] - cos(theta) * b;

			let x2 = _flag.spine[n][0] + sin(theta) * b;
			let y2 = _flag.spine[n][1] + cos(theta) * b;

			vertex(x1, y1);
			vertex(x2, y2);
		}
		endShape();
		pop();
	}

	renderTail(_flag, _location, _sizeOffset) {
		push(); // p5.js equivalent of pushMatrix()
		translate(_location.x, _location.y);

		beginShape(TRIANGLE_STRIP);
		for (let n = 0; n < _flag.numNodes; n++) {
			let dx, dy;
			if (n === 0) {
				dx = _flag.spine[1][0] - _flag.spine[0][0];
				dy = _flag.spine[1][1] - _flag.spine[0][1];
			} else {
				dx = _flag.spine[n][0] - _flag.spine[n - 1][0];
				dy = _flag.spine[n][1] - _flag.spine[n - 1][1];
			}

			let theta = -atan2(dy, dx);

			let t = n / (_flag.numNodes - 1);
			let b = bezierPoint(2, _flag.sizeH, _flag.sizeH * _sizeOffset, 0, t);

			let x1 = _flag.spine[n][0] - sin(theta) * b;
			let y1 = _flag.spine[n][1] - cos(theta) * b;

			let x2 = _flag.spine[n][0] + sin(theta) * b;
			let y2 = _flag.spine[n][1] + cos(theta) * b;

			vertex(x1, y1);
			vertex(x2, y2);
		}
		endShape();

		pop(); // p5.js equivalent of popMatrix()
	}

	renderFin(_flag, _location, _posOffset, _flip) {
		let diffX = this.body.spine[2][0] - this.body.spine[1][0];
		let diffY = this.body.spine[2][1] - this.body.spine[1][1];
		let angle = atan2(diffY, diffX);

		push(); // p5.js equivalent of pushMatrix()
		translate(_location.x, _location.y);
		rotate(angle);

		push(); // p5.js equivalent of pushMatrix()
		translate(0, _posOffset);

		beginShape(TRIANGLE_STRIP);
		for (let n = 0; n < _flag.numNodes; n++) {
			let dx, dy;
			if (n === 0) {
				dx = _flag.spine[1][0] - _flag.spine[0][0];
				dy = _flag.spine[1][1] - _flag.spine[0][1];
			} else {
				dx = _flag.spine[n][0] - _flag.spine[n - 1][0];
				dy = _flag.spine[n][1] - _flag.spine[n - 1][1];
			}

			let theta = -atan2(dy, dx);

			let t = n / (_flag.numNodes - 1);
			let b = bezierPoint(0, _flip * _flag.sizeH * 0.75, _flip * _flag.sizeH * 0.75, 0, t);
			let v = bezierPoint(0, _flip * _flag.sizeH * 0.05, _flip * _flag.sizeH * 0.65, 0, t);

			let x1 = _flag.spine[n][0] - sin(theta) * v;
			let y1 = _flag.spine[n][1] - cos(theta) * v;

			let x2 = _flag.spine[n][0] + sin(theta) * b;
			let y2 = _flag.spine[n][1] + cos(theta) * b;

			vertex(x1, y1);
			vertex(x2, y2);
		}

		endShape();
		pop(); // p5.js equivalent of popMatrix()
		pop(); // p5.js equivalent of popMatrix()
	}

	checkBorders() {
		let buffer = this.bodySizeW / 2;

		if (this.location.x < -buffer)
			this.location.x = width + buffer;

		if (this.location.y < -buffer)
			this.location.y = height + buffer;

		if (this.location.x > width + buffer)
			this.location.x = -buffer;

		if (this.location.y > height + buffer)
			this.location.y = -buffer;
	}

	explode() {
		explosion.play(); // play explosion sound with buzz
		//prevent the mouth from rendering during explosion
		this.lastAteTimer = 0;
		this.isExploding = true;
		this.explosionTimer = frameRate;
	}


	// Getters and Setters
	getStripeColor() {
		return this.stripeColor;
	}

	getBodySizeW() {
		return this.bodySizeW;
	}

	setBodySizeH(bodySizeH) {
		this.bodySizeH = bodySizeH;
	}


	getBodySizeH() {
		return this.bodySizeH;
	}

	setBodySizeW(bodySizeW) {
		this.bodySizeW = bodySizeW;
	}

	getMousePosition() {
		return this.mousePosition;
	}

	setMousePosition(_mousePosition) {
		this.mousePosition = createVector(_mousePosition.x, _mousePosition.y);
	}



	getLastAteTimer() {
		return this.lastAteTimer;
	}

	setLastAteTimer(lastAteTimer) {
		this.lastAteTimer = lastAteTimer;
	}

	getIsExploding() {
		return this.isExploding;
	}

	getFoodEaten() {
		return this.foodEaten;
	}

	setFoodEaten(foodEaten) {
		this.foodEaten = foodEaten;
	}

	getTransparency() {
		return this.transparency;
	}

	setTransparency(transparency) {
		this.transparency = transparency;
	}

	getExplosionTimer() {
		return this.explosionTimer;
	}


}