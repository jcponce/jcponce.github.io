/*************************************
Script to draw 2D images
Tim McIntyre
V1
January 2014
*************************************/
function TFalseColour(context) {

	// Image parameters
	this.context = context;
	this.width = 100;
	this.height = 100;
	this.left = 0;
	this.top = 0;

	// Value parameters
	this.value = new Array();
	this.min = 0;
	this.max = 1;
	
	this.imagedata;
	this.value;
	
	// Colour map parameters
	this.slopeL = 255.0 / 64.0;
	this.slopeM = 255.0 / 128.0;
	this.slopeR = -255.0 / 63.0;
	this.colourmap = 0;	
	this.GRAY = 0;
	this.JET = 1;
	this.HOT = 2;
	
	// Selected point
	this.drawcursor = false;
	this.selectedx = 0;
	this.selectedy = 0;
	this.selectedlength = 6;
	
}

/************************************
 Calculates the image
 ************************************/
TFalseColour.prototype.calculateImageData = function() {
	for (var ph = 0; ph < this.width; ph++) {
		for (var pv = 0; pv < this.height; pv++) {
			var val = Math.floor((this.value[ph][pv] - this.min) / (this.max - this.min) * 255);
			this.setPixel(ph, pv, val);
		}
	}
}

/************************************
 Redraws the screen
 ************************************/
TFalseColour.prototype.draw = function() {
	this.context.clearRect(this.left, this.top, this.width, this.height);
	this.imageData = this.context.createImageData(this.width, this.height);
	this.calculateImageData();
	this.context.putImageData(this.imageData, this.left, this.top);
	if (this.drawcursor)
		this.drawCursor();
}

/************************************
 Draws the cursor
 ************************************/
TFalseColour.prototype.drawCursor = function() {
	this.context.strokeStyle = "#FF0000";
	this.context.lineWidth = 1;
	this.context.beginPath();
	this.context.moveTo(this.left + this.selectedx - this.selectedlength / 2, this.top + this.selectedy);
	this.context.lineTo(this.left + this.selectedx + this.selectedlength / 2, this.top + this.selectedy);
	this.context.stroke();
	this.context.beginPath();
	this.context.moveTo(this.left + this.selectedx, this.top + this.selectedy - this.selectedlength / 2);
	this.context.lineTo(this.left + this.selectedx, this.top + this.selectedy + this.selectedlength / 2);
	this.context.stroke();
//	console.log(this.colourmap);
}



/*************************************
Process pointer move event - called if user drags
*************************************/
TFalseColour.prototype.handleClickEvent = function(px, py) {
	if (this.inside(px,py)) {
		this.setSelected(px - this.left, py - this.top);
		return true;
	}
	return false;
}

/************************************
 Initialises the image
 ************************************/
TFalseColour.prototype.init = function() {
	for (var ph = 0; ph < this.width; ph++) {
		this.value[ph] = new Array();
		for (var pv = 0; pv < this.height; pv++)
			this.value[ph][pv] = 0;
	}
}

/*************************************
Returns true if pixel position is inside the slider
*************************************/
TFalseColour.prototype.inside = function(px, py) {
	if (px > this.left && px < this.left + this.width && py > this.top && py < this.top + this.height)
		return true;
	else
		return false;
}

/************************************
 Gets the selected value
 ************************************/
TFalseColour.prototype.getSelectedValue = function() {
	if (this.drawcursor)
		return this.value[this.selectedx][this.selectedy];
	else
		return 0;
}

/*************************************
Normalise image data
*************************************/
TFalseColour.prototype.normaliseImageData = function() {
	var imax = 0;
	for (var i = 0; i < this.width; i++) {
		for (var j = 0; j < this.height; j++) {
		    var index = (i + j * this.imageData.width) * 4;
		    for (var c = 0; c < 3; c++) {
		    	if (this.imageData.data[index+c] > imax)
		    		imax = this.imageData.data[index+c];
		    }
		}
	}
	if (imax == 0)
		imax = 1;
	for (var i = 0; i < this.width; i++) {
		for (var j = 0; j < this.height; j++) {
		    var index = (i + j * this.imageData.width) * 4;
		    for (var c = 0; c < 3; c++) {
		    	this.imageData.data[index+c] *= 255/imax;
		    }
		}
	}
}

/************************************
 Erases the image
 ************************************/
TFalseColour.prototype.resetImage = function() {
	for (var ph = 0; ph < this.width; ph++) {
		for (var pv = 0; pv < this.height; pv++)
			this.value[ph][pv] = 0;
	}
}

/************************************
 Sets the colour map
 ************************************/
TFalseColour.prototype.setColourMap = function(colourmap) {
	this.colourmap = colourmap;
}

/************************************
 Sets the maximum and minimum values for the colour map
 ************************************/
TFalseColour.prototype.setLimits = function(min, max) {
	this.min = min;
	this.max = max;
}

/************************************
 Sets the position of the image
 ************************************/
TFalseColour.prototype.setPosition = function(left, top) {
	this.left = left;
	this.top = top;
}

/************************************
 Sets the position of the cursor
 ************************************/
TFalseColour.prototype.setSelected = function(selectedx, selectedy) {
	this.selectedx = Math.round(selectedx);
	this.selectedy = Math.round(selectedy);
	if (this.selectedx >= 0 && this.selectedy >= 0)
		this.drawcursor = true;
	else
		this.drawcursor = false;
}

/************************************
 Sets the size of the image
 ************************************/
TFalseColour.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;
	this.init();
}

/*************************************
Sets the pixel colour
*************************************/
TFalseColour.prototype.setPixel = function(ph, pv, val) {
	val = Math.floor(val);
    var r = 0;
    var g = 0;
    var b = 0;
    switch (this.colourmap) {
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
    index = (ph + pv * this.imageData.width) * 4;
    this.imageData.data[index+0] = r;
    this.imageData.data[index+1] = g;
    this.imageData.data[index+2] = b;
    this.imageData.data[index+3] = 255;
}

/*************************************
Sets the value at a given location
*************************************/
TFalseColour.prototype.setValue = function(ph, pv, val) {
	ph = Math.floor(ph);
	pv = Math.floor(pv);
	if (ph >=0 && ph < this.width && pv >=0 && pv < this.height)
		this.value[ph][pv] = val;
}

