/*
 * Original Processing project: My Life Aquatic 
 * by David Leibovic and Sunah Suh
 * https://github.com/dasl-/my-life-aquatic
 */

class Boid {
	constructor(location, maxSpeed, maxForce, velocity = null) {
		this.createBoid(location, maxSpeed, maxForce);
		if (velocity) {
			this.velocity = velocity.copy();
		} else {
			this.velocity = createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed));
		}
	}

	createBoid(location, maxSpeed, maxForce) {
		this.location = location.copy();
		this.maxSpeed = maxSpeed;
		this.maxForce = maxForce;
		this.acceleration = createVector(0, 0);
		this.wanderTheta = 0;
		this.hasArrive = false;
	}

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.location.add(this.velocity);
		this.acceleration.mult(0);
	}

	debugRender() {
		noStroke();
		fill(255, 0, 0);
		ellipse(this.location.x, this.location.y, 10, 10);
	}

	steer(target, slowdown) {
		let steer;
		let desired = p5.Vector.sub(target, this.location);
		let dist = desired.mag();

		if (dist > 0) {
			desired.normalize();
			if (slowdown && dist < 60) {
				desired.mult(this.maxSpeed * (dist / 60));
				if (dist < 10) {
					this.hasArrive = true;
				}
			} else {
				desired.mult(this.maxSpeed);
			}

			steer = p5.Vector.sub(desired, this.velocity);
			steer.limit(this.maxForce);
		} else {
			steer = createVector(0, 0);
		}

		return steer;
	}

	seek(target) {
		this.acceleration.add(this.steer(target, false));
	}

	arrive(target) {
		this.acceleration.add(this.steer(target, true));
	}

	flee(target) {
		this.acceleration.sub(this.steer(target, false));
	}

	wander() {
		let wanderR = 5;
		let wanderD = 100;
		let change = 0.05;

		this.wanderTheta += random(-change, change);

		let circleLocation = this.velocity.copy();
		circleLocation.normalize();
		circleLocation.mult(wanderD);
		circleLocation.add(this.location);

		let circleOffset = createVector(wanderR * cos(this.wanderTheta), wanderR * sin(this.wanderTheta));
		let target = p5.Vector.add(circleLocation, circleOffset);

		this.seek(target);
	}

	evade(target) {
		let lookAhead = this.location.dist(target) / (this.maxSpeed * 2);
		let predictedTarget = createVector(target.x - lookAhead, target.y - lookAhead);
		this.flee(predictedTarget);
	}

	getMaxSpeed() {
		return this.maxSpeed;
	}

	getMaxForce() {
		return this.maxForce;
	}

	getVelocity() {
		return this.velocity;
	}

	setVelocity(velocity) {
		this.velocity = velocity;
	}

	getLocation() {
		return this.location;
	}
}