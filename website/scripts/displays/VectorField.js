/************************************
Base script for displaying a vector field
Tim McIntyre
V1
January 2014
*************************************/
function VectorField(context) {
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
	this.field = null;
	this.drawfield = true;
	
	// Define the physical space
	this.xmin = -1;
	this.xmax = 1;
	this.ymin = -1;
	this.ymax = 1;
	
	// Time
	this.now = 0;
	this.last = 0;
	
}

/************************************
 Draws the situation specific physical space region
 ************************************/
VectorField.prototype.draw = function() {
	if (this.erase) {
		this.context.fillStyle = this.background;
		this.context.fillRect(this.left, this.top, this.width, this.height);
	}
	// Draw the field - arrows on a grid
	if (this.drawfield) {
		this.tarrow.setColour(this.foreground);
		var arrowmaxlengthv = this.height / (this.fieldv + 1) - 2;
		var arrowmaxlengthh = this.width / (this.fieldh + 1);
		for (var h = 0; h < this.fieldh; h++) {
			for (var v = 0; v < this.fieldv; v++) {
				var ph = this.left + h * this.width / (this.fieldh - 1);
				var pv = this.top + v * this.height / (this.fieldv - 1);
				var xa = this.xmin + (ph - this.left) / this.width * (this.xmax - this.xmin);
				var ya = this.ymin - (pv - this.top - this.height) / this.height * (this.ymax - this.ymin);
				var field = this.field.getNormalisedField(this.now, [xa, ya]);
				this.tarrow.setHeadTail(ph + field[0] * arrowmaxlengthh, pv - field[1] * arrowmaxlengthv, ph, pv);
				this.tarrow.draw();
			}
		}
	}
}

/************************************
Sets the background colour
************************************/
VectorField.prototype.setBackground = function(background) {
	this.background = background;
}

/************************************
Sets whether the background should be erased
************************************/
VectorField.prototype.setErase = function(erase) {
	this.erase = erase;
}

/************************************
Sets the field
************************************/
VectorField.prototype.setField = function(field) {
	this.field = field;	
}

/************************************
Sets the foreground colour
************************************/
VectorField.prototype.setForeground = function(foreground) {
	this.foreground = foreground;
}

/*************************************
Sets the time
*************************************/
VectorField.prototype.setLastTime = function(last) {
	this.last = last;
}

/*************************************
Sets the top, left position of the slider
*************************************/
VectorField.prototype.setPosition = function(left,top) {
	this.left = left;
	this.top = top;
}

/*************************************
Sets the width and height of the slider
*************************************/
VectorField.prototype.setSize = function(width,height) {
	this.width = width;
	this.height = height;
}

/*************************************
Sets the time
*************************************/
VectorField.prototype.setTime = function(now) {
	this.last = this.now;
	this.now = now;
}

/*************************************
Sets the physical x limits
*************************************/
VectorField.prototype.setLimits = function(xmin,xmax,ymin,ymax) {
	this.xmin = xmin;
	this.xmax = xmax;
	this.ymin = ymin;
	this.ymax = ymax;
}

