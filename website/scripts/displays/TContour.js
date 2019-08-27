/*************************************
Script to draw 2D images
Tim McIntyre
V1
January 2014
*************************************/
function TContour(imageData) {

	// Image parameters
	this.imageData = imageData;
	this.hoffset = 0;
	this.voffset = 0;
	this.width = this.imageData.width;
	this.height = this.imageData.height;
	this.drawFalseColour = true;
	this.drawContour = true;
	this.drawBorder = true;

	// Value parameters
	this.value = new Array();
	this.min = Number.MAX_VALUE;
	this.max = -Number.MAX_VALUE;
	this.cmin = this.min;
	this.cmax = this.max;
	
	// Contour parameters
	this.border = new Array();
	this.contours = 20;
	this.autoscale = true;
	this.contourLevel = 128;
	
	// Colour map parameters
	this.slopeL = 255.0 / 64.0;
	this.slopeM = 255.0 / 128.0;
	this.slopeR = -255.0 / 63.0;
	this.colourmap = 0;	
	this.GRAY = 0;
	this.JET = 1;
	this.HOT = 2;
	
}

/************************************
 Calculates the image
 ************************************/
TContour.prototype.calculateImageData = function() {
	if (this.autoscale) {
		this.cmin = this.min;
		this.cmax = this.max;
//		console.log("TC", this.cmin, this.cmax);
	}
	var step = (this.cmax - this.cmin) / (this.contours - 1);
	for (var ph = 0; ph < this.width; ph++) {
		for (var pv = 0; pv < this.height; pv++) {
			var val = Math.floor((this.value[ph][pv] - this.cmin) / (this.cmax - this.cmin) * 255);
			if (this.drawFalseColour)
				this.setPixel(ph + this.hoffset, pv + this.voffset, val);
			if (this.drawContour) {
				this.border[ph][pv] = this.cmin + Math.floor((this.value[ph][pv] - this.cmin) / step);
			}
		}
	}
//	console.log("Step", this.cmin, step, this.min, this.max);
	if (this.drawContour) {
		var phlower = 0;
		var phupper = this.width;
		var pvlower = 0;
		var pvupper = this.height;
		if (!this.drawBorder) {
			phlower++;
			phupper--;
			pvlower++;
			pvupper--;
		}
		for (var pv = pvlower; pv < pvupper; pv++) {
//			console.log("TC", this.voffset, pv);
			for (var ph = phlower; ph < phupper; ph++) {
				var diff = false;
				if (ph < this.width - 1 && this.border[ph][pv] != this.border[ph+1][pv])
					diff = true;
				if (ph > 0 && this.border[ph][pv] != this.border[ph-1][pv])
					diff = true;
				if (pv < this.height - 1 && this.border[ph][pv] != this.border[ph][pv+1])
					diff = true;
				if (pv > 0 && this.border[ph][pv] != this.border[ph][pv-1])
					diff = true;
				if (diff)
					this.setPixel(ph + this.hoffset, pv + this.voffset, this.contourLevel);
			}
		}
// 		for (i = 0; i < 4; i++)
// 			console.log("Val", i, this.value[3][i], this.value[400][i], this.border[3][i], this.border[400][i]);
	}
}

/************************************
 Initialises the image
 ************************************/
TContour.prototype.init = function() {
	for (var ph = 0; ph < this.width; ph++) {
		this.value[ph] = new Array();
		this.border[ph] = new Array();
		for (var pv = 0; pv < this.height; pv++)
			this.value[ph][pv] = 0;
			this.border[ph][pv] = 0;
	}
	this.min = Number.MAX_VALUE;
	this.max = -Number.MAX_VALUE;
}

/*************************************
Normalise image data
*************************************/
TContour.prototype.normaliseImageData = function() {
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
TContour.prototype.resetImage = function() {
	for (var ph = 0; ph < this.width; ph++) {
		for (var pv = 0; pv < this.height; pv++)
			this.value[ph][pv] = 0;
	}
	this.min = Number.MAX_VALUE;
	this.max = -Number.MAX_VALUE;
}

/************************************
 Sets the colour map
 ************************************/
TContour.prototype.setColourMap = function(colourmap) {
	this.colourmap = colourmap;
}

/************************************
 Sets the maximum and minimum values for the colour map
 ************************************/
TContour.prototype.setLimits = function(min, max) {
	this.cmin = min;
	this.cmax = max;
}

/************************************
 Sets the size of the image
 ************************************/
TContour.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;
}

/************************************
 Sets the size of the image
 ************************************/
TContour.prototype.setOffset = function(hoffset, voffset) {
	this.hoffset = hoffset;
	this.voffset = voffset;
}

/*************************************
Sets the pixel colour
*************************************/
TContour.prototype.setPixel = function(ph, pv, val) {
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
TContour.prototype.setValue = function(ph, pv, val) {
	ph = Math.floor(ph);
	pv = Math.floor(pv);
	if (ph >= this.hoffset && ph < this.hoffset + this.width && pv >= this.voffset && pv < this.voffset + this.height) {
		this.value[ph - this.hoffset][pv - this.voffset] = val;
		if (val < this.min) {
			this.min = val;
		}
		if (val > this.max)
			this.max = val;
	}
}

/*************************************
Gets the value at a given location
*************************************/
TContour.prototype.getValue = function(ph, pv) {
	ph = Math.floor(ph);
	pv = Math.floor(pv);
	if (ph >= this.hoffset && ph < this.hoffset + this.width && pv >= this.voffset && pv < this.voffset + this.height)
		return this.value[ph - this.hoffset][pv - this.voffset];
	else
		return 0;
}

