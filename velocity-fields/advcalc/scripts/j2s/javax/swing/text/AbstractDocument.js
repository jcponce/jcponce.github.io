Clazz.declarePackage ("javax.swing.text");
Clazz.load (["javax.swing.event.DocumentEvent", "javax.swing.text.DocumentFilter", "$.Element", "$.JSMinimalAbstractDocument", "$.MutableAttributeSet", "javax.swing.tree.TreeNode", "javax.swing.undo.AbstractUndoableEdit", "$.CompoundEdit", "javax.swing.event.EventListenerList"], "javax.swing.text.AbstractDocument", ["java.lang.Boolean", "java.util.Hashtable", "$.Vector", "javax.swing.UIManager", "javax.swing.event.DocumentEvent.ElementChange", "javax.swing.event.DocumentListener", "$.UndoableEditEvent", "$.UndoableEditListener", "javax.swing.text.BadLocationException", "$.SegmentCache", "$.StateInvariantError", "$.StyleConstants", "$.StyleContext", "$.Utilities"], function () {
c$ = Clazz.decorateAsClass (function () {
this.documentProperties = null;
this.listenerList = null;
this.data = null;
this.context = null;
this.bidiRoot = null;
this.documentFilter = null;
this.filterBypass = null;
if (!Clazz.isClassDefined ("javax.swing.text.AbstractDocument.AbstractElement")) {
javax.swing.text.AbstractDocument.$AbstractDocument$AbstractElement$ ();
}
if (!Clazz.isClassDefined ("javax.swing.text.AbstractDocument.BranchElement")) {
javax.swing.text.AbstractDocument.$AbstractDocument$BranchElement$ ();
}
if (!Clazz.isClassDefined ("javax.swing.text.AbstractDocument.LeafElement")) {
javax.swing.text.AbstractDocument.$AbstractDocument$LeafElement$ ();
}
if (!Clazz.isClassDefined ("javax.swing.text.AbstractDocument.DefaultDocumentEvent")) {
javax.swing.text.AbstractDocument.$AbstractDocument$DefaultDocumentEvent$ ();
}
if (!Clazz.isClassDefined ("javax.swing.text.AbstractDocument.UndoRedoDocumentEvent")) {
javax.swing.text.AbstractDocument.$AbstractDocument$UndoRedoDocumentEvent$ ();
}
if (!Clazz.isClassDefined ("javax.swing.text.AbstractDocument.DefaultFilterBypass")) {
javax.swing.text.AbstractDocument.$AbstractDocument$DefaultFilterBypass$ ();
}
Clazz.instantialize (this, arguments);
}, javax.swing.text, "AbstractDocument", null, javax.swing.text.JSMinimalAbstractDocument);
Clazz.prepareFields (c$, function () {
this.listenerList =  new javax.swing.event.EventListenerList ();
});
Clazz.makeConstructor (c$, 
function (data) {
this.construct (data, javax.swing.text.StyleContext.getDefaultStyleContext ());
}, "javax.swing.text.AbstractDocument.Content");
Clazz.makeConstructor (c$, 
function (data, context) {
this.data = data;
this.context = context;
}, "javax.swing.text.AbstractDocument.Content,javax.swing.text.AbstractDocument.AttributeContext");
Clazz.defineMethod (c$, "getDocumentProperties", 
function () {
if (this.documentProperties == null) {
this.documentProperties =  new java.util.Hashtable (2);
}return this.documentProperties;
});
Clazz.defineMethod (c$, "setDocumentProperties", 
function (x) {
this.documentProperties = x;
}, "java.util.Dictionary");
Clazz.defineMethod (c$, "fireInsertUpdate", 
function (e) {
try {
var listeners = this.listenerList.getListenerList ();
for (var i = listeners.length - 2; i >= 0; i -= 2) {
if (listeners[i] === javax.swing.event.DocumentListener) {
(listeners[i + 1]).insertUpdate (e);
}}
} finally {
}
}, "javax.swing.event.DocumentEvent");
Clazz.defineMethod (c$, "fireChangedUpdate", 
function (e) {
try {
var listeners = this.listenerList.getListenerList ();
for (var i = listeners.length - 2; i >= 0; i -= 2) {
if (listeners[i] === javax.swing.event.DocumentListener) {
(listeners[i + 1]).changedUpdate (e);
}}
} finally {
}
}, "javax.swing.event.DocumentEvent");
Clazz.defineMethod (c$, "fireRemoveUpdate", 
function (e) {
try {
var listeners = this.listenerList.getListenerList ();
for (var i = listeners.length - 2; i >= 0; i -= 2) {
if (listeners[i] === javax.swing.event.DocumentListener) {
(listeners[i + 1]).removeUpdate (e);
}}
} finally {
}
}, "javax.swing.event.DocumentEvent");
Clazz.defineMethod (c$, "fireUndoableEditUpdate", 
function (e) {
var listeners = this.listenerList.getListenerList ();
for (var i = listeners.length - 2; i >= 0; i -= 2) {
if (listeners[i] === javax.swing.event.UndoableEditListener) {
(listeners[i + 1]).undoableEditHappened (e);
}}
}, "javax.swing.event.UndoableEditEvent");
Clazz.defineMethod (c$, "getListeners", 
function (listenerType) {
return this.listenerList.getListeners (listenerType);
}, "Class");
Clazz.overrideMethod (c$, "getAsynchronousLoadPriority", 
function () {
var loadPriority = this.getProperty ("load priority");
if (loadPriority != null) {
return loadPriority.intValue ();
}return -1;
});
Clazz.defineMethod (c$, "setAsynchronousLoadPriority", 
function (p) {
var loadPriority = (p >= 0) ?  new Integer (p) : null;
this.putProperty ("load priority", loadPriority);
}, "~N");
Clazz.overrideMethod (c$, "setDocumentFilter", 
function (filter) {
this.documentFilter = filter;
}, "javax.swing.text.DocumentFilter");
Clazz.defineMethod (c$, "getDocumentFilter", 
function () {
return this.documentFilter;
});
Clazz.overrideMethod (c$, "getLength", 
function () {
return this.data.length () - 1;
});
Clazz.overrideMethod (c$, "addDocumentListener", 
function (listener) {
this.listenerList.add (javax.swing.event.DocumentListener, listener);
}, "javax.swing.event.DocumentListener");
Clazz.overrideMethod (c$, "removeDocumentListener", 
function (listener) {
this.listenerList.remove (javax.swing.event.DocumentListener, listener);
}, "javax.swing.event.DocumentListener");
Clazz.defineMethod (c$, "getDocumentListeners", 
function () {
return this.listenerList.getListeners (javax.swing.event.DocumentListener);
});
Clazz.overrideMethod (c$, "addUndoableEditListener", 
function (listener) {
this.listenerList.add (javax.swing.event.UndoableEditListener, listener);
}, "javax.swing.event.UndoableEditListener");
Clazz.overrideMethod (c$, "removeUndoableEditListener", 
function (listener) {
this.listenerList.remove (javax.swing.event.UndoableEditListener, listener);
}, "javax.swing.event.UndoableEditListener");
Clazz.defineMethod (c$, "getUndoableEditListeners", 
function () {
return this.listenerList.getListeners (javax.swing.event.UndoableEditListener);
});
Clazz.overrideMethod (c$, "getProperty", 
function (key) {
return this.getDocumentProperties ().get (key);
}, "~O");
Clazz.overrideMethod (c$, "putProperty", 
function (key, value) {
if (value != null) {
this.getDocumentProperties ().put (key, value);
} else {
this.getDocumentProperties ().remove (key);
}}, "~O,~O");
Clazz.overrideMethod (c$, "remove", 
function (offs, len) {
var filter = this.getDocumentFilter ();
this.writeLock ();
try {
if (filter != null) {
filter.remove (this.getFilterBypass (), offs, len);
} else {
this.handleRemove (offs, len);
}} finally {
this.writeUnlock ();
}
}, "~N,~N");
Clazz.defineMethod (c$, "handleRemove", 
function (offs, len) {
if (len > 0) {
if (offs < 0 || (offs + len) > this.getLength ()) {
throw  new javax.swing.text.BadLocationException ("Invalid remove", this.getLength () + 1);
}var chng = Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.DefaultDocumentEvent, this, null, offs, len, javax.swing.event.DocumentEvent.EventType.REMOVE);
var isComposedTextElement = false;
isComposedTextElement = javax.swing.text.Utilities.isComposedTextElement (this, offs);
this.removeUpdate (chng);
var u = this.data.remove (offs, len);
if (u != null) {
chng.addEdit (u);
}this.postRemoveUpdate (chng);
chng.end ();
this.fireRemoveUpdate (chng);
if ((u != null) && !isComposedTextElement) {
this.fireUndoableEditUpdate ( new javax.swing.event.UndoableEditEvent (this, chng));
}}}, "~N,~N");
Clazz.overrideMethod (c$, "replace", 
function (offset, length, text, attrs) {
if (length == 0 && (text == null || text.length == 0)) {
return;
}var filter = this.getDocumentFilter ();
this.writeLock ();
try {
if (filter != null) {
filter.replace (this.getFilterBypass (), offset, length, text, attrs);
} else {
if (length > 0) {
this.remove (offset, length);
}if (text != null && text.length > 0) {
this.insertString (offset, text, attrs);
}}} finally {
this.writeUnlock ();
}
}, "~N,~N,~S,javax.swing.text.AttributeSet");
Clazz.overrideMethod (c$, "insertString", 
function (offs, str, a) {
if ((str == null) || (str.length == 0)) {
return;
}var filter = this.getDocumentFilter ();
this.writeLock ();
try {
if (filter != null) {
filter.insertString (this.getFilterBypass (), offs, str, a);
} else {
this.handleInsertString (offs, str, a);
}} finally {
this.writeUnlock ();
}
}, "~N,~S,javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "handleInsertString", 
function (offs, str, a) {
if ((str == null) || (str.length == 0)) {
return;
}var u = this.data.insertString (offs, str);
var e = Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.DefaultDocumentEvent, this, null, offs, str.length, javax.swing.event.DocumentEvent.EventType.INSERT);
if (u != null) {
e.addEdit (u);
}if (this.getProperty ("i18n").equals (Boolean.FALSE)) {
}this.insertUpdate (e, a);
e.end ();
this.fireInsertUpdate (e);
if (u != null && (a == null || !a.isDefined (javax.swing.text.StyleConstants.ComposedTextAttribute))) {
this.fireUndoableEditUpdate ( new javax.swing.event.UndoableEditEvent (this, e));
}}, "~N,~S,javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "getText", 
function (offset, length) {
if (length < 0) {
throw  new javax.swing.text.BadLocationException ("Length must be positive", length);
}var str = this.data.getString (offset, length);
return str;
}, "~N,~N");
Clazz.defineMethod (c$, "getText", 
function (offset, length, txt) {
if (length < 0) {
throw  new javax.swing.text.BadLocationException ("Length must be positive", length);
}this.data.getChars (offset, length, txt);
}, "~N,~N,javax.swing.text.Segment");
Clazz.overrideMethod (c$, "createPosition", 
function (offs) {
return this.data.createPosition (offs);
}, "~N");
Clazz.overrideMethod (c$, "getStartPosition", 
function () {
var p;
try {
p = this.createPosition (0);
} catch (bl) {
if (Clazz.exceptionOf (bl, javax.swing.text.BadLocationException)) {
p = null;
} else {
throw bl;
}
}
return p;
});
Clazz.overrideMethod (c$, "getEndPosition", 
function () {
var p;
try {
p = this.createPosition (this.data.length ());
} catch (bl) {
if (Clazz.exceptionOf (bl, javax.swing.text.BadLocationException)) {
p = null;
} else {
throw bl;
}
}
return p;
});
Clazz.overrideMethod (c$, "getRootElements", 
function () {
var elems =  new Array (2);
elems[0] = this.getDefaultRootElement ();
elems[1] = this.getBidiRootElement ();
return elems;
});
Clazz.defineMethod (c$, "getFilterBypass", 
 function () {
if (this.filterBypass == null) {
this.filterBypass = Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.DefaultFilterBypass, this, null);
}return this.filterBypass;
});
Clazz.defineMethod (c$, "getBidiRootElement", 
function () {
return this.bidiRoot;
});
Clazz.defineMethod (c$, "isLeftToRight", 
function (p0, p1) {
if (!this.getProperty ("i18n").equals (Boolean.TRUE)) {
return true;
}var bidiRoot = this.getBidiRootElement ();
var index = bidiRoot.getElementIndex (p0);
var bidiElem = bidiRoot.getElement (index);
if (bidiElem.getEndOffset () >= p1) {
var bidiAttrs = bidiElem.getAttributes ();
return ((javax.swing.text.StyleConstants.getBidiLevel (bidiAttrs) % 2) == 0);
}return true;
}, "~N,~N");
Clazz.defineMethod (c$, "getAttributeContext", 
function () {
return this.context;
});
Clazz.defineMethod (c$, "insertUpdate", 
function (chng, attr) {
if (chng.type === javax.swing.event.DocumentEvent.EventType.INSERT && chng.getLength () > 0 && !Boolean.TRUE.equals (this.getProperty (javax.swing.text.AbstractDocument.MultiByteProperty))) {
var segment = javax.swing.text.SegmentCache.getSharedSegment ();
try {
this.getText (chng.getOffset (), chng.getLength (), segment);
segment.first ();
do {
if ((segment.current ()).charCodeAt (0) > 255) {
this.putProperty (javax.swing.text.AbstractDocument.MultiByteProperty, Boolean.TRUE);
break;
}} while (segment.next () != '\uffff');
} catch (ble) {
if (Clazz.exceptionOf (ble, javax.swing.text.BadLocationException)) {
} else {
throw ble;
}
}
javax.swing.text.SegmentCache.releaseSharedSegment (segment);
}}, "javax.swing.text.AbstractDocument.DefaultDocumentEvent,javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "removeUpdate", 
function (chng) {
}, "javax.swing.text.AbstractDocument.DefaultDocumentEvent");
Clazz.defineMethod (c$, "postRemoveUpdate", 
function (chng) {
}, "javax.swing.text.AbstractDocument.DefaultDocumentEvent");
Clazz.defineMethod (c$, "getContent", 
function () {
return this.data;
});
Clazz.defineMethod (c$, "createLeafElement", 
function (parent, a, p0, p1) {
return Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.LeafElement, this, null, parent, a, p0, p1);
}, "javax.swing.text.Element,javax.swing.text.AttributeSet,~N,~N");
Clazz.defineMethod (c$, "createBranchElement", 
function (parent, a) {
return Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.BranchElement, this, null, parent, a);
}, "javax.swing.text.Element,javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "writeLock", 
function () {
});
Clazz.defineMethod (c$, "writeUnlock", 
function () {
});
Clazz.defineMethod (c$, "readLock", 
function () {
});
Clazz.defineMethod (c$, "readUnlock", 
function () {
});
c$.$AbstractDocument$AbstractElement$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.parent = null;
this.attributes = null;
Clazz.instantialize (this, arguments);
}, javax.swing.text.AbstractDocument, "AbstractElement", null, [javax.swing.text.Element, javax.swing.text.MutableAttributeSet, javax.swing.tree.TreeNode]);
Clazz.makeConstructor (c$, 
function (a, b) {
this.parent = a;
this.attributes = this.b$["javax.swing.text.AbstractDocument"].getAttributeContext ().getEmptySet ();
if (b != null) {
this.addAttributes (b);
}}, "javax.swing.text.Element,javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "getAttributeCount", 
function () {
return this.attributes.getAttributeCount ();
});
Clazz.defineMethod (c$, "isDefined", 
function (a) {
return this.attributes.isDefined (a);
}, "~O");
Clazz.defineMethod (c$, "isEqual", 
function (a) {
return this.attributes.isEqual (a);
}, "javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "copyAttributes", 
function () {
return this.attributes.copyAttributes ();
});
Clazz.defineMethod (c$, "getAttribute", 
function (a) {
var b = this.attributes.getAttribute (a);
if (b == null) {
var c = (this.parent != null) ? this.parent.getAttributes () : null;
if (c != null) {
b = c.getAttribute (a);
}}return b;
}, "~O");
Clazz.defineMethod (c$, "getAttributeNames", 
function () {
return this.attributes.getAttributeNames ();
});
Clazz.defineMethod (c$, "containsAttribute", 
function (a, b) {
return this.attributes.containsAttribute (a, b);
}, "~O,~O");
Clazz.defineMethod (c$, "containsAttributes", 
function (a) {
return this.attributes.containsAttributes (a);
}, "javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "getResolveParent", 
function () {
var a = this.attributes.getResolveParent ();
if ((a == null) && (this.parent != null)) {
a = this.parent.getAttributes ();
}return a;
});
Clazz.overrideMethod (c$, "addAttribute", 
function (a, b) {
this.checkForIllegalCast ();
var c = this.b$["javax.swing.text.AbstractDocument"].getAttributeContext ();
this.attributes = c.addAttribute (this.attributes, a, b);
}, "~O,~O");
Clazz.overrideMethod (c$, "addAttributes", 
function (a) {
this.checkForIllegalCast ();
var b = this.b$["javax.swing.text.AbstractDocument"].getAttributeContext ();
this.attributes = b.addAttributes (this.attributes, a);
}, "javax.swing.text.AttributeSet");
Clazz.overrideMethod (c$, "removeAttribute", 
function (a) {
this.checkForIllegalCast ();
var b = this.b$["javax.swing.text.AbstractDocument"].getAttributeContext ();
this.attributes = b.removeAttribute (this.attributes, a);
}, "~O");
Clazz.defineMethod (c$, "removeAttributes", 
function (a) {
this.checkForIllegalCast ();
var b = this.b$["javax.swing.text.AbstractDocument"].getAttributeContext ();
this.attributes = b.removeAttributes (this.attributes, a);
}, "java.util.Enumeration");
Clazz.defineMethod (c$, "removeAttributes", 
function (a) {
this.checkForIllegalCast ();
var b = this.b$["javax.swing.text.AbstractDocument"].getAttributeContext ();
if (a === this) {
this.attributes = b.getEmptySet ();
} else {
this.attributes = b.removeAttributes (this.attributes, a);
}}, "javax.swing.text.AttributeSet");
Clazz.overrideMethod (c$, "setResolveParent", 
function (a) {
this.checkForIllegalCast ();
var b = this.b$["javax.swing.text.AbstractDocument"].getAttributeContext ();
if (a != null) {
this.attributes = b.addAttribute (this.attributes, javax.swing.text.StyleConstants.ResolveAttribute, a);
} else {
this.attributes = b.removeAttribute (this.attributes, javax.swing.text.StyleConstants.ResolveAttribute);
}}, "javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "checkForIllegalCast", 
 function () {
});
Clazz.overrideMethod (c$, "getDocument", 
function () {
return this.b$["javax.swing.text.AbstractDocument"];
});
Clazz.overrideMethod (c$, "getParentElement", 
function () {
return this.parent;
});
Clazz.defineMethod (c$, "getAttributes", 
function () {
return this;
});
Clazz.overrideMethod (c$, "getName", 
function () {
if (this.attributes.isDefined ("$ename")) {
return this.attributes.getAttribute ("$ename");
}return null;
});
Clazz.overrideMethod (c$, "getChildAt", 
function (a) {
return this.getElement (a);
}, "~N");
Clazz.overrideMethod (c$, "getChildCount", 
function () {
return this.getElementCount ();
});
Clazz.overrideMethod (c$, "getParent", 
function () {
return this.getParentElement ();
});
Clazz.overrideMethod (c$, "getIndex", 
function (a) {
for (var b = this.getChildCount () - 1; b >= 0; b--) if (this.getChildAt (b) === a) return b;

return -1;
}, "javax.swing.tree.TreeNode");
c$ = Clazz.p0p ();
};
c$.$AbstractDocument$BranchElement$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.$children = null;
this.nchildren = 0;
this.lastIndex = 0;
Clazz.instantialize (this, arguments);
}, javax.swing.text.AbstractDocument, "BranchElement", javax.swing.text.AbstractDocument.AbstractElement, null, Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.AbstractElement, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function (a, b) {
Clazz.superConstructor (this, javax.swing.text.AbstractDocument.BranchElement, [a, b]);
this.$children =  new Array (1);
this.nchildren = 0;
this.lastIndex = -1;
}, "javax.swing.text.Element,javax.swing.text.AttributeSet");
Clazz.defineMethod (c$, "positionToElement", 
function (a) {
var b = this.getElementIndex (a);
var c = this.$children[b];
var d = c.getStartOffset ();
var e = c.getEndOffset ();
if ((a >= d) && (a < e)) {
return c;
}return null;
}, "~N");
Clazz.defineMethod (c$, "replace", 
function (a, b, c) {
var d = c.length - b;
var e = a + b;
var f = this.nchildren - e;
var g = e + d;
if ((this.nchildren + d) >= this.$children.length) {
var h = Math.max (2 * this.$children.length, this.nchildren + d);
var i =  new Array (h);
System.arraycopy (this.$children, 0, i, 0, a);
System.arraycopy (c, 0, i, a, c.length);
System.arraycopy (this.$children, e, i, g, f);
this.$children = i;
} else {
System.arraycopy (this.$children, e, this.$children, g, f);
System.arraycopy (c, 0, this.$children, a, c.length);
}this.nchildren = this.nchildren + d;
}, "~N,~N,~A");
Clazz.overrideMethod (c$, "toString", 
function () {
return "BranchElement(" + this.getName () + ") " + this.getStartOffset () + "," + this.getEndOffset () + "\n";
});
Clazz.defineMethod (c$, "getName", 
function () {
var a = Clazz.superCall (this, javax.swing.text.AbstractDocument.BranchElement, "getName", []);
if (a == null) {
a = "paragraph";
}return a;
});
Clazz.defineMethod (c$, "getStartOffset", 
function () {
return this.$children[0].getStartOffset ();
});
Clazz.overrideMethod (c$, "getEndOffset", 
function () {
var a = (this.nchildren > 0) ? this.$children[this.nchildren - 1] : this.$children[0];
return a.getEndOffset ();
});
Clazz.overrideMethod (c$, "getElement", 
function (a) {
if (a < this.nchildren) {
return this.$children[a];
}return null;
}, "~N");
Clazz.overrideMethod (c$, "getElementCount", 
function () {
return this.nchildren;
});
Clazz.overrideMethod (c$, "getElementIndex", 
function (a) {
var b;
var c = 0;
var d = this.nchildren - 1;
var e = 0;
var f = this.getStartOffset ();
var g;
if (this.nchildren == 0) {
return 0;
}if (a >= this.getEndOffset ()) {
return this.nchildren - 1;
}if ((this.lastIndex >= c) && (this.lastIndex <= d)) {
var h = this.$children[this.lastIndex];
f = h.getStartOffset ();
g = h.getEndOffset ();
if ((a >= f) && (a < g)) {
return this.lastIndex;
}if (a < f) {
d = this.lastIndex;
} else {
c = this.lastIndex;
}}while (c <= d) {
e = c + (Clazz.doubleToInt ((d - c) / 2));
var h = this.$children[e];
f = h.getStartOffset ();
g = h.getEndOffset ();
if ((a >= f) && (a < g)) {
b = e;
this.lastIndex = b;
return b;
} else if (a < f) {
d = e - 1;
} else {
c = e + 1;
}}
if (a < f) {
b = e;
} else {
b = e + 1;
}this.lastIndex = b;
return b;
}, "~N");
Clazz.overrideMethod (c$, "isLeaf", 
function () {
return false;
});
Clazz.overrideMethod (c$, "getAllowsChildren", 
function () {
return true;
});
Clazz.overrideMethod (c$, "children", 
function () {
if (this.nchildren == 0) return null;
var a =  new java.util.Vector (this.nchildren);
for (var b = 0; b < this.nchildren; b++) a.addElement (this.$children[b]);

return a.elements ();
});
c$ = Clazz.p0p ();
};
c$.$AbstractDocument$LeafElement$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.p0 = null;
this.p1 = null;
Clazz.instantialize (this, arguments);
}, javax.swing.text.AbstractDocument, "LeafElement", javax.swing.text.AbstractDocument.AbstractElement, null, Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.AbstractElement, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function (a, b, c, d) {
Clazz.superConstructor (this, javax.swing.text.AbstractDocument.LeafElement, [a, b]);
try {
this.p0 = this.b$["javax.swing.text.AbstractDocument"].createPosition (c);
this.p1 = this.b$["javax.swing.text.AbstractDocument"].createPosition (d);
} catch (e) {
if (Clazz.exceptionOf (e, javax.swing.text.BadLocationException)) {
this.p0 = null;
this.p1 = null;
throw  new javax.swing.text.StateInvariantError ("Can't create Position references");
} else {
throw e;
}
}
}, "javax.swing.text.Element,javax.swing.text.AttributeSet,~N,~N");
Clazz.overrideMethod (c$, "toString", 
function () {
return "LeafElement(" + this.getName () + ") " + this.p0 + "," + this.p1 + "\n";
});
Clazz.overrideMethod (c$, "getStartOffset", 
function () {
return this.p0.getOffset ();
});
Clazz.overrideMethod (c$, "getEndOffset", 
function () {
return this.p1.getOffset ();
});
Clazz.defineMethod (c$, "getName", 
function () {
var a = Clazz.superCall (this, javax.swing.text.AbstractDocument.LeafElement, "getName", []);
if (a == null) {
a = "content";
}return a;
});
Clazz.overrideMethod (c$, "getElementIndex", 
function (a) {
return -1;
}, "~N");
Clazz.overrideMethod (c$, "getElement", 
function (a) {
return null;
}, "~N");
Clazz.overrideMethod (c$, "getElementCount", 
function () {
return 0;
});
Clazz.overrideMethod (c$, "isLeaf", 
function () {
return true;
});
Clazz.overrideMethod (c$, "getAllowsChildren", 
function () {
return false;
});
Clazz.overrideMethod (c$, "children", 
function () {
return null;
});
c$ = Clazz.p0p ();
};
c$.$AbstractDocument$DefaultDocumentEvent$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.offset = 0;
this.length = 0;
this.changeLookup = null;
this.type = null;
Clazz.instantialize (this, arguments);
}, javax.swing.text.AbstractDocument, "DefaultDocumentEvent", javax.swing.undo.CompoundEdit, javax.swing.event.DocumentEvent);
Clazz.makeConstructor (c$, 
function (a, b, c) {
Clazz.superConstructor (this, javax.swing.text.AbstractDocument.DefaultDocumentEvent);
this.offset = a;
this.length = b;
this.type = c;
}, "~N,~N,javax.swing.event.DocumentEvent.EventType");
Clazz.overrideMethod (c$, "toString", 
function () {
return this.edits.toString ();
});
Clazz.defineMethod (c$, "addEdit", 
function (a) {
if ((this.changeLookup == null) && (this.edits.size () > 10)) {
this.changeLookup =  new java.util.Hashtable ();
var b = this.edits.size ();
for (var c = 0; c < b; c++) {
var d = this.edits.elementAt (c);
if (Clazz.instanceOf (d, javax.swing.event.DocumentEvent.ElementChange)) {
var e = d;
this.changeLookup.put (e.getElement (), e);
}}
}if ((this.changeLookup != null) && (Clazz.instanceOf (a, javax.swing.event.DocumentEvent.ElementChange))) {
var b = a;
this.changeLookup.put (b.getElement (), b);
}return Clazz.superCall (this, javax.swing.text.AbstractDocument.DefaultDocumentEvent, "addEdit", [a]);
}, "javax.swing.undo.UndoableEdit");
Clazz.defineMethod (c$, "redo", 
function () {
this.b$["javax.swing.text.AbstractDocument"].writeLock ();
try {
Clazz.superCall (this, javax.swing.text.AbstractDocument.DefaultDocumentEvent, "redo", []);
var a = Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.UndoRedoDocumentEvent, this, null, this, false);
if (this.type === javax.swing.event.DocumentEvent.EventType.INSERT) {
this.b$["javax.swing.text.AbstractDocument"].fireInsertUpdate (a);
} else if (this.type === javax.swing.event.DocumentEvent.EventType.REMOVE) {
this.b$["javax.swing.text.AbstractDocument"].fireRemoveUpdate (a);
} else {
this.b$["javax.swing.text.AbstractDocument"].fireChangedUpdate (a);
}} finally {
this.b$["javax.swing.text.AbstractDocument"].writeUnlock ();
}
});
Clazz.defineMethod (c$, "undo", 
function () {
this.b$["javax.swing.text.AbstractDocument"].writeLock ();
try {
Clazz.superCall (this, javax.swing.text.AbstractDocument.DefaultDocumentEvent, "undo", []);
var a = Clazz.innerTypeInstance (javax.swing.text.AbstractDocument.UndoRedoDocumentEvent, this, null, this, true);
if (this.type === javax.swing.event.DocumentEvent.EventType.REMOVE) {
this.b$["javax.swing.text.AbstractDocument"].fireInsertUpdate (a);
} else if (this.type === javax.swing.event.DocumentEvent.EventType.INSERT) {
this.b$["javax.swing.text.AbstractDocument"].fireRemoveUpdate (a);
} else {
this.b$["javax.swing.text.AbstractDocument"].fireChangedUpdate (a);
}} finally {
this.b$["javax.swing.text.AbstractDocument"].writeUnlock ();
}
});
Clazz.overrideMethod (c$, "isSignificant", 
function () {
return true;
});
Clazz.overrideMethod (c$, "getPresentationName", 
function () {
var a = this.getType ();
if (a === javax.swing.event.DocumentEvent.EventType.INSERT) return javax.swing.UIManager.getString ("AbstractDocument.additionText");
if (a === javax.swing.event.DocumentEvent.EventType.REMOVE) return javax.swing.UIManager.getString ("AbstractDocument.deletionText");
return javax.swing.UIManager.getString ("AbstractDocument.styleChangeText");
});
Clazz.overrideMethod (c$, "getUndoPresentationName", 
function () {
return javax.swing.UIManager.getString ("AbstractDocument.undoText") + " " + this.getPresentationName ();
});
Clazz.overrideMethod (c$, "getRedoPresentationName", 
function () {
return javax.swing.UIManager.getString ("AbstractDocument.redoText") + " " + this.getPresentationName ();
});
Clazz.overrideMethod (c$, "getType", 
function () {
return this.type;
});
Clazz.overrideMethod (c$, "getOffset", 
function () {
return this.offset;
});
Clazz.overrideMethod (c$, "getLength", 
function () {
return this.length;
});
Clazz.overrideMethod (c$, "getDocument", 
function () {
return this.b$["javax.swing.text.AbstractDocument"];
});
Clazz.overrideMethod (c$, "getChange", 
function (a) {
if (this.changeLookup != null) {
return this.changeLookup.get (a);
}var b = this.edits.size ();
for (var c = 0; c < b; c++) {
var d = this.edits.elementAt (c);
if (Clazz.instanceOf (d, javax.swing.event.DocumentEvent.ElementChange)) {
var e = d;
if (a.equals (e.getElement ())) {
return e;
}}}
return null;
}, "javax.swing.text.Element");
c$ = Clazz.p0p ();
};
c$.$AbstractDocument$UndoRedoDocumentEvent$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.src = null;
this.type = null;
Clazz.instantialize (this, arguments);
}, javax.swing.text.AbstractDocument, "UndoRedoDocumentEvent", null, javax.swing.event.DocumentEvent);
Clazz.makeConstructor (c$, 
function (a, b) {
this.src = a;
if (b) {
if (a.getType ().equals (javax.swing.event.DocumentEvent.EventType.INSERT)) {
this.type = javax.swing.event.DocumentEvent.EventType.REMOVE;
} else if (a.getType ().equals (javax.swing.event.DocumentEvent.EventType.REMOVE)) {
this.type = javax.swing.event.DocumentEvent.EventType.INSERT;
} else {
this.type = a.getType ();
}} else {
this.type = a.getType ();
}}, "javax.swing.text.AbstractDocument.DefaultDocumentEvent,~B");
Clazz.defineMethod (c$, "getSource", 
function () {
return this.src;
});
Clazz.overrideMethod (c$, "getOffset", 
function () {
return this.src.getOffset ();
});
Clazz.overrideMethod (c$, "getLength", 
function () {
return this.src.getLength ();
});
Clazz.overrideMethod (c$, "getDocument", 
function () {
return this.src.getDocument ();
});
Clazz.overrideMethod (c$, "getType", 
function () {
return this.type;
});
Clazz.overrideMethod (c$, "getChange", 
function (a) {
return this.src.getChange (a);
}, "javax.swing.text.Element");
c$ = Clazz.p0p ();
};
c$.$AbstractDocument$DefaultFilterBypass$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, javax.swing.text.AbstractDocument, "DefaultFilterBypass", javax.swing.text.DocumentFilter.FilterBypass);
Clazz.overrideMethod (c$, "getDocument", 
function () {
return this.b$["javax.swing.text.AbstractDocument"];
});
Clazz.overrideMethod (c$, "remove", 
function (a, b) {
this.b$["javax.swing.text.AbstractDocument"].handleRemove (a, b);
}, "~N,~N");
Clazz.overrideMethod (c$, "insertString", 
function (a, b, c) {
this.b$["javax.swing.text.AbstractDocument"].handleInsertString (a, b, c);
}, "~N,~S,javax.swing.text.AttributeSet");
Clazz.overrideMethod (c$, "replace", 
function (a, b, c, d) {
this.b$["javax.swing.text.AbstractDocument"].handleRemove (a, b);
this.b$["javax.swing.text.AbstractDocument"].handleInsertString (a, c, d);
}, "~N,~N,~S,javax.swing.text.AttributeSet");
c$ = Clazz.p0p ();
};
Clazz.declareInterface (javax.swing.text.AbstractDocument, "Content");
Clazz.declareInterface (javax.swing.text.AbstractDocument, "AttributeContext");
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
this.e = null;
this.index = 0;
this.removed = null;
this.added = null;
Clazz.instantialize (this, arguments);
}, javax.swing.text.AbstractDocument, "ElementEdit", javax.swing.undo.AbstractUndoableEdit, javax.swing.event.DocumentEvent.ElementChange);
Clazz.makeConstructor (c$, 
function (a, b, c, d) {
Clazz.superConstructor (this, javax.swing.text.AbstractDocument.ElementEdit);
this.e = a;
this.index = b;
this.removed = c;
this.added = d;
}, "javax.swing.text.Element,~N,~A,~A");
Clazz.overrideMethod (c$, "getElement", 
function () {
return this.e;
});
Clazz.overrideMethod (c$, "getIndex", 
function () {
return this.index;
});
Clazz.overrideMethod (c$, "getChildrenRemoved", 
function () {
return this.removed;
});
Clazz.overrideMethod (c$, "getChildrenAdded", 
function () {
return this.added;
});
Clazz.defineMethod (c$, "redo", 
function () {
Clazz.superCall (this, javax.swing.text.AbstractDocument.ElementEdit, "redo", []);
var a = this.removed;
this.removed = this.added;
this.added = a;
(this.e).replace (this.index, this.removed.length, this.added);
});
Clazz.defineMethod (c$, "undo", 
function () {
Clazz.superCall (this, javax.swing.text.AbstractDocument.ElementEdit, "undo", []);
(this.e).replace (this.index, this.added.length, this.removed);
var a = this.removed;
this.removed = this.added;
this.added = a;
});
c$ = Clazz.p0p ();
Clazz.defineStatics (c$,
"BAD_LOCATION", "document location failure",
"ParagraphElementName", "paragraph",
"ContentElementName", "content",
"SectionElementName", "section",
"BidiElementName", "bidi level",
"ElementNameAttribute", "$ename",
"I18NProperty", "i18n",
"MultiByteProperty", "multiByte",
"AsyncLoadPriority", "load priority");
});
