Clazz.declarePackage ("com.falstad");
Clazz.load (["java.awt.event.AdjustmentListener", "swingjs.awt.Scrollbar"], "com.falstad.DecentScrollbar", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.value = 0;
this.lo = 0;
this.hi = 0;
this.listener = null;
Clazz.instantialize (this, arguments);
}, com.falstad, "DecentScrollbar", swingjs.awt.Scrollbar, java.awt.event.AdjustmentListener);
Clazz.makeConstructor (c$, 
function (parent, start, lo_, hi_) {
Clazz.superConstructor (this, com.falstad.DecentScrollbar, [0, start, 1, lo_, hi_]);
this.value = start;
this.lo = lo_;
this.hi = hi_;
this.listener = parent;
this.addAdjustmentListener (this);
}, "com.falstad.DecentScrollbarListener,~N,~N,~N");
Clazz.overrideMethod (c$, "adjustmentValueChanged", 
function (e) {
if (this.getValueIsAdjusting ()) this.listener.scrollbarValueChanged (this);
 else this.listener.scrollbarFinished (this);
}, "java.awt.event.AdjustmentEvent");
});
