// vector3d.js (C) 2021 by Paul Falstad
// http://www.falstad.com/
// Original applet: http://www.falstad.com/vector/

"use strict";

var buffers, projectionMatrix, viewMatrix;
var pointProgramInfo;
var colorProgramInfo;
var currentProgramInfo;
var equipProgramInfo;
var colorPlainProgramInfo;
var colorAttrProgramInfo;
var colorAttrLightingProgramInfo;
var angleRes = 64;
var stoppedCheck;
var animating = false;
var zoom3d = 1.2;
var maxZoom3d;
var streamlines;
var gl
var success = false
var deltaTimeWithoutSpeed
var zoomRate = 0
var alerted = false
var lastXRot, lastYRot;
var mainView;
var mousePoint;
var heightScale;
var dragStart = [];
var dragStartX;
var viewZoomDragStart;
var integralX = -1, integralY;
var freezeMousePoint = false;

const FC_FIELD     = 0;
const FC_POTENTIAL = 1;
const FC_GRAY      = 2;
const FC_DIV       = 3;
const FC_CURL      = BUILD_CASE_EMV(-1, -1, 4);
const FC_NONE      = BUILD_CASE_EMV(4, 4, 5);

const MOT_VELOCITY = 0;
const MOT_FORCE    = 1;
const MOT_CURLERS  = 2;
const MOT_EQUIPOTENTIAL = 3;

const FL_NONE      = 0;
const FL_GRID      = 1;
const FL_EQUIP     = 2;
const FL_LINES     = 3;

const MODE_VIEW_ROTATE  = 0;
const MODE_VIEW_ZOOM    = 1;
const MODE_LINE_INT     = 2;
const MODE_SURF_INT     = 3;

var reverseCheck;
var flatCheck;
var functionChooser;
var dispChooser;
var floorColorChooser;
var floorLineChooser;
var modeChooser;

var textFieldLabel;
var partCountBar;
var strengthBar;
var vecDensityBar;
var lineDensityBar;
var potentialBar;
var heightScaleBar;
var aux1Bar;
var aux2Bar;
var aux3Bar;
var textFields;
var fieldStrength, partMult;
var reverse = 1;
var grid;
var particles;
const pi = Math.PI;
const coulombK = 8.98755179e9;
const coulombKQ = coulombK*1e-9;

var isFlat = false;
var vecCount;
var vectorSpacing = 16;
var showA = false;
var parseError = false;
var fieldColors = [];
var equipColors = [];
const gridsize = 100;

var density = [];
const densitygridsize = 16;
const densitygridsize2 = densitygridsize*densitygridsize;
const densitygroupsize = 2/densitygridsize;
const maxParticleCount = 5000;
const initialDivDetectorSize = .02;

var lengthUnit

// standard gravitational parameter
var mu1 // in lengthUnits^3/hours^2
var mu2
const thrustMult = 10
const minThrustDelta = .00015
var body1Offset, bodyDistance
var curfunc;
var functionChangeFlag;
var functionList;

var rotating
var lastViewFrame = ""
var vertexCountWF

var rotationMatrix = mat4.create()
var inverseRotationMatrix = mat4.create()

var refresh;
var time = 0;
var currentTime = 0;

var mouseDown = 0, mouseX, mouseY;
var lastOrbitAngle = 50;
var stars = []
const siderealDay = 23.9344696

function vecLength(x) {
  return Math.hypot(x[0], x[1]);
}

function round(x) {
  return Math.round(x*1000)/1000;
}

function timeString(t) {
  var str = ""
  var y = 24*365;
  if (t > y) {
    str = Math.floor(t/y) + "y ";
    t %= y;
  }
  if (t > 24) {
    str += Math.floor(t/24) + "d "
    t %= 24
  }
  str += Math.floor(t) + "h " + Math.floor((t*60) % 60) + "m " +
         Math.floor((t*3600) % 60) + "s"
  return str
}

function rotateParticleAdd(result, y, mult, cx, cy) { 
  result[0] += -mult*(y[1]-cy);
  result[1] +=  mult*(y[0]-cx);
  result[2] += 0;
}

function rotateParticle(result, y, mult) {
  result[0] = -mult*y[1];
  result[1] =  mult*y[0];
  result[2] = 0;
}

// update info text
function updateValues() {
    var info = document.getElementById("values");

    info.innerHTML = "";
    if (mousePoint) {
      const units = BUILD_CASE_EMV(" m", " m", "");
      info.innerHTML = "Point = (" + round(mousePoint[0]) + ", " + round(mousePoint[1]) + ")" + units + "<br>";
      var fvec = [];
      curfunc.getField(fvec, mousePoint);

      // if numbers are fake, scale numbers to make them closer to 1
      var fmult = (curfunc.getFieldMult() == 1) ? reverse * 2000 : reverse;
      var unitsF = BUILD_CASE_EMV(" V/m", showA ? " &mu;T m" : " &mu;T", "");
      if (curfunc.showD) {
        fmult *= 8.854;
        unitsF = " pC/m<sup>-2</sup>";
      }
      //info.innerHTML += "<p>&nbsp;</p>";
      info.innerHTML += "F = (" + round(fvec[0]*fmult) + ", " + round(fvec[1]*fmult) + ")" + unitsF + "<br>";
      //info.innerHTML += "<p>&nbsp;</p>";
      if (!curfunc.nonGradient()) {
        const unitsP = BUILD_CASE_EMV(" V", " V", "");
        info.innerHTML += "Potential = " + round(reverse*fvec[2]) + unitsP + "<br><p>&nbsp;</p>";
      }
      getPot = (dispChooser.value == "equip");
    }
    if (BUILD_CASE_EMV(true, true, false))
      info.innerHTML += curfunc.getInfo();
}


const stateArgs = ["f", "fc", "fl", "d", "m", "st", "pc", "vd", "ld", "hs", "a1", "a2", "a3", "tf1", "tf2"];

function getStateItems() {
  return [functionChooser, floorColorChooser, floorLineChooser, dispChooser, modeChooser, strengthBar, partCountBar, vecDensityBar, lineDensityBar, heightScaleBar, aux1Bar, aux2Bar, aux3Bar,
          textFields[0], textFields[1]]
}

// save state in link
function updateStateLink() {
  var link = window.location.href.split('?')[0] + "?";
  var b = getStateItems();
  var i;
  for (i = 0; i != stateArgs.length; i++) {
    if (b[i].offsetParent == null)
      continue;
    link += stateArgs[i] + "=" + encodeURIComponent(b[i].value) + "&";
  }
  if (reverseCheck.checked)
    link += "r=true&";
  if (flatCheck.checked)
    link += "ft=true&";

  // convert rotation matrix to Eulerian angles and save them in URL
  var thx = Math.atan2(rotationMatrix[9], rotationMatrix[10]);
  var thy = Math.atan2(-rotationMatrix[8], Math.hypot(rotationMatrix[9], rotationMatrix[10]));
  var thz = Math.atan2(rotationMatrix[4], rotationMatrix[0]);
  link += "rx=" + Math.floor(thx*180/Math.PI) + "&ry=" + Math.floor(thy*180/Math.PI) + "&rz=" + Math.floor(thz*180/Math.PI) + "&zm=" + round(zoom3d);

  document.getElementById("stateLink").href = link;
}

function addMouseEvents(canvas) {
  canvas.onmousedown = function (event) {
    mouseDown = 1;
    mouseX = event.clientX
    mouseY = event.clientY
    dragStartX = mouseX;
    viewZoomDragStart = zoom3d;
    unmap3d(dragStart, event.clientX, event.clientY, [0, 0, 1], [0, 0, 0]);
    integralX = integralY = -1;
    if (isFlat) {
      var mode = modeChooser.selectedIndex;
      if (mode == MODE_LINE_INT || mode == MODE_SURF_INT)
        mousePoint = null;
      else
        freezeMousePoint = !freezeMousePoint;
    }
  }

  canvas.onmouseup = function (event) {
    mouseDown = 0;
    updateStateLink();
  }

  canvas.onmouseout = function (event) { if (!freezeMousePoint) mousePoint = null; }

  canvas.onmousemove = function (event) {
    if (mouseDown) {
      var mode = modeChooser.selectedIndex;
      if (mode == MODE_VIEW_ROTATE) {
        if (isFlat)
          return;
        var dx = event.clientX - mouseX
        var dy = event.clientY - mouseY
        mouseX = event.clientX
        mouseY = event.clientY

        // rotate view matrix
        var mtemp = mat4.create()
        mat4.rotate(mtemp, mtemp, dx*.01, [0, 1, 0]);
        mat4.rotate(mtemp, mtemp, dy*.01, [1, 0, 0]);
        mat4.multiply(rotationMatrix, mtemp, rotationMatrix);
      } else if (mode == MODE_VIEW_ZOOM) {
        if (isFlat)
          return;
        zoom3d = (event.clientX-dragStartX)/40. + viewZoomDragStart;
        if (zoom3d < .1)
          zoom3d = .1;
      } else if (mode == MODE_LINE_INT || mode == MODE_SURF_INT) {
        var x3 = [];
        unmap3d(x3, event.clientX, event.clientY, [0, 0, 1], [0, 0, 0]);
        integralX = x3[0];
        integralY = x3[1];
      }
    } else if (isFlat && !freezeMousePoint) {
      var x3 = [];
      unmap3d(x3, event.clientX, event.clientY, [0, 0, 1], [0, 0, 0]);
      mousePoint = null;
      if (Math.max(x3[0], x3[1]) <= 1 && Math.min(x3[0], x3[1]) >= -1)
        mousePoint = x3;
    }
    refresh();
  }

  canvas.addEventListener("wheel", function (event) {
      if (isFlat)
        return;
      zoom3d *= Math.exp(-event.deltaY * .001)
      //zoom3d = Math.min(Math.max(zoom3d, .005), 500)
      refresh()
      updateStateLink();
  })

	var lastTap;
  var sim = this;
  
  // convert touch events to mouse events
	canvas.addEventListener("touchstart", function (e) {
  		var touch = e.touches[0];
  		var etype = "mousedown";
  		lastTap = e.timeStamp;
  		
  		var mouseEvent = new MouseEvent(etype, {
    			clientX: touch.clientX,
    			clientY: touch.clientY
  		});
  		e.preventDefault();
  		canvas.dispatchEvent(mouseEvent);
  }, false);
  
	canvas.addEventListener("touchend", function (e) {
  		var mouseEvent = new MouseEvent("mouseup", {});
  		e.preventDefault();
  		canvas.dispatchEvent(mouseEvent);
  }, false);
  
	canvas.addEventListener("touchmove", function (e) {
  		var touch = e.touches[0];
  		var mouseEvent = new MouseEvent("mousemove", {
    			clientX: touch.clientX,
    			clientY: touch.clientY
  		});
  		e.preventDefault();
  		canvas.dispatchEvent(mouseEvent);
	}, false);

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
  		var rect = canvasDom.getBoundingClientRect();
  		return {
    			x: touchEvent.touches[0].clientX - rect.left,
    			y: touchEvent.touches[0].clientY - rect.top
  		};
	}


}

function resizeCanvas(cv) {
    var scale = window.devicePixelRatio;
    var width = cv.clientWidth * scale;
    var height = cv.clientHeight * scale;
    if (cv.width != width ||
        cv.height != height) {
       cv.width = width;
       cv.height = height;
    }
}

// add handlers for buttons so they work on both desktop and mobile
function handleButtonEvents(id, func, func0) {
  var button = document.getElementById(id)
  button.addEventListener("mousedown", func, false)
  button.addEventListener("touchstart", func, false)

  button.addEventListener("mouseup", func0, false)
  button.addEventListener("mouseleave", func0, false)
  button.addEventListener("touchend", func0, false)
}

function auxBarValue(n) {
  return parseInt([null, aux1Bar, aux2Bar, aux3Bar][n].value);
}

function makeFieldColors() {
  fieldColors = [];
  var i;
  const grayLevel = 76;
  for (i = 0; i != 256; i++) {
    var rb = grayLevel+(128-grayLevel)*i/255;
    var g = grayLevel+(255-grayLevel)*i/255;
    fieldColors.push(rb/255, g/255, rb/255);
  }
  for (i = 0; i != 256; i++) {
    var rb = 128+i/2;
    fieldColors.push(rb/255, 1, rb/255);
  }

  equipColors = [];
  var i;
  for (i = 0; i != 256; i++)
    equipColors.push((255-i/2)/255, i/2/255, i/2/255);
  for (i = 0; i != 256; i++)
    equipColors.push((128-i/2)/255, (128+i/2)/255, (128-i/2)/255);
}

function parseArguments() {
  const urlParams = new URLSearchParams(window.location.search);
  const b = getStateItems();
  var i;
  for (i = 0; i != stateArgs.length; i++) {
    if (urlParams.has(stateArgs[i]))
      b[i].value = urlParams.get(decodeURIComponent(stateArgs[i]));
    if (stateArgs[i] == "f") functionChanged();
    if (stateArgs[i] == "d") dispChooserChanged();
  }
  if (urlParams.get("r"))
    reverseCheck.checked = true;
  if (urlParams.get("ft"))
    flatCheck.checked = true;
  if (urlParams.has("tf1"))
    actionPerformed();
  if (urlParams.has("rx")) {
    rotationMatrix = mat4.create()
    mat4.rotate(rotationMatrix, rotationMatrix, -urlParams.get("rx")*Math.PI/180, [1, 0, 0]);
    mat4.rotate(rotationMatrix, rotationMatrix, -urlParams.get("ry")*Math.PI/180, [0, 1, 0]);
    mat4.rotate(rotationMatrix, rotationMatrix, -urlParams.get("rz")*Math.PI/180, [0, 0, 1]);
  }
  if (urlParams.has("zm"))
    zoom3d = urlParams.get("zm");
}

