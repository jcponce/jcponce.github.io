Clazz.declarePackage ("swingjs.plaf");
Clazz.load (["javax.swing.plaf.UIResource", "javax.swing.text.Caret"], "swingjs.plaf.JSCaret", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.c = null;
this.dot = 0;
this.mark = 0;
Clazz.instantialize (this, arguments);
}, swingjs.plaf, "JSCaret", null, [javax.swing.text.Caret, javax.swing.plaf.UIResource]);
Clazz.overrideMethod (c$, "install", 
function (c) {
this.c = c;
}, "javax.swing.text.JTextComponent");
Clazz.overrideMethod (c$, "deinstall", 
function (c) {
this.c = null;
}, "javax.swing.text.JTextComponent");
Clazz.overrideMethod (c$, "paint", 
function (g) {
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "addChangeListener", 
function (l) {
}, "javax.swing.event.ChangeListener");
Clazz.overrideMethod (c$, "removeChangeListener", 
function (l) {
}, "javax.swing.event.ChangeListener");
Clazz.overrideMethod (c$, "isVisible", 
function () {
return true;
});
Clazz.overrideMethod (c$, "setVisible", 
function (v) {
}, "~B");
Clazz.overrideMethod (c$, "isSelectionVisible", 
function () {
return true;
});
Clazz.overrideMethod (c$, "setSelectionVisible", 
function (v) {
}, "~B");
Clazz.overrideMethod (c$, "setMagicCaretPosition", 
function (p) {
}, "java.awt.Point");
Clazz.overrideMethod (c$, "getMagicCaretPosition", 
function () {
return null;
});
Clazz.overrideMethod (c$, "setBlinkRate", 
function (rate) {
}, "~N");
Clazz.overrideMethod (c$, "getBlinkRate", 
function () {
return 0;
});
Clazz.overrideMethod (c$, "getDot", 
function () {
return this.dot;
});
Clazz.overrideMethod (c$, "getMark", 
function () {
return this.mark;
});
Clazz.overrideMethod (c$, "setDot", 
function (dot) {
this.dot = this.mark = dot;
}, "~N");
Clazz.overrideMethod (c$, "moveDot", 
function (dot) {
this.mark = this.dot;
this.dot = dot;
}, "~N");
Clazz.overrideMethod (c$, "toString", 
function () {
return "caret[" + this.dot + "," + this.mark + "]";
});
});
