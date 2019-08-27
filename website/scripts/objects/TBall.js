/*
	TBall.js
	Class for managing and displaying a moving ball/charge in a field
	Tim McIntyre
	Version 2.0 October 2016
 */


/************************************************************
 * TBall Class - Manages the motion of a ball
 ************************************************************/

function TBall(context) {
	this.context = context;
	this.x = 0;							// x-Position
	this.y = 0;							// y-Position
	this.xmin = 0;						// Minimum x position
	this.xmax = 0;						// Maximum x position
	this.ymin = 0;						// Minimum y position
	this.ymax = 0;						// Maximum y position
	this.r = 5;							// Radius
	this.mass = 1;						// Mass
	this.charge = 1;					// Charge
	this.u = 0;							// x-Velocity
	this.v = 0;							// y-Velocity
	this.ax = 0;						// x-Acceleration
	this.ay = 0;						// y-Acceleration
	this.colour = '#FF0000';			// Colour
	this.linewidth = 1;					// Linewidth
	this.gradient = this.colour;		// Gradient
	this.fill = true;					// Draw as solid
	this.unitsPerPixel = 1;				// Scale factor
	this.wallReflecting = true;			// Boundary condition
	this.wallRecycling = false;			// Boundary condition - leaves one side and enters the other
	this.active = true;					// Is active
	this.tolerance = 0.00001;			// Biggest step size dvided by width/height of display
	this.field = false;
	this.now = 0;
	this.last = 0;
	this.text = "";
	this.textcolour = "#000000";
}
/*
		Accessors
 */
/************************************************************
 * Returns true if the ball is active
 ************************************************************/
TBall.prototype.isActive = function() {
	return this.active;
};

/************************************************************
 * pX() - Returns the x position in pixels
 ************************************************************/
TBall.prototype.pX = function() {
	return Math.floor((this.x - this.xmin) / this.unitsPerPixel);
};

/************************************************************
 * pY() - Returns the y position in pixels
 ************************************************************/
TBall.prototype.pY = function() {
	return Math.floor((this.ymax - this.y) / this.unitsPerPixel);
};

/************************************************************
 * pR() - Returns the radius in pixels
 ************************************************************/
TBall.prototype.pR = function() {
	return Math.floor(this.r / this.unitsPerPixel);
};

/************************************************************
 * inside(int ix, int iy) - Returns true if ix, iy inside ball
 ************************************************************/
TBall.prototype.inside = function(ix, iy) {
	return (((this.pX()-ix)*(this.pX()-ix)+(this.pY()-iy)*(this.pY()-iy)) <= this.pR()*this.pR());
};

/************************************************************
 * outside - Returns true if ball is outside limits
 ************************************************************/
TBall.prototype.outside = function() {
	if (this.x > this.xmax || this.x < this.xmin || this.y > this.ymax || this.y < this.ymin)
		return true;
	return false; 
};
/*
		Mutators
 */
/************************************************************
 * reset() - Initialises the variables
 ************************************************************/
TBall.prototype.reset = function() {
	this.x = 0;
	this.y = 0;
	this.u = 0;
	this.v = 0;
};

/************************************************************
 * randomisePosition() - Randomises the position
 ************************************************************/
TBall.prototype.randomisePosition = function() {
	if (this.xmax>this.xmin)
		this.x = Math.random()*(this.xmax-this.xmin-2*this.r) + this.xmin + this.r;
	else
		this.x = this.xmin;	
	if (this.ymax > this.ymin)
		this.y = Math.random()*(this.ymax-this.ymin-2*this.r) + this.ymin + this.r;
	else
		this.y = this.ymin;	
};

/************************************************************
 * Set the charge
 ************************************************************/
TBall.prototype.setCharge = function(charge) {
	this.charge = charge;
};

/************************************************************
 * setLimits(double newXmin, double newXmax, double newYmin, double newYmax)
	Resets the x-position (if xmin=xmax then no limits in x-direction etc for y)
 ************************************************************/
TBall.prototype.setLimits = function(newXmin, newXmax, newYmin, newYmax) {
	this.xmin = newXmin;
	this.xmax = newXmax;
	this.ymin = newYmin;
	this.ymax = newYmax;
};

/************************************************************
 * Sets the field
 ************************************************************/
TBall.prototype.setField = function(field) {
	this.field = field;
};

/************************************************************
 * Set the mass
 ************************************************************/
TBall.prototype.setMass = function(mass) {
	this.mass = mass;
};

/************************************************************
 * setX(double newX) - Resets the x-position
 ************************************************************/
TBall.prototype.setTime = function(time) {
	this.now = time;
	this.last = time;
};

/************************************************************
 * Set the radius
 ************************************************************/
TBall.prototype.setRadius = function(radius) {
	this.r = radius;
};

/************************************************************
 * setX(double newX) - Resets the x-position
 ************************************************************/
TBall.prototype.setX = function(newX) {
	this.x = newX;
};

