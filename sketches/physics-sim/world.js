var World = function(c) {
	this.objects = [];
	this.w = c.getBoundingClientRect().width;
	this.h = c.getBoundingClientRect().height;
	this.stage = c;
	this.context = c.getContext('2d');
	this.particleAttraction = true;
	this.particleCollision = true;
	this.showVectors = true;
	this.walls = false;
	this.particleLifespan = Infinity;
	this.center = Particle.create(this.w/2, this.h * .3333, 0, 0, 100, 0)
	this.particleColor = 'rgba(255,255,255,1)';

	this.centralGravity = false;

	this.emitting = false;
	this.emitter = {
		spread: 1,
		rangeMin: 20,
		rangeMax: 70,
		radius: 0.2,
		x : this.w/2,
		y : this.h,
		max : 300,
		randomSpawn : false
	}

	this.gravity = 0;

	this.generateParticles = function(n, r) {
		var o, x, y;
		for (var i = 0; i < n; ++i) {
			x = Math.random() * this.w;
			y = Math.random() * this.h;
			o = Particle.create(x, y, 0, 0, Math.PI * (r * r), r);
			this.objects.push(o);
		}
	}

	this._drawCircle = function(x, y, r, c) {
		this.context.beginPath();
		this.context.arc(x, y, r, 0, 2 * Math.PI, false);
		this.context.fillStyle = c;
		this.context.fill();
	}

	this._drawDragGuide = function() {
		this.context.beginPath();
		this.context.arc(this.d1x, this.d1y, 3, 0, 2 * Math.PI, false);
		this.context.strokeStyle = this.particleColor;
		this.context.lineWidth = 1;
		this.context.stroke()

		this.context.beginPath();
		this.context.moveTo(this.d1x, this.d1y);
		this.context.lineTo(CONST.x, CONST.y);
		this.context.stroke();

		this.context.beginPath();
		this.context.arc(CONST.x, CONST.y, this.dragParticleRadius, 0, 2*Math.PI, false);
		this.context.stroke();

	}

	this._drawVectors = function() {
		var stdGap = 40;
		var x = -stdGap;
		var y = -stdGap;
		var dvx, dvy, vx, vy, gravity, dvlength, dx, dy;

		while (y < this.h + stdGap) {

			vx = 0;
			vy = 0;

			for (var i = 0; i < this.objects.length; ++i) {
				var o = this.objects[i];
				dvx = o.x - x;
				dvy = o.y - y;
				dvlength = Math.sqrt(dvx * dvx + dvy * dvy);
				gravity = o.mass * CONST.g/dvlength;
				
				vx += gravity * (dvx / dvlength);
				vy += gravity * (dvy / dvlength);
			}

			if (this.centralGravity) {
				var c = this.center;
				dvx = c.x - x;
				dvy = c.y - y;
				dvlength = Math.sqrt(dvx * dvx + dvy * dvy);
				gravity = c.mass * CONST.g / dvlength;

				vx += gravity * (dvx / dvlength);
				vy += gravity * (dvy / dvlength);
			}

			vx = vx * 800;
			vy = vy * 800;

			if (Math.sqrt(vx * vx + vy * vy) > 20) {
				var l = Math.sqrt(vx * vx + vy * vy);
				vx = (vx / l) * 20;
				vy = (vy / l) * 20;
			}

			dx = x + vx;
			dy = y + vy;

			this.context.beginPath();
			this.context.moveTo(x,y)
			this.context.lineTo(dx, dy);
			this.context.strokeStyle = 'rgba(255,255,255,0.2)';
			this.context.stroke();

			x += stdGap
			if (x > this.w + stdGap) {
				x = 0;
				y += stdGap;
			}
		}
	}

	this._drawRangeConnections = function() {
		var p0, p1, dist, dx, dy;
		for (var i = 0; i < this.objects.length; ++i) {
			p0 = this.objects[i];

			for (var j = 0; j < this.objects.length; ++j) {
				if (j == i)
					continue;

				p1 = this.objects[j];
				dx = p1.x - p0.x;
				dy = p1.y - p0.y;

				dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < 100) {
					this.context.beginPath();
					this.context.moveTo(p0.x, p0.y);
					this.context.lineTo(p1.x, p1.y);
					this.context.strokeStyle = 'rgba(255,255,255,0.1)';
					this.context.stroke();
				}
			}
		}
	}

	this.draw = function() {
		// Clear for next frame
		this.context.clearRect(0,0,this.w,this.h); 
		// this._drawCircle(this.center.x, this.center.y, this.center.radius);

		if (this.dragging)
			this._drawDragGuide();

		if (this.showVectors)
			this._drawVectors();

		if (this.showRanges)
			this._drawRangeConnections();

		for (var i = 0; i < this.objects.length; ++i) {
			var o = this.objects[i];
			this._drawCircle(o.x, o.y, o.radius, o.color);
		}
	}

	this.update = function() {
		if (this.emitting)
			this.emit();

		for (var i = 0; i < this.objects.length; ++i) {
			var p0 = this.objects[i];
			p0.damp();
			p0.vy += this.gravity;

			if (this.centralGravity) {
				p0.pull(this.center);
			}

			for (var j = 0; j < this.objects.length; ++j) {
				// Don't compare to self
				if (i == j)
					continue;

				var p1 = this.objects[j];

				p0.solveOverlap(p1);

				if (this.particleAttraction )
					p0.pull(p1);

				if (this.walls) {
					p0.wall(this.w, this.h);
				}

				if (this.particleCollision)
					p0.collide(p1);
			}

			p0.update();

			if (p0.age > this.particleLifespan)
				this.objects.splice(i, 1);
		}
	}

	this.emit = function() {
		if (!this.emitting)
			return;

		for (var i = 0; i < this.objects.length; ++i) {
			var o = this.objects[i];
			if (o.x < -this.w || o.x > this.w * 2 || o.y < -this.h || o.y > this.h * 2) {
				this.objects.splice(i, 1);
			}
		}

		if (this.objects.length < this.emitter.max) {
			var startx = this.emitter.x;
			var starty = this.emitter.y;
			if (this.emitter.randomSpawn) {
				startx = Math.random() * this.w;
				starty = Math.random() * this.h;
			}
			var startvx = (Math.random() * this.emitter.spread) - (this.emitter.spread/2);
			var startvy = -1 * ((Math.random() * (this.emitter.rangeMax - this.emitter.rangeMin)) + this.emitter.rangeMin);
			var p = Particle.create(startx, starty, 0, 0, 1, this.emitter.radius);
			p.vx = startvx;
			p.vy = startvy;
			this.objects.push(p);
		}
	}

	this.startDragHandler = function(x, y) {
		this.dragging = true;
		this.d1x = x;
		this.d1y = y;

		this.dragParticleRadius = 10;
	}

	this.endDragHandler = function(x, y) {
		this.dragging = false;
		this.d2x = x;
		this.d2y = y;

		var dvx = this.d2x - this.d1x;
		var dvy = this.d2y - this.d1y;

		var dragAngle = Math.PI + Math.atan2(dvy, dvx);
		var dragSpeed = 0.1 * Math.sqrt(dvx * dvx + dvy * dvy);
		var mass = Math.PI * (this.dragParticleRadius * this.dragParticleRadius);

		var p = Particle.create(this.d2x, this.d2y, dragSpeed, dragAngle, this.dragParticleRadius, this.dragParticleRadius);
		this.objects.push(p);
	}

	this.tick = function() {
		this.update();
		this.draw();
		window.requestAnimationFrame(this.tick.bind(this));
	}

	window.requestAnimationFrame(this.tick.bind(this));
}