Clazz.declarePackage ("com.falstad");
Clazz.load (["java.awt.LayoutManager", "java.awt.event.ActionListener", "$.AdjustmentListener", "$.ComponentListener", "$.ItemListener", "$.MouseListener", "$.MouseMotionListener", "swingjs.awt.Applet", "$.Canvas", "$.Frame", "java.awt.Color"], ["com.falstad.Vec3DemoCanvas", "$.Vec3DemoFrame", "$.Vec3DemoLayout", "$.Vec3Demo"], ["com.falstad.Complex", "java.awt.Dimension", "$.Rectangle", "java.lang.Double", "java.net.URL", "java.util.Random", "$.Vector", "swingjs.awt.Button", "$.Checkbox", "$.Choice", "$.Label", "$.Scrollbar", "$.TextField"], function () {
c$ = Clazz.decorateAsClass (function () {
this.pg = null;
Clazz.instantialize (this, arguments);
}, com.falstad, "Vec3DemoCanvas", swingjs.awt.Canvas);
Clazz.makeConstructor (c$, 
function (p) {
Clazz.superConstructor (this, com.falstad.Vec3DemoCanvas, []);
this.pg = p;
}, "com.falstad.Vec3DemoFrame");
Clazz.overrideMethod (c$, "getPreferredSize", 
function () {
return  new java.awt.Dimension (300, 400);
});
Clazz.overrideMethod (c$, "update", 
function (g) {
this.pg.updateVec3Demo (g);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "paintComponent", 
function (g) {
Clazz.superCall (this, com.falstad.Vec3DemoCanvas, "paintComponent", [g]);
this.pg.updateVec3Demo (g);
}, "java.awt.Graphics");
c$ = Clazz.declareType (com.falstad, "Vec3DemoLayout", null, java.awt.LayoutManager);
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
if (Clazz.instanceOf (m, swingjs.awt.Scrollbar) || Clazz.instanceOf (m, swingjs.awt.TextField)) d.width = barwidth;
if (Clazz.instanceOf (m, swingjs.awt.Choice) && d.width > barwidth) d.width = barwidth;
if (Clazz.instanceOf (m, swingjs.awt.Label)) {
h += Clazz.doubleToInt (d.height / 5);
d.width = barwidth;
}m.move (cw, h);
m.resize (d.width, d.height);
h += d.height;
}}
}, "java.awt.Container");
c$ = Clazz.decorateAsClass (function () {
this.started = false;
Clazz.instantialize (this, arguments);
}, com.falstad, "Vec3Demo", swingjs.awt.Applet, java.awt.event.ComponentListener);
Clazz.defineMethod (c$, "destroyFrame", 
function () {
if (com.falstad.Vec3Demo.ogf != null) com.falstad.Vec3Demo.ogf.dispose ();
com.falstad.Vec3Demo.ogf = null;
this.repaint ();
});
Clazz.overrideMethod (c$, "init", 
function () {
this.addComponentListener (this);
});
c$.main = Clazz.defineMethod (c$, "main", 
function (args) {
var demo =  new com.falstad.Vec3Demo ();
demo.showFrame ();
}, "~A");
Clazz.defineMethod (c$, "showFrame", 
function () {
if (com.falstad.Vec3Demo.ogf == null) {
this.started = true;
com.falstad.Vec3Demo.ogf =  new com.falstad.Vec3DemoFrame (this);
com.falstad.Vec3Demo.ogf.initFrame ();
this.repaint ();
}});
Clazz.defineMethod (c$, "paint", 
function (g) {
Clazz.superCall (this, com.falstad.Vec3Demo, "paint", [g]);
var s = "Applet is open in a separate window.";
if (!this.started) s = "Applet is starting.";
 else if (com.falstad.Vec3Demo.ogf == null) s = "Applet is finished.";
 else if (com.falstad.Vec3Demo.ogf.useFrame) com.falstad.Vec3Demo.ogf.triggerShow ();
if (com.falstad.Vec3Demo.ogf == null || com.falstad.Vec3Demo.ogf.useFrame) g.drawString (s, 10, 30);
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
if (com.falstad.Vec3Demo.ogf != null) com.falstad.Vec3Demo.ogf.dispose ();
com.falstad.Vec3Demo.ogf = null;
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
this.sliceChooser = null;
this.partCountLabel = null;
this.textFieldLabel = null;
this.strengthLabel = null;
this.partCountBar = null;
this.strengthBar = null;
this.aux1Bar = null;
this.aux2Bar = null;
this.aux3Bar = null;
this.fieldStrength = 0;
this.partMult = 0;
this.darkYellow = null;
this.lineWidth = .01;
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.AuxBar")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$AuxBar$ ();
}
this.auxBars = null;
this.vecDensityLabel = null;
this.vecDensityBar = null;
this.potentialLabel = null;
this.potentialBar = null;
this.lineDensityLabel = null;
this.lineDensityBar = null;
this.modeChooser = null;
this.textFields = null;
this.reverse = 0;
this.xpoints = null;
this.ypoints = null;
this.slicerPoints = null;
this.sliceFaces = null;
this.sliceFace = null;
this.particles = null;
this.vectors = null;
this.vecCount = 0;
this.density = null;
this.sliceval = 0;
this.rotmatrix = null;
this.cameraPos = null;
this.intersection = null;
this.intersectionDistance = 0;
this.vectorSpacing = 16;
this.currentStep = 0;
this.selectedSlice = false;
this.$mouseDown = false;
this.getPot = false;
this.showA = false;
this.parseError = false;
this.fieldColors = null;
this.equipColors = null;
this.zoom = 3;
this.dragging = false;
this.oldDragX = 0;
this.oldDragY = 0;
this.dragX = 0;
this.dragY = 0;
this.dragStartX = 0;
this.dragStartY = 0;
this.dragZoomStart = 0;
this.lastXRot = 0;
this.lastYRot = 0;
this.functionList = null;
this.curfunc = null;
this.pause = 20;
this.useFrame = false;
this.finished = false;
this.shown = false;
this.scalex = 0;
this.scaley = 0;
this.lastTime = 0;
this.timeStep = 0;
this.potfield = null;
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.EquipPoint")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$EquipPoint$ ();
}
this.wooft = 0;
this.rediscount = 0;
this.ignoreChanges = false;
this.mstates = null;
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.MagnetState")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$MagnetState$ ();
}
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
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.VecFunction")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$VecFunction$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseSquaredRadial")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseSquaredRadial$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseSquaredRadialDouble")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseSquaredRadialDouble$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseSquaredRadialDipole")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseSquaredRadialDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseSquaredRadialQuad")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseSquaredRadialQuad$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRadial")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRadial$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRadialDouble")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRadialDouble$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRadialDipole")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRadialDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRadialQuad")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRadialQuad$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.FiniteChargedLine")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$FiniteChargedLine$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.FiniteChargedLinePair")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$FiniteChargedLinePair$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.FiniteChargedLineDipole")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$FiniteChargedLineDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ConductingPlate")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ConductingPlate$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ChargedPlate")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ChargedPlate$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ChargedPlatePair")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ChargedPlatePair$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InfiniteChargedPlane")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InfiniteChargedPlane$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.SphereAndPointCharge")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$SphereAndPointCharge$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ChargedSphereAndPointCharge")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ChargedSphereAndPointCharge$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CylinderAndLineCharge")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CylinderAndLineCharge$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.SphereInField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$SphereInField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.DielectricSphereInFieldE")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$DielectricSphereInFieldE$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.DielectricSphereInFieldD")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$DielectricSphereInFieldD$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CylinderInField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CylinderInField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.DielectricCylinderInFieldE")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$DielectricCylinderInFieldE$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.DielectricCylinderInFieldD")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$DielectricCylinderInFieldD$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.DielectricBoundaryE")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$DielectricBoundaryE$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.DielectricBoundaryD")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$DielectricBoundaryD$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ConductingPlane")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ConductingPlane$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.MovingChargeField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$MovingChargeField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.FastChargeEField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$FastChargeEField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.SlottedPlane")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$SlottedPlane$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.PlanePair")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$PlanePair$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRotational")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRotational$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRotationalDouble")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRotationalDouble$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRotationalDoubleExt")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRotationalDoubleExt$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRotationalDipole")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRotationalDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseRotationalDipoleExt")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseRotationalDipoleExt$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.OneDirectionFunction")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$OneDirectionFunction$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.FastChargeField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$FastChargeField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.MovingChargeFieldDouble")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$MovingChargeFieldDouble$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.MovingChargeDipole")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$MovingChargeDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CurrentLoopField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CurrentLoopField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CurrentLoopsSideField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CurrentLoopsSideField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CurrentLoopsSideOppField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CurrentLoopsSideOppField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CurrentLoopsStackedField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CurrentLoopsStackedField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CurrentLoopsStackedOppField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CurrentLoopsStackedOppField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CurrentLoopsOpposingConcentric")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CurrentLoopsOpposingConcentric$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ChargedRing")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ChargedRing$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ChargedRingPair")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ChargedRingPair$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ChargedRingDipole")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ChargedRingDipole$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.SolenoidField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$SolenoidField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ToroidalSolenoidField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ToroidalSolenoidField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.HorseshoeElectromagnetField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$HorseshoeElectromagnetField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.SquareLoopField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$SquareLoopField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.RectLoopField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$RectLoopField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.CornerField")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$CornerField$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.MagneticSphereB")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$MagneticSphereB$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.MonopoleAttempt")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$MonopoleAttempt$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseSquaredRadialSphere")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseSquaredRadialSphere$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.InverseSquareRotational")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$InverseSquareRotational$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.LinearRotational")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$LinearRotational$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.Helical")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$Helical$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.RosslerAttractor")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$RosslerAttractor$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.LorenzAttractor")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$LorenzAttractor$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.UserDefinedPotential")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$UserDefinedPotential$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.UserDefinedFunction")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$UserDefinedFunction$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.DrawData")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$DrawData$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.Particle")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$Particle$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.FieldVector")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$FieldVector$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ExprState")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ExprState$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.Expr")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$Expr$ ();
}
if (!Clazz.isClassDefined ("com.falstad.Vec3DemoFrame.ExprParser")) {
com.falstad.Vec3DemoFrame.$Vec3DemoFrame$ExprParser$ ();
}
Clazz.instantialize (this, arguments);
}, com.falstad, "Vec3DemoFrame", swingjs.awt.Frame, [java.awt.event.ComponentListener, java.awt.event.ActionListener, java.awt.event.AdjustmentListener, java.awt.event.MouseMotionListener, java.awt.event.MouseListener, java.awt.event.ItemListener]);
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
return "Vec3Demo by Paul Falstad";
});
Clazz.defineMethod (c$, "getrand", 
function (x) {
var q = this.random.nextInt ();
if (q < 0) q = -q;
return q % x;
}, "~N");
c$.BUILD_CASE_EMV = Clazz.defineMethod (c$, "BUILD_CASE_EMV", 
function (e, m, v) {
return com.falstad.Vec3DemoFrame.BUILD_V ? v : com.falstad.Vec3DemoFrame.BUILD_E ? e : m;
}, "~S,~S,~S");
c$.BUILD_CASE_EMV = Clazz.defineMethod (c$, "BUILD_CASE_EMV", 
function (e, m, v) {
return com.falstad.Vec3DemoFrame.BUILD_V ? v : com.falstad.Vec3DemoFrame.BUILD_E ? e : m;
}, "com.falstad.Vec3DemoFrame.VecFunction,com.falstad.Vec3DemoFrame.VecFunction,com.falstad.Vec3DemoFrame.VecFunction");
Clazz.makeConstructor (c$, 
function (a) {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame, ["3-D Vector Fields Applet v1.3c"]);
this.applet = a;
}, "com.falstad.Vec3Demo");
Clazz.defineMethod (c$, "initFrame", 
function () {
try {
var param = this.applet.getParameter ("useFrame");
if (param != null && param.equalsIgnoreCase ("true")) this.useFrame = true;
param = this.applet.getParameter ("PAUSE");
if (param != null) this.pause = Integer.parseInt (param);
param = this.applet.getParameter ("mode");
if (param != null && param.equalsIgnoreCase ("electric")) {
com.falstad.Vec3DemoFrame.BUILD_E = true;
com.falstad.Vec3DemoFrame.BUILD_V = false;
com.falstad.Vec3DemoFrame.BUILD_M = false;
}if (param != null && param.equalsIgnoreCase ("magnetic")) {
com.falstad.Vec3DemoFrame.BUILD_M = true;
com.falstad.Vec3DemoFrame.BUILD_V = false;
com.falstad.Vec3DemoFrame.BUILD_E = false;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
var main;
if (this.useFrame) main = this;
 else main = this.applet;
if (!com.falstad.Vec3DemoFrame.BUILD_M) {
com.falstad.Vec3DemoFrame.DISP_PART_VELOC = 0;
com.falstad.Vec3DemoFrame.DISP_PART_FORCE = 1;
com.falstad.Vec3DemoFrame.DISP_VECTORS = 2;
com.falstad.Vec3DemoFrame.DISP_LINES = 3;
com.falstad.Vec3DemoFrame.DISP_EQUIPS = 4;
com.falstad.Vec3DemoFrame.DISP_PART_VELOC_A = -1;
com.falstad.Vec3DemoFrame.DISP_VECTORS_A = -2;
com.falstad.Vec3DemoFrame.DISP_PART_MAG = -3;
com.falstad.Vec3DemoFrame.DISP_VIEW_PAPER = -4;
} else {
com.falstad.Vec3DemoFrame.DISP_PART_VELOC = 0;
com.falstad.Vec3DemoFrame.DISP_PART_VELOC_A = 1;
com.falstad.Vec3DemoFrame.DISP_VECTORS = 2;
com.falstad.Vec3DemoFrame.DISP_VECTORS_A = 3;
com.falstad.Vec3DemoFrame.DISP_LINES = 4;
com.falstad.Vec3DemoFrame.DISP_PART_MAG = 5;
com.falstad.Vec3DemoFrame.DISP_VIEW_PAPER = 6;
com.falstad.Vec3DemoFrame.DISP_EQUIPS = -1;
com.falstad.Vec3DemoFrame.DISP_PART_FORCE = -4;
}this.functionList =  new java.util.Vector ();
var vf = com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadial, this, null), Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotational, this, null), Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadial, this, null));
while (vf != null) {
this.functionList.addElement (vf);
vf = vf.createNext ();
}
this.random =  new java.util.Random ();
this.particles =  new Array (5000);
var i;
for (i = 0; i != 5000; i++) this.particles[i] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Particle, this, null);

this.xpoints =  Clazz.newIntArray (4, 0);
this.ypoints =  Clazz.newIntArray (4, 0);
this.slicerPoints =  Clazz.newIntArray (2, 10, 0);
this.sliceFaces =  Clazz.newDoubleArray (4, 3, 0);
this.rotmatrix =  Clazz.newDoubleArray (9, 0);
this.setXYView ();
this.density =  Clazz.newIntArray (4, 4, 4, 0);
main.setLayout ( new com.falstad.Vec3DemoLayout ());
this.cv =  new com.falstad.Vec3DemoCanvas (this);
this.cv.addComponentListener (this);
this.cv.addMouseMotionListener (this);
this.cv.addMouseListener (this);
main.add (this.cv);
main.add ( new swingjs.awt.Label ("Field selection:"));
this.functionChooser =  new swingjs.awt.Choice ();
for (i = 0; i != this.functionList.size (); i++) this.functionChooser.add ((this.functionList.elementAt (i)).getName ());