/************************************************************
 * setY(double newY) - Resets the y-position
 ************************************************************/
TBall.prototype.setY = function(newY) {
	this.y = newY;
};

/************************************************************
 * setU(double newU) - Resets the x-velocity
 ************************************************************/
TBall.prototype.setU = function(newU) {
	this.u = newU;
};

/************************************************************
 * setV(double newV) - Resets the y-velocity
 ************************************************************/
TBall.prototype.setV = function(newV) {
	this.v = newV;
};

/************************************************************
 * setU(double newU) - Resets the x-acceleration
 ************************************************************/
TBall.prototype.setAx = function(newAx) {
	this.ax = newAx;
};

/************************************************************
 * setU(double newU) - Resets the y-acceleration
 ************************************************************/
TBall.prototype.setAy = function(newAy) {
	this.ay = newAy;
};

/************************************************************
 * setScale(double newScale) - Resets the scale (units per pixel)
 ************************************************************/
TBall.prototype.setScale = function(newScale)  {
	this.unitsPerPixel = newScale;
};

/************************************************************
 * setColour(Color newColour) - Resets the colour
 ************************************************************/
TBall.prototype.setColour = function(newColour)  {
	this.colour = newColour;
	this.gradient = this.colour;
};

/************************************************************
 * setGradient(Color newColour) - Resets the gradient
 ************************************************************/
TBall.prototype.setGradient = function(context)  {
	var px = this.pX();
	var py = this.pY();
	var pr = this.pR();
//	console.log(this.x);
    var newGradient = context.createRadialGradient(px - pr / 4, py - pr / 1.2, pr / 16, px, py, 2 * pr);
    newGradient.addColorStop(0, "#EEEEEE");
    newGradient.addColorStop(1, this.colour);
	this.gradient = newGradient;
};

/************************************************************
 * setWallRecycling(boolean newWallRecycling) - Resets the boundary condition 
 ************************************************************/
TBall.prototype.setWallRecycling = function(newWallRecycling)  {
	this.wallRecycling = newWallRecycling;
	if (this.wallRecycling)
		this.setWallReflecting(false);
};

/************************************************************
 * setWallReflecting(boolean newWallReflecting) - Resets the boundary condition 
 ************************************************************/
TBall.prototype.setWallReflecting = function(newWallReflecting)  {
	this.wallReflecting = newWallReflecting;
	if (this.wallReflecting)
		this.setWallRecycling(false);
};

/************************************************************
 * setActive(boolean newActive) - Resets if active 
 ************************************************************/
TBall.prototype.setActive = function(newActive)  {
	this.active = newActive;
};

/*************************************
Sets the time
*************************************/
TBall.prototype.setLastTime = function(last) {
	this.last = last;
}

/************************************************************
 * moveToNext(double timeStep) - Moves the ball
 ************************************************************/
TBall.prototype.moveToTime = function(time) {
	this.move(time - this.last);
}

/************************************************************
 * move(double timeStep) - Moves the ball and checks walls
 ************************************************************/
TBall.prototype.move = function(timeStep) {
	this.moveToNext(timeStep);
};

/************************************************************
 * Returns the acceleration if an external field is used
 ************************************************************/
TBall.prototype.getAcceleration = function() {
	var a = [this.ax, this.ay];
	if (this.field)
		a = this.field.getAcceleration(this.now, [this.x, this.y], this.mass);
	return a;
}

/************************************************************
 * Returns the maximum fraction of the full width/height moved in the given time step
 ************************************************************/
TBall.prototype.getDs = function(timestep) {
	var dx = Math.abs(this.u * timestep / (this.xmax - this.xmin));
	var dy = Math.abs(this.v * timestep / (this.ymax - this.ymin));
	return Math.max(dx,dy);
}


/************************************************************
 * moveToNext(double timeStep) - Moves the ball
 ************************************************************/
TBall.prototype.moveToNext = function(timestep) {
	this.now = this.last + timestep;
	var t = 0;
	var dt = 0;
	var steps = 0;
	var ds = 0;
	do {
		// Determine time step
		dt = timestep;
		if (Math.abs(dt) > Math.abs(timestep))
			dt = timestep;
		do {
			dt /= 5;
			ds = this.getDs(dt);
		} while (ds > this.tolerance);
		steps++;
		this.x += this.u * dt;
		this.y += this.v * dt;
		var a = this.getAcceleration();
		this.u += a[0] * dt;
		this.v += a[1] * dt;
		this.checkWalls();
		t += Math.abs(dt);
	} while (t < Math.abs(timestep));
	this.last = this.now;
};

/************************************************************
 * checkWalls() - Checks for outside boundaries
 ************************************************************/
