Clazz.declarePackage ("swingjs.plaf");
Clazz.load (["javax.swing.AbstractAction", "javax.swing.text.TextAction", "swingjs.plaf.JSLightweightUI", "javax.swing.text.DefaultEditorKit"], "swingjs.plaf.JSTextUI", ["javax.swing.SwingUtilities", "$.UIManager", "javax.swing.plaf.ActionMapUIResource", "$.InputMapUIResource", "$.UIResource", "swingjs.JSToolkit", "swingjs.api.DOMNode", "swingjs.plaf.JSCaret", "$.TextListener"], function () {
c$ = Clazz.decorateAsClass (function () {
this.textListener = null;
this.editor = null;
this.editable = true;
if (!Clazz.isClassDefined ("swingjs.plaf.JSTextUI.TextActionWrapper")) {
swingjs.plaf.JSTextUI.$JSTextUI$TextActionWrapper$ ();
}
if (!Clazz.isClassDefined ("swingjs.plaf.JSTextUI.FocusAction")) {
swingjs.plaf.JSTextUI.$JSTextUI$FocusAction$ ();
}
this.bgcolor0 = null;
Clazz.instantialize (this, arguments);
}, swingjs.plaf, "JSTextUI", swingjs.plaf.JSLightweightUI);
Clazz.defineMethod (c$, "getComponentText", 
function () {
return this.currentText = (this.c).getText ();
});
Clazz.defineMethod (c$, "installDefaults", 
function () {
});
Clazz.defineMethod (c$, "installDefaults2", 
 function () {
var caret = this.editor.getCaret ();
if (caret == null || Clazz.instanceOf (caret, javax.swing.plaf.UIResource)) {
this.editor.setCaret ( new swingjs.plaf.JSCaret ());
}});
Clazz.overrideMethod (c$, "handleJSEvent", 
function (target, eventType, jQueryEvent) {
return this.textListener.handleJSTextEvent (this, eventType, jQueryEvent);
}, "~O,~N,~O");
Clazz.defineMethod (c$, "uninstallDefaults", 
function () {
if (Clazz.instanceOf (this.editor.getCaretColor (), javax.swing.plaf.UIResource)) {
this.editor.setCaretColor (null);
}if (Clazz.instanceOf (this.editor.getSelectionColor (), javax.swing.plaf.UIResource)) {
this.editor.setSelectionColor (null);
}if (Clazz.instanceOf (this.editor.getDisabledTextColor (), javax.swing.plaf.UIResource)) {
this.editor.setDisabledTextColor (null);
}if (Clazz.instanceOf (this.editor.getSelectedTextColor (), javax.swing.plaf.UIResource)) {
this.editor.setSelectedTextColor (null);
}if (Clazz.instanceOf (this.editor.getBorder (), javax.swing.plaf.UIResource)) {
this.editor.setBorder (null);
}if (Clazz.instanceOf (this.editor.getMargin (), javax.swing.plaf.UIResource)) {
this.editor.setMargin (null);
}});
Clazz.defineMethod (c$, "installKeyboardActions", 
function () {
var km = this.getInputMap ();
if (km != null) {
javax.swing.SwingUtilities.replaceUIInputMap (this.editor, 0, km);
}var map = this.getActionMap ();
if (map != null) {
javax.swing.SwingUtilities.replaceUIActionMap (this.editor, map);
}});
Clazz.defineMethod (c$, "getInputMap", 
function () {
var map =  new javax.swing.plaf.InputMapUIResource ();
return map;
});
Clazz.defineMethod (c$, "getActionMap", 
function () {
var mapName = this.classID + ".actionMap";
var map = javax.swing.UIManager.get (mapName);
if (map == null) {
map = this.createActionMap ();
if (map != null) {
javax.swing.UIManager.getLookAndFeelDefaults ().put (mapName, map);
}}return map;
});
Clazz.defineMethod (c$, "createActionMap", 
function () {
var map =  new javax.swing.plaf.ActionMapUIResource ();
var actions = this.editor.getActions ();
var n = (actions == null ? 0 : actions.length);
for (var i = 0; i < n; i++) {
var a = actions[i];
map.put (a.getValue ("Name"), a);
}
return map;
});
Clazz.defineMethod (c$, "uninstallKeyboardActions", 
function () {
this.editor.setKeymap (null);
javax.swing.SwingUtilities.replaceUIInputMap (this.editor, 2, null);
javax.swing.SwingUtilities.replaceUIActionMap (this.editor, null);
});
Clazz.defineMethod (c$, "getComponent", 
function () {
return this.editor;
});
Clazz.overrideMethod (c$, "installUIImpl", 
function () {
this.editor = this.c;
this.textListener =  new swingjs.plaf.TextListener (this, this.editor);
this.installDefaults ();
this.installDefaults2 ();
this.installListeners (this.editor);
this.installKeyboardActions ();
});
Clazz.overrideMethod (c$, "uninstallUIImpl", 
function () {
this.uninstallDefaults ();
this.jc.removeAll ();
var lm = this.jc.getLayout ();
if (Clazz.instanceOf (lm, javax.swing.plaf.UIResource)) {
this.jc.setLayout (null);
}this.uninstallKeyboardActions ();
this.uninstallListeners (this.editor);
this.editor = null;
this.textListener = null;
});
Clazz.defineMethod (c$, "installListeners", 
function (b) {
var listener = this.textListener;
b.addMouseListener (listener);
b.addMouseMotionListener (listener);
b.addFocusListener (listener);
b.addPropertyChangeListener (listener);
}, "javax.swing.text.JTextComponent");
Clazz.defineMethod (c$, "uninstallListeners", 
function (b) {
var listener = this.textListener;
b.removeMouseListener (listener);
b.removeMouseMotionListener (listener);
b.removeFocusListener (listener);
b.removePropertyChangeListener (listener);
b.getDocument ().removeDocumentListener (listener);
}, "javax.swing.text.JTextComponent");
Clazz.overrideMethod (c$, "getMinimumSize", 
function () {
var d = this.getPreferredSize ();
var i = this.jc.getInsets ();
d.width += i.left + i.right;
d.height += i.top + i.bottom;
return d;
});
Clazz.overrideMethod (c$, "getMaximumSize", 
function () {
return this.getMinimumSize ();
});
Clazz.defineMethod (c$, "getEditorKit", 
function (tc) {
return swingjs.plaf.JSTextUI.defaultKit;
}, "javax.swing.text.JTextComponent");
Clazz.defineMethod (c$, "handleEnter", 
function (eventType) {
return false;
}, "~N");
Clazz.defineMethod (c$, "setEditable", 
function (editable) {
this.editable = editable;
if (this.domNode == null) return;
if (this.c.isBackgroundSet ()) this.bgcolor0 = swingjs.JSToolkit.getCSSColor (this.c.getBackground ());
if (editable) {
this.domNode.removeAttribute ("readOnly");
if (this.bgcolor0 != null) swingjs.api.DOMNode.setStyles (this.domNode, ["background-color", this.bgcolor0]);
} else {
swingjs.api.DOMNode.setAttr (this.domNode, "readOnly", "true");
if (this.c.isBackgroundSet ()) {
this.bgcolor0 = swingjs.JSToolkit.getCSSColor (this.c.getBackground ());
} else {
if (this.bgcolor0 == null) this.bgcolor0 = swingjs.api.DOMNode.getStyle (this.domNode, "background-color");
}swingjs.api.DOMNode.setStyles (this.domNode, ["background-color", "rgba(0,0,0,0)"]);
}}, "~B");
c$.$JSTextUI$TextActionWrapper$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.action = null;
Clazz.instantialize (this, arguments);
}, swingjs.plaf.JSTextUI, "TextActionWrapper", javax.swing.text.TextAction);
Clazz.makeConstructor (c$, 
function (a) {
Clazz.superConstructor (this, swingjs.plaf.JSTextUI.TextActionWrapper, [a.getValue ("Name")]);
this.action = a;
}, "javax.swing.text.TextAction");
Clazz.defineMethod (c$, "actionPerformed", 
function (a) {
this.action.actionPerformed (a);
}, "java.awt.event.ActionEvent");
Clazz.defineMethod (c$, "isEnabled", 
function () {
return (this.b$["swingjs.plaf.JSTextUI"].editor == null || this.b$["swingjs.plaf.JSTextUI"].editor.isEditable ()) ? this.action.isEnabled () : false;
});
c$ = Clazz.p0p ();
};
c$.$JSTextUI$FocusAction$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, swingjs.plaf.JSTextUI, "FocusAction", javax.swing.AbstractAction);
Clazz.overrideMethod (c$, "actionPerformed", 
function (a) {
this.b$["swingjs.plaf.JSTextUI"].editor.requestFocus ();
}, "java.awt.event.ActionEvent");
Clazz.overrideMethod (c$, "isEnabled", 
function () {
return this.b$["swingjs.plaf.JSTextUI"].editor.isEditable ();
});
c$ = Clazz.p0p ();
};
c$.defaultKit = c$.prototype.defaultKit =  new javax.swing.text.DefaultEditorKit ();
});
