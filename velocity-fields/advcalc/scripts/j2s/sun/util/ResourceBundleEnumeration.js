Clazz.declarePackage ("sun.util");
Clazz.load (["java.util.Enumeration"], "sun.util.ResourceBundleEnumeration", ["java.util.NoSuchElementException"], function () {
c$ = Clazz.decorateAsClass (function () {
this.set = null;
this.iterator = null;
this.enumeration = null;
this.next = null;
Clazz.instantialize (this, arguments);
}, sun.util, "ResourceBundleEnumeration", null, java.util.Enumeration);
Clazz.makeConstructor (c$, 
function (set, enumeration) {
this.set = set;
this.iterator = set.iterator ();
this.enumeration = enumeration;
}, "java.util.Set,java.util.Enumeration");
Clazz.defineMethod (c$, "hasMoreElements", 
function () {
if (this.next == null) {
if (this.iterator.hasNext ()) {
this.next = this.iterator.next ();
} else if (this.enumeration != null) {
while (this.next == null && this.enumeration.hasMoreElements ()) {
this.next = this.enumeration.nextElement ();
if (this.set.contains (this.next)) {
this.next = null;
}}
}}return this.next != null;
});
Clazz.defineMethod (c$, "nextElement", 
function () {
if (this.hasMoreElements ()) {
var result = this.next;
this.next = null;
return result;
} else {
throw  new java.util.NoSuchElementException ();
}});
});