function main() {
  functionChooser = document.getElementById("functionChooser");
  floorColorChooser = document.getElementById("floorColorChooser");
  floorLineChooser = document.getElementById("floorLineChooser");
  modeChooser = document.getElementById("modeChooser");
  strengthBar = document.getElementById("strengthBar");
  partCountBar = document.getElementById("partCountBar");
  vecDensityBar = document.getElementById("vecDensityBar");
  lineDensityBar = document.getElementById("lineDensityBar");
  potentialBar = document.getElementById("potentialBar");
  heightScaleBar = document.getElementById("heightScaleBar");
  textFields = [];
  textFields[0] = document.getElementById("textField1");
  textFields[1] = document.getElementById("textField2");
  stoppedCheck = document.getElementById("stoppedCheck");
  reverseCheck = document.getElementById("reverseCheck");
  flatCheck = document.getElementById("flatCheck");
  dispChooser = document.getElementById("dispChooser");
  aux1Bar = document.getElementById("aux1Bar");
  aux2Bar = document.getElementById("aux2Bar");
  aux3Bar = document.getElementById("aux3Bar");
  
  curfunc = new InverseRadial();
  curfunc.setup();

  mat4.rotate(rotationMatrix, rotationMatrix, -Math.PI*.35, [1, 0, 0]);
  makeFieldColors();

  var f = curfunc;
  functionList = [];
  while (f != null) {
    var opt = document.createElement("option");
    opt.text = f.getName();
    opt.value = f.constructor.name;
    functionChooser.add(opt);
    functionList.push(f);
    f = f.createNext();
  }

  const canvas = document.querySelector('#glcanvas');
  gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  buffers = initBuffers(gl);

  particles = [];
  for (var i = 0; i != maxParticleCount; i++)
    particles[i] = new Particle();

  addMouseEvents(canvas)
  parseArguments();

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.5, 0.5, 0.5);
      highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
      //highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec3 directionalVector = 1. * normalize(vec3(10.0, 10.0, 10.0) - (uNormalMatrix * aVertexPosition).xyz);

      highp vec4 transformedNormal = uNormalMatrix * vec4(normalize(aVertexNormal), 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  const vsColorAttrLightingSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec3 aColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec3 vLighting;
    varying highp vec3 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.5, 0.5, 0.5);
      highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
      //highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec3 directionalVector = 1. * normalize(vec3(-10.0, -10.0, 10.0) - (uNormalMatrix * aVertexPosition).xyz);

      highp vec4 transformedNormal = uNormalMatrix * vec4(normalize(aVertexNormal), 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
      vColor = aColor;
    }
  `;

  const vsColorAttrSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Fragment shader program

  const fsColorSource = `
    varying highp vec3 vLighting;
    uniform highp vec4 uColor;

    void main(void) {
      gl_FragColor = vec4(uColor.rgb * vLighting, uColor.a);
    }
  `;

  const colorShaderProgram = initShaderProgram(gl, vsSource, fsColorSource);

  colorProgramInfo = {
    program: colorShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(colorShaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(colorShaderProgram, 'aVertexNormal'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(colorShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(colorShaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(colorShaderProgram, 'uNormalMatrix'),
      color: gl.getUniformLocation(colorShaderProgram, 'uColor'),
    },
  };

  const fsColorAttrLightingSource = `
    varying highp vec3 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_FragColor = vec4(vColor * vLighting, 1.0);
    }
  `;

  const colorAttrLightingShaderProgram = initShaderProgram(gl, vsColorAttrLightingSource, fsColorAttrLightingSource);

  colorAttrLightingProgramInfo = {
    program: colorAttrLightingShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(colorAttrLightingShaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(colorAttrLightingShaderProgram, 'aVertexNormal'),
      vertexColor: gl.getAttribLocation(colorAttrLightingShaderProgram, 'aColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(colorAttrLightingShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(colorAttrLightingShaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(colorAttrLightingShaderProgram, 'uNormalMatrix'),
    },
  };

  const fsColorNoLightingSource = `
    uniform highp vec4 uColor;

    void main(void) {
      gl_FragColor = uColor;
    }
  `;

  const fsColorAttrSource = `
    varying highp vec3 vColor;

    void main(void) {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  const colorPlainShaderProgram = initShaderProgram(gl, vsSource, fsColorNoLightingSource);

  colorPlainProgramInfo = {
    program: colorPlainShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(colorPlainShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(colorPlainShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(colorPlainShaderProgram, 'uModelViewMatrix'),
      color: gl.getUniformLocation(colorPlainShaderProgram, 'uColor'),
    },
  };

  const colorAttrShaderProgram = initShaderProgram(gl, vsColorAttrSource, fsColorAttrSource);

  colorAttrProgramInfo = {
    program: colorAttrShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(colorAttrShaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(colorAttrShaderProgram, 'aColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(colorAttrShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(colorAttrShaderProgram, 'uModelViewMatrix'),
    },
  };

  const starVsSource = `
    attribute vec3 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    void main()
    {
        vec3 pos2 = vec3(aVertexPosition.x * 15. * 3.14159265 / 180.,
                        aVertexPosition.y * 3.14159265 / 180.,
                         100000.);
        vec4 realPos = vec4(pos2.z * cos(pos2.y) * cos(pos2.x),
                        pos2.z * cos(pos2.y) * sin(pos2.x),
                        pos2.z * sin(pos2.y),
                        1.);
        gl_Position = uProjectionMatrix * uModelViewMatrix * realPos;
        gl_PointSize = 5.-.8*aVertexPosition.z;
    }
  `;

  const starFsSource = `
     varying highp vec4 vColor;
     void main()
     {
         if (distance(gl_PointCoord, vec2(.5, .5)) > .5)
             discard;
         gl_FragColor = vColor;
     }
  `;

  const pointVsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying vec4 vColor;
    
    void main()
    {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        gl_PointSize = 5.;
        vColor = aVertexColor;
    }
  `;

  const pointShaderProgram = initShaderProgram(gl, pointVsSource, starFsSource);

  pointProgramInfo = {
    program: pointShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(pointShaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(pointShaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(pointShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(pointShaderProgram, 'uModelViewMatrix'),
    },
  };

  const vsEquipSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec3 vPosition;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vPosition = aVertexPosition.xyz;
    }
  `;

  const fsEquipSource = `
    varying highp vec3 vPosition;
    uniform highp vec4 uBody1Position; // w = mu1
    uniform highp vec4 uBody2Position; // w = mu2
    uniform highp vec4 uRotationVector; // w = scale

    highp float potential(highp vec3 pos) {
      highp vec3 vr = cross(uRotationVector.xyz, pos);
      return (-uBody1Position.w/length(pos-uBody1Position.xyz)
              -uBody2Position.w/length(pos-uBody2Position.xyz)
              -0.5*dot(vr, vr)) * uRotationVector.w;
    }

    void main(void) {
      highp float r1 = potential(vPosition);
      if (r1 < -100.) discard;
      //highp float r2 = potential(vPosition + vec3(.05, 0., 0.));
      //highp float r3 = potential(vPosition + vec3(0., .05, 0.));
      gl_FragColor = (fract(r1) < .5) ?  vec4(.5, .5, .5, 1.) : vec4(.25, .25, .25, 1.);
      //highp float q = fract(r*100.);
      //gl_FragColor = vec4(q, q, q, 1.);
    }
  `;

  const equipShaderProgram = initShaderProgram(gl, vsEquipSource, fsEquipSource);

  equipProgramInfo = {
    program: equipShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(equipShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(equipShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(equipShaderProgram, 'uModelViewMatrix'),
      body1Position: gl.getUniformLocation(equipShaderProgram, 'uBody1Position'),
      body2Position: gl.getUniformLocation(equipShaderProgram, 'uBody2Position'),
      rotationVector: gl.getUniformLocation(equipShaderProgram, 'uRotationVector'),
    },
  };

  const vsCurrentSource = `
    attribute vec4 aVertexPosition;
    attribute float aPhase;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp float vPhase;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vPhase = aPhase;
    }
  `;

  // shader for drawing current carrying wires.  color alternates between black and yellow
  const fsCurrentSource = `
    varying highp float vPhase;
    uniform highp vec4 uColor;

    void main(void) {
      gl_FragColor = (mod(vPhase, 2.) < 1.) ? vec4(.4, .4, .4, 1.) : uColor;
      //gl_FragColor = vec4(vPhase, vPhase, vPhase, 1.);
    }
  `;

  const currentShaderProgram = initShaderProgram(gl, vsCurrentSource, fsCurrentSource);

  currentProgramInfo = {
    program: currentShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(currentShaderProgram, 'aVertexPosition'),
      phase: gl.getAttribLocation(currentShaderProgram, 'aPhase'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(currentShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(currentShaderProgram, 'uModelViewMatrix'),
      color: gl.getUniformLocation(currentShaderProgram, 'uColor'),
    },
  };

  resetParticles();

  var then = 0;

  // Draw the scene
  function render(now) {
    now *= 0.001;  // convert to seconds
    var deltaTime = (then) ? now - then : 0;
    then = now;

    // avoid large jumps when switching tabs
    deltaTime = Math.min(deltaTime, .03);

    deltaTimeWithoutSpeed = deltaTime;
    deltaTime = deltaTimeWithoutSpeed;
    currentTime += deltaTimeWithoutSpeed*reverse;

    resizeCanvas(canvas)
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene(gl, buffers, deltaTime);
    updateValues()

    // work around issue with back button
    if (curfunc != functionList[functionChooser.selectedIndex])
      functionChanged();

    // most magnetic examples have moving current so always animate in that case
    animating = !stoppedCheck.checked && (dispChooser.value.startsWith("parts") || BUILD_CASE_EMV(false, true, false));
    if (!animating)
        then = 0
    else
        requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  animating = true;
  refresh = function () {
      if (!animating)
          requestAnimationFrame(render);
  }

  // refresh when changing something (needed if stopped)
  stoppedCheck.onchange = function () {
    refresh()
  }
  //document.getElementById("viewFrame").onchange = refresh
}

function initBuffers(gl) {

  // create a buffer for sphere vertices
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [];
  var latcount = angleRes;
  var loncount = angleRes;
  var i, j;
  var r = 1;
  for (j = 0; j <= loncount; j++) 
     for (i = 0; i <= latcount; i++) {
        var th =   Math.PI*j/latcount;
        var ph = 2*Math.PI*i/loncount;
	positions.push(r*Math.sin(th)*Math.cos(ph), r*Math.sin(th)*Math.sin(ph), r*Math.cos(th));
     }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // set up normals
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  var vertexNormals = [];
  for (j = 0; j <= loncount; j++)
     for (i = 0; i <= latcount; i++) {
        var th =   Math.PI*j/latcount;
        var ph = 2*Math.PI*i/loncount;
	vertexNormals.push(Math.sin(th)*Math.cos(ph), Math.sin(th)*Math.sin(ph), Math.cos(th));
     }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  var indices = [];
  var skip = latcount+1;
  for (j = 0; j != loncount; j++)
      for (i = 0; i != latcount; i++) {
         var i2 = (i+1);
         var j2 = (j+1);
         // create triangles for sphere
         indices.push(i+j2*skip, i2+j*skip, i+j*skip);
         indices.push(i2+j*skip, i+j2*skip, i2+j2*skip);
      }

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const cylinderPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderPositionBuffer);

  positions = [];
  var latcount = angleRes;
  var loncount = angleRes;
  var i, j;
  var r = 1;
  for (i = 0; i != loncount; i++)  {
    var th1 = 2*Math.PI* i   /loncount;
    var th2 = 2*Math.PI*(i+1)/loncount;
    var rc1 = r*Math.cos(th1);
    var rs1 = r*Math.sin(th1);
    var rc2 = r*Math.cos(th2);
    var rs2 = r*Math.sin(th2);
    positions.push(rc1, rs1,  1, rc1, rs1, -1, rc2, rs2,  1,
                   rc1, rs1, -1, rc2, rs2,  1, rc2, rs2, -1,
                   rc1, rs1, -1, rc2, rs2, -1, 0, 0, -1,
                   rc1, rs1, +1, rc2, rs2, +1, 0, 0, +1);
  }
  const cylinderCount = positions.length/3;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const cylinderNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderNormalBuffer);

  vertexNormals = [];
  for (i = 0; i != loncount; i++)  {
    var th1 = 2*Math.PI* i   /loncount;
    var th2 = 2*Math.PI*(i+1)/loncount;
    var c1 = Math.cos(th1);
    var s1 = Math.sin(th1);
    var c2 = Math.cos(th2);
    var s2 = Math.sin(th2);
    vertexNormals.push(c1, s1, 0, c1, s2, 0, c2, s2, 0,
                       c1, s1, 0, c2, s2, 0, c2, s2, 0,
                       0, 0, -1, 0, 0, -1, 0, 0, -1,
                       0, 0,  1, 0, 0,  1, 0, 0,  1);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

  const extraBuffer = gl.createBuffer();
  const extra2Buffer = gl.createBuffer();
  const extra3Buffer = gl.createBuffer();

  return {
    spherePosition: positionBuffer,
    sphereNormal: normalBuffer,
    sphereIndices: indexBuffer,
    cylinderPosition: cylinderPositionBuffer,
    cylinderNormal: cylinderNormalBuffer,
    extra: extraBuffer,
    extra2: extra2Buffer,
    extra3: extra3Buffer,
    cylinderCount: cylinderCount
  };
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function actionPerformed() {
  curfunc.actionPerformed();
  updateStateLink();
}

const minDeltaTime = .000001

function resetDensityGroups() {
  var i;
  density = [];
  for (i = 0; i != densitygridsize2; i++)
    density[i] = 0;
  var slice = 0;
  var sliced = (slice > 0);
  var pcount = getParticleCount();
  for (i = 0; i != pcount; i++) {
    var p = particles[i];
    if (sliced)
      p.pos[slice-SLICE_X] = sliceval;
    addToDensityGroup(p);
  }

  // invalidate all unused particles so they will be
  // repositioned if the particle slider is moved to the right,
  // rather than just falling in where they happened to be last time
  for (; i != maxParticleCount; i++) {
    var p = particles[i];
    p.lifetime = -100;
  }
}


var timeStep;

function drawScene(gl, buffers, deltaTime) {
  timeStep = deltaTime * 1000 * .03;
  reverse = (reverseCheck.checked) ? -1 : 1;
  checkFlatState();
  heightScale = (isFlat) ? 0 : heightScaleBar.value / 30;
  curfunc.setupFrame();

  if (functionChangeFlag)
    generateFunction();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mainView = { x:0, y:0, width:gl.canvas.clientWidth, height:gl.canvas.clientHeight };
  setView(mainView);

  viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, 0, -5]);
  if (!isFlat) {
    mat4.multiply(viewMatrix, viewMatrix, rotationMatrix);
    mat4.scale(viewMatrix, viewMatrix, [zoom3d, zoom3d, zoom3d])
  }
  mat4.invert(inverseRotationMatrix, rotationMatrix)

  drawFloor();
  if (dispChooser.value.startsWith("partsvel") || dispChooser.value == "partsforce") {
    moveParticles();
    drawParticles(gl, buffers, projectionMatrix, viewMatrix)
  } else if (dispChooser.value.startsWith("vectors")) {
    drawVectors(gl, buffers, projectionMatrix, viewMatrix);
  } else if (dispChooser.value == "partscurl") {
    moveParticles();
    drawCurlers(gl, buffers, projectionMatrix, viewMatrix)
  } else if (dispChooser.value == "partsdiv") {
    moveParticles();
    drawDivDetectors(gl, buffers, projectionMatrix, viewMatrix)
  }

  //curfunc.render();
  if (mousePoint) {
    //mousePoint[2] = getHeight(mousePoint[0], mousePoint[1])+dh;
    mousePoint[2] = 0;
    drawSphere(mousePoint, .04, [1, 1, 0]);
    getPot = false;
    var fvec = [];
    curfunc.getField(fvec, mousePoint);
    fvec[2] = 0;
    var mult = .2*reverse/vecLength(fvec);
    var i;
    for (i = 0; i != 2; i++)
      fvec[i] *= mult;
    drawArrow(gl, buffers, projectionMatrix, viewMatrix, mousePoint, fvec, [1, 1, 0], false);
    getPot = (dispChooser.value == "equip");
  }

  var mode = modeChooser.selectedIndex;
  if (mode == MODE_LINE_INT)
    lineIntegral(true);
  else if (mode == MODE_SURF_INT)
    lineIntegral(false);
  else if (parseError) {
    var status = document.getElementById("status");
    status.hidden = false;
    status.innerHTML = "Parse error in expression";
  } else
    document.getElementById("status").hidden = true;

  if (isFlat)
    hideAxes();
  else
    drawAxes(gl, buffers, viewMatrix);
  // no drawing after this!
}

function getById(x) {
  return document.getElementById(x);
}

function showDiv(div, x) {
  document.getElementById(div).style.display = (x) ? "block" : "none";
}

function csInRange(x, xa, xb) {
  if (xa < xb)
    return x >= xa-5 && x <= xb+5;
  return x >= xb-5 && x <= xa+5;
}


// map point on screen to 3-d coordinates assuming it lies on a given plane
// (pn = plane normal, pp = point in plane).  Make sure projectionMatrix
// is the correct one before calling!
function unmap3d(x3, x, y, pn, pp) {
  var invProjMatrix = mat4.create();
  mat4.invert(invProjMatrix, projectionMatrix);

  // calculate point on near plane corresponding to mouse point.
  // w value used here doesn't matter!
  var mousePos = [(x-mainView.width/2)/(mainView.width/2), -(y-mainView.height/2)/(mainView.height/2), -1, 1];

  // invert projection and view matrices so we can get this point into world coordinates
  vec4.transformMat4(isFlat ? x3 : mousePos, mousePos, invProjMatrix);

  // if this is flat mode we're done
  if (isFlat)
    return;

  // divide out w
  var i;
  for (i = 0; i != 4; i++)
    mousePos[i] /= mousePos[3];

  var invViewMatrix = mat4.create();
  mat4.invert(invViewMatrix, viewMatrix);
  var cameraPos = [0, 0, 0, 1];

  // put camera and mouse point into world coordinates
  vec4.transformMat4(cameraPos, cameraPos, invViewMatrix);
  vec4.transformMat4(mousePos, mousePos, invViewMatrix);

  // calculate direction of mouse point from camera,
  // so we can calculate line through those two points
  var mvx = (mousePos[0]-cameraPos[0]);
  var mvy = (mousePos[1]-cameraPos[1]);
  var mvz = (mousePos[2]-cameraPos[2]);

  // calculate the intersection between the line and the given plane
  var t = ((pp[0]-cameraPos[0])*pn[0] +
           (pp[1]-cameraPos[1])*pn[1] +
           (pp[2]-cameraPos[2])*pn[2]) /
            (pn[0]*mvx+pn[1]*mvy+pn[2]*mvz);

  x3[0] = cameraPos[0]+mvx*t;
  x3[1] = cameraPos[1]+mvy*t;
  x3[2] = cameraPos[2]+mvz*t;
}

function dispChooserChanged() {
  var disp = dispChooser.value;
  getPot = (disp == "equip");
  showA = (disp == "partsvela" || disp == "vectorsa");
  kickButton.disabled = (disp != "partsforce");
  showDiv("potentialDiv", false);
  showDiv("vecDensityDiv", false);
  showDiv("lineDensityDiv", false);
  showDiv("partCountDiv", false);
  showDiv("strengthDiv", true);
  if (disp == "vectors" || disp == "vectorsa" || disp == "viewpaper") {
    showDiv("vecDensityDiv", true);
  } else if (disp == "streamlines") {
    showDiv("lineDensityDiv", true);
  } else if (disp == "equip") {
    showDiv("potentialDiv", true);
  } else {
    showDiv("partCountDiv", true);
  }
  var vecDensityLabel = document.getElementById("vecDensityLabel");
  vecDensityLabel.innerHTML = (disp == "viewpaper" ? "Resolution:" : "Vector Density:");
  var strengthLabel = document.getElementById("strengthLabel");
  strengthLabel.innerHTML = (disp.startsWith("parts")) ? "Particle Speed:" : "Brightness:";
  if (disp == "equip")
    showDiv("strengthDiv", false);
  resetParticles();
  streamlines = null;
  updateStateLink();
  if (refresh) refresh();
}

function drawVectors(gl, buffers, projectionMatrix, viewMatrix) {
  var x, y, z;
  var dd = {};
  dd.mult = parseInt(strengthBar.value) * 80. * curfunc.getFieldMult();
  dd.gl = gl;
  dd.buffers = buffers;
  dd.projectionMatrix = projectionMatrix;
  dd.viewMatrix = viewMatrix;
  dd.field = [];
  dd.vv = [];
  vectorSpacing = parseInt(vecDensityBar.value);
  var vec = [0, 0, 0];

    vectorSpacing = Math.floor(vectorSpacing/2);
    for (x = 0; x != vectorSpacing; x++) {
      vec[0] = x*(2.0/(vectorSpacing-1))-1;
      for (y = 0; y != vectorSpacing; y++) {
        vec[1] = y*(2.0/(vectorSpacing-1))-1;
        drawVector(dd, vec);
      }
    }
  //curfunc.render(g);
}

// draw the appropriate field vector at xx,yy,zz
function drawVector(dd, vec) {
  var field = dd.field;

  // calculate field vector
  boundCheck = false;
  curfunc.getField(field, vec);
  if (boundCheck)
    return;
  var dn = Math.hypot(field[0], field[1]);
  var dnr = dn*reverse;
  if (dn > 0) {
    field[0] /= dnr;
    field[1] /= dnr;
    field[2] /= dnr;
  }
  dn *= dd.mult;
  var col = Math.min(Math.floor(dn*255)*3, 511*3);
  var sw2 = 1./(vectorSpacing-1);
  var vv = dd.vv;
  vv[0] = sw2*field[0];
  vv[1] = sw2*field[1];
  vec[2] = getHeight(vec[0], vec[1]);
  // draw arrow pointing down the slope
  vv[2] = (getHeight(vec[0]+vv[0]*.1, vec[1]+vv[1]*.1)-vec[2])/.1;
  // make sure the arrow is shown on top of the surface
  vec[2] += dh;
  drawArrow(dd.gl, dd.buffers, dd.projectionMatrix, dd.viewMatrix, vec, vv, [fieldColors[col], fieldColors[col+1], fieldColors[col+2]]);
}

function lineIntegral(line) {
        gl.disable(gl.DEPTH_TEST);           // disable depth testing
	if (integralX == -1)
	    return;
	if (dragStart[0] == integralX || dragStart[1] == integralY)
	    return;
	var x1p = Math.min(dragStart[0], integralX);
	var y1p = Math.max(dragStart[1], integralY);
	var x2p = Math.max(dragStart[0], integralX);
	var y2p = Math.min(dragStart[1], integralY);
	var step = 40/Math.min(mainView.width, mainView.height);
	var x;
	var pos = rk_k2;
	if (!line)
            drawLineWithPoints([x1p, y1p, 0, x2p, y1p, 0, x2p, y2p, 0, x1p, y2p, 0, x1p, y1p, 0], [1, 1, 1]);
	for (x = x1p; x <= x2p; x += step) {
	    var step1 = x2p-x;
	    if (step1 > step)
		step1 = step;
	    pos[0] = x;
	    pos[1] = y1p;
	    lineIntegralStep(x, y1p, pos, step1, 0, line);
	    pos[1] = y2p;
	    lineIntegralStep(x+step1, y2p, pos, -step1, 0, line);
	}
	var y;
	for (y = y2p; y <= y1p; y += step) {
	    var step1 = y1p-y;
	    if (step1 > step)
		step1 = step;
	    pos[0] = x1p;
	    pos[1] = y;
	    lineIntegralStep(x1p, y, pos, 0, step1, line);
	    pos[0] = x2p;
	    lineIntegralStep(x2p, y+step1, pos, 0, -step1, line);
	}
	boundCheck = false;
	pos[1] = y1p;
	var iv1 = numIntegrate(pos, 0, x1p, x2p, line);
	pos[1] = y2p;
	var iv2 = numIntegrate(pos, 0, x1p, x2p, line);
	pos[0] = x1p;
	var iv3 = numIntegrate(pos, 1, y1p, y2p, line);
	pos[0] = x2p;
	var iv4 = numIntegrate(pos, 1, y1p, y2p, line);
	var ivtot = -iv1+iv2+iv3-iv4;
	if (Math.abs(ivtot) < 1e-7)
	    ivtot = 0;
	ivtot *= reverse * curfunc.getFieldMult();
        if (line && !curfunc.nonGradient())   // cheating
            ivtot = 0;
	var s = ((!line) ? "Flux = " : "Circulation = ") + round(ivtot*1e5);
        var status = document.getElementById("status");
        status.hidden = false;
        status.innerHTML = s;
    }

    function numIntegrate(pos, n1, x1, x2, line) {
	var steps = 8;
	var lastres = 0;
	var res = 0;
	var n2 = (line) ? n1 : 1-n1;
	while (true) {
	    var i;
	    var h = (x2-x1)/steps;
	    res = 0;
	    for (i = 0; i <= steps; i++) {
		pos[n1] = x1+i*h;
		var field = rk_k1;
		curfunc.getField(field, pos);
		var ss = (i == 0 || i == steps) ? 1 : ((i & 1) == 1) ? 4 : 2;
		res += field[n2]*h*ss;
	    }
	    res /= 3;
	    if (Math.abs(lastres-res) < 1e-7)
		break;
	    lastres = res;
	    steps *= 2;
	    if (steps == 65536)
		break;
	}
	if (!line && n1 == 0)
	    res = -res;
	return res;
    }

    function lineIntegralStep(x, y, pos, dx, dy, line) {
	var field = rk_k1;
	curfunc.getField(field, pos);
	var f = (line) ? field[0]*dx+field[1]*dy : field[0]*dy - field[1]*dx;
	f *= reverse*curfunc.getFieldMult();
        //console.log(Math.log(Math.abs(f)));
	var dn = Math.max(0, .43*(12+Math.log(Math.abs(f))));
	if (dn > 1)
	    dn = 1;
	var col1 = (dn*128+127)/255;
	var col2 = (127-dn*127)/255;
	if (!line) {
	    x += dx/2;
	    y += dy/2;
	}
        if (f == 0)
          drawArrow(gl, buffers, projectionMatrix, viewMatrix, [x, y, 0], [dx, dy, 0], [col2, col2, col2]);
        else if (f > 0)
          drawArrow(gl, buffers, projectionMatrix, viewMatrix, [x, y, 0], line ? [dx, dy, 0] : [dy, -dx, 0], [col1, col2, col2]);
        else if (line)
          drawArrow(gl, buffers, projectionMatrix, viewMatrix, [x+dx, y+dy, 0], [-dx, -dy, 0], [col2, col1, col2]);
        else
          drawArrow(gl, buffers, projectionMatrix, viewMatrix, [x, y, 0], [-dy, dx, 0], [col2, col1, col2]);
    }

function didAdjust() {
  streamlines = null;
  functionChangeFlag = true;
  updateStateLink();
  if (refresh)
    refresh();
}

const dh = .005;

    function genLines() {
	if (streamlines != undefined)
	    return;
	partMult = fieldStrength = 10*curfunc.getFieldMult();
	var i;
	
	var lineGridSize = 8; // parseInt(lineDensityBar.value);
	if (lineGridSize < 3)
	    lineGridSize = 3;
	if (lineGridSize > 16)
	    lineGridSize = 16;
	lineGridSize *= 2;
	var ct = 30*lineGridSize*lineGridSize;
	var brightmult = 160*parseInt(strengthBar.value)*curfunc.getFieldMult();

	streamlines = [];
	var lineGrid = [];
	var lineGridMult = lineGridSize/2.;
	var j, k;
	for (i = 0; i != lineGridSize; i++) {
	    lineGrid[i] = [];
	    for (j = 0; j != lineGridSize; j++)
	        lineGrid[i][j] = false;
	}
	var origp = [];
	var field = [];
	var p = new Particle();
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
		    for (j = 0; j != 2; j++)
			p.pos[j] = origp[j];
		    dir = -1;
		    continue;
		}
		dir = 1;
		var px = 0, py = 0, pz = 0;
		while (true) {
		    if (!lineGrid[px][py])
			break;
		    if (++px < lineGridSize)
			continue;
		    px = 0;
		    if (++py < lineGridSize)
			continue;
		    break;
		}
		if (py == lineGridSize)
		    break;
		lineGrid[px][py] = true;
		var offs = .5/lineGridMult;
		origp[0] = p.pos[0] = px/lineGridMult-1+offs;
		origp[1] = p.pos[1] = py/lineGridMult-1+offs;
	    }

            streamlines.push(p.pos[0], p.pos[1], getHeight(p.pos[0], p.pos[1])+dh);
	    var x = p.pos;
	    lineSegment(p, dir);
	    if (p.lifetime < 0) {
		streamlines.splice(streamlines.length-3, 3);
		continue;
	    }
	    var gx = Math.floor((x[0]+1)*lineGridMult);
	    var gy = Math.floor((x[1]+1)*lineGridMult);
	    if (!lineGrid[gx][gy])
		segs--;
	    lineGrid[gx][gy] = true;
            streamlines.push(p.pos[0], p.pos[1], getHeight(p.pos[0], p.pos[1])+dh);
	    var d2 = dist2(origp, x);
	    if (d2 > lastdist)
		lastdist = d2;
	    else
		segs++;
	    if (segs > 10 || d2 < .001)
		p.lifetime = -1;
	}
    }

    function dist2(a, b) {
	var c0 = a[0]-b[0];
	var c1 = a[1]-b[1];
	return c0*c0+c1*c1;
    }

    function lineSegment(p, dir)
    {
	var numIter=0;
	var maxh=20;
	var error=0.0, E = .001, localError;
	var order = 2;
	var Y = rk_Y;
	var Yhalf = rk_Yhalf;
	oldY = rk_oldY;
	var i;

	for (i = 0; i != 2; i++)
	    oldY[i] = Y[i] = Yhalf[i] = p.pos[i];
	var h = p.stepsize;
	ls_fieldavg[0] = ls_fieldavg[1] = ls_fieldavg[2] = 0;

	var steps = 0;
	var minh = .1;
	var segSize2min = .04*.04;
	var segSize2max = .08*.08;
	var lastd = 0;
	var avgct = 0;
	while (true) {
	    boundCheck = false;
	    steps++;
	    if (steps > 100) {
		//System.out.print("maxsteps\n");
		p.lifetime = -1;
		break;
	    }
	    //System.out.print(h + " " + boundCheck + "/\n");

	    // estimate one full step
	    rk(order, 0, Y, dir*h);

	    // estimate two half steps
	    rk(order, 0, Yhalf, dir*h*0.5);
	    rk(order, 0, Yhalf, dir*h*0.5);

	    //System.out.print(h + " " + boundCheck + "\n");
	    if (boundCheck) {
		for (i = 0; i != order; i++)
		    Y[i] = Yhalf[i] = oldY[i]; 
		h /= 2;
		if (h < minh) {
		    p.lifetime = -1;
		    break;
		}
		continue;
	    }
	    if (Y[0] < -1 || Y[0] >= .999 ||
		Y[1] < -1 || Y[1] >= .999) {
		for (i = 0; i != order; i++)
		    Y[i] = Yhalf[i] = oldY[i]; 
		h /= 2;
		if (h < minh) {
		    //System.out.print("bound1\n");
		    p.lifetime = -1;
		    break;
		}
		continue;
	    }

	    // estimate the local error
	    localError = Math.abs(Y[0] - Yhalf[0]) + Math.abs(Y[1] - Yhalf[1]);
	    
	    if (localError > E && h > minh) {
		h *= 0.75; // decrease the step size
		if (h < minh)
		    h = minh;
		for (i = 0; i != order; i++)
		    Y[i] = Yhalf[i] = oldY[i]; 
		continue;
	    } else if (localError < (E * 0.5)) {
		h *= 1.25; // increase the step size
		if (h > maxh)
		    h = maxh;
	    }
	    
	    var d = dist2(p.pos, Y);
	    if (!(d-lastd > 1e-10)) {
		// we're not getting anywhere!
		//System.out.print("nga " + d + " " + lastd + "\n");
		p.lifetime = -1;
		break;
	    }
	    if (d > segSize2max) {
		h /= 2;
		if (h < minh)
		    break;
		for (i = 0; i != order; i++)
		    Y[i] = Yhalf[i] = oldY[i]; 
		continue;
	    }
	    ls_fieldavg[0] += rk_k1[0];
	    ls_fieldavg[1] += rk_k1[1];
	    avgct++;

	    if (d > segSize2min)
		break;
	    lastd = d;

	    for (i = 0; i != order; i++)
		oldY[i] = Yhalf[i] = Y[i]; 
	}

	p.stepsize = h;
	for (i = 0; i != 2; i++)
	    p.pos[i] = Y[i];
	p.phi = Math.hypot(ls_fieldavg[0], ls_fieldavg[1])/avgct;
    }
    
    function genEquips() {
        var x, y;
	if (streamlines != undefined)
	    return;
        streamlines = [];
        for (x = 0; x != gridsize; x++)
            for (y = 0; y != gridsize; y++) {
                /*if (!grid[x][y].visible) continue;*/
                // try all possible edge combinations
                tryEdge(x, y,  x+1, y,  x, y+1,  x+1, y+1);
                tryEdge(x, y,  x+1, y,  x, y,    x, y+1);
                tryEdge(x, y,  x+1, y,  x+1, y,  x+1, y+1);
                tryEdge(x, y,  x, y+1,  x+1, y,  x+1, y+1);
                tryEdge(x, y,  x, y+1,  x, y+1,  x+1, y+1);
                tryEdge(x+1, y, x+1, y+1, x, y+1, x+1, y+1);
            }
    }

    // try to draw any equipotentials between edge (x1,y1)-(x2,y2)
    // and edge (x3,y3)-(x4,y4).
    function tryEdge(x1, y1, x2, y2, x3, y3, x4, y4) {
        var i;
        var emult = 5;
        var mult = 1/(40 * emult * .1);
        var ep1 = grid[x1][y1];
        var ep2 = grid[x2][y2];
        var ep3 = grid[x3][y3];
        var ep4 = grid[x4][y4];
        var pmin = Math.min(ep1.pot, ep2.pot, ep3.pot, ep4.pot);
        var pmax = Math.max(ep1.pot, ep2.pot, ep3.pot, ep4.pot);
        if (pmin < -5) // was 10
            pmin = -5;
        if (pmax > 5)
            pmax = 5;
        var imin = Math.floor(pmin/mult);
        var imax = Math.floor(pmax/mult);
        var pa = [];
        var pb = [];
        for (i = imin; i <= imax; i++) {
            var pval = i*mult;
            if (!(spanning(ep1, ep2, pval) && spanning(ep3, ep4, pval)))
                continue;
            interpPoint(ep1, ep2, x1, y1, x2, y2, pval, pa);
            interpPoint(ep3, ep4, x3, y3, x4, y4, pval, pb);
            streamlines.push(pa[0], pa[1], pval*heightScale+dh);
            streamlines.push(pb[0], pb[1], pval*heightScale+dh);
        }
    }

    function spanning(ep1, ep2, pval) {
        if (ep1.pot == ep2.pot)
            return false;
        return !((ep1.pot < pval && ep2.pot < pval) ||
                 (ep1.pot > pval && ep2.pot > pval));
    }

    function interpPoint(ep1, ep2, x1, y1, x2, y2, pval, pos) {
        var interp2 = (pval-ep1.pot)/(ep2.pot-ep1.pot);
        var interp1 = 1-interp2;
        pos[0] = (x1*interp1 + x2*interp2) * 2./gridsize - 1;
        pos[1] = (y1*interp1 + y2*interp2) * 2./gridsize - 1;
    }

