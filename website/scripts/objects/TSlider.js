/*************************************
Script to managed a slider
<p>
Tim McIntyre
<br>V1
<br>January 2014
*************************************/
function TSlider(context) {
	this.context = context;
	this.left = 0;
	this.width = 100;
	this.top = 0;
	this.height = 50;
	this.borderleft = 5;
	this.bordertop = 10;
	this.boxwidth = 11;
	this.steps = this.width - 2 * this.borderleft - this.boxwidth;
	this.min = 0;
	this.max = 1;
	this.step = this.steps / 2;
	this.forecolour = "#000000";
	this.background = "#FFFFFF";
	this.title = "";
	this.units = "";
	this.minlabel = "Min";
	this.maxlabel = "Max";
	this.tstring = new TString();
}

/*************************************
Draws the slider
*************************************/
TSlider.prototype.draw = function() {
	this.context.strokeStyle = this.foreground;
	this.context.fillStyle = this.background;
	this.context.fillRect(this.left, this.top, this.width , this.height);

	// Draw Lines
	this.context.beginPath();
	this.context.moveTo(this.left + this.borderleft, this.top + this.height / 2);
	this.context.lineTo(this.left + this.width - this.borderleft, this.top + this.height / 2);
	this.context.stroke();
	this.context.beginPath();
	this.context.moveTo(this.left + this.borderleft, this.top + this.bordertop);
	this.context.lineTo(this.left + this.borderleft, this.top + this.height - this.bordertop);
	this.context.stroke();
	this.context.beginPath();
	this.context.moveTo(this.left + this.width - this.borderleft, this.top + this.bordertop);
	this.context.lineTo(this.left + this.width - this.borderleft, this.top + this.height - this.bordertop);
	this.context.stroke();

	// Draw Slider
	this.context.fillStyle = this.foreground;
	var ph = this.left + this.borderleft + this.step;
	var pv = this.top + this.bordertop;
	this.context.fillRect(ph, pv, this.boxwidth , this.height - 2 * this.bordertop);
	
	this.context.font="12px Times";
	this.context.fillStyle = this.foreground;
	this.context.textAlign = 'center';
	this.context.textBaseline = 'bottom';
	var title = "";
	if (this.title.length > 0)
		title = this.title + " = ";
	title = title + this.tstring.valueOfSigFig(this.value(),2);
	if (this.units.length > 0)
		title = title + " " + this.units;
	this.context.fillText(title , this.left + this.width / 2, this.top + this.bordertop - 1);
	this.context.textAlign = 'left';
	this.context.textBaseline = 'top';
	this.context.fillText(this.minlabel, this.left + this.borderleft + 1, this.top + this.height - this.bordertop + 1);
	this.context.textAlign = 'right';
	this.context.textBaseline = 'top';
	this.context.fillText(this.maxlabel, this.left + this.width - this.borderleft - 1, this.top + this.height - this.bordertop + 1);
}

/*************************************
Handle click event
*************************************/
TSlider.prototype.handleClickEvent = function(px, py) {
	if (this.inside(px,py)) {
		this.step = Math.round(px - this.left - this.borderleft - this.boxwidth / 2 - 0.5);
		if (this.step < 0)
			this.step = 0;
		if (this.step > this.steps)
			this.step = this.steps;
		return true;
	}
	return false;
}

/*************************************
Process pointer move event - called if user drags
*************************************/
TSlider.prototype.handlePointerMoveEvent = function(px, py) {
	if (this.inside(px,py)) {
		this.step = Math.round(px - this.left - this.borderleft - this.boxwidth / 2 - 0.5);
		if (this.step < 0)
			this.step = 0;
		if (this.step > this.steps)
			this.step = this.steps;
		return true;
	}
	return false;
}

/*************************************
Returns true if pixel position is inside the slider
*************************************/
TSlider.prototype.inside = function(px, py) {
	if (px > this.left && px < this.left + this.width && py > this.top && py < this.top + this.height)
		return true;
	else
		return false;
}

/*************************************
Resets the slider
*************************************/
TSlider.prototype.reset = function() {
	this.steps = this.width - 2 * this.borderleft - this.boxwidth;
	this.step = this.steps / 2;
}

/************************************
 Sets the background colour
 ************************************/
TSlider.prototype.setBackground = function(background) {
	this.background = background;
}

/*************************************
Sets the borders of the slider
*************************************/
TSlider.prototype.setBorders = function(borderleft,bordertop) {
	this.borderleft = borderleft;
	this.bordertop = bordertop;
	this.reset();
}

/************************************
 Sets the foreground colour
 ************************************/
TSlider.prototype.setForeground = function(foreground) {
	this.foreground = foreground;
}

/*************************************
Sets the width and height of the slider
*************************************/
TSlider.prototype.setLabels = function(minlabel,maxlabel) {
	this.minlabel = minlabel;
	this.maxlabel = maxlabel;
}

/*************************************
Sets the value limits
*************************************/
TSlider.prototype.setLimits = function(min,max) {
	this.min = min;
	this.max = max;
	if (this.min == this.max)
		this.max = this.min + 1;
}

/*************************************
Sets the top, left position of the slider
*************************************/
TSlider.prototype.setPosition = function(left,top) {
	this.left = left;
	this.top = top;
}

/*************************************
Sets the width and height of the slider
*************************************/
TSlider.prototype.setSize = function(width,height) {
	this.width = width;
	this.height = height;
	this.reset();
}

/*************************************
Sets the title of the slider
*************************************/
TSlider.prototype.setTitle = function(title) {
	this.title = title;
}

/*************************************
Sets the units of the slider
*************************************/
TSlider.prototype.setUnits = function(units) {
	this.units = units;
}

/*************************************
Resets the slider
*************************************/
TSlider.prototype.setValue = function(value) {
	this.step = (value - this.min) * this.steps / (this.max - this.min);
	if (this.step < 0)
		this.step = 0;
	if (this.step > this.steps)
		this.step = this.steps;
}

/*************************************
Returns the value of the slider
*************************************/
TSlider.prototype.value = function() {
	return this.min + this.step * (this.max - this.min) / this.steps;
}

