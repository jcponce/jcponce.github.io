Clazz.declarePackage ("com.falstad");
Clazz.load (["com.falstad.DecentScrollbarListener", "java.awt.LayoutManager", "java.awt.event.ActionListener", "$.ComponentListener", "$.ItemListener", "$.MouseListener", "$.MouseMotionListener", "swingjs.awt.Applet", "$.Canvas", "$.Frame", "java.awt.Color"], ["com.falstad.VecDemo", "$.VecDemoCanvas", "$.VecDemoFrame", "$.VecDemoLayout"], ["com.falstad.Complex", "$.DecentScrollbar", "java.awt.Dimension", "$.Rectangle", "java.awt.image.MemoryImageSource", "java.lang.Double", "java.net.URL", "java.text.NumberFormat", "java.util.Random", "$.Vector", "swingjs.awt.Button", "$.Checkbox", "$.Choice", "$.Label", "$.TextField"], function () {
c$ = Clazz.decorateAsClass (function () {
this.pg = null;
Clazz.instantialize (this, arguments);
}, com.falstad, "VecDemoCanvas", swingjs.awt.Canvas);
Clazz.makeConstructor (c$, 
function (p) {
Clazz.superConstructor (this, com.falstad.VecDemoCanvas, []);
this.pg = p;
}, "com.falstad.VecDemoFrame");
Clazz.overrideMethod (c$, "getPreferredSize", 
function () {
return  new java.awt.Dimension (300, 400);
});
Clazz.overrideMethod (c$, "update", 
function (g) {
this.pg.updateVecDemo (g);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "paintComponent", 
function (g) {
Clazz.superCall (this, com.falstad.VecDemoCanvas, "paintComponent", [g]);
this.pg.updateVecDemo (g);
}, "java.awt.Graphics");
c$ = Clazz.declareType (com.falstad, "VecDemoLayout", null, java.awt.LayoutManager);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "addLayoutComponent", 
function (name, c) {
}, "~S,java.awt.Component");
Clazz.overrideMethod (c$, "removeLayoutComponent", 
function (c) {
}, "java.awt.Component");
Clazz.overrideMethod (c$, "preferredLayoutSize", 
function (target) {
return  new java.awt.Dimension (500, 500);
}, "java.awt.Container");
Clazz.overrideMethod (c$, "minimumLayoutSize", 
function (target) {
return  new java.awt.Dimension (100, 100);
}, "java.awt.Container");
Clazz.overrideMethod (c$, "layoutContainer", 
function (target) {
var barwidth = 0;
var i;
for (i = 1; i < target.getComponentCount (); i++) {
var m = target.getComponent (i);
if (m.isVisible ()) {
var d = m.getPreferredSize ();
if (d.width > barwidth) barwidth = d.width;
}}
var insets = target.insets ();
var targetw = target.size ().width - insets.left - insets.right;
var cw = targetw - barwidth;
var targeth = target.size ().height - (insets.top + insets.bottom);
target.getComponent (0).move (insets.left, insets.top);
target.getComponent (0).resize (cw, targeth);
cw += insets.left;
var h = insets.top;
for (i = 1; i < target.getComponentCount (); i++) {
var m = target.getComponent (i);
if (m.isVisible ()) {
var d = m.getPreferredSize ();
if (Clazz.instanceOf (m, com.falstad.DecentScrollbar) || Clazz.instanceOf (m, swingjs.awt.TextField)) d.width = barwidth;
if (Clazz.instanceOf (m, swingjs.awt.Choice) && d.width > barwidth) d.width = barwidth;
if (Clazz.instanceOf (m, swingjs.awt.Label)) {
h += Clazz.doubleToInt (d.height / 5);
d.width = barwidth;
}System.out.println ("moved " + m.getClass ().getName () + " to " + cw + " " + h + " " + d.height);
m.move (cw, h);
m.resize (d.width, d.height);
h += d.height;
}}
}, "java.awt.Container");
c$ = Clazz.decorateAsClass (function () {
this.started = false;
Clazz.instantialize (this, arguments);
}, com.falstad, "VecDemo", swingjs.awt.Applet, java.awt.event.ComponentListener);
Clazz.defineMethod (c$, "destroyFrame", 
function () {
if (com.falstad.VecDemo.ogf != null) com.falstad.VecDemo.ogf.dispose ();
com.falstad.VecDemo.ogf = null;
this.repaint ();
});
Clazz.overrideMethod (c$, "init", 
function () {
this.addComponentListener (this);
});
c$.main = Clazz.defineMethod (c$, "main", 
function (args) {
var demo =  new com.falstad.VecDemo ();
demo.showFrame ();
}, "~A");
Clazz.defineMethod (c$, "showFrame", 
function () {
if (com.falstad.VecDemo.ogf == null) {
this.started = true;
com.falstad.VecDemo.ogf =  new com.falstad.VecDemoFrame (this);
com.falstad.VecDemo.ogf.initFrame ();
this.repaint ();
}});
Clazz.defineMethod (c$, "paint", 
function (g) {
Clazz.superCall (this, com.falstad.VecDemo, "paint", [g]);
var s = "Applet is open in a separate window.";
if (!this.started) s = "Applet is starting.";
 else if (com.falstad.VecDemo.ogf == null) s = "Applet is finished.";
 else if (com.falstad.VecDemo.ogf.useFrame) com.falstad.VecDemo.ogf.triggerShow ();
if (com.falstad.VecDemo.ogf == null || com.falstad.VecDemo.ogf.useFrame) g.drawString (s, 10, 30);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "componentHidden", 
function (e) {
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "componentMoved", 
function (e) {
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "componentShown", 
function (e) {
this.showFrame ();
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "componentResized", 
function (e) {
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "destroy", 
function () {
if (com.falstad.VecDemo.ogf != null) com.falstad.VecDemo.ogf.dispose ();
com.falstad.VecDemo.ogf = null;
this.repaint ();
});
Clazz.defineStatics (c$,
"ogf", null);
c$ = Clazz.decorateAsClass (function () {
this.engine = null;
this.winSize = null;
this.viewMain = null;
this.viewAxes = null;
this.dbimage = null;
this.backimage = null;
this.imageSource = null;
this.pixels = null;
this.applet = null;
this.random = null;
this.cv = null;
this.stoppedCheck = null;
this.resetButton = null;
this.kickButton = null;
this.reverseCheck = null;
this.infoButton = null;
this.functionChooser = null;
this.dispChooser = null;
this.partCountLabel = null;
this.textFieldLabel = null;
this.strengthLabel = null;
this.partCountBar = null;
this.strengthBar = null;
this.aux1Bar = null;
this.aux2Bar = null;
this.aux3Bar = null;
this.fieldStrength = 0;
this.barFieldStrength = 0;
this.darkYellow = null;
this.lineWidth = .001;
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.AuxBar")) {
com.falstad.VecDemoFrame.$VecDemoFrame$AuxBar$ ();
}
this.auxBars = null;
this.vecDensityLabel = null;
this.vecDensityBar = null;
this.potentialLabel = null;
this.potentialBar = null;
this.lineDensityLabel = null;
this.lineDensityBar = null;
this.modeChooser = null;
this.floorColorChooser = null;
this.floorLineChooser = null;
this.textFields = null;
this.reverse = 0;
this.xpoints = null;
this.ypoints = null;
this.grid = null;
this.particles = null;
this.vectors = null;
this.vecCount = 0;
this.density = null;
this.flatCheck = null;
this.isFlat = false;
this.viewAngle = 0;
this.viewAngleDragStart = 0;
this.viewZoom = 1.6;
this.viewZoomDragStart = 0;
this.viewAngleCos = 1;
this.viewAngleSin = 0;
this.viewHeight = 2;
this.viewHeightDragStart = 0;
this.viewDistance = 5;
this.integralX = -1;
this.integralY = 0;
this.vectorSpacing = 16;
this.currentStep = 0;
this.showA = false;
this.parseError = false;
this.fieldColors = null;
this.$functionChanged = false;
this.backgroundChanged = false;
this.dragging = false;
this.draggingView = false;
this.oldDragX = 0;
this.oldDragY = 0;
this.dragX = 0;
this.dragY = 0;
this.dragStartX = 0;
this.dragStartY = 0;
this.dragZoomStart = 0;
this.functionList = null;
this.curfunc = null;
this.pause = 20;
this.useFrame = false;
this.useBufferedImage = false;
this.shown = false;
this.divOffset = 0;
this.divRange = 0;
this.shadowBufferTop = null;
this.shadowBufferBottom = null;
this.shadowBufferTop2 = null;
this.shadowBufferBottom2 = null;
this.floorBrightMult = 2;
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.FloatPair")) {
com.falstad.VecDemoFrame.$VecDemoFrame$FloatPair$ ();
}
this.scalex = 0;
this.scaley = 0;
this.lastTime = 0;
this.timeStep = 0;
this.partMult = 0;
this.slowDragView = true;
this.wooft = 0;
this.rediscount = 0;
this.finished = false;
this.boundCheck = false;
this.oldY = null;
this.rk_k1 = null;
this.rk_k2 = null;
this.rk_k3 = null;
this.rk_k4 = null;
this.rk_yn = null;
this.rk_Y = null;
this.rk_Yhalf = null;
this.rk_oldY = null;
this.ls_fieldavg = null;
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.VecFunction")) {
com.falstad.VecDemoFrame.$VecDemoFrame$VecFunction$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRadial")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRadial$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRadialDouble")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRadialDouble$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRadialDipole")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRadialDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRadialQuad")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRadialQuad$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseSquaredRadial")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseSquaredRadial$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseSquaredRadialDouble")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseSquaredRadialDouble$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseSquaredRadialDipole")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseSquaredRadialDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseSquaredRadialQuad")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseSquaredRadialQuad$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.ConductingPlate")) {
com.falstad.VecDemoFrame.$VecDemoFrame$ConductingPlate$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.ChargedPlate")) {
com.falstad.VecDemoFrame.$VecDemoFrame$ChargedPlate$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.ChargedPlatePair")) {
com.falstad.VecDemoFrame.$VecDemoFrame$ChargedPlatePair$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.ChargedPlateDipole")) {
com.falstad.VecDemoFrame.$VecDemoFrame$ChargedPlateDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InfiniteChargedPlane")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InfiniteChargedPlane$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.Cylinder")) {
com.falstad.VecDemoFrame.$VecDemoFrame$Cylinder$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.CylinderAndLineCharge")) {
com.falstad.VecDemoFrame.$VecDemoFrame$CylinderAndLineCharge$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.CylinderInField")) {
com.falstad.VecDemoFrame.$VecDemoFrame$CylinderInField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.DielectricCylinderInFieldE")) {
com.falstad.VecDemoFrame.$VecDemoFrame$DielectricCylinderInFieldE$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.SlottedPlane")) {
com.falstad.VecDemoFrame.$VecDemoFrame$SlottedPlane$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.PlanePair")) {
com.falstad.VecDemoFrame.$VecDemoFrame$PlanePair$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRotational")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRotational$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRotationalPotential")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRotationalPotential$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRotationalDouble")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRotationalDouble$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRotationalDoubleExt")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRotationalDoubleExt$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRotationalDipole")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRotationalDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseRotationalDipoleExt")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseRotationalDipoleExt$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.OneDirectionFunction")) {
com.falstad.VecDemoFrame.$VecDemoFrame$OneDirectionFunction$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.MovingChargeField")) {
com.falstad.VecDemoFrame.$VecDemoFrame$MovingChargeField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseSquaredRadialSphere")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseSquaredRadialSphere$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.ConstRadial")) {
com.falstad.VecDemoFrame.$VecDemoFrame$ConstRadial$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.LinearRadial")) {
com.falstad.VecDemoFrame.$VecDemoFrame$LinearRadial$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseToYAxis")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseToYAxis$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.InverseSquareRotational")) {
com.falstad.VecDemoFrame.$VecDemoFrame$InverseSquareRotational$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.PendulumPotential")) {
com.falstad.VecDemoFrame.$VecDemoFrame$PendulumPotential$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.UserDefinedPotential")) {
com.falstad.VecDemoFrame.$VecDemoFrame$UserDefinedPotential$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.UserDefinedFunction")) {
com.falstad.VecDemoFrame.$VecDemoFrame$UserDefinedFunction$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.DrawData")) {
com.falstad.VecDemoFrame.$VecDemoFrame$DrawData$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.Particle")) {
com.falstad.VecDemoFrame.$VecDemoFrame$Particle$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.FieldVector")) {
com.falstad.VecDemoFrame.$VecDemoFrame$FieldVector$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.GridElement")) {
com.falstad.VecDemoFrame.$VecDemoFrame$GridElement$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.ExprState")) {
com.falstad.VecDemoFrame.$VecDemoFrame$ExprState$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.Expr")) {
com.falstad.VecDemoFrame.$VecDemoFrame$Expr$ ();
}
if (!Clazz.isClassDefined ("com.falstad.VecDemoFrame.ExprParser")) {
com.falstad.VecDemoFrame.$VecDemoFrame$ExprParser$ ();
}
Clazz.instantialize (this, arguments);
}, com.falstad, "VecDemoFrame", swingjs.awt.Frame, [java.awt.event.ComponentListener, java.awt.event.ActionListener, java.awt.event.MouseMotionListener, java.awt.event.MouseListener, java.awt.event.ItemListener, com.falstad.DecentScrollbarListener]);
Clazz.prepareFields (c$, function () {
this.darkYellow =  new java.awt.Color (144, 144, 0);
this.rk_k1 =  Clazz.newDoubleArray (6, 0);
this.rk_k2 =  Clazz.newDoubleArray (6, 0);
this.rk_k3 =  Clazz.newDoubleArray (6, 0);
this.rk_k4 =  Clazz.newDoubleArray (6, 0);
this.rk_yn =  Clazz.newDoubleArray (6, 0);
this.rk_Y =  Clazz.newDoubleArray (6, 0);
this.rk_Yhalf =  Clazz.newDoubleArray (6, 0);
this.rk_oldY =  Clazz.newDoubleArray (6, 0);
this.ls_fieldavg =  Clazz.newDoubleArray (3, 0);
});
Clazz.defineMethod (c$, "getAppletInfo", 
function () {
return "VecDemo by Paul Falstad";
});
Clazz.defineMethod (c$, "getrand", 
function (x) {
var q = this.random.nextInt ();
if (q < 0) q = -q;
return q % x;
}, "~N");
Clazz.makeConstructor (c$, 
function (a) {
Clazz.superConstructor (this, com.falstad.VecDemoFrame, [com.falstad.VecDemoFrame.BUILD_CASE_EMV ("2-D Electrostatic Fields Applet v1.4b", null, "2-D Vector Fields Applet v1.4b")]);
this.applet = a;
}, "com.falstad.VecDemo");
c$.BUILD_CASE_EMV = Clazz.defineMethod (c$, "BUILD_CASE_EMV", 
function (e, m, v) {
return com.falstad.VecDemoFrame.BUILD_V ? v : e;
}, "~S,~S,~S");
c$.BUILD_CASE_EMV = Clazz.defineMethod (c$, "BUILD_CASE_EMV", 
function (e, m, v) {
return com.falstad.VecDemoFrame.BUILD_V ? v : e;
}, "com.falstad.VecDemoFrame.VecFunction,com.falstad.VecDemoFrame.VecFunction,com.falstad.VecDemoFrame.VecFunction");
Clazz.defineMethod (c$, "initFrame", 
function () {
this.useFrame = false;
try {
var param = this.applet.getParameter ("useFrame");
if (param != null && param.equalsIgnoreCase ("true")) this.useFrame = true;
param = this.applet.getParameter ("PAUSE");
if (param != null) this.pause = Integer.parseInt (param);
param = this.applet.getParameter ("mode");
if (param != null && param.equalsIgnoreCase ("electric")) {
com.falstad.VecDemoFrame.BUILD_E = true;
com.falstad.VecDemoFrame.BUILD_V = false;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
var jv = System.getProperty ("java.class.version");
var jvf =  new Double (jv).doubleValue ();
if (jvf >= 48) this.useBufferedImage = true;
this.functionList =  new java.util.Vector ();
var vf = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadial, this, null);
var ct = 0;
while (vf != null) {
this.functionList.addElement (vf);
vf = vf.createNext ();
if (ct == 1000) {
System.out.print ("setup loop\n");
return;
}}
var particleColors =  new Array (27);
var i;
for (i = 0; i != 27; i++) particleColors[i] =  new java.awt.Color (((i % 3) + 1) * 85, ((Clazz.doubleToInt (i / 3)) % 3 + 1) * 85, ((Clazz.doubleToInt (i / 9)) % 3 + 1) * 85);

var main = (this.useFrame) ? this : this.applet;
this.random =  new java.util.Random ();
this.particles =  new Array (2500);
for (i = 0; i != 2500; i++) {
this.particles[i] = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Particle, this, null);
this.particles[i].color = particleColors[i % 27];
}
this.xpoints =  Clazz.newIntArray (4, 0);
this.ypoints =  Clazz.newIntArray (4, 0);
this.density =  Clazz.newIntArray (16, 16, 0);
main.setLayout ( new com.falstad.VecDemoLayout ());
this.cv =  new com.falstad.VecDemoCanvas (this);
this.cv.addComponentListener (this);
this.cv.addMouseMotionListener (this);
this.cv.addMouseListener (this);
main.add (this.cv);
this.functionChooser =  new swingjs.awt.Choice ();
for (i = 0; i != this.functionList.size (); i++) this.functionChooser.add ("Setup: " + (this.functionList.elementAt (i)).getName ());

main.add (this.functionChooser);
this.functionChooser.addItemListener (this);
this.floorColorChooser =  new swingjs.awt.Choice ();
this.floorColorChooser.add ("Color: field magnitude");
this.floorColorChooser.add ("Color: potential");
this.floorColorChooser.add ("Color: none");
if (com.falstad.VecDemoFrame.BUILD_E) this.floorColorChooser.add ("Color: charge");
 else {
this.floorColorChooser.add ("Color: divergence");
this.floorColorChooser.add ("Color: curl z");
}this.floorColorChooser.addItemListener (this);
main.add (this.floorColorChooser);
this.floorLineChooser =  new swingjs.awt.Choice ();
this.floorLineChooser.add ("Floor: no lines");
this.floorLineChooser.add ("Floor: grid");
this.floorLineChooser.add ("Floor: equipotentials");
if (com.falstad.VecDemoFrame.BUILD_V) this.floorLineChooser.add ("Floor: streamlines");
 else this.floorLineChooser.add ("Floor: field lines");
this.floorLineChooser.addItemListener (this);
main.add (this.floorLineChooser);
this.floorLineChooser.select (2);
this.flatCheck =  new swingjs.awt.Checkbox ("Flat View");
this.flatCheck.addItemListener (this);
main.add (this.flatCheck);
this.dispChooser =  new swingjs.awt.Choice ();
this.dispChooser.addItemListener (this);
this.setupDispChooser (true);
main.add (this.dispChooser);
this.modeChooser =  new swingjs.awt.Choice ();
this.modeChooser.add ("Mouse = Adjust Angle");
this.modeChooser.add ("Mouse = Adjust Zoom");
this.modeChooser.add ("Mouse = Line Integral");
this.modeChooser.add ("Mouse = Surface Integral");
this.modeChooser.addItemListener (this);
main.add (this.modeChooser);
this.stoppedCheck =  new swingjs.awt.Checkbox ("Stopped");
this.stoppedCheck.addItemListener (this);
main.add (this.stoppedCheck);
this.reverseCheck =  new swingjs.awt.Checkbox ("Reverse");
this.reverseCheck.addItemListener (this);
main.add (this.reverseCheck);
this.resetButton =  new swingjs.awt.Button ("Reset");
main.add (this.resetButton);
this.resetButton.addActionListener (this);
this.kickButton =  new swingjs.awt.Button ("Kick");
main.add (this.kickButton);
this.kickButton.addActionListener (this);
this.kickButton.disable ();
main.add (this.strengthLabel =  new swingjs.awt.Label ("Field Strength", 0));
main.add (this.strengthBar =  new com.falstad.DecentScrollbar (this, 80, 1, 120));
main.add (this.partCountLabel =  new swingjs.awt.Label ("Number of Particles", 0));
main.add (this.partCountBar =  new com.falstad.DecentScrollbar (this, 500, 1, 2500));
main.add (this.vecDensityLabel =  new swingjs.awt.Label ("Vector Density", 0));
main.add (this.vecDensityBar =  new com.falstad.DecentScrollbar (this, 32, 2, 64));
main.add (this.potentialLabel =  new swingjs.awt.Label ("Potential", 0));
main.add (this.potentialBar =  new com.falstad.DecentScrollbar (this, 250, 0, 1000));
var lb;
this.auxBars =  new Array (3);
main.add (lb =  new swingjs.awt.Label ("Aux 1", 0));
main.add (this.aux1Bar =  new com.falstad.DecentScrollbar (this, 0, 0, 100));
this.auxBars[0] = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.AuxBar, this, null, lb, this.aux1Bar);
main.add (lb =  new swingjs.awt.Label ("Aux 2", 0));
main.add (this.aux2Bar =  new com.falstad.DecentScrollbar (this, 0, 0, 100));
this.auxBars[1] = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.AuxBar, this, null, lb, this.aux2Bar);
main.add (lb =  new swingjs.awt.Label ("Aux 3", 0));
main.add (this.aux3Bar =  new com.falstad.DecentScrollbar (this, 0, 0, 100));
this.auxBars[2] = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.AuxBar, this, null, lb, this.aux3Bar);
if (com.falstad.VecDemoFrame.BUILD_V) main.add (this.textFieldLabel =  new swingjs.awt.Label ("", 0));
this.textFields =  new Array (2);
for (i = 0; i != 2; i++) {
main.add (this.textFields[i] =  new swingjs.awt.TextField ());
this.textFields[i].addActionListener (this);
}
this.fieldColors =  new Array (513);
var grayLevel = 76;
for (i = 0; i != 256; i++) {
var rb = grayLevel + Clazz.doubleToInt ((128 - grayLevel) * i / 255);
var g = grayLevel + Clazz.doubleToInt ((255 - grayLevel) * i / 255);
var col = (-16777216) | (g << 8) | (rb << 16) | (rb);
this.fieldColors[i] =  new java.awt.Color (col);
}
for (i = 0; i != 256; i++) {
var col = (-16777216) | (65280) | ((Clazz.doubleToInt (i / 2) + 128) * (0x10001));
this.fieldColors[i + 256] =  new java.awt.Color (col);
}
this.fieldColors[512] = this.fieldColors[511];
main.add ( new swingjs.awt.Label ("Change parameters", 0));
this.reinit ();
this.cv.setBackground (java.awt.Color.black);
this.cv.setForeground (java.awt.Color.lightGray);
this.functionChanged ();
this.dispChooserChanged ();
this.finished = true;
if (this.useFrame) {
this.setSize (800, 640);
this.handleResize ();
var x = this.getSize ();
var screen = this.getToolkit ().getScreenSize ();
this.setLocation (Clazz.doubleToInt ((screen.width - x.width) / 2), Clazz.doubleToInt ((screen.height - x.height) / 2));
this.setVisible (true);
} else {
this.setVisible (false);
this.handleResize ();
this.applet.validate ();
this.cv.repaint ();
}main.requestFocus ();
});
Clazz.defineMethod (c$, "triggerShow", 
function () {
if (!this.shown) this.setVisible (true);
this.shown = true;
});
Clazz.defineMethod (c$, "handleResize", 
function () {
var d = this.winSize = this.cv.getSize ();
if (this.winSize.width == 0) return;
this.dbimage = this.cv.createImage (d.width, d.height);
this.scaleworld ();
this.viewMain =  new java.awt.Rectangle (this.winSize);
this.viewAxes =  new java.awt.Rectangle (this.winSize.width - 100, 0, 100, 100);
this.backgroundChanged = true;
this.pixels = null;
if (this.useBufferedImage) {
try {
var biclass = Clazz._4Name ("java.awt.image.BufferedImage");
var dbiclass = Clazz._4Name ("java.awt.image.DataBufferInt");
var rasclass = Clazz._4Name ("java.awt.image.Raster");
var cstr = biclass.getConstructor ([Number, Number, Number]);
this.backimage = cstr.newInstance ([ new Integer (d.width),  new Integer (d.height),  new Integer (1)]);
var m = biclass.getMethod ("getRaster", null);
var ras = m.invoke (this.backimage, null);
var db = rasclass.getMethod ("getDataBuffer", null).invoke (ras, null);
this.pixels = dbiclass.getMethod ("getData", null).invoke (db, null);
} catch (ee) {
if (Clazz.exceptionOf (ee, Exception)) {
System.out.println ("BufferedImage failed");
} else {
throw ee;
}
}
}if (this.pixels == null) {
this.pixels =  Clazz.newIntArray (d.width * d.height, 0);
var i;
for (i = 0; i != d.width * d.height; i++) this.pixels[i] = 0xFF000000;

this.imageSource =  new java.awt.image.MemoryImageSource (d.width, d.height, this.pixels, 0, d.width);
this.imageSource.setAnimated (true);
this.imageSource.setFullBufferUpdates (true);
this.backimage = this.cv.createImage (this.imageSource);
}});
Clazz.defineMethod (c$, "resetDensityGroups", 
function () {
var i;
var j;
var k;
for (i = 0; i != 16; i++) for (j = 0; j != 16; j++) this.density[i][j] = 0;


var pcount = this.getParticleCount ();
for (i = 0; i != pcount; i++) {
var p = this.particles[i];
this.addToDensityGroup (p);
}
for (; i != 2500; i++) {
var p = this.particles[i];
p.lifetime = -100;
}
});
Clazz.defineMethod (c$, "addToDensityGroup", 
function (p) {
var a = Clazz.doubleToInt ((p.pos[0] + 1) * (8));
var b = Clazz.doubleToInt ((p.pos[1] + 1) * (8));
var n = 0;
try {
n = ++this.density[a][b];
if (n > 2500) System.out.print (a + " " + b + " " + this.density[a][b] + "\n");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.print (p.pos[0] + " " + p.pos[1] + "\n");
e.printStackTrace ();
} else {
throw e;
}
}
return n;
}, "com.falstad.VecDemoFrame.Particle");
Clazz.defineMethod (c$, "removeFromDensityGroup", 
function (p) {
var a = Clazz.doubleToInt ((p.pos[0] + 1) * (8));
var b = Clazz.doubleToInt ((p.pos[1] + 1) * (8));
try {
if (--this.density[a][b] < 0) System.out.print (a + " " + b + " " + this.density[a][b] + "\n");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.print (p.pos[0] + " " + p.pos[1] + "\n");
e.printStackTrace ();
} else {
throw e;
}
}
}, "com.falstad.VecDemoFrame.Particle");
Clazz.defineMethod (c$, "positionParticle", 
function (p) {
var x;
var y;
var bestx = 0;
var besty = 0;
var best = 10000;
var randaddx = this.getrand (16);
var randaddy = this.getrand (16);
for (x = 0; x != 16; x++) for (y = 0; y != 16; y++) {
var ix = (randaddx + x) % 16;
var iy = (randaddy + y) % 16;
if (this.density[ix][iy] <= best) {
bestx = ix;
besty = iy;
best = this.density[ix][iy];
}}

p.pos[0] = bestx * 0.125 + this.getrand (100) * 0.125 / 100.0 - 1;
p.pos[1] = besty * 0.125 + this.getrand (100) * 0.125 / 100.0 - 1;
p.lifetime = this.curfunc.redistribute () ? 500 : 5000;
p.stepsize = 1;
p.theta = (this.getrand (101) - 50) * 3.141592653589793 / 50.;
p.phi = (this.getrand (101) - 50) * 3.141592653589793 / 50.;
var j;
for (j = 0; j != 3; j++) p.vel[j] = 0;

}, "com.falstad.VecDemoFrame.Particle");
Clazz.defineMethod (c$, "getParticleCount", 
function () {
return this.partCountBar.getValue ();
});
Clazz.defineMethod (c$, "resetParticles", 
function () {
var pcount = this.getParticleCount ();
var i;
var j;
for (i = 0; i != pcount; i++) {
var p = this.particles[i];
for (j = 0; j != 2; j++) {
p.pos[j] = this.getrand (200) / 100.0 - 1;
p.vel[j] = 0;
}
p.pos[2] = 0;
p.lifetime = i * 2;
p.stepsize = 1;
}
this.integralX = -1;
this.resetDensityGroups ();
});
Clazz.defineMethod (c$, "kickParticles", 
function () {
var i;
var j;
for (i = 0; i != this.getParticleCount (); i++) {
var p = this.particles[i];
for (j = 0; j != 2; j++) p.vel[j] += (this.getrand (100) / 99.0 - .5) * .04;

}
});
Clazz.defineMethod (c$, "generateFunction", 
function () {
var x;
var y;
if (this.grid == null) this.grid =  Clazz.newArray (81, 81, null);
this.curfunc.setupFrame ();
this.divOffset = this.curfunc.getDivOffset ();
this.divRange = this.curfunc.getDivRange ();
var mu;
var xx;
var xx2;
var yy;
var yy2;
var r;
var r1;
var r2;
var r3;
var r4;
var levelheight = this.curfunc.getLevelHeight ();
for (x = 0; x != 81; x++) for (y = 0; y != 81; y++) {
var ge = this.grid[x][y] = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.GridElement, this, null);
ge.curl = ge.div = ge.height = 0;
this.curfunc.setGrid (ge, x, y);
}

this.curfunc.calcDivergence ();
var zval = 0.025;
for (y = 0; y != 80; y++) for (x = 0; x != 80; x++) {
var ge = this.grid[x][y];
var vecx = this.grid[x + 1][y].height - ge.height;
var vecy = this.grid[x][y + 1].height - ge.height;
ge.normdot = (vecx + vecy + zval) * (0.5780346820809249) / java.lang.Math.sqrt (vecx * vecx + vecy * vecy + zval * zval);
}

for (x = 0; x != 81; x++) {
this.grid[80][x] = this.grid[79][x];
this.grid[x][80] = this.grid[x][79];
}
this.$functionChanged = false;
this.backgroundChanged = true;
});
Clazz.defineMethod (c$, "computeColor", 
function (ge, c) {
if (c < 0) c = 0;
if (c > 1) c = 1;
c = .5 + c * .5;
var value = 0;
var range = 10;
var offset = 4;
switch (this.floorColorChooser.getSelectedIndex ()) {
case 0:
value = ge.vecX * ge.vecX + ge.vecY * ge.vecY;
offset = 10;
range = 16;
if (!ge.valid) return 0xFF000080;
break;
case 1:
value = ge.height - this.curfunc.getLevelHeight ();
offset = 1;
range = 2;
break;
case 4:
value = ge.curl;
offset = 4;
range = 10;
break;
case 3:
value = ge.div;
offset = this.divOffset;
range = this.divRange;
break;
case 2:
if (!ge.valid) return 0xFF000080;
break;
}
value *= 2.0;
var redness = (value < 0) ? (java.lang.Math.log (-value) + offset) / range : 0;
var grnness = (value > 0) ? (java.lang.Math.log (value) + offset) / range : 0;
if (redness > 1) redness = 1;
if (grnness > 1) grnness = 1;
if (grnness < 0) grnness = 0;
if (redness < 0) redness = 0;
var grayness = (1 - (redness + grnness)) * c;
var gray = .6;
var r = Clazz.doubleToInt ((c * redness + gray * grayness) * 255);
var g = Clazz.doubleToInt ((c * grnness + gray * grayness) * 255);
var b = Clazz.doubleToInt ((gray * grayness) * 255);
return (-16777216) | (r << 16) | (g << 8) | b;
}, "com.falstad.VecDemoFrame.GridElement,~N");
Clazz.defineMethod (c$, "reinit", 
function () {
this.handleResize ();
this.resetParticles ();
this.$functionChanged = this.backgroundChanged = true;
});
Clazz.defineMethod (c$, "centerString", 
function (g, s, y) {
var fm = g.getFontMetrics ();
g.drawString (s, Clazz.doubleToInt ((this.winSize.width - fm.stringWidth (s)) / 2), y);
}, "java.awt.Graphics,~S,~N");
Clazz.defineMethod (c$, "drawBackground", 
function () {
if (this.isFlat) {
var x;
var y;
for (y = 0; y < 80; y++) for (x = 0; x < 80; x++) {
var ge = this.grid[x][y];
var nx = Clazz.doubleToInt (x * this.winSize.width / 80);
var ny = this.winSize.height - Clazz.doubleToInt ((y + 1) * this.winSize.height / 80);
var nx1 = Clazz.doubleToInt ((x + 1) * this.winSize.width / 80);
var ny1 = this.winSize.height - Clazz.doubleToInt (y * this.winSize.height / 80);
var col = this.computeColor (ge, 0);
this.fillRectangle (nx, ny, nx1, ny1, col);
ge.visible = true;
}

this.drawFloor ();
this.$functionChanged = this.backgroundChanged = false;
if (this.imageSource != null) this.imageSource.newPixels ();
return;
}this.scaleworld ();
var x;
var y;
var xdir;
var xstart;
var xend;
var ydir;
var ystart;
var yend;
var sc = 80;
if (this.viewAngleCos < 0) {
ystart = sc;
yend = 0;
ydir = -1;
} else {
ystart = 0;
yend = sc;
ydir = 1;
}if (this.viewAngleSin < 0) {
xstart = 0;
xend = sc;
xdir = 1;
} else {
xstart = sc;
xend = 0;
xdir = -1;
}var xFirst = (-this.viewAngleSin * xdir > this.viewAngleCos * ydir);
this.shadowBufferBottom =  Clazz.newIntArray (this.winSize.width, 0);
this.shadowBufferTop =  Clazz.newIntArray (this.winSize.width, 0);
this.shadowBufferBottom2 =  Clazz.newIntArray (this.winSize.width, 0);
this.shadowBufferTop2 =  Clazz.newIntArray (this.winSize.width, 0);
for (x = 0; x != this.winSize.width; x++) {
this.shadowBufferBottom[x] = this.shadowBufferBottom2[x] = 0;
this.shadowBufferTop[x] = this.shadowBufferTop2[x] = this.winSize.height - 1;
}
for (x = 0; x != this.winSize.width * this.winSize.height; x++) this.pixels[x] = 0xFF000000;

var goffx = (xdir == 1) ? 0 : -1;
var goffy = (ydir == 1) ? 0 : -1;
for (x = xstart; x != xend; x += xdir) {
for (y = ystart; y != yend; y += ydir) {
if (!xFirst) x = xstart;
for (; x != xend; x += xdir) {
var nx = x * (0.025) - 1;
var ny = y * (0.025) - 1;
var nx1 = (x + xdir) * (0.025) - 1;
var ny1 = (y + ydir) * (0.025) - 1;
this.map3d (nx, ny, this.grid[x][y].height, this.xpoints, this.ypoints, 0);
this.map3d (nx1, ny, this.grid[x + xdir][y].height, this.xpoints, this.ypoints, 1);
this.map3d (nx, ny1, this.grid[x][y + ydir].height, this.xpoints, this.ypoints, 2);
this.map3d (nx1, ny1, this.grid[x + xdir][y + ydir].height, this.xpoints, this.ypoints, 3);
var ge = this.grid[x + goffx][y + goffy];
var col = this.computeColor (ge, ge.normdot);
this.fillTriangle (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1], this.xpoints[3], this.ypoints[3], col);
this.fillTriangle (this.xpoints[0], this.ypoints[0], this.xpoints[2], this.ypoints[2], this.xpoints[3], this.ypoints[3], col);
var cx = Clazz.doubleToInt ((this.xpoints[0] + this.xpoints[3]) / 2);
var cy = Clazz.doubleToInt ((this.ypoints[0] + this.ypoints[3]) / 2);
var vis = false;
if (cx >= 0 && cx < this.winSize.width && cy <= this.shadowBufferTop[cx] && cy >= 0) vis = true;
ge.visible = vis;
if (xFirst) break;
}
if (!xFirst) {
var i;
for (i = 0; i != this.winSize.width; i++) {
this.shadowBufferTop[i] = this.shadowBufferTop2[i];
this.shadowBufferBottom[i] = this.shadowBufferBottom2[i];
}
}}
if (!xFirst) break;
var i;
for (i = 0; i != this.winSize.width; i++) {
this.shadowBufferTop[i] = this.shadowBufferTop2[i];
this.shadowBufferBottom[i] = this.shadowBufferBottom2[i];
}
}
this.drawFloor ();
this.$functionChanged = this.backgroundChanged = false;
if (this.imageSource != null) this.imageSource.newPixels ();
});
Clazz.defineMethod (c$, "drawFloor", 
function () {
var x;
var y;
switch (this.floorLineChooser.getSelectedIndex ()) {
case 0:
break;
case 1:
for (x = 0; x != 80; x++) for (y = 0; y != 80; y += 10) {
var nx = x * (0.025) - 1;
var nx1 = (x + 1) * (0.025) - 1;
var ny = y * (0.025) - 1;
if (this.grid[x][y].visible) {
this.map3d (nx, ny, this.grid[x][y].height, this.xpoints, this.ypoints, 0);
this.map3d (nx1, ny, this.grid[x + 1][y].height, this.xpoints, this.ypoints, 1);
this.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
}if (this.grid[y][x].visible) {
this.map3d (ny, nx, this.grid[y][x].height, this.xpoints, this.ypoints, 0);
this.map3d (ny, nx1, this.grid[y][x + 1].height, this.xpoints, this.ypoints, 1);
this.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
}}

break;
case 2:
if (!this.curfunc.nonGradient ()) this.renderEquips ();
break;
case 3:
this.genLines ();
break;
}
});
Clazz.defineMethod (c$, "fillTriangle", 
function (x1, y1, x2, y2, x3, y3, col) {
if (x1 > x2) {
if (x2 > x3) {
var ay = this.interp (x1, y1, x3, y3, x2);
this.fillTriangle1 (x3, y3, x2, y2, ay, col);
this.fillTriangle1 (x1, y1, x2, y2, ay, col);
} else if (x1 > x3) {
var ay = this.interp (x1, y1, x2, y2, x3);
this.fillTriangle1 (x2, y2, x3, y3, ay, col);
this.fillTriangle1 (x1, y1, x3, y3, ay, col);
} else {
var ay = this.interp (x3, y3, x2, y2, x1);
this.fillTriangle1 (x2, y2, x1, y1, ay, col);
this.fillTriangle1 (x3, y3, x1, y1, ay, col);
}} else {
if (x1 > x3) {
var ay = this.interp (x2, y2, x3, y3, x1);
this.fillTriangle1 (x3, y3, x1, y1, ay, col);
this.fillTriangle1 (x2, y2, x1, y1, ay, col);
} else if (x2 > x3) {
var ay = this.interp (x2, y2, x1, y1, x3);
this.fillTriangle1 (x1, y1, x3, y3, ay, col);
this.fillTriangle1 (x2, y2, x3, y3, ay, col);
} else {
var ay = this.interp (x3, y3, x1, y1, x2);
this.fillTriangle1 (x1, y1, x2, y2, ay, col);
this.fillTriangle1 (x3, y3, x2, y2, ay, col);
}}}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "interp", 
function (x1, y1, x2, y2, x) {
if (x1 == x2) return y1;
if (x < x1 && x < x2 || x > x1 && x > x2) System.out.print ("interp out of bounds\n");
return Clazz.doubleToInt (y1 + (x - x1) * (y2 - y1) / (x2 - x1));
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "fillTriangle1", 
function (x1, y1, x2, y2, y3, col) {
var dir = (x1 > x2) ? -1 : 1;
var x = x1;
if (x < 0) {
x = 0;
if (x2 < 0) return;
}if (x >= this.winSize.width) {
x = this.winSize.width - 1;
if (x2 >= this.winSize.width) return;
}if (y2 > y3) {
var q = y2;
y2 = y3;
y3 = q;
}while (x != x2 + dir) {
var ya = this.interp (x1, y1, x2, y2, x);
var yb = this.interp (x1, y1, x2, y3, x);
if (ya < 0) ya = 0;
if (yb >= this.winSize.height) yb = this.winSize.height - 1;
if (this.shadowBufferTop2[x] > ya) this.shadowBufferTop2[x] = ya;
if (this.shadowBufferBottom2[x] < yb) this.shadowBufferBottom2[x] = yb;
var sb1 = this.shadowBufferTop[x];
var sb2 = this.shadowBufferBottom[x];
if (!(ya >= sb1 && yb <= sb2)) {
for (; ya <= yb; ya++) {
if (ya < sb1 || ya > sb2) this.pixels[x + ya * this.winSize.width] = col;
}
}x += dir;
if (x < 0 || x >= this.winSize.width) return;
}
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "fillRectangle", 
function (x1, y1, x2, y2, col) {
var x;
var y;
for (y = y1; y < y2; y++) for (x = x1; x < x2; x++) this.pixels[x + y * this.winSize.width] = col;


}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawLine", 
function (x1, y1, x2, y2) {
if (x1 == x2 && y1 == y2) return;
if (this.abs (y2 - y1) > this.abs (x2 - x1)) {
var sgn = this.sign (y2 - y1);
var x;
var y;
for (y = y1; y != y2 + sgn; y += sgn) {
x = x1 + Clazz.doubleToInt ((x2 - x1) * (y - y1) / (y2 - y1));
if (x >= 0 && y >= 0 && x < this.winSize.width && y < this.winSize.height) this.pixels[x + y * this.winSize.width] = 0xFFC0C0C0;
}
} else {
var sgn = this.sign (x2 - x1);
var x;
var y;
for (x = x1; x != x2 + sgn; x += sgn) {
y = y1 + Clazz.doubleToInt ((y2 - y1) * (x - x1) / (x2 - x1));
if (x >= 0 && y >= 0 && x < this.winSize.width && y < this.winSize.height) this.pixels[x + y * this.winSize.width] = 0xFFC0C0C0;
}
}}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "abs", 
function (x) {
return x < 0 ? -x : x;
}, "~N");
Clazz.defineMethod (c$, "sign", 
function (x) {
return (x < 0) ? -1 : (x == 0) ? 0 : 1;
}, "~N");
Clazz.defineMethod (c$, "min", 
function (a, b) {
return (a < b) ? a : b;
}, "~N,~N");
Clazz.defineMethod (c$, "max", 
function (a, b) {
return (a > b) ? a : b;
}, "~N,~N");
Clazz.defineMethod (c$, "min", 
function (a, b) {
return (a < b) ? a : b;
}, "~N,~N");
Clazz.defineMethod (c$, "max", 
function (a, b) {
return (a > b) ? a : b;
}, "~N,~N");
Clazz.defineMethod (c$, "renderEquips", 
function () {
var x;
var y;
for (x = 0; x != 80; x++) for (y = 0; y != 80; y++) {
if (!this.grid[x][y].visible) continue;
this.tryEdge (x, y, x + 1, y, x, y + 1, x + 1, y + 1);
this.tryEdge (x, y, x + 1, y, x, y, x, y + 1);
this.tryEdge (x, y, x + 1, y, x + 1, y, x + 1, y + 1);
this.tryEdge (x, y, x, y + 1, x + 1, y, x + 1, y + 1);
this.tryEdge (x, y, x, y + 1, x, y + 1, x + 1, y + 1);
this.tryEdge (x + 1, y, x + 1, y + 1, x, y + 1, x + 1, y + 1);
}

});
Clazz.defineMethod (c$, "interpPoint", 
function (ep1, ep2, x1, y1, x2, y2, pval, pos) {
var interp2 = (pval - ep1.height) / (ep2.height - ep1.height);
var interp1 = 1 - interp2;
pos.x = (x1 * interp1 + x2 * interp2) * 2. / 80 - 1;
pos.y = (y1 * interp1 + y2 * interp2) * 2. / 80 - 1;
}, "com.falstad.VecDemoFrame.GridElement,com.falstad.VecDemoFrame.GridElement,~N,~N,~N,~N,~N,com.falstad.VecDemoFrame.FloatPair");
Clazz.defineMethod (c$, "spanning", 
function (ep1, ep2, pval) {
if (ep1.height == ep2.height) return false;
return !((ep1.height < pval && ep2.height < pval) || (ep1.height > pval && ep2.height > pval));
}, "com.falstad.VecDemoFrame.GridElement,com.falstad.VecDemoFrame.GridElement,~N");
Clazz.defineMethod (c$, "tryEdge", 
function (x1, y1, x2, y2, x3, y3, x4, y4) {
var i;
var emult = 5;
var mult = 1 / (40 * emult * .1);
var ep1 = this.grid[x1][y1];
var ep2 = this.grid[x2][y2];
var ep3 = this.grid[x3][y3];
var ep4 = this.grid[x4][y4];
var pmin = this.min (this.min (ep1.height, ep2.height), this.min (ep3.height, ep4.height));
var pmax = this.max (this.max (ep1.height, ep2.height), this.max (ep3.height, ep4.height));
if (pmin < -5) pmin = -5;
if (pmax > 5) pmax = 5;
var imin = Clazz.doubleToInt (pmin / mult);
var imax = Clazz.doubleToInt (pmax / mult);
for (i = imin; i <= imax; i++) {
var pval = i * mult;
if (!(this.spanning (ep1, ep2, pval) && this.spanning (ep3, ep4, pval))) continue;
var pa = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.FloatPair, this, null);
var pb = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.FloatPair, this, null);
this.interpPoint (ep1, ep2, x1, y1, x2, y2, pval, pa);
this.interpPoint (ep3, ep4, x3, y3, x4, y4, pval, pb);
this.map3d (pa.x, pa.y, pval, this.xpoints, this.ypoints, 0);
this.map3d (pb.x, pb.y, pval, this.xpoints, this.ypoints, 1);
this.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
}
}, "~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawLineBackground", 
function (g) {
var x;
var y;
for (x = 0; x != 80; x++) for (y = 0; y != 80; y++) this.grid[x][y].visible = true;


if (this.isFlat) return;
for (y = 79; y >= 0; y--) {
for (x = 0; x < 80; x += 5) {
var ny = y * (0.025) - 1;
var nx1 = (x + 1) * (0.025) - 1;
var ny1 = (y + 1) * (0.025) - 1;
this.map3d (nx1, ny, this.grid[x][y].height, this.xpoints, this.ypoints, 1);
this.map3d (nx1, ny1, this.grid[x][y + 1].height, this.xpoints, this.ypoints, 2);
this.ypoints[1] = this.bound_y (this.ypoints[1]);
this.ypoints[2] = this.bound_y (this.ypoints[2]);
g.drawLine (this.xpoints[1], this.ypoints[1], this.xpoints[2], this.ypoints[2]);
}
}
for (y = 0; y < 80; y += 5) {
for (x = 79; x >= 0; x--) {
var nx = x * (0.025) - 1;
var nx1 = (x + 1) * (0.025) - 1;
var ny1 = (y + 1) * (0.025) - 1;
this.map3d (nx, ny1, this.grid[x][y].height, this.xpoints, this.ypoints, 3);
this.map3d (nx1, ny1, this.grid[x + 1][y].height, this.xpoints, this.ypoints, 2);
this.ypoints[3] = this.bound_y (this.ypoints[3]);
this.ypoints[2] = this.bound_y (this.ypoints[2]);
g.drawLine (this.xpoints[3], this.ypoints[3], this.xpoints[2], this.ypoints[2]);
}
}
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "bound_y", 
function (y) {
if (y < -100) y = -100;
if (y > this.winSize.height + 100) y = this.winSize.height + 100;
return y;
}, "~N");
Clazz.defineMethod (c$, "map3d", 
function (x, y, z, xpoints, ypoints, pt) {
this.map3dView (x, y, z, xpoints, ypoints, pt, this.viewMain);
}, "~N,~N,~N,~A,~A,~N");
Clazz.defineMethod (c$, "map3dView", 
function (x, y, z, xpoints, ypoints, pt, view) {
if (this.isFlat) {
xpoints[pt] = view.x + Clazz.doubleToInt ((x + 1) * view.width / 2);
ypoints[pt] = view.y + Clazz.doubleToInt ((1 - y) * view.height / 2);
return;
}if (z < -1000) z = -1000;
if (z > 1000) z = 1000;
var realx = x * this.viewAngleCos + y * this.viewAngleSin;
var realy = z - this.viewHeight;
var realz = y * this.viewAngleCos - x * this.viewAngleSin + this.viewDistance;
this.scalex = this.viewZoom * (Clazz.doubleToInt (view.width / 4)) * this.viewDistance;
this.scaley = this.scalex;
var yoff = Clazz.doubleToInt (this.scaley * (this.viewHeight - this.curfunc.getLevelHeight ()) / this.viewDistance);
xpoints[pt] = view.x + Clazz.doubleToInt (view.width / 2) + Clazz.doubleToInt (this.scalex * realx / realz);
ypoints[pt] = view.y + Clazz.doubleToInt (view.height / 2) - yoff - Clazz.doubleToInt (this.scaley * realy / realz);
}, "~N,~N,~N,~A,~A,~N,java.awt.Rectangle");
Clazz.defineMethod (c$, "scaleworld", 
function () {
});
Clazz.defineMethod (c$, "getHeight", 
function (x, y) {
x = (x + 1) * (40);
y = (y + 1) * (40);
var ix = Clazz.doubleToInt (x);
var iy = Clazz.doubleToInt (y);
if (ix >= 80 || iy >= 80) return this.grid[ix][iy].height;
var fracx = x - ix;
var fracy = y - iy;
return this.grid[ix][iy].height * (1 - fracx) * (1 - fracy) + this.grid[ix + 1][iy].height * fracx * (1 - fracy) + this.grid[ix][iy + 1].height * (1 - fracx) * fracy + this.grid[ix + 1][iy + 1].height * fracx * fracy;
}, "~N,~N");
Clazz.defineMethod (c$, "sayCalculating", 
function (realg) {
realg.setColor (this.cv.getBackground ());
var fm = realg.getFontMetrics ();
var s = "Calculating...";
realg.fillRect (0, this.winSize.height - 30, 20 + fm.stringWidth (s), 30);
realg.setColor (java.awt.Color.white);
realg.drawString (s, 10, this.winSize.height - 10);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "updateVecDemo", 
function (realg) {
if (this.winSize == null || this.winSize.width == 0) return;
var g = this.dbimage.getGraphics ();
if (this.xpoints == null) return;
this.checkFlatState ();
this.barFieldStrength = this.fieldStrength = java.lang.Math.exp ((this.strengthBar.getValue () - 50) / 10.);
if (this.$functionChanged || this.backgroundChanged) {
if (this.$functionChanged) {
this.sayCalculating (realg);
this.generateFunction ();
}if (!this.slowDragView || !this.draggingView) {
var tm1 = System.currentTimeMillis ();
this.sayCalculating (realg);
this.drawBackground ();
var tm2 = System.currentTimeMillis ();
this.slowDragView = (tm2 - tm1 > 100);
}}this.scaleworld ();
if ((this.draggingView && this.slowDragView) || this.$functionChanged) {
g.setColor (this.isFlat ? this.fieldColors[0] : this.cv.getBackground ());
g.fillRect (0, 0, this.winSize.width, this.winSize.height);
g.setColor (this.cv.getForeground ());
this.drawLineBackground (g);
} else g.drawImage (this.backimage, 0, 0, this);
var allquiet = true;
this.curfunc.setupFrame ();
this.fieldStrength = this.barFieldStrength;
this.partMult = this.fieldStrength * this.reverse * this.timeStep;
var disp = this.dispChooser.getSelectedIndex ();
this.timeStep = 1;
if (!this.stoppedCheck.getState ()) {
if (this.lastTime > 0) this.timeStep = (System.currentTimeMillis () - this.lastTime) * .03;
if (this.timeStep > 3) this.timeStep = 3;
this.lastTime = System.currentTimeMillis ();
if (disp != 2 && disp != 3) {
this.moveParticles ();
allquiet = false;
}this.currentStep += this.reverse;
if (this.currentStep < 0) this.currentStep += 800;
} else this.lastTime = 0;
if (disp == 2) this.drawVectors (g);
 else if (disp != 3) this.drawParticles (g);
g.setColor (java.awt.Color.gray);
if (!this.isFlat) this.drawAxes (g);
this.curfunc.finishFrame ();
var mode = this.modeChooser.getSelectedIndex ();
if (mode == 2) this.lineIntegral (g, true);
 else if (mode == 3) this.lineIntegral (g, false);
if (this.parseError) this.centerString (g, "Can't parse expression", this.winSize.height - 20);
realg.drawImage (this.dbimage, 0, 0, this);
var t = System.currentTimeMillis ();
com.falstad.VecDemoFrame.frames++;
if (com.falstad.VecDemoFrame.firsttime == 0) com.falstad.VecDemoFrame.firsttime = t;
 else if (t - com.falstad.VecDemoFrame.firsttime > 1000) {
com.falstad.VecDemoFrame.framerate = com.falstad.VecDemoFrame.frames;
com.falstad.VecDemoFrame.firsttime = t;
com.falstad.VecDemoFrame.frames = 0;
}if (!this.stoppedCheck.getState () && !allquiet) this.cv.repaint (this.pause);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "drawAxes", 
function (g) {
g.setColor (java.awt.Color.white);
this.map3dView (0, 0, 0, this.xpoints, this.ypoints, 0, this.viewAxes);
this.map3dView (1, 0, 0, this.xpoints, this.ypoints, 1, this.viewAxes);
this.drawArrow (g, "x", this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
this.map3dView (0, 1, 0, this.xpoints, this.ypoints, 1, this.viewAxes);
this.drawArrow (g, "y", this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
this.map3dView (0, 0, 1, this.xpoints, this.ypoints, 1, this.viewAxes);
this.drawArrow (g, "z", this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "drawVectors", 
function (g) {
var x;
var y;
var z;
var dd = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.DrawData, this, null);
dd.mult = this.barFieldStrength * 40;
dd.g = g;
dd.field =  Clazz.newDoubleArray (3, 0);
dd.vv =  Clazz.newDoubleArray (3, 0);
this.vectorSpacing = this.vecDensityBar.getValue ();
var vec =  Clazz.newDoubleArray (3, 0);
this.vecCount = 0;
for (x = 0; x != this.vectorSpacing; x++) {
vec[0] = x * (2.0 / (this.vectorSpacing - 1)) - 1;
for (y = 0; y != this.vectorSpacing; y++) {
vec[1] = y * (2.0 / (this.vectorSpacing - 1)) - 1;
this.drawVector (dd, vec);
}
}
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "lineIntegral", 
function (g, line) {
if (this.integralX == -1) return;
if (this.dragStartX == this.integralX || this.dragStartY == this.integralY) return;
var x1 = this.min (this.dragStartX, this.integralX);
var y1 = this.min (this.dragStartY, this.integralY);
var x2 = this.max (this.dragStartX, this.integralX);
var y2 = this.max (this.dragStartY, this.integralY);
var step = 15;
var x;
var pos = this.rk_k2;
if (!line) {
g.setColor (java.awt.Color.white);
g.drawRect (x1, y1, x2 - x1 + 1, y2 - y1 + 1);
}var y1p = 1 - 2. * y1 / this.winSize.height;
var y2p = 1 - 2. * y2 / this.winSize.height;
for (x = x1; x <= x2; x += step) {
var step1 = x2 - x;
if (step1 > step) step1 = step;
pos[0] = 2. * x / this.winSize.width - 1;
pos[1] = y1p;
this.lineIntegralStep (g, x, y1, pos, step1, 0, line);
pos[1] = y2p;
this.lineIntegralStep (g, x + step1, y2, pos, -step1, 0, line);
}
var y;
var x1p = 2. * x1 / this.winSize.width - 1;
var x2p = 2. * x2 / this.winSize.width - 1;
for (y = y2; y >= y1; y -= step) {
var step1 = y - y1;
if (step1 > step) step1 = step;
pos[0] = x1p;
pos[1] = 1 - 2. * y / this.winSize.height;
this.lineIntegralStep (g, x1, y, pos, 0, step1, line);
pos[0] = x2p;
this.lineIntegralStep (g, x2, y - step1, pos, 0, -step1, line);
}
this.boundCheck = false;
pos[1] = y1p;
var iv1 = this.numIntegrate (pos, 0, x1p, x2p, line);
pos[1] = y2p;
var iv2 = this.numIntegrate (pos, 0, x1p, x2p, line);
pos[0] = x1p;
var iv3 = this.numIntegrate (pos, 1, y1p, y2p, line);
pos[0] = x2p;
var iv4 = this.numIntegrate (pos, 1, y1p, y2p, line);
var ivtot = -iv1 + iv2 + iv3 - iv4;
var nf = java.text.NumberFormat.getInstance ();
nf.setMaximumFractionDigits (3);
if (ivtot < 1e-7 && ivtot > -1.0E-7) ivtot = 0;
ivtot *= this.reverse;
var s = ((!line) ? "Flux = " : "Circulation = ");
s += nf.format (ivtot * 1e5);
g.setColor (this.cv.getBackground ());
var fm = g.getFontMetrics ();
g.fillRect (0, this.winSize.height - 30, 20 + fm.stringWidth (s), 30);
g.setColor (java.awt.Color.white);
g.drawString (s, 10, this.winSize.height - 10);
}, "java.awt.Graphics,~B");
Clazz.defineMethod (c$, "numIntegrate", 
function (pos, n1, x1, x2, line) {
var steps = 8;
var lastres = 0;
var res = 0;
var n2 = (line) ? n1 : 1 - n1;
while (true) {
var i;
var h = (x2 - x1) / steps;
res = 0;
for (i = 0; i <= steps; i++) {
pos[n1] = x1 + i * h;
var field = this.rk_k1;
this.curfunc.getField (field, pos);
var ss = (i == 0 || i == steps) ? 1 : ((i & 1) == 1) ? 4 : 2;
res += field[n2] * h * ss;
}
res /= 3;
if (java.lang.Math.abs (lastres - res) < 1e-7) break;
lastres = res;
steps *= 2;
if (steps == 65536) break;
}
if (!line && n1 == 0) res = -res;
return res;
}, "~A,~N,~N,~N,~B");
Clazz.defineMethod (c$, "lineIntegralStep", 
function (g, x, y, pos, dx, dy, line) {
var field = this.rk_k1;
this.curfunc.getField (field, pos);
var f = (line) ? field[0] * dx + field[1] * dy : field[0] * dy - field[1] * dx;
f *= this.reverse;
var dn = java.lang.Math.abs (f * 100);
if (dn > 1) dn = 1;
var col1 = Clazz.doubleToInt (dn * 128 + 127);
var col2 = Clazz.doubleToInt (127 - dn * 127);
if (!line) {
x += Clazz.doubleToInt (dx / 2);
y -= Clazz.doubleToInt (dy / 2);
}if (f == 0) {
g.setColor ( new java.awt.Color (col2, col2, col2));
g.drawLine (x, y, x + dx, y - dy);
} else if (f > 0) {
g.setColor ( new java.awt.Color (col1, col2, col2));
if (line) this.drawArrow (g, null, x, y, x + dx, y - dy);
 else this.drawArrow (g, null, x, y, x + dy, y + dx);
} else {
g.setColor ( new java.awt.Color (col2, col1, col2));
if (line) this.drawArrow (g, null, x + dx, y - dy, x, y);
 else this.drawArrow (g, null, x, y, x - dy, y - dx);
}}, "java.awt.Graphics,~N,~N,~A,~N,~N,~B");
Clazz.defineMethod (c$, "genLines", 
function () {
var i;
var lineGridSize = 8;
if (lineGridSize < 3) lineGridSize = 3;
if (lineGridSize > 8) lineGridSize = 8;
lineGridSize *= 2;
var ct = 30 * lineGridSize * lineGridSize;
var brightmult = 80 * this.barFieldStrength;
this.fieldStrength = 10;
var lineGrid =  Clazz.newBooleanArray (lineGridSize, lineGridSize, false);
var lineGridMult = lineGridSize / 2.;
var origp =  Clazz.newDoubleArray (3, 0);
var field =  Clazz.newDoubleArray (3, 0);
var p = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Particle, this, null);
p.lifetime = -1;
p.stepsize = 10;
var dir = -1;
var segs = 0;
var lastdist = 0;
for (i = 0; i != ct; i++) {
if (p.lifetime < 0) {
p.lifetime = 1;
p.stepsize = 10;
segs = 0;
lastdist = 0;
if (dir == 1) {
var j;
for (j = 0; j != 3; j++) p.pos[j] = origp[j];

dir = -1;
continue;
}dir = 1;
var px = 0;
var py = 0;
while (true) {
if (!lineGrid[px][py]) break;
if (++px < lineGridSize) continue;
px = 0;
if (++py < lineGridSize) continue;
break;
}
if (py == lineGridSize) break;
lineGrid[px][py] = true;
var offs = .5 / lineGridMult;
origp[0] = p.pos[0] = px / lineGridMult - 1 + offs;
origp[1] = p.pos[1] = py / lineGridMult - 1 + offs;
}var p1x = p.pos[0];
var p1y = p.pos[1];
var p1z = this.getHeight (p1x, p1y);
var ge = this.grid[Clazz.doubleToInt ((p1x + 1) * 80 / 2)][Clazz.doubleToInt ((p1y + 1) * 80 / 2)];
if (!ge.visible) {
p.lifetime = -1;
continue;
}var x = p.pos;
this.lineSegment (p, dir);
if (p.lifetime < 0) continue;
var gx = Clazz.doubleToInt ((x[0] + 1) * lineGridMult);
var gy = Clazz.doubleToInt ((x[1] + 1) * lineGridMult);
if (!lineGrid[gx][gy]) segs--;
lineGrid[gx][gy] = true;
ge = this.grid[Clazz.doubleToInt ((p.pos[0] + 1) * 80 / 2)][Clazz.doubleToInt ((p.pos[1] + 1) * 80 / 2)];
if (!ge.visible) {
p.lifetime = -1;
continue;
}var dn = brightmult * p.phi;
if (dn > 2) dn = 2;
this.map3d (p1x, p1y, p1z, this.xpoints, this.ypoints, 0);
this.map3d (p.pos[0], p.pos[1], this.getHeight (p.pos[0], p.pos[1]), this.xpoints, this.ypoints, 1);
this.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
var d2 = this.dist2 (origp, x);
if (d2 > lastdist) lastdist = d2;
 else segs++;
if (segs > 10 || d2 < .001) p.lifetime = -1;
}
});
Clazz.defineMethod (c$, "drawVector", 
function (dd, vec) {
var field = dd.field;
this.curfunc.getField (field, vec);
var dn = java.lang.Math.sqrt (field[0] * field[0] + field[1] * field[1]);
var dnr = dn * this.reverse;
if (dn > 0) {
field[0] /= dnr;
field[1] /= dnr;
}dn *= dd.mult;
if (dn > 2) dn = 2;
var col = Clazz.doubleToInt (dn * 255);
var sw2 = 1. / (this.vectorSpacing - 1);
this.map3d (vec[0], vec[1], 0, this.xpoints, this.ypoints, 0);
this.map3d (vec[0] + sw2 * field[0], vec[1] + sw2 * field[1], 0, this.xpoints, this.ypoints, 1);
dd.g.setColor (this.fieldColors[col]);
this.drawArrow (dd.g, null, this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1], 2);
}, "com.falstad.VecDemoFrame.DrawData,~A");
Clazz.defineMethod (c$, "moveParticles", 
function () {
var bestd = 0;
var i;
var pcount = this.getParticleCount ();
for (i = 0; i != pcount; i++) {
var pt = this.particles[i];
this.removeFromDensityGroup (pt);
this.moveParticle (pt);
var x = pt.pos;
if (!(x[0] >= -1 && x[0] < 1 && x[1] >= -1 && x[1] < 1) || (pt.lifetime -= this.timeStep) < 0) this.positionParticle (pt);
var d = this.addToDensityGroup (pt);
if (d > bestd) bestd = d;
}
var withforce = (this.dispChooser.getSelectedIndex () == 1);
var maxd = (Clazz.doubleToInt (6 * this.getParticleCount () / (256)));
if (!withforce && this.curfunc.redistribute () && bestd > maxd) this.redistribute (bestd);
});
Clazz.defineMethod (c$, "drawParticles", 
function (g) {
g.setColor (java.awt.Color.white);
var disp = this.dispChooser.getSelectedIndex ();
if (disp == 2) {
var i;
for (i = 0; i != this.vecCount; i++) {
var fv = this.vectors[i];
g.setColor (this.fieldColors[fv.col]);
this.drawArrow (g, null, fv.sx1, fv.sy1, fv.sx2, fv.sy2, 2);
}
return;
}var pcount = this.getParticleCount ();
var i;
this.wooft += .3;
if (disp == 4) pcount = Clazz.doubleToInt ((pcount + 4) / 5);
for (i = 0; i < pcount; i++) {
var p = this.particles[i];
var pos = p.pos;
var ge = this.grid[Clazz.doubleToInt ((pos[0] + 1) * 80 / 2)][Clazz.doubleToInt ((pos[1] + 1) * 80 / 2)];
this.map3d (pos[0], pos[1], this.getHeight (pos[0], pos[1]), this.xpoints, this.ypoints, 0);
if (this.xpoints[0] < 0 || this.xpoints[0] >= this.winSize.width || this.ypoints[0] < 0 || this.ypoints[0] >= this.winSize.height) continue;
if (disp == 4) {
g.setColor (p.color);
var len = .02;
var ax = java.lang.Math.cos (p.theta) * 0.02;
var ay = java.lang.Math.sin (p.theta) * 0.02;
var offx = ax;
var offy = ay;
var a1 = this.curlcalc (p.pos[0] + offx, p.pos[1] + offy, -ay, ax);
var a2 = this.curlcalc (p.pos[0] - offy, p.pos[1] + offx, -ax, -ay);
var a3 = this.curlcalc (p.pos[0] - offx, p.pos[1] - offy, ay, -ax);
var a4 = this.curlcalc (p.pos[0] + offy, p.pos[1] - offx, ax, ay);
p.theta += (a1 + a2 + a3 + a4) / (0.0016);
this.map3d (p.pos[0] - offx, p.pos[1] - offy, 0, this.xpoints, this.ypoints, 0);
this.map3d (p.pos[0] + offx, p.pos[1] + offy, 0, this.xpoints, this.ypoints, 1);
this.map3d (p.pos[0] - offy, p.pos[1] + offx, 0, this.xpoints, this.ypoints, 2);
this.map3d (p.pos[0] + offy, p.pos[1] - offx, 0, this.xpoints, this.ypoints, 3);
g.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
g.drawLine (this.xpoints[2], this.ypoints[2], this.xpoints[3], this.ypoints[3]);
g.fillOval (this.xpoints[0] - 1, this.ypoints[0] - 1, 3, 3);
} else if (ge.visible && ge.valid) g.fillRect (this.xpoints[0], this.ypoints[0] - 1, 2, 2);
}
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "drawPlane", 
function (g, sizex, sizey, z) {
g.setColor (this.darkYellow);
this.map3d (-sizex, -sizey, z, this.xpoints, this.ypoints, 0);
this.map3d (+sizex, -sizey, z, this.xpoints, this.ypoints, 1);
this.map3d (+sizex, +sizey, z, this.xpoints, this.ypoints, 2);
this.map3d (-sizex, +sizey, z, this.xpoints, this.ypoints, 3);
g.fillPolygon (this.xpoints, this.ypoints, 4);
}, "java.awt.Graphics,~N,~N,~N");
Clazz.defineMethod (c$, "drawArrow", 
function (g, text, x1, y1, x2, y2) {
this.drawArrow (g, text, x1, y1, x2, y2, 5);
}, "java.awt.Graphics,~S,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawArrow", 
function (g, text, x1, y1, x2, y2, as) {
g.drawLine (x1, y1, x2, y2);
var l = java.lang.Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
if (l > Clazz.doubleToInt (as / 2)) {
var hatx = (x2 - x1) / l;
var haty = (y2 - y1) / l;
g.drawLine (x2, y2, Clazz.doubleToInt (haty * as - hatx * as + x2), Clazz.doubleToInt (-hatx * as - haty * as + y2));
g.drawLine (x2, y2, Clazz.doubleToInt (-haty * as - hatx * as + x2), Clazz.doubleToInt (hatx * as - haty * as + y2));
if (text != null) g.drawString (text, Clazz.doubleToInt (x2 + hatx * 10), Clazz.doubleToInt (y2 + haty * 10));
}}, "java.awt.Graphics,~S,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "redistribute", 
function (mostd) {
if (mostd < 5) return;
this.rediscount++;
var maxd = (Clazz.doubleToInt (6 * this.getParticleCount () / (256)));
var i;
var pn = 0;
var pcount = this.getParticleCount ();
for (i = this.rediscount % 4; i < pcount; i += 4) {
var p = this.particles[i];
var a = Clazz.doubleToInt ((p.pos[0] + 1) * (8));
var b = Clazz.doubleToInt ((p.pos[1] + 1) * (8));
if (this.density[a][b] <= maxd) continue;
p.lifetime = -1;
pn++;
}
}, "~N");
Clazz.defineMethod (c$, "curlcalc", 
function (x, y, ax, ay) {
this.rk_yn[0] = x;
this.rk_yn[1] = y;
this.curfunc.getField (this.rk_k1, this.rk_yn);
return this.partMult * (this.rk_k1[0] * ax + this.rk_k1[1] * ay);
}, "~N,~N,~N,~N");
c$.distanceParticle = Clazz.defineMethod (c$, "distanceParticle", 
function (p) {
return com.falstad.VecDemoFrame.distanceXY (p.pos[0], p.pos[1]);
}, "com.falstad.VecDemoFrame.Particle");
c$.distanceArray = Clazz.defineMethod (c$, "distanceArray", 
function (y) {
return java.lang.Math.sqrt (y[0] * y[0] + y[1] * y[1] + .000000001);
}, "~A");
c$.distanceXY = Clazz.defineMethod (c$, "distanceXY", 
function (x, y) {
return java.lang.Math.sqrt (x * x + y * y + .000000001);
}, "~N,~N");
c$.rotateParticleAdd = Clazz.defineMethod (c$, "rotateParticleAdd", 
function (result, y, mult, cx, cy) {
result[0] += -mult * (y[1] - cy);
result[1] += mult * (y[0] - cx);
}, "~A,~A,~N,~N,~N");
c$.rotateParticle = Clazz.defineMethod (c$, "rotateParticle", 
function (result, y, mult) {
result[0] = -mult * y[1];
result[1] = mult * y[0];
result[2] = 0;
}, "~A,~A,~N");
Clazz.defineMethod (c$, "edit", 
function (e) {
var x = e.getX ();
var y = e.getY ();
this.editView (x, y);
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "editView", 
function (x, y) {
if (this.modeChooser.getSelectedIndex () == 0) {
if (this.isFlat) return;
this.viewAngle = (this.dragStartX - x) / 40. + this.viewAngleDragStart;
while (this.viewAngle < 0) this.viewAngle += 6.283185307179586;

while (this.viewAngle >= 6.283185307179586) this.viewAngle -= 6.283185307179586;

this.viewAngleCos = java.lang.Math.cos (this.viewAngle);
this.viewAngleSin = java.lang.Math.sin (this.viewAngle);
this.viewHeight = -(this.dragStartY - y) / 10. + this.viewHeightDragStart;
if (this.viewHeight > 9) this.viewHeight = 9;
if (this.viewHeight < -9) this.viewHeight = -9;
this.draggingView = this.backgroundChanged = true;
this.cv.repaint (this.pause);
return;
}if (this.modeChooser.getSelectedIndex () == 1) {
if (this.isFlat) return;
this.viewZoom = (x - this.dragStartX) / 40. + this.viewZoomDragStart;
if (this.viewZoom < .1) this.viewZoom = .1;
this.draggingView = this.backgroundChanged = true;
this.cv.repaint (this.pause);
return;
}if (this.modeChooser.getSelectedIndex () == 2 || this.modeChooser.getSelectedIndex () == 3) {
this.integralX = x;
this.integralY = y;
this.cv.repaint (this.pause);
}}, "~N,~N");
Clazz.overrideMethod (c$, "componentHidden", 
function (e) {
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "componentMoved", 
function (e) {
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "componentShown", 
function (e) {
this.cv.repaint (this.pause);
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "componentResized", 
function (e) {
this.handleResize ();
this.cv.repaint (this.pause);
}, "java.awt.event.ComponentEvent");
Clazz.overrideMethod (c$, "actionPerformed", 
function (e) {
this.vectors = null;
if (e.getSource () === this.resetButton) this.resetParticles ();
if (e.getSource () === this.kickButton) this.kickParticles ();
if (e.getSource () === this.infoButton) {
var s = this.curfunc.getClass ().getName ();
try {
s = s.substring (s.lastIndexOf ('.') + 1);
this.applet.getAppletContext ().showDocument ( new java.net.URL (this.applet.getCodeBase (), "functions.html" + '#' + s), "functionHelp");
} catch (ex) {
if (Clazz.exceptionOf (ex, Exception)) {
} else {
throw ex;
}
}
}this.curfunc.actionPerformed ();
this.cv.repaint (this.pause);
}, "java.awt.event.ActionEvent");
Clazz.defineMethod (c$, "handleEvent", 
function (ev) {
if (ev.id == 201) {
this.destroyFrame ();
return true;
}return Clazz.superCall (this, com.falstad.VecDemoFrame, "handleEvent", [ev]);
}, "java.awt.Event");
Clazz.defineMethod (c$, "destroyFrame", 
function () {
if (this.applet == null) this.dispose ();
 else this.applet.destroyFrame ();
});
Clazz.overrideMethod (c$, "scrollbarValueChanged", 
function (ds) {
this.vectors = null;
System.out.print (ds.getValue () + "\n");
if (ds === this.partCountBar) this.resetDensityGroups ();
if (ds === this.aux1Bar || ds === this.aux2Bar || ds === this.aux3Bar) {
this.$functionChanged = true;
this.draggingView = true;
}this.cv.repaint (this.pause);
}, "com.falstad.DecentScrollbar");
Clazz.overrideMethod (c$, "scrollbarFinished", 
function (ds) {
this.draggingView = false;
this.cv.repaint (this.pause);
}, "com.falstad.DecentScrollbar");
Clazz.overrideMethod (c$, "mouseDragged", 
function (e) {
this.dragging = true;
this.edit (e);
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseMoved", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseClicked", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseEntered", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseExited", 
function (e) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mousePressed", 
function (e) {
if ((e.getModifiers () & 16) == 0) return;
this.dragStartX = e.getX ();
this.dragStartY = e.getY ();
this.viewAngleDragStart = this.viewAngle;
this.viewHeightDragStart = this.viewHeight;
this.viewZoomDragStart = this.viewZoom;
this.dragging = true;
this.edit (e);
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseReleased", 
function (e) {
if ((e.getModifiers () & 16) == 0) return;
this.dragging = this.draggingView = false;
this.cv.repaint (this.pause);
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "dispChooserChanged", 
function () {
var disp = this.dispChooser.getSelectedIndex ();
this.showA = false;
if (disp == 1) this.kickButton.enable ();
 else this.kickButton.disable ();
this.potentialLabel.hide ();
this.potentialBar.hide ();
this.vecDensityLabel.hide ();
this.vecDensityBar.hide ();
this.partCountLabel.hide ();
this.partCountBar.hide ();
this.strengthLabel.show ();
this.strengthBar.show ();
if (disp == 2) {
this.vecDensityLabel.show ();
this.vecDensityBar.show ();
} else {
this.partCountLabel.show ();
this.partCountBar.show ();
}this.validate ();
this.resetParticles ();
});
Clazz.overrideMethod (c$, "itemStateChanged", 
function (e) {
if (!this.finished) return;
this.vectors = null;
this.cv.repaint (this.pause);
this.reverse = (this.reverseCheck.getState ()) ? -1 : 1;
if (e.getItemSelectable () === this.dispChooser) {
this.dispChooserChanged ();
this.resetParticles ();
}if (e.getItemSelectable () === this.functionChooser) this.functionChanged ();
if (e.getItemSelectable () === this.reverseCheck) this.$functionChanged = true;
if (e.getItemSelectable () === this.floorColorChooser || e.getItemSelectable () === this.floorLineChooser) this.backgroundChanged = true;
}, "java.awt.event.ItemEvent");
Clazz.defineMethod (c$, "checkFlatState", 
function () {
var oldFlat = this.isFlat;
var disp = this.dispChooser.getSelectedIndex ();
this.isFlat = this.flatCheck.getState () || this.curfunc.nonGradient () || disp == 2 || disp == 4;
var mode = this.modeChooser.getSelectedIndex ();
if (mode == 2 || mode == 3) this.isFlat = true;
if (this.isFlat != oldFlat) this.backgroundChanged = true;
});
Clazz.defineMethod (c$, "functionChanged", 
function () {
this.reverse = 1;
this.reverseCheck.setState (false);
this.parseError = false;
this.curfunc = this.functionList.elementAt (this.functionChooser.getSelectedIndex ());
var i;
for (i = 0; i != 3; i++) {
this.auxBars[i].label.hide ();
this.auxBars[i].bar.hide ();
}
for (i = 0; i != 2; i++) this.textFields[i].hide ();

if (this.textFieldLabel != null) this.textFieldLabel.hide ();
this.strengthBar.setValue (80);
this.curfunc.setup ();
this.validate ();
this.resetParticles ();
this.dispChooserChanged ();
this.$functionChanged = true;
this.integralX = -1;
});
Clazz.defineMethod (c$, "setupDispChooser", 
function (potential) {
this.dispChooser.removeAll ();
this.dispChooser.add ("Display: Particles (Vel.)");
this.dispChooser.add ("Display: Particles (Force)");
this.dispChooser.add ("Display: Field Vectors");
this.dispChooser.add ("Display: None");
if (com.falstad.VecDemoFrame.BUILD_V) this.dispChooser.add ("Display: Curl Detectors");
}, "~B");
Clazz.defineMethod (c$, "setupBar", 
function (n, text, val) {
this.auxBars[n].label.setText (text);
this.auxBars[n].label.show ();
this.auxBars[n].bar.setValue (val);
this.auxBars[n].bar.show ();
}, "~N,~S,~N");
Clazz.defineMethod (c$, "cross", 
function (res, v1, v2) {
res[0] = v1[1] * v2[2] - v1[2] * v2[1];
res[1] = v1[2] * v2[0] - v1[0] * v2[2];
res[2] = v1[0] * v2[1] - v1[1] * v2[0];
}, "~A,~A,~A");
Clazz.defineMethod (c$, "dot", 
function (v1, v2) {
return v1[0] * v2[0] + v1[1] * v2[1];
}, "~A,~A");
Clazz.defineMethod (c$, "rk", 
function (order, x, Y, stepsize) {
var i;
if (order == 2) {
var fmult = stepsize * this.partMult;
for (i = 0; i != order; i++) this.rk_yn[i] = Y[i];

this.curfunc.getField (this.rk_k1, this.rk_yn);
for (i = 0; i != order; i++) this.rk_yn[i] = (Y[i] + 0.5 * fmult * this.rk_k1[i]);

this.curfunc.getField (this.rk_k2, this.rk_yn);
for (i = 0; i != order; i++) this.rk_yn[i] = (Y[i] + 0.5 * fmult * this.rk_k2[i]);

this.curfunc.getField (this.rk_k3, this.rk_yn);
for (i = 0; i != order; i++) this.rk_yn[i] = (Y[i] + fmult * this.rk_k3[i]);

this.curfunc.getField (this.rk_k4, this.rk_yn);
for (i = 0; i != order; i++) Y[i] = Y[i] + fmult * (this.rk_k1[i] + 2 * (this.rk_k2[i] + this.rk_k3[i]) + this.rk_k4[i]) / 6;

Y[2] = this.rk_k4[2];
} else {
var fmult = stepsize * this.partMult;
for (i = 0; i != order; i++) this.rk_yn[i] = Y[i];

this.getForceField (this.rk_k1, this.rk_yn, stepsize, fmult);
for (i = 0; i != order; i++) this.rk_yn[i] = (Y[i] + 0.5 * this.rk_k1[i]);

this.getForceField (this.rk_k2, this.rk_yn, stepsize, fmult);
for (i = 0; i != order; i++) this.rk_yn[i] = (Y[i] + 0.5 * this.rk_k2[i]);

this.getForceField (this.rk_k3, this.rk_yn, stepsize, fmult);
for (i = 0; i != order; i++) this.rk_yn[i] = (Y[i] + this.rk_k3[i]);

this.getForceField (this.rk_k4, this.rk_yn, stepsize, fmult);
for (i = 0; i != order; i++) Y[i] = Y[i] + (this.rk_k1[i] + 2 * (this.rk_k2[i] + this.rk_k3[i]) + this.rk_k4[i]) / 6;

Y[4] = this.rk_k4[4];
}}, "~N,~N,~A,~N");
Clazz.defineMethod (c$, "getForceField", 
function (result, y, stepsize, fmult) {
this.curfunc.getField (result, y);
result[4] = result[2];
var i;
for (i = 0; i != 2; i++) result[i + 2] = fmult * result[i] * .1;

for (i = 0; i != 2; i++) result[i] = stepsize * this.timeStep * this.rk_yn[i + 2];

}, "~A,~A,~N,~N");
Clazz.defineMethod (c$, "moveParticle", 
function (p) {
var disp = this.dispChooser.getSelectedIndex ();
var numIter = 0;
var maxh = 1;
var error = 0.0;
var E = .001;
var localError;
var useForce = (disp == 1);
var order = useForce ? 4 : 2;
var Y = this.rk_Y;
var Yhalf = this.rk_Yhalf;
this.oldY = this.rk_oldY;
var i;
for (i = 0; i != 2; i++) this.oldY[i] = Y[i] = Yhalf[i] = p.pos[i];

if (useForce) for (i = 0; i != 2; i++) Y[i + 2] = Yhalf[i + 2] = p.vel[i];

var t = 0;
if (!this.curfunc.useRungeKutta ()) {
this.boundCheck = false;
this.curfunc.getField (Yhalf, Y);
if (this.boundCheck && (!useForce || this.curfunc.checkBoundsWithForce ())) {
p.pos[0] = -100;
return;
}var fmult = this.partMult;
if (useForce) {
fmult *= .1;
for (i = 0; i != 2; i++) {
p.vel[i] += fmult * Yhalf[i];
p.pos[i] += p.vel[i] * this.timeStep;
}
} else {
for (i = 0; i != 2; i++) p.pos[i] += fmult * Yhalf[i];

}p.pos[2] = Yhalf[2];
for (i = 0; i != 2; i++) Y[i] = p.pos[i];

if (this.curfunc.checkBounds (Y, this.oldY)) p.pos[0] = -100;
return;
}var adapt = this.curfunc.useAdaptiveRungeKutta ();
var h = (adapt) ? p.stepsize : 1;
var steps = 0;
var minh = .0001;
while (t >= 0 && t < 1) {
if (t + h > 1) h = 1 - t;
this.boundCheck = false;
this.rk (order, 0, Y, h);
if (!adapt) break;
this.rk (order, 0, Yhalf, h * 0.5);
this.rk (order, 0, Yhalf, h * 0.5);
if (this.boundCheck && (!useForce || this.curfunc.checkBoundsWithForce ())) {
p.pos[0] = -100;
return;
}localError = java.lang.Math.abs (Y[0] - Yhalf[0]) + java.lang.Math.abs (Y[1] - Yhalf[1]);
if (localError > E && h > minh) {
h *= 0.75;
if (h < minh) h = minh;
for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

continue;
} else if (localError < (E * 0.5)) {
h *= 1.25;
if (h > maxh) h = maxh;
}for (i = 0; i != order; i++) this.oldY[i] = Yhalf[i] = Y[i];

t += h;
steps++;
}
if (this.boundCheck && (!useForce || this.curfunc.checkBoundsWithForce ())) {
p.pos[0] = -100;
return;
}p.stepsize = h;
for (i = 0; i != 3; i++) p.pos[i] = Y[i];

if (useForce) {
for (i = 0; i != 2; i++) p.vel[i] = Y[i + 2];

p.pos[2] = Y[4];
}}, "com.falstad.VecDemoFrame.Particle");
Clazz.defineMethod (c$, "dist2", 
function (a, b) {
var c0 = a[0] - b[0];
var c1 = a[1] - b[1];
return c0 * c0 + c1 * c1;
}, "~A,~A");
Clazz.defineMethod (c$, "lineSegment", 
function (p, dir) {
var numIter = 0;
var maxh = 20;
var error = 0.0;
var E = .001;
var localError;
var order = 2;
var Y = this.rk_Y;
var Yhalf = this.rk_Yhalf;
this.oldY = this.rk_oldY;
var i;
for (i = 0; i != 2; i++) this.oldY[i] = Y[i] = Yhalf[i] = p.pos[i];

var h = p.stepsize;
this.ls_fieldavg[0] = this.ls_fieldavg[1] = this.ls_fieldavg[2] = 0;
var steps = 0;
var minh = .1;
var segSize2max = 0.0125;
var segSize2min = segSize2max / 4;
var lastd = 0;
var avgct = 0;
while (true) {
this.boundCheck = false;
steps++;
if (steps > 100) {
System.out.print ("maxsteps\n");
p.lifetime = -1;
return;
}this.rk (order, 0, Y, dir * h);
this.rk (order, 0, Yhalf, dir * h * 0.5);
this.rk (order, 0, Yhalf, dir * h * 0.5);
if (this.boundCheck) {
for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

h /= 2;
if (h < minh) {
p.lifetime = -1;
return;
}continue;
}if (Y[0] < -1 || Y[0] >= .999 || Y[1] < -1 || Y[1] >= .999) {
for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

h /= 2;
if (h < minh) {
p.lifetime = -1;
return;
}continue;
}localError = java.lang.Math.abs (Y[0] - Yhalf[0]) + java.lang.Math.abs (Y[1] - Yhalf[1]);
if (localError > E && h > minh) {
h *= 0.75;
if (h < minh) h = minh;
for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

continue;
} else if (localError < (E * 0.5)) {
h *= 1.25;
if (h > maxh) h = maxh;
}var d = this.dist2 (p.pos, Y);
if (!(d - lastd > 1e-10)) {
p.lifetime = -1;
return;
}if (d > segSize2max) {
h /= 2;
if (h < minh) {
p.lifetime = -1;
return;
}for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

continue;
}this.ls_fieldavg[0] += this.rk_k1[0];
this.ls_fieldavg[1] += this.rk_k1[1];
avgct++;
if (d > segSize2min) break;
lastd = d;
for (i = 0; i != order; i++) this.oldY[i] = Yhalf[i] = Y[i];

}
p.stepsize = h;
for (i = 0; i != 3; i++) p.pos[i] = Y[i];

p.phi = java.lang.Math.sqrt (this.ls_fieldavg[0] * this.ls_fieldavg[0] + this.ls_fieldavg[1] * this.ls_fieldavg[1]) / avgct;
}, "com.falstad.VecDemoFrame.Particle,~N");
Clazz.defineMethod (c$, "doubleToGrid", 
function (x) {
return Clazz.doubleToInt ((x + 1) * 80 / 2);
}, "~N");
Clazz.defineMethod (c$, "gridToDouble", 
function (x) {
return (x * 2. / 80) - 1;
}, "~N");
Clazz.defineMethod (c$, "getDirectionField", 
function (result, y, th) {
var sinth = java.lang.Math.sin (th);
var costh = java.lang.Math.cos (th);
if (!this.showA) {
result[0] = .0003 * costh;
result[1] = .0003 * sinth;
result[2] = -0.4 * (y[0] * costh + y[1] * sinth);
} else {
var axis =  Clazz.newDoubleArray (3, 0);
axis[0] = costh;
axis[1] = sinth;
axis[2] = 0;
var d = this.dot (axis, y);
var r =  Clazz.newDoubleArray (3, 0);
var i;
for (i = 0; i != 2; i++) r[i] = .0006 * (y[i] - axis[i] * d);

this.cross (result, axis, r);
}}, "~A,~A,~N");
c$.$VecDemoFrame$AuxBar$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.bar = null;
this.label = null;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "AuxBar");
Clazz.makeConstructor (c$, 
function (a, b) {
this.label = a;
this.bar = b;
}, "swingjs.awt.Label,com.falstad.DecentScrollbar");
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$FloatPair$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.x = 0;
this.y = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "FloatPair");
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$VecFunction$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "VecFunction");
Clazz.defineMethod (c$, "nonGradient", 
function () {
return false;
});
Clazz.defineMethod (c$, "useRungeKutta", 
function () {
return true;
});
Clazz.defineMethod (c$, "useAdaptiveRungeKutta", 
function () {
return true;
});
Clazz.defineMethod (c$, "checkBoundsWithForce", 
function () {
return true;
});
Clazz.defineMethod (c$, "checkBounds", 
function (a, b) {
return false;
}, "~A,~A");
Clazz.defineMethod (c$, "redistribute", 
function () {
return true;
});
Clazz.defineMethod (c$, "setup", 
function () {
});
Clazz.defineMethod (c$, "setupFrame", 
function () {
});
Clazz.defineMethod (c$, "finishFrame", 
function () {
});
Clazz.defineMethod (c$, "actionPerformed", 
function () {
});
Clazz.defineMethod (c$, "calcDivergence", 
function () {
});
Clazz.defineMethod (c$, "getLevelHeight", 
function () {
return 0;
});
Clazz.defineMethod (c$, "setGrid", 
function (a, b, c) {
var d = this.b$["com.falstad.VecDemoFrame"].rk_k1;
var e = this.b$["com.falstad.VecDemoFrame"].rk_k2;
var f = this.b$["com.falstad.VecDemoFrame"].rk_k3;
d[0] = (b * 2. / 80) - 1;
d[1] = (c * 2. / 80) - 1;
d[2] = 0;
this.b$["com.falstad.VecDemoFrame"].boundCheck = false;
this.getField (e, d);
a.vecX = this.b$["com.falstad.VecDemoFrame"].reverse * e[0] * 70;
a.vecY = this.b$["com.falstad.VecDemoFrame"].reverse * e[1] * 70;
a.height = this.b$["com.falstad.VecDemoFrame"].reverse * e[2] * .625;
a.valid = !this.b$["com.falstad.VecDemoFrame"].boundCheck;
var g = d[0];
d[0] += 1e-8;
this.getField (f, d);
a.div = f[0] - e[0];
a.curl = f[1] - e[1];
d[0] = g;
d[1] += 1e-8;
this.getField (f, d);
a.div = (a.div + f[1] - e[1]) * 1e10 * this.b$["com.falstad.VecDemoFrame"].reverse;
a.curl = (a.curl - (f[0] - e[0])) * 1e10 * this.b$["com.falstad.VecDemoFrame"].reverse;
}, "com.falstad.VecDemoFrame.GridElement,~N,~N");
Clazz.defineMethod (c$, "getDivOffset", 
function () {
return 4;
});
Clazz.defineMethod (c$, "getDivRange", 
function () {
return 11;
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRadial$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.lineLen = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRadial", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV ("charged line", null, "1/r single line");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceXY (b[0], b[1]);
if (c < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var d = c * c;
a[0] = -2.0E-4 * b[0] / d;
a[1] = -2.0E-4 * b[1] / d;
a[2] = .4 * java.lang.Math.log (c + 1e-300);
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.lineLen = 1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadialDouble, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRadialDouble$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.sign = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRadialDouble", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.InverseRadialDouble, []);
this.sign = 1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV ("line charge double", null, "1/r double lines");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].gridToDouble (40 + Clazz.doubleToInt (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () * 80 / 200));
var d = b[0] - c;
var e = b[0] + c;
var f = com.falstad.VecDemoFrame.distanceXY (d, b[1]);
var g = com.falstad.VecDemoFrame.distanceXY (e, b[1]);
if (f < 0.001 || g < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var h = .0002;
var i = 1 / (f * f);
var j = 1 / (g * g * this.sign);
a[0] = h * (-d * i - e * j);
a[1] = h * (-b[1] * i - b[1] * j);
a[2] = .2 * (java.lang.Math.log (f + 1e-20) + this.sign * java.lang.Math.log (g + 1e-20));
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Line Separation", 30);
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadialDipole, this, null), null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadial, this, null));
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRadialDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRadialDipole", com.falstad.VecDemoFrame.InverseRadialDouble, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadialDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.InverseRadialDipole, []);
this.sign = -1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dipole lines";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadialQuad, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRadialQuad$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRadialQuad", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "quad lines";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].gridToDouble (40 + Clazz.doubleToInt (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () * 80 / 200));
var d = b[0] + c;
var e = b[0] - c;
var f = b[1] + c;
var g = b[1] - c;
var h = com.falstad.VecDemoFrame.distanceXY (d, f);
var i = com.falstad.VecDemoFrame.distanceXY (e, f);
var j = com.falstad.VecDemoFrame.distanceXY (d, g);
var k = com.falstad.VecDemoFrame.distanceXY (e, g);
if (h < 0.001 || i < 0.001 || j < 0.001 || k < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var l = .0003;
a[0] = l * (-d / (h * h) - e / (k * k) + e / (i * i) + d / (j * j));
a[1] = l * (-f / (h * h) - g / (k * k) + f / (i * i) + g / (j * j));
a[2] = .2 * (+java.lang.Math.log (h + 1e-20) - java.lang.Math.log (i + 1e-20) - java.lang.Math.log (j + 1e-20) + java.lang.Math.log (k + 1e-20));
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Line Separation", 30);
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadial, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseSquaredRadial$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseSquaredRadial", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV ("point charge", null, "1/r^2 single");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceArray (b);
if (c < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var d = c * c * c;
var e = .0003 / d;
a[0] = -b[0] * e;
a[1] = -b[1] * e;
a[2] = -0.3 / c;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadialDouble, this, null);
});
Clazz.defineStatics (c$,
"chargeSize", .001);
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseSquaredRadialDouble$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.sign2 = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseSquaredRadialDouble", com.falstad.VecDemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV ("point charge double", null, "1/r^2 double");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].gridToDouble (40 + Clazz.doubleToInt (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () * 80 / 200));
var d = b[0] - c;
var e = b[0] + c;
var f = com.falstad.VecDemoFrame.distanceXY (d, b[1]);
if (f < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var g = com.falstad.VecDemoFrame.distanceXY (e, b[1]);
if (g < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var h = .0003;
var i = h / (f * f * f);
var j = h / (g * g * g) * this.sign2;
a[0] = -d * i - e * j;
a[1] = -b[1] * i - b[1] * j;
a[2] = -0.05 / f - .05 * this.sign2 / g;
if (this.sign2 == -1) a[2] *= 2;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.sign2 = 1;
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Charge Separation", 30);
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadialDipole, this, null), null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotational, this, null));
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseSquaredRadialDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseSquaredRadialDipole", com.falstad.VecDemoFrame.InverseSquaredRadialDouble, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadialDouble, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "dipole";
});
Clazz.defineMethod (c$, "setup", 
function () {
Clazz.superCall (this, com.falstad.VecDemoFrame.InverseSquaredRadialDipole, "setup", []);
this.sign2 = -1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadialQuad, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseSquaredRadialQuad$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseSquaredRadialQuad", com.falstad.VecDemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "quadrupole";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].gridToDouble (40 + Clazz.doubleToInt (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () * 80 / 200));
var d = b[0] - c;
var e = b[0] + c;
var f = b[1] - c;
var g = b[1] + c;
var h = com.falstad.VecDemoFrame.distanceXY (d, f);
var i = com.falstad.VecDemoFrame.distanceXY (e, f);
var j = com.falstad.VecDemoFrame.distanceXY (d, g);
var k = com.falstad.VecDemoFrame.distanceXY (e, g);
if (h < 0.001 || i < 0.001 || j < 0.001 || k < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var l = .0003;
var m = l / (h * h * h);
var n = l / (i * i * i);
var o = l / (j * j * j);
var p = l / (k * k * k);
a[0] = -d * m - e * p + e * n + d * o;
a[1] = -f * m - g * p + f * n + g * o;
a[2] = .05 * (-1 / h + 1 / i + 1 / j - 1 / k);
}, "~A,~A");
Clazz.defineMethod (c$, "setup", 
function () {
Clazz.superCall (this, com.falstad.VecDemoFrame.InverseSquaredRadialQuad, "setup", []);
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Charge Separation", 30);
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ConductingPlate, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$ConductingPlate$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.z = null;
this.z2 = null;
this.plate = false;
this.a = 0;
this.base = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "ConductingPlate", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting plate";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.ConductingPlate, []);
this.z =  new com.falstad.Complex ();
this.z2 =  new com.falstad.Complex ();
this.plate = true;
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.a = (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () + 1) / 100.;
this.z.setReIm (0, 1 / this.a);
this.z.arcsin ();
this.base = this.z.im;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
if (b[1] >= -0.02 && b[1] <= .02) {
if ((this.plate && b[0] >= -this.a && b[0] <= this.a) || (!this.plate && (b[0] >= this.a || b[0] <= -this.a))) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
}this.z.setReIm (b[0] / this.a, b[1] / this.a);
if (b[1] < 0 && this.plate) this.z.im = -this.z.im;
this.z2.set (this.z);
this.z2.arcsin ();
a[2] = (this.plate) ? this.z2.im / this.base - 1 : -this.z2.re * .6;
this.z.square ();
this.z.multRe (-1);
this.z.addRe (1);
this.z.pow (-0.5);
this.z.multRe (1 / this.a);
if (this.plate) {
a[1] = this.z.re * -7.0E-4;
a[0] = this.z.im * -7.0E-4;
if (b[1] <= 0) a[1] = -a[1];
} else {
a[0] = this.z.re * .0007;
a[1] = -this.z.im * .0007;
if (b[1] == 0) a[1] = -a[1];
}}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Plate Size", 60);
});
Clazz.overrideMethod (c$, "getDivOffset", 
function () {
return -17.3;
});
Clazz.overrideMethod (c$, "getDivRange", 
function () {
return 2.5;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ChargedPlate, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$ChargedPlate$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.cz = null;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "ChargedPlate", com.falstad.VecDemoFrame.ConductingPlate, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ConductingPlate, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.ChargedPlate, []);
this.cz =  new com.falstad.Complex ();
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged plate";
});
Clazz.overrideMethod (c$, "getDivOffset", 
function () {
return 4;
});
Clazz.overrideMethod (c$, "getDivRange", 
function () {
return 11;
});
Clazz.defineMethod (c$, "getPot", 
function (a, b, c) {
this.cz.setReIm (c, -a);
this.cz.multReIm (c, b);
this.cz.log ();
var d = this.cz.im;
this.cz.setReIm (c, a);
this.cz.multReIm (c, -b);
this.cz.log ();
var e = c * c;
if (e == 0) e = 1e-8;
return .3 * (2 * (a - b) + (d - this.cz.im) * c + b * java.lang.Math.log (b * b + e) - a * java.lang.Math.log (a * a + e));
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "calcDivergence", 
function () {
var a = this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 100.;
var b;
var c;
for (b = 0; b != 80; b++) {
var d = this.b$["com.falstad.VecDemoFrame"].gridToDouble (b);
if (d < -this.a || d > this.a) continue;
this.b$["com.falstad.VecDemoFrame"].grid[b][40].div = -this.b$["com.falstad.VecDemoFrame"].reverse;
}
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
if (b[1] >= -0.01 && b[1] <= .01 && (b[0] >= -this.a && b[0] <= this.a)) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var c = -this.a - b[0];
var d = this.a - b[0];
var e = b[1] * b[1];
if (e == 0) e = 1e-8;
var f = .0003 / this.a;
a[0] = .5 * f * java.lang.Math.log ((e + d * d) / (e + c * c));
a[1] = f * (java.lang.Math.atan (c / b[1]) - java.lang.Math.atan (d / b[1]));
a[2] = .4 * this.getPot (c, d, b[1]) / this.a;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ChargedPlatePair, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$ChargedPlatePair$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.dipole = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "ChargedPlatePair", com.falstad.VecDemoFrame.ChargedPlate, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ChargedPlate, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged plate pair";
});
Clazz.overrideMethod (c$, "useRungeKutta", 
function () {
return false;
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.ChargedPlatePair, []);
this.dipole = 1;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 100.;
if ((b[1] >= -0.01 + c && b[1] <= .01 + c || b[1] >= -0.01 - c && b[1] <= .01 - c) && b[0] >= -this.a && b[0] <= this.a) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var d = -this.a - b[0];
var e = this.a - b[0];
var f = b[1] - c;
var g = f * f;
if (g == 0) g = 1e-8;
var h = b[1] + c;
var i = h * h;
if (i == 0) i = 1e-8;
var j = .0003 / this.a;
a[0] = .5 * j * (java.lang.Math.log ((g + e * e) / (g + d * d)) + this.dipole * java.lang.Math.log ((i + e * e) / (i + d * d)));
a[1] = j * (java.lang.Math.atan (d / f) - java.lang.Math.atan (e / f) + this.dipole * (java.lang.Math.atan (d / h) - java.lang.Math.atan (e / h)));
a[2] = .4 * (this.getPot (d, e, f) + this.dipole * this.getPot (d, e, h)) / this.a;
}, "~A,~A");
Clazz.overrideMethod (c$, "calcDivergence", 
function () {
var a = this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 100.;
var b;
var c;
for (b = 0; b != 80; b++) {
var d = this.b$["com.falstad.VecDemoFrame"].gridToDouble (b);
if (d < -this.a || d > this.a) continue;
c = this.b$["com.falstad.VecDemoFrame"].doubleToGrid (a);
this.b$["com.falstad.VecDemoFrame"].grid[b][c].div = -this.b$["com.falstad.VecDemoFrame"].reverse;
c = this.b$["com.falstad.VecDemoFrame"].doubleToGrid (-a);
this.b$["com.falstad.VecDemoFrame"].grid[b][c].div = -this.dipole * this.b$["com.falstad.VecDemoFrame"].reverse;
}
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Sheet Size", 60);
this.b$["com.falstad.VecDemoFrame"].setupBar (1, "Sheet Separation", 33);
});
Clazz.overrideMethod (c$, "checkBounds", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () / 100.;
var d = this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 100.;
if (a[0] >= -c && a[0] <= c) {
if (a[1] > d) {
if (b[1] < d) return true;
} else if (a[1] < -d) {
if (b[1] > -d) return true;
} else if (b[1] > d || b[1] < -d) return true;
}return false;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ChargedPlateDipole, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$ChargedPlateDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "ChargedPlateDipole", com.falstad.VecDemoFrame.ChargedPlatePair, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ChargedPlatePair, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged plate dipole";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.ChargedPlateDipole, []);
this.dipole = -1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InfiniteChargedPlane, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InfiniteChargedPlane$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InfiniteChargedPlane", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "infinite plane";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .0004;
if (b[1] > -0.01 && b[1] < .01) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
a[0] = 0;
a[1] = (b[1] <= 0) ? c : -c;
a[2] = java.lang.Math.abs (b[1]) - 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "checkBoundsWithForce", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Cylinder, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$Cylinder$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "Cylinder", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting cylinder";
});
Clazz.defineMethod (c$, "getCylRadius", 
function () {
return (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () + 1) / 110.;
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Cylinder Size", 30);
this.b$["com.falstad.VecDemoFrame"].setupBar (1, "Cylinder Potential", 1);
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.getCylRadius ();
var d = 4;
var e = 2 * (this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 50. - 1);
var f = 4000;
var g = -e / (4000 * (java.lang.Math.log (c) - java.lang.Math.log (d)));
var h = 4000 * g * java.lang.Math.log (d);
var i = b[0];
var j = b[1];
var k = com.falstad.VecDemoFrame.distanceXY (i, j);
if (k < c) {
a[0] = a[1] = 0;
a[2] = e;
this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
return;
}var l = 5 * g / (k * k);
a[0] = i * l;
a[1] = j * l;
a[2] = h - g * 4000 * java.lang.Math.log (k);
}, "~A,~A");
Clazz.overrideMethod (c$, "calcDivergence", 
function () {
var a = this.getCylRadius ();
var b;
for (b = 0; b != 100; b++) {
var c = 2 * 3.141592653589793 * b / 100.;
var d = java.lang.Math.cos (c) * a;
var e = java.lang.Math.sin (c) * a;
this.b$["com.falstad.VecDemoFrame"].grid[this.b$["com.falstad.VecDemoFrame"].doubleToGrid (d)][this.b$["com.falstad.VecDemoFrame"].doubleToGrid (e)].div -= this.b$["com.falstad.VecDemoFrame"].reverse / 20.;
}
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.CylinderAndLineCharge, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$CylinderAndLineCharge$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.q = 0;
this.a = 0;
this.b = 0;
this.spos = 0;
this.imagePos = 0;
this.cq = 0;
this.pot0 = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "CylinderAndLineCharge", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "cyl + line charge";
});
Clazz.defineMethod (c$, "getCylRadius", 
function () {
return (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () + 1) / 110.;
});
Clazz.defineMethod (c$, "getSeparation", 
function () {
return this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 100.;
});
Clazz.defineMethod (c$, "getCylPos", 
function () {
return this.getSeparation () / 2;
});
Clazz.defineMethod (c$, "getPointPos", 
function () {
return -this.getSeparation () / 2 - this.getCylRadius ();
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Cylinder Size", 30);
this.b$["com.falstad.VecDemoFrame"].setupBar (1, "Separation", 30);
this.b$["com.falstad.VecDemoFrame"].setupBar (2, "Cylinder Potential", 50);
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.q = -3.0E-4;
this.a = this.getCylRadius ();
this.b = this.getSeparation () + this.a;
this.spos = this.getCylPos ();
this.imagePos = this.spos - this.a * this.a / this.b;
var a = this.spos + this.a - this.imagePos;
var b = this.spos + this.a - this.getPointPos ();
this.cq = this.a * this.a * (this.q / (a * a) - this.q / (b * b));
this.pot0 = -this.cq * java.lang.Math.log (this.a) + this.q * java.lang.Math.log (a) - this.q * java.lang.Math.log (b);
this.cq -= (this.b$["com.falstad.VecDemoFrame"].aux3Bar.getValue () / 50. - 1) * .0006 / java.lang.Math.log (this.a);
});
Clazz.overrideMethod (c$, "calcDivergence", 
function () {
var a;
var b = this.b$["com.falstad.VecDemoFrame"].rk_k1;
var c = this.b$["com.falstad.VecDemoFrame"].rk_k2;
var d = this.getCylRadius () + .001;
var e;
var f;
for (e = 0; e != 80; e++) for (f = 0; f != 80; f++) this.b$["com.falstad.VecDemoFrame"].grid[e][f].div = 0;


this.b$["com.falstad.VecDemoFrame"].grid[this.b$["com.falstad.VecDemoFrame"].doubleToGrid (this.getPointPos ())][this.b$["com.falstad.VecDemoFrame"].doubleToGrid (0)].div = -this.b$["com.falstad.VecDemoFrame"].reverse;
for (a = 0; a != 200; a++) {
var g = 2 * 3.141592653589793 * a / 200.;
var h = java.lang.Math.cos (g);
var i = java.lang.Math.sin (g);
b[0] = h * d + this.getCylPos ();
b[1] = i * d;
b[2] = 0;
this.b$["com.falstad.VecDemoFrame"].curfunc.getField (c, b);
this.b$["com.falstad.VecDemoFrame"].grid[this.b$["com.falstad.VecDemoFrame"].doubleToGrid (h * this.a + this.getCylPos ())][this.b$["com.falstad.VecDemoFrame"].doubleToGrid (i * this.a)].div += (h * c[0] + i * c[1]) * 60 * this.b$["com.falstad.VecDemoFrame"].reverse;
}
});
Clazz.defineMethod (c$, "getField", 
function (a, b) {
var c = b[0] - this.spos;
var d = com.falstad.VecDemoFrame.distanceXY (c, b[1]);
var e = 4000;
var f = b[0];
var g = b[1];
if (d < this.a) {
f = this.spos + this.a;
g = 0;
c = d = this.a;
this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
}var h = f - this.imagePos;
var i = com.falstad.VecDemoFrame.distanceXY (h, g);
var j = f - this.getPointPos ();
var k = com.falstad.VecDemoFrame.distanceXY (j, g);
var l = .001;
if (k < l) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var m = this.cq / (d * d);
var n = -this.q / (i * i);
var o = this.q / (k * k);
a[0] = c * m + h * n + j * o;
a[1] = g * (m + n + o);
a[2] = 4000 * (-this.pot0 - this.cq * java.lang.Math.log (d) + this.q * java.lang.Math.log (i + 1e-20) - this.q * java.lang.Math.log (k + 1e-20));
if (d == this.a) a[0] = a[1] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.CylinderInField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$CylinderInField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.conducting = false;
this.showD = false;
this.a = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "CylinderInField", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.CylinderInField, []);
this.conducting = true;
this.showD = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "cylinder in field";
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.a = this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () / 100.;
});
Clazz.defineMethod (c$, "getField", 
function (a, b) {
var c = this.a * this.a;
var d = com.falstad.VecDemoFrame.distanceXY (b[0], b[1]);
var e = this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 10. + 1;
var f = (this.conducting) ? 1 : (e - 1) / (e + 1);
var g = .0006;
var h = 3;
if (d < this.a) {
a[0] = a[1] = a[2] = 0;
if (this.conducting) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
 else a[0] = (this.showD) ? e * g * (1 - f) : g * (1 - f);
a[2] = -3.0 * (1 - f) * b[0];
return;
}var i = b[0] / d;
var j = b[1] / d;
var k = 1 / (d * d);
var l = (1 + f * c * k) * i * g;
var m = -(1 - f * c * k) * j * g;
l /= d;
a[0] = b[0] * l - m * j;
a[1] = b[1] * l + m * i;
a[2] = -3.0 * (1 - f * c * k) * b[0];
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Cylinder Size", 40);
});
Clazz.overrideMethod (c$, "calcDivergence", 
function () {
var a;
var b = this.b$["com.falstad.VecDemoFrame"].rk_k1;
var c = this.b$["com.falstad.VecDemoFrame"].rk_k2;
var d = this.a + .001;
var e;
var f;
for (e = 0; e != 80; e++) for (f = 0; f != 80; f++) this.b$["com.falstad.VecDemoFrame"].grid[e][f].div = 0;


for (a = 0; a != 200; a++) {
var g = 2 * 3.141592653589793 * a / 200.;
var h = java.lang.Math.cos (g);
var i = java.lang.Math.sin (g);
b[0] = h * d;
b[1] = i * d;
b[2] = 0;
this.b$["com.falstad.VecDemoFrame"].curfunc.getField (c, b);
var j = c[0];
var k = c[1];
var l = this.a - .001;
b[0] = h * l;
b[1] = i * l;
b[2] = 0;
this.b$["com.falstad.VecDemoFrame"].curfunc.getField (c, b);
this.b$["com.falstad.VecDemoFrame"].grid[this.b$["com.falstad.VecDemoFrame"].doubleToGrid (h * this.a)][this.b$["com.falstad.VecDemoFrame"].doubleToGrid (i * this.a)].div += (h * (j - c[0]) + i * (k - c[1])) * 4e2 * this.b$["com.falstad.VecDemoFrame"].reverse;
}
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.DielectricCylinderInFieldE, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$DielectricCylinderInFieldE$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "DielectricCylinderInFieldE", com.falstad.VecDemoFrame.CylinderInField, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.CylinderInField, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.DielectricCylinderInFieldE, []);
this.conducting = false;
this.showD = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dielec cyl in field";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Cylinder Size", 40);
this.b$["com.falstad.VecDemoFrame"].setupBar (1, "Dielectric Strength", 60);
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.SlottedPlane, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$SlottedPlane$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.z = null;
this.z2 = null;
this.z3 = null;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "SlottedPlane", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "slotted conducting plane";
});
Clazz.overrideMethod (c$, "getDivOffset", 
function () {
return -17.3;
});
Clazz.overrideMethod (c$, "getDivRange", 
function () {
return 2.5;
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.SlottedPlane, []);
this.z =  new com.falstad.Complex ();
this.z2 =  new com.falstad.Complex ();
this.z3 =  new com.falstad.Complex ();
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () + 1) / 101.;
this.z.setReIm (b[0], b[1]);
if (b[1] >= -0.01 && b[1] <= .01 && (b[0] < -c || b[0] > c)) {
this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
if (this.z.im == 0) this.z.im = -1.0E-8;
}this.z2.set (this.z);
this.z2.square ();
this.z2.addRe (-c * c);
this.z3.set (this.z2);
this.z3.pow (.5);
if (this.z3.im < 0) this.z3.multRe (-1);
this.z3.addReIm (this.z.re, this.z.im);
a[2] = this.z3.im * 2;
this.z2.pow (-0.5);
if (this.z2.im > 0) this.z2.multRe (-1);
this.z2.mult (this.z);
a[1] = -(1 + this.z2.re) * .003;
a[0] = -(this.z2.im) * .003;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Slot Size", 30);
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.PlanePair, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$PlanePair$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "PlanePair", com.falstad.VecDemoFrame.ConductingPlate, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ConductingPlate, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting planes w/ gap";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.PlanePair);
this.plate = false;
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Gap Size", 20);
});
Clazz.overrideMethod (c$, "getDivOffset", 
function () {
return -17;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return null;
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRotational$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRotational", com.falstad.VecDemoFrame.InverseRadial, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (null, "current line", "1/r rotational");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceXY (b[0], b[1]);
if (this.b$["com.falstad.VecDemoFrame"].showA) {
a[0] = a[1] = 0;
a[2] = -0.001 * (java.lang.Math.log (c) - .5);
} else {
if (c < 0.002) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
com.falstad.VecDemoFrame.rotateParticle (a, b, .0001 / (c * c));
}}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalPotential, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRotationalPotential$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRotationalPotential", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "1/r rotational potential";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceXY (b[0], b[1]);
com.falstad.VecDemoFrame.rotateParticle (a, b, .0001 / (c * c));
if (c < 0.002) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
 else if (b[0] >= 0 && b[1] < .001 && b[1] > -0.025) {
this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
if (b[1] == 0) a[1] = 1e8;
}var d = java.lang.Math.atan2 (b[1], b[0]);
if (d < 0) d += 6.283185307179586;
a[2] = (3.141592653589793 - d) * .3;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalDouble, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRotationalDouble$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.dir2 = 0;
this.ext = false;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRotationalDouble", com.falstad.VecDemoFrame.InverseRadialDouble, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadialDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.InverseRotationalDouble, []);
this.dir2 = 1;
this.ext = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (null, "current line double", "1/r rotational double");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].gridToDouble (40 + Clazz.doubleToInt (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () * 80 / 200));
var d = com.falstad.VecDemoFrame.distanceXY (b[0] - c, b[1]);
var e = com.falstad.VecDemoFrame.distanceXY (b[0] + c, b[1]);
if (this.ext) {
var f = this.b$["com.falstad.VecDemoFrame"].aux3Bar.getValue () * 3.141592653589793 / 50.;
var g = this.b$["com.falstad.VecDemoFrame"].aux2Bar.getValue () / 6.;
this.b$["com.falstad.VecDemoFrame"].getDirectionField (a, b, f);
a[0] *= g;
a[1] *= g;
a[2] *= g;
} else a[0] = a[1] = a[2] = 0;
if (this.b$["com.falstad.VecDemoFrame"].showA) {
if (this.dir2 == 1) a[2] += -0.001 * (java.lang.Math.log (d) + java.lang.Math.log (e) - 1);
 else a[2] += .001 * (java.lang.Math.log (d) - java.lang.Math.log (e));
} else {
if (d < 0.002) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
com.falstad.VecDemoFrame.rotateParticleAdd (a, b, .0001 / (d * d), c, 0);
if (e < 0.002) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
com.falstad.VecDemoFrame.rotateParticleAdd (a, b, this.dir2 * .0001 / (e * e), -c, 0);
}}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Line Separation", 30);
if (this.ext) {
this.b$["com.falstad.VecDemoFrame"].setupBar (1, "Ext. Strength", 7);
this.b$["com.falstad.VecDemoFrame"].setupBar (2, "Ext. Direction", 0);
}});
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalDoubleExt, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRotationalDoubleExt$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRotationalDoubleExt", com.falstad.VecDemoFrame.InverseRotationalDouble, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.InverseRotationalDoubleExt, []);
this.ext = true;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (null, "cur line double + ext", "1/r rot double + ext");
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalDipole, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRotationalDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRotationalDipole", com.falstad.VecDemoFrame.InverseRotationalDouble, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.InverseRotationalDipole, []);
this.dir2 = -1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (null, "current line dipole", "1/r rotational dipole");
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalDipoleExt, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseRotationalDipoleExt$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseRotationalDipoleExt", com.falstad.VecDemoFrame.InverseRotationalDouble, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRotationalDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.VecDemoFrame.InverseRotationalDipoleExt, []);
this.dir2 = -1;
this.ext = true;
});
Clazz.defineMethod (c$, "setup", 
function () {
Clazz.superCall (this, com.falstad.VecDemoFrame.InverseRotationalDipoleExt, "setup", []);
this.b$["com.falstad.VecDemoFrame"].aux2Bar.setValue (3);
this.b$["com.falstad.VecDemoFrame"].aux3Bar.setValue (25);
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (null, "cur line dipole + ext", "1/r rot dipole + ext");
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.OneDirectionFunction, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$OneDirectionFunction$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "OneDirectionFunction", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (null, "uniform field", "one direction");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () * 3.141592653589793 / 50.;
this.b$["com.falstad.VecDemoFrame"].getDirectionField (a, b, c);
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Theta", 0);
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.VecDemoFrame.BUILD_CASE_EMV (null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.MovingChargeField, this, null), Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadialSphere, this, null));
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$MovingChargeField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "MovingChargeField", com.falstad.VecDemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "moving charge";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceArray (b);
if (this.b$["com.falstad.VecDemoFrame"].showA) {
a[0] = a[1] = 0;
a[2] = .0003 / c;
} else {
var d = com.falstad.VecDemoFrame.distanceXY (b[0], b[1]);
if (c < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
com.falstad.VecDemoFrame.rotateParticle (a, b, .0001 / (c * c * c));
}}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return null;
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseSquaredRadialSphere$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseSquaredRadialSphere", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "1/r^2 sphere";
});
Clazz.defineMethod (c$, "getSize", 
function () {
return (this.b$["com.falstad.VecDemoFrame"].aux1Bar.getValue () + 1) / 110.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceArray (b);
if (c < .01) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var d = this.getSize ();
a[2] = .2 * ((c > d) ? -1 / c : -3 / (2 * d) + c * c / (2 * d * d * d));
if (c < d) c = d;
var e = .0003 / (c * c * c);
a[0] = -b[0] * e;
a[1] = -b[1] * e;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].setupBar (0, "Sphere Size", 30);
});
Clazz.overrideMethod (c$, "checkBoundsWithForce", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ConstRadial, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$ConstRadial$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "ConstRadial", com.falstad.VecDemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "const radial";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceArray (b);
if (c < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var d = .0006 / c;
a[0] = -d * b[0];
a[1] = -d * b[1];
a[2] = c;
}, "~A,~A");
Clazz.overrideMethod (c$, "checkBoundsWithForce", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.LinearRadial, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$LinearRadial$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "LinearRadial", com.falstad.VecDemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "linear radial";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceArray (b);
if (c < 0.001) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var d = .0009;
a[0] = -b[0] * d;
a[1] = -b[1] * d;
a[2] = c * c - 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "checkBoundsWithForce", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseToYAxis, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseToYAxis$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseToYAxis", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "inverse to y axis";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
if (b[0] > -0.01 && b[0] < .01) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
var c = .0003;
var d = b[0];
if (d == 0) d = .00001;
a[0] = -c / d;
a[1] = 0;
a[2] = -0.01 / (d * d);
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext",
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseSquareRotational, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$InverseSquareRotational$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "InverseSquareRotational", com.falstad.VecDemoFrame.InverseRadial, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.InverseRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName",
function () {
return "1/r^2 rotational";
});
Clazz.overrideMethod (c$, "getField",
function (a, b) {
var c = com.falstad.VecDemoFrame.distanceXY (b[0], b[1]);
if (c < 0.002) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
com.falstad.VecDemoFrame.rotateParticle (a, b, .0001 / (c * c * c));
}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient",
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.PendulumPotential, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$PendulumPotential$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "PendulumPotential", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "pendulum potential";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .0006;
var d = b[0] * 3.1;
var e = b[1] * 3.1;
var f = java.lang.Math.cos (d);
var g = java.lang.Math.cos (e);
var h = java.lang.Math.sin (d);
var i = java.lang.Math.sin (e);
a[0] = -c * h * g;
a[1] = -c * f * i;
a[2] = -f * g * .5;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.UserDefinedPotential, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$UserDefinedPotential$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.expr = null;
this.y0 = null;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "UserDefinedPotential", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "user-defined potential";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.VecDemoFrame"].textFields[0].setText ("x*x");
this.b$["com.falstad.VecDemoFrame"].textFields[0].show ();
this.b$["com.falstad.VecDemoFrame"].textFieldLabel.setText ("Potential Function");
this.b$["com.falstad.VecDemoFrame"].textFieldLabel.show ();
this.actionPerformed ();
this.y0 =  Clazz.newDoubleArray (3, 0);
});
Clazz.overrideMethod (c$, "actionPerformed", 
function () {
this.b$["com.falstad.VecDemoFrame"].parseError = false;
var a = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ExprParser, this, null, this.b$["com.falstad.VecDemoFrame"].textFields[0].getText ());
this.expr = a.parseExpression ();
if (a.gotError ()) this.b$["com.falstad.VecDemoFrame"].parseError = true;
this.b$["com.falstad.VecDemoFrame"].$functionChanged = true;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .00001;
var d;
for (d = 0; d != 3; d++) this.y0[d] = b[d];

var e = - this.expr.eval (this.y0);
this.y0[0] += c;
a[0] = e + this.expr.eval (this.y0);
this.y0[0] = b[0];
this.y0[1] += c;
a[1] = e + this.expr.eval (this.y0);
this.y0[1] = b[1];
a[2] = e * .01;
for (d = 0; d != 2; d++) if (!(a[d] > -10 && a[d] < 10)) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;

}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.UserDefinedFunction, this, null);
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$UserDefinedFunction$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.exprs = null;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "UserDefinedFunction", com.falstad.VecDemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.VecDemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "user-defined field";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.exprs =  new Array (3);
this.b$["com.falstad.VecDemoFrame"].textFields[0].setText ("x");
this.b$["com.falstad.VecDemoFrame"].textFields[1].setText ("y");
this.b$["com.falstad.VecDemoFrame"].textFieldLabel.setText ("Field Functions");
this.b$["com.falstad.VecDemoFrame"].textFieldLabel.show ();
var a;
for (a = 0; a != 2; a++) this.b$["com.falstad.VecDemoFrame"].textFields[a].show ();