function getHeight(x, y) {
  x = (x+1)*(gridsize/2);
  y = (y+1)*(gridsize/2);
  var ix = Math.floor(x);
  var iy = Math.floor(y);
  ix = Math.max(Math.min(ix, gridsize-1), 0);
  iy = Math.max(Math.min(iy, gridsize-1), 0);
  //if (ix >= gridsize || iy >= gridsize)
    //return grid[ix][iy].height;
  var fracx = x-ix;
  var fracy = y-iy;
  return grid[ix][iy].height * (1-fracx) * (1-fracy) +
         grid[ix+1][iy].height * fracx * (1-fracy) +
         grid[ix][iy+1].height * (1-fracx) * fracy +
         grid[ix+1][iy+1].height * fracx * fracy;
}

function curlcalc(x, y, ax, ay) {
  rk_yn[0] = x;
  rk_yn[1] = y;
  curfunc.getField(rk_k1, rk_yn);
  return partMult*(rk_k1[0]*ax + rk_k1[1]*ay);
}

function drawCurlers(gl, buffers, projectionMatrix, viewMatrix) {
  gl.disable(gl.DEPTH_TEST);           // disable depth testing
  gl.useProgram(pointProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
  const len = .02;
      
  var pverts = [];
  var pcolors = [];
  var lverts = [];
  var lcolors = [];
  var pcount = getParticleCount();

  // draw fewer
  pcount = ((pcount+4)/5)|0;

  for (var i = 0; i < pcount; i++) {
    var pr = 1, pg = 1, pb = 1;
    var p = particles[i];
    var thd = p.theta-p.initialTheta;
    if (thd > 0)
      pr = pb = 1-thd;
    else
      pg = pb = 1+thd;
    var pos = p.pos;
    var px = pos[0];
    var py = pos[1];
    var ax = Math.cos(p.theta)*len;
    var ay = Math.sin(p.theta)*len;
    var a1 = curlcalc(p.pos[0]+ax, p.pos[1]+ay, -ay, ax);
    var a2 = curlcalc(p.pos[0]-ay, p.pos[1]+ax, -ax, -ay);
    var a3 = curlcalc(p.pos[0]-ax, p.pos[1]-ay, ay, -ax);
    var a4 = curlcalc(p.pos[0]+ay, p.pos[1]-ax, ax, ay);
    p.theta += (a1+a2+a3+a4)/(4*len*len);
    pverts.push(px+ax, py+ay);
    lverts.push(px+ax, py+ay, px-ax, py-ay, px+ay, py-ax, px-ay, py+ax);
    var r = i/pcount;
    lcolors.push(pr, pg, pb, pr, pg, pb, pr, pg, pb, pr, pg, pb);
    pcolors.push(pr, pg, pb);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pverts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(pointProgramInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pointProgramInfo.attribLocations.vertexPosition);
      
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pcolors), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(pointProgramInfo.attribLocations.vertexColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pointProgramInfo.attribLocations.vertexColor);
      
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);

  gl.drawArrays(gl.POINTS, 0, pverts.length/2);
  gl.disableVertexAttribArray(pointProgramInfo.attribLocations.vertexPosition);

  gl.useProgram(colorAttrProgramInfo.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lverts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorAttrProgramInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lcolors), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorAttrProgramInfo.attribLocations.vertexColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexColor);
          
      
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);

  gl.drawArrays(gl.LINES, 0, lverts.length/2);
  gl.disableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);
}

