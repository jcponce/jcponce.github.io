/*************************************
Script to manage strings
Tim McIntyre
V1
December 2013
*************************************/
function TString() {
}

/************************************
 Determines the number of decimal places that represent the given number
 of significant figures
 e.g. for 123.45, 4 significant figures would return +1 while 2 significant figures would return -1
 ************************************/
TString.prototype.sigFigToDecimalPlaces = function(innum, sigFigs) {
	if (innum == 0)
		return 0;
	if (sigFigs <= 0) {
		outstring = "" + innum;
		if (outstring.indexOf(".") == -1)
			return 0;
		else
			return outstring.length - outstring.indexOf(".") - 1;
	}
	var outdigits = Math.abs(innum);
	outdigits = Math.log(outdigits)/Math.LN10;
	if (Math.round(outdigits) == outdigits)
		outdigits+= 1;
	else
		outdigits = Math.ceil(outdigits);
	outdigits = sigFigs - outdigits;
//	console.log("TSS2D: " + innum + " " + sigFigs + " " + outdigits);
	return outdigits;
}

/************************************
 Takes a double and returns a string with the given number of decimal places
 ************************************/
TString.prototype.valueOf = function(innum, decplaces) {
	var outstring = "";
	var outstring = "" + Math.round((innum + Number.MIN_VALUE) * Math.pow(10,decplaces)) / Math.pow(10,decplaces);
	if (decplaces > 0 && outstring.indexOf(".") == -1 && outstring.indexOf("e") == -1)
		outstring = outstring + ".0";
	if (decplaces > 0 && outstring.indexOf(".") >= 0 && outstring.indexOf("e") == -1) {
		var currentdecplaces = outstring.length - outstring.indexOf(".") - 1;
		while (currentdecplaces < decplaces) {
			outstring = outstring + "0";
			currentdecplaces++;
		}
	}
//	console.log("TSVOf: " + innum + " " + decplaces + " " + outstring);
	return outstring;
}

/************************************
 Takes a double and returns a string with the given digit number of significant figures
 ************************************/
TString.prototype.valueOfSigFig = function(innum, sigFigs) {
	return this.valueOf(innum, this.sigFigToDecimalPlaces(innum,sigFigs));
}

//console.log("TString End");	
//	console.log(r0, theta0 * 180 /Math.PI);
