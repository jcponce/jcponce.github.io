/*
 * Original Processing project: My Life Aquatic 
 * by David Leibovic and Sunah Suh
 * https://github.com/dasl-/my-life-aquatic
 */

class Flagellum {
	constructor(_sizeW, _sizeH, _numNodes) {
		this.sizeW = _sizeW;
		this.sizeH = _sizeH;
		this.numNodes = _numNodes;

		this.spine = new Array(this.numNodes).fill().map(() => new Array(2).fill(0));

		this.MUSCLE_RANGE = 0.15;
		this.muscleFreq = 0.08;

		this.spaceX = this.sizeW / (this.numNodes + 1);
		this.spaceY = this.sizeH / 2.0;

		this.theta = PI;
		this.count = 0;

		// Initialize spine positions
		for (let n = 0; n < this.numNodes; n++) {
			let x = this.spaceX * n;
			let y = this.spaceY;

			this.spine[n][0] = x;
			this.spine[n][1] = y;
		}
	}

	swim() {
		this.spine[0][0] = cos(this.theta);
		this.spine[0][1] = sin(this.theta);

		this.count += this.muscleFreq;
		let thetaMuscle = this.MUSCLE_RANGE * sin(this.count);

		this.spine[1][0] = -this.spaceX * cos(this.theta + thetaMuscle) + this.spine[0][0];
		this.spine[1][1] = -this.spaceX * sin(this.theta + thetaMuscle) + this.spine[0][1];

		for (let n = 2; n < this.numNodes; n++) {
			let x = this.spine[n][0] - this.spine[n - 2][0];
			let y = this.spine[n][1] - this.spine[n - 2][1];
			let l = sqrt((x * x) + (y * y));

			if (l > 0) {
				this.spine[n][0] = this.spine[n - 1][0] + (x * this.spaceX) / l;
				this.spine[n][1] = this.spine[n - 1][1] + (y * this.spaceX) / l;
			}
		}
	}

	debugRender() {
		for (let n = 0; n < this.numNodes; n++) {
			stroke(0);
			if (n < this.numNodes - 1) {
				line(this.spine[n][0], this.spine[n][1], this.spine[n + 1][0], this.spine[n + 1][1]);
			}
			fill(90);
			ellipse(this.spine[n][0], this.spine[n][1], 6, 6);
		}
	}
}