function drawDivDetectors(gl, buffers, projectionMatrix, viewMatrix) {
  gl.disable(gl.DEPTH_TEST);           // disable depth testing
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
      
  var lverts = [];
  var lcolors = [];
  var pcount = getParticleCount();

  // draw fewer
  pcount = ((pcount+4)/5)|0;

  for (var i = 0; i < pcount; i++) {
    var p = particles[i];
    var pos = p.pos;
    var px = pos[0];
    var py = pos[1];
    var ax = p.sizeX;
    var ay = p.sizeY;
    const dx = .02; const dy = .02;
    var a1 = curlcalc(p.pos[0]+dx, p.pos[1], dx, 0);
    var a2 = curlcalc(p.pos[0], p.pos[1]+dy, 0, dy);
    var a3 = curlcalc(p.pos[0]-dx, p.pos[1],   -dx, 0);
    var a4 = curlcalc(p.pos[0], p.pos[1]-dy, 0, -dy);
    p.sizeX += (a1+a3)/(2*dx);
    p.sizeY += (a2+a4)/(2*dy);
    if (p.sizeX < 0 || p.sizeY < 0 || p.sizeX > .2 || p.sizeY > .2)
      p.lifetime = -1;
    lverts.push(px-ax, py-ay, px-ax, py+ay, px-ax, py+ay, px+ax, py+ay, px+ax, py+ay, px+ax, py-ay, px+ax, py-ay, px-ax, py-ay);
    var r = i/pcount;
    var pr = 1, pg = 1, pb = 1;
    var len = (ax+ay)*.5;
    if (len > initialDivDetectorSize) {
      pr = pb = 2-len/initialDivDetectorSize;
    } else {
      pg = pb = len/initialDivDetectorSize;
    }
    lcolors.push(pr, pg, pb, pr, pg, pb, pr, pg, pb, pr, pg, pb);
    lcolors.push(pr, pg, pb, pr, pg, pb, pr, pg, pb, pr, pg, pb);
  }
  gl.useProgram(colorAttrProgramInfo.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lverts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorAttrProgramInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lcolors), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorAttrProgramInfo.attribLocations.vertexColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexColor);
      
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);

  gl.drawArrays(gl.LINES, 0, lverts.length/2);
  gl.disableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);
}

function drawParticles(gl, buffers, projectionMatrix, viewMatrix) {
  gl.useProgram(pointProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
      
  var verts = [];
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  var pcount = getParticleCount();
  for (var i = 0; i < pcount; i++) {
    var pos = particles[i].pos;
    var px = pos[0];
    var py = pos[1];
    //var ge = grid[Math.floor((pos[0]+1)*gridsize/2)][Math.floor((pos[1]+1)*gridsize/2)];
    verts.push(px, py, getHeight(px, py)+dh);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
          
  gl.vertexAttribPointer(pointProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pointProgramInfo.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(pointProgramInfo.attribLocations.vertexColor);
      
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.vertexAttrib4f(pointProgramInfo.attribLocations.vertexColor, 1, 1, 1, 1);

  gl.drawArrays(gl.POINTS, 0, verts.length/3);
  gl.disableVertexAttribArray(pointProgramInfo.attribLocations.vertexPosition);
}

function setView(view) {
  projectionMatrix = mat4.create();

  // if window is more tall than wide, adjust fov to zoom out or the earth will be cut off on the sides
  var aspect = view.width/view.height;
  var fov = Math.atan(aspect > 1 ? 1 : 1/aspect);
  if (!isFlat)
    mat4.perspective(projectionMatrix, fov, aspect, 0.1, 100);
  else if (aspect > 1)
    mat4.ortho(projectionMatrix, -aspect, aspect, -1, 1, 0.1, 100);
  else
    mat4.ortho(projectionMatrix, -1, 1, -1/aspect, 1/aspect, 0.1, 100);
  view.projectionMatrix = projectionMatrix;

  var scale = window.devicePixelRatio;
  gl.viewport(view.x*scale, (gl.canvas.clientHeight-view.height-view.y)*scale, view.width*scale, view.height*scale);
}

function drawAxes(gl, buffers, viewMatrix) {
  var scale = window.devicePixelRatio;
  var xOff = gl.canvas.clientWidth-100;
  var view = { x:xOff, y:0, width:100, height:100 };
  setView(view);

  const scaledViewMatrix = mat4.create();
  var inverseMatrix;

  // zoom3d is already in viewMatrix, so divide that out because zoom shouldn't change the axes
  var scale = 3 * .4/zoom3d;
  mat4.scale(scaledViewMatrix, viewMatrix, [scale, scale, scale, 1]);
  
  gl.disable(gl.DEPTH_TEST);           // disable depth testing

  drawArrow(gl, buffers, projectionMatrix, scaledViewMatrix, [0, 0, 0], [1, 0, 0], [1, 1, 1], true);
  drawArrow(gl, buffers, projectionMatrix, scaledViewMatrix, [0, 0, 0], [0, 1, 0], [1, 1, 1], true);
  drawArrow(gl, buffers, projectionMatrix, scaledViewMatrix, [0, 0, 0], [0, 0, 1], [1, 1, 1], true);

  var i;
  var labels = "xyz";
  for (i = 0; i != 3; i++) {
    var vec = vec4.create();
    vec[i] = 1.3; vec[3] = 1;
    vec4.transformMat4(vec, vec, scaledViewMatrix);
    vec4.transformMat4(vec, vec, projectionMatrix);
    var div = document.getElementById(labels.substring(i, i+1) + "Label");
    div.style.left = (xOff + Math.floor(50-5+50*(vec[0]/vec[3]))) + "px";
    div.style.top = Math.floor(50-5-50*(vec[1]/vec[3])) + "px";
  }

  // restore projection matrix so mouse drag handlers can use it!
  projectionMatrix = mainView.projectionMatrix;
}

function hideAxes() {
  var labels = "xyz";
  var i;
  for (i = 0; i != 3; i++) {
    var div = document.getElementById(labels.substring(i, i+1) + "Label");
    div.style.top = "-20px";
  }
}

function drawSphere(position, scale, color) {
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  const normalMatrix = mat4.create();

  var programInfo = colorProgramInfo

  //mat4.multiply(modelViewMatrix, modelViewMatrix, normalMatrix);
  mat4.translate(modelViewMatrix, modelViewMatrix, position);
  mat4.scale(modelViewMatrix, modelViewMatrix, [scale, scale, scale, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.spherePosition);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sphereNormal);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.sphereIndices);
  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix,     false, normalMatrix);
  if (color == undefined)
    gl.drawElements(gl.LINES, angleRes*angleRes*3*2, gl.UNSIGNED_SHORT, 0);  // wireframe
  else {
    gl.uniform4f(programInfo.uniformLocations.color, color[0], color[1], color[2], 1);
    gl.drawElements(gl.TRIANGLES, angleRes*angleRes*3*2, gl.UNSIGNED_SHORT, 0);
  }
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function checkFlatState() {
  var oldFlat = isFlat;
  var disp = dispChooser.value;
  isFlat = flatCheck.checked || curfunc.nonGradient() /*|| disp == "vectors" */ || disp == "partscurl" || disp == "partsdiv";
  var mode = modeChooser.selectedIndex;
  if (mode == MODE_LINE_INT || mode == MODE_SURF_INT)
    isFlat = true;
  if (isFlat != oldFlat) {
    functionChangeFlag = true;
    showDiv("heightDiv", !isFlat);
    freezeMousePoint = false;
    mousePoint = null;
  }
}

function functionChanged(first) {
  if (!first)
    reverseCheck.checked = false;
  parseError = false;
  curfunc = functionList[functionChooser.selectedIndex];
  streamlines = undefined;
  var i;
  for (i = 0; i != 3; i++)
    showDiv("aux" + (i+1) + "Div", false);
  showDiv("textFieldDiv", false);
  showDiv("textField23Div", false);
  if (!first)
    strengthBar.value = 20;
  setupDispChooser(!curfunc.nonGradient());
  curfunc.setup();
  resetParticles();
  dispChooserChanged();
  getById("floorLineChooserPotential").disabled = curfunc.nonGradient();
  getById("floorColorChooserPotential").disabled = curfunc.nonGradient();
  functionChangeFlag = true;
}

function setupDispChooser(gradient) {
  var opts = dispChooser.options;
  var i;
  for (i = 0; i != opts.length; i++) {
    var opt = opts[i];
    if (opt.value == "equip")
      opt.disabled = !gradient;
  }
  if (dispChooser.value == "equip" && !gradient)
    dispChooser.value = "partsvel";
}

function drawArrow(gl, buffers, projectionMatrix, viewMatrix, pos, arrowVec, col, drawingAxes) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  pos = Array.from(pos)  // make sure it's an array
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  var vecLen = Math.sqrt(vec3.dot(arrowVec, arrowVec))

  var arrowLen = 1;
  var arrowHeadSize = .05/vecLen
  if (arrowHeadSize > arrowLen)
     arrowHeadSize = .05
  arrowHeadSize = .5;
  var verts = []
  var arrowTip = []
  var crossVec = vec3.create()
  var zVec = vec3.create()

  // when drawing axes, find a vector perpendicular to arrow vector and eye vector, so the arrowhead can be seen.
  // otherwise, we just want the arrowhead to be on the potential surface
  if (!drawingAxes)
    zVec[2] = 1;
  else
    vec3.transformMat4(zVec, [0, 0, 1], inverseRotationMatrix);
  vec3.cross(crossVec, arrowVec, zVec)
  vec3.normalize(crossVec, crossVec);

  var cross2Vec = vec3.create();
  vec3.cross(cross2Vec, crossVec, arrowVec);
  vec3.normalize(cross2Vec, cross2Vec);

  var zm = (drawingAxes) ? .4 : zoom3d;
  const shaftWidth = .02 * (.4/zm);
  const headWidth = .08 * (.4/zm);
  var shaftStart1 = [], shaftStart2 = [], shaftEnd1 = [], shaftEnd2 = [], head1 = [], head2 = [];
  var shaftLen = .5; // .1-arrowHeadSize;
  var i;

  // calculate arrow points
  for (i = 0; i != 3; i++) {
    // points on either side of shaft at start
    shaftStart1.push(pos[i]+crossVec[i]*shaftWidth);
    shaftStart2.push(pos[i]-crossVec[i]*shaftWidth);

    // points on either side of shaft at end
    shaftEnd1.push(pos[i]+crossVec[i]*shaftWidth+arrowVec[i]*shaftLen);
    shaftEnd2.push(pos[i]-crossVec[i]*shaftWidth+arrowVec[i]*shaftLen);

    // points on either side of head
    head1.push(pos[i]+crossVec[i]*headWidth+arrowVec[i]*shaftLen);
    head2.push(pos[i]-crossVec[i]*headWidth+arrowVec[i]*shaftLen);

    // tip of arrow
    arrowTip.push(pos[i]+arrowVec[i]*arrowLen);
  }

  verts = verts.concat(shaftStart1, shaftEnd1, shaftStart2, shaftEnd1, shaftStart2, shaftEnd2, head1, head2, arrowTip);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);

  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, col[0], col[1], col[2], 1);
  gl.drawArrays(gl.TRIANGLES, 0, 9);
  gl.disableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);
}

function removeFromDensityGroup(p) {
  var a = Math.floor((p.pos[0]+1)*(densitygridsize/2));
  var b = Math.floor((p.pos[1]+1)*(densitygridsize/2));
  var n = 0;
  density[a+b*densitygridsize]--;
}

function addToDensityGroup(p) {
  var a = Math.floor((p.pos[0]+1)*(densitygridsize/2));
  var b = Math.floor((p.pos[1]+1)*(densitygridsize/2));
  var n = 0;
  return ++density[a+b*densitygridsize];
}

function positionParticle(p) {
  var x, y, z;
  var bestx = 0, besty = 0, bestz = 0;
  var best = 10000;

  // we avoid scanning the grid in the same order every time
  // so that we treat equal-density squares as equally as possible.
  var randaddx = getrand(densitygridsize);
  var randaddy = getrand(densitygridsize);
  for (x = 0; x != densitygridsize; x++)
    for (y = 0; y != densitygridsize; y++) {
      var ix = (randaddx + x) % densitygridsize;
      var iy = (randaddy + y) % densitygridsize;
      if (density[ix+iy*densitygridsize] <= best) {
        bestx = ix;
        besty = iy;
        best = density[ix+iy*densitygridsize];
      }
    }
  p.pos[0] = bestx*densitygroupsize + getrand(100)*densitygroupsize/100.0 - 1;
  p.pos[1] = besty*densitygroupsize + getrand(100)*densitygroupsize/100.0 - 1;

  var j;
  for (j = 0; j != 2; j++) {
    p.pos[j] = getrand(200)/100.0 - 1;
    p.vel[j] = 0;
  }
  p.lifetime = curfunc.redistribute() ? 500 : 5000;
  p.stepsize = 1;
  p.theta = p.initialTheta = (getrand(101)-50)*pi/50.;
  p.sizeX = initialDivDetectorSize;
  p.sizeY = initialDivDetectorSize;
}

function moveParticles() {
  fieldStrength = parseInt(strengthBar.value)*curfunc.getFieldMult();
  var pcount = getParticleCount();

  // redistribute particles in the largest density group if there
  // are at least 5 in the group.  don't redistribute if the function
  // doesn't allow it or we're in force mode.
  var withforce = (dispChooser.value == "partsforce");
  var mostd = (!withforce && curfunc.redistribute()) ? 5 : pcount;
  var i;
  for (i = 0; i != density.length; i++)
    mostd = Math.max(mostd, density[i]);

  partMult = fieldStrength * reverse * timeStep;
  for (i = 0; i != pcount; i++) {
    var pt = particles[i];
    removeFromDensityGroup(pt);
    moveParticle(pt);
    var x = pt.pos;
    if (!(x[0] >= -1 && x[0] < 1 &&
          x[1] >= -1 && x[1] < 1) ||
        (pt.lifetime -= timeStep) < 0) {
      positionParticle(pt);
    }
    var d = addToDensityGroup(pt);

    // redistribute randomly
    if (d >= mostd && Math.random() > .8)
      pt.lifetime = -1;
  }
}

var rediscount = 0;
function redistribute(mostd) {
  if (mostd < 5)
    return;
  rediscount++;
  var maxd = (2*getParticleCount()/(densitygridsize*densitygridsize));
  var i;
  var pn = 0;
  var pcount = getParticleCount();
  for (i = rediscount % 4; i < pcount; i+=4) {
    var p = particles[i];
    var a = Math.floor((p.pos[0]+1)*(densitygridsize/2));
    var b = Math.floor((p.pos[1]+1)*(densitygridsize/2));
    if (density[a+b*densitygridsize] <= maxd)
      continue;
    p.lifetime = -1;
    pn++;
  }
}

function drawLine(p1, p2, color) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  var verts = [].concat(p1, p2);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);
  
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, color[0], color[1], color[2], 1);
  gl.drawArrays(gl.LINES, 0, 2);
}

function drawLineWithPoints(verts, color) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);
  
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, color[0], color[1], color[2], 1);
  gl.drawArrays(gl.LINE_STRIP, 0, verts.length/3);
}