this.actionPerformed ();
});
Clazz.overrideMethod (c$, "actionPerformed", 
function () {
var a;
this.b$["com.falstad.VecDemoFrame"].parseError = false;
for (a = 0; a != 2; a++) {
var b = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.ExprParser, this, null, this.b$["com.falstad.VecDemoFrame"].textFields[a].getText ());
this.exprs[a] = b.parseExpression ();
if (b.gotError ()) this.b$["com.falstad.VecDemoFrame"].parseError = true;
}
this.b$["com.falstad.VecDemoFrame"].$functionChanged = true;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .0002;
var d;
for (d = 0; d != 2; d++) {
a[d] = c * this.exprs[d].eval (b);
if (!(a[d] > -10 && a[d] < 10)) this.b$["com.falstad.VecDemoFrame"].boundCheck = true;
}
a[2] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return null;
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$DrawData$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.g = null;
this.mult = 0;
this.field = null;
this.vv = null;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "DrawData");
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$Particle$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.pos = null;
this.vel = null;
this.lifetime = 0;
this.phi = 0;
this.theta = 0;
this.phiv = 0;
this.thetav = 0;
this.stepsize = 0;
this.color = null;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "Particle");
Clazz.makeConstructor (c$, 
function () {
this.pos =  Clazz.newDoubleArray (3, 0);
this.vel =  Clazz.newDoubleArray (3, 0);
this.stepsize = 1;
});
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$FieldVector$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.sx1 = 0;
this.sy1 = 0;
this.sx2 = 0;
this.sy2 = 0;
this.p1 = null;
this.p2 = null;
this.col = 0;
this.viewPri = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "FieldVector");
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$GridElement$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.height = 0;
this.div = 0;
this.curl = 0;
this.normdot = 0;
this.vecX = 0;
this.vecY = 0;
this.visible = false;
this.valid = false;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "GridElement");
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$ExprState$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.x = 0;
this.y = 0;
this.z = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "ExprState");
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$Expr$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.left = null;
this.right = null;
this.value = 0;
this.type = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "Expr");
Clazz.makeConstructor (c$, 
function (a, b, c) {
this.left = a;
this.right = b;
this.type = c;
}, "com.falstad.VecDemoFrame.Expr,com.falstad.VecDemoFrame.Expr,~N");
Clazz.makeConstructor (c$, 
function (a, b) {
this.type = a;
this.value = b;
}, "~N,~N");
Clazz.makeConstructor (c$, 
function (a) {
this.type = a;
}, "~N");
Clazz.defineMethod (c$, "eval", 
function (a) {
switch (this.type) {
case 1:
return this.left.eval (a) + this.right.eval (a);
case 2:
return this.left.eval (a) - this.right.eval (a);
case 7:
return this.left.eval (a) * this.right.eval (a);
case 8:
return this.left.eval (a) / this.right.eval (a);
case 9:
return java.lang.Math.pow (this.left.eval (a), this.right.eval (a));
case 10:
return -this.left.eval (a);
case 6:
return this.value;
case 3:
return a[0] * 10;
case 4:
return a[1] * 10;
case 18:
return java.lang.Math.sqrt (a[0] * a[0] + a[1] * a[1]) * 10;
case 11:
return java.lang.Math.sin (this.left.eval (a));
case 12:
return java.lang.Math.cos (this.left.eval (a));
case 13:
return java.lang.Math.abs (this.left.eval (a));
case 14:
return java.lang.Math.exp (this.left.eval (a));
case 15:
return java.lang.Math.log (this.left.eval (a));
case 16:
return java.lang.Math.sqrt (this.left.eval (a));
case 17:
return java.lang.Math.tan (this.left.eval (a));
default:
System.out.print ("unknown\n");
}
return 0;
}, "~A");
Clazz.defineStatics (c$,
"E_ADD", 1,
"E_SUB", 2,
"E_X", 3,
"E_Y", 4,
"E_Z", 5,
"E_VAL", 6,
"E_MUL", 7,
"E_DIV", 8,
"E_POW", 9,
"E_UMINUS", 10,
"E_SIN", 11,
"E_COS", 12,
"E_ABS", 13,
"E_EXP", 14,
"E_LOG", 15,
"E_SQRT", 16,
"E_TAN", 17,
"E_R", 18);
c$ = Clazz.p0p ();
};
c$.$VecDemoFrame$ExprParser$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.text = null;
this.token = null;
this.pos = 0;
this.tlen = 0;
this.err = false;
Clazz.instantialize (this, arguments);
}, com.falstad.VecDemoFrame, "ExprParser");
Clazz.defineMethod (c$, "getToken", 
function () {
while (this.pos < this.tlen && this.text.charAt (this.pos) == ' ') this.pos++;

if (this.pos == this.tlen) {
this.token = "";
return;
}var a = this.pos;
var b = this.text.charCodeAt (a);
if ((b >= 48 && b <= 57) || b == 46) {
for (a = this.pos; a != this.tlen; a++) {
if (!((this.text.charAt (a) >= '0' && this.text.charAt (a) <= '9') || this.text.charAt (a) == '.')) break;
}
} else if (b >= 97 && b <= 122) {
for (a = this.pos; a != this.tlen; a++) {
if (!(this.text.charAt (a) >= 'a' && this.text.charAt (a) <= 'z')) break;
}
} else {
a++;
}this.token = this.text.substring (this.pos, a);
this.pos = a;
});
Clazz.defineMethod (c$, "skip", 
function (a) {
if (this.token.compareTo (a) != 0) return false;
this.getToken ();
return true;
}, "~S");
Clazz.defineMethod (c$, "skipOrError", 
function (a) {
if (!this.skip (a)) this.err = true;
}, "~S");
Clazz.defineMethod (c$, "parseExpression", 
function () {
if (this.token.length == 0) return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 6, 0.);
var a = this.parse ();
if (this.token.length > 0) this.err = true;
return a;
});
Clazz.defineMethod (c$, "parse", 
function () {
var a = this.parseMult ();
while (true) {
if (this.skip ("+")) a = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, a, this.parseMult (), 1);
 else if (this.skip ("-")) a = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, a, this.parseMult (), 2);
 else break;
}
return a;
});
Clazz.defineMethod (c$, "parseMult", 
function () {
var a = this.parseUminus ();
while (true) {
if (this.skip ("*")) a = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, a, this.parseUminus (), 7);
 else if (this.skip ("/")) a = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, a, this.parseUminus (), 8);
 else break;
}
return a;
});
Clazz.defineMethod (c$, "parseUminus", 
function () {
this.skip ("+");
if (this.skip ("-")) return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, this.parsePow (), null, 10);
return this.parsePow ();
});
Clazz.defineMethod (c$, "parsePow", 
function () {
var a = this.parseTerm ();
while (true) {
if (this.skip ("^")) a = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, a, this.parseTerm (), 9);
 else break;
}
return a;
});
Clazz.defineMethod (c$, "parseFunc", 
function (a) {
this.skipOrError ("(");
var b = this.parse ();
this.skipOrError (")");
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, b, null, a);
}, "~N");
Clazz.defineMethod (c$, "parseTerm", 
function () {
if (this.skip ("(")) {
var a = this.parse ();
this.skipOrError (")");
return a;
}if (this.skip ("x")) return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 3);
if (this.skip ("y")) return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 4);
if (this.skip ("r")) return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 18);
if (this.skip ("pi")) return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 6, 3.14159265358979323846);
if (this.skip ("e")) return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 6, 2.7182818284590452354);
if (this.skip ("sin")) return this.parseFunc (11);
if (this.skip ("cos")) return this.parseFunc (12);
if (this.skip ("abs")) return this.parseFunc (13);
if (this.skip ("exp")) return this.parseFunc (14);
if (this.skip ("log")) return this.parseFunc (15);
if (this.skip ("sqrt")) return this.parseFunc (16);
if (this.skip ("tan")) return this.parseFunc (17);
try {
var a = Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 6, Double.$valueOf (this.token).doubleValue ());
this.getToken ();
return a;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.err = true;
System.out.print ("unrecognized token: " + this.token + "\n");
return Clazz.innerTypeInstance (com.falstad.VecDemoFrame.Expr, this, null, 6, 0);
} else {
throw e;
}
}
});
Clazz.makeConstructor (c$, 
function (a) {
this.text = a;
this.tlen = this.text.length;
this.pos = 0;
this.err = false;
this.getToken ();
}, "~S");
Clazz.defineMethod (c$, "gotError", 
function () {
return this.err;
});
c$ = Clazz.p0p ();
};
Clazz.defineStatics (c$,
"pi", 3.14159265358979323846,
"DISP_PART_VELOC", 0,
"DISP_PART_FORCE", 1,
"DISP_VECTORS", 2,
"DISP_NONE", 3,
"DISP_CURLERS", 4,
"gridsize", 80,
"densitygridsize", 16,
"densitygroupsize", 0.125,
"maxParticleCount", 2500,
"MOT_VELOCITY", 0,
"MOT_FORCE", 1,
"MOT_CURLERS", 2,
"MOT_EQUIPOTENTIAL", 3,
"FC_FIELD", 0,
"FC_POTENTIAL", 1,
"FC_NONE", 2,
"FC_DIV", 3,
"FC_CURL", 4,
"FL_NONE", 0,
"FL_GRID", 1,
"FL_EQUIP", 2,
"FL_LINES", 3,
"MODE_VIEW_ROTATE", 0,
"MODE_VIEW_ZOOM", 1,
"MODE_LINE_INT", 2,
"MODE_SURF_INT", 3,
"BUILD_E", false,
"BUILD_V", true,
"root2", 1.4142135623730950488016887242096981,
"frames", 0,
"framerate", 0,
"firsttime", 0);
});
