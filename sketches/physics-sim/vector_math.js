var Point = function(x,y) {
	this.x = x;
	this.y = y;

	this.add = function(p) {
		var vals = {
			x : this.x + p.x,
			y : this.y + p.y
		}

		return new Point(vals.x, vals.y);
	}

	this.subtract = function(p) {
		var vals = {
			x : this.x - p.x,
			y : this.y - p.y
		}

		return new Point(vals.x, vals.y);
	}

	this.multiply = function(p) {
		var vals = {
			x : this.x * p.x,
			y : this.y * p.y
		}

		return new Point(vals.x, vals.y);
	}

	this.scale = function(k) {
		return new Point(this.x * k, this.y * k);
	}

	this.divide = function(p) {
		var vals = {
			x : this.x / p.x,
			y : this.y / p.y
		}

		return new Point(vals.x, vals.y);
	}

	this.dist = function(p) {
		var over = this.x - p.x;
		var up = this.y - p.y;

		return Math.sqrt((over * over) + (up * up));
	}

	this.angleTo = function(p) {
		var n = this.subtract(p, this);
		return Math.atan2(n.y, n.x);
	}

	this.absoluteDist = function(p) {
		var over = Math.abs(this.x - p.x);
		var up = Math.abs(this.y - p.y);

		return Math.sqrt((over * over) + (up * up));
	}

	// Setters

	this.setX = function(x) {
		this.x = x;
	}

	this.setY = function(y) {
		this.y = y;
	}

	this.setPoint = function(p) {
		this.x = p.x;
		this.y = p.y;
	}
}

var Vector = function(x, y) {
	this._x = x;
	this._y = y;

	this.angle = Math.atan2(y, x);
	this.magnitude = Math.sqrt((x * x) + (y * y));

	this.add = function(vector) {
		var __x = this._x + vector._x;
		var __y = this._y + vector._y;

		return new Vector(__x, __y);
	}

	this.setAngle = function(angle) {
		this.angle = angle;
		this._x = this.magnitude * Math.cos(this.angle);
		this._y = this.magnitude * Math.sin(this.angle);
	}

	this.setMagnitude = function(magnitude) {
		this.magnitude = magnitude;
		this._x = Math.cos(this.angle) * this.magnitude;
		this._y = Math.sin(this.angle) * this.magnitude;
	}
}