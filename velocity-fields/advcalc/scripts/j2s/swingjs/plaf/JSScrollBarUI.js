Clazz.declarePackage ("swingjs.plaf");
Clazz.load (["swingjs.plaf.JSSliderUI"], "swingjs.plaf.JSScrollBarUI", ["java.awt.Dimension", "swingjs.api.DOMNode"], function () {
c$ = Clazz.decorateAsClass (function () {
this.isInvisible = false;
Clazz.instantialize (this, arguments);
}, swingjs.plaf, "JSScrollBarUI", swingjs.plaf.JSSliderUI);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, swingjs.plaf.JSScrollBarUI);
this.isScrollBar = true;
});
Clazz.defineMethod (c$, "propertyChange", 
function (e) {
Clazz.superCall (this, swingjs.plaf.JSScrollBarUI, "propertyChange", [e]);
System.out.println (this.id + " propertyChange " + this.dumpEvent (e));
}, "java.beans.PropertyChangeEvent");
Clazz.defineMethod (c$, "stateChanged", 
function (e) {
Clazz.superCall (this, swingjs.plaf.JSScrollBarUI, "stateChanged", [e]);
System.out.println (this.id + " stateChange " + this.dumpEvent (e));
}, "javax.swing.event.ChangeEvent");
Clazz.overrideMethod (c$, "getPreferredSize", 
function () {
var wh = (this.scrollPaneUI == null ? 15 : this.scrollPaneUI.scrollBarUIDisabled ? 0 : 15);
return  new java.awt.Dimension (wh, wh);
});
Clazz.overrideMethod (c$, "setVisible", 
function (b) {
this.isInvisible = (this.scrollPaneUI != null && this.scrollPaneUI.scrollBarUIDisabled);
b = new Boolean (b & !this.isInvisible).valueOf ();
swingjs.api.DOMNode.setStyles (this.getOuterNode (), ["display", b ? "block" : "none"]);
swingjs.api.DOMNode.setStyles (this.jqSlider, ["display", b ? "block" : "none"]);
}, "~B");
});
