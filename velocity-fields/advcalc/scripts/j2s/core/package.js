// package.js from Jmol project -- template only here for Swingjs

// NOTE: Any changes here must also be reflected in build xml
// NOTE: this code does not allow for multiple J2S applications on a page


(function (ClazzLoader) {
		
  if (J2S._debugCode)
    return;

	var	base = ClazzLoader.getJ2SLibBase() + "core/";

// note - we don't need to list ALL the classes -- only the ones that are entry points.
// several more classe are in each of these files -- see build_03_tojs.xml

/*
	ClazzLoader.jarClasspath (base + "coretext.z.js",	[    
	"JM.Object2d",
	"$.Text",
	"J.shape.Object2dShape",
	"$.TextShape",
	"$.Labels",
	"$.Measures",
	"$.Echo",
	"$.Hover",
	"J.render.TextRenderer",
	"$.LabelsRenderer",
	"$.MeasuresRenderer",
	"$.EchoRenderer",
	"$.HoverRenderer"	
	]);
   ...
*/

}) (Clazz._Loader);