main.add (this.functionChooser);
this.functionChooser.addItemListener (this);
this.dispChooser =  new swingjs.awt.Choice ();
this.dispChooser.addItemListener (this);
this.setupDispChooser (true);
main.add (this.dispChooser);
this.modeChooser =  new swingjs.awt.Choice ();
this.modeChooser.add ("Mouse = Adjust Angle");
this.modeChooser.add ("Mouse = Adjust Zoom");
this.modeChooser.addItemListener (this);
main.add (this.modeChooser);
this.sliceChooser =  new swingjs.awt.Choice ();
this.sliceChooser.add ("No Slicing");
this.sliceChooser.add ("Show X Slice");
this.sliceChooser.add ("Show Y Slice");
this.sliceChooser.add ("Show Z Slice");
this.sliceChooser.addItemListener (this);
main.add (this.sliceChooser);
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
if (com.falstad.Vec3DemoFrame.BUILD_M) {
this.add (this.kickButton);
this.kickButton.addActionListener (this);
this.kickButton.disable ();
}main.add (this.strengthLabel =  new swingjs.awt.Label ("Field Strength", 0));
main.add (this.strengthBar =  new swingjs.awt.Scrollbar (0, 10, 1, 0, 100));
this.strengthBar.addAdjustmentListener (this);
main.add (this.partCountLabel =  new swingjs.awt.Label ("Number of Particles", 0));
main.add (this.partCountBar =  new swingjs.awt.Scrollbar (0, 500, 1, 1, 5000));
this.partCountBar.addAdjustmentListener (this);
main.add (this.vecDensityLabel =  new swingjs.awt.Label ("Vector Density", 0));
main.add (this.vecDensityBar =  new swingjs.awt.Scrollbar (0, 16, 1, 2, 64));
this.vecDensityBar.addAdjustmentListener (this);
main.add (this.lineDensityLabel =  new swingjs.awt.Label (com.falstad.Vec3DemoFrame.BUILD_V ? "Streamline Density" : "Field Line Density", 0));
main.add (this.lineDensityBar =  new swingjs.awt.Scrollbar (0, 5, 1, 3, 16));
this.lineDensityBar.addAdjustmentListener (this);
main.add (this.potentialLabel =  new swingjs.awt.Label ("Potential", 0));
main.add (this.potentialBar =  new swingjs.awt.Scrollbar (0, 250, 1, 0, 1000));
this.potentialBar.addAdjustmentListener (this);
var lb;
this.auxBars =  new Array (3);
main.add (lb =  new swingjs.awt.Label ("Aux 1", 0));
main.add (this.aux1Bar =  new swingjs.awt.Scrollbar (0, 0, 1, 0, 100));
this.aux1Bar.addAdjustmentListener (this);
this.auxBars[0] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.AuxBar, this, null, lb, this.aux1Bar);
main.add (lb =  new swingjs.awt.Label ("Aux 2", 0));
main.add (this.aux2Bar =  new swingjs.awt.Scrollbar (0, 0, 1, 0, 100));
this.aux2Bar.addAdjustmentListener (this);
this.auxBars[1] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.AuxBar, this, null, lb, this.aux2Bar);
main.add (lb =  new swingjs.awt.Label ("Aux 3", 0));
main.add (this.aux3Bar =  new swingjs.awt.Scrollbar (0, 0, 1, 0, 100));
this.aux3Bar.addAdjustmentListener (this);
this.auxBars[2] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.AuxBar, this, null, lb, this.aux3Bar);
if (com.falstad.Vec3DemoFrame.BUILD_V) main.add (this.textFieldLabel =  new swingjs.awt.Label ("", 0));
this.textFields =  new Array (3);
for (i = 0; i != 3; i++) {
main.add (this.textFields[i] =  new swingjs.awt.TextField ());
this.textFields[i].addActionListener (this);
}
this.fieldColors =  new Array (513);
for (i = 0; i != 256; i++) {
var col = (-16777216) | (i << 8);
this.fieldColors[i] =  new java.awt.Color (col);
}
for (i = 0; i != 256; i++) {
var col = (-16777216) | (65280) | (i * (0x10001));
this.fieldColors[i + 256] =  new java.awt.Color (col);
}
this.fieldColors[512] = this.fieldColors[511];
this.equipColors =  new Array (513);
for (i = 0; i != 256; i++) {
var r = 255 - Clazz.doubleToInt (i / 2);
var gb = Clazz.doubleToInt (i / 2);
var col = (-16777216) | (r << 16) | (gb << 8) | gb;
this.equipColors[i] =  new java.awt.Color (col);
}
for (i = 0; i != 256; i++) {
var g = 128 + Clazz.doubleToInt (i / 2);
var rb = 128 - Clazz.doubleToInt (i / 2);
var col = (-16777216) | (rb << 16) | (g << 8) | rb;
this.equipColors[i + 256] =  new java.awt.Color (col);
}
this.equipColors[512] = this.equipColors[511];
main.add ( new swingjs.awt.Label ("Change parameters", 0));
this.intersection =  Clazz.newDoubleArray (3, 0);
this.reinit ();
this.cv.setBackground (java.awt.Color.black);
this.cv.setForeground (java.awt.Color.lightGray);
this.functionChanged ();
this.dispChooserChanged ();
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
this.finished = true;
});
Clazz.defineMethod (c$, "setViewMatrix", 
function (a, b) {
var i;
for (i = 0; i != 9; i++) this.rotmatrix[i] = 0;

this.rotmatrix[0] = this.rotmatrix[4] = this.rotmatrix[8] = 1;
this.rotate (a, b);
this.lastXRot = this.lastYRot = 0;
}, "~N,~N");
Clazz.defineMethod (c$, "setXYView", 
function () {
this.setViewMatrix (0, 0.28559933214452665);
});
Clazz.defineMethod (c$, "setXYViewExact", 
function () {
this.setViewMatrix (0, 0);
});
Clazz.defineMethod (c$, "setXZView", 
function () {
this.setViewMatrix (0, -1.2851969946503699);
});
Clazz.defineMethod (c$, "setXZViewExact", 
function () {
this.setViewMatrix (0, -1.5707963267948966);
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
});
Clazz.defineMethod (c$, "resetDensityGroups", 
function () {
var i;
var j;
var k;
for (i = 0; i != 4; i++) for (j = 0; j != 4; j++) for (k = 0; k != 4; k++) this.density[i][j][k] = 0;



var slice = this.sliceChooser.getSelectedIndex ();
var sliced = (slice > 0);
var pcount = this.getParticleCount ();
for (i = 0; i != pcount; i++) {
var p = this.particles[i];
if (sliced) p.pos[slice - 1] = this.sliceval;
this.addToDensityGroup (p);
}
for (; i != 5000; i++) {
var p = this.particles[i];
p.lifetime = -100;
}
});
Clazz.defineMethod (c$, "addToDensityGroup", 
function (p) {
var a = Clazz.doubleToInt ((p.pos[0] + 1) * (2));
var b = Clazz.doubleToInt ((p.pos[1] + 1) * (2));
var c = Clazz.doubleToInt ((p.pos[2] + 1) * (2));
var n = 0;
try {
n = ++this.density[a][b][c];
if (n > 5000) System.out.print (a + " " + b + " " + c + " " + this.density[a][b][c] + "\n");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.print (p.pos[0] + " " + p.pos[1] + " " + p.pos[2] + "\n");
e.printStackTrace ();
} else {
throw e;
}
}
return n;
}, "com.falstad.Vec3DemoFrame.Particle");
Clazz.defineMethod (c$, "removeFromDensityGroup", 
function (p) {
var a = Clazz.doubleToInt ((p.pos[0] + 1) * (2));
var b = Clazz.doubleToInt ((p.pos[1] + 1) * (2));
var c = Clazz.doubleToInt ((p.pos[2] + 1) * (2));
try {
if (--this.density[a][b][c] < 0) System.out.print (a + " " + b + " " + c + " " + this.density[a][b][c] + "\n");
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.print (p.pos[0] + " " + p.pos[1] + " " + p.pos[2] + "\n");
e.printStackTrace ();
} else {
throw e;
}
}
}, "com.falstad.Vec3DemoFrame.Particle");
Clazz.defineMethod (c$, "positionParticle", 
function (p) {
var x;
var y;
var z;
var bestx = 0;
var besty = 0;
var bestz = 0;
var best = 10000;
var randaddx = this.getrand (4);
var randaddy = this.getrand (4);
var randaddz = this.getrand (4);
for (x = 0; x != 4; x++) for (y = 0; y != 4; y++) for (z = 0; z != 4; z++) {
var ix = (randaddx + x) % 4;
var iy = (randaddy + y) % 4;
var iz = (randaddz + z) % 4;
if (this.density[ix][iy][iz] <= best) {
bestx = ix;
besty = iy;
bestz = iz;
best = this.density[ix][iy][iz];
}}


p.pos[0] = bestx * 0.5 + this.getrand (100) * 0.5 / 100.0 - 1;
p.pos[1] = besty * 0.5 + this.getrand (100) * 0.5 / 100.0 - 1;
p.pos[2] = bestz * 0.5 + this.getrand (100) * 0.5 / 100.0 - 1;
p.lifetime = this.curfunc.redistribute () ? 500 : 5000;
p.stepsize = 1;
p.theta = (this.getrand (101) - 50) * 3.141592653589793 / 50.;
p.phi = (this.getrand (101) - 50) * 3.141592653589793 / 50.;
var j;
for (j = 0; j != 3; j++) p.vel[j] = 0;

}, "com.falstad.Vec3DemoFrame.Particle");
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
for (j = 0; j != 3; j++) {
p.pos[j] = this.getrand (200) / 100.0 - 1;
p.vel[j] = 0;
}
p.lifetime = i * 2;
p.stepsize = 1;
}
this.resetDensityGroups ();
});
Clazz.defineMethod (c$, "kickParticles", 
function () {
var i;
var j;
for (i = 0; i != this.getParticleCount (); i++) {
var p = this.particles[i];
for (j = 0; j != 3; j++) p.vel[j] += (this.getrand (100) / 99.0 - .5) * .04;

}
});
Clazz.defineMethod (c$, "rotate", 
function (angle1, angle2) {
var r1cos = java.lang.Math.cos (angle1);
var r1sin = java.lang.Math.sin (angle1);
var r2cos = java.lang.Math.cos (angle2);
var r2sin = java.lang.Math.sin (angle2);
var rotm2 =  Clazz.newDoubleArray (9, 0);
rotm2[0] = r1cos;
rotm2[1] = -r1sin * r2sin;
rotm2[2] = r2cos * r1sin;
rotm2[3] = 0;
rotm2[4] = r2cos;
rotm2[5] = r2sin;
rotm2[6] = -r1sin;
rotm2[7] = -r1cos * r2sin;
rotm2[8] = r1cos * r2cos;
this.rotate (rotm2);
}, "~N,~N");
Clazz.defineMethod (c$, "rotate", 
function (rotm2) {
var rotm1 = this.rotmatrix;
this.rotmatrix =  Clazz.newDoubleArray (9, 0);
var i;
var j;
var k;
for (j = 0; j != 3; j++) for (i = 0; i != 3; i++) {
var v = 0;
for (k = 0; k != 3; k++) v += rotm1[k + j * 3] * rotm2[i + k * 3];

this.rotmatrix[i + j * 3] = v;
}

}, "~A");
Clazz.defineMethod (c$, "reinit", 
function () {
this.handleResize ();
this.resetParticles ();
});
Clazz.defineMethod (c$, "centerString", 
function (g, s, y) {
var fm = g.getFontMetrics ();
g.drawString (s, Clazz.doubleToInt ((this.winSize.width - fm.stringWidth (s)) / 2), y);
}, "java.awt.Graphics,~S,~N");
Clazz.defineMethod (c$, "map3d", 
function (x, y, z, xpoints, ypoints, pt) {
this.map3dView (x, y, z, xpoints, ypoints, pt, this.viewMain);
}, "~N,~N,~N,~A,~A,~N");
Clazz.defineMethod (c$, "map3dView", 
function (x, y, z, xpoints, ypoints, pt, view) {
var rotm = this.rotmatrix;
var realx = x * rotm[0] + y * rotm[3] + z * rotm[6];
var realy = x * rotm[1] + y * rotm[4] + z * rotm[7];
var realz = 5.0 - (x * rotm[2] + y * rotm[5] + z * rotm[8]);
var scalex = view.width * this.zoom / 2;
var scaley = view.height * this.zoom / 2;
var aratio = view.width / view.height;
if (aratio < 1) scaley *= aratio;
 else scalex /= aratio;
xpoints[pt] = view.x + Clazz.doubleToInt (view.width / 2) + Clazz.doubleToInt (scalex * realx / realz);
ypoints[pt] = view.y + Clazz.doubleToInt (view.height / 2) - Clazz.doubleToInt (scaley * realy / realz);
}, "~N,~N,~N,~A,~A,~N,java.awt.Rectangle");
Clazz.defineMethod (c$, "getScalingFactor", 
function (x, y, z) {
var rotm = this.rotmatrix;
var realz = 5.0 - (x * rotm[2] + y * rotm[5] + z * rotm[8]);
var scalex = this.winSize.width * this.zoom / 2;
var scaley = this.winSize.height * this.zoom / 2;
var aratio = this.winSize.width / this.winSize.height;
if (aratio < 1) scaley *= aratio;
 else scalex /= aratio;
return scalex / realz;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "unmap3d", 
function (x3, x, y, z, view) {
var scalex = view.width * this.zoom / 2;
var scaley = view.height * this.zoom / 2;
var aratio = view.width / view.height;
if (aratio < 1) scaley *= aratio;
 else scalex /= aratio;
var realz = 5.0 - z;
var realx = (x - (Clazz.doubleToInt (view.width / 2))) * realz / scalex;
var realy = -(y - (Clazz.doubleToInt (view.height / 2))) * realz / scaley;
var rotm = this.rotmatrix;
x3[0] = (realx * rotm[0] + realy * rotm[1] + z * rotm[2]);
x3[1] = (realx * rotm[3] + realy * rotm[4] + z * rotm[5]);
x3[2] = (realx * rotm[6] + realy * rotm[7] + z * rotm[8]);
}, "~A,~N,~N,~N,java.awt.Rectangle");
Clazz.defineMethod (c$, "unmap3d", 
function (x3, x, y, pn, pp, view) {
var scalex = view.width * this.zoom / 2;
var scaley = view.height * this.zoom / 2;
var aratio = view.width / view.height;
if (aratio < 1) scaley *= aratio;
 else scalex /= aratio;
var vx = (x - (Clazz.doubleToInt (view.width / 2))) / scalex;
var vy = -(y - (Clazz.doubleToInt (view.height / 2))) / scaley;
var rotm = this.rotmatrix;
var mvx = (vx * rotm[0] + vy * rotm[1] - rotm[2]);
var mvy = (vx * rotm[3] + vy * rotm[4] - rotm[5]);
var mvz = (vx * rotm[6] + vy * rotm[7] - rotm[8]);
var t = ((pp[0] - this.cameraPos[0]) * pn[0] + (pp[1] - this.cameraPos[1]) * pn[1] + (pp[2] - this.cameraPos[2]) * pn[2]) / (pn[0] * mvx + pn[1] * mvy + pn[2] * mvz);
x3[0] = this.cameraPos[0] + mvx * t;
x3[1] = this.cameraPos[1] + mvy * t;
x3[2] = this.cameraPos[2] + mvz * t;
}, "~A,~N,~N,~A,~A,java.awt.Rectangle");
Clazz.defineMethod (c$, "scaleworld", 
function () {
this.scalex = Clazz.doubleToInt (this.winSize.width / 2);
this.scaley = Clazz.doubleToInt (this.winSize.height / 2);
});
Clazz.defineMethod (c$, "updateVec3Demo", 
function (realg) {
if (this.winSize == null || this.winSize.width == 0) return;
var g = this.dbimage.getGraphics ();
if (this.xpoints == null) return;
g.setColor (this.cv.getBackground ());
g.fillRect (0, 0, this.winSize.width, this.winSize.height);
g.setColor (this.cv.getForeground ());
var allquiet = false;
this.curfunc.setupFrame ();
var disp = this.dispChooser.getSelectedIndex ();
this.timeStep = 1;
if (!this.stoppedCheck.getState ()) {
if (this.lastTime > 0) this.timeStep = (System.currentTimeMillis () - this.lastTime) * .03;
if (this.timeStep > 3) this.timeStep = 3;
this.lastTime = System.currentTimeMillis ();
if (disp != com.falstad.Vec3DemoFrame.DISP_VECTORS && disp != com.falstad.Vec3DemoFrame.DISP_VECTORS_A && disp != com.falstad.Vec3DemoFrame.DISP_LINES && disp != com.falstad.Vec3DemoFrame.DISP_EQUIPS) {
this.moveParticles ();
allquiet = false;
}this.currentStep = (this.reverse * (Clazz.doubleToInt (this.lastTime / 30)) % 800);
if (this.currentStep < 0) this.currentStep += 800;
} else {
this.lastXRot = this.lastYRot = 0;
this.lastTime = 0;
}this.drawCube (g, true);
this.cameraPos =  Clazz.newDoubleArray (3, 0);
this.unmap3d (this.cameraPos, Clazz.doubleToInt (this.winSize.width / 2), Clazz.doubleToInt (this.winSize.height / 2), 5.0, this.viewMain);
if (disp == com.falstad.Vec3DemoFrame.DISP_VECTORS || disp == com.falstad.Vec3DemoFrame.DISP_VECTORS_A) this.drawVectors (g);
 else if (disp == com.falstad.Vec3DemoFrame.DISP_LINES) {
this.genLines ();
this.drawLines (g);
} else if (disp == com.falstad.Vec3DemoFrame.DISP_EQUIPS) {
this.genEquips ();
this.drawLines (g);
} else if (disp == com.falstad.Vec3DemoFrame.DISP_VIEW_PAPER) this.drawViewPaper (g);
 else this.drawParticles (g);
g.setColor (java.awt.Color.gray);
this.drawCube (g, false);
this.drawAxes (g);
this.curfunc.finishFrame ();
if (this.parseError) this.centerString (g, "Can't parse expression", this.winSize.height - 20);
realg.drawImage (this.dbimage, 0, 0, this);
var t = System.currentTimeMillis ();
com.falstad.Vec3DemoFrame.frames++;
if (com.falstad.Vec3DemoFrame.firsttime == 0) com.falstad.Vec3DemoFrame.firsttime = t;
 else if (t - com.falstad.Vec3DemoFrame.firsttime > 1000) {
com.falstad.Vec3DemoFrame.framerate = com.falstad.Vec3DemoFrame.frames;
com.falstad.Vec3DemoFrame.firsttime = t;
com.falstad.Vec3DemoFrame.frames = 0;
}if (this.$mouseDown) this.lastXRot = this.lastYRot = 0;
 else if (this.lastXRot != 0 || this.lastYRot != 0) {
this.rotate (this.lastXRot * this.timeStep, this.lastYRot * this.timeStep);
allquiet = false;
}if (!this.stoppedCheck.getState () && !allquiet) this.cv.repaint (this.pause);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "drawCurrentArrow", 
function (g, x1, y1, x2, y2) {
if (this.reverse == 1) this.drawArrow (g, null, x1, y1, x2, y2, 7);
 else this.drawArrow (g, null, x2, y2, x1, y1, 7);
}, "java.awt.Graphics,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawCurrentLine", 
function (g, x1, y1, x2, y2, n, doArrow, dir) {
var i;
if (dir == -1) {
var x3 = x1;
var y3 = y1;
x1 = x2;
y1 = y2;
x2 = x3;
y2 = y3;
}var x0 = x1;
var y0 = y1;
n *= 3;
for (i = 1; i <= n; i++) {
var x = Clazz.doubleToInt ((x2 - x1) * i / n) + x1;
var y = Clazz.doubleToInt ((y2 - y1) * i / n) + y1;
g.setColor (java.awt.Color.yellow);
if (i == n && doArrow && this.reverse == 1) this.drawCurrentArrow (g, x0, y0, x, y);
 else if (i == 1 && doArrow && this.reverse == -1) this.drawCurrentArrow (g, x0, y0, x, y);
 else {
g.setColor (this.getCurrentColor (i));
g.drawLine (x0, y0, x, y);
}x0 = x;
y0 = y;
}
}, "java.awt.Graphics,~N,~N,~N,~N,~N,~B,~N");
Clazz.defineMethod (c$, "getCurrentColor", 
function (i) {
return (((Clazz.doubleToInt (this.currentStep / 2) + 400 - i) & 4) > 0) ? java.awt.Color.yellow : java.awt.Color.darkGray;
}, "~N");
Clazz.defineMethod (c$, "drawSphere", 
function (g, r, back) {
var i;
var ct = 10;
for (i = 0; i != ct; i++) {
var th1 = 3.141592653589793 * 2 * i / ct;
var th2 = 3.141592653589793 * 2 * (i + 1) / ct;
var sinth1 = r * java.lang.Math.sin (th1);
var costh1 = r * java.lang.Math.cos (th1);
var sinth2 = r * java.lang.Math.sin (th2);
var costh2 = r * java.lang.Math.cos (th2);
if (this.backFacing (costh1, sinth1, 0, costh1, sinth1, 0) == back) {
this.map3d (costh1, sinth1, 0, this.xpoints, this.ypoints, 0);
this.map3d (costh2, sinth2, 0, this.xpoints, this.ypoints, 1);
g.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
}if (this.backFacing (0, costh1, sinth1, 0, costh1, sinth1) == back) {
this.map3d (0, costh1, sinth1, this.xpoints, this.ypoints, 0);
this.map3d (0, costh2, sinth2, this.xpoints, this.ypoints, 1);
g.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
}if (this.backFacing (costh1, 0, sinth1, costh1, 0, sinth1) == back) {
this.map3d (costh1, 0, sinth1, this.xpoints, this.ypoints, 0);
this.map3d (costh2, 0, sinth2, this.xpoints, this.ypoints, 1);
g.drawLine (this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1]);
}}
}, "java.awt.Graphics,~N,~B");
Clazz.defineMethod (c$, "fillSphere", 
function (g, r, xoff) {
var i;
var j;
var ct = 20;
for (i = 0; i != ct; i++) {
var th1 = 3.141592653589793 * i / ct;
var th2 = 3.141592653589793 * (i + 1) / ct;
var costh1 = r * java.lang.Math.cos (th1);
var sinth1 = r * java.lang.Math.sin (th1);
var costh2 = r * java.lang.Math.cos (th2);
var sinth2 = r * java.lang.Math.sin (th2);
var cosph1 = 1;
var sinph1 = 0;
for (j = 0; j != ct; j++) {
var ph2 = 2 * 3.141592653589793 * (j + 1) / ct;
var cosph2 = java.lang.Math.cos (ph2);
var sinph2 = java.lang.Math.sin (ph2);
var x1 = sinth1 * cosph1;
var y1 = sinth1 * sinph1;
var z1 = costh1;
var x = this.cameraPos[0] - (x1 + xoff);
var y = this.cameraPos[1] - y1;
var z = this.cameraPos[2] - z1;
var d = x * x1 + y * y1 + z * z1;
if (d > 0) {
var dd = Clazz.doubleToInt (d / r * 40);
if (dd > 255) dd = 255;
g.setColor ( new java.awt.Color (dd, dd, 0));
this.map3d (xoff + x1, y1, z1, this.xpoints, this.ypoints, 0);
this.map3d (xoff + sinth1 * cosph2, sinth1 * sinph2, costh1, this.xpoints, this.ypoints, 1);
this.map3d (xoff + sinth2 * cosph2, sinth2 * sinph2, costh2, this.xpoints, this.ypoints, 2);
this.map3d (xoff + sinth2 * cosph1, sinth2 * sinph1, costh2, this.xpoints, this.ypoints, 3);
g.fillPolygon (this.xpoints, this.ypoints, 4);
}cosph1 = cosph2;
sinph1 = sinph2;
}
}
}, "java.awt.Graphics,~N,~N");
Clazz.defineMethod (c$, "drawCylinder", 
function (g, r, xoff, back) {
var i;
var ct = 10;
for (i = 0; i != ct; i++) {
var th1 = 3.141592653589793 * 2 * i / ct;
var th2 = 3.141592653589793 * 2 * (i + 1) / ct;
var sinth1 = r * java.lang.Math.sin (th1);
var costh1 = r * java.lang.Math.cos (th1);
var sinth2 = r * java.lang.Math.sin (th2);
var costh2 = r * java.lang.Math.cos (th2);
if (this.backFacing (costh1, sinth1, 0, costh1, sinth1, 0) == back) {
this.map3d (xoff + costh1, sinth1, -1, this.xpoints, this.ypoints, 0);
this.map3d (xoff + costh2, sinth2, -1, this.xpoints, this.ypoints, 1);
this.map3d (xoff + costh2, sinth2, 1, this.xpoints, this.ypoints, 2);
this.map3d (xoff + costh1, sinth1, 1, this.xpoints, this.ypoints, 3);
g.drawPolygon (this.xpoints, this.ypoints, 4);
}}
}, "java.awt.Graphics,~N,~N,~B");
Clazz.defineMethod (c$, "setFaceColor", 
function (g, d) {
var dd = 32 + Clazz.doubleToInt (d * 40);
if (dd > 255) dd = 255;
g.setColor ( new java.awt.Color (dd, dd, 0));
}, "java.awt.Graphics,~N");
Clazz.defineMethod (c$, "fillCylinder", 
function (g, r, xoff) {
var i;
var ct = 30;
var sidepoints;
sidepoints =  Clazz.newIntArray (4, ct, 0);
for (i = 0; i != ct; i++) {
var th1 = 3.141592653589793 * 2 * i / ct;
var th2 = 3.141592653589793 * 2 * (i + 1) / ct;
var sinth1 = r * java.lang.Math.sin (th1);
var costh1 = r * java.lang.Math.cos (th1);
var sinth2 = r * java.lang.Math.sin (th2);
var costh2 = r * java.lang.Math.cos (th2);
var x = this.cameraPos[0] - (xoff + costh1);
var y = this.cameraPos[1] - sinth1;
var d = x * costh1 + y * sinth1;
if (d > 0) this.setFaceColor (g, d / r);
this.map3d (xoff + costh1, sinth1, -1, this.xpoints, this.ypoints, 0);
this.map3d (xoff + costh2, sinth2, -1, this.xpoints, this.ypoints, 1);
this.map3d (xoff + costh2, sinth2, 1, this.xpoints, this.ypoints, 2);
this.map3d (xoff + costh1, sinth1, 1, this.xpoints, this.ypoints, 3);
sidepoints[0][i] = this.xpoints[0];
sidepoints[1][i] = this.ypoints[0];
sidepoints[2][i] = this.xpoints[3];
sidepoints[3][i] = this.ypoints[3];
if (d > 0) g.fillPolygon (this.xpoints, this.ypoints, 4);
}
if (!this.backFacing (0, 0, 1, 0, 0, 1)) {
this.setFaceColor (g, this.cameraPos[2]);
g.fillPolygon (sidepoints[2], sidepoints[3], ct);
} else if (!this.backFacing (0, 0, -1, 0, 0, -1)) {
this.setFaceColor (g, -this.cameraPos[2]);
g.fillPolygon (sidepoints[0], sidepoints[1], ct);
}}, "java.awt.Graphics,~N,~N");
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
Clazz.defineMethod (c$, "drawViewPaper", 
function (g) {
var i;
var j;
var ct = this.vecDensityBar.getValue ();
ct = 24 + (Clazz.doubleToInt (ct * 56 / 64));
var z = this.sliceval;
var pos =  Clazz.newDoubleArray (3, 0);
var field =  Clazz.newDoubleArray (3, 0);
var slice = this.sliceChooser.getSelectedIndex () - 1;
if (slice < 0) slice = 0;
var coord1 = (slice == 0) ? 1 : 0;
var coord2 = (slice == 2) ? 1 : 2;
for (i = 0; i != ct; i++) {
var x1 = i * 2. / ct - 1;
var x2 = (i + 1.) * 2 / ct - 1;
for (j = 0; j != ct; j++) {
var y1 = j * 2. / ct - 1;
var y2 = (j + 1.) * 2 / ct - 1;
pos[coord1] = x1;
pos[coord2] = y1;
pos[slice] = z;
this.curfunc.getField (field, pos);
var prp = field[slice] < 0 ? -field[slice] : field[slice];
var par = java.lang.Math.sqrt (field[coord1] * field[coord1] + field[coord2] * field[coord2]);
var dd = Clazz.doubleToInt ((par / 2 - prp) * this.strengthBar.getValue () * 20000. + 128);
if (dd < 0) dd = 0;
if (dd > 255) dd = 255;
g.setColor ( new java.awt.Color (0, dd / 255, 0));
this.map3d (pos[0], pos[1], pos[2], this.xpoints, this.ypoints, 0);
pos[coord1] = x2;
this.map3d (pos[0], pos[1], pos[2], this.xpoints, this.ypoints, 1);
pos[coord2] = y2;
this.map3d (pos[0], pos[1], pos[2], this.xpoints, this.ypoints, 2);
pos[coord1] = x1;
this.map3d (pos[0], pos[1], pos[2], this.xpoints, this.ypoints, 3);
g.fillPolygon (this.xpoints, this.ypoints, 4);
}
}
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "drawVectors", 
function (g) {
var x;
var y;
var z;
var dd = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DrawData, this, null);
dd.mult = this.strengthBar.getValue () * 80.;
dd.g = g;
dd.field =  Clazz.newDoubleArray (3, 0);
dd.vv =  Clazz.newDoubleArray (3, 0);
this.vectorSpacing = this.vecDensityBar.getValue ();
var slice = this.sliceChooser.getSelectedIndex ();
var sliced = (slice > 0);
var vec =  Clazz.newDoubleArray (3, 0);
if (this.vectors == null && sliced) this.vectors =  new Array (this.vectorSpacing * this.vectorSpacing);
this.vecCount = 0;
if (!sliced) {
this.vectorSpacing = Clazz.doubleToInt (this.vectorSpacing / 2);
if (this.vectors == null) this.vectors =  new Array (this.vectorSpacing * this.vectorSpacing * this.vectorSpacing);
for (x = 0; x != this.vectorSpacing; x++) {
vec[0] = x * (2.0 / (this.vectorSpacing - 1)) - 1;
for (y = 0; y != this.vectorSpacing; y++) {
vec[1] = y * (2.0 / (this.vectorSpacing - 1)) - 1;
for (z = 0; z != this.vectorSpacing; z++) {
vec[2] = z * (2.0 / (this.vectorSpacing - 1)) - 1;
this.drawVector (dd, vec);
}
}
}
} else {
var coord1 = (slice == 1) ? 1 : 0;
var coord2 = (slice == 3) ? 1 : 2;
var slicecoord = slice - 1;
vec[slicecoord] = this.sliceval;
for (x = 0; x != this.vectorSpacing; x++) {
vec[coord1] = x * (2.0 / (this.vectorSpacing - 1)) - 1;
for (y = 0; y != this.vectorSpacing; y++) {
vec[coord2] = y * (2.0 / (this.vectorSpacing - 1)) - 1;
this.drawVector (dd, vec);
}
}
}this.curfunc.render (g);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "genLines", 
function () {
if (this.vectors != null) return;
this.partMult = this.fieldStrength = 10;
var i;
this.vecCount = 0;
var lineGridSize = this.lineDensityBar.getValue ();
if (lineGridSize < 3) lineGridSize = 3;
if (lineGridSize > 16) lineGridSize = 16;
var slice = this.sliceChooser.getSelectedIndex ();
var sliced = (slice > 0);
if (sliced) lineGridSize *= 2;
var ct = (sliced) ? 30 * lineGridSize * lineGridSize : 30 * lineGridSize * lineGridSize * lineGridSize;
this.vectors =  new Array (ct);
var brightmult = 160 * this.strengthBar.getValue ();
var lineGrid =  Clazz.newBooleanArray (lineGridSize, lineGridSize, lineGridSize, false);
var lineGridMult = lineGridSize / 2.;
if (sliced) {
var j;
var k;
var gp = Clazz.doubleToInt ((this.sliceval + 1) * lineGridMult);
for (i = 0; i != lineGridSize; i++) for (j = 0; j != lineGridSize; j++) for (k = 0; k != lineGridSize; k++) {
switch (slice) {
case 1:
lineGrid[i][j][k] = i != gp;
break;
case 2:
lineGrid[i][j][k] = j != gp;
break;
case 3:
lineGrid[i][j][k] = k != gp;
break;
}
}


}var origp =  Clazz.newDoubleArray (3, 0);
var field =  Clazz.newDoubleArray (3, 0);
var p = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Particle, this, null);
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
var pz = 0;
while (true) {
if (!lineGrid[px][py][pz]) break;
if (++px < lineGridSize) continue;
px = 0;
if (++py < lineGridSize) continue;
py = 0;
if (++pz < lineGridSize) continue;
break;
}
if (pz == lineGridSize) break;
lineGrid[px][py][pz] = true;
var offs = .5 / lineGridMult;
origp[0] = p.pos[0] = px / lineGridMult - 1 + offs;
origp[1] = p.pos[1] = py / lineGridMult - 1 + offs;
origp[2] = p.pos[2] = pz / lineGridMult - 1 + offs;
if (sliced) origp[slice - 1] = p.pos[slice - 1] = this.sliceval;
}var fv = this.vectors[this.vecCount];
if (fv == null) {
fv = this.vectors[this.vecCount] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FieldVector, this, null);
fv.p1 =  Clazz.newDoubleArray (3, 0);
fv.p2 =  Clazz.newDoubleArray (3, 0);
}this.vecCount++;
fv.p1[0] = p.pos[0];
fv.p1[1] = p.pos[1];
fv.p1[2] = p.pos[2];
var x = p.pos;
this.lineSegment (p, dir);
if (p.lifetime < 0) {
this.vecCount--;
continue;
}var gx = Clazz.doubleToInt ((x[0] + 1) * lineGridMult);
var gy = Clazz.doubleToInt ((x[1] + 1) * lineGridMult);
var gz = Clazz.doubleToInt ((x[2] + 1) * lineGridMult);
if (!lineGrid[gx][gy][gz]) segs--;
lineGrid[gx][gy][gz] = true;
fv.p2[0] = p.pos[0];
fv.p2[1] = p.pos[1];
fv.p2[2] = p.pos[2];
var dn = brightmult * p.phi;
if (dn > 2) dn = 2;
fv.col = Clazz.doubleToInt (dn * 255);
var d2 = this.dist2 (origp, x);
if (d2 > lastdist) lastdist = d2;
 else segs++;
if (segs > 10 || d2 < .001) p.lifetime = -1;
}
});
Clazz.defineMethod (c$, "drawLines", 
function (g) {
var i;
for (i = 0; i != this.vecCount; i++) {
var fv = this.vectors[i];
var x = fv.p1;
this.map3d (x[0], x[1], x[2], this.xpoints, this.ypoints, 0);
var vp1 = this.curfunc.getViewPri (this.cameraPos, x);
x = fv.p2;
this.map3d (x[0], x[1], x[2], this.xpoints, this.ypoints, 1);
fv.sx1 = this.xpoints[0];
fv.sy1 = this.ypoints[0];
fv.sx2 = this.xpoints[1];
fv.sy2 = this.ypoints[1];
var vp2 = this.curfunc.getViewPri (this.cameraPos, x);
fv.viewPri = (vp1 > vp2) ? vp1 : vp2;
}
this.curfunc.render (g);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "canSubdivide", 
function (a, b) {
return this.dist2 (a.pos, b.pos) > 0.0016;
}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint");
Clazz.defineMethod (c$, "genEquips", 
function () {
if (this.vectors != null) return;
this.partMult = this.fieldStrength = 10;
this.vecCount = 0;
var slice = this.sliceChooser.getSelectedIndex ();
this.vectors =  new Array (10000);
this.potfield =  Clazz.newDoubleArray (3, 0);
var eps =  new Array (4);
var i;
for (i = 0; i != 4; i++) eps[i] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.EquipPoint, this, null);

if (slice == 0) {
var steps = 3;
for (i = -steps; i <= steps; i++) this.genEquipPlane (eps, i / steps, 1);

for (i = -steps; i <= steps; i++) this.genEquipPlane (eps, i / steps, 2);

for (i = -steps; i <= steps; i++) this.genEquipPlane (eps, i / steps, 3);

} else this.genEquipPlane (eps, this.sliceval, slice);
});
Clazz.defineMethod (c$, "genEquipPlane", 
function (eps, z, slice) {
var i;
var j;
var coord1 = (slice == 1) ? 1 : 0;
var coord2 = (slice == 3) ? 1 : 2;
slice -= 1;
var grid = (this.sliceChooser.getSelectedIndex () == 0) ? 12 : 24;
var gridmult = 2. / grid;
var pots =  Clazz.newDoubleArray (grid + 1, grid + 1, 0);
for (i = 0; i <= grid; i++) for (j = 0; j <= grid; j++) {
var x1 = i * gridmult - 1;
var y1 = j * gridmult - 1;
eps[0].set (coord1, coord2, slice, x1, y1, z);
this.curfunc.getField (this.potfield, eps[0].pos);
pots[i][j] = this.reverse * this.potfield[0];
}

for (i = 0; i != grid; i++) for (j = 0; j != grid; j++) {
var x1 = i * gridmult - 1;
var y1 = j * gridmult - 1;
var x2 = (i + 1) * gridmult - 1;
var y2 = (j + 1) * gridmult - 1;
eps[0].set (coord1, coord2, slice, x1, y1, z);
eps[1].set (coord1, coord2, slice, x2, y1, z);
eps[2].set (coord1, coord2, slice, x1, y2, z);
eps[3].set (coord1, coord2, slice, x2, y2, z);
eps[0].setPot (pots[i][j]);
eps[1].setPot (pots[i + 1][j]);
eps[2].setPot (pots[i][j + 1]);
eps[3].setPot (pots[i + 1][j + 1]);
this.tryEdges (eps[0], eps[1], eps[2], eps[3]);
}

}, "~A,~N,~N");
Clazz.defineMethod (c$, "max", 
function (a, b) {
return a > b ? a : b;
}, "~N,~N");
Clazz.defineMethod (c$, "min", 
function (a, b) {
return a < b ? a : b;
}, "~N,~N");
Clazz.defineMethod (c$, "shouldSubdivide", 
function (ep1, ep2, ep3, ep4) {
if (!ep1.inRange ()) return true;
if (!ep2.inRange ()) return true;
if (!ep3.inRange ()) return true;
if (!ep4.inRange ()) return true;
var pmin = this.min (this.min (ep1.pot, ep2.pot), this.min (ep3.pot, ep4.pot));
var pmax = this.max (this.max (ep1.pot, ep2.pot), this.max (ep3.pot, ep4.pot));
return (pmax - pmin) > .3;
}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint");
Clazz.defineMethod (c$, "tryEdges", 
function (ep1, ep2, ep3, ep4) {
if (this.shouldSubdivide (ep1, ep2, ep3, ep4) && this.canSubdivide (ep1, ep2)) {
var ep12 = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.EquipPoint, this, null, ep1, ep2);
var ep13 = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.EquipPoint, this, null, ep1, ep3);
var ep24 = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.EquipPoint, this, null, ep2, ep4);
var ep34 = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.EquipPoint, this, null, ep3, ep4);
var epc = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.EquipPoint, this, null, ep12, ep34);
this.tryEdges (ep1, ep12, ep13, epc);
this.tryEdges (ep12, ep2, epc, ep24);
this.tryEdges (ep13, epc, ep3, ep34);
this.tryEdges (epc, ep24, ep34, ep4);
return;
}this.tryEdge (ep1, ep2, ep3, ep4);
this.tryEdge (ep1, ep2, ep1, ep3);
this.tryEdge (ep1, ep2, ep2, ep4);
this.tryEdge (ep1, ep3, ep2, ep4);
this.tryEdge (ep1, ep3, ep3, ep4);
this.tryEdge (ep2, ep4, ep3, ep4);
}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint");
Clazz.defineMethod (c$, "spanning", 
function (ep1, ep2, pval) {
if (ep1.pot == ep2.pot) return false;
if (!(ep1.valid () && ep2.valid ())) return false;
return !((ep1.pot < pval && ep2.pot < pval) || (ep1.pot > pval && ep2.pot > pval));
}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,~N");
Clazz.defineMethod (c$, "interpPoint", 
function (ep1, ep2, pval, pos) {
var interp2 = (pval - ep1.pot) / (ep2.pot - ep1.pot);
var interp1 = 1 - interp2;
var i;
for (i = 0; i != 3; i++) pos[i] = ep1.pos[i] * interp1 + ep2.pos[i] * interp2;

}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,~N,~A");
Clazz.defineMethod (c$, "tryEdge", 
function (ep1, ep2, ep3, ep4) {
var i;
if (this.sliceChooser.getSelectedIndex () == 0) {
this.tryEdge (ep1, ep2, ep3, ep4, (this.potentialBar.getValue () - 500) / 500.);
} else {
for (i = -20; i <= 20; i++) this.tryEdge (ep1, ep2, ep3, ep4, i / 20.);

}}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint");
Clazz.defineMethod (c$, "tryEdge", 
function (ep1, ep2, ep3, ep4, pval) {
if (!(this.spanning (ep1, ep2, pval) && this.spanning (ep3, ep4, pval))) return;
if (this.vecCount == 10000) return;
var fv = this.vectors[this.vecCount];
if (fv == null) {
fv = this.vectors[this.vecCount] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FieldVector, this, null);
fv.p1 =  Clazz.newDoubleArray (3, 0);
fv.p2 =  Clazz.newDoubleArray (3, 0);
}this.vecCount++;
this.interpPoint (ep1, ep2, pval, fv.p1);
this.interpPoint (ep3, ep4, pval, fv.p2);
fv.col = 255 + (Clazz.doubleToInt (255 * pval));
}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint,~N");
Clazz.defineMethod (c$, "drawVector", 
function (dd, vec) {
var field = dd.field;
this.curfunc.getField (field, vec);
var dn = java.lang.Math.sqrt (field[0] * field[0] + field[1] * field[1] + field[2] * field[2]);
var dnr = dn * this.reverse;
if (dn > 0) {
field[0] /= dnr;
field[1] /= dnr;
field[2] /= dnr;
}dn *= dd.mult;
if (dn > 2) dn = 2;
var col = Clazz.doubleToInt (dn * 255);
var sw2 = 1. / (this.vectorSpacing - 1);
this.map3d (vec[0], vec[1], vec[2], this.xpoints, this.ypoints, 0);
var vv = dd.vv;
vv[0] = vec[0] + sw2 * field[0];
vv[1] = vec[1] + sw2 * field[1];
vv[2] = vec[2] + sw2 * field[2];
this.map3d (vv[0], vv[1], vv[2], this.xpoints, this.ypoints, 1);
var fv = this.vectors[this.vecCount];
if (fv == null) fv = this.vectors[this.vecCount] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FieldVector, this, null);
fv.sx1 = this.xpoints[0];
fv.sy1 = this.ypoints[0];
fv.sx2 = this.xpoints[1];
fv.sy2 = this.ypoints[1];
fv.col = col;
this.vecCount++;
var vp1 = this.curfunc.getViewPri (this.cameraPos, vec);
if (!this.curfunc.noSplitFieldVectors ()) fv.viewPri = vp1;
 else {
var vp2 = this.curfunc.getViewPri (this.cameraPos, vv);
fv.viewPri = (vp1 == vp2) ? vp1 : -1;
}}, "com.falstad.Vec3DemoFrame.DrawData,~A");
Clazz.defineMethod (c$, "drawParticles", 
function (g) {
var i;
var pcount = this.getParticleCount ();
for (i = 0; i < pcount; i++) {
var pt = this.particles[i];
pt.viewPri = this.curfunc.getViewPri (this.cameraPos, pt.pos);
}
this.curfunc.render (g);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "moveParticles", 
function () {
this.fieldStrength = this.strengthBar.getValue ();
var bestd = 0;
var i;
var pcount = this.getParticleCount ();
var slice = this.sliceChooser.getSelectedIndex ();
var sliced = (slice > 0);
this.partMult = this.fieldStrength * this.reverse * this.timeStep;
for (i = 0; i != pcount; i++) {
var pt = this.particles[i];
this.removeFromDensityGroup (pt);
this.moveParticle (pt);
var x = pt.pos;
if (!(x[0] >= -1 && x[0] < 1 && x[1] >= -1 && x[1] < 1 && x[2] >= -1 && x[2] < 1) || (pt.lifetime -= this.timeStep) < 0) {
this.positionParticle (pt);
}if (sliced) x[slice - 1] = this.sliceval;
var d = this.addToDensityGroup (pt);
if (d > bestd) bestd = d;
}
var withforce = (this.dispChooser.getSelectedIndex () == com.falstad.Vec3DemoFrame.DISP_PART_FORCE);
var maxd = (Clazz.doubleToInt (10 * this.getParticleCount () / (64)));
if (sliced) maxd = Clazz.doubleToInt (4 * this.getParticleCount () / (16));
if (!withforce && this.curfunc.redistribute () && bestd > maxd) this.redistribute (bestd);
});
Clazz.defineMethod (c$, "drawCube", 
function (g, drawAll) {
var i;
var slice = this.sliceChooser.getSelectedIndex ();
var sp = (drawAll) ? 0 : 8;
for (i = 0; i != 6; i++) {
var nx = (i == 0) ? -1 : (i == 1) ? 1 : 0;
var ny = (i == 2) ? -1 : (i == 3) ? 1 : 0;
var nz = (i == 4) ? -1 : (i == 5) ? 1 : 0;
if (!drawAll && this.backFacing (nx, ny, nz, nx, ny, nz)) continue;
var pts;
pts =  Clazz.newDoubleArray (3, 0);
var n;
for (n = 0; n != 4; n++) {
this.computeFace (i, n, pts);
this.map3d (pts[0], pts[1], pts[2], this.xpoints, this.ypoints, n);
}
g.setColor (java.awt.Color.gray);
g.drawPolygon (this.xpoints, this.ypoints, 4);
if (slice != 0 && Clazz.doubleToInt (i / 2) != slice - 1) {
if (this.selectedSlice) g.setColor (java.awt.Color.yellow);
var coord1 = (slice == 1) ? 1 : 0;
var coord2 = (slice == 3) ? 1 : 2;
this.computeFace (i, 0, pts);
pts[slice - 1] = this.sliceval;
this.map3d (pts[0], pts[1], pts[2], this.slicerPoints[0], this.slicerPoints[1], sp);
this.computeFace (i, 2, pts);
pts[slice - 1] = this.sliceval;
this.map3d (pts[0], pts[1], pts[2], this.slicerPoints[0], this.slicerPoints[1], sp + 1);
g.drawLine (this.slicerPoints[0][sp], this.slicerPoints[1][sp], this.slicerPoints[0][sp + 1], this.slicerPoints[1][sp + 1]);
if (drawAll) {
this.sliceFaces[Clazz.doubleToInt (sp / 2)][0] = nx;
this.sliceFaces[Clazz.doubleToInt (sp / 2)][1] = ny;
this.sliceFaces[Clazz.doubleToInt (sp / 2)][2] = nz;
sp += 2;
}}}
}, "java.awt.Graphics,~B");
Clazz.defineMethod (c$, "computeFace", 
function (b, n, pts) {
var a = b >> 1;
pts[a] = ((b & 1) == 0) ? -1 : 1;
var i;
for (i = 0; i != 3; i++) {
if (i == a) continue;
pts[i] = (((n >> 1) ^ (n & 1)) == 0) ? -1 : 1;
n >>= 1;
}
}, "~N,~N,~A");
Clazz.defineMethod (c$, "renderItems", 
function (g, pri) {
g.setColor (java.awt.Color.white);
var disp = this.dispChooser.getSelectedIndex ();
if (disp == com.falstad.Vec3DemoFrame.DISP_VECTORS || disp == com.falstad.Vec3DemoFrame.DISP_VECTORS_A) {
var i;
for (i = 0; i != this.vecCount; i++) {
var fv = this.vectors[i];
if (fv.viewPri != pri) continue;
g.setColor (this.fieldColors[fv.col]);
this.drawArrow (g, null, fv.sx1, fv.sy1, fv.sx2, fv.sy2, 2);
}
return;
}if (disp == com.falstad.Vec3DemoFrame.DISP_LINES || disp == com.falstad.Vec3DemoFrame.DISP_EQUIPS) {
var i;
g.setColor (java.awt.Color.white);
var colvec = (disp == com.falstad.Vec3DemoFrame.DISP_EQUIPS) ? this.equipColors : this.fieldColors;
for (i = 0; i != this.vecCount; i++) {
var fv = this.vectors[i];
if (fv.viewPri != pri) continue;
if (fv.sx1 == fv.sx2 && fv.sy1 == fv.sy2) continue;
g.setColor (colvec[fv.col]);
g.drawLine (fv.sx1, fv.sy1, fv.sx2, fv.sy2);
}
return;
}var pcount = this.getParticleCount ();
var i;
this.wooft += .3;
for (i = 0; i < pcount; i++) {
var p = this.particles[i];
if (p.viewPri != pri) continue;
var pos = p.pos;
this.map3d (pos[0], pos[1], pos[2], this.xpoints, this.ypoints, 0);
if (this.xpoints[0] < 0 || this.xpoints[0] >= this.winSize.width || this.ypoints[0] < 0 || this.ypoints[0] >= this.winSize.height) continue;
if (disp == com.falstad.Vec3DemoFrame.DISP_PART_MAG) {
var cosph = java.lang.Math.cos (p.phi);
var sinph = java.lang.Math.sin (p.phi);
var costh = java.lang.Math.cos (p.theta);
var sinth = java.lang.Math.sin (p.theta);
var al = .08;
var rhatx = sinth * cosph * al;
var rhaty = sinth * sinph * al;
var rhatz = costh * al;
this.map3d (pos[0] + rhatx, pos[1] + rhaty, pos[2] + rhatz, this.xpoints, this.ypoints, 1);
this.drawArrow (g, null, this.xpoints[0], this.ypoints[0], this.xpoints[1], this.ypoints[1], 2);
} else g.fillRect (this.xpoints[0], this.ypoints[0] - 1, 2, 2);
}
}, "java.awt.Graphics,~N");
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
Clazz.defineMethod (c$, "backFacing", 
function (px, py, pz, nx, ny, nz) {
var x = this.cameraPos[0] - px;
var y = this.cameraPos[1] - py;
var z = this.cameraPos[2] - pz;
var d = x * nx + y * ny + z * nz;
return d <= 0;
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "intersectSphere", 
function (cp, ptx, pty, ptz, r) {
return this.intersectSphere (cp, ptx, pty, ptz, 0, 0, 0, r);
}, "~A,~N,~N,~N,~N");
Clazz.defineMethod (c$, "intersectSphere", 
function (cp, ptx, pty, ptz, sx, sy, sz, r) {
var vx = ptx - cp[0];
var vy = pty - cp[1];
var vz = ptz - cp[2];
var qpx = cp[0] - sx;
var qpy = cp[1] - sy;
var qpz = cp[2] - sz;
var a = vx * vx + vy * vy + vz * vz;
var b = 2 * (vx * qpx + vy * qpy + vz * qpz);
var c = qpx * qpx + qpy * qpy + qpz * qpz - r * r;
var discrim = b * b - 4 * a * c;
if (discrim < 0) return 0;
discrim = java.lang.Math.sqrt (discrim);
var b1 = (-b - discrim) / (2 * a);
var b2 = (-b + discrim) / (2 * a);
if (b1 < 1 && this.inViewBox (b1, cp, vx, vy, vz)) return (b2 < 1) ? 2 : 1;
 else return 0;
}, "~A,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "intersectZPlane", 
function (cp, a, ptx, pty, ptz) {
var vx = ptx - cp[0];
var vy = pty - cp[1];
var vz = ptz - cp[2];
var t = this.intersectionDistance = -(cp[2] + a) / vz;
if (t > 1) return 0;
if (!this.inViewBox (t, cp, vx, vy, vz)) return 0;
return 2;
}, "~A,~N,~N,~N,~N");
Clazz.defineMethod (c$, "inViewBox", 
function (t, cp, vx, vy, vz) {
if (t < 0) return false;
var ix = this.intersection[0] = cp[0] + vx * t;
var iy = this.intersection[1] = cp[1] + vy * t;
var iz = this.intersection[2] = cp[2] + vz * t;
if (ix < -1 || ix > 1 || iy < -1 || iy > 1 || iz < -1 || iz > 1) return false;
return true;
}, "~N,~A,~N,~N,~N");
Clazz.defineMethod (c$, "intersectCylinder", 
function (cp, ptx, pty, ptz, r, vbTest) {
return this.intersectCylinder (cp, ptx, pty, ptz, 0, 0, r, vbTest);
}, "~A,~N,~N,~N,~N,~B");
Clazz.defineMethod (c$, "intersectCylinder", 
function (cp, ptx, pty, ptz, sx, sy, r, vbTest) {
var vx = ptx - cp[0];
var vy = pty - cp[1];
var qpx = cp[0] - sx;
var qpy = cp[1] - sy;
var a = vx * vx + vy * vy;
var b = 2 * (vx * qpx + vy * qpy);
var c = qpx * qpx + qpy * qpy - r * r;
var discrim = b * b - 4 * a * c;
if (discrim < 0) return 0;
discrim = java.lang.Math.sqrt (discrim);
var b1 = (-b - discrim) / (2 * a);
var b2 = (-b + discrim) / (2 * a);
if (b1 > 1) return 0;
if (!vbTest || this.inViewBox (b1, cp, vx, vy, ptz - cp[2])) return (b2 < 1) ? 2 : 1;
if (b2 > 1) return 2;
if (this.inViewBox (b2, cp, vx, vy, ptz - cp[2])) return 2;
return 0;
}, "~A,~N,~N,~N,~N,~N,~N,~B");
Clazz.defineMethod (c$, "redistribute", 
function (mostd) {
if (mostd < 5) return;
this.rediscount++;
var maxd = (Clazz.doubleToInt (10 * this.getParticleCount () / (64)));
var i;
var pn = 0;
var pcount = this.getParticleCount ();
for (i = this.rediscount % 4; i < pcount; i += 4) {
var p = this.particles[i];
var a = Clazz.doubleToInt ((p.pos[0] + 1) * (2));
var b = Clazz.doubleToInt ((p.pos[1] + 1) * (2));
var c = Clazz.doubleToInt ((p.pos[2] + 1) * (2));
if (this.density[a][b][c] <= maxd) continue;
p.lifetime = -1;
pn++;
}
}, "~N");
c$.distanceParticle = Clazz.defineMethod (c$, "distanceParticle", 
function (p) {
return com.falstad.Vec3DemoFrame.distance3 (p.pos[0], p.pos[1], p.pos[2]);
}, "com.falstad.Vec3DemoFrame.Particle");
c$.distanceArray = Clazz.defineMethod (c$, "distanceArray", 
function (y) {
return com.falstad.Vec3DemoFrame.distance3 (y[0], y[1], y[2]);
}, "~A");
c$.distance3 = Clazz.defineMethod (c$, "distance3", 
function (x, y, z) {
return java.lang.Math.sqrt (x * x + y * y + z * z + .000000001);
}, "~N,~N,~N");
c$.distance2 = Clazz.defineMethod (c$, "distance2", 
function (x, y) {
return java.lang.Math.sqrt (x * x + y * y + .000000001);
}, "~N,~N");
Clazz.defineMethod (c$, "rotateParticleAdd", 
function (result, y, mult, cx, cy) {
result[0] += -mult * (y[1] - cy);
result[1] += mult * (y[0] - cx);
result[2] += 0;
}, "~A,~A,~N,~N,~N");
Clazz.defineMethod (c$, "rotateParticle", 
function (result, y, mult) {
result[0] = -mult * y[1];
result[1] = mult * y[0];
result[2] = 0;
}, "~A,~A,~N");
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
}, "java.awt.event.ActionEvent");
Clazz.defineMethod (c$, "handleEvent", 
function (ev) {
if (ev.id == 201) {
this.applet.destroyFrame ();
return true;
}return Clazz.superCall (this, com.falstad.Vec3DemoFrame, "handleEvent", [ev]);
}, "java.awt.Event");
Clazz.overrideMethod (c$, "adjustmentValueChanged", 
function (e) {
this.vectors = null;
System.out.print ((e.getSource ()).getValue () + "\n");
if (e.getSource () === this.partCountBar) this.resetDensityGroups ();
this.cv.repaint (this.pause);
}, "java.awt.event.AdjustmentEvent");
Clazz.overrideMethod (c$, "mouseDragged", 
function (e) {
this.dragging = true;
this.oldDragX = this.dragX;
this.oldDragY = this.dragY;
this.dragX = e.getX ();
this.dragY = e.getY ();
var mode = this.modeChooser.getSelectedIndex ();
if (this.selectedSlice) mode = 2;
if (mode == 0) {
var xo = this.oldDragX - this.dragX;
var yo = this.oldDragY - this.dragY;
this.rotate (this.lastXRot = xo / 40., this.lastYRot = -yo / 40.);
var lr = Math.sqrt (this.lastXRot * this.lastXRot + this.lastYRot * this.lastYRot);
if (lr > .06) {
lr /= .06;
this.lastXRot /= lr;
this.lastYRot /= lr;
}this.cv.repaint (this.pause);
} else if (mode == 1) {
var xo = this.dragX - this.dragStartX;
this.zoom = this.dragZoomStart + xo / 20.;
if (this.zoom < .1) this.zoom = .1;
this.cv.repaint (this.pause);
} else if (mode == 2) {
var x3 =  Clazz.newDoubleArray (3, 0);
this.unmap3d (x3, this.dragX, this.dragY, this.sliceFace, this.sliceFace, this.viewMain);
switch (this.sliceChooser.getSelectedIndex ()) {
case 1:
this.sliceval = x3[0];
break;
case 2:
this.sliceval = x3[1];
break;
case 3:
this.sliceval = x3[2];
break;
}
if (this.sliceval < -0.99) this.sliceval = -0.99;
if (this.sliceval > .99) this.sliceval = .99;
this.resetDensityGroups ();
this.cv.repaint (this.pause);
this.vectors = null;
}}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "csInRange", 
function (x, xa, xb) {
if (xa < xb) return x >= xa - 5 && x <= xb + 5;
return x >= xb - 5 && x <= xa + 5;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "checkSlice", 
function (x, y) {
if (this.sliceChooser.getSelectedIndex () == 0) {
this.selectedSlice = false;
return;
}var n;
this.selectedSlice = false;
for (n = 0; n != 8; n += 2) {
var xa = this.slicerPoints[0][n];
var xb = this.slicerPoints[0][n + 1];
var ya = this.slicerPoints[1][n];
var yb = this.slicerPoints[1][n + 1];
if (!this.csInRange (x, xa, xb) || !this.csInRange (y, ya, yb)) continue;
var d;
if (xa == xb) d = java.lang.Math.abs (x - xa);
 else {
var b = (yb - ya) / (xb - xa);
var a = ya - b * xa;
var d1 = y - (a + b * x);
if (d1 < 0) d1 = -d1;
d = d1 / java.lang.Math.sqrt (1 + b * b);
}if (d < 6) {
this.selectedSlice = true;
this.sliceFace = this.sliceFaces[Clazz.doubleToInt (n / 2)];
break;
}}
}, "~N,~N");
Clazz.overrideMethod (c$, "mouseMoved", 
function (e) {
this.dragX = e.getX ();
this.dragY = e.getY ();
this.dragStartX = this.dragX;
this.dragStartY = this.dragY;
this.dragZoomStart = this.zoom;
var ss = this.selectedSlice;
this.checkSlice (this.dragX, this.dragY);
if (ss != this.selectedSlice) this.cv.repaint (this.pause);
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
this.mouseMoved (e);
this.$mouseDown = true;
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "mouseReleased", 
function (e) {
this.$mouseDown = false;
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "dispChooserChanged", 
function () {
var disp = this.dispChooser.getSelectedIndex ();
this.showA = (disp == com.falstad.Vec3DemoFrame.DISP_PART_VELOC_A || disp == com.falstad.Vec3DemoFrame.DISP_VECTORS_A);
this.getPot = (disp == com.falstad.Vec3DemoFrame.DISP_EQUIPS);
if (disp == com.falstad.Vec3DemoFrame.DISP_PART_FORCE) this.kickButton.enable ();
 else this.kickButton.disable ();
this.potentialLabel.hide ();
this.potentialBar.hide ();
this.vecDensityLabel.hide ();
this.vecDensityBar.hide ();
this.lineDensityLabel.hide ();
this.lineDensityBar.hide ();
this.partCountLabel.hide ();
this.partCountBar.hide ();
this.strengthLabel.show ();
this.strengthBar.show ();
if (disp == com.falstad.Vec3DemoFrame.DISP_VECTORS || disp == com.falstad.Vec3DemoFrame.DISP_VECTORS_A || disp == com.falstad.Vec3DemoFrame.DISP_VIEW_PAPER) {
this.vecDensityLabel.show ();
this.vecDensityBar.show ();
} else if (disp == com.falstad.Vec3DemoFrame.DISP_LINES) {
this.lineDensityLabel.show ();
this.lineDensityBar.show ();
} else if (disp == com.falstad.Vec3DemoFrame.DISP_EQUIPS) {
this.potentialLabel.show ();
this.potentialBar.show ();
} else {
this.partCountLabel.show ();
this.partCountBar.show ();
}this.vecDensityLabel.setText (disp == com.falstad.Vec3DemoFrame.DISP_VIEW_PAPER ? "Resolution" : "Vector Density");
if (disp == com.falstad.Vec3DemoFrame.DISP_EQUIPS) {
this.strengthLabel.hide ();
this.strengthBar.hide ();
}if ((disp == com.falstad.Vec3DemoFrame.DISP_VIEW_PAPER || disp == com.falstad.Vec3DemoFrame.DISP_EQUIPS) && this.sliceChooser.getSelectedIndex () == 0) {
this.sliceChooser.select (this.curfunc.getBestSlice ());
this.potentialBar.disable ();
}this.validate ();
this.resetParticles ();
});
Clazz.overrideMethod (c$, "itemStateChanged", 
function (e) {
if (!this.finished || this.ignoreChanges) return;
this.vectors = null;
this.cv.repaint (this.pause);
this.reverse = (this.reverseCheck.getState ()) ? -1 : 1;
if (e.getItemSelectable () === this.dispChooser) {
this.dispChooserChanged ();
this.resetParticles ();
}if (e.getItemSelectable () === this.sliceChooser) {
this.resetParticles ();
if (this.modeChooser.getSelectedIndex () == 2) this.modeChooser.select (0);
if (this.sliceChooser.getSelectedIndex () == 0) this.potentialBar.enable ();
 else this.potentialBar.disable ();
}if (e.getStateChange () != 1) return;
if (e.getItemSelectable () === this.functionChooser) this.functionChanged ();
}, "java.awt.event.ItemEvent");
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
this.textFields[i].hide ();
if (this.textFieldLabel != null) this.textFieldLabel.hide ();
}
this.strengthBar.setValue (20);
var x = this.dispChooser.getSelectedIndex ();
this.setupDispChooser (!this.curfunc.nonGradient ());
this.ignoreChanges = true;
try {
if (x >= 0) this.dispChooser.select (x);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
this.ignoreChanges = false;
this.curfunc.setup ();
this.sliceChooser.select (0);
this.validate ();
this.resetParticles ();
this.dispChooserChanged ();
});
Clazz.defineMethod (c$, "setupDispChooser", 
function (potential) {
this.ignoreChanges = true;
this.dispChooser.removeAllItems ();
this.dispChooser.add ("Display: Particles (Vel.)");
if (com.falstad.Vec3DemoFrame.BUILD_M) {
this.dispChooser.add ("Display: Parts (A Field, Vel.)");
this.dispChooser.add ("Display: Field Vectors");
this.dispChooser.add ("Display: Field Vectors (A)");
} else {
this.dispChooser.add ("Display: Particles (Force)");
this.dispChooser.add ("Display: Field Vectors");
}if (com.falstad.Vec3DemoFrame.BUILD_V) this.dispChooser.add ("Display: Streamlines");
 else this.dispChooser.add ("Display: Field Lines");
if (com.falstad.Vec3DemoFrame.BUILD_M) {
this.dispChooser.add ("Display: Parts (Magnetic)");
this.dispChooser.add ("Display: Mag View Film");
} else {
if (potential) this.dispChooser.add ("Display: Equipotentials");
}this.ignoreChanges = false;
}, "~B");
Clazz.defineMethod (c$, "setupBar", 
function (n, text, val) {
this.auxBars[n].label.setText (text);
this.auxBars[n].label.show ();
this.auxBars[n].bar.setValue (val);
this.auxBars[n].bar.show ();
}, "~N,~S,~N");
Clazz.defineMethod (c$, "useMagnetMove", 
function () {
var disp = this.dispChooser.getSelectedIndex ();
return (disp == com.falstad.Vec3DemoFrame.DISP_PART_MAG);
});
Clazz.defineMethod (c$, "magneticMoveParticle", 
function (p) {
var i;
if (this.mstates == null) {
this.mstates =  new Array (3);
for (i = 0; i != 3; i++) this.mstates[i] = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MagnetState, this, null);

}var ms = this.mstates[0];
var mshalf = this.mstates[1];
var oldms = this.mstates[2];
for (i = 0; i != 3; i++) {
ms.pos[i] = p.pos[i];
ms.vel[i] = p.vel[i];
ms.theta = p.theta;
ms.thetav = p.thetav;
ms.phi = p.phi;
ms.phiv = p.phiv;
}
mshalf.copy (ms);
oldms.copy (ms);
var h = 1;
var minh = .01;
var maxh = 1;
var E = .1;
var steps = 0;
var adapt = this.curfunc.useAdaptiveRungeKutta () && this.curfunc.useRungeKutta ();
this.boundCheck = false;
var t = 0;
while (t < 1) {
this.magnetMove (ms, h);
if (this.boundCheck) {
p.pos[0] = -100;
return;
}if (this.curfunc.checkBounds (ms.pos, oldms.pos)) {
p.pos[0] = -100;
return;
}if (!adapt) break;
this.magnetMove (mshalf, h * .5);
this.magnetMove (mshalf, h * .5);
var localError = java.lang.Math.abs (ms.pos[0] - mshalf.pos[0]) + java.lang.Math.abs (ms.pos[1] - mshalf.pos[1]) + java.lang.Math.abs (ms.pos[2] - mshalf.pos[2]) + java.lang.Math.abs (ms.theta - mshalf.theta) + java.lang.Math.abs (ms.phi - mshalf.phi);
if (localError > 0.1 && h > 0.01) {
h *= 0.75;
if (h < 0.01) h = 0.01;
ms.copy (oldms);
continue;
} else if (localError < (0.05)) {
h *= 1.25;
if (h > 1.0) h = 1.0;
}mshalf.copy (ms);
t += h;
steps++;
}
for (i = 0; i != 3; i++) {
p.pos[i] = ms.pos[i];
p.vel[i] = ms.vel[i];
p.theta = ms.theta;
p.thetav = ms.thetav;
p.phi = ms.phi;
p.phiv = ms.phiv;
}
}, "com.falstad.Vec3DemoFrame.Particle");
Clazz.defineMethod (c$, "magnetMove", 
function (ms, stepsize) {
var cosph = java.lang.Math.cos (ms.phi);
var sinph = java.lang.Math.sin (ms.phi);
var costh = java.lang.Math.cos (ms.theta);
var sinth = java.lang.Math.sin (ms.theta);
var thhat =  Clazz.newDoubleArray (3, 0);
var phhat =  Clazz.newDoubleArray (3, 0);
var thhatn =  Clazz.newDoubleArray (3, 0);
var phhatn =  Clazz.newDoubleArray (3, 0);
var force =  Clazz.newDoubleArray (3, 0);
var torque =  Clazz.newDoubleArray (3, 0);
thhat[0] = costh * cosph;
thhat[1] = costh * sinph;
thhat[2] = -sinth;
phhat[0] = -sinph;
phhat[1] = cosph;
phhat[2] = 0;
var i;
for (i = 0; i != 3; i++) {
thhatn[i] = -thhat[i];
phhatn[i] = -phhat[i];
force[i] = torque[i] = 0;
}
this.getMagForce (ms.pos, thhat, phhat, force, torque);
this.getMagForce (ms.pos, phhat, thhatn, force, torque);
this.getMagForce (ms.pos, thhatn, phhatn, force, torque);
this.getMagForce (ms.pos, phhatn, thhat, force, torque);
for (i = 0; i != 3; i++) {
ms.vel[i] += force[i] * stepsize;
ms.pos[i] += ms.vel[i] * stepsize;
}
ms.thetav += this.dot (torque, phhat) * 1000 * stepsize;
ms.phiv += torque[2] * 1000 * stepsize;
ms.thetav *= java.lang.Math.exp (-0.2 * stepsize);
ms.phiv *= java.lang.Math.exp (-0.2 * stepsize);
ms.theta += ms.thetav * stepsize;
ms.phi += ms.phiv * stepsize;
}, "com.falstad.Vec3DemoFrame.MagnetState,~N");
Clazz.defineMethod (c$, "getMagForce", 
function (pos, off, j, f, torque) {
var i;
var offs =  Clazz.newDoubleArray (3, 0);
for (i = 0; i != 3; i++) {
offs[i] = off[i] * .02;
this.rk_yn[i] = pos[i] + offs[i];
}
this.curfunc.getField (this.rk_k1, this.rk_yn);
var fmult = this.reverse * this.strengthBar.getValue ();
for (i = 0; i != 3; i++) this.rk_k1[i] *= fmult;

var newf =  Clazz.newDoubleArray (3, 0);
var newtorque =  Clazz.newDoubleArray (3, 0);
this.cross (newf, j, this.rk_k1);
this.cross (newtorque, offs, newf);
for (i = 0; i != 3; i++) {
f[i] += newf[i];
torque[i] += newtorque[i];
}
}, "~A,~A,~A,~A,~A");
Clazz.defineMethod (c$, "cross", 
function (res, v1, v2) {
res[0] = v1[1] * v2[2] - v1[2] * v2[1];
res[1] = v1[2] * v2[0] - v1[0] * v2[2];
res[2] = v1[0] * v2[1] - v1[1] * v2[0];
}, "~A,~A,~A");
Clazz.defineMethod (c$, "dot", 
function (v1, v2) {
return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}, "~A,~A");
Clazz.defineMethod (c$, "rk", 
function (order, x, Y, stepsize) {
var i;
if (order == 3) {
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

}}, "~N,~N,~A,~N");
Clazz.defineMethod (c$, "getForceField", 
function (result, y, stepsize, fmult) {
this.curfunc.getField (result, y);
var i;
for (i = 0; i != 3; i++) result[i + 3] = .1 * fmult * result[i];

for (i = 0; i != 3; i++) result[i] = stepsize * this.timeStep * this.rk_yn[i + 3];

}, "~A,~A,~N,~N");
Clazz.defineMethod (c$, "moveParticle", 
function (p) {
var disp = this.dispChooser.getSelectedIndex ();
if (disp == com.falstad.Vec3DemoFrame.DISP_PART_MAG) {
this.magneticMoveParticle (p);
return;
}var numIter = 0;
var maxh = 1;
var error = 0.0;
var E = .001;
var localError;
var useForce = (disp == com.falstad.Vec3DemoFrame.DISP_PART_FORCE);
var order = useForce ? 6 : 3;
var Y = this.rk_Y;
var Yhalf = this.rk_Yhalf;
this.oldY = this.rk_oldY;
var i;
for (i = 0; i != 3; i++) this.oldY[i] = Y[i] = Yhalf[i] = p.pos[i];

if (useForce) for (i = 0; i != 3; i++) Y[i + 3] = Yhalf[i + 3] = p.vel[i];

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
for (i = 0; i != 3; i++) {
p.vel[i] += fmult * Yhalf[i];
p.pos[i] += this.timeStep * p.vel[i];
}
} else {
for (i = 0; i != 3; i++) p.pos[i] += fmult * Yhalf[i];

}for (i = 0; i != 3; i++) Y[i] = p.pos[i];

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
}localError = java.lang.Math.abs (Y[0] - Yhalf[0]) + java.lang.Math.abs (Y[1] - Yhalf[1]) + java.lang.Math.abs (Y[2] - Yhalf[2]);
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
for (i = 0; i != 3; i++) p.vel[i] = Y[i + 3];

}}, "com.falstad.Vec3DemoFrame.Particle");
Clazz.defineMethod (c$, "dist2", 
function (a, b) {
var c0 = a[0] - b[0];
var c1 = a[1] - b[1];
var c2 = a[2] - b[2];
return c0 * c0 + c1 * c1 + c2 * c2;
}, "~A,~A");
Clazz.defineMethod (c$, "lineSegment", 
function (p, dir) {
var numIter = 0;
var maxh = 20;
var error = 0.0;
var E = .001;
var localError;
var order = 3;
var Y = this.rk_Y;
var Yhalf = this.rk_Yhalf;
this.oldY = this.rk_oldY;
var i;
var slice = this.sliceChooser.getSelectedIndex ();
var sliced = (slice > 0);
slice -= 1;
for (i = 0; i != 3; i++) this.oldY[i] = Y[i] = Yhalf[i] = p.pos[i];

var h = p.stepsize;
this.ls_fieldavg[0] = this.ls_fieldavg[1] = this.ls_fieldavg[2] = 0;
var steps = 0;
var minh = .1;
var segSize2min = 0.0016;
var segSize2max = 0.0064;
var lastd = 0;
var avgct = 0;
while (true) {
this.boundCheck = false;
steps++;
if (steps > 100) {
p.lifetime = -1;
break;
}this.rk (order, 0, Y, dir * h);
this.rk (order, 0, Yhalf, dir * h * 0.5);
this.rk (order, 0, Yhalf, dir * h * 0.5);
if (sliced) Y[slice] = Yhalf[slice] = this.sliceval;
if (this.boundCheck) {
for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

h /= 2;
if (h < minh) {
p.lifetime = -1;
break;
}continue;
}if (Y[0] < -1 || Y[0] >= .999 || Y[1] < -1 || Y[1] >= .999 || Y[2] < -1 || Y[2] >= .999) {
for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

h /= 2;
if (h < minh) {
p.lifetime = -1;
break;
}continue;
}localError = java.lang.Math.abs (Y[0] - Yhalf[0]) + java.lang.Math.abs (Y[1] - Yhalf[1]) + java.lang.Math.abs (Y[2] - Yhalf[2]);
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
break;
}if (d > segSize2max) {
h /= 2;
if (h < minh) break;
for (i = 0; i != order; i++) Y[i] = Yhalf[i] = this.oldY[i];

continue;
}this.ls_fieldavg[0] += this.rk_k1[0];
this.ls_fieldavg[1] += this.rk_k1[1];
this.ls_fieldavg[2] += this.rk_k1[2];
avgct++;
if (d > segSize2min) break;
lastd = d;
for (i = 0; i != order; i++) this.oldY[i] = Yhalf[i] = Y[i];

}
p.stepsize = h;
for (i = 0; i != 3; i++) p.pos[i] = Y[i];

p.phi = java.lang.Math.sqrt (this.ls_fieldavg[0] * this.ls_fieldavg[0] + this.ls_fieldavg[1] * this.ls_fieldavg[1] + this.ls_fieldavg[2] * this.ls_fieldavg[2]) / avgct;
}, "com.falstad.Vec3DemoFrame.Particle,~N");
Clazz.defineMethod (c$, "getDirectionField", 
function (result, y, th, ph) {
var sinth = java.lang.Math.sin (th);
var costh = java.lang.Math.cos (th);
var sinph = java.lang.Math.sin (ph);
var cosph = java.lang.Math.cos (ph);
if (!this.showA) {
if (this.getPot) {
result[0] = -0.4 * (y[0] * sinth * cosph + y[1] * sinth * sinph + y[2] * costh);
return;
}result[0] = .0003 * sinth * cosph;
result[1] = .0003 * sinth * sinph;
result[2] = .0003 * costh;
} else {
var axis =  Clazz.newDoubleArray (3, 0);
axis[0] = sinth * cosph;
axis[1] = sinth * sinph;
axis[2] = costh;
var d = this.dot (axis, y);
var r =  Clazz.newDoubleArray (3, 0);
var i;
for (i = 0; i != 3; i++) r[i] = .0006 * (y[i] - axis[i] * d);

this.cross (result, axis, r);
}}, "~A,~A,~N,~N");
c$.$Vec3DemoFrame$AuxBar$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.bar = null;
this.label = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "AuxBar");
Clazz.makeConstructor (c$, 
function (a, b) {
this.label = a;
this.bar = b;
}, "swingjs.awt.Label,swingjs.awt.Scrollbar");
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$EquipPoint$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.pos = null;
this.pot = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "EquipPoint");
Clazz.makeConstructor (c$, 
function () {
this.pos =  Clazz.newDoubleArray (3, 0);
});
Clazz.makeConstructor (c$, 
function (a, b) {
this.pos =  Clazz.newDoubleArray (3, 0);
var c;
for (c = 0; c != 3; c++) this.pos[c] = .5 * (a.pos[c] + b.pos[c]);

this.b$["com.falstad.Vec3DemoFrame"].curfunc.getField (this.b$["com.falstad.Vec3DemoFrame"].potfield, this.pos);
this.pot = this.b$["com.falstad.Vec3DemoFrame"].reverse * this.b$["com.falstad.Vec3DemoFrame"].potfield[0];
}, "com.falstad.Vec3DemoFrame.EquipPoint,com.falstad.Vec3DemoFrame.EquipPoint");
Clazz.defineMethod (c$, "set", 
function (a, b, c, d, e, f) {
this.pos[a] = d;
this.pos[b] = e;
this.pos[c] = f;
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "valid", 
function () {
return !(Double.isNaN (this.pot) || Double.isInfinite (this.pot));
});
Clazz.defineMethod (c$, "inRange", 
function () {
return (this.pot >= -2 && this.pot <= 2);
});
Clazz.defineMethod (c$, "setPot", 
function (a) {
this.pot = a;
}, "~N");
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$MagnetState$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.pos = null;
this.vel = null;
this.theta = null;
this.phi = null;
this.thetav = null;
this.phiv = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "MagnetState");
Clazz.makeConstructor (c$, 
function () {
this.pos =  Clazz.newDoubleArray (3, 0);
this.vel =  Clazz.newDoubleArray (3, 0);
});
Clazz.defineMethod (c$, "copy", 
function (a) {
var b;
for (b = 0; b != 3; b++) {
this.pos[b] = a.pos[b];
this.vel[b] = a.vel[b];
this.theta = a.theta;
this.thetav = a.thetav;
this.phi = a.phi;
this.phiv = a.phiv;
}
}, "com.falstad.Vec3DemoFrame.MagnetState");
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$VecFunction$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "VecFunction");
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
Clazz.defineMethod (c$, "noSplitFieldVectors", 
function () {
return true;
});
Clazz.defineMethod (c$, "getViewPri", 
function (a, b) {
return 0;
}, "~A,~A");
Clazz.defineMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
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
Clazz.defineMethod (c$, "getBestSlice", 
function () {
var a =  Clazz.newDoubleArray (3, 0);
var b =  Clazz.newDoubleArray (3, 0);
var c =  Clazz.newDoubleArray (3, 0);
var d =  Clazz.newDoubleArray (3, 0);
a[0] = a[1] = a[2] = .9;
this.b$["com.falstad.Vec3DemoFrame"].curfunc.getField (b, a);
a[0] = .91;
this.b$["com.falstad.Vec3DemoFrame"].curfunc.getField (c, a);
a[0] = .9;
a[1] = .91;
this.b$["com.falstad.Vec3DemoFrame"].curfunc.getField (d, a);
if (b[0] == c[0] && b[1] == c[1] && b[2] == c[2]) return 1;
if (b[0] == d[0] && b[1] == d[1] && b[2] == d[2]) return 2;
return 3;
});
Clazz.defineMethod (c$, "renderSphere", 
function (a, b) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 2);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].drawSphere (a, b, true);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (0, 0, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
var c = Clazz.doubleToInt (this.b$["com.falstad.Vec3DemoFrame"].getScalingFactor (0, 0, 0) * b);
a.drawOval (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0] - c, this.b$["com.falstad.Vec3DemoFrame"].ypoints[0] - c, c * 2, c * 2);
this.b$["com.falstad.Vec3DemoFrame"].drawSphere (a, b, false);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics,~N");
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseSquaredRadial$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseSquaredRadial", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV ("point charge", null, "1/r^2 single");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.Vec3DemoFrame.distanceArray (b);
if (c < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = -0.1 / c;
return;
}var d = c * c * c;
var e = .0003 / d;
a[0] = -b[0] * e;
a[1] = -b[1] * e;
a[2] = -b[2] * e;
}, "~A,~A");
Clazz.defineMethod (c$, "drawCharge", 
function (a, b, c, d) {
this.drawCharge (a, b, c, d, 0);
}, "java.awt.Graphics,~N,~N,~N");
Clazz.defineMethod (c$, "drawCharge", 
function (a, b, c, d, e) {
this.b$["com.falstad.Vec3DemoFrame"].map3d (b, c, d, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (b, c, d + .3 * e * this.b$["com.falstad.Vec3DemoFrame"].reverse, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var f = Clazz.doubleToInt (this.b$["com.falstad.Vec3DemoFrame"].getScalingFactor (b, c, d) * 0.06);
a.fillOval (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0] - f, this.b$["com.falstad.Vec3DemoFrame"].ypoints[0] - f, f * 2, f * 2);
if (e != 0) this.b$["com.falstad.Vec3DemoFrame"].drawArrow (a, null, this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1], 5);
}, "java.awt.Graphics,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.drawCharge (a, 0, 0, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c;
c = this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], 0.06);
if (c == 0) return 1;
if (c == 1) return -1;
return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadialDouble, this, null);
});
Clazz.defineStatics (c$,
"chargeSize", .06);
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseSquaredRadialDouble$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.sign2 = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseSquaredRadialDouble", com.falstad.Vec3DemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV ("point charge double", null, "1/r^2 double");
});
Clazz.overrideMethod (c$, "getBestSlice", 
function () {
return 2;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = b[0] - c;
var e = b[0] + c;
var f = com.falstad.Vec3DemoFrame.distance3 (d, b[1], b[2]);
if (f < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var g = com.falstad.Vec3DemoFrame.distance3 (e, b[1], b[2]);
if (g < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = -0.05 / f - .05 * this.sign2 / g;
if (this.sign2 == -1) a[0] *= 2;
return;
}var h = .0003;
var i = h / (f * f * f);
var j = h / (g * g * g) * this.sign2;
a[0] = -d * i - e * j;
a[1] = -b[1] * i - b[1] * j;
a[2] = -b[2] * i - b[2] * j;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.sign2 = 1;
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Charge Separation", 30);
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.drawCharge (a, +b, 0, 0);
this.drawCharge (a, -b, 0, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
if (this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], +c, 0, 0, 0.06) == 0 && this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], -c, 0, 0, 0.06) == 0) return 1;
return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadialDipole, this, null), null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadial, this, null));
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseSquaredRadialDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseSquaredRadialDipole", com.falstad.Vec3DemoFrame.InverseSquaredRadialDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadialDouble, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "dipole";
});
Clazz.defineMethod (c$, "setup", 
function () {
Clazz.superCall (this, com.falstad.Vec3DemoFrame.InverseSquaredRadialDipole, "setup", []);
this.sign2 = -1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadialQuad, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseSquaredRadialQuad$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseSquaredRadialQuad", com.falstad.Vec3DemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "quadrupole";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = b[0] - c;
var e = b[0] + c;
var f = b[1] - c;
var g = b[1] + c;
var h = b[2];
var i = com.falstad.Vec3DemoFrame.distance3 (d, f, h);
var j = com.falstad.Vec3DemoFrame.distance3 (e, f, h);
var k = com.falstad.Vec3DemoFrame.distance3 (d, g, h);
var l = com.falstad.Vec3DemoFrame.distance3 (e, g, h);
if (i < 0.06 || j < 0.06 || k < 0.06 || l < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = .05 * (-1 / i + 1 / j + 1 / k - 1 / l);
return;
}var m = .0003;
var n = m / (i * i * i);
var o = m / (j * j * j);
var p = m / (k * k * k);
var q = m / (l * l * l);
a[0] = -d * n - e * q + e * o + d * p;
a[1] = -f * n - g * q + f * o + g * p;
a[2] = -h * n - h * q + h * o + h * p;
}, "~A,~A");
Clazz.defineMethod (c$, "setup", 
function () {
Clazz.superCall (this, com.falstad.Vec3DemoFrame.InverseSquaredRadialQuad, "setup", []);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Charge Separation", 30);
this.b$["com.falstad.Vec3DemoFrame"].setXYViewExact ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var c;
var d;
for (c = -1; c <= 1; c += 2) for (d = -1; d <= 1; d += 2) this.drawCharge (a, c * b, d * b, 0);


this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d;
var e;
for (d = -1; d <= 1; d += 2) for (e = -1; e <= 1; e += 2) if (this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], d * c, e * c, 0, .06) != 0) return 0;


