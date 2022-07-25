Clazz.declarePackage ("swingjs.plaf");
Clazz.load (["swingjs.plaf.JSTextUI"], "swingjs.plaf.JSTextFieldUI", ["java.awt.Dimension", "java.awt.event.ActionEvent", "swingjs.api.DOMNode"], function () {
c$ = Clazz.decorateAsClass (function () {
this.inputType = "text";
Clazz.instantialize (this, arguments);
}, swingjs.plaf, "JSTextFieldUI", swingjs.plaf.JSTextUI);
Clazz.overrideMethod (c$, "updateDOMNode", 
function () {
if (this.domNode == null) {
this.textListener.checkDocument ();
this.focusNode = this.enableNode = this.valueNode = this.domNode = swingjs.api.DOMNode.setStyles (this.newDOMObject ("input", this.id, ["type", this.inputType]), ["padding", "0px 1px"]);
swingjs.plaf.JSComponentUI.vCenter (this.domNode, -10);
this.setDataUI (this.domNode);
if ((this.c).isEditable ()) {
this.bindKeys (this.domNode);
this.addJQueryFocusCallbacks ();
}}this.setCssFont (this.setProp (this.domNode, "value", this.getComponentText ()), this.c.getFont ());
if (!this.editable) swingjs.api.DOMNode.setAttr (this.domNode, "readOnly", "true");
return this.domNode;
});
Clazz.overrideMethod (c$, "getCSSAdjustment", 
function () {
return  new java.awt.Dimension (0, -2);
});
Clazz.overrideMethod (c$, "handleEnter", 
function (eventType) {
if (eventType == 401) {
var a = this.getActionMap ().get ("notify-field-accept");
if (a != null) a.actionPerformed ( new java.awt.event.ActionEvent (this.c, 1001, "notify-field-accept", System.currentTimeMillis (), 0));
}return true;
}, "~N");
});
