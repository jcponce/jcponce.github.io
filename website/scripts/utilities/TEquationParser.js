/*******************************************************
This class controls parsing an equation
Tim McIntyre
December 2016
********************************************************/	
function TEquationParser() {
	this.number = new Array();
	this.operation = new Array();
	this.tempoperation;
	this.tempnumber;
	this.order = new Array();
	this.xpos = new Array();
	this.ypos = new Array();
	this.zpos = new Array();
	
	this.op = 0;
	this.num = 0;
	this.xs = 0;
	this.ys = 0;
	this.zs = 0;
	this.currentnum = false;
	this.currentstring = false;
	this.isdecimal = false;
	
	this.errorStatus = 0;
	
	this.PLUS = 121;
	this.MINUS = 122;
	this.TIMES = 131;
	this.DIVIDE = 132;
	this.POWER = 141;
	this.BOPEN = 110;
	this.BCLOSE = 152;
}
	
// -- Initialise -----------------------------------------------------------------------------------------
	
/*******************************************************
Initiates default Stack
********************************************************/	
TEquationParser.prototype.init = function() {
	this.erase();
}

/*******************************************************
Performs a mathematical operation
********************************************************/	
TEquationParser.prototype.parse = function(instring) {
	this.number = new Array();
	this.operation = new Array();
	this.op = 0;
	this.num = 0;
	this.xs = 0;
	this.ys = 0;
	this.zs = 0;
	this.currentnum = false;
	this.currentstring = false;
	this.isdecimal = false;
	for (var i = 0; i < instring.length; i++) {
		switch (instring.charAt(i)) {
			case '+':
				this.checkinput();
				this.operation[this.op++] = this.PLUS;
				break;
			case '-':
				this.checkinput();
				if (this.op == 0 || this.operation[this.op-1] > 100) {
					this.operation[this.op++] = this.num;
					this.number[this.num++] = -1;
					this.operation[this.op++] = this.TIMES;
				} else {
					this.operation[this.op++] = this.MINUS;
				}
				break;
			case '*':
				this.checkinput();
				this.operation[this.op++] = this.TIMES;
				break;
			case '/':
				this.checkinput();
				this.operation[this.op++] = this.DIVIDE;
				break;
			case '^':
				this.checkinput();
				this.operation[this.op++] = this.POWER;
				break;
			case '.':
				this.isdecimal = 1;
				break;
			case 'x':
				this.checkinput();
				if (this.op > 0 && this.operation[this.op - 1] < 100)
					this.operation[this.op++] = this.TIMES;
				this.xpos[this.xs++] = this.num;
				this.operation[this.op++] = this.num;
				this.number[this.num++] = 0;
				break;
			case 'y':
				this.checkinput();
				if (this.op > 0 && this.operation[this.op - 1] < 100)
					this.operation[this.op++] = this.TIMES;
				this.ypos[this.ys++] = this.num;
				this.operation[this.op++] = this.num;
				this.number[this.num++] = 0;
				break;
			case 'z':
				this.checkinput();
				if (this.op > 0 && this.operation[this.op - 1] < 100)
					this.operation[this.op++] = this.TIMES;
				this.zpos[this.zs++] = this.num;
				this.operation[this.op++] = this.num;
				this.number[this.num++] = 0;
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				if (this.currentnum) {
					if (this.isdecimal) {
						var div = Math.pow(10,this.isdecimal++);
						this.currentnum += Number(instring.charAt(i)) / div;
					} else {
						this.currentnum = this.currentnum * 10 + Number(instring.charAt(i));
					}
				} else {
					this.currentnum = Number(instring.charAt(i));
				}
		}
	}
	this.checkinput();
// 	console.log("Eqn Start");
// 	for (var i = 0; i < this.operation.length; i++)
// 		console.log("Op", i, this.operation[i]);
// 	for (var i = 0; i < this.number.length; i++)
// 		console.log("Num", i, this.number[i]);
// 	for (var i = 0; i < this.xs; i++)
// 		console.log("x", i, this.xpos[i]);
// 	for (var i = 0; i < this.ys; i++)
// 		console.log("y", i, this.ypos[i]);
// 	console.log("Eqn End");
}

/*******************************************************
Checks status of current input
********************************************************/	
TEquationParser.prototype.checkinput = function() {
	if (this.currentnum) {
		this.operation[this.op++] = this.num;
		this.number[this.num++] = this.currentnum;
		this.currentnum = false;
		this.isdecimal = false;
	}
}

/*******************************************************
Performs a mathematical operation
********************************************************/	
TEquationParser.prototype.calculate = function(x, y, z) {
	for (var i = 0; i < this.xs; i++)
		this.number[this.xpos[i]] = x;
	for (var i = 0; i < this.ys; i++)
		this.number[this.ypos[i]] = y;
	for (var i = 0; i < this.zs; i++)
		this.number[this.zpos[i]] = z;
	
	this.tempoperation = this.operation.slice();
	this.tempnumber = this.number.slice();
	if (this.tempoperation.length > 0)
		this.subcalculate(0, this.tempoperation.length - 1);
	if (this.tempnumber.length > 0)
		return this.tempnumber[this.tempoperation[0]];
	else
		return 0;
}

/*******************************************************
Performs a mathematical operation
********************************************************/	
TEquationParser.prototype.subcalculate = function(start, stop) {
	while(stop > start) {
		var max = stop;
		for (var i = start; i < stop; i++)
			if (this.tempoperation[i] > this.tempoperation[max])
				max = i;
		switch (this.tempoperation[max]) {
			case this.PLUS:
				this.tempnumber[this.tempoperation[max-1]] += this.tempnumber[this.tempoperation[max+1]];
				this.tempoperation.splice(max,2);
				stop -= 2;
				break;
			case this.MINUS:
				this.tempnumber[this.tempoperation[max-1]] -= this.tempnumber[this.tempoperation[max+1]];
				this.tempoperation.splice(max,2);
				stop -= 2;
				break;
			case this.TIMES:
				this.tempnumber[this.tempoperation[max-1]] *= this.tempnumber[this.tempoperation[max+1]];
				this.tempoperation.splice(max,2);
				stop -= 2;
				break;
			case this.DIVIDE:
				this.tempnumber[this.tempoperation[max-1]] /= this.tempnumber[this.tempoperation[max+1]];
				this.tempoperation.splice(max,2);
				stop -= 2;
				break;
			case this.POWER:
				this.tempnumber[this.tempoperation[max-1]] = Math.pow(this.tempnumber[this.tempoperation[max-1]], this.tempnumber[this.tempoperation[max+1]]);
				this.tempoperation.splice(max,2);
				stop -= 2;
				break;
		}
	}
}			
			