return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadial, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRadial$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.lineLen = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRadial", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV ("charged line", null, "1/r single line");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
if (c < 0.01) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = .4 * java.lang.Math.log (c + 1e-20);
return;
}var d = c * c;
a[0] = -3.0E-4 * b[0] / d;
a[1] = -3.0E-4 * b[1] / d;
a[2] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.lineLen = 1;
});
Clazz.overrideMethod (c$, "render", 
function (a) {
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (0, 0, -this.lineLen, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (0, 0, +this.lineLen, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], 0.01, true) == 0) return 1;
if (this.b$["com.falstad.Vec3DemoFrame"].intersection[2] >= -this.lineLen && this.b$["com.falstad.Vec3DemoFrame"].intersection[2] <= this.lineLen) return 0;
return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadialDouble, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRadialDouble$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.sign = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRadialDouble", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.InverseRadialDouble, []);
this.sign = 1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV ("line charge double", null, "1/r double lines");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = b[0] - c;
var e = b[0] + c;
var f = com.falstad.Vec3DemoFrame.distance2 (d, b[1]);
var g = com.falstad.Vec3DemoFrame.distance2 (e, b[1]);
if (f < 0.01 || g < 0.01) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = .2 * (java.lang.Math.log (f + 1e-20) + this.sign * java.lang.Math.log (g + 1e-20));
return;
}var h = .0003;
var i = 1 / (f * f);
var j = 1 / (g * g * this.sign);
a[0] = h * (-d * i - e * j);
a[1] = h * (-b[1] * i - b[1] * j);
a[2] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Line Separation", 30);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var c;
for (c = -1; c <= 1; c += 2) {
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, 0, -1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, 0, 1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c;
var d = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
for (c = -1; c <= 1; c += 2) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], c * d, 0, 0.01, true) != 0) return 0;
}
return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadialDipole, this, null), null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotational, this, null));
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRadialDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRadialDipole", com.falstad.Vec3DemoFrame.InverseRadialDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadialDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.InverseRadialDipole, []);
this.sign = -1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dipole lines";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadialQuad, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRadialQuad$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRadialQuad", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "quad lines";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = b[0] + c;
var e = b[0] - c;
var f = b[1] + c;
var g = b[1] - c;
var h = com.falstad.Vec3DemoFrame.distance2 (d, f);
var i = com.falstad.Vec3DemoFrame.distance2 (e, f);
var j = com.falstad.Vec3DemoFrame.distance2 (d, g);
var k = com.falstad.Vec3DemoFrame.distance2 (e, g);
if (h < 0.01 || i < 0.01 || j < 0.01 || k < 0.01) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = .2 * (+java.lang.Math.log (h + 1e-20) - java.lang.Math.log (i + 1e-20) - java.lang.Math.log (j + 1e-20) + java.lang.Math.log (k + 1e-20));
return;
}var l = .0003;
a[0] = l * (-d / (h * h) - e / (k * k) + e / (i * i) + d / (j * j));
a[1] = l * (-f / (h * h) - g / (k * k) + f / (i * i) + g / (j * j));
a[2] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Line Separation", 30);
this.b$["com.falstad.Vec3DemoFrame"].setXYViewExact ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var c;
var d;
for (c = -1; c <= 1; c += 2) {
for (d = -1; d <= 1; d += 2) {
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, b * d, -1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, b * d, 1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
}
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c;
var d;
var e = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
for (c = -1; c <= 1; c += 2) {
for (d = -1; d <= 1; d += 2) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], c * e, d * e, .01, true) != 0) return 0;
}
}
return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FiniteChargedLine, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$FiniteChargedLine$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "FiniteChargedLine", com.falstad.Vec3DemoFrame.InverseRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "finite line";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Line Length", 30);
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.lineLen = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 101.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
a[0] = a[1] = a[2] = 0;
this.getLineField (a, b, 0);
}, "~A,~A");
Clazz.defineMethod (c$, "getLineField", 
function (a, b, c) {
var d = -this.lineLen - b[2];
var e = this.lineLen - b[2];
var f = com.falstad.Vec3DemoFrame.distance2 (b[0] - c, b[1]);
if (f < 0.01 && d <= 0 && e >= 0) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var g = f * f;
var h = d * d;
var i = e * e;
var j = java.lang.Math.sqrt (h + g);
var k = java.lang.Math.sqrt (i + g);
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] -= .2 * java.lang.Math.log ((e + k) / (d + j));
return;
}var l = .0001 / this.lineLen;
var m = l * (-1 / (h + g + d * j) + 1 / (i + g + e * k));
a[0] += m * (b[0] - c);
a[1] += m * b[1];
a[2] += l * (1 / j - 1 / k);
}, "~A,~A,~N");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FiniteChargedLinePair, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$FiniteChargedLinePair$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.dipole = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "FiniteChargedLinePair", com.falstad.Vec3DemoFrame.FiniteChargedLine, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FiniteChargedLine, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.FiniteChargedLinePair, []);
this.dipole = 1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "finite line pair";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Line Length", 30);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Line Separation", 30);
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.lineLen = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 101.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
a[0] = a[1] = a[2] = 0;
this.getLineField (a, b, +c);
a[0] *= this.dipole;
a[1] *= this.dipole;
a[2] *= this.dipole;
this.getLineField (a, b, -c);
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var c;
for (c = -1; c <= 1; c += 2) {
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, 0, -this.lineLen, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, 0, +this.lineLen, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c;
var d = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
for (c = -1; c <= 1; c += 2) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], c * d, 0, 0.01, true) != 0) if (this.b$["com.falstad.Vec3DemoFrame"].intersection[2] >= -this.lineLen && this.b$["com.falstad.Vec3DemoFrame"].intersection[2] <= this.lineLen) return 0;
}
return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FiniteChargedLineDipole, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$FiniteChargedLineDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "FiniteChargedLineDipole", com.falstad.Vec3DemoFrame.FiniteChargedLinePair, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FiniteChargedLinePair, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.FiniteChargedLineDipole, []);
this.dipole = -1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "finite line dipole";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ConductingPlate, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ConductingPlate$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.z = null;
this.plate = false;
this.a = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ConductingPlate", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting plate";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.ConductingPlate, []);
this.z =  new com.falstad.Complex ();
this.plate = true;
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.a = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 100.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
if (b[2] >= -0.02 && b[2] <= .02) {
if ((this.plate && b[0] >= -this.a && b[0] <= this.a) || (!this.plate && (b[0] >= this.a || b[0] <= -this.a))) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
}this.z.setReIm (b[0] / this.a, b[2] / this.a);
if (b[2] < 0 && this.plate) this.z.im = -this.z.im;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
this.z.arcsin ();
a[0] = (this.plate) ? this.z.im * .6 * this.a : -this.z.re * .6;
return;
}this.z.square ();
this.z.multRe (-1);
this.z.addRe (1);
this.z.pow (-0.5);
this.z.multRe (1 / this.a);
if (this.plate) {
a[2] = this.z.re * -7.0E-4;
a[0] = this.z.im * -7.0E-4;
if (b[2] < 0) a[2] = -a[2];
} else {
a[0] = this.z.re * .0007;
a[2] = -this.z.im * .0007;
}a[1] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, 0, b[0], b[1], b[2]) != 0) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersection[0] >= -this.a && this.b$["com.falstad.Vec3DemoFrame"].intersection[0] <= this.a) return 1;
}return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].drawPlane (a, this.a, 1, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Plate Size", 60);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedPlate, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ChargedPlate$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.cz = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ChargedPlate", com.falstad.Vec3DemoFrame.ConductingPlate, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ConductingPlate, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.ChargedPlate, []);
this.cz =  new com.falstad.Complex ();
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged plate";
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
return .2 * (2 * (a - b) + (d - this.cz.im) * c + b * java.lang.Math.log (b * b + e) - a * java.lang.Math.log (a * a + e));
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
if (b[2] >= -0.01 && b[2] <= .01 && (b[0] >= -this.a && b[0] <= this.a)) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var c = -this.a - b[0];
var d = this.a - b[0];
var e = b[2] * b[2];
if (e == 0) e = 1e-8;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = this.getPot (c, d, b[2]);
return;
}var f = .0003 / this.a;
a[0] = .5 * f * java.lang.Math.log ((e + d * d) / (e + c * c));
a[1] = 0;
a[2] = f * (java.lang.Math.atan (c / b[2]) - java.lang.Math.atan (d / b[2]));
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedPlatePair, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ChargedPlatePair$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ChargedPlatePair", com.falstad.Vec3DemoFrame.ChargedPlate, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedPlate, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged plate pair";
});
Clazz.overrideMethod (c$, "useRungeKutta", 
function () {
return false;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
if ((b[2] >= -0.01 + c && b[2] <= .01 + c || b[2] >= -0.01 - c && b[2] <= .01 - c) && b[0] >= -this.a && b[0] <= this.a) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var d = -this.a - b[0];
var e = this.a - b[0];
var f = b[2] - c;
var g = f * f;
if (g == 0) g = 1e-8;
var h = b[2] + c;
var i = h * h;
if (i == 0) i = 1e-8;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = this.getPot (d, e, f) - this.getPot (d, e, h);
return;
}var j = .0003 / this.a;
a[0] = .5 * j * (java.lang.Math.log ((g + e * e) / (g + d * d)) - java.lang.Math.log ((i + e * e) / (i + d * d)));
a[1] = 0;
a[2] = j * (java.lang.Math.atan (d / f) - java.lang.Math.atan (e / f) - java.lang.Math.atan (d / h) + java.lang.Math.atan (e / h));
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Sheet Size", 30);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Sheet Separation", 33);
this.b$["com.falstad.Vec3DemoFrame"].setXZViewExact ();
});
Clazz.overrideMethod (c$, "checkBounds", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
if (a[0] >= -c && a[0] <= c) {
if (a[2] > d) {
if (b[2] < d) return true;
} else if (a[2] < -d) {
if (b[2] > -d) return true;
} else if (b[2] > d || b[2] < -d) return true;
}return false;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d;
for (d = 0; d != 2; d++) {
var e = (d == 0) ? b : -b;
this.b$["com.falstad.Vec3DemoFrame"].drawPlane (a, c, 1, e);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
var d = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, +c, b[0], b[1], b[2]) != 0) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersection[0] >= -d && this.b$["com.falstad.Vec3DemoFrame"].intersection[0] <= d) return 0;
}if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, -c, b[0], b[1], b[2]) != 0) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersection[0] >= -d && this.b$["com.falstad.Vec3DemoFrame"].intersection[0] <= d) return 0;
}return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InfiniteChargedPlane, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InfiniteChargedPlane$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InfiniteChargedPlane", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "infinite plane";
});
Clazz.overrideMethod (c$, "getBestSlice", 
function () {
return 2;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .0003;
if (b[2] > -0.01 && b[2] < .01) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = java.lang.Math.abs (b[2]) - 1;
return;
}a[0] = 0;
a[1] = 0;
a[2] = (b[2] < 0) ? c : -c;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
this.b$["com.falstad.Vec3DemoFrame"].drawPlane (a, 1, 1, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, 0, b[0], b[1], b[2]) == 0) return 0;
return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "checkBoundsWithForce", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SphereAndPointCharge, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$SphereAndPointCharge$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "SphereAndPointCharge", com.falstad.Vec3DemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting sphere + pt";
});
Clazz.defineMethod (c$, "getSphereRadius", 
function () {
return (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 110.;
});
Clazz.defineMethod (c$, "getSeparation", 
function () {
return this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
});
Clazz.defineMethod (c$, "getSpherePos", 
function () {
return this.getSeparation () / 2;
});
Clazz.defineMethod (c$, "getPointPos", 
function () {
return -this.getSeparation () / 2 - this.getSphereRadius ();
});
Clazz.overrideMethod (c$, "getBestSlice", 
function () {
return 2;
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Sphere Size", 30);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Separation", 50);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "Sphere Potential", 50);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = -3.0E-4;
var d = this.getSphereRadius ();
var e = this.getSeparation () + d;
var f = this.getSpherePos ();
var g = -c * d / e;
var h = f - d * d / e;
var i = b[0] - f;
var j = com.falstad.Vec3DemoFrame.distance3 (i, b[1], b[2]);
if (j < d) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var k = (this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () - 50) * .002 * d / 50.;
var l = b[0] - h;
var m = com.falstad.Vec3DemoFrame.distance3 (l, b[1], b[2]);
var n = b[0] - this.getPointPos ();
var o = com.falstad.Vec3DemoFrame.distance3 (n, b[1], b[2]);
if (o < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = 400 * (k / j + g / m + c / o);
return;
}var p = k / (j * j * j);
var q = g / (m * m * m);
var r = c / (o * o * o);
a[0] = i * p + l * q + n * r;
a[1] = b[1] * (p + q + r);
a[2] = b[2] * (p + q + r);
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (this.b$["com.falstad.Vec3DemoFrame"].cameraPos, this.getPointPos () - this.getSpherePos (), 0, 0, this.getSphereRadius ());
if (b != 0) this.drawCharge (a, this.getPointPos (), 0, 0, 0);
this.b$["com.falstad.Vec3DemoFrame"].fillSphere (a, this.getSphereRadius (), this.getSpherePos ());
if (b == 0) this.drawCharge (a, this.getPointPos (), 0, 0, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], this.getSpherePos (), 0, 0, this.getSphereRadius ()) != 0) return -1;
if (this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], this.getPointPos (), 0, 0, 0.06) != 0) return -1;
return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedSphereAndPointCharge, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ChargedSphereAndPointCharge$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ChargedSphereAndPointCharge", com.falstad.Vec3DemoFrame.SphereAndPointCharge, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SphereAndPointCharge, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged sphere + pt";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Sphere Size", 30);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Separation", 50);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "Sphere Charge", 50);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = -3.0E-4;
var d = this.getSphereRadius ();
var e = this.getSeparation () + d;
var f = this.getSpherePos ();
var g = b[0] - f;
var h = com.falstad.Vec3DemoFrame.distance3 (g, b[1], b[2]);
if (h < d) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var i = (this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () - 50) * .0006 / 50.;
var j = b[0] - this.getPointPos ();
var k = com.falstad.Vec3DemoFrame.distance3 (j, b[1], b[2]);
if (k < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = 300 * (i / h + c / k);
return;
}var l = i / (h * h * h);
var m = c / (k * k * k);
a[0] = g * l + j * m;
a[1] = b[1] * (l + m);
a[2] = b[2] * (l + m);
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CylinderAndLineCharge, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CylinderAndLineCharge$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CylinderAndLineCharge", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "cyl + line charge";
});
Clazz.defineMethod (c$, "getCylRadius", 
function () {
return (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 110.;
});
Clazz.defineMethod (c$, "getSeparation", 
function () {
return this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
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
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Cylinder Size", 30);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Separation", 30);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "Cylinder Potential", 50);
this.b$["com.falstad.Vec3DemoFrame"].setXYView ();
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = -3.0E-4;
var d = this.getCylRadius ();
var e = this.getSeparation () + d;
var f = this.getCylPos ();
var g = f - d * d / e;
var h = b[0] - f;
var i = com.falstad.Vec3DemoFrame.distance2 (h, b[1]);
if (i < d) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var j = b[0] - g;
var k = com.falstad.Vec3DemoFrame.distance2 (j, b[1]);
var l = b[0] - this.getPointPos ();
var m = com.falstad.Vec3DemoFrame.distance2 (l, b[1]);
var n = .06;
if (m < n) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var o = c * (java.lang.Math.exp (e - d) - 1) + (this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () / 50. - 1) * d * .0006;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = -700 * (o * java.lang.Math.log (i + 1e-20) - c * java.lang.Math.log (k + 1e-20) + c * java.lang.Math.log (m + 1e-20));
return;
}var p = o / (i * i);
var q = -c / (k * k);
var r = c / (m * m);
a[0] = h * p + j * q + l * r;
a[1] = b[1] * (p + q + r);
a[2] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (this.b$["com.falstad.Vec3DemoFrame"].cameraPos, this.getPointPos (), 0, 0, this.getCylPos (), 0, this.getCylRadius (), false);
if (b == 0) this.b$["com.falstad.Vec3DemoFrame"].fillCylinder (a, this.getCylRadius (), this.getCylPos ());
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.getPointPos (), 0, -1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.getPointPos (), 0, 1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
if (b != 0) this.b$["com.falstad.Vec3DemoFrame"].fillCylinder (a, this.getCylRadius (), this.getCylPos ());
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], this.getPointPos (), 0, 0.01, true) != 0) return -1;
if (this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], this.getCylPos (), 0, this.getCylRadius (), true) != 0) return -1;
return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SphereInField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$SphereInField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.conducting = false;
this.showD = false;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "SphereInField", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.SphereInField, []);
this.conducting = true;
this.showD = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting sphere in field";
});
Clazz.overrideMethod (c$, "getBestSlice", 
function () {
return 2;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = c * c * c;
var e = com.falstad.Vec3DemoFrame.distanceArray (b);
var f = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 10. + 1;
var g = (this.conducting) ? 1 : (f - 1) / (f + 2);
var h = .0006;
if (e < c) {
a[0] = a[1] = 0;
if (this.conducting) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
 else {
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) a[0] = -(1 - g) * b[2];
 else a[2] = (this.showD) ? f * h * (1 - g) : h * (1 - g);
}return;
}var i = b[2] / e;
var j = java.lang.Math.sqrt (1 - i * i);
var k = b[0] / (e * j);
var l = b[1] / (e * j);
var m = 1 / (e * e * e);
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = -(1 - g * d * m) * b[2];
return;
}var n = (1 + g * 2 * d * m) * i * h;
var o = -(1 - g * d * m) * j * h;
n /= e;
a[0] = b[0] * n + o * i * k;
a[1] = b[1] * n + o * i * l;
a[2] = b[2] * n - o * j;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Sphere Size", 60);
this.b$["com.falstad.Vec3DemoFrame"].setXZViewExact ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.b$["com.falstad.Vec3DemoFrame"].fillSphere (a, b, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
return this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], c);
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricSphereInFieldE, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$DielectricSphereInFieldE$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "DielectricSphereInFieldE", com.falstad.Vec3DemoFrame.SphereInField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SphereInField, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.DielectricSphereInFieldE, []);
this.conducting = false;
this.showD = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dielec sphere in field E";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Sphere Size", 60);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Dielectric Strength", 60);
this.b$["com.falstad.Vec3DemoFrame"].setXZViewExact ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.renderSphere (a, b);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
return this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], c);
}, "~A,~A");
Clazz.overrideMethod (c$, "noSplitFieldVectors", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricSphereInFieldD, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$DielectricSphereInFieldD$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "DielectricSphereInFieldD", com.falstad.Vec3DemoFrame.DielectricSphereInFieldE, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricSphereInFieldE, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.DielectricSphereInFieldD, []);
this.conducting = false;
this.showD = true;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dielec sphere in field D";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CylinderInField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CylinderInField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.conducting = false;
this.showD = false;
this.a = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CylinderInField", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.CylinderInField, []);
this.conducting = true;
this.showD = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "cylinder in field";
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.a = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.a * this.a;
var d = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
var e = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 10. + 1;
var f = (this.conducting) ? 1 : (e - 1) / (e + 1);
var g = .0006;
if (d < this.a) {
a[0] = a[1] = a[2] = 0;
if (this.conducting) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
 else if (this.b$["com.falstad.Vec3DemoFrame"].getPot) a[0] = -(1 - f) * b[0];
 else a[0] = (this.showD) ? e * g * (1 - f) : g * (1 - f);
return;
}var h = b[0] / d;
var i = b[1] / d;
var j = 1 / (d * d);
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = -(1 - f * c * j) * b[0];
return;
}var k = (1 + f * c * j) * h * g;
var l = -(1 - f * c * j) * i * g;
k /= d;
a[0] = b[0] * k - l * i;
a[1] = b[1] * k + l * h;
a[2] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Cylinder Size", 40);
this.b$["com.falstad.Vec3DemoFrame"].setXYView ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].fillCylinder (a, this.a, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
return this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], this.a, this.conducting);
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricCylinderInFieldE, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$DielectricCylinderInFieldE$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "DielectricCylinderInFieldE", com.falstad.Vec3DemoFrame.CylinderInField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CylinderInField, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.DielectricCylinderInFieldE, []);
this.conducting = false;
this.showD = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dielec cyl in field E";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Cylinder Size", 40);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Dielectric Strength", 60);
this.b$["com.falstad.Vec3DemoFrame"].setXYView ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 2);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].drawCylinder (a, this.a, 0, true);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].drawCylinder (a, this.a, 0, false);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "noSplitFieldVectors", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricCylinderInFieldD, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$DielectricCylinderInFieldD$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "DielectricCylinderInFieldD", com.falstad.Vec3DemoFrame.DielectricCylinderInFieldE, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricCylinderInFieldE, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.DielectricCylinderInFieldD, []);
this.conducting = false;
this.showD = true;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dielec cyl in field D";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricBoundaryE, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$DielectricBoundaryE$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.showD = false;
this.conducting = false;
this.planeZ = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "DielectricBoundaryE", com.falstad.Vec3DemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.DielectricBoundaryE, []);
this.conducting = false;
this.showD = false;
});
Clazz.overrideMethod (c$, "getBestSlice", 
function () {
return 2;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dielec boundary E";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Charge Location", 60);
if (!this.conducting) this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Dielectric Strength", 60);
this.b$["com.falstad.Vec3DemoFrame"].setViewMatrix (0, -1.4922565104551517);
});
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
this.b$["com.falstad.Vec3DemoFrame"].drawPlane (a, 1, 1, this.planeZ);
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 50. - 1.001;
this.drawCharge (a, 0, 0, b);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 50. - 1.001;
if (this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2] - c, 0.06) == 0 && this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, 0, b[0], b[1], b[2] - this.planeZ) == 0) return 0;
return 1;
}, "~A,~A");
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 50. - 1.001;
var d = com.falstad.Vec3DemoFrame.distance3 (b[0], b[1], b[2] - c);
if (d < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var e = 1;
var f = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 10. + 1;
if (this.conducting) f = 1e8;
if (c < this.planeZ) {
e = f;
f = 1;
}var g = .0003;
var h = -(f - e) / (f + e) * g;
var i = e;
if (c > this.planeZ && b[2] < this.planeZ || c < this.planeZ && b[2] > this.planeZ) {
g = 2 * f * g / (f + e);
h = 0;
i = f;
}var j = com.falstad.Vec3DemoFrame.distance3 (b[0], b[1], b[2] - this.planeZ * 2 + c);
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = -1000 * (g / (d * i) + h / (j * i));
return;
}if (!this.showD) {
g /= i;
h /= i;
}var k = g / (d * d * d);
var l = h / (j * j * j);
a[0] = -b[0] * (k + l);
a[1] = -b[1] * (k + l);
a[2] = -(b[2] - c) * k - (b[2] - this.planeZ * 2 + c) * l;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricBoundaryD, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$DielectricBoundaryD$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "DielectricBoundaryD", com.falstad.Vec3DemoFrame.DielectricBoundaryE, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricBoundaryE, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.DielectricBoundaryD, []);
this.conducting = false;
this.showD = true;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "dielec boundary D";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ConductingPlane, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ConductingPlane$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ConductingPlane", com.falstad.Vec3DemoFrame.DielectricBoundaryE, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.DielectricBoundaryE, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.ConductingPlane, []);
this.conducting = true;
this.showD = false;
this.planeZ = -1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting plane + pt";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FastChargeEField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$MovingChargeField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "MovingChargeField", com.falstad.Vec3DemoFrame.InverseSquaredRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "moving charge";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.Vec3DemoFrame.distanceArray (b);
if (this.b$["com.falstad.Vec3DemoFrame"].showA) {
a[0] = a[1] = 0;
a[2] = .0003 / c;
} else {
var d = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
if (c < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
this.b$["com.falstad.Vec3DemoFrame"].rotateParticle (a, b, .0001 / (c * c * c));
}}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.drawCharge (a, 0, 0, 0, 1);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.FastChargeField, this, null), null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$FastChargeEField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "FastChargeEField", com.falstad.Vec3DemoFrame.MovingChargeField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MovingChargeField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "fast charge";
});
Clazz.overrideMethod (c$, "getBestSlice", 
function () {
return 2;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.Vec3DemoFrame.distanceArray (b);
if (c < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var d = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
var e = d / c;
var f = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 102.;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = -0.1 / (c * java.lang.Math.pow (1 - f * f * e * e, .5));
return;
}var g = -1.0E-4 * (1 - f * f) / (c * c * c * java.lang.Math.pow (1 - f * f * e * e, 1.5));
a[0] = g * b[0];
a[1] = g * b[1];
a[2] = g * b[2];
}, "~A,~A");
Clazz.defineMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Speed/C", 60);
Clazz.superCall (this, com.falstad.Vec3DemoFrame.FastChargeEField, "setup", []);
});
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedRing, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$SlottedPlane$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.z = null;
this.z2 = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "SlottedPlane", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "slotted conducting plane";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.SlottedPlane, []);
this.z =  new com.falstad.Complex ();
this.z2 =  new com.falstad.Complex ();
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 101.;
if (b[2] >= -0.01 && b[2] <= .01 && (b[0] < -c || b[0] > c)) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
this.z.setReIm (b[0], b[2]);
this.z2.set (this.z);
this.z2.square ();
this.z2.addRe (-c * c);
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
this.z2.pow (.5);
if (this.z2.im < 0) this.z2.multRe (-1);
this.z2.add (this.z);
a[0] = -this.z2.im * .6;
return;
}this.z2.pow (-0.5);
if (this.z2.im > 0) this.z2.multRe (-1);
this.z2.mult (this.z);
a[2] = (1 + this.z2.re) * .003;
a[0] = (this.z2.im) * .003;
a[1] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Slot Size", 60);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, 0, b[0], b[1], b[2]) != 0) {
var c = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 101.;
if (this.b$["com.falstad.Vec3DemoFrame"].intersection[0] < -c || this.b$["com.falstad.Vec3DemoFrame"].intersection[0] > c) return 1;
}return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var b = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 101.;
this.b$["com.falstad.Vec3DemoFrame"].map3d (-1, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-b, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-b, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-1, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
a.fillPolygon (this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 4);
this.b$["com.falstad.Vec3DemoFrame"].map3d (1, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (b, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (b, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (1, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
a.fillPolygon (this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 4);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.PlanePair, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$PlanePair$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "PlanePair", com.falstad.Vec3DemoFrame.ConductingPlate, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ConductingPlate, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "conducting planes w/ gap";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.PlanePair);
this.plate = false;
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Gap Size", 20);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, 0, b[0], b[1], b[2]) != 0) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersection[0] < -this.a || this.b$["com.falstad.Vec3DemoFrame"].intersection[0] > this.a) return 1;
}return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-1, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-this.a, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-this.a, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-1, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
a.fillPolygon (this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 4);
this.b$["com.falstad.Vec3DemoFrame"].map3d (1, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.a, -1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.a, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (1, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
a.fillPolygon (this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 4);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "createNext", 
function () {
return null;
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRotational$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRotational", com.falstad.Vec3DemoFrame.InverseRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, "current line", "1/r rotational");
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXYViewExact ();
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
if (this.b$["com.falstad.Vec3DemoFrame"].showA) {
a[0] = a[1] = 0;
a[2] = -0.001 * (java.lang.Math.log (c) - .5);
} else {
if (c < 0.02) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
this.b$["com.falstad.Vec3DemoFrame"].rotateParticle (a, b, .0001 / (c * c));
}}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (0, 0, -1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (0, 0, 1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].drawCurrentLine (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1], 12, true, 1);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotationalDouble, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRotationalDouble$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.dir2 = 0;
this.ext = false;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRotationalDouble", com.falstad.Vec3DemoFrame.InverseRadialDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadialDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.InverseRotationalDouble, []);
this.dir2 = 1;
this.ext = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, "current line double", "1/r rotational double");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = com.falstad.Vec3DemoFrame.distance2 (b[0] - c, b[1]);
var e = com.falstad.Vec3DemoFrame.distance2 (b[0] + c, b[1]);
if (this.ext) {
var f = this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () * 3.141592653589793 / 50.;
var g = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 30.;
this.b$["com.falstad.Vec3DemoFrame"].getDirectionField (a, b, 1.5707963267948966, f);
a[0] *= g;
a[1] *= g;
a[2] *= g;
} else a[0] = a[1] = a[2] = 0;
if (this.b$["com.falstad.Vec3DemoFrame"].showA) {
if (this.dir2 == 1) a[2] += -0.001 * (java.lang.Math.log (d) + java.lang.Math.log (e) - 1);
 else a[2] += -0.001 * (java.lang.Math.log (d) - java.lang.Math.log (e));
} else {
if (d < 0.02) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
this.b$["com.falstad.Vec3DemoFrame"].rotateParticleAdd (a, b, .0001 / (d * d), c, 0);
if (e < 0.02) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
this.b$["com.falstad.Vec3DemoFrame"].rotateParticleAdd (a, b, this.dir2 * .0001 / (e * e), -c, 0);
}}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Line Separation", 30);
if (this.ext) {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Ext. Strength", 28);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "Ext. Direction", 0);
}this.b$["com.falstad.Vec3DemoFrame"].setXYViewExact ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var c;
for (c = -1; c <= 1; c += 2) {
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, 0, -1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (b * c, 0, 1, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
var d = (c == -1) ? this.dir2 : 1;
this.b$["com.falstad.Vec3DemoFrame"].drawCurrentLine (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1], 12, true, d);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotationalDoubleExt, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRotationalDoubleExt$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRotationalDoubleExt", com.falstad.Vec3DemoFrame.InverseRotationalDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotationalDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.InverseRotationalDoubleExt, []);
this.ext = true;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, "cur line double + ext", "1/r rot double + ext");
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotationalDipole, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRotationalDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRotationalDipole", com.falstad.Vec3DemoFrame.InverseRotationalDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotationalDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.InverseRotationalDipole, []);
this.dir2 = -1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, "current line dipole", "1/r rotational dipole");
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotationalDipoleExt, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseRotationalDipoleExt$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseRotationalDipoleExt", com.falstad.Vec3DemoFrame.InverseRotationalDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRotationalDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.InverseRotationalDipoleExt, []);
this.dir2 = -1;
this.ext = true;
});
Clazz.defineMethod (c$, "setup", 
function () {
Clazz.superCall (this, com.falstad.Vec3DemoFrame.InverseRotationalDipoleExt, "setup", []);
this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.setValue (17);
this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.setValue (25);
});
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, "cur line dipole + ext", "1/r rot dipole + ext");
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.OneDirectionFunction, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$OneDirectionFunction$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "OneDirectionFunction", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, "uniform field", "one direction");
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () * 3.141592653589793 / 50.;
var d = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () * 3.141592653589793 / 50.;
this.b$["com.falstad.Vec3DemoFrame"].getDirectionField (a, b, c, d);
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Theta", 25);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Phi", 0);
this.b$["com.falstad.Vec3DemoFrame"].setXYView ();
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MovingChargeField, this, null), Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadialSphere, this, null));
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$FastChargeField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "FastChargeField", com.falstad.Vec3DemoFrame.MovingChargeField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MovingChargeField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "fast charge";
});
Clazz.defineMethod (c$, "getFieldStrength", 
function (a) {
var b = com.falstad.Vec3DemoFrame.distanceArray (a);
if (b < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var c = com.falstad.Vec3DemoFrame.distance2 (a[0], a[1]);
var d = c / b;
var e = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 102.;
var f = .001 * (1 - e * e) * e / (b * b * java.lang.Math.pow (1 - e * e * d * d, 1.5));
return f;
}, "~A");
Clazz.defineMethod (c$, "setup", 
function () {
Clazz.superCall (this, com.falstad.Vec3DemoFrame.FastChargeField, "setup", []);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Speed/C", 60);
});
Clazz.overrideMethod (c$, "render", 
function (a) {
this.drawCharge (a, 0, 0, 0, this.b$["com.falstad.Vec3DemoFrame"].reverse);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].showA) {
var c = com.falstad.Vec3DemoFrame.distanceArray (b);
var d = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
var e = d / c;
var f = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 102.;
a[0] = a[1] = 0;
a[2] = .003 * f / (c * java.lang.Math.pow (1 - f * f * e * e, .5));
} else this.b$["com.falstad.Vec3DemoFrame"].rotateParticle (a, b, this.getFieldStrength (b));
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MovingChargeFieldDouble, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$MovingChargeFieldDouble$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.dir2 = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "MovingChargeFieldDouble", com.falstad.Vec3DemoFrame.InverseSquaredRadialDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquaredRadialDouble, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "moving charge double";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.MovingChargeFieldDouble, []);
this.dir2 = 1;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
a[0] = a[1] = a[2] = 0;
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = com.falstad.Vec3DemoFrame.distance3 (b[0] - c, b[1], b[2]);
var e = com.falstad.Vec3DemoFrame.distance3 (b[0] + c, b[1], b[2]);
if (this.b$["com.falstad.Vec3DemoFrame"].showA) {
a[0] = a[1] = 0;
a[2] = .0003 * (1 / d + this.dir2 / e);
} else {
var f = com.falstad.Vec3DemoFrame.distance2 (b[0] - c, b[1]);
if (d < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
this.b$["com.falstad.Vec3DemoFrame"].rotateParticleAdd (a, b, .0001 / (d * d * d), c, 0);
if (e < 0.06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
f = com.falstad.Vec3DemoFrame.distance2 (b[0] + c, b[1]);
this.b$["com.falstad.Vec3DemoFrame"].rotateParticleAdd (a, b, this.dir2 * .0001 / (e * e * e), -c, 0);
}}, "~A,~A");
Clazz.defineMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Charge Separation", 30);
Clazz.superCall (this, com.falstad.Vec3DemoFrame.MovingChargeFieldDouble, "setup", []);
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.drawCharge (a, +b, 0, 0, 1);
this.drawCharge (a, -b, 0, 0, this.dir2);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MovingChargeDipole, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$MovingChargeDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "MovingChargeDipole", com.falstad.Vec3DemoFrame.MovingChargeFieldDouble, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MovingChargeFieldDouble, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.MovingChargeDipole, []);
this.dir2 = -1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "moving charge dipole";
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CurrentLoopField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.colors = null;
this.useColor = false;
this.size = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CurrentLoopField", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.CurrentLoopField, []);
this.useColor = true;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "current loop";
});
Clazz.overrideMethod (c$, "useAdaptiveRungeKutta", 
function () {
return false;
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Loop Size", 40);
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 100.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
this.getLoopField (a, b, 0, 0, 1, this.size);
}, "~A,~A");
Clazz.defineMethod (c$, "getLoopField", 
function (a, b, c, d, e, f) {
var g = b[0] - c;
var h = b[1];
var i = b[2] - d;
var j;
a[0] = a[1] = a[2] = 0;
var k = 8;
var l = .0006 * e / (f * k);
var m = java.lang.Math.atan2 (b[1], b[0]);
for (j = 0; j != k; j++) {
var n = 3.141592653589793 * 2 * j / k;
var o = f * java.lang.Math.cos (n + m);
var p = f * java.lang.Math.sin (n + m);
var q = -p * l;
var r = o * l;
var s = g - o;
var t = h - p;
var u = i;
var v = java.lang.Math.sqrt (s * s + t * t + u * u);
if (!this.b$["com.falstad.Vec3DemoFrame"].showA) {
var w = v * v * v;
if (v < .04 && this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var x = r * u / w;
var y = -q * u / w;
var z = (q * t - r * s) / w;
a[0] += x;
a[1] += y;
a[2] += z;
} else {
a[0] += 6 * q / v;
a[1] += 6 * r / v;
}}
}, "~A,~A,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "checkBounds", 
function (a, b) {
if (!this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) return false;
if ((a[2] > 0 && b[2] < 0) || (a[2] < 0 && b[2] > 0)) {
var c = java.lang.Math.sqrt (a[0] * a[0] + a[1] * a[1]);
if (c < this.size) return true;
}return false;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
this.renderLoop (a, 0, 0, 1, this.size);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "renderLoop", 
function (a, b, c, d, e) {
var f = 72;
var g;
if (!this.useColor) a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
for (g = 0; g != 72; g++) {
var h = 3.141592653589793 * 2 * g / 72;
var i = 3.141592653589793 * 2 * (g + d) / 72;
var j = e * java.lang.Math.cos (h) + b;
var k = e * java.lang.Math.sin (h);
var l = e * java.lang.Math.cos (i) + b;
var m = e * java.lang.Math.sin (i);
this.b$["com.falstad.Vec3DemoFrame"].map3d (j, k, c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (l, m, c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
if (this.useColor) a.setColor (this.b$["com.falstad.Vec3DemoFrame"].getCurrentColor (g * d));
if (g == 0 && this.useColor) this.b$["com.falstad.Vec3DemoFrame"].drawCurrentArrow (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
 else a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
}
}, "java.awt.Graphics,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, 0, b[0], b[1], b[2]) != 0) return 1;
return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "noSplitFieldVectors", 
function () {
return false;
});
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return com.falstad.Vec3DemoFrame.BUILD_CASE_EMV (null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsSideField, this, null), null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CurrentLoopsSideField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.dir2 = 0;
this.offx = 0;
this.offz = 0;
this.$size = 0;
this.tres1 = null;
this.tres2 = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CurrentLoopsSideField", com.falstad.Vec3DemoFrame.CurrentLoopField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "loop pair";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.CurrentLoopsSideField, []);
this.tres1 =  Clazz.newDoubleArray (3, 0);
this.tres2 =  Clazz.newDoubleArray (3, 0);
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Loop Size", 40);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Loop Separation", 10);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "Offset", 0);
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.$size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 100.;
var a = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
var b = this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () / 100.;
this.offx = a * (1 - this.$size) + this.$size;
this.offz = b;
this.dir2 = 1;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
this.getLoopField (this.tres1, b, +this.offx, +this.offz, 1, this.$size);
this.getLoopField (this.tres2, b, -this.offx, -this.offz, this.dir2, this.$size);
var c;
for (c = 0; c != 3; c++) a[c] = this.tres1[c] + this.tres2[c];

}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
this.renderLoop (a, +this.offx, +this.offz, 1, this.$size);
this.renderLoop (a, -this.offx, -this.offz, this.dir2, this.$size);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "checkBounds", 
function (a, b) {
if (!this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) return false;
if ((a[2] > this.offz && b[2] < this.offz) || (a[2] < this.offz && b[2] > this.offz)) {
var c = a[0] - this.offx;
var d = java.lang.Math.sqrt (c * c + a[1] * a[1]);
if (d < this.$size) return true;
}if ((a[2] > -this.offz && b[2] < -this.offz) || (a[2] < -this.offz && b[2] > -this.offz)) {
var c = a[0] + this.offx;
var d = java.lang.Math.sqrt (c * c + a[1] * a[1]);
if (d < this.$size) return true;
}return false;
}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsSideOppField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CurrentLoopsSideOppField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CurrentLoopsSideOppField", com.falstad.Vec3DemoFrame.CurrentLoopsSideField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsSideField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "loop pair opposing";
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.$size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 100.;
var a = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
var b = this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () / 100.;
this.offx = a * (1 - this.$size) + this.$size;
this.offz = b;
this.dir2 = -1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsStackedField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CurrentLoopsStackedField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CurrentLoopsStackedField", com.falstad.Vec3DemoFrame.CurrentLoopsSideField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsSideField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "loop pair stacked";
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.$size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 100.;
var a = (this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () + 1) / 100.;
var b = this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () / 100.;
this.offx = b;
this.offz = a;
this.dir2 = 1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsStackedOppField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CurrentLoopsStackedOppField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CurrentLoopsStackedOppField", com.falstad.Vec3DemoFrame.CurrentLoopsSideField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsSideField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "loop pair stacked, opp.";
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.$size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 100.;
var a = (this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () + 1) / 100.;
var b = this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () / 100.;
this.offx = b;
this.offz = a;
this.dir2 = -1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopsOpposingConcentric, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CurrentLoopsOpposingConcentric$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.dir2 = 0;
this.tres1 = null;
this.tres2 = null;
this.size2 = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CurrentLoopsOpposingConcentric", com.falstad.Vec3DemoFrame.CurrentLoopField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "concentric loops";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.CurrentLoopsOpposingConcentric, []);
this.tres1 =  Clazz.newDoubleArray (3, 0);
this.tres2 =  Clazz.newDoubleArray (3, 0);
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Outer Loop Size", 75);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Inner Loop Size", 50);
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 101.;
this.size2 = this.size * (this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () + 1) / 101.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
this.getLoopField (this.tres1, b, 0, 0, 1, this.size);
this.getLoopField (this.tres2, b, 0, 0, -1, this.size2);
var c = this.size2 / this.size;
var d;
for (d = 0; d != 3; d++) a[d] = this.tres1[d] + c * this.tres2[d];

}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
this.renderLoop (a, 0, 0, 1, this.size);
this.renderLoop (a, 0, 0, -1, this.size2);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SolenoidField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ChargedRing$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ChargedRing", com.falstad.Vec3DemoFrame.CurrentLoopField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CurrentLoopField, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.ChargedRing, []);
this.useColor = false;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged ring";
});
Clazz.overrideMethod (c$, "getBestSlice", 
function () {
return 2;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
this.getLoopField (a, b, 0);
}, "~A,~A");
Clazz.defineMethod (c$, "getLoopField", 
function (a, b, c) {
var d = b[0];
var e = b[1];
var f = b[2] + c;
var g;
a[0] = a[1] = a[2] = 0;
var h = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var i = 8;
var j = (this.b$["com.falstad.Vec3DemoFrame"].getPot) ? .2 / i : -6.0E-4 / i;
var k = java.lang.Math.atan2 (b[1], b[0]);
for (g = 0; g != i; g++) {
var l = 3.141592653589793 * 2 * g / i;
var m = h * java.lang.Math.cos (l + k);
var n = h * java.lang.Math.sin (l + k);
var o = d - m;
var p = e - n;
var q = f;
var r = java.lang.Math.sqrt (o * o + p * p + q * q);
if (r < .06) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var s = r * r * r;
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] += -j / r;
} else {
a[0] += j * o / s;
a[1] += j * p / s;
a[2] += j * q / s;
}}
}, "~A,~A,~N");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Ring Size", 40);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedRingPair, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ChargedRingPair$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.sep = 0;
this.r2 = 0;
this.tres1 = null;
this.tres2 = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ChargedRingPair", com.falstad.Vec3DemoFrame.ChargedRing, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedRing, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged ring pair";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.ChargedRingPair, []);
this.tres1 =  Clazz.newDoubleArray (3, 0);
this.tres2 =  Clazz.newDoubleArray (3, 0);
this.r2 = 1;
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.sep = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
this.getLoopField (this.tres1, b, -this.sep);
this.getLoopField (this.tres2, b, this.sep);
var c;
for (c = 0; c != 3; c++) a[c] = this.tres1[c] + this.r2 * this.tres2[c];

}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.renderLoop (a, 0, -this.sep, 1, b);
this.renderLoop (a, 0, this.sep, 1, b);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Ring Size", 40);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Ring Separation", 40);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedRingDipole, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ChargedRingDipole$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ChargedRingDipole", com.falstad.Vec3DemoFrame.ChargedRingPair, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ChargedRingPair, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "charged ring dipole";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.ChargedRingDipole, []);
this.r2 = -1;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SlottedPlane, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$SolenoidField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.height = 0;
this.size = 0;
this.turns = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "SolenoidField", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "solenoid";
});
Clazz.overrideMethod (c$, "useRungeKutta", 
function () {
return false;
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 100.;
this.turns = (Clazz.doubleToInt (this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () / 4)) + 1;
this.height = (this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () + 1) / 25.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c;
var d;
var e;
a[0] = a[1] = a[2] = 0;
var f = 8;
if (this.turns == 0) return;
if (this.turns < 9) f = Clazz.doubleToInt (80 / this.turns);
var g = java.lang.Math.atan2 (b[1], b[0]);
var h = this.height / this.turns;
var i = h / f;
var j = -this.height / 2;
var k = .003 / (this.turns * f);
var l = k * i;
if (g < 0) g += 6.283185307179586;
if (g < 0) System.out.print ("-ang0?? " + g + "\n");
g %= i;
j += h * g / (6.283185307179586);
for (c = 0; c != f; c++) {
var m = 3.141592653589793 * 2 * c / f;
var n = this.size * java.lang.Math.cos (m + g);
var o = this.size * java.lang.Math.sin (m + g);
var p = j + i * c;
var q = -o * k;
var r = n * k;
var s = b[0] - n;
var t = b[1] - o;
var u = s * s + t * t;
for (d = 0; d != this.turns; d++) {
var v = b[2] - p;
var w = java.lang.Math.sqrt (u + v * v);
if (!this.b$["com.falstad.Vec3DemoFrame"].showA) {
if (w < .04 && this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var x = w * w * w;
var y = (r * v - l * t) / x;
var z = (l * s - q * v) / x;
var A = (q * t - r * s) / x;
a[0] += y;
a[1] += z;
a[2] += A;
} else {
a[0] += 6 * q / w;
a[1] += 6 * r / w;
a[2] += 6 * l / w;
}p += h;
}
}
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Diameter", 40);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Height", 30);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "# of Turns", 36);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
return this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], 2, false);
}, "~A,~A");
Clazz.overrideMethod (c$, "checkBounds", 
function (a, b) {
if (!this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) return false;
var c = this.height * 2;
var d = java.lang.Math.sqrt (a[0] * a[0] + a[1] * a[1]);
var e = java.lang.Math.sqrt (b[0] * b[0] + b[1] * b[1]);
if (a[2] < c && a[2] > -c) {
if ((d < this.size && e > this.size) || (e < this.size && d > this.size)) return true;
}if ((a[2] > 0 && b[2] < 0) || (a[2] < 0 && b[2] > 0)) {
if (d < this.size) return true;
}return false;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 2);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var b;
var c;
var d = 48;
if (this.turns < 10) d = Clazz.doubleToInt (480 / this.turns);
var e = this.height / this.turns;
var f = e / d;
var g = -this.height / 2;
for (b = 0; b != d; b++) {
var h = 3.141592653589793 * 2 * b / d;
var i = 3.141592653589793 * 2 * (b + 1) / d;
var j = this.size * java.lang.Math.cos (h);
var k = this.size * java.lang.Math.sin (h);
var l = this.size * java.lang.Math.cos (i);
var m = this.size * java.lang.Math.sin (i);
var n = g + f * b;
for (c = 0; c != this.turns; c++) {
var o = n + f;
this.b$["com.falstad.Vec3DemoFrame"].map3d (j, k, n, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (l, m, o, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].getCurrentColor (c * d + b));
if (b == 0 && c == Clazz.doubleToInt (this.turns / 2)) this.b$["com.falstad.Vec3DemoFrame"].drawCurrentArrow (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
 else a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
n += e;
}
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ToroidalSolenoidField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ToroidalSolenoidField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.size1 = 0;
this.size2 = 0;
this.q = 0;
this.turns = 0;
this.angct = 8;
this.turnmult = 0;
this.costab1 = null;
this.sintab1 = null;
this.costab2 = null;
this.sintab2 = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ToroidalSolenoidField", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.ToroidalSolenoidField, []);
this.turnmult = 1;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "toroidal solenoid";
});
Clazz.overrideMethod (c$, "useRungeKutta", 
function () {
return false;
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.size1 = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.size2 = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () * this.size1 / 100.;
this.turns = Clazz.doubleToInt (this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () / 3) + 6;
this.q = .0003 / (this.angct * this.turns);
this.costab1 =  Clazz.newDoubleArray (this.angct, 0);
this.sintab1 =  Clazz.newDoubleArray (this.angct, 0);
this.costab2 =  Clazz.newDoubleArray (this.angct, this.turns, 0);
this.sintab2 =  Clazz.newDoubleArray (this.angct, this.turns, 0);
var a;
var b;
for (a = 0; a != this.angct; a++) {
var c = 3.141592653589793 * 2 * a / this.angct;
this.costab1[a] = java.lang.Math.cos (c);
this.sintab1[a] = java.lang.Math.sin (c);
for (b = 0; b != this.turns; b++) {
var d = (3.141592653589793 * 2 * b + c) / (this.turnmult * this.turns);
this.costab2[a][b] = java.lang.Math.cos (d);
this.sintab2[a][b] = java.lang.Math.sin (d);
}
}
});
Clazz.overrideMethod (c$, "finishFrame", 
function () {
this.costab1 = this.sintab1 = null;
this.costab2 = this.sintab2 = null;
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Center Radius", 60);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Outer Radius", 80);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "# of turns", 18);
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c;
var d;
var e;
a[0] = a[1] = a[2] = 0;
for (c = 0; c != this.angct; c++) {
var f = this.costab1[c];
var g = this.sintab1[c];
var h = this.size2 * g;
var i = this.q * this.turns * this.size2 * f;
var j = b[2] - h;
for (d = 0; d != this.turns; d++) {
var k = this.costab2[c][d];
var l = this.sintab2[c][d];
var m = k * (this.size1 + this.size2 * f);
var n = l * (this.size1 + this.size2 * f);
var o = this.q * (-(this.size1 + this.size2 * f) * l - this.turns * this.size2 * k * g);
var p = this.q * ((this.size1 + this.size2 * f) * k - this.turns * this.size2 * l * g);
var q = b[0] - m;
var r = b[1] - n;
var s = com.falstad.Vec3DemoFrame.distance3 (q, r, j);
if (!this.b$["com.falstad.Vec3DemoFrame"].showA) {
var t = s * s * s;
if (s < .04 && this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var u = (p * j - i * r) / t;
var v = (i * q - o * j) / t;
var w = (o * r - p * q) / t;
a[0] += u;
a[1] += v;
a[2] += w;
} else {
a[0] += 6 * o / s;
a[1] += 6 * p / s;
a[2] += 6 * i / s;
}}
}
}, "~A,~A");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
return this.b$["com.falstad.Vec3DemoFrame"].intersectCylinder (a, b[0], b[1], b[2], 2, false);
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 2);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var b;
var c;
var d = this.turns * 48;
for (c = 0; c != d; c++) {
this.getToroidPoint (this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, this.size1, this.size2, this.turns, c, 0);
this.getToroidPoint (this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, this.size1, this.size2, this.turns, c + 1, 1);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].getCurrentColor (c));
if (c == 50) this.b$["com.falstad.Vec3DemoFrame"].drawArrow (a, null, this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1], 7);
 else a.drawLine (this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1]);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.defineMethod (c$, "getToroidPoint", 
function (a, b, c, d, e, f, g) {
var h = 48;
var i = 3.141592653589793 * 2 * (f % h) / h;
var j = java.lang.Math.cos (i);
var k = java.lang.Math.sin (i);
var l = (3.141592653589793 * 2 * (Clazz.doubleToInt (f / h)) + i) / (e * this.turnmult);
var m = java.lang.Math.cos (l);
var n = java.lang.Math.sin (l);
this.b$["com.falstad.Vec3DemoFrame"].map3d (m * (c + d * j), n * (c + d * j), d * k, a, b, g);
}, "~A,~A,~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.HorseshoeElectromagnetField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$HorseshoeElectromagnetField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "HorseshoeElectromagnetField", com.falstad.Vec3DemoFrame.ToroidalSolenoidField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ToroidalSolenoidField, this, null, Clazz.inheritArgs));
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.HorseshoeElectromagnetField, []);
this.turnmult = 2;
});
Clazz.overrideMethod (c$, "getName", 
function () {
return "horseshoe electromagnet";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Center Radius", 40);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Outer Radius", 50);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "# of turns", 18);
this.b$["com.falstad.Vec3DemoFrame"].setXYView ();
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SquareLoopField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$SquareLoopField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.lstart = 0;
this.lstop = 0;
this.size = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "SquareLoopField", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "square loop";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Loop Size", 60);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.size = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.lstart = -this.size;
this.lstop = this.size;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
this.getLoopField (a, b, 0, 1);
}, "~A,~A");
Clazz.defineMethod (c$, "getLineField", 
function (a, b, c, d, e, f, g, h) {
var i = this.lstart - b[e];
var j = this.lstop - b[e];
var k = com.falstad.Vec3DemoFrame.distance2 (b[f] - c, b[g] - d);
if (k < 0.01 && i <= 0 && j >= 0) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var l = k * k;
var m = i * i;
var n = j * j;
var o = java.lang.Math.sqrt (m + l);
var p = java.lang.Math.sqrt (n + l);
if (this.b$["com.falstad.Vec3DemoFrame"].showA) {
if (e < f) h = -h;
a[e] += h * .0003 * java.lang.Math.log ((j + p) / (i + o)) / this.size;
return;
}var q = h * .0001 / this.size;
var r = q * (-1 / (m + l + i * o) + 1 / (n + l + j * p));
a[g] += r * (b[f] - c);
a[f] -= r * (b[g] - d);
}, "~A,~A,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "getLoopField", 
function (a, b, c, d) {
a[0] = a[1] = a[2] = 0;
this.getLineField (a, b, this.size, c, 0, 1, 2, d);
this.getLineField (a, b, -this.size, c, 0, 1, 2, -d);
this.getLineField (a, b, this.size, c, 1, 0, 2, d);
this.getLineField (a, b, -this.size, c, 1, 0, 2, -d);
}, "~A,~A,~N,~N");
Clazz.overrideMethod (c$, "checkBounds", 
function (a, b) {
if (!this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) return false;
if ((a[2] > 0 && b[2] < 0) || (a[2] < 0 && b[2] > 0)) {
if (a[0] < this.size && a[1] < this.size && a[0] > -this.size && a[1] > -this.size) return true;
}return false;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-this.size, -this.size, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+this.size, -this.size, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+this.size, +this.size, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-this.size, +this.size, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
var b;
for (b = 0; b != 4; b++) {
var c = (b + 1) & 3;
this.b$["com.falstad.Vec3DemoFrame"].drawCurrentLine (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[b], this.b$["com.falstad.Vec3DemoFrame"].ypoints[b], this.b$["com.falstad.Vec3DemoFrame"].xpoints[c], this.b$["com.falstad.Vec3DemoFrame"].ypoints[c], 8, b == 0, 1);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
if (this.b$["com.falstad.Vec3DemoFrame"].intersectZPlane (a, 0, b[0], b[1], b[2]) == 0) return 1;
return 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "noSplitFieldVectors", 
function () {
return false;
});
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.RectLoopField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$RectLoopField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.sizeX = 0;
this.sizeY = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "RectLoopField", com.falstad.Vec3DemoFrame.SquareLoopField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SquareLoopField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "rectangular loop";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Loop Width", 60);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Loop Depth", 40);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.sizeX = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100. + .01;
this.sizeY = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100. + .01;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
a[0] = a[1] = a[2] = 0;
this.lstart = -this.sizeX;
this.lstop = this.sizeX;
this.size = this.sizeY;
this.getLineField (a, b, this.sizeY, 0, 0, 1, 2, 1);
this.getLineField (a, b, -this.sizeY, 0, 0, 1, 2, -1);
this.lstart = -this.sizeY;
this.lstop = this.sizeY;
this.size = this.sizeX;
this.getLineField (a, b, this.sizeX, 0, 1, 0, 2, 1);
this.getLineField (a, b, -this.sizeX, 0, 1, 0, 2, -1);
}, "~A,~A");
Clazz.overrideMethod (c$, "checkBounds", 
function (a, b) {
if (!this.b$["com.falstad.Vec3DemoFrame"].useMagnetMove ()) return false;
if ((a[2] > 0 && b[2] < 0) || (a[2] < 0 && b[2] > 0)) {
if (a[0] < this.sizeX && a[1] < this.sizeY && a[0] > -this.sizeX && a[1] > -this.sizeY) return true;
}return false;
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-this.sizeX, -this.sizeY, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+this.sizeX, -this.sizeY, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+this.sizeX, +this.sizeY, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-this.sizeX, +this.sizeY, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
var b;
for (b = 0; b != 4; b++) {
var c = (b + 1) & 3;
this.b$["com.falstad.Vec3DemoFrame"].drawCurrentLine (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[b], this.b$["com.falstad.Vec3DemoFrame"].ypoints[b], this.b$["com.falstad.Vec3DemoFrame"].xpoints[c], this.b$["com.falstad.Vec3DemoFrame"].ypoints[c], 8, b == 0, 1);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.CornerField, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$CornerField$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.offset = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "CornerField", com.falstad.Vec3DemoFrame.SquareLoopField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SquareLoopField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "corner";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Offset", 50);
});
Clazz.overrideMethod (c$, "setupFrame", 
function () {
this.size = 2;
this.offset = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 50. - 1;
this.lstart = this.offset;
this.lstop = 10 + this.offset;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
a[0] = a[1] = a[2] = 0;
this.getLineField (a, b, this.offset, 0, 0, 1, 2, -1);
this.getLineField (a, b, this.offset, 0, 1, 0, 2, -1);
}, "~A,~A");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.offset, this.offset, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (1, this.offset, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.offset, 1, 0, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].drawCurrentLine (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], this.b$["com.falstad.Vec3DemoFrame"].xpoints[1], this.b$["com.falstad.Vec3DemoFrame"].ypoints[1], 8, true, 1);
this.b$["com.falstad.Vec3DemoFrame"].drawCurrentLine (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[2], this.b$["com.falstad.Vec3DemoFrame"].ypoints[2], this.b$["com.falstad.Vec3DemoFrame"].xpoints[0], this.b$["com.falstad.Vec3DemoFrame"].ypoints[0], 8, false, 1);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MagneticSphereB, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$MagneticSphereB$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "MagneticSphereB", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "magnetic sphere";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var d = com.falstad.Vec3DemoFrame.distanceArray (b);
if (d < c) {
this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
a[0] = a[1] = a[2] = 0;
return;
}var e = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
var f = b[2] / d;
var g = e / d;
var h = b[1] / e;
var i = b[0] / e;
if (!this.b$["com.falstad.Vec3DemoFrame"].showA) {
var j = .003 * c * c * c / (d * d * d);
var k = 2 * g * j;
var l = f * j;
a[0] = g * i * l + f * i * k;
a[1] = g * h * l + f * h * k;
a[2] = f * l - g * k;
} else {
var j = .003 * c * c * c * g / (d * d);
a[0] = -h * j;
a[1] = i * j;
a[2] = 0;
}}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Sphere Size", 50);
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
});
Clazz.overrideMethod (c$, "render", 
function (a) {
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
this.b$["com.falstad.Vec3DemoFrame"].fillSphere (a, b, 0);
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
return this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], c);
}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.MonopoleAttempt, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$MonopoleAttempt$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.tres = null;
this.yflip = null;
this.rad = null;
this.$size = null;
this.count = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "MonopoleAttempt", com.falstad.Vec3DemoFrame.SquareLoopField, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.SquareLoopField, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "monopole attempt";
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, com.falstad.Vec3DemoFrame.MonopoleAttempt, []);
this.tres =  Clazz.newDoubleArray (8, 3, 0);
this.yflip =  Clazz.newDoubleArray (3, 0);
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Loop Size", 40);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Separation", 10);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (2, "Loop Count", 100);
this.b$["com.falstad.Vec3DemoFrame"].dispChooser.select (com.falstad.Vec3DemoFrame.DISP_VECTORS);
});
Clazz.defineMethod (c$, "setupFrame", 
function () {
Clazz.superCall (this, com.falstad.Vec3DemoFrame.MonopoleAttempt, "setupFrame", []);
this.$size = (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue ()) / 100.;
this.rad = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () / 100. + this.$size;
this.count = Clazz.doubleToInt ((this.b$["com.falstad.Vec3DemoFrame"].aux3Bar.getValue () * 6) / 101) + 1;
});
Clazz.defineMethod (c$, "drawLoop", 
function (a) {
var b;
for (b = 0; b != 4; b++) {
var c = (b + 1) & 3;
this.b$["com.falstad.Vec3DemoFrame"].drawCurrentLine (a, this.b$["com.falstad.Vec3DemoFrame"].xpoints[b], this.b$["com.falstad.Vec3DemoFrame"].ypoints[b], this.b$["com.falstad.Vec3DemoFrame"].xpoints[c], this.b$["com.falstad.Vec3DemoFrame"].ypoints[c], 8, b == 0, 1);
}
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "render", 
function (a) {
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 0);
a.setColor (this.b$["com.falstad.Vec3DemoFrame"].darkYellow);
var b = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 100.;
var c;
var d = this.count;
for (c = -1; c <= 1; c += 2) {
if (--d < 0) break;
this.b$["com.falstad.Vec3DemoFrame"].map3d (-b, -b, this.rad * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+b * c, -b * c, this.rad * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+b, +b, this.rad * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-b * c, +b * c, this.rad * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
this.drawLoop (a);
}
for (c = -1; c <= 1; c += 2) {
if (--d < 0) break;
this.b$["com.falstad.Vec3DemoFrame"].map3d (-b, this.rad * c, -b, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (-b * c, this.rad * c, +b * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+b, this.rad * c, +b, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (+b * c, this.rad * c, -b * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
this.drawLoop (a);
}
for (c = -1; c <= 1; c += 2) {
if (--d < 0) break;
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.rad * c, -b, -b, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 0);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.rad * c, +b * c, -b * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 1);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.rad * c, +b, +b, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 2);
this.b$["com.falstad.Vec3DemoFrame"].map3d (this.rad * c, -b * c, +b * c, this.b$["com.falstad.Vec3DemoFrame"].xpoints, this.b$["com.falstad.Vec3DemoFrame"].ypoints, 3);
this.drawLoop (a);
}
this.b$["com.falstad.Vec3DemoFrame"].renderItems (a, 1);
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c;
for (c = 0; c != 6; c++) this.tres[c][0] = this.tres[c][1] = this.tres[c][2] = 0;

this.getLoopField (this.tres[0], b, -this.rad, -1);
if (this.count > 1) this.getLoopField (this.tres[1], b, this.rad, 1);
this.yflip[1] = b[0];
this.yflip[2] = b[1];
this.yflip[0] = b[2];
if (this.count > 2) this.getLoopField (this.tres[2], this.yflip, -this.rad, -1);
if (this.count > 3) this.getLoopField (this.tres[3], this.yflip, this.rad, 1);
this.yflip[2] = b[0];
this.yflip[0] = b[1];
this.yflip[1] = b[2];
if (this.count > 4) this.getLoopField (this.tres[4], this.yflip, -this.rad, -1);
if (this.count > 5) this.getLoopField (this.tres[5], this.yflip, this.rad, 1);
for (c = 0; c != 3; c++) a[c] = this.tres[0][c] + this.tres[1][c] + this.tres[2][(c + 1) % 3] + this.tres[3][(c + 1) % 3] + this.tres[4][(c + 2) % 3] + this.tres[5][(c + 2) % 3];

}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return null;
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseSquaredRadialSphere$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseSquaredRadialSphere", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "1/r^2 sphere";
});
Clazz.defineMethod (c$, "getSize", 
function () {
return (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () + 1) / 110.;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.Vec3DemoFrame.distanceArray (b);
if (c < .01) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
var d = this.getSize ();
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = .1 * ((c > d) ? -1 / c : -3 / (2 * d) + c * c / (2 * d * d * d));
return;
}if (c < d) c = d;
var e = .0003 / (c * c * c);
a[0] = -b[0] * e;
a[1] = -b[1] * e;
a[2] = -b[2] * e;
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Sphere Size", 70);
});
Clazz.overrideMethod (c$, "render", 
function (a) {
this.renderSphere (a, this.getSize ());
}, "java.awt.Graphics");
Clazz.overrideMethod (c$, "getViewPri", 
function (a, b) {
return this.b$["com.falstad.Vec3DemoFrame"].intersectSphere (a, b[0], b[1], b[2], this.getSize ());
}, "~A,~A");
Clazz.overrideMethod (c$, "noSplitFieldVectors", 
function () {
return false;
});
Clazz.overrideMethod (c$, "checkBoundsWithForce", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseSquareRotational, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$InverseSquareRotational$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "InverseSquareRotational", com.falstad.Vec3DemoFrame.InverseRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "1/r^2 irrotational";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = com.falstad.Vec3DemoFrame.distance2 (b[0], b[1]);
if (c < 0.02) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
this.b$["com.falstad.Vec3DemoFrame"].rotateParticle (a, b, .0001 / (c * c * c));
}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.LinearRotational, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$LinearRotational$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "LinearRotational", com.falstad.Vec3DemoFrame.InverseRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "linear irrotational";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXYViewExact ();
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .0003;
a[0] = -c * b[1];
a[1] = c * b[0];
a[2] = 0;
}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Helical, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$Helical$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "Helical", com.falstad.Vec3DemoFrame.InverseRadial, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.InverseRadial, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "helical";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Z Speed", 30);
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .0003;
a[0] = -c * b[1];
a[1] = c * b[0];
a[2] = .00001 * this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue ();
}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.RosslerAttractor, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$RosslerAttractor$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "RosslerAttractor", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "Rossler attractor";
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = this.b$["com.falstad.Vec3DemoFrame"].aux2Bar.getValue () * 2 + 20;
var d = b[0] * 24;
var e = b[1] * 24;
var f = (b[2] + .75) * c;
var g = .00002;
var h = this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () * .1;
a[0] = -(e + f) * g;
a[1] = g * (d + .2 * e);
a[2] = g * (.2 + d * f - h * f);
}, "~A,~A");
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "c", 80);
this.b$["com.falstad.Vec3DemoFrame"].setupBar (1, "Z Scale", 36);
this.b$["com.falstad.Vec3DemoFrame"].strengthBar.setValue (75);
});
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "redistribute", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.LorenzAttractor, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$LorenzAttractor$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "LorenzAttractor", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "Lorenz attractor";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].setupBar (0, "Scale", 24);
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = Clazz.doubleToInt (this.b$["com.falstad.Vec3DemoFrame"].aux1Bar.getValue () / 2) + 23;
var d = b[0] * c;
var e = b[1] * c;
var f = b[2] * c + c;
var g = .00002;
a[0] = (-10 * d + 10 * e) * g;
a[1] = g * (28 * d - e - d * f);
a[2] = g * (-2.6666666666666665 * f + d * e);
}, "~A,~A");
Clazz.overrideMethod (c$, "nonGradient", 
function () {
return true;
});
Clazz.overrideMethod (c$, "redistribute", 
function () {
return false;
});
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.UserDefinedPotential, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$UserDefinedPotential$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.expr = null;
this.y0 = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "UserDefinedPotential", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "user-defined potential";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.b$["com.falstad.Vec3DemoFrame"].textFields[0].setText ("x*x-z*z");
this.b$["com.falstad.Vec3DemoFrame"].textFields[0].show ();
this.b$["com.falstad.Vec3DemoFrame"].textFieldLabel.setText ("Potential Function");
this.b$["com.falstad.Vec3DemoFrame"].textFieldLabel.show ();
this.actionPerformed ();
this.y0 =  Clazz.newDoubleArray (3, 0);
});
Clazz.overrideMethod (c$, "actionPerformed", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].parseError = false;
var a = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ExprParser, this, null, this.b$["com.falstad.Vec3DemoFrame"].textFields[0].getText ());
this.expr = a.parseExpression ();
if (a.gotError ()) this.b$["com.falstad.Vec3DemoFrame"].parseError = true;
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .00001;
var d;
for (d = 0; d != 3; d++) this.y0[d] = b[d];

