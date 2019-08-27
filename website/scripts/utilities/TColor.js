/*************************************
Script to draw the pattern for a double slit
<p>
Tim McIntyre
<br>V1
<br>February 2013
*************************************/
function OpticalInstrument(canvas) {
	this.canvas = canvas;
	this.imagechanged = true;
}

/************************************
 Initiates all parameters
 ************************************/
OpticalInstrument.prototype.init = function() {
	this.context = this.canvas.getContext('2d');
	this.rect = this.canvas.getBoundingClientRect();
	
	this.width = window.innerWidth - 20;
	this.height = window.innerHeight - 20;
	
	if (this.height > this.width) {
		this.width = window.innerHeight- 20;
		this.height = window.innerWidth - 20;
	}
	
	if (this.width > this.rect.width)
		this.width = this.rect.width;
	if (this.height > this.rect.height)
		this.height = this.rect.height;
		
	this.lambda = 600e-9;
	this.lambdamin = 300e-9;
	this.lambdamax = 700e-9;
	
	this.pixelperm = 10000;

	this.lastclickx = 0;
	this.lastclicky = 0;
	this.dragging = false;
}

/************************************
 Calculates the image
 ************************************/
OpticalInstrument.prototype.calculateImageData = function(imageData) {
}

/************************************
 Draws text on the image
 ************************************/
OpticalInstrument.prototype.drawText = function() {
}

/************************************
 Redraws the screen
 ************************************/
OpticalInstrument.prototype.draw = function() {
	// Clear canvas
	if (this.imagechanged) {
		this.context.clearRect(0, 0, this.width, this.height);
		imageData = this.context.createImageData(this.width, this.height);
		this.calculateImageData(imageData);
		this.context.putImageData(imageData, 0, 0);
		this.drawText();
		this.imagechanged = false;
	}
}

/*************************************
Process mouse move event
*************************************/
OpticalInstrument.prototype.handlePointerMoveEvent = function(mousex, mousey) {
}

/*************************************
Mouse down listener
*************************************/
OpticalInstrument.prototype.mouseDownListener = function(evt) {
	this.pointerDown(evt.clientX, evt.clientY);
}

/*************************************
Mouse move listener
*************************************/
OpticalInstrument.prototype.mouseMoveListener = function(evt) {
	this.pointerMove(evt.clientX, evt.clientY);
}

/*************************************
Mouse up listener
*************************************/
OpticalInstrument.prototype.mouseUpListener = function(evt) {
	this.pointerUp(evt.clientX, evt.clientY);
}

/*************************************
Pointer down listener
*************************************/
OpticalInstrument.prototype.pointerDown = function(x,y) {
	this.rect = this.canvas.getBoundingClientRect();
	var mousex = (x - this.rect.left)*(this.canvas.width/this.rect.width);
	var mousey = (y - this.rect.top)*(this.canvas.height/this.rect.height);
	if ( mousex > 0 && mousex < this.width && mousey > 0 && mousey < this.height) {
		this.lastclickx = mousex;
		this.lastclicky = mousey;
		this.dragging = true;
	}	
}

/*************************************
Mouse up listener
*************************************/
OpticalInstrument.prototype.pointerUp = function(x,y) {
	this.dragging = false;
}

/*************************************
Mouse move listener
*************************************/
OpticalInstrument.prototype.pointerMove = function(x,y) {
	if (this.dragging) {
		this.rect = this.canvas.getBoundingClientRect();
		var mousex = (x - this.rect.left)*(this.canvas.width/this.rect.width);
		var mousey = (y - this.rect.top)*(this.canvas.height/this.rect.height);
		this.handlePointerMoveEvent(mousex, mousey);
		this.imagechanged = true;
		this.lastclickx = mousex;
		this.lastclicky = mousey;
	}
}

/*************************************
Runs the simulation
*************************************/
OpticalInstrument.prototype.run = function() {
	this.draw();
}

/*************************************
Sets the pixel colour
*************************************/
OpticalInstrument.prototype.setPixel = function(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

/*************************************
Sets the pixel colour
*************************************/
OpticalInstrument.prototype.setPixelWavelength = function(imageData, x, y, w, level) {
	var centre = new Array(650, 530, 450);			// Central wavelength for r,g,b
	var halfWidth = new Array(100, 80, 80);			// Half width of r,g,b
	var rgb = new Array();
	var max = 0;
	if (w < 350 || w> 750)
		this.setPixel(imageData, x, y, 0, 0, 0, 255);
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
		this.setPixel(imageData, x, y, 255, 255, 255, 255);
	else		
		this.setPixel(imageData, x, y, level * rgb[0] / max, level * rgb[1] / max, level * rgb[2] / max, 255);
}

/*************************************
Touch start listener
*************************************/
OpticalInstrument.prototype.touchStartListener = function(evt) {
	var touches = evt.changedTouches;
	this.pointerDown(touches[0].clientX, touches[0].clientY);
	if (this.dragging) {
		e.preventDefault();
	}
}

/*************************************
Touch end listener
*************************************/
OpticalInstrument.prototype.touchEndListener = function(evt) {
	var touches = evt.changedTouches;
	this.pointerUp(touches[0].clientX, touches[0].clientY);
}

/*************************************
Touch move listener
*************************************/
OpticalInstrument.prototype.touchMoveListener = function(evt) {
	if (this.dragging)
		evt.preventDefault();
	var touches = evt.changedTouches;
	this.pointerMove(touches[0].clientX, touches[0].clientY);
}

