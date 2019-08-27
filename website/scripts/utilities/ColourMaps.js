/* ColourMaps.js - A class for handling colour maps and a few instances.
 *
 * Copyright (C) 2017 The University of Queensland
 * Written by Isaac Lenton (aka ilent2)
 */

function ColourMap() {
}

// Create a CSS style string from the rgb colour numbers
// From SO: a/17909821/2372604
ColourMap.prototype.makeRgbString = function(r, g, b) {
  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);
  return ["rgb(",r,",",g,",",b,")"].join("");
}

ColourMap.prototype.getString = function(value) {
  // Overload this function
  return this.makeRgbString(value*255, value*255, value*255);
}

function LinearGradientColourMap(r0, g0, b0, r1, g1, b1) {
  ColourMap.call(this);

  this.rrange = r1 - r0;
  this.grange = g1 - g0;
  this.brange = b1 - b0;

  this.rstart = r0;
  this.gstart = g0;
  this.bstart = b0;
}
LinearGradientColourMap.prototype = Object.create(ColourMap.prototype);

LinearGradientColourMap.prototype.getString = function(value) {
  return this.makeRgbString(
      value * this.rrange + this.rstart,
      value * this.grange + this.gstart,
      value * this.brange + this.bstart);
}

function ColourMapGray() {
  LinearGradientColourMap.call(this, 0, 0, 0, 255, 255, 255);
}
ColourMapGray.prototype = Object.create(LinearGradientColourMap.prototype);

function ColourMapJet() {
  ColourMap.call(this);
}
ColourMapJet.prototype = Object.create(ColourMap.prototype);

// Body copied from TFalseColour.js V1, Tim McIntyre, January 2014
ColourMapJet.prototype.getString = function(val) {

  slopeL = 255.0 / 64.0;
  slopeM = 255.0 / 128.0;
  slopeR = -255.0 / 63.0;

  var r = 0; var g = 0; var b = 0;
  val = Math.floor(val*255);

  if (val < 0) {
    r = 0;
    g = 0;
    b = 255;
  } else if (val < 64) {
    r = 0;
    g = Math.round(slopeL * val);
    b = 255;
  } else if (val < 192) {
    r = Math.round(255 + slopeM * (val - 192));
    g = 255;
    b = Math.round(255 - slopeM * (val - 64));
  } else if (val < 256) {
    r = 255;
    g = Math.round(255 + slopeR * (val - 192));
    b = 0;
  } else {
    r = 255;
    g = 255;
    b = 0;
  }

  return this.makeRgbString(r, g, b);
}

function ColourMapHot() {
  ColourMap.call(this);
}
ColourMapHot.prototype = Object.create(ColourMap.prototype);

// Body copied from TFalseColour.js V1, Tim McIntyre, January 2014
ColourMapHot.prototype.getString = function(val) {

  var r = 0; var g = 0; var b = 0;
  val = Math.floor(val*255);

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

  return this.makeRgbString(r, g, b);
}