var e = -this.expr.eval (this.y0);
if (this.b$["com.falstad.Vec3DemoFrame"].getPot) {
a[0] = e * .01;
return;
}this.y0[0] += c;
a[0] = e + this.expr.eval (this.y0);
this.y0[0] = b[0];
this.y0[1] += c;
a[1] = e + this.expr.eval (this.y0);
this.y0[1] = b[1];
this.y0[2] += c;
a[2] = e + this.expr.eval (this.y0);
for (d = 0; d != 3; d++) if (!(a[d] > -10 && a[d] < 10)) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;

}, "~A,~A");
Clazz.overrideMethod (c$, "createNext", 
function () {
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.UserDefinedFunction, this, null);
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$UserDefinedFunction$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.exprs = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "UserDefinedFunction", com.falstad.Vec3DemoFrame.VecFunction, null, Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.VecFunction, this, null, Clazz.inheritArgs));
Clazz.overrideMethod (c$, "getName", 
function () {
return "user-defined field";
});
Clazz.overrideMethod (c$, "setup", 
function () {
this.b$["com.falstad.Vec3DemoFrame"].setXZView ();
this.exprs =  new Array (3);
this.b$["com.falstad.Vec3DemoFrame"].textFields[0].setText ("x");
this.b$["com.falstad.Vec3DemoFrame"].textFields[1].setText ("y");
this.b$["com.falstad.Vec3DemoFrame"].textFields[2].setText ("z");
this.b$["com.falstad.Vec3DemoFrame"].textFieldLabel.setText ("Field Functions");
this.b$["com.falstad.Vec3DemoFrame"].textFieldLabel.show ();
var a;
for (a = 0; a != 3; a++) this.b$["com.falstad.Vec3DemoFrame"].textFields[a].show ();

this.actionPerformed ();
});
Clazz.overrideMethod (c$, "actionPerformed", 
function () {
var a;
this.b$["com.falstad.Vec3DemoFrame"].parseError = false;
for (a = 0; a != 3; a++) {
var b = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.ExprParser, this, null, this.b$["com.falstad.Vec3DemoFrame"].textFields[a].getText ());
this.exprs[a] = b.parseExpression ();
if (b.gotError ()) this.b$["com.falstad.Vec3DemoFrame"].parseError = true;
}
});
Clazz.overrideMethod (c$, "getField", 
function (a, b) {
var c = .0002;
var d;
for (d = 0; d != 3; d++) {
a[d] = c * this.exprs[d].eval (b);
if (!(a[d] > -10 && a[d] < 10)) this.b$["com.falstad.Vec3DemoFrame"].boundCheck = true;
}
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
c$.$Vec3DemoFrame$DrawData$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.g = null;
this.mult = 0;
this.field = null;
this.vv = null;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "DrawData");
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$Particle$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.pos = null;
this.vel = null;
this.viewPri = 0;
this.lifetime = 0;
this.phi = 0;
this.theta = 0;
this.phiv = 0;
this.thetav = 0;
this.stepsize = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "Particle");
Clazz.makeConstructor (c$, 
function () {
this.pos =  Clazz.newDoubleArray (3, 0);
this.vel =  Clazz.newDoubleArray (3, 0);
this.stepsize = 1;
});
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$FieldVector$ = function () {
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
}, com.falstad.Vec3DemoFrame, "FieldVector");
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$ExprState$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.x = 0;
this.y = 0;
this.z = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ExprState");
c$ = Clazz.p0p ();
};
c$.$Vec3DemoFrame$Expr$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.left = null;
this.right = null;
this.value = 0;
this.type = 0;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "Expr");
Clazz.makeConstructor (c$, 
function (a, b, c) {
this.left = a;
this.right = b;
this.type = c;
}, "com.falstad.Vec3DemoFrame.Expr,com.falstad.Vec3DemoFrame.Expr,~N");
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
case 5:
return a[2] * 10;
case 18:
return java.lang.Math.sqrt (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) * 10;
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
c$.$Vec3DemoFrame$ExprParser$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.text = null;
this.token = null;
this.pos = 0;
this.tlen = 0;
this.err = false;
Clazz.instantialize (this, arguments);
}, com.falstad.Vec3DemoFrame, "ExprParser");
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
if (this.token.length == 0) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 6, 0.);
var a = this.parse ();
if (this.token.length > 0) this.err = true;
return a;
});
Clazz.defineMethod (c$, "parse", 
function () {
var a = this.parseMult ();
while (true) {
if (this.skip ("+")) a = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, a, this.parseMult (), 1);
 else if (this.skip ("-")) a = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, a, this.parseMult (), 2);
 else break;
}
return a;
});
Clazz.defineMethod (c$, "parseMult", 
function () {
var a = this.parseUminus ();
while (true) {
if (this.skip ("*")) a = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, a, this.parseUminus (), 7);
 else if (this.skip ("/")) a = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, a, this.parseUminus (), 8);
 else break;
}
return a;
});
Clazz.defineMethod (c$, "parseUminus", 
function () {
this.skip ("+");
if (this.skip ("-")) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, this.parsePow (), null, 10);
return this.parsePow ();
});
Clazz.defineMethod (c$, "parsePow", 
function () {
var a = this.parseTerm ();
while (true) {
if (this.skip ("^")) a = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, a, this.parseTerm (), 9);
 else break;
}
return a;
});
Clazz.defineMethod (c$, "parseFunc", 
function (a) {
this.skipOrError ("(");
var b = this.parse ();
this.skipOrError (")");
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, b, null, a);
}, "~N");
Clazz.defineMethod (c$, "parseTerm", 
function () {
if (this.skip ("(")) {
var a = this.parse ();
this.skipOrError (")");
return a;
}if (this.skip ("x")) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 3);
if (this.skip ("y")) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 4);
if (this.skip ("z")) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 5);
if (this.skip ("r")) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 18);
if (this.skip ("pi")) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 6, 3.14159265358979323846);
if (this.skip ("e")) return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 6, 2.7182818284590452354);
if (this.skip ("sin")) return this.parseFunc (11);
if (this.skip ("cos")) return this.parseFunc (12);
if (this.skip ("abs")) return this.parseFunc (13);
if (this.skip ("exp")) return this.parseFunc (14);
if (this.skip ("log")) return this.parseFunc (15);
if (this.skip ("sqrt")) return this.parseFunc (16);
if (this.skip ("tan")) return this.parseFunc (17);
try {
var a = Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 6, Double.$valueOf (this.token).doubleValue ());
this.getToken ();
return a;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.err = true;
System.out.print ("unrecognized token: " + this.token + "\n");
return Clazz.innerTypeInstance (com.falstad.Vec3DemoFrame.Expr, this, null, 6, 0);
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
"DISP_PART_FORCE", 0,
"DISP_VECTORS", 0,
"DISP_LINES", 0,
"DISP_EQUIPS", 0,
"DISP_PART_VELOC_A", 0,
"DISP_VECTORS_A", 0,
"DISP_PART_MAG", 0,
"DISP_VIEW_PAPER", 0,
"SLICE_NONE", 0,
"SLICE_X", 1,
"SLICE_Y", 2,
"SLICE_Z", 3,
"MODE_ANGLE", 0,
"MODE_ZOOM", 1,
"MODE_SLICE", 2,
"BUILD_E", false,
"BUILD_V", true,
"BUILD_M", false,
"densitygroupsize", 0.5,
"densitygridsize", 4,
"maxParticleCount", 5000,
"root2", 1.4142135623730950488016887242096981,
"viewDistance", 5,
"maxVectors", 10000,
"frames", 0,
"framerate", 0,
"firsttime", 0);
});
