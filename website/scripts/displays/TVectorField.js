/************************************
Self contained script for displaying a vector field
Tim McIntyre
V1
October 2014
*************************************/
function TVectorField(context) {
	this.context = context;
	
	// Width and height of full display - reset based on values set in html document
	this.left = 0;
	this.top = 0;
	this.width = 100;
	this.height = 100;
	
	// Colour scheme and erase control
	this.background = "#0272AB";
	this.foreground = "#C7C7C7";
	this.erase = false;
	
	// Field details
	this.fieldh = 16;
	this.fieldv = 16;
	this.tarrow = new TArrow(this.context);
	
	// Field values
	this.x;
	this.y;
	
	// Control
	this.maxlength;
	this.autoscale = true;
	this.displaytype = 0;	// 0 Standard arrow with length representing field, 1 Fixed arrow size with colour representing field
	
	// Colour map parameters
	this.slopeL = 255.0 / 64.0;
	this.slopeM = 255.0 / 128.0;
	this.slopeR = -255.0 / 63.0;
	this.colourmaparrow1 = 0;	
	this.GRAY = 0;
	this.JET = 1;
	this.HOT = 2;
	this.inverted = false;
}

/************************************
 Draws the situation specific physical space region
 ************************************/
TVectorField.prototype.draw = function() {
	if (this.erase) {
		this.context.fillStyle = this.background;
		this.context.fillRect(this.left, this.top, this.width, this.height);
	}
	// Draw the field - arrows on a grid
	if (this.displaytype == 0) {
		this.tarrow.setColour(this.foreground);
		var arrowmaxlengthv = this.height / (this.fieldv + 1) - 2;
		var arrowmaxlengthh = this.width / (this.fieldh + 1);
		for (var h = 0; h < this.fieldh; h++) {
			for (var v = 0; v < this.fieldv; v++) {
				var ph = this.left + h * this.width / (this.fieldh - 1);
				var pv = this.top + v * this.height / (this.fieldv - 1);
				this.tarrow.arrowtype = 0;
				this.tarrow.setHeadTail(this.left + ph + this.x[h][v]/this.maxlength * arrowmaxlengthh, this.top + pv - this.y[h][v]/this.maxlength * arrowmaxlengthv, this.left + ph, this.top + pv);
				this.tarrow.draw();
			}
		}
	} else if (this.displaytype == 1) {
		this.tarrow.setColour(this.foreground);
		var arrowmaxlengthv = this.height / (this.fieldv + 1) - 2;
		var arrowmaxlengthh = this.width / (this.fieldh + 1);
		for (var h = 0; h < this.fieldh; h++) {
			for (var v = 0; v < this.fieldv; v++) {
				var magnitude = Math.sqrt(this.x[h][v] * this.x[h][v] + this.y[h][v] * this.y[h][v]);
				var angle = Math.atan2(this.y[h][v], this.x[h][v]);
				var step = this.width / (this.fieldh - 1);
				if (magnitude > this.maxlength)
					magnitude = this.maxlength;
				var level = 255 - Math.floor(255 * magnitude / this.maxlength);
				var arrowcolour = this.getColour(level);
				var ph = this.left + h * this.width / (this.fieldh - 1);
				var pv = this.top + v * this.height / (this.fieldv - 1);
				this.tarrow.arrowtype = 1;
				this.tarrow.setColour(arrowcolour);
				this.tarrow.setCentreAngle(this.left + ph, this.top + pv, 2 * step / 3, angle);
				this.tarrow.draw();
			}
		}
	}
}

/************************************
Sets the background colour
************************************/
TVectorField.prototype.setBackground = function(background) {
	this.background = background;
}

/************************************
Sets whether the background should be erased
************************************/
TVectorField.prototype.setErase = function(erase) {
	this.erase = erase;
}

/************************************
Sets the foreground colour
************************************/
TVectorField.prototype.setForeground = function(foreground) {
	this.foreground = foreground;
}

/*************************************
Sets the top, left position of the view
*************************************/
TVectorField.prototype.setPosition = function(left,top) {
	this.left = left;
	this.top = top;
}

/*************************************
Sets the width and height of the slider
*************************************/
TVectorField.prototype.setSize = function(width,height) {
	this.width = width;
	this.height = height;
}

/*************************************
Sets the width and height of the slider
*************************************/
TVectorField.prototype.init = function() {
	this.x = new Array();
	this.y = new Array();
	for (var h = 0; h < this.fieldh; h++) {
		this.x[h] = new Array();
		this.y[h] = new Array();
		for (var v = 0; v < this.fieldv; v++) {
			this.x[h][v] = 0;
			this.y[h][v] = 0;
		}
	}
	if (this.autoscale)
		this.maxlength = -Number.MAX_VALUE;
}

/*************************************
Sets the value at a given location
*************************************/
TVectorField.prototype.setValue = function(h, v, x, y) {
	if (h >= 0 && h < this.fieldh && v >= 0 && v < this.fieldv) {
		this.x[h][v] = x;
		this.y[h][v] = y;
		if (this.autoscale) {
			var length = Math.sqrt(x*x + y*y);
			if (length > this.maxlength)
				this.maxlength = length;
		}
	}
}

/*************************************
Sets the pixel colour
*************************************/
TVectorField.prototype.getColour = function(val) {
	val = Math.floor(val);
    var r = 0;
    var g = 0;
    var b = 0;
    if (this.inverted)
    	val = 255 - val;
    switch (this.colourmaparrow1) {
    	case 0:		// Gray scale
			if (val < 0)
				val = 0;
			if (val > 255)
				val = 255;
			r = val;
			g = val;
			b = val;
			break;
    	case 1:		// Jet
			if (val < 0) {
				r = 0;
				g = 0;
				b = 255;
			} else if (val < 64) {
				r = 0;
				g = Math.round(this.slopeL * val);
				b = 255;
			} else if (val < 192) {
				r = Math.round(255 + this.slopeM * (val - 192));
				g = 255;
				b = Math.round(255 - this.slopeM * (val - 64));
			} else if (val < 256) {
				r = 255;
				g = Math.round(255 + this.slopeR * (val - 192));
				b = 0;
			} else {
				r = 255;
				g = 255;
				b = 0;
			}
			break;
    	case 2:		// Hot
			if (val < 0) {
				r = 0;
				g = 0;
				b = 0;
			} else if (val < 86) {
				r = Math.floor(val * 255 / 85);
				g = 0;
				b = 0;
			} else if (val < 171) {
				r = 255;
				g = Math.floor((val - 86) * 255 / (170 - 86));
				b = 0;
			} else if (val < 256) {
				r = 255;
				g = 255;
				b = Math.floor((val - 171) * 255 / (255 - 171));
			} else {
				r = 255;
				g = 255;
				b = 255;
			}
			break;
	}	
	return "rgb(" + r + ", " + g + ", " + b + ")";	
}


