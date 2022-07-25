Clazz.declarePackage ("swingjs.plaf");
Clazz.load (["java.beans.PropertyChangeListener", "javax.swing.event.ChangeListener", "swingjs.plaf.JSLightweightUI", "swingjs.jquery.JQueryUI"], "swingjs.plaf.JSSliderUI", ["java.awt.Dimension", "swingjs.JSToolkit", "swingjs.api.DOMNode"], function () {
c$ = Clazz.decorateAsClass (function () {
this.jSlider = null;
this.min = 0;
this.max = 0;
this.val = 0;
this.majorSpacing = 0;
this.minorSpacing = 0;
this.orientation = null;
this.iVertScrollBar = false;
this.scrollPaneUI = null;
this.paintTicks = false;
this.paintLabels = false;
this.jqSlider = null;
this.z0 = -2147483648;
this.model = null;
this.paintTrack = true;
this.isScrollBar = false;
this.jScrollBar = null;
this.sliderTrack = null;
this.sliderHandle = null;
this.disabled = 0;
Clazz.instantialize (this, arguments);
}, swingjs.plaf, "JSSliderUI", swingjs.plaf.JSLightweightUI, [java.beans.PropertyChangeListener, javax.swing.event.ChangeListener]);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, swingjs.plaf.JSSliderUI, []);
this.needPreferred = true;
this.setDoc ();
});
Clazz.overrideMethod (c$, "updateDOMNode", 
function () {
var isNew = (this.domNode == null);
var js = this.c;
this.min = js.getMinimum ();
this.max = js.getMaximum ();
this.val = js.getValue ();
if (!this.isScrollBar) {
this.minorSpacing = js.getMinorTickSpacing ();
this.majorSpacing = js.getMajorTickSpacing ();
this.paintTicks = js.getPaintTicks ();
this.paintLabels = js.getPaintLabels ();
this.paintTrack = js.getPaintTrack ();
}this.orientation = (js.getOrientation () == 1 ? "vertical" : "horizontal");
this.model = js.getModel ();
if (isNew) {
this.domNode = this.wrap ("div", this.id + "_wrap", [this.jqSlider = swingjs.api.DOMNode.createElement ("div", this.id, [])]);
this.$ (this.domNode).addClass ("swingjs");
this.setJQuerySliderAndEvents ();
}this.setup (isNew);
this.setSlider ();
return this.domNode;
});
Clazz.overrideMethod (c$, "installUIImpl", 
function () {
this.jSlider = this.c;
if (this.isScrollBar) this.jScrollBar = this.c;
});
Clazz.defineMethod (c$, "setJQuerySliderAndEvents", 
 function () {
{
var me = this;
me.$(me.jqSlider).j2sslider(
{ orientation: me.orientation,
range: false,
min: me.min,
max: me.max,
value: me.val,
disabled: me.disabled,
inverted: me.iVertScrollBar,
change: function(jqevent, handle) {
me.jqueryCallback(jqevent, handle); },
slide: function(jqevent, handle) {
me.jqueryCallback(jqevent, handle); },
start: function(jqevent, handle) {
me.jqueryStart(jqevent, handle); },
stop: function(jqevent, handle) {
me.jqueryStop(jqevent, handle); }
});
}});
Clazz.overrideMethod (c$, "setEnabled", 
function (b) {
Clazz.superCall (this, swingjs.plaf.JSSliderUI, "setEnabled", [b]);
this.setSliderAttr ("disabled", (this.disabled = (b ? 0 : 1)));
}, "~B");
Clazz.defineMethod (c$, "jqueryStart", 
function (event, ui) {
this.jSlider.setValueIsAdjusting (true);
}, "~O,swingjs.api.DOMNode");
Clazz.defineMethod (c$, "jqueryStop", 
function (event, ui) {
this.jSlider.setValueIsAdjusting (false);
}, "~O,swingjs.api.DOMNode");
Clazz.defineMethod (c$, "jqueryCallback", 
function (event, ui) {
var value = 0;
{
value = ui.value;
}this.jSlider.setValue (this.val = (this.iVertScrollBar ? 100 - value : value));
}, "~O,swingjs.api.DOMNode");
Clazz.defineMethod (c$, "setup", 
 function (isNew) {
var z = this.getZIndex (null);
if (z == this.z0) return;
this.z0 = z;
this.sliderTrack = swingjs.api.DOMNode.firstChild (this.domNode);
this.sliderHandle = swingjs.api.DOMNode.firstChild (this.sliderTrack);
if (isNew) {
this.handleAllMouseEvents (this.sliderHandle);
this.handleAllMouseEvents (this.sliderTrack);
}}, "~B");
Clazz.defineMethod (c$, "setSliderAttr", 
 function (key, val) {
{
var a = {};
a[key]= val;
this.$(this.jqSlider).j2sslider(a);
}}, "~S,~N");
Clazz.defineMethod (c$, "setSlider", 
function () {
this.setSliderAttr ("value", this.val);
this.setSliderAttr ("min", this.min);
this.setSliderAttr ("max", this.max);
var isHoriz = (this.jSlider.getOrientation () == 0);
var barPlace = 40;
if (isHoriz && this.jSlider.getBorder () != null) barPlace += 10;
var tickClass = "ui-slider-tick-mark" + (isHoriz ? "-vert" : "-horiz");
this.$ (this.jqSlider).find (tickClass).remove ();
this.$ (this.jqSlider).find (".jslider-labels").remove ();
this.setHTMLSize (this.jqSlider, false);
if (this.majorSpacing == 0 || this.minorSpacing == 0 || !this.paintTicks && !this.paintLabels) return;
var isInverted = this.jSlider.getInverted ();
var margin = 10;
var totalWidth = this.jSlider.getWidth ();
if (this.paintTicks) {
var check = Clazz.doubleToInt (this.majorSpacing / this.minorSpacing);
var fracSpacing = this.minorSpacing * 1 / (this.max - this.min);
var numTicks = (Clazz.doubleToInt (100 / this.minorSpacing)) + 1;
for (var i = 0; i < numTicks; i++) {
var node = swingjs.api.DOMNode.createElement ("span", this.id + "_t" + i, []);
this.$ (node).addClass ("swingjs");
this.$ (node).addClass (tickClass);
var isMajor = (i % check == 0);
var frac = (isHoriz == isInverted ? 1 - fracSpacing * i : fracSpacing * i);
var spt = (frac * (totalWidth - 2 * margin) + margin) + "px";
if (isMajor) this.$ (node).css (isHoriz ? "height" : "width", "10px");
this.$ (node).css (isHoriz ? "left" : "top", spt).appendTo (this.domNode);
}
this.setHTMLSize (this.domNode, false);
}if (this.paintLabels) {
var m = 10;
var h = this.height;
var w = this.width;
var labels = this.jSlider.getLabelTable ();
var keys = labels.keys ();
while (keys.hasMoreElements ()) {
var key = keys.nextElement ();
var n = Integer.parseInt (key.toString ());
var label = labels.get (key);
var labelNode = (label.getUI ()).getOuterNode ();
var frac = (n - this.min) * 1 / (this.max - this.min);
if (isHoriz == isInverted) frac = 1 - frac;
var px = (frac * (totalWidth - 2 * margin) + margin);
var left = Clazz.floatToInt (px - Clazz.doubleToInt (label.getWidth () / 2));
var top;
if (isHoriz) {
top = 28;
} else {
top = left;
left = 28;
}swingjs.api.DOMNode.setPositionAbsolute (labelNode, top, left);
this.domNode.appendChild (labelNode);
}
swingjs.api.DOMNode.setStyles (this.sliderTrack, [isHoriz ? "top" : "left", barPlace + "%"]);
this.setHTMLSize (this.domNode, false);
}});
Clazz.overrideMethod (c$, "setHTMLSize", 
function (obj, addCSS) {
var d = 20;
if (this.paintLabels || this.paintTicks) d += 20;
if (this.jSlider.getBorder () != null) d += 10;
return  new java.awt.Dimension (d, d);
}, "swingjs.api.DOMNode,~B");
Clazz.overrideMethod (c$, "propertyChange", 
function (e) {
var prop = e.getPropertyName ();
if (prop === "ancestor") this.setup (false);
}, "java.beans.PropertyChangeEvent");
Clazz.overrideMethod (c$, "stateChanged", 
function (e) {
var v;
if ((v = this.jSlider.getMinimum ()) != this.min) this.setSliderAttr ("min", this.min = v);
if ((v = this.jSlider.getMaximum ()) != this.max) this.setSliderAttr ("max", this.max = v);
if ((v = this.jSlider.getValue ()) != this.val) this.setSliderAttr ("value", this.val = v);
this.setup (false);
}, "javax.swing.event.ChangeEvent");
Clazz.overrideMethod (c$, "setInnerComponentBounds", 
function (width, height) {
if (this.iVertScrollBar) swingjs.api.DOMNode.setStyles (this.sliderHandle, ["left", "-8px"]);
}, "~N,~N");
{
swingjs.JSToolkit.getJavaResource ("swingjs/jquery/jquery-ui-j2sslider.css", true);
swingjs.JSToolkit.getJavaResource ("swingjs/jquery/jquery-ui-j2sslider.js", true);
}});
