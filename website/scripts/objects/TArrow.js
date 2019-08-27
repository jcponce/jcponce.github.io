/*************************************
Script to draw an arrow
Tim McIntyre
V1 - February 2013
V2 - October 2016
Units are in pixels, y increasing downwards
*************************************/
function TArrow(context) {
	this.context = context;
	this.xhead;
	this.yhead;
	this.xtail;
	this.ytail;
	this.angle;
	this.arrowheadlength = 6;
	this.colour = "#000000";
	if (this.arrowheadlength > this.linelength/2)
		this.arrowheadlength = this.linelength/2;
	this.arrowtype = 0;		// 0 = line + arrow head, 1 = full arrow
}

/*************************************
Sets the colour of the arrow
*************************************/
TArrow.prototype.setColour = function(colour) {
	this.colour = colour;
}

/*************************************
Sets arrow by giving the position of the head, the length and the angle (clockwise from the x direction, tail to head)
*************************************/
TArrow.prototype.setHeadAngle = function(xhead, yhead, length, angle) {
	this.xhead = xhead;
	this.yhead = yhead;
	this.angle = angle;
	this.xtail = this.xhead - length * Math.cos(this.angle);
	this.ytail = this.yhead + length * Math.sin(this.angle);

}

/*************************************
Sets arrow by giving the position of the tail, the length and the angle (clockwise from the x direction, tail to head)
*************************************/
TArrow.prototype.setTailAngle = function(xtail, ytail, length, angle) {
	this.xtail = xtail;
	this.ytail = ytail;
	this.angle = angle;
	this.xhead = this.xtail + length * Math.cos(this.angle);
	this.yhead = this.ytail - length * Math.sin(this.angle);

}

/*************************************
Sets arrow by giving the position of the tail, the length and the angle (clockwise from the x direction, tail to head)
*************************************/
TArrow.prototype.setCentreAngle = function(xcentre, ycentre, length, angle) {
	this.angle = angle;
	this.xtail = xcentre - length * Math.cos(this.angle) / 2;
	this.ytail = ycentre + length * Math.sin(this.angle) / 2;
	this.xhead = this.xtail + length * Math.cos(this.angle);
	this.yhead = this.ytail - length * Math.sin(this.angle);

}

/*************************************
Sets arrow by giving the position of the tail, and the head
*************************************/
TArrow.prototype.setHeadTail = function(xhead, yhead, xtail, ytail) {
	this.xhead = xhead;
	this.yhead = yhead;
	this.xtail = xtail;
	this.ytail = ytail;
	this.angle = Math.atan2(this.ytail - this.yhead, this.xhead - this.xtail);
}

/*************************************
Draw arrow
*************************************/
TArrow.prototype.draw = function() {
	var linelength = Math.floor(Math.sqrt((this.xhead - this.xtail) * (this.xhead - this.xtail) + (this.yhead - this.ytail) * (this.yhead - this.ytail)));
		
	if (linelength > 0) {
		if (this.arrowtype == 0) {

			this.context.strokeStyle = this.colour;
			this.context.lineWidth = 1;

			this.context.beginPath();
			this.context.moveTo(this.xhead,this.yhead);
			this.context.lineTo(this.xtail,this.ytail);
			this.context.stroke();
		
			var arrowheadlength = this.arrowheadlength;
			if (arrowheadlength > linelength/2)
				arrowheadlength = linelength/2;
			this.context.fillStyle = this.colour;
			this.context.beginPath();
			var x = linelength;
			var y = 0;
			var length = Math.sqrt(x * x + y * y);
			var pointangle = Math.atan2(y,x)
			this.context.moveTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = linelength - arrowheadlength;
			y = arrowheadlength / 2;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = linelength - arrowheadlength;
			y = -arrowheadlength / 2;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			this.context.closePath();
			this.context.fill();
		} else if (this.arrowtype == 1) {
			var arrowheadlength = linelength / 3;
			var arrowheadwidth = arrowheadlength;
			this.context.fillStyle = this.colour;
			this.context.beginPath();
			var x = 0;
			var y = arrowheadwidth / 2;
			var length = Math.sqrt(x * x + y * y);
			var pointangle = Math.atan2(y,x)
			this.context.moveTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = linelength - arrowheadlength;
			y = arrowheadwidth / 2;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = linelength - arrowheadlength;
			y = arrowheadwidth;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = linelength;
			y = 0;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = linelength - arrowheadlength;
			y = -arrowheadwidth;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = linelength - arrowheadlength;
			y = -arrowheadwidth / 2;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			x = 0;
			y = -arrowheadwidth / 2;
			length = Math.sqrt(x * x + y * y);
			pointangle = Math.atan2(y,x)
			this.context.lineTo(this.xtail + length * Math.cos(pointangle + this.angle), this.ytail - length * Math.sin(pointangle + this.angle));
			this.context.closePath();
			this.context.fill();
		}
	} else {
		this.context.fillStyle = this.colour;
		this.context.fillRect(this.xtail, this.ytail, 1, 1);		
	}
}

