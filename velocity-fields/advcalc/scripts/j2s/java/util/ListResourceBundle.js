Clazz.declarePackage ("java.util");
Clazz.load (["java.util.ResourceBundle"], "java.util.ListResourceBundle", ["java.lang.NullPointerException", "java.util.HashMap", "sun.util.ResourceBundleEnumeration"], function () {
c$ = Clazz.decorateAsClass (function () {
this.lookup = null;
Clazz.instantialize (this, arguments);
}, java.util, "ListResourceBundle", java.util.ResourceBundle);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, java.util.ListResourceBundle, []);
});
Clazz.overrideMethod (c$, "handleGetObject", 
function (key) {
if (this.lookup == null) {
this.loadLookup ();
}if (key == null) {
throw  new NullPointerException ();
}return this.lookup.get (key);
}, "~S");
Clazz.defineMethod (c$, "getKeys", 
function () {
if (this.lookup == null) {
this.loadLookup ();
}var parent = this.parent;
return  new sun.util.ResourceBundleEnumeration (this.lookup.keySet (), (parent != null) ? parent.getKeys () : null);
});
Clazz.overrideMethod (c$, "handleKeySet", 
function () {
if (this.lookup == null) {
this.loadLookup ();
}return this.lookup.keySet ();
});
Clazz.defineMethod (c$, "loadLookup", 
 function () {
if (this.lookup != null) return;
var contents = this.getContents ();
var temp =  new java.util.HashMap (contents.length);
for (var i = 0; i < contents.length; ++i) {
var key = contents[i][0];
var value = contents[i][1];
if (key == null || value == null) {
throw  new NullPointerException ();
}temp.put (key, value);
}
this.lookup = temp;
});
});
