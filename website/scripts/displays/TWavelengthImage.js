/*************************************
Script to draw 2D images
Tim McIntyre
V2
June 2015
*************************************/
function TWavelengthImage(context) {
	this.context = context;
	this.width = 100;
	this.height = 100;
	this.left = 0;
	this.top = 0;

	this.lambda = 600e-9;
	this.lambdamin = 300e-9;
	this.lambdamax = 700e-9;
	
	this.imagedata;

	this.drawcursor = false;
	this.selectedx = 0;
	this.selectedy = 0;
	this.halflength = 5;
}

/************************************
 Initiates all parameters
 ************************************/
TWavelengthImage.prototype.init = function() {
	this.resetImage();
}

/************************************
 Redraws the screen
 ************************************/
TWavelengthImage.prototype.draw = function() {
	// Clear canvas
	this.context.clearRect(0, 0, this.width, this.height);
	if (this.drawcursor)
		this.drawCursor();
	this.context.putImageData(this.imageData, this.left, this.top);
}

/************************************
 Draws the cursor
 ************************************/
TWavelengthImage.prototype.drawCursor = function() {
	for (var i = 0; i < 2 * this.halflength + 1; i++) {
		var index = (this.selectedx + (i - this.halflength) + this.selectedy * this.imageData.width) * 4;
		for (var c = 0; c < 3; c++) {
		    this.imageData.data[index+c] = 255 - this.imageData.data[index+c];
		}
	}
	for (var j = 0; j < 2 * this.halflength + 1; j++) {
		var index = (this.selectedx + ((j - this.halflength) + this.selectedy) * this.imageData.width) * 4;
		if (j != this.halflength + 1) {
			for (var c = 0; c < 3; c++) {
			    this.imageData.data[index+c] = 255 - this.imageData.data[index+c];
			}
		}
	}
}

/*************************************
Normalise image data
*************************************/
TWavelengthImage.prototype.normaliseImageData = function() {
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
TWavelengthImage.prototype.resetImage = function() {
	this.imageData = this.context.createImageData(this.width, this.height);
}

/*************************************
Sets the pixel colour
*************************************/
TWavelengthImage.prototype.setPixel = function(x, y, r, g, b, a) {
    index = (x + y * this.imageData.width) * 4;
    this.imageData.data[index+0] += r;
    this.imageData.data[index+1] += g;
    this.imageData.data[index+2] += b;
    this.imageData.data[index+3] += a;
}

/*************************************
Sets the pixel colour
*************************************/
TWavelengthImage.prototype.setPixelWavelength = function(x, y, w, level) {
	var centre = new Array(650, 530, 450);			// Central wavelength for r,g,b
	var halfWidth = new Array(100, 80, 80);			// Half width of r,g,b
	var rgb = new Array();
	var max = 0;
	if (w < 350 || w> 750)
		this.setPixel(x, y, 0, 0, 0, 255);
	if (w > centre[0])
		rgb[0] = 1000;
	else
		rgb[0] = 1000 - 1000 * (centre[0] - w) * (centre[0] - w) / halfWidth[0] / halfWidth[0];
	rgb[1] = 1000 - 1000 * (centre[1] - w) * (centre[1] - w) / halfWidth[1] / halfWidth[1];
	if (w < centre[2]) {
		rgb[2] = 1000;
		rgb[0] = 1000 * (centre[2] - w) / 150;		// Violet correction
	}	
	else
		rgb[2] = 1000 - 1000 * (centre[2] - w) * (centre[2] - w) / halfWidth[2] / halfWidth[2];				
	for (var i = 0; i < 3; i++) {
		if (rgb[i] < 0)
			rgb[i] = 0;
		if (rgb[i] > max)
			max = rgb[i];
	}
	if (max * level / 1000 > 255 || level > 255)
		this.setPixel(x, y, 255, 255, 255, 255);
	else		
		this.setPixel(x, y, level * rgb[0] / max, level * rgb[1] / max, level * rgb[2] / max, 255);
}

/************************************
 Sets the size of the image
 ************************************/
TWavelengthImage.prototype.setPosition = function(left, top) {
	this.left = left;
	this.top = top;
}

/************************************
 Sets the size of the image
 ************************************/
TWavelengthImage.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;
	this.init();
}