function drawStreamlines() {
  gl.useProgram(colorAttrProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(streamlines), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorAttrProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);

  gl.vertexAttrib3f(colorAttrProgramInfo.attribLocations.vertexColor, 1, 1, 1);
  
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.drawArrays(gl.LINES, 0, streamlines.length/3);
  gl.disableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function zoom(x) {
  zoomRate = x
}

function getParticleCount() {
  return parseInt(partCountBar.value);
}

function getrand(n) {
  return Math.floor(Math.random()*n);
}

function distance(x, y) {
  if (y == undefined)
    return Math.sqrt(x[0]*x[0]+x[1]*x[1]);
  return Math.sqrt(x*x+y*y+1e-10);
}

function resetDensityGroups() {
  var i, j, k;
  for (i = 0; i != density.length; i++)
    density[i] = 0;
  var pcount = getParticleCount();
  for (i = 0; i != pcount; i++) {
    var p = particles[i];
    addToDensityGroup(p);
  }

  // invalidate all unused particles so they will be
  // repositioned if the particle slider is moved to the right,
  // rather than just falling in where they happened to be last time
  for (; i != maxParticleCount; i++) {
    var p = particles[i];
    p.lifetime = -100;
  }
}

function resetParticles() {
  var pcount = getParticleCount();
  var i, j;
  for (i = 0; i != pcount; i++) {
    var p = particles[i];
    for (j = 0; j != 2; j++) {
      p.pos[j] = getrand(200)/100.0 - 1;
      p.vel[j] = 0;
    }
    p.lifetime = i*2;
    p.stepsize = 1;
    p.sizeX = initialDivDetectorSize;
    p.sizeY = initialDivDetectorSize;
    p.initialTheta = p.theta;
  }
  resetDensityGroups();
}

function kickParticles() {
  var i, j;
  for (i = 0; i != getParticleCount(); i++) {
    var p = particles[i];
    for (j = 0; j != 2; j++)
      p.vel[j] += (getrand(100)/99.0 - .5) * .04;
  }
}

var colorMult;

function generateFunction() {
  var x, y;
  if (grid == null) {
    grid = [];
    for (x = 0; x != gridsize+1; x++)
      grid[x] = [];
  }
  curfunc.setupFrame();
  colorMult = curfunc.getFieldMult();
  divOffset = curfunc.getDivOffset();
  divRange = curfunc.getDivRange();
  for (x = 0; x != gridsize+1; x++)
    for (y = 0; y != gridsize+1; y++) {
      var ge = grid[x][y] = new GridElement();
      ge.curl = ge.div = ge.height = 0;
      curfunc.setGrid(ge, x, y);
    }
  curfunc.calcDivergence();
  var zval = 2.0/gridsize;
  for (y = 0; y != gridsize; y++)
    for (x = 0; x != gridsize; x++) {
      var ge = grid[x][y];
      var vecx = grid[x+1][y].height-ge.height;
      var vecy = grid[x][y+1].height-ge.height;
      ge.normal = [-vecx, -vecy, zval];
    }

  for (x = 0; x != gridsize+1; x++) {
    grid[gridsize][x].normal = grid[gridsize-1][x].normal;
    grid[x][gridsize].normal = grid[x][gridsize-1].normal;
  }
  functionChangeFlag = false;
}

var divOffset, divRange;

function computeColor(ge, colors) {
  var value = 0;
  var range = 10;
  var offset = 4;
  switch (floorColorChooser.selectedIndex) {
  case FC_FIELD:
    value = ge.vecX*ge.vecX+ge.vecY*ge.vecY;
    value *= colorMult*colorMult;
    offset = 10;
    range = 16;
    //if (!ge.valid) return 0xFF000080;
    break;
  case FC_POTENTIAL:
    value = ge.pot-curfunc.getLevelHeight();
    offset = 1;
    range = 2;
    break;
  case FC_CURL:
    value = ge.curl;
    offset = 4;
    range = 10;
    break;
  case FC_DIV:
    value = ge.div;
    offset = divOffset;
    range = divRange;
    break;
  case FC_GRAY:
    //if (!ge.valid) return 0xFF000080;
    break;
  }
  //value *= floorBrightMult;
  var redness = (value < 0) ? (Math.log(-value)+offset)/range : 0;
  var grnness = (value > 0) ? (Math.log( value)+offset)/range : 0;
  if (redness > 1)
    redness = 1;
  if (grnness > 1)
    grnness = 1;
  if (grnness < 0)
    grnness = 0;
  if (redness < 0)
    redness = 0;
  var grayness = 1-(redness+grnness);
  var gray = .6;
  colors.push(redness+gray*grayness, grnness+gray*grayness, gray*grayness);
}

function drawFloor() {
  var prog = colorAttrLightingProgramInfo;
  if (isFlat)
    prog = colorAttrProgramInfo;

  if (floorColorChooser.selectedIndex == FC_NONE) {
    drawOverlay();
    return;
  }

  gl.useProgram(prog.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
  gl.uniformMatrix4fv(prog.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(prog.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  if (!isFlat) {
    gl.uniformMatrix4fv(prog.uniformLocations.normalMatrix,  false, mat4.create());
    gl.enableVertexAttribArray(prog.attribLocations.vertexNormal);
  }
  gl.enableVertexAttribArray(prog.attribLocations.vertexPosition);
  gl.enableVertexAttribArray(prog.attribLocations.vertexColor);

  var x, y;
  for (x = 0; x != gridsize; x++) {
    var verts = [];
    var colors = [];
    var normals = [];
    var nx  = x*(2.0/gridsize)-1;
    var nx1 = (x+1)*(2.0/gridsize)-1;
    for (y = 0; y != gridsize; y++) {
      var ny  = y*(2.0/gridsize)-1;
      var ny1 = (y+1)*(2.0/gridsize)-1;
      verts.push(nx, ny, grid[x][y].height,
                 nx1, ny, grid[x+1][y].height,
                 nx, ny1, grid[x][y+1].height,
                 nx1, ny1, grid[x+1][y+1].height);
      computeColor(grid[x][y], colors);
      computeColor(grid[x+1][y], colors);
      computeColor(grid[x][y+1], colors);
      computeColor(grid[x+1][y+1], colors);
      normals = normals.concat(grid[x][y].normal, grid[x+1][y].normal, grid[x][y+1].normal, grid[x+1][y+1].normal);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(prog.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(prog.attribLocations.vertexColor, 3, gl.FLOAT, false, 0, 0);
  
    if (!isFlat) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra3);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(prog.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    }
  
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, verts.length/3);
  }
  gl.disableVertexAttribArray(prog.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(prog.attribLocations.vertexColor);
  gl.disableVertexAttribArray(prog.attribLocations.vertexNormal);

  drawOverlay();
}

    function drawOverlay() {
        var x, y;
        switch (floorLineChooser.selectedIndex) {
        case FL_NONE:
            break;
        case FL_GRID:
            for (x = 0; x <= gridsize; x += 10) {
                var verts = [];
                for (y = 0; y <= gridsize; y++)
                    verts.push(x*(2.0/gridsize)-1, y*(2.0/gridsize)-1, grid[x][y].height+dh);
                drawLineWithPoints(verts, [1, 1, 1]);
                verts = [];
                for (y = 0; y <= gridsize; y++)
                    verts.push(y*(2.0/gridsize)-1, x*(2.0/gridsize)-1, grid[y][x].height+dh);
                drawLineWithPoints(verts, [1, 1, 1]);
            }
            break;
        case FL_EQUIP:
            if (!curfunc.nonGradient()) {
                genEquips(); 
                drawStreamlines();
            }
            break;
        case FL_LINES:
           genLines();
           drawStreamlines();
           break;
        }
    }

var boundCheck;
var oldY = [];

// used as temporary lists for Runge-Kutta and other places
var rk_k1 = [];
var rk_k2 = [];
var rk_k3 = [];
var rk_k4 = [];
var rk_yn = [];

function rk(order, x, Y, stepsize) {
  var i;

  // x is not used...

  if (order == 2) {
    // velocity-based motion
    var fmult = stepsize * partMult;
    for (i = 0; i != order; i++)
      rk_yn[i] = Y[i];
    curfunc.getField(rk_k1, rk_yn);
    for (i = 0; i != order; i++)
      rk_yn[i] = (Y[i] + 0.5*fmult*rk_k1[i]);
    curfunc.getField(rk_k2, rk_yn);
    for (i = 0; i != order; i++)
      rk_yn[i] = (Y[i] + 0.5*fmult*rk_k2[i]);
    curfunc.getField(rk_k3, rk_yn);
            
    for (i = 0; i != order; i++)
      rk_yn[i] = (Y[i] + fmult*rk_k3[i]);
    curfunc.getField(rk_k4, rk_yn);
    for (i = 0; i != order; i++)
      Y[i] = Y[i] + fmult*(rk_k1[i]+2*(rk_k2[i]+rk_k3[i])+rk_k4[i])/6;
  } else {
    // force-based (could share more code with above, but this is
    // called a lot so we want it to be fast)
    var fmult = stepsize * partMult;
    for (i = 0; i != order; i++)
      rk_yn[i] = Y[i];
    getForceField(rk_k1, rk_yn, stepsize, fmult);
    for (i = 0; i != order; i++)
      rk_yn[i] = (Y[i] + 0.5*rk_k1[i]);
    getForceField(rk_k2, rk_yn, stepsize, fmult);
    for (i = 0; i != order; i++)
      rk_yn[i] = (Y[i] + 0.5*rk_k2[i]);
    getForceField(rk_k3, rk_yn, stepsize, fmult);
            
    for (i = 0; i != order; i++)
      rk_yn[i] = (Y[i] + rk_k3[i]);
    getForceField(rk_k4, rk_yn, stepsize, fmult);
    for (i = 0; i != order; i++)
      Y[i] = Y[i] + (rk_k1[i]+2*(rk_k2[i]+rk_k3[i])+rk_k4[i])/6;
  }
}

function getForceField(result, y, stepsize, fmult) {
  // get the field vector for the current function
  curfunc.getField(result, y);
        
  // the field data has been written into result[0:2] where it will
  // directly influence the position (y[0:2]), but we want it to
  // influence the velocity (y[3:5]), so we move it.  In the
  // process, we multiply by fmult (to get the reverse button
  // and field strength slider to work).
  var i;
  for (i = 0; i != 2; i++)
    result[i+2] = .1*fmult*result[i];

  // here we fill in result[0:2] so that the particle position will
  // change according to the velocity.
  for (i = 0; i != 2; i++)
    result[i] = stepsize*timeStep*rk_yn[i+2];
}

var rk_Y = [];
var rk_Yhalf = [];
var rk_oldY = [];
var ls_fieldavg = [];

class Particle {
  constructor() {
    this.pos = [0, 0, 0];
    this.vel = [0, 0, 0];
    this.stepsize = 1;
    this.lifetime = 0;
    this.phi = this.phiv = this.theta = this.thetav = 0;
  }
}

function moveParticle(p) {
  var disp = dispChooser.value;

  var numIter=0;
  var maxh=1;
  var error=0.0, E = .001, localError;
  var useForce = (disp == "partsforce");
  var order = useForce ? 4 : 2;
  var Y = rk_Y;
  var Yhalf = rk_Yhalf;
  oldY = rk_oldY;
  var i;

  for (i = 0; i != 2; i++)
    oldY[i] = Y[i] = Yhalf[i] = p.pos[i];
  if (useForce)
    for (i = 0; i != 2; i++)
      Y[i+2] = Yhalf[i+2] = p.vel[i];
  var t = 0;

  if (!curfunc.useRungeKutta()) {
    boundCheck = false;
    curfunc.getField(Yhalf, Y);
    if (boundCheck && (!useForce || curfunc.checkBoundsWithForce())) {
      p.pos[0] = -100;
      return;
    }
    var fmult = partMult;
    if (useForce) {
      fmult *= .1;
      for (i = 0; i != 2; i++) {
        p.vel[i] += fmult*Yhalf[i];
        p.pos[i] += timeStep*p.vel[i];
      }
    } else {
      for (i = 0; i != 2; i++)
        p.pos[i] += fmult*Yhalf[i];
    }
    for (i = 0; i != 2; i++)
      Y[i] = p.pos[i];
    if (curfunc.checkBounds(Y, oldY))
      p.pos[0] = -100;
    return;
  }

  var adapt = curfunc.useAdaptiveRungeKutta();
  var h = (adapt) ? p.stepsize : 1;

  var steps = 0;
  var minh = .0001;

  while (t >= 0 && t < 1) {
    if (t+h > 1)
      h = 1-t;

    boundCheck = false;

    // estimate one full step
    rk(order, 0, Y, h);
            
    // bail out after one iteration for some slow fields
    if (!adapt)
      break;

    // estimate two half steps
    rk(order, 0, Yhalf, h*0.5);
    rk(order, 0, Yhalf, h*0.5);

    if (boundCheck && (!useForce || curfunc.checkBoundsWithForce())) {
      p.pos[0] = -100;
      return;
    }

    // estimate the local error
    localError = Math.abs(Y[0] - Yhalf[0]) +
                 Math.abs(Y[1] - Yhalf[1]) +
                 Math.abs(Y[2] - Yhalf[2]);
            
    if (localError > E && h > minh) {
      h *= 0.75; // decrease the step size
      if (h < minh)
        h = minh;
      for (i = 0; i != order; i++)
        Y[i] = Yhalf[i] = oldY[i]; 
      continue;
    } else if (localError < (E * 0.5)) {
      h *= 1.25; // increase the step size
      if (h > maxh)
        h = maxh;
    }
            
    for (i = 0; i != order; i++)
      oldY[i] = Yhalf[i] = Y[i]; 

    t += h;
    steps++;
  }
        
  if (boundCheck && (!useForce || curfunc.checkBoundsWithForce())) {
    p.pos[0] = -100;
    return;
  }
        
  p.stepsize = h;
  for (i = 0; i != 2; i++)
    p.pos[i] = Y[i];
  if (useForce) {
    for (i = 0; i != 2; i++)
      p.vel[i] = Y[i+2];
  }
}

function doubleToGrid(x) {
  return Math.floor ((x+1)*gridsize/2);
}

function gridToDouble(x) {
  return (x*2./gridsize)-1;
}

class VecFunction {
  constructor() { }
  showD = false;

  // scaling factor to make field values more consistent and reasonable.  we separate this out so we can
  // display correct values in info box, but use scaled values for particles and field vectors
  getFieldMult() { return 1; }
  getPotMult() { return 1; }
  nonGradient() { return false; }
  useRungeKutta() { return true; }
  useAdaptiveRungeKutta() { return true; }
  checkBoundsWithForce() { return true; }
  noSplitFieldVectors() { return true; }
  getInfo() { return ""; }
  render() { }
  checkBounds(y, oldY) { return false; }
  redistribute() { return true; }
  setup() {}
  setupFrame() {}
  finishFrame() {}
  actionPerformed() {}
  calcDivergence() {}
  getLevelHeight() { return 0; }

  setGrid(ge, x, y) {
    var xx = rk_k1;
    var res = rk_k2;
    var res1 = rk_k3;
    xx[0] = (x*2./gridsize)-1;
    xx[1] = (y*2./gridsize)-1;
    xx[2] = 0;
    boundCheck = false;
    res[2] = 0;
    xx[0] -= .5e-8; xx[1] -= .5e-8;
    this.getField(res, xx);
    ge.vecX = reverse*res[0]*70;
    ge.vecY = reverse*res[1]*70;
    ge.pot = reverse*res[2]*.625*this.getPotMult();
    ge.height = ge.pot*heightScale;
    ge.valid = !boundCheck;
    var xorig0 = xx[0];
    xx[0] += 1e-8;
    this.getField(res1, xx);
    ge.div = res1[0] - res[0];
    ge.curl = res1[1] - res[1];
    xx[0] = xorig0;
    xx[1] += 1e-8;
    this.getField(res1, xx);
    var mult = 1e10*reverse*this.getFieldMult();
    ge.div = (ge.div + res1[1] - res[1])*mult;
    ge.curl = (ge.curl - (res1[0] - res[0]))*mult;
  }

  getDivOffset() { return 4; }
  getDivRange() { return 11; }
}

var getPot = false;
const chargeSize = .06;
const darkYellow = [144/256, 144/256, 0];

const lineWidth = .01;

class InverseRadial extends VecFunction {
  getName() { return BUILD_CASE_EMV("charged line", null, "1/r single line"); }
  getFieldMult() { return .0003/(2*coulombKQ); }
  getPotMult() { return .4/(2*coulombKQ); }
  getInfo() { return "Charge = " + (-reverse) + " nC/m<br>"; }
  getField(result, y) {
    var r = distance(y[0], y[1]);
    if (r < lineWidth)
      boundCheck = true;
    var r2 = r*r;
    result[0] = -2*coulombKQ*y[0]/r2;
    result[1] = -2*coulombKQ*y[1]/r2;
    result[2] = 2*coulombKQ*Math.log(r+1e-20);
  }

  setup() {
    this.lineHalfLen = 1;
  }

  render() {
    drawLine([0, 0, -this.lineHalfLen], [0, 0, +this.lineHalfLen], darkYellow);
  }

  createNext() { return new InverseRadialDouble(); }
};

class InverseRadialDouble extends VecFunction {
  constructor() {
    super();
    this.sign = 1;
    this.sep = 0;
  }

  getName() { return BUILD_CASE_EMV("line charge double", null, "1/r double lines"); }
  getFieldMult() { return .0003/(2*coulombKQ); }
  getPotMult() { return .2/(2*coulombKQ); }
  getInfo() {
     return "Charges = " + (this.sign == 1 ? -reverse : "&plusmn;1") + " nC/m<br>Separation = " + round(this.sep*2) + " m<br>";
  }
  getField(result, y) {
    // we want to make sure sep is a multiple of the grid spacing
    // so that the divergence gets calculated correctly.
    var sep = gridToDouble(gridsize/2+Math.floor(auxBarValue(1)*gridsize/200));
    this.sep = sep;
    var xx1 = y[0] - sep;
    var xx2 = y[0] + sep;
    var r1 = distance(xx1, y[1]);
    var r2 = distance(xx2, y[1]);
    if (r1 < lineWidth || r2 < lineWidth)
      boundCheck = true;
    var q = 2*coulombKQ;
    var r1s = 1/(r1*r1);
    var r2s = 1/(r2*r2*this.sign);
    result[0] = q*(-xx1 *r1s-xx2 *r2s);
    result[1] = q*(-y[1]*r1s-y[1]*r2s);
    result[2] = 2*coulombKQ*(Math.log(r1+1e-20)+ this.sign*Math.log(r2+1e-20));
  }
  setup() {
    setupBar(0, "Line Separation", 30);
  }

  render() {
    var sep = auxBarValue(1)/100.;
    var i;
    for (i = -1; i <= 1; i += 2)
      drawLine([sep*i, 0, -1], [sep*i, 0, +1], darkYellow);
  }

  createNext() { return BUILD_CASE_EMV(new InverseRadialDipole(), null, new InverseSquaredRadial()); }
};


    class InverseRadialDipole extends InverseRadialDouble {
	constructor() { super(); this.sign = -1; }
	getName() { return "dipole lines"; }
	createNext() { return new InverseRadialQuad(); }
    };

    class InverseRadialQuad extends VecFunction {
	getName() { return "quad lines"; }
  getFieldMult() { return .0003/(2*coulombKQ); }
  getPotMult() { return .2/(2*coulombKQ); }
  getInfo() {
     var sep = auxBarValue(1)/100.;
     return "Charges = &plusmn;1 nC/m<br>Separation = " + round(sep*2) + " m<br>";
  }
	getField(result, y) {
	    var sep = auxBarValue(1)/100.;
	    var xx1 = y[0] + sep;
	    var xx2 = y[0] - sep;
	    var yy1 = y[1] + sep;
	    var yy2 = y[1] - sep;
	    var r1 = distance(xx1, yy1);
	    var r2 = distance(xx2, yy1);
	    var r3 = distance(xx1, yy2);
	    var r4 = distance(xx2, yy2);
	    if (r1 < lineWidth || r2 < lineWidth ||
		r3 < lineWidth || r4 < lineWidth)
		boundCheck = true;
	    var q = 2*coulombKQ;
	    result[0] = q*(-xx1/(r1*r1)-xx2/(r4*r4) +xx2/(r2*r2)+xx1/(r3*r3));
	    result[1] = q*(-yy1/(r1*r1)-yy2/(r4*r4) +yy1/(r2*r2)+yy2/(r3*r3));
	    result[2] = 2*coulombKQ*(+Math.log(r1+1e-20)
				-Math.log(r2+1e-20)
				-Math.log(r3+1e-20)
				+Math.log(r4+1e-20));
	}
	setup() {
	    setupBar(0, "Line Separation", 30);
	}

	render() {
	    var sep = auxBarValue(1)/100.;
	    var i, j;
	    for (i = -1; i <= 1; i += 2) {
		for (j = -1; j <= 1; j += 2)
		    drawLine([sep*i, sep*j, -1], [sep*i, sep*j, +1], darkYellow);
	    }
	}

	createNext() { return new InverseSquaredRadial(); }
    };

class InverseSquaredRadial extends VecFunction {
  getName() { return BUILD_CASE_EMV("point charge", null, "1/r^2 single"); }
  getFieldMult() { return .0003/coulombKQ; }
  getPotMult() { return .1/coulombKQ; }
  getInfo() { return "Charge = " + (-reverse) + " nC<br>"; }
  getField(result, y) {
    var r = distance(y);
    if (r < chargeSize)
      boundCheck = true;
    var r3 = r*r*r;
    var q = coulombK*1e-9/r3;
    result[0] = -y[0]*q;
    result[1] = -y[1]*q;
    result[2] = -coulombK*1e-9/r;
  }

  setup() { }

  render() {
    drawCharge(0, 0, 0);
  }

  createNext() { return new InverseSquaredRadialDouble(); }
};

function setupBar(n, text, val) {
  document.getElementById("aux" + (n+1) + "Label").innerHTML = text;
  document.getElementById("aux" + (n+1) + "Bar").value = val;
  showDiv("aux" + (n+1) + "Div", true);
}

class InverseSquaredRadialDouble extends InverseSquaredRadial {
  getName() { return BUILD_CASE_EMV("point charge double", null, "1/r^2 double"); }
  getBestSlice() { return SLICE_Y; }
  getInfo() {
     var sep = auxBarValue(1)/100.;
     return "Charges = " + (this.sign2 == 1 ? -reverse : "&plusmn;1") + " nC<br>Separation = " + round(sep*2) + " m<br>";
  }
  getField(result, y) {
    var sep = auxBarValue(1)/100.;
    var xx1 = y[0]-sep;
    var xx2 = y[0]+sep;
    var r1 = distance(xx1, y[1]);
    if (r1 < chargeSize)
      boundCheck = true;
    var r2 = distance(xx2, y[1]);
    if (r2 < chargeSize)
      boundCheck = true;
    var q = coulombKQ;
    var rq1 = q/(r1*r1*r1);
    var rq2 = q/(r2*r2*r2) * this.sign2;
    result[0] = -xx1 *rq1-xx2 *rq2;
    result[1] = -y[1]*rq1-y[1]*rq2;
    result[2] = -coulombKQ/r1 - coulombKQ*this.sign2/r2;
    if (this.sign2 == -1)
      result[0] *= 2;
  }

  setup() {
    this.sign2 = 1;
    setupBar(0, "Charge Separation", 30);
  }

  render() {
    var sep = auxBarValue(1)/100.;
    drawCharge(+sep, 0, 0);
    drawCharge(-sep, 0, 0);
  }

  createNext() { return BUILD_CASE_EMV(new InverseSquaredRadialDipole(), null, new InverseRotational()); }
};

    class InverseSquaredRadialDipole extends InverseSquaredRadialDouble {
	getName() { return "dipole"; }
	setup() {
	    super.setup();
	    this.sign2 = -1;
	}
	createNext() { return new InverseSquaredRadialQuad(); }
    };
    class InverseSquaredRadialQuad extends InverseSquaredRadial {
	getName() { return "quadrupole"; }
        getInfo() {
          var sep = auxBarValue(1)/100.;
          return "Charges = " + (this.sign2 == 1 ? "1" : "&plusmn;1") + " nC<br>Separation = " + round(sep*2) + " m<br>";
        }
	getField(result, y) {
	    var sep = auxBarValue(1)/100.;
	    var xx1 = y[0] - sep;
	    var xx2 = y[0] + sep;
	    var yy1 = y[1] - sep;
	    var yy2 = y[1] + sep;
	    var r1 = distance(xx1, yy1);
	    var r2 = distance(xx2, yy1);
	    var r3 = distance(xx1, yy2);
	    var r4 = distance(xx2, yy2);
	    if (r1 < chargeSize || r2 < chargeSize ||
		r3 < chargeSize || r4 < chargeSize)
		boundCheck = true;
	    if (getPot) {
		return;
	    }
	    var q = coulombKQ;
	    var rq1 = q/(r1*r1*r1);
	    var rq2 = q/(r2*r2*r2);
	    var rq3 = q/(r3*r3*r3);
	    var rq4 = q/(r4*r4*r4);
	    result[0] = -xx1*rq1-xx2*rq4+xx2*rq2+xx1*rq3;
	    result[1] = -yy1*rq1-yy2*rq4+yy1*rq2+yy2*rq3;
	    result[2] = coulombKQ*(-1/r1+1/r2+1/r3-1/r4);
	}
	setup() {
	    super.setup();
	    setupBar(0, "Charge Separation", 30);
	}
	render() {
	    var sep = auxBarValue(1)/100.;
	    var i, j;
	    for (i = -1; i <= 1; i += 2)
		for (j = -1; j <= 1; j += 2)
		    drawCharge(i*sep, j*sep, 0);
	}
	createNext() { return new ConductingPlate(); }
    };

    class ConductingPlate extends VecFunction {
	getName() { return "conducting plate"; }
	constructor() {
	    super();
	    this.z = new Complex();
	    this.z2 = new Complex();
	    this.plate = true;
	}
        getInfo() {
            return "Width: " + round(this.a*2) + " m<br>" + super.getInfo();
        }
	setupFrame() {
	    this.a = (auxBarValue(1)+1)/100.;
            this.z.set(0, 1/this.a);
            this.z.arcsin();
            this.base = this.z.b;
	}
	getField(result, y) {
	    // smythe p89
	    if (y[1] >= -.02 && y[1] <= .02) {
		if ((this.plate  && y[0] >= -this.a && y[0] <= this.a) ||
		    (!this.plate && (y[0] >= this.a || y[0] <= -this.a)))
		boundCheck = true;
	    }
	    var z = this.z;
	    var z2 = this.z2;
	    z.set(y[0]/this.a, y[1]/this.a);
	    if (y[1] < 0 && this.plate)
		z.b = -z.b;
            z2.set(z);
            z2.arcsin();
            result[2] = (this.plate) ? z2.b/this.base-1 : -z2.a*.6;
	    // here we calculate ((1-(z/a)^2)^(-1/2))/a, which is
	    // d/dz arcsin(z/a)
	    z.square();
	    z.mult(-1);
	    z.add(1);
	    z.pow(-.5);
	    z.mult(1/this.a);
	    if (this.plate) {
		// field = (Im dw/dz, Re dw/dz)
		result[1] = z.a * -.0007;
		result[0] = z.b * -.0007;
		if (y[1] < 0)
		    result[1] = -result[1];
	    } else {
		// field = (Re dw/dz, -Im dw/dz)
		result[0] = z.a * .0007;
		result[1] = -z.b * .0007;
	    }
	}
        //getDivOffset() { return -17.3; }
        //getDivRange() { return 2.5; }
	setup() {
	    setupBar(0, "Plate Size", 60);
	}
	createNext() { return new ChargedPlate(); }
    };

    class ChargedPlate extends ConductingPlate {
	constructor() { super(); this.cz = new Complex(); }
	getName() { return "charged plate"; }
	getPot(a1, a2, y) {
	    var cz = this.cz;
	    cz.set (y, -a1);
	    cz.mult2(y,  a2);
	    cz.log();
	    var b1 = cz.b;
	    cz.set (y,  a1);
	    cz.mult2(y, -a2);
	    cz.log();
	    var y2 = y*y;
	    return .2*(2*(a1-a2) + (b1-cz.b)*y +
		       a2*Math.log(a2*a2+y2) -
		       a1*Math.log(a1*a1+y2));
	}
	getField(result, y) {
	    if (y[1] >= -.01 && y[1] <= .01 &&
		(y[0] >= -this.a && y[0] <= this.a))
		boundCheck = true;
	    var a1 = -this.a-y[0];
	    var a2 =  this.a-y[0];
	    var y2 = y[1]*y[1];
	    if (y2 == 0)
		y2 = 1e-8;
	    result[2] = this.getPot(a1, a2, y[1]);
	    var q = .0003/this.a;
	    result[0] = .5*q*
	        Math.log((y2+a2*a2)/(y2+a1*a1));
	    result[1] = q*
		(Math.atan(a1/y[1])-
		 Math.atan(a2/y[1]));
	}
	createNext() { return new ChargedPlatePair(); }
    };

    class ChargedPlatePair extends ChargedPlate {
        constructor() { super(); this.dipole = 1; }
	getName() { return "charged plate pair"; }
	useRungeKutta() { return false; }
        getInfo() {
            return "Separation: " + round(this.sep*2) + " m<br>" + super.getInfo();
        }
	getField(result, y) {
            var sep = gridToDouble(gridsize/2+Math.floor(auxBarValue(2)*gridsize/200));
            this.sep = sep;
	    if ((y[1] >= -.01+sep && y[1] <= .01+sep ||
		 y[1] >= -.01-sep && y[1] <= .01-sep) &&
		y[0] >= -this.a && y[0] <= this.a)
		boundCheck = true;
	    var a1 = -this.a-y[0];
	    var a2 =  this.a-y[0];
	    var y1 = y[1]-sep;
	    var y12 = y1*y1;
	    if (y12 == 0)
		y12 = 1e-8;
	    var y2 = y[1]+sep;
	    var y22 = y2*y2;
	    if (y22 == 0)
		y22 = 1e-8;
	    result[2] = this.getPot(a1, a2, y1) +this.dipole*this.getPot(a1, a2, y2);

	    var q = .0003/this.a;
	    result[0] = .5*q*
	        (Math.log((y12+a2*a2)/(y12+a1*a1)) + this.dipole*
		 Math.log((y22+a2*a2)/(y22+a1*a1)));
	    result[1] = q*
		(Math.atan(a1/y1)
		-Math.atan(a2/y1)
                +this.dipole*(Math.atan(a1/y2)-Math.atan(a2/y2)));

	}
	setup() {
	    setupBar(0, "Sheet Size", 30);
	    setupBar(1, "Sheet Separation", 33);
	}
	checkBounds(y, oldY) {
	    var size = auxBarValue(1)/100.;
	    var sep = auxBarValue(2)/100.;
	    // check to see if particle has passed through one of plates
	    if (y[0] >= -size && y[0] <= size) {
		if (y[1] > sep) {
		    if (oldY[1] < sep)
			return true;
		} else if (y[1] < -sep) {
		    if (oldY[1] > -sep)
			return true;
		} else if (oldY[1] > sep || oldY[1] < -sep)
		    return true;
	    }
	    return false;
	}
	render() {
	    var sep = auxBarValue(2)/100.;
	    var size = auxBarValue(1)/100.;
	    var i;
	    for (i = 0; i != 2; i++) {
		var s = (i == 0) ? sep : -sep;
		drawPlane(size, 1, s);
	    }
	}
	createNext() { return new ChargedPlateDipole(); }
    };

    class ChargedPlateDipole extends ChargedPlatePair {
        getName() { return "charged plate dipole"; }
        constructor() { super(); this.dipole = -1; }
        createNext() { return new InfiniteChargedPlane(); }
    };

    class InfiniteChargedPlane extends VecFunction {
	getName() { return "infinite plane"; }
	getBestSlice() { return SLICE_Y; }
	getField(result, y) {
	    var alpha = .0003;
	    if (y[1] > -.01 && y[1] < .01)
		boundCheck = true;
	    result[0] = 0;
	    result[1] = (y[1] < 0) ? alpha : -alpha;
	    result[2] = Math.abs(y[1])-1;
	}
	setup() {
	}
	render() {
	    drawPlane(1, 1, 0);
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new Cylinder(); }
    };
    
    class Cylinder extends VecFunction {
        getName() { return "conducting cylinder"; }
        getCylRadius() { return (auxBarValue(1)+1)/110.; }
        setup() {
            setupBar(0, "Cylinder Size", 30);
            setupBar(1, "Cylinder Potential", 1);
        }
        getField(result, y) {
            // Smythe p70
            var a = this.getCylRadius();
            var farpt = 4;

            var pot = 2*(auxBarValue(2)/50.-1);
            const mult = 4000;

            // add in charge that will bring cylinder to specified potential
            var cq = -pot/
                (mult*(Math.log(a)-Math.log(farpt)));
            var pot0 = mult*cq*Math.log(farpt);

            var y0 = y[0];
            var y1 = y[1];
            var r1 = distance(y0, y1);
            if (r1 < a) {
                result[0] = result[1] = 0;
                result[2] = pot;
                boundCheck = true;
                return;
            }
            var a1 = 5*cq/(r1*r1);
            result[0] = y0*a1;
            result[1] = y1*a1;
            result[2] = pot0-cq*mult*Math.log(r1);
        }

        // automatic calculation of divergence doesn't work for this field so we have to
        // fill it in manually
        calcDivergence() {
            var a = this.getCylRadius();
            var pot = 2*(auxBarValue(2)/50.-1);
            var i;
            for (i = 0; i != 100; i++) {
                var th = 2*pi*i/100.;
                var xx = Math.cos(th)*a;
                var yy = Math.sin(th)*a;
                grid[doubleToGrid(xx)][doubleToGrid(yy)].div += reverse*pot*.1;
            }
        }
        createNext() { return new CylinderAndLineCharge(); }
    };

    class CylinderAndLineCharge extends VecFunction {
	getName() { return "cylinder + line charge"; }
	getCylRadius() { return (auxBarValue(1)+1)/110.; }
	getSeparation() { return auxBarValue(2)/100.; }
	getCylPos() { return this.getSeparation()/2; }
	getPointPos() { return -this.getSeparation()/2-this.getCylRadius(); }
	setup() {
	    setupBar(0, "Cylinder Size", 30);
	    setupBar(1, "Separation", 30);
	    setupBar(2, "Cylinder Potential", 50);
	}
        getInfo() { return "Cylinder radius: " + round(this.getCylRadius()) + " m<br>" +
                           "Cylinder pos: (" + round(this.getCylPos()) + ", 0, z)<br>" +
                           "Line pos: (" + round(this.getPointPos()) + ", 0, z)<br>" +
                           "Separation: " + round(this.getSeparation()) + " m<br>" +
                           "Sphere potential: " + reverse*round(auxBarValue(3)-50) + " V<br>"; }
        getFieldMult() { return .0003/(2*coulombKQ); }
        getPotMult() { return .3/(2*coulombKQ); }
	getField(result, y) {
	    // Smythe p70
	    var q = -2*coulombKQ;
	    var a = this.getCylRadius();
	    var b = this.getSeparation() + a;
	    var spos = this.getCylPos();
	    var imagePos = spos - a*a/b;
	    var x1 = y[0]-spos;
	    var r1 = distance(x1, y[1]);
            var cpot = auxBarValue(3)-50.;
	    if (r1 < a) {
		boundCheck = true;
                result[0] = result[1] = 0;
                result[2] = cpot;
                return;
	    }
	    var x2 = y[0]-imagePos;
	    var r2 = distance(x2, y[1]);
	    var x3 = y[0]-this.getPointPos();
	    var r3 = distance(x3, y[1]);
	    var chargeSize = .06;
	    if (r3 < chargeSize)
		boundCheck = true;

	    // pick a charge at the center of the cylinder that puts it
	    // at ground potential
            var apot = q*Math.log(spos+a-imagePos) - q*Math.log(spos+a-this.getPointPos());
            var cq = (-apot+cpot)/Math.log(a);
	    var a1 = -cq/(r1*r1);
	    var a2 = -q/(r2*r2);
	    var a3 = q/(r3*r3);
	    result[0] = x1*a1 + x2*a2 + x3*a3;
	    result[1] = y[1]*(a1+a2+a3);
	    result[2] =  (cq*Math.log(r1+1e-20)
			      +q*Math.log(r2+1e-20)
			      -q*Math.log(r3+1e-20));
	}
        calcDivergence() {
            var i;
            var pos = rk_k1;
            var res = rk_k2;
            var a1 = this.getCylRadius()+.001;
            var x, y;
            for (x = 0; x != gridsize; x++)
                for (y = 0; y != gridsize; y++)
                    grid[x][y].div = 0;
	    var a = this.getCylRadius();
            grid[doubleToGrid(this.getPointPos())][doubleToGrid(0)].div = -reverse;
            var mult = this.getFieldMult()*60*reverse;
            for (i = 0; i != 200; i++) {
                var th = 2*pi*i/200.;
                var costh = Math.cos(th);
                var sinth = Math.sin(th);
                pos[0] = costh*a1+this.getCylPos();
                pos[1] = sinth*a1;
                pos[2] = 0;
                curfunc.getField(res, pos);
                grid[doubleToGrid(costh*a+this.getCylPos())]
                    [doubleToGrid(sinth*a)].div += (costh*res[0] + sinth*res[1])*mult;
            }
        }
	createNext() { return new CylinderInField(); }
    };

    class CylinderInField extends VecFunction {
	constructor() { super(); this.conducting = true; this.showD = false; }
	getName() { return "cylinder in field"; }
	setupFrame() {
	    this.a = auxBarValue(1)/100.;
	}
	getField(result, y) {
	    // smythe p67
	    var a2 = this.a*this.a;
	    var r = distance(y[0], y[1]);
	    var e1 = auxBarValue(2)/10. + 1;
	    var dimult = (this.conducting) ? 1 : (e1-1)/(e1+1);
	    var fmult = .0006;
	    if (r < this.a) {
		result[0] = result[1] = result[2] = 0;
		if (this.conducting)
		    boundCheck = true;
		else {
		  result[2] = -(1-dimult)*y[0];
		  result[0] = (this.showD) ? e1*fmult*(1-dimult) : fmult*(1-dimult);
                }
		return;
	    }
	    var costh = y[0]/r;
	    var sinth = y[1]/r;
	    var r_2 = 1/(r*r);
	    var er  = (1+dimult*a2*r_2)*costh*fmult;
	    var eth = -(1-dimult*a2*r_2)*sinth*fmult;
	    er /= r;
	    result[0] = y[0]*er - eth*sinth;
	    result[1] = y[1]*er + eth*costh;
	    result[2] = -(1-dimult*a2*r_2)*y[0];
	}
        getInfo() { 
            if (this.conducting) return "";
	    var e1 = auxBarValue(2)/10. + 1;
            return "&epsilon;<sub>r</sub> = " + round(e1) + "<br>";
        }
	setup() {
	    setupBar(0, "Cylinder Size", 40);
	}
        calcDivergence() {
            var i;
            var pos = rk_k1;
            var res = rk_k2;
            var a = this.a;
            var a1 = a+.001;
            var x, y;
            for (x = 0; x != gridsize; x++)
                for (y = 0; y != gridsize; y++)
                    grid[x][y].div = 0;
            for (i = 0; i != 200; i++) {
                var th = 2*pi*i/200.;
                var costh = Math.cos(th);
                var sinth = Math.sin(th);
                pos[0] = costh*a1;
                pos[1] = sinth*a1;
                pos[2] = 0;
                curfunc.getField(res, pos);
                var rx = res[0];
                var ry = res[1];
                var a2 = a-.001;
                pos[0] = costh*a2;
                pos[1] = sinth*a2;
                pos[2] = 0;
                curfunc.getField(res, pos);
                grid[doubleToGrid(costh*a)][doubleToGrid(sinth*a)].div +=
                    (costh*(rx-res[0]) + sinth*(ry-res[1]))*4e2*reverse;
            }
        }

	render(g) {
	    drawCylinder([0, 0, 0], this.a, darkYellow);
	}
	createNext() { return new DielectricCylinderInFieldE(); }
    };

    class DielectricCylinderInFieldE extends CylinderInField {
	constructor() { super(); this.conducting = false; this.showD = false; }
	getName() { return "dielectric cyl in field"; }
	setup() {
	    setupBar(0, "Cylinder Size", 40);
	    setupBar(1, "Dielectric Strength", 60);
	}
	render() {
	    drawWireframeCylinder([0, 0, 0], this.a);
	}
	noSplitFieldVectors() { return false; }
	createNext() { return new SlottedPlane(); }
	//createNext() { return new DielectricCylinderInFieldD(); }
    };
    class DielectricCylinderInFieldD extends DielectricCylinderInFieldE {
	constructor() { super(); this.conducting = false; this.showD = true; }
	getName() { return "dielectric cyl in field, D"; }
	createNext() { return new SlottedPlane(); }
    };

    class SlottedPlane extends VecFunction {
	getName() { return "slotted conducting plane"; }
	constructor() {
	    super();
	    this.z = new Complex();
	    this.z2 = new Complex();
	    this.z3 = new Complex();
	}
	getField(result, y) {
	    // W = -.5E (z +- (z^2-a^2)^1/2)
	    // dw/dz = -.5E (1 +- z/(z^2-a^2)^1/2)
	    // Smythe p92
	    var a = (auxBarValue(1)+1)/101.;
	    if (y[1] >= -.01 && y[1] <= .01 &&
		(y[0] < -a || y[0] > a))
		boundCheck = true;
	    var z = this.z;
	    var z2 = this.z2;
	    var z3 = this.z3;
	    z.set(y[0], y[1]);
	    z2.set(z);
	    z2.square();
	    z2.add(-a*a);
            z3.set(z2);
	    z3.pow(.5);
	    if (z3.b < 0)
	      z3.mult(-1);
	    z3.add(z.a, z.b);
	    result[2] = z3.b*2;

	    z2.pow(-.5);
	    // I can barely understand what Smythe is talking about but
	    // I think he wants the square root to always have a positive
	    // imaginary part.  Here we already took the reciprocal
	    // (by calling pow(-.5) instead of pow(.5)) so we want the
	    // root to have a negative imaginary part instead.
	    if (z2.b > 0)
		z2.mult(-1);
	    z2.mult(z);
	    // field = (Im dw/dz, Re dw/dz)
	    result[1] = (1+z2.a) * .003;
	    result[0] = (z2.b) * .003;
	}
	setup() {
	    setupBar(0, "Slot Size", 60);
	}
	render() {
	    var a = (auxBarValue(1)+1)/101.;
	    drawPlaneWithPoints([-1, -1, 0, -a, -1, 0, -1, +1, 0, -a, +1, 0]);
	    drawPlaneWithPoints([ 1, -1, 0,  a, -1, 0,  1, +1, 0,  a, +1, 0]);
	}
	createNext() { return new PlanePair(); }
    };
    class PlanePair extends ConductingPlate {
	getName() { return "conducting planes w/ gap"; }
	constructor() { super(); this.plate = false; }
	setup() {
	    setupBar(0, "Gap Size", 20);
	}
	render() {
	    var a = (auxBarValue(1)+1)/101.;
	    drawPlaneWithPoints([-1, -1, 0, -a, -1, 0, -1, +1, 0, -a, +1, 0]);
	    drawPlaneWithPoints([ 1, -1, 0,  a, -1, 0,  1, +1, 0,  a, +1, 0]);
	}
	createNext() { return null; }
    };

    class InverseRotational extends InverseRadial {
	getName() { return BUILD_CASE_EMV(null, "current line",
				  "1/r rotational"); }
	setup() {
	}
        getFieldMult() { return showA ? .001/2 : .0001/2; }
        getInfo() { return "Current = " + (10*reverse) + " A<br>"; }
	getField(result, y) {
	    var r = distance(y[0], y[1]);
	    if (showA) {
		result[0] = result[1] = 0;
		result[2] = -2*(Math.log(r)-.5);
	    } else {
		if (r < lineWidth*2)
		    boundCheck = true;
		rotateParticle(result, y, 2/(r*r));
	    }
	}
	render() {
	    drawCurrentLine([0, 0, -1], [0, 0, +1], 1);
	}
	nonGradient() { return true; }
	createNext() { return new InverseRotationalPotential(); }
    };

    class InverseRotationalPotential extends VecFunction {
        getName() { return "1/r rotational potential"; }
        getField(result, y) {
            var r = distance(y[0], y[1]);
            rotateParticle(result, y, .0001/(r*r));
            if (r < lineWidth*2)
                boundCheck = true;
            else if (y[0] >= 0 && y[1] < .001 && y[1] > -.025) {
                boundCheck = true;
                if (y[1] == 0)
                    result[1] = 1e8;
            }
            var ang = Math.atan2(y[1], y[0]);
            if (ang < 0)
                ang += 2*pi;
            result[2] = (pi-ang)*.3;
        }
        createNext() { return new InverseRotationalDouble(); }
    };

    class InverseRotationalDouble extends InverseRadialDouble {
	constructor() { super(); this.dir2 = 1; this.ext = false; }
	getName() { return BUILD_CASE_EMV(null, "current line double", "1/r rotational double"); }
        getFieldMult() { return showA ? .001/2 : .0001/2; }
        getInfo() {
          var sep = this.sep;
          return "Current = " + (this.sign == 1 ? "" : "&plusmn;") + "10 A<br>Separation = " + round(sep*2) + " m<br>";
        }
	getField(result, y) {
            var sep = gridToDouble(gridsize/2+Math.floor(auxBarValue(1)*gridsize/200));
            this.sep = sep;
	    var r  = distance(y[0] - sep, y[1]);
	    var r2 = distance(y[0] + sep, y[1]);
	    if (this.ext) {
		var p = auxBarValue(3)*pi/50.;
		var s = auxBarValue(2)/6.;
		getDirectionField(result, y, pi/2, p);
		result[0] *= s;
		result[1] *= s;
		result[2] *= s;
	    } else
		result[0] = result[1] = result[2] = 0;
	    if (showA) {
		if (this.dir2 == 1)
		    result[2] += -2*(Math.log(r)+Math.log(r2)-1);
		else
		    result[2] += -2*(Math.log(r)-Math.log(r2));
	    } else {
		if (r < lineWidth*2)
		    boundCheck = true;
		rotateParticleAdd(result, y, 2/(r*r),  sep, 0);
		if (r2 < lineWidth*2)
		    boundCheck = true;
		rotateParticleAdd(result, y, this.dir2*2/(r2*r2), -sep, 0);
	    }
	}
	setup() {
	    setupBar(0, "Line Separation", 30);
	    if (this.ext) {
		setupBar(1, "Ext. Strength", 28);
		setupBar(2, "Ext. Direction", 0);
	    }
	}
	render() {
	    var sep = auxBarValue(1)/100.;
	    var i;
	    for (i = -1; i <= 1; i += 2) {
		var dir = (i == -1) ? this.dir2 : 1;
		drawCurrentLine([sep*i, 0, -1], [sep*i, 0, 1], dir);
	    }
	}
	nonGradient() { return true; }
	createNext() { return new InverseRotationalDoubleExt(); }
    };
    class InverseRotationalDoubleExt extends InverseRotationalDouble {
	constructor() { super(); this.ext = true; }
	getName() { return BUILD_CASE_EMV(null, "cur line double + ext",
						 "1/r rot double + ext"); }
	createNext() { return new InverseRotationalDipole(); }
    };
    class InverseRotationalDipole extends InverseRotationalDouble {
	constructor() { super(); this.dir2 = -1; }
	getName() { return BUILD_CASE_EMV(null, "current line dipole",
						 "1/r rotational dipole"); }
	createNext() { return new InverseRotationalDipoleExt(); }
    };
    class InverseRotationalDipoleExt extends InverseRotationalDouble {
	constructor() { super(); this.dir2 = -1; this.ext = true; }
	setup() {
	    super.setup();
	    aux2Bar.value = 17;
	    aux3Bar.value = 25;
	}
	getName() { return BUILD_CASE_EMV(null, "cur line dipole + ext",
						 "1/r rot dipole + ext"); }
	createNext() { return new OneDirectionFunction(); }
    };
    class OneDirectionFunction extends VecFunction {
	getName() { return BUILD_CASE_EMV(null, "uniform field", "constant field"); }
	getField(result, y) {
	    var th = (auxBarValue(1)-1) * pi /50.;
	    getDirectionField(result, y, th);
	}

        getFieldMult() { return .0003; }

	setup() {
	    setupBar(0, "Theta", 0);
	}
	createNext() { return BUILD_CASE_EMV(null, new MovingChargeField(), new InverseSquaredRadialSphere()); }
    };

    function getDirectionField(result, y, th) {
	var sinth = Math.sin(th);
	var costh = Math.cos(th);
	result[0] = costh;
	result[1] = sinth;
	result[2] = -.4*(y[0]*costh + y[1]*sinth);
    }

    class MovingChargeField extends InverseSquaredRadial {
	getName() { return "moving charge"; }
        getInfo() { return "Charge = 10 C<br>Speed: 5 m/s<br>"; }
	getField(result, y) {
	    var rz = distance(y);
	    if (showA) {
		result[0] = result[1] = 0;
		result[2] = 5/rz;
	    } else {
		var r = distance(y[0], y[1]);
		if (rz < chargeSize)
		    boundCheck = true;
		rotateParticle(result, y, 5/(rz*rz*rz));
	    }
	}
	render(g) {
	    drawCharge(0, 0, 0, 1);
	}
	setup() { }
	nonGradient() { return true; }
	createNext() { return BUILD_CASE_EMV(null, new FastChargeField(), null); }
    };

    class FastChargeEField extends MovingChargeField {
	getName() { return "fast charge"; } // E field!
	getBestSlice() { return SLICE_Y; }
        getInfo() {
	   var beta = (auxBarValue(1)+1)/102.;
           return "Charge = 1 nC<br>Speed: " + round(beta) + " c<br>";
        }
	getField(result, y) {
	    var rz = distance(y);
	    if (rz < chargeSize)
		boundCheck = true;
	    var r = distance(y[0], y[1]);
	    // sine of angle between particle vector and direction of motion
	    var sinth = r/rz;
	    var beta = (auxBarValue(1)+1)/102.;
	    if (getPot) {
		result[0] = -coulombKQ/(rz*Math.pow(1-beta*beta*sinth*sinth, .5));
		return;
	    }
	    
	    // field = e R (1-beta^2) / R^3 (1-beta^2 sin^2 th)^(3/2)
	    var b = -coulombKQ * (1-beta*beta)/
		(rz*rz*rz*Math.pow(1-beta*beta*sinth*sinth, 1.5));
	    result[0] = b*y[0];
	    result[1] = b*y[1];
	    result[2] = b*y[2];
	}
	setup() {
	    setupBar(0, "Speed/C", 90);
	    super.setup();
	}
	render(g) {
	    drawCharge(0, 0, 0, reverse);
	}
        getInfo() { 
	    var beta = (auxBarValue(1)+1)/102.;
            return "Charge = " + (-reverse) + " nC<br>Speed = " + round(beta) + " c";
        }
	nonGradient() { return false; }
	createNext() { return new ChargedRing(); }
    };

    class InverseSquaredRadialSphere extends VecFunction {
	getName() { return "1/r^2 sphere"; }
	getSize() { return (auxBarValue(1)+1)/110.; }
	getField(result, y) {
	    var r = distance(y);
	    if (r < .01)
		boundCheck = true;
	    var a = this.getSize();
	    result[2] = .2*((r > a) ? -1/r : -3/(2*a)+r*r/(2*a*a*a));
	    if (r < a)
		r = a;
	    var alpha = .0003/(r*r*r);
	    result[0] = -y[0]*alpha;
	    result[1] = -y[1]*alpha;
	}
	setup() {
	    setupBar(0, "Sphere Size", 70);
	}

	render() {
	    drawWireframeSphere([0, 0, 0], this.getSize());
	}
	noSplitFieldVectors() { return false; }
	checkBoundsWithForce() { return false; }
	createNext() { return new ConstRadial(); }
    };
    class ConstRadial extends InverseSquaredRadial {
	getName() { return "const radial"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	getField(result, y) {
	    var r = distance(y);
	    if (r < chargeSize)
		boundCheck = true;
	    var q = .0006/r;
	    result[0] = -q*y[0];
	    result[1] = -q*y[1];
	    result[2] = r;
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new LinearRadial(); }
    };

    class LinearRadial extends InverseSquaredRadial {
	getName() { return "linear radial"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	getField(result, y) {
	    var r = distance(y);
	    if (r < chargeSize)
		boundCheck = true;
	    var k = .0009;
	    result[0] = -y[0]*k;
	    result[1] = -y[1]*k;
	    result[2] = r*r-1;
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new ConstantToYAxis(); }
    };

    class ConstantToYAxis extends VecFunction {
        getName() { return "constant to y axis"; }
        getField(result, y) {
            var alpha = .0004;
            if (y[0] > -.01 && y[0] < .01)
                boundCheck = true;
            result[0] = (y[0] <= 0) ? alpha : -alpha;
            result[1] = 0;
            result[2] = Math.abs(y[0])-1;
        }
        checkBoundsWithForce() { return false; }
        createNext() { return new LinearToYAxis(); }
    };
    class LinearToYAxis extends VecFunction {
        getName() { return "linear to y axis"; }
        getField(result, y) {
            var r = Math.abs(y[0]);
            if (r < lineWidth)
                boundCheck = true;
            var q = .0009;
            result[0] = -y[0]*q;
            result[1] = 0;
            result[2] = r*r-1;
        }
        checkBoundsWithForce() { return false; }
        createNext() { return new LinearToXYAxes(); }
    };
    class LinearToXYAxes extends VecFunction {
        getName() { return "2-dimensional oscillator"; }
        getField(result, y) {
            var alpha = .0006;
            var r = Math.sqrt((auxBarValue(1)+1)/51.);
            result[0] = -alpha*r*y[0];
            result[1] = -alpha/r*y[1];
            result[2] = (y[0]*y[0]*r+y[1]*y[1]/r)-1;
        }
        setup() {
            setupBar(0, "X/Y Ratio", 50);
        }
        checkBoundsWithForce() { return false; }
        createNext() { return new InverseToYAxis(); }
    };
    class InverseToYAxis extends VecFunction {
        getName() { return "inverse to y axis"; }
        getField(result, y) {
            if (y[0] > -.01 && y[0] < .01)
                boundCheck = true;
            var alpha = .0003;
            var zz = y[0];
            if (zz == 0)
                zz = .00001;
            result[0] = -alpha/zz;
            result[1] = 0;
            result[2] = -.01/(zz*zz);
        }
        createNext() { return new InverseSquareRotational(); }
    };

    class InverseSquareRotational extends InverseRadial {
	getName() { return "1/r^2 rotational"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	getField(result, y) {
	    var r = distance(y[0], y[1]);
	    if (r < lineWidth*2)
		boundCheck = true;
	    rotateParticle(result, y, .0001/(r*r*r));
	}
	nonGradient() { return true; }
	createNext() { return new LinearRotational(); }
    };
    class LinearRotational extends InverseRadial {
	getName() { return "linear rotational"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	getField(result, y) {
	    var q = .0003;
	    result[0] = -q*y[1];
	    result[1] =  q*y[0];
	    result[2] = 0;
	}
	nonGradient() { return true; }
	createNext() { return new ConstantRotational(); }
    };
    class ConstantRotational extends InverseRadial {
	getName() { return "constant rotational"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	getField(result, y) {
	    var r = distance(y[0], y[1]);
	    rotateParticle(result, y, .0003/r);
	}
	nonGradient() { return true; }
	createNext() { return new FxEqualsYField(); }
    };

    class FxEqualsYField extends VecFunction {
	getName() { return "(y,0)"; }
        getFieldMult() { return .0006; }
	getField(result, y) {
	    result[2] = result[1] = 0;
	    result[0] = y[1];
	}
	setup() { }
	nonGradient() { return true; }
	createNext() { return new FxEqualsY2(); }
    };

    class FxEqualsY2 extends VecFunction {
	getName() { return "(y^2,0)"; }
        getFieldMult() { return .001; }
	getField(result, y) {
	    result[2] = result[1] = 0;
	    result[0] = y[1]*y[1];
	}
	nonGradient() { return true; }
	createNext() { return new Saddle(); }
    };

    class Saddle extends VecFunction {
        getName() { return "saddle"; }
        getField(result, y) {
            var q = .001;
            result[0] = -q*y[0];
            result[1] =  q*y[1]*.5;
            result[2] = 1*(2*y[0]*y[0] - y[1]*y[1]);
        }
        createNext() { return new RotationalExpansion(); }
    };

    class RotationalExpansion extends VecFunction {
        getName() { return "rotation + expansion"; }
        getField(result, y) {
            var q = .0006;
            result[0] = q*(y[0]-y[1]);
            result[1] = q*(y[0]+y[1]);
            result[2] = 0;
        }
        nonGradient() { return true; }
        createNext() { return new Function4Field(); }
    };
    
    class Function4Field extends VecFunction {
        getName() { return "(x^2-y,x+y^2)"; }
        getFieldMult() { return .0003; }
        getField(result, y) {
            result[0] = (y[0]*y[0]-y[1]);
            result[1] = (y[0]+y[1]*y[1]);
            result[2] = 0;
        }
        nonGradient() { return true; }
        createNext() { return new Function5Field(); }
    };

    class Function5Field extends VecFunction {
        getName() { return "(x+y^2,x^2-y)"; }
        getFieldMult() { return .0003; }
        getField(result, y) {
            result[0] = (y[0]+y[1]*y[1]);
            result[1] = (y[0]*y[0]-y[1]);
            result[2] = 0;
        }
        nonGradient() { return true; }
        createNext() { return new Function6Field(); }
    };

    class Function6Field extends VecFunction {
        getName() { return "(x,x^2)"; }
        getFieldMult() { return .0006; }
        getField(result, y) {
            result[0] = y[0];
            result[1] = y[0]*y[0];
            result[2] = 0;
        }
        nonGradient() { return true; }
        createNext() { return new Function7Field(); }
    };

    class Function7Field extends VecFunction {
        getName() { return "u=x^2+y"; }
        getFieldMult() { return .0003; }
        getField(result, y) {
            result[0] = -2*y[0];
            result[1] = -1;
            result[2] = (y[0]*y[0]+y[1]);
        }
        createNext() { return new PendulumPotential(); }
    };

    class PendulumPotential extends VecFunction {
        getName() { return "pendulum potential"; }
        getField(result, y) {
            var q = .0006;
            var xx  = y[0]*3.1;
            var yy  = y[1]*3.1;
            var cosx = Math.cos(xx);
            var cosy = Math.cos(yy);
            var sinx = Math.sin(xx);
            var siny = Math.sin(yy);
            result[0] = -q*sinx*cosy;
            result[1] = -q*cosx*siny;
            result[2] = -cosx*cosy*.5;
        }
        createNext() { return new Function8Field(); }
    };

    class Function8Field extends VecFunction {
        getName() { return "sin(r2)/r2"; }
        getField(result, y) {
            var r2 = 23*(y[0]*y[0]+y[1]*y[1])+.00000001;
            result[2] = Math.sin(r2)/r2;
            var r= Math.sqrt(r2);
            var sinr2 = Math.sin(r2);
            var cosr2 = Math.cos(r2);
            var r4 = r2*r2;
            var vecR = (sinr2/r4-cosr2/r2)*.01;
            result[0] = y[0]*vecR;
            result[1] = y[1]*vecR;
        }
        createNext() { return new UserDefinedPotential(); }
    };

    class UserDefinedPotential extends VecFunction {
	getName() { return "user-defined potential"; }
	setup() {
	    textFields[0].value = "x*y";
	    document.getElementById("textFieldLabel").innerHTML = "Potential Function";
            showDiv("textFieldDiv", true);
            showDiv("textField23Div", false);
	    this.actionPerformed();
	    this.y0 = [];
	}
	actionPerformed() {
	    parseError = false;
	    var ep = new ExprParser(textFields[0].value);
	    this.expr = ep.parseExpression();
	    if (ep.gotError())
		parseError = true;
            didAdjust();
	}
        getFieldMult() { return .0005; }
	getField(result, y) {
	    var dx = .00001;
	    var i;
	    for (i = 0; i != 2; i++)
		this.y0[i] = y[i];
	    var pot0 = this.expr.eval(this.y0);
            result[2] = pot0;

	    this.y0[0] += dx;
	    result[0] = (pot0-this.expr.eval(this.y0))/dx;
	    this.y0[0] = y[0];

	    this.y0[1] += dx;
	    result[1] = (pot0-this.expr.eval(this.y0))/dx;
	    
	    for (i = 0; i != 2; i++)
		if (!(result[i] > -10 && result[i] < 10))
		    boundCheck = true;
	}
	createNext() { return new UserDefinedFunction(); }
    };
    class UserDefinedFunction extends VecFunction {
	getName() { return "user-defined field"; }
	setup() {
	    this.exprs = [];
	    textFields[0].value = "x";
	    textFields[1].value = "y";
	    document.getElementById("textFieldLabel").innerHTML = "Field Functions";
            showDiv("textFieldDiv", true);
            showDiv("textField23Div", true);
	    actionPerformed();
	}
	actionPerformed() {
	    var i;
	    parseError = false;
	    for (i = 0; i != 2; i++) {
		var ep = new ExprParser(textFields[i].value);
		this.exprs[i] = ep.parseExpression();
		if (ep.gotError())
		    parseError = true;
	    }
            didAdjust();
	}
        getFieldMult() { return .0005; }
	getField(result, y) {
	    var i;
	    for (i = 0; i != 2; i++) {
		result[i] = this.exprs[i].eval(y);
		if (!(result[i] > -10 && result[i] < 10))
		    boundCheck = true;
	    }
	}
	nonGradient() { return true; }
	createNext() { return null; }
    };

    class GridElement {
        constructor() { this.height = this.div = this.curl = this.normdot = this.vecX = this.vecY = 0; this.visible = this.valid = true; }
    };

    // this is a complex number class that avoids creating new objects
    // whenever possible.  Takes a little more effort to use, but it is
    // much faster because we don't have to do constant garbage
    // collection.
    class Complex {
	constructor() { this.a = this.b = 0; }
	set(aa, bb) {
          if (bb == undefined)
            this.set(aa.a, aa.b);
          else {
            this.a = aa; this.b = bb;
          }
        }
	add(r, i) { this.a += r; if (i != undefined) this.b += i; }
	square() { this.set(this.a*this.a-this.b*this.b, 2*this.a*this.b); }
	mult2(c, d) { this.set(this.a*c-this.b*d, this.a*d+this.b*c); }
	mult(c) { if (isNaN(c)) { this.mult2(c.a, c.b); } else { this.a *= c; this.b *= c; } }
	recip() {
	    var n = this.a*this.a+this.b*this.b;
	    this.set(this.a/n, -this.b/n);
	}
	pow(p) {
	    var arg = Math.atan2(this.b, this.a);
	    arg *= p;
	    var abs = Math.pow(this.a*this.a+this.b*this.b, p*.5);
	    this.set(abs*Math.cos(arg),
		abs*Math.sin(arg));
	}
	sin() {
	    this.set(cosh(this.b)*Math.sin(this.a),
		Math.cos(this.a)*sinh(this.b));
	}
	cos() {
	    this.set(cosh(this.b)*Math.cos(this.a),
		Math.sin(this.a)*sinh(this.b));
	}
	log() {
	    this.set(Math.log(this.a*this.a+this.b*this.b),
		Math.atan2(this.b, this.a));
	}
	arcsin() {
	    var z2 = new Complex();
	    z2.set(this.a, this.b);
	    z2.square();
	    z2.mult(-1);
	    z2.add(1);
	    z2.pow(.5);
	    this.mult2(0, 1);
	    this.add(z2.a, z2.b);
	    this.log();
	    this.mult2(0, -1);
	}
    };

    function cosh(a) {
	return .5*(Math.exp(a)+Math.exp(-a));
    }
    function sinh(a) {
	return .5*(Math.exp(a)-Math.exp(-a));
    }

const E_ADD = 1;
const E_SUB = 2;
const E_X = 3;
const E_Y = 4;
const E_Z = 5;
const E_VAL = 6;
const E_MUL = 7;
const E_DIV = 8;
const E_POW = 9;
const E_UMINUS = 10;
const E_SIN = 11;
const E_COS = 12;
const E_ABS = 13;
const E_EXP = 14;
const E_LOG = 15;
const E_SQRT = 16;
const E_TAN = 17;
const E_R = 18;
const E_ASIN = 19;
const E_ACOS = 20;
const E_ATAN = 21;
const E_ATAN2 = 22;

class Expr {
    constructor(a, b, c) {
      if (c == undefined) {
        this.type = a;
        this.value = b;
      } else {
	this.left = a;
	this.right = b;
	this.type = c;
      }
    }
    eval(es) {
	switch (this.type) {
	case E_ADD: return this.left.eval(es)+this.right.eval(es);
	case E_SUB: return this.left.eval(es)-this.right.eval(es);
	case E_MUL: return this.left.eval(es)*this.right.eval(es);
	case E_DIV: return this.left.eval(es)/this.right.eval(es);
	case E_POW: return Math.pow(this.left.eval(es), this.right.eval(es));
	case E_UMINUS: return -this.left.eval(es);
	case E_VAL: return this.value;
	case E_X:   return es[0];
	case E_Y:   return es[1];
	case E_R:   return Math.sqrt(es[0]*es[0]+es[1]*es[1]);
	case E_SIN: return Math.sin(this.left.eval(es));
	case E_COS: return Math.cos(this.left.eval(es));
	case E_ABS: return Math.abs(this.left.eval(es));
	case E_EXP: return Math.exp(this.left.eval(es));
	case E_LOG: return Math.log(this.left.eval(es));
	case E_SQRT: return Math.sqrt(this.left.eval(es));
	case E_TAN: return Math.tan(this.left.eval(es));
	case E_ASIN: return Math.asin(this.left.eval(es));
	case E_ACOS: return Math.acos(this.left.eval(es));
	case E_ATAN: return Math.atan(this.left.eval(es));
	case E_ATAN2: return Math.atan2(this.left.eval(es), this.right.eval(es));
	default: console("unknown type: " + type); break;
	}
	return 0;
    }
};

class ExprParser {
    getToken() {
	while (this.pos < this.tlen && this.text.charAt(this.pos) == ' ')
	    this.pos++;
	if (this.pos == this.tlen) {
	    this.token = "";
	    return;
	}
	var i = this.pos;
	var c = this.text.charAt(i);
	if ((c >= '0' && c <= '9') || c == '.') {
	    for (i = this.pos; i != this.tlen; i++) {
		if (!((this.text.charAt(i) >= '0' && this.text.charAt(i) <= '9') ||
		      this.text.charAt(i) == '.'))
		    break;
	    }
	} else if (c >= 'a' && c <= 'z') {
	    for (i = this.pos; i != this.tlen; i++) {
		if (!(this.text.charAt(i) >= 'a' && this.text.charAt(i) <= 'z'))
		    break;
	    }
	} else {
	    i++;
	}
	this.token = this.text.substring(this.pos, i);
	this.pos = i;
    }

    skip(s) {
	if (this.token != s)
	    return false;
	this.getToken();
	return true;
    }

    skipOrError(s) {
	if (!this.skip(s))
	    this.err = true;
    }

    parseExpression() {
	if (this.token.length == 0)
	    return new Expr(E_VAL, 0.);
	var e = this.parse();
	if (this.token.length > 0)
	    this.err = true;
	return e;
    }

    parse() {
	var e = this.parseMult();
	while (true) {
	    if (this.skip("+"))
		e = new Expr(e, this.parseMult(), E_ADD);
	    else if (this.skip("-"))
		e = new Expr(e, this.parseMult(), E_SUB);
	    else
		break;
	}
	return e;
    }

    parseMult() {
	var e = this.parseUminus();
	while (true) {
	    if (this.skip("*"))
		e = new Expr(e, this.parseUminus(), E_MUL);
	    else if (this.skip("/"))
		e = new Expr(e, this.parseUminus(), E_DIV);
	    else
		break;
	}
	return e;
    }

    parseUminus() {
	this.skip("+");
	if (this.skip("-"))
	    return new Expr(this.parsePow(), null, E_UMINUS);
	return this.parsePow();
    }

    parsePow() {
	var e = this.parseTerm();
	while (true) {
	    if (this.skip("^"))
		e = new Expr(e, this.parseTerm(), E_POW);
	    else
		break;
	}
	return e;
    }

    parseFunc(t) {
	this.skipOrError("(");
	var e = this.parse();
	this.skipOrError(")");
	return new Expr(e, null, t);
    }

    parseArcTan() {
        var t = E_ATAN;
	this.skipOrError("(");
	var e1 = this.parse();
        var e2 = null;
        if (this.skip(",")) {
	  e2 = this.parse();
          t = E_ATAN2;
        }
	this.skipOrError(")");
	return new Expr(e1, e2, t);
    }

    parseTerm() {
	if (this.skip("(")) {
	    var e = this.parse();
	    this.skipOrError(")");
	    return e;
	}
	if (this.skip("x"))
	    return new Expr(E_X);
	if (this.skip("y"))
	    return new Expr(E_Y);
	if (this.skip("r"))
	    return new Expr(E_R);
	if (this.skip("pi"))
	    return new Expr(E_VAL, 3.14159265358979323846);
	if (this.skip("e"))
	    return new Expr(E_VAL, 2.7182818284590452354);
	if (this.skip("sin"))
	    return this.parseFunc(E_SIN);
	if (this.skip("cos"))
	    return this.parseFunc(E_COS);
	if (this.skip("abs"))
	    return this.parseFunc(E_ABS);
	if (this.skip("exp"))
	    return this.parseFunc(E_EXP);
	if (this.skip("log"))
	    return this.parseFunc(E_LOG);
	if (this.skip("sqrt"))
	    return this.parseFunc(E_SQRT);
	if (this.skip("tan"))
	    return this.parseFunc(E_TAN);
	if (this.skip("asin"))
	    return this.parseFunc(E_ASIN);
	if (this.skip("acos"))
	    return this.parseFunc(E_ACOS);
	if (this.skip("atan"))
	    return this.parseArcTan();
        var dv = parseFloat(this.token);
        if (isNaN(dv)) {
	    this.err = true;
	    //System.out.print("unrecognized this.token: " + this.token + "\n");
	    return new Expr(E_VAL, 0);
        }
	var e = new Expr(E_VAL, dv);
	this.getToken();
	return e;
    }

    constructor(s) {
	this.text = s;
	this.tlen = this.text.length;
	this.pos = 0;
	this.err = false;
	this.getToken();
    }
    gotError() { return this.err; }
};

window.onload = main

