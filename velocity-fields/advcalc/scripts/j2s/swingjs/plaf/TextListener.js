Clazz.declarePackage ("swingjs.plaf");
Clazz.load (["java.awt.event.FocusListener", "$.MouseListener", "$.MouseMotionListener", "java.beans.PropertyChangeListener", "javax.swing.event.ChangeListener", "$.DocumentListener"], "swingjs.plaf.TextListener", ["javax.swing.SwingUtilities"], function () {
c$ = Clazz.decorateAsClass (function () {
this.txtComp = null;
this.haveDocument = false;
this.ui = null;
Clazz.instantialize (this, arguments);
}, swingjs.plaf, "TextListener", null, [java.awt.event.MouseListener, java.awt.event.MouseMotionListener, java.awt.event.FocusListener, javax.swing.event.ChangeListener, java.beans.PropertyChangeListener, javax.swing.event.DocumentListener]);
Clazz.makeConstructor (c$, 
function (ui, txtComp) {
this.txtComp = txtComp;
this.ui = ui;
}, "swingjs.plaf.JSTextUI,javax.swing.text.JTextComponent");
Clazz.defineMethod (c$, "checkDocument", 
function () {
if (!this.haveDocument && this.txtComp.getDocument () != null) {
this.haveDocument = true;
this.txtComp.getDocument ().addDocumentListener (this);
}});
Clazz.overrideMethod (c$, "propertyChange", 
function (e) {
var prop = e.getPropertyName ();
if ("font" === prop || "foreground" === prop || "preferredSize" === prop) {
var txtComp = e.getSource ();
(txtComp.getUI ()).propertyChangedFromListener (prop);
}if ("editable" === prop) this.ui.setEditable ((e.getNewValue ()).booleanValue ());
}, "java.beans.PropertyChangeEvent");
Clazz.overrideMethod (c$, "stateChanged", 
function (e) {
var txtComp = e.getSource ();
txtComp.repaint ();
}, "javax.swing.event.ChangeEvent");
Clazz.overrideMethod (c$, "focusGained", 
function (e) {
}, "java.awt.event.FocusEvent");
Clazz.overrideMethod (c$, "focusLost", 
function (e) {
}, "java.awt.event.FocusEvent");
Clazz.overrideMethod (c$, "mouseMoved", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseDragged", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseClicked", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mousePressed", 
function (e) {
if (javax.swing.SwingUtilities.isLeftMouseButton (e)) {
var txtComp = e.getSource ();
if (!txtComp.contains (e.getX (), e.getY ())) return;
if (!txtComp.hasFocus () && txtComp.isRequestFocusEnabled ()) {
txtComp.requestFocus ();
}}}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseReleased", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseEntered", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseExited", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "handleJSTextEvent", 
function (ui, eventType, jQueryEvent) {
var dot = 0;
var mark = 0;
var evType = null;
var keyCode = 0;
{
mark = jQueryEvent.target.selectionStart;
dot = jQueryEvent.target.selectionEnd;
evType = jQueryEvent.type;
keyCode = jQueryEvent.keyCode;
if (keyCode == 13) keyCode = 10;
}var oldDot = ui.editor.getCaret ().getDot ();
var oldMark = ui.editor.getCaret ().getMark ();
if (dot != mark && oldMark == dot) {
dot = mark;
mark = oldMark;
}switch (eventType) {
case 501:
case 502:
case 500:
break;
case 401:
case 402:
case 400:
if (keyCode == 10 && ui.handleEnter (eventType)) break;
var val = ui.getJSTextValue ();
if (!val.equals (ui.currentText)) {
var oldval = ui.currentText;
ui.editor.setText (val);
ui.editor.firePropertyChangeObject ("text", oldval, val);
ui.domNode.setSelectionRange (dot, dot);
}break;
}
if (dot != oldDot || mark != oldMark) {
ui.editor.getCaret ().setDot (dot);
if (dot != mark) ui.editor.getCaret ().moveDot (mark);
ui.editor.caretEvent.fire ();
}if (ui.debugging) System.out.println (ui.id + " TextListener handling event " + evType + " " + eventType + " " + ui.editor.getCaret () + " " + ui.getComponentText ().length);
return true;
}, "swingjs.plaf.JSTextUI,~N,~O");
Clazz.overrideMethod (c$, "insertUpdate", 
function (e) {
this.setText ();
}, "javax.swing.event.DocumentEvent");
Clazz.overrideMethod (c$, "removeUpdate", 
function (e) {
this.setText ();
}, "javax.swing.event.DocumentEvent");
Clazz.overrideMethod (c$, "changedUpdate", 
function (e) {
}, "javax.swing.event.DocumentEvent");
Clazz.defineMethod (c$, "setText", 
 function () {
(this.txtComp.getUI ()).propertyChangedFromListener ("text");
});
});