TBall.prototype.checkWalls = function() {
	if (this.xmax > this.xmin) {
		if (this.wallReflecting) {
			if ((this.x + this.r ) > this.xmax) {
				this.x = 2 * (this.xmax-this.r) - this.x;
				this.u = -this.u;
			} else if ((this.x - this.r ) < this.xmin) {
				this.x = 2 * (this.xmin + this.r) - this.x;
				this.u = -this.u;
			}
		} else if (this.wallRecycling) {
			if ((this.x - this.r) > this.xmax) {
				this.x = this.x - (this.xmax - this.xmin) - 2 * this.r;
			} else if ((this.x + this.r) < this.xmin) {
				this.x = this.x + this.xmax - this.xmin + 2 * this.r;
			}
		}
	}		
	if (this.ymax > this.ymin) {
		if (this.wallReflecting) {
			if ((this.y + this.r ) > this.ymax) {
//				console.log("" + (this.y + this.r));
				this.y = 2 * (this.ymax-this.r) - this.y;
				this.v = -this.v;
			} else if ((this.y - this.r ) < this.ymin) {
				this.y = 2 * (this.ymin+this.r) - this.y;
				this.v = -this.v;
			}	
		} else if (this.wallRecycling) {
			if ((this.y - this.r) > this.ymax) {
				this.y = this.y - (this.ymax - this.ymin) - 2 * this.r;
			} else if ((this.y + this.r) < this.ymin) {
				this.y = this.y + this.ymax - this.ymin + 2 * this.r;
			}
		}
	}		
};

/************************************************************
 * collide(TBall b2) - Collides the balls
	Steps
		1. Convert to frame where TBall.this is fixed - capitals
		2. Move back in time until the collision just occurs
		3. Calculate collision using velocity component along the direction of centre-centre
		4. Transform back
 ************************************************************/
TBall.prototype.collide = function(b2) {
	var dx = b2.x - this.x;
	var dy = b2.y - this.y;
	if ((dx*dx + dy*dy) < (this.r + b2.r)*(this.r + b2.r)) {

		// Ball 2 position & velocity in frame with Ball 1 fixed at origin
		var X2 = dx;
		var Y2 = dy;
		var U2 = b2.u - this.u;
		var V2 = b2.v - this.v;

		var tMiniStep = Math.sqrt((dx*dx+dy*dy)/(U2*U2+V2*V2))/10;
		var tcoll = 0;
		var maxsteps = 1000;
		while ((Math.sqrt(dx*dx + dy*dy) < this.r + b2.r) && (maxsteps > 0)) {
			this.move(-tMiniStep);
			b2.move(-tMiniStep);
			dx = b2.x - this.x;
			dy = b2.y - this.y;
			tcoll -= tMiniStep;
			maxsteps--;
		}	
		X2 = b2.x - this.x;
		Y2 = b2.y - this.y;
		U2 = b2.u - this.u;
		V2 = b2.v - this.v;
		// Angle of positions from Ball 2 to Ball 1
		var thetaR = Math.atan2(-Y2,-X2); // Yes, this is the correct order for atan2
		// Angle of velocity of Ball 2
		var thetaV = Math.atan2(V2,U2);
		// Angle between thetaR and thetaV
		var theta = thetaV-thetaR;
		// Speed along impact direction
		var U2i = Math.sqrt(U2*U2+V2*V2)*Math.cos(theta);
		// Speed normal to impact direction (remains unchanged)
		var V2f = Math.sqrt(U2*U2+V2*V2)*Math.sin(theta);
		// Perform collision (elastic)
		var U1f = 2*b2.mass*U2i/(this.mass+b2.mass);
		var U2f = (b2.mass*U2i - this.mass*U1f)/b2.mass;
		// Set new velocities
		b2.setU(U2f*Math.cos(thetaR)-V2f*Math.sin(thetaR) + this.u);
		b2.setV(U2f*Math.sin(thetaR)+V2f*Math.cos(thetaR) + this.v);
		this.setU(U1f*Math.cos(thetaR) + this.u);
		this.setV(U1f*Math.sin(thetaR) + this.v);
		// Move to new positions
		this.move(-tcoll);
		b2.move(-tcoll);
	} else {
		return false;
	}
};

/*******************************************************
 *	draw() - draw the image display
 ********************************************************/	
TBall.prototype.draw = function() {
	if (this.active) {
		var px = this.pX();
		var py = this.pY();
		var pr = this.pR();
		if (this.fill) {
//			this.context.strokeStyle = this.colour;
			this.context.fillStyle = this.gradient;
			this.context.beginPath();
			this.context.arc(px,py,pr,0,2*Math.PI,false);
//			this.context.stroke()
			this.context.fill();
		} else {
			this.context.strokeStyle = this.colour;
			this.context.lineWidth = this.linewidth;
			this.context.beginPath();
			this.context.arc(px,py,pr,0,2*Math.PI);
			this.context.stroke();
		}
		if (this.text.length > 0) {
			this.context.font="12px Times";
			this.context.fillStyle = this.textcolour;
			this.context.textAlign = "center";
			this.context.textBaseline = "middle";
			this.context.fillText(this.text,px,py);
		}		
	};

};
