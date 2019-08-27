/*************************************
Script to show a colour bar
<p>
Tim McIntyre
<br>V1
<br>January 2014
*************************************/

function TColourBar(context) {
	this.context = context;
	this.width = 100;
	this.height = 100;
	this.left = 0;
	this.top = 0;
	this.barwidth = 100;
	this.barheight = 100;
	this.barleft = 0;
	this.bartop = 0;
	this.min = 0;
	this.max = 0;
	this.label = "";
	this.tfalsecolour = new TFalseColour(this.context);
	this.tstring = new TString();
	this.fontsize = 14;
	this.margin = 0.1;
	this.textmargin = 5;
	this.background = "#FFFFFF";
	this.foreground = "#000000";
}

/************************************
 Redraws the screen
 ************************************/
TColourBar.prototype.draw = function() {

	this.context.fillStyle = this.background;
	this.context.fillRect(this.left, this.top, this.width, this.height);

	var dum = "";
	this.context.font="" + this.fontsize + "px Helvetica";
	this.context.fillStyle = this.foreground;

	// Limits
	this.context.textAlign = 'center';
	this.context.textBaseline = 'top';
	dum = this.tstring.valueOfSigFig(this.min,2);
	this.context.fillText(dum, this.barleft, this.bartop + this.barheight + this.textmargin);
	dum = this.tstring.valueOfSigFig(this.max,2);
	this.context.fillText(dum, this.barleft + this.barwidth, this.bartop + this.barheight + this.textmargin);

	// Label
	this.context.textAlign = 'center';
	this.context.textBaseline = 'top';
	this.context.fillText(this.label, this.barleft + this.barwidth / 2, this.bartop + this.barheight + this.textmargin);

	this.tfalsecolour.draw();
	this.context.strokeStyle = this.foreground;
	this.context.beginPath();
	this.context.rect(this.barleft, this.bartop, this.barwidth, this.barheight);
	this.context.stroke();
}

/*************************************
Initialises all the values
*************************************/
TColourBar.prototype.init = function() {	

	this.barleft = this.left + this.margin * this.width;
	this.barwidth = this.width - 2 * (this.barleft - this.left);
	this.bartop = this.top;
	this.barheight = this.height / 2;
	
	this.tfalsecolour.setPosition(this.barleft,this.bartop);
	this.tfalsecolour.setSize(this.barwidth, this.barheight);
	this.tfalsecolour.setLimits(0, this.barwidth);
	for (var ph = 0; ph < this.barwidth; ph++)   
		for (var pv = 0; pv < this.barheight; pv++)
			this.tfalsecolour.setValue(ph, pv, ph);
}

/************************************
 Sets the background colour
 ************************************/
TColourBar.prototype.setBackground = function(background) {
	this.background = background;
}

/************************************
 Sets the colour map
 ************************************/
TColourBar.prototype.setColourMap = function(colourmap) {
	this.tfalsecolour.setColourMap(colourmap);
}

/************************************
 Sets the foreground colour
 ************************************/
TColourBar.prototype.setForeground = function(foreground) {
	this.foreground = foreground;
}

/************************************
 Sets the maximum and minimum labels for the colour map
 ************************************/
TColourBar.prototype.setLabel = function(label) {
	this.label = label;
}

/************************************
 Sets the maximum and minimum labels for the colour map
 ************************************/
TColourBar.prototype.setLimits = function(min, max) {
	this.min = min;
	this.max = max;
}

/************************************
 Sets the position of the image
 ************************************/
TColourBar.prototype.setPosition = function(left, top) {
	this.left = left;
	this.top = top;
}

/************************************
 Sets the size of the image
 ************************************/
TColourBar.prototype.setSize = function(width, height) {
	this.width = width;
	this.height = height;
}


