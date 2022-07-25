Clazz.declarePackage ("swingjs");
Clazz.load (null, "swingjs.JSMouse2", ["JU.V3"], function () {
c$ = Clazz.decorateAsClass (function () {
this.mouse = null;
Clazz.instantialize (this, arguments);
}, swingjs, "JSMouse2");
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "set", 
function (mouse) {
this.mouse = mouse;
return this;
}, "swingjs.JSMouse");
Clazz.defineMethod (c$, "processTwoPointGesture", 
function (touches) {
if (touches[0].length < 2) return;
var t1 = touches[0];
var t2 = touches[1];
var t1first = t1[0];
var t1last = t1[t2.length - 1];
var x1first = t1first[0];
var x1last = t1last[0];
var dx1 = x1last - x1first;
var y1first = t1first[1];
var y1last = t1last[1];
var dy1 = y1last - y1first;
var v1 = JU.V3.new3 (dx1, dy1, 0);
var d1 = v1.length ();
var t2first = t2[0];
var t2last = t2[t2.length - 1];
var x2first = t2first[0];
var x2last = t2last[0];
var dx2 = x2last - x2first;
var y2first = t2first[1];
var y2last = t2last[1];
var dy2 = y2last - y2first;
var v2 = JU.V3.new3 (dx2, dy2, 0);
var d2 = v2.length ();
if (d1 < 1 || d2 < 1) return;
v1.normalize ();
v2.normalize ();
var cos12 = (v1.dot (v2));
if (cos12 > 0.8) {
var deltaX = Clazz.floatToInt (x1last - t1[t1.length - 2][0]);
var deltaY = Clazz.floatToInt (y1last - t1[t1.length - 2][1]);
this.mouse.translateXYBy (deltaX, deltaY);
} else if (cos12 < -0.8) {
v1 = JU.V3.new3 (x2first - x1first, y2first - y1first, 0);
v2 = JU.V3.new3 (x2last - x1last, y2last - y1last, 0);
var dx = v2.length () - v1.length ();
this.mouse.wheeled (System.currentTimeMillis (), dx < 0 ? -1 : 1, 507);
}}, "~A");
});
