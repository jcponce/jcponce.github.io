var Particle = {
	x : 0,
	y : 0,
	vx : 0,
	vy : 0,
	mass : 1,
	radius : 5,
	inert : false,
	age : 0,
	color: '#FFF',
	mouseInside : false,

	create : function(x, y, speed, direction, mass, radius) {
		var p = Object.create(this),
				vReqs = (speed !== undefined && direction !== undefined);

		p.x = x;
		p.y = y;
		p.vx = vReqs ? speed * Math.cos(direction) : 0;
		p.vy = vReqs ? speed * Math.sin(direction) : 0;
		p.mass = mass || 0;
		p.radius = radius || 5;
		p.color = CONST.palette[Math.round(Math.random() * CONST.palette.length)];

		return p;
	},

	checkMouseInside : function() {
		var dx = CONST.x - (this.x + this.vx),
				dy = CONST.y - (this.y + this.vy),
				dist = Math.sqrt(dx * dx + dy * dy);

		return dist < this.radius + 10;
	},

	update : function() {
		this.x += this.vx;
		this.y += this.vy;

		this.mouseInside = this.checkMouseInside();

		this.age++;
	},

	collide : function(p1) {
		// Goal of this is to remove the portion of the body's vector
		// which is parallel to the angle between the body and the other body.
		// In other words, need to project the body's vector onto a plane
		// perpendicular to the collision angle.

		// p0 = particle being checked
		// dvx = p0 next x to p1 next x
		// dvy = p0 next y to p1 next y
		// dist = distance between particles
		var p0 = this;
				dvx = (p1.x + p1.vx) - (p0.x + p0.vx),
				dvy = (p1.y + p1.vy) - (p0.y + p0.vy),
				dist = Math.sqrt(dvx * dvx + dvy * dvy);

		// If particles are not within threshold for collision
		// (threshold is arbitrary) skip calculations
		if (dist - p0.radius - p1.radius >= 0 )
			return false;

		// p0speed = length of p0 velocity vector
		// p1speed = length of p1 velocity vector
		// incidence = angle from center p0 to center p1
		// p0heading = angle of p0 velocity vector
		// p1heading = angle of p1 velocity vector
		// p0vx, p0vy... = flatten velocities so that we are working with a flat plane
		// p0newvx... = conservation of momentum, calculate new velocities post-flattened collision, factor in restitution
		// p0newvy... = b/c velocities were flattened, we are only adjusting one (same as wall collision)
		// p0.vx... = Unrotate adjusted velocities and apply
		var p0speed = Math.sqrt(p0.vx * p0.vx + p0.vy * p0.vy),
				p1speed = Math.sqrt(p1.vx * p1.vx + p1.vy * p1.vy),
				p0inertia = p0speed * p0.mass;
				p1inertia = p1speed * p1.mass;
				incidence = Math.atan2(dvy, dvx),
				p0heading = Math.atan2(p0.vy, p0.vx),
				p1heading = Math.atan2(p1.vy, p1.vx),
				p0vx = p0speed * Math.cos(p0heading - incidence),
				p0vy = p0speed * Math.sin(p0heading - incidence),
				p1vx = p1speed * Math.cos(p1heading - incidence),
				p1vy = p1speed * Math.sin(p1heading - incidence),
				p0newvx = (((p0.mass * p0vx) + (p1.mass * p1vx) + ((p1.mass * CONST.restitution) * (p1vx - p0vx)))/(p0.mass + p1.mass)) * CONST.friction;
				p1newvx = (((p0.mass * p0vx) + (p1.mass * p1vx) + ((p0.mass * CONST.restitution) * (p0vx - p1vx)))/(p0.mass + p1.mass)) * CONST.friction;
				p0newvy = p0vy,
				p1newvy = p1vy;

				p0.vx = Math.cos(incidence) * p0newvx + Math.cos(incidence + Math.PI/2) * p0newvy;
				p0.vy = Math.sin(incidence) * p0newvx + Math.sin(incidence + Math.PI/2) * p0newvy;
				p1.vx = Math.cos(incidence) * p1newvx + Math.cos(incidence + Math.PI/2) * p1newvy;
				p1.vy = Math.sin(incidence) * p1newvx + Math.sin(incidence + Math.PI/2) * p1newvy;

				if (p0inertia > p1inertia)
					p1.color = p0.color
				else
					p0.color = p1.color

				return true;
	},

	solveOverlap : function(p1) {
		var p0 = this,
				dvx = (p1.x + p1.vx) - (p0.x + p0.vx),
				dvy = (p1.y + p1.vy) - (p0.y + p0.vy),
				dist = Math.sqrt(dvx * dvx + dvy * dvy);

		if (dist - p0.radius - p1.radius >= 0 )
			return;

		if (dist - p0.radius - p1.radius === 0){
			p0.vx *= -1;
			p0.vy *= -1;
			return;
		}

		var scaledDist = dist - p0.radius - p1.radius,
				distScalar = scaledDist/dist,
				sdvx = dvx * distScalar,
				sdvy = dvy * distScalar,
				p0inertia = p0.mass * Math.sqrt(p0.vx * p0.vx + p0.vy * p0.vy),
				p1inertia = p1.mass * Math.sqrt(p1.vx * p1.vx + p1.vy * p1.vy),
				totalInertia = p0inertia + p1inertia,
				p1ratio = p0inertia / totalInertia,
				p0ratio = p1inertia / totalInertia;

		p0.vx -= sdvx * p0ratio;
		p0.vy -= sdvy * p0ratio;

		p1.vx += sdvx * p1ratio;
		p1.vy += sdvy * p1ratio;
	},

	wall : function(x, y) {
		if (this.x + this.vx < 0 + this.radius) {
			this.x = this.radius;
			this.vx *= -CONST.restitution;
			return true;
		}

		if (this.x + this.vx > x - this.radius) {
			this.x = x - this.radius;
			this.vx *= -CONST.restitution;
			return true;
		}

		if (this.y + this.vy < 0 + this.radius) {
			this.y = this.radius;
			this.vy *= -CONST.restitution;
			return true;
		}

		if (this.y  + this.vy > y - this.radius) {
			this.y = y - this.radius;
			this.vy *= -CONST.restitution;
			return true;
		}

		return false;
	},

	damp : function() {
		this.vx *= CONST.damping;
		this.vy *= CONST.damping;
	},

	pull : function(p1) {
		if (this.inert)
			return;

		var dvx = p1.x - this.x,
				dvy = p1.y - this.y,
				dvLength = Math.sqrt(dvx * dvx + dvy * dvy);

		if (dvLength < p1.radius + this.radius)
			return;

		var	gravity = (p1.mass * CONST.g) / (dvLength),
				dx = gravity * (dvx / dvLength),
				dy = gravity * (dvy / dvLength);

		this.vx += dx;
		this.vy += dy;
	}
}