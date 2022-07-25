Clazz.declarePackage ("com.falstad");
c$ = Clazz.decorateAsClass (function () {
this.re = 0;
this.im = 0;
this.mag = 0;
this.phase = 0;
Clazz.instantialize (this, arguments);
}, com.falstad, "Complex");
Clazz.makeConstructor (c$, 
function () {
this.re = this.im = this.mag = this.phase = 0;
});
Clazz.defineMethod (c$, "magSquared", 
function () {
return this.mag * this.mag;
});
Clazz.defineMethod (c$, "set", 
function (c) {
this.re = c.re;
this.im = c.im;
this.mag = c.mag;
this.phase = c.phase;
}, "com.falstad.Complex");
Clazz.defineMethod (c$, "setRe", 
function (r) {
this.re = r;
this.im = 0;
this.setMP ();
}, "~N");
Clazz.defineMethod (c$, "setReIm", 
function (r, i) {
this.re = r;
this.im = i;
this.setMP ();
return this;
}, "~N,~N");
Clazz.defineMethod (c$, "setMagPhase", 
function (magnitude, phase) {
this.mag = magnitude;
this.phase = phase;
this.re = magnitude * Math.cos (phase);
this.im = magnitude * Math.sin (phase);
}, "~N,~N");
Clazz.defineMethod (c$, "add", 
function (c) {
this.re += c.re;
this.im += c.im;
this.setMP ();
}, "com.falstad.Complex");
Clazz.defineMethod (c$, "addRe", 
function (r) {
this.re += r;
this.setMP ();
}, "~N");
Clazz.defineMethod (c$, "addReIm", 
function (r, i) {
this.re += r;
this.im += i;
this.setMP ();
}, "~N,~N");
Clazz.defineMethod (c$, "addQuick", 
function (r, i) {
this.re += r;
this.im += i;
}, "~N,~N");
Clazz.defineMethod (c$, "subtract", 
function (c) {
this.re -= c.re;
this.im -= c.im;
this.setMP ();
}, "com.falstad.Complex");
Clazz.defineMethod (c$, "mult", 
function (c) {
this.multReIm (c.re, c.im);
}, "com.falstad.Complex");
Clazz.defineMethod (c$, "multRe", 
function (c) {
this.re *= c;
this.im *= c;
this.mag *= c;
}, "~N");
Clazz.defineMethod (c$, "multReIm", 
function (r, i) {
this.setReIm (this.re * r - this.im * i, this.re * i + this.im * r);
}, "~N,~N");
Clazz.defineMethod (c$, "divide", 
function (c) {
var n = c.re * c.re + c.im * c.im;
this.multReIm (c.re / n, -c.im / n);
}, "com.falstad.Complex");
Clazz.defineMethod (c$, "scaleAdd", 
function (x, z) {
this.re += z.re * x;
this.im += z.im * x;
this.setMP ();
}, "~N,com.falstad.Complex");
Clazz.defineMethod (c$, "scaleAdd2", 
function (x, c1, c2) {
this.re += x * (c1.re * c2.re - c1.im * c2.im);
this.im += x * (c1.re * c2.im + c1.im * c2.re);
this.setMP ();
}, "~N,com.falstad.Complex,com.falstad.Complex");
Clazz.defineMethod (c$, "square", 
function () {
this.setReIm (this.re * this.re - this.im * this.im, 2 * this.re * this.im);
});
Clazz.defineMethod (c$, "sqrt", 
function () {
this.setMagPhase (Math.sqrt (this.mag), this.phase * .5);
});
Clazz.defineMethod (c$, "recip", 
function () {
var n = this.re * this.re + this.im * this.im;
this.setReIm (this.re / n, -this.im / n);
});
Clazz.defineMethod (c$, "rotate", 
function (a) {
this.setMagPhase (this.mag, (this.phase + a) % (6.283185307179586));
}, "~N");
Clazz.defineMethod (c$, "conjugate", 
function () {
this.im = -this.im;
this.phase = -this.phase;
});
Clazz.defineMethod (c$, "pow", 
function (p) {
this.phase *= p;
var abs = Math.pow (this.re * this.re + this.im * this.im, p * .5);
this.setMagPhase (abs, this.phase);
}, "~N");
Clazz.overrideMethod (c$, "toString", 
function () {
return this.re + "+" + this.im + "i";
});
Clazz.defineMethod (c$, "setMP", 
function () {
this.mag = Math.sqrt (this.re * this.re + this.im * this.im);
this.phase = Math.atan2 (this.im, this.re);
});
Clazz.defineMethod (c$, "log", 
function () {
this.setReIm (java.lang.Math.log (this.re * this.re + this.im * this.im), java.lang.Math.atan2 (this.im, this.re));
});
Clazz.defineMethod (c$, "arcsin", 
function () {
var z2 =  new com.falstad.Complex ();
z2.set (this);
z2.square ();
z2.multRe (-1);
z2.addRe (1);
z2.pow (.5);
this.multReIm (0, 1);
this.add (z2);
this.log ();
this.multReIm (0, -1);
});
