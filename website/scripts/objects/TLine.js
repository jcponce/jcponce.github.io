/*************************************
Script to draw a line
<p>
Tim McIntyre
<br>V1
<br>February 2013
*************************************/
function TLine() {
	this.context;
	this.xstart;
	this.ystart;
	this.xend;
	this.yend;
	this.colour = "#000000";
}

/*************************************
Sets arrow by giving the position of the start, the length and the angle (anticlockwise from the x direction, start to end)
*************************************/
TLine.prototype.setStartAngle = function(xstart, ystart, length, angle) {
	this.xstart = xstart;
	this.ystart = ystart;
	this.xend = this.xstart - length * Math.cos(angle);
	this.yend = this.ystart + length * Math.sin(angle);

}

/*************************************
Sets arrow by giving the position of the end, the length and the angle (anticlockwise from the x direction, start to end)
*************************************/
TLine.prototype.setEndAngle = function(xend, yend, length, angle) {
	this.xend = xend;
	this.yend = yend;
	this.xstart = this.xend + length * Math.cos(angle);
	this.ystart = this.yend - length * Math.sin(angle);

}

/*************************************
Sets arrow by giving the position of the end, and the start
*************************************/
TLine.prototype.setStartEnd = function(xstart, ystart, xend, yend) {
	this.xstart = xstart;
	this.ystart = ystart;
	this.xend = xend;
	this.yend = yend;
}

/*************************************
Draws the arrow
*************************************/
TLine.prototype.draw = function() {
	this.context.strokeStyle = this.colour;
	this.context.beginPath();
	this.context.moveTo(this.xstart,this.ystart);
	this.context.lineTo(this.xend,this.yend);
	this.context.stroke();
}

