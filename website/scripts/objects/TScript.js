/*************************************
Base script for an interactive Javascript
*************************************/
function TScript(canvas) {
	this.canvas = canvas;

	// Width and height of the display - set in the init function to match window
	this.width = 100;
	this.height = 100;
	
	// Time parameters
	this.now = 0;
	this.last = 0;
	
	// Parameters for tracking mouse use
	this.lastclickh = 0;			// Last clicked horizontal mouse position
	this.lastclickv = 0;			// Last clicked vertical mouse position
	this.lastmoveh = 0;				// Last move horizontal mouse position
	this.lastmovev = 0;				// Last move vertical mouse position
	this.imagechanged = true;		// True if the solution has changed
	this.dragging = false;			// True if dragging
	this.clicked = false;			// True if clicked (but not dragging)
	
	// Parameters to control time history display
	this.showtimehistory = true;	// True when displaying the time history
	
	// Colours
	this.background = "#0272AB";
	this.foreground = "#C7C7C7";
	this.curvecolour = "#7E007E";
		
}

//--------------------------------Initialise-----------------------------------

/************************************
 Initiates all parameters
 ************************************/
TScript.prototype.init = function() {
	this.context = this.canvas.getContext('2d');
	this.rect = this.canvas.getBoundingClientRect();
	
	// Get window size and adjust accordingly
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
		
	this.initSpecific();
			
	var now = new Date();
	this.now = now.getTime() / 1000;
	this.last = this.now;
	
	var self = this;
	window.timer = setInterval(function() {
    self.run();
  }, 100);

}

/************************************
 For initial specific information - should be overwritten
 ************************************/
TScript.prototype.initSpecific = function() {
}

//--------------------------------Draw-----------------------------------

/************************************
 Draws the image
 ************************************/
TScript.prototype.draw = function() {
	this.context.fillStyle = this.background;
	this.context.fillRect(0, 0, this.width , this.height);
	this.drawSpecific();
	this.imagechanged = false;
		
}

/************************************
 For drawing specific information - should be overwritten
 ************************************/
TScript.prototype.drawSpecific = function() {
}

//--------------------------------Stop-----------------------------------

/*************************************
Stops the simulation
*************************************/
TScript.prototype.stop = function () {
    this.showtimehistory = false;
    this.imagechanged = false;
}
 
//--------------------------------Run-----------------------------------

/*************************************
Runs the simulation
*************************************/
TScript.prototype.run = function () {
	if (this.showtimehistory) {
		// Controls step by step display of the solution as a function of time
		var now = new Date();
		this.now = now.getTime() / 1000;
		if (this.now - this.last > 1) {
			this.last = this.now - 1;			
		}
		this.calculateSolution();
		this.imagechanged = true;
	}
	
	if (this.imagechanged == true)
		this.draw();

}

/************************************
 For calculating specific information - should be overwritten
 ************************************/
TScript.prototype.calculateSolution = function() {
}

//--------------------------------Pointer handling-----------------------------------

/*************************************
Process pointer move event - should be overwritten
*************************************/
TScript.prototype.handlePointerMoveEvent = function(mouseh, mousev) {
}

/*************************************
Process mouse click event - should be overwritten
*************************************/
TScript.prototype.handleClickEvent = function(mouseh, mousev) {
}

/*************************************
Pointer down listener (mouse or touch event)
*************************************/
TScript.prototype.pointerDown = function(clickh,clickv) {
	this.rect = this.canvas.getBoundingClientRect();
	// Record click location relative to top left of simulation window
	var mouseh = (clickh - this.rect.left)*(this.canvas.width/this.rect.width);
	var mousev = (clickv - this.rect.top)*(this.canvas.height/this.rect.height);
	
	if (mouseh > 0 && mouseh < this.canvas.width && mousev > 0 && mousev < this.canvas.height) {
		this.lastclickh = mouseh;
		this.lastclickv = mousev;
		this.lastmoveh = mouseh;
		this.lastmovev = mousev;
		this.dragging = true;
		this.clicked = true;
	}
}

/*************************************
Pointer up listener (mouse or touch event)
*************************************/
TScript.prototype.pointerUp = function(h,v) {
	if (this.clicked) {
		this.handleClickEvent(this.lastclickh,this.lastclickv);
		this.imagechanged = true;
		this.clicked = false;
	}
	this.dragging = false;
	this.clicked = false;
}

/*************************************
Pointer move listener (mouse or touch event)
*************************************/
TScript.prototype.pointerMove = function(h,v) {
	if (this.dragging) {
		this.rect = this.canvas.getBoundingClientRect();
		var mouseh = (h - this.rect.left)*(this.canvas.width/this.rect.width);
		var mousev = (v - this.rect.top)*(this.canvas.height/this.rect.height);
		this.handlePointerMoveEvent(mouseh, mousev);
		this.lastmoveh = mouseh;
		this.lastmovev = mousev;
		this.imagechanged = true;
		this.clicked = false;
	}
}

//--------------------------------Mouse-----------------------------------

/*************************************
Mouse down listener
*************************************/
TScript.prototype.mouseDownListener = function(evt) {
	this.pointerDown(evt.clientX, evt.clientY);
}

/*************************************
Mouse move listener
*************************************/
TScript.prototype.mouseMoveListener = function(evt) {
	this.pointerMove(evt.clientX, evt.clientY);
}

/*************************************
Mouse up listener
*************************************/
TScript.prototype.mouseUpListener = function(evt) {
	this.pointerUp(evt.clientX, evt.clientY);
}

//--------------------------------Touch-----------------------------------

/*************************************
Touch start listener
*************************************/
TScript.prototype.touchStartListener = function(evt) {
	var touches = evt.changedTouches;
	this.pointerDown(touches[0].clientX, touches[0].clientY);
	if (this.dragging) {
		e.preventDefault();
	}
}

/*************************************
Touch end listener
*************************************/
TScript.prototype.touchEndListener = function(evt) {
	var touches = evt.changedTouches;
	this.pointerUp(touches[0].clientX, touches[0].clientY);
}

/*************************************
Touch move listener
*************************************/
TScript.prototype.touchMoveListener = function(evt) {
	if (this.dragging)
		evt.preventDefault();
	var touches = evt.changedTouches;
	this.pointerMove(touches[0].clientX, touches[0].clientY);
}

