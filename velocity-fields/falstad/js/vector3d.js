// vector3d.js (C) 2021 by Paul Falstad
// http://www.falstad.com/
// Original applet: http://www.falstad.com/vector3d/

"use strict";

var buffers, projectionMatrix, viewMatrix;
var textureProgramInfo;
var textureNoLightingProgramInfo;
var pointProgramInfo;
var colorProgramInfo;
var currentProgramInfo;
var equipProgramInfo;
var colorPlainProgramInfo;
var colorAttrProgramInfo;
var angleRes = 64;
var stoppedCheck;
var animating = false;
var zoom3d = 1.2;
var maxZoom3d;
var sqrt12 = Math.sqrt(.5)
var forwardThrust = 0
var outwardThrust = 0
var shipLength;
var meshes
var streamlines;
var streamcolors;
var gl
var timeMult
var shipAngle
var deltaV = 0
var success = false
var explosion
var distScalar
var deltaTimeWithoutSpeed
var viewAnimationTimer
var zoomRate = 0
var yearLength = 0
var distKm = 0
var alerted = false
var debugA = false
var potentialScale;
var lastXRot, lastYRot;
var mainView;
var mousePoint;

var sliceChooser;
const SLICE_NONE = 0;
const SLICE_X = 1;
const SLICE_Y = 2;
const SLICE_Z = 3;

const MODE_ANGLE = 0;
const MODE_ZOOM = 1;
const MODE_SLICE = 2;

var reverseCheck;
var functionChooser;
var dispChooser;

var textFieldLabel;
var partCountBar;
var strengthBar;
var vecDensityBar;
var lineDensityBar;
var potentialBar;
var aux1Bar;
var aux2Bar;
var aux3Bar;
var textFields;
var fieldStrength, partMult;
var reverse = 1;
var particles;
var sliceval = 0;
const pi = Math.PI;
const coulombK = 8.98755179e9;
const coulombKQ = coulombK*1e-9;

var vecCount;
var vectorSpacing = 16;
var showA = false;
var parseError = false;
var fieldColors = [];
var equipColors = [];
var sliceFaces = [];
var sliceNormal;
var selectedSlice;

var density = [];
const densitygridsize = 8;
const densitygridsize2 = densitygridsize*densitygridsize;
const densitygridsize3 = densitygridsize*densitygridsize*densitygridsize;
const densitygroupsize = 2/densitygridsize;
const maxParticleCount = 5000;

var lengthUnit

// standard gravitational parameter
var mu1 // in lengthUnits^3/hours^2
var mu2
const thrustMult = 10
const minThrustDelta = .00015
var body1Offset, bodyDistance
var curfunc;
var functionList;

var rotating
var lastViewFrame = ""
var vertexCountWF
var explosion

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
  return Math.hypot(x[0], x[1], x[2])
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
      info.innerHTML = "Point: (" + round(mousePoint[0]) + ", " + round(mousePoint[1]) + ", " + round(mousePoint[2]) + ")" + units + "<br>";
      var fvec = [];
      getPot = false;
      curfunc.getField(fvec, mousePoint);

      // if numbers are fake, scale numbers to make them closer to 1
      var fmult = (curfunc.getFieldMult() == 1) ? reverse * 2000 : reverse;
      var unitsF = BUILD_CASE_EMV(" V/m", showA ? " &mu;T m" : " &mu;T", "");
      if (curfunc.showD) {
        fmult *= 8.854;
        unitsF = " pC/m<sup>-2</sup>";
      }
      //info.innerHTML += "<p>&nbsp;</p>";
      info.innerHTML += BUILD_CASE_EMV(curfunc.showD ? "D = " : "E = ", showA ? "A = " : "B = ", "F = ");
      info.innerHTML += "(" + round(fvec[0]*fmult) + ", " + round(fvec[1]*fmult) + ", " + round(fvec[2]*fmult) + ")" + unitsF + "<br>";
      //info.innerHTML += "<p>&nbsp;</p>";
      if (!curfunc.nonGradient()) {
        getPot = true;
        curfunc.getField(fvec, mousePoint);
        const unitsP = BUILD_CASE_EMV(" V", " V", "");
        info.innerHTML += "Potential = " + round(fvec[0]) + unitsP + "<br><p>&nbsp;</p>";
      }
      getPot = (dispChooser.value == "equip");
    }
    if (BUILD_CASE_EMV(true, true, false))
      info.innerHTML += curfunc.getInfo();
    if (sliceChooser.selectedIndex != 0) {
      info.innerHTML += "Slice: " + ("_xyz".substring(sliceChooser.selectedIndex, sliceChooser.selectedIndex+1)) + " = " + round(sliceval);
    }
}


const stateArgs = ["f", "d", "sl", "st", "pc", "vd", "ld", "p", "a1", "a2", "a3", "tf1", "tf2", "tf3"];

function getStateItems() {
  return [functionChooser, dispChooser, sliceChooser, strengthBar, partCountBar, vecDensityBar, lineDensityBar, potentialBar, aux1Bar, aux2Bar, aux3Bar,
          textFields[0], textFields[1], textFields[2]];
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

  // convert rotation matrix to Eulerian angles and save them in URL
  var thx = Math.atan2(rotationMatrix[9], rotationMatrix[10]);
  var thy = Math.atan2(-rotationMatrix[8], Math.hypot(rotationMatrix[9], rotationMatrix[10]));
  var thz = Math.atan2(rotationMatrix[4], rotationMatrix[0]);
  link += "rx=" + Math.floor(thx*180/Math.PI) + "&ry=" + Math.floor(thy*180/Math.PI) + "&rz=" + Math.floor(thz*180/Math.PI) + "&zm=" + round(zoom3d);

  document.getElementById("stateLink").href = link;
}

function addMouseEvents(canvas) {
  canvas.onmousedown = function (event) {
    checkSlice(event.clientX, event.clientY);
    mouseDown = 1;
    mouseX = event.clientX
    mouseY = event.clientY
  }

  canvas.onmouseup = function (event) {
    mouseDown = 0;
    updateStateLink();
  }

  canvas.onmousemove = function (event) {
    if (mouseDown) {
      mousePoint = null;
      if (selectedSlice) {
        dragSlice(event.clientX, event.clientY);
        return;
      }
      var dx = event.clientX - mouseX
      var dy = event.clientY - mouseY
      mouseX = event.clientX
      mouseY = event.clientY

      // rotate view matrix
      var mtemp = mat4.create()
      mat4.rotate(mtemp, mtemp, dx*.01, [0, 1, 0]);
      mat4.rotate(mtemp, mtemp, dy*.01, [1, 0, 0]);
      mat4.multiply(rotationMatrix, mtemp, rotationMatrix);
    } else {
      checkSlice(event.clientX, event.clientY);
    }
    refresh();
  }

  canvas.addEventListener("wheel", function (event) {
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
    var width = cv.clientWidth;
    var height = cv.clientHeight;
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
  for (i = 0; i != 256; i++)
    fieldColors.push(0, i/255, 0);
  for (i = 0; i != 256; i++)
    fieldColors.push(i/255, 1, i/255);

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
  sliceChooser = document.getElementById("sliceChooser");
  strengthBar = document.getElementById("strengthBar");
  partCountBar = document.getElementById("partCountBar");
  vecDensityBar = document.getElementById("vecDensityBar");
  lineDensityBar = document.getElementById("lineDensityBar");
  potentialBar = document.getElementById("potentialBar");
  textFields = [];
  textFields[0] = document.getElementById("textField1");
  textFields[1] = document.getElementById("textField2");
  textFields[2] = document.getElementById("textField3");
  stoppedCheck = document.getElementById("stoppedCheck");
  reverseCheck = document.getElementById("reverseCheck");
  dispChooser = document.getElementById("dispChooser");
  aux1Bar = document.getElementById("aux1Bar");
  aux2Bar = document.getElementById("aux2Bar");
  aux3Bar = document.getElementById("aux3Bar");
  
  curfunc = BUILD_CASE_EMV(new InverseSquaredRadial(), new InverseRotational(), new InverseSquaredRadial());
  curfunc.setup();

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
    uniform vec3 uLightPosition;

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

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
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

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexNormal, aTextureCoord,
  // and look up uniform locations.
  textureProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  const vsNoLightingSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      vLighting = vec3(1.0, 1.0, 1.0);
    }
  `;

  const shaderNoLightingProgram = initShaderProgram(gl, vsNoLightingSource, fsSource);

  textureNoLightingProgramInfo = {
    program: shaderNoLightingProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderNoLightingProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderNoLightingProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderNoLightingProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderNoLightingProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderNoLightingProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderNoLightingProgram, 'uNormalMatrix'),
      lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
      uSampler: gl.getUniformLocation(shaderNoLightingProgram, 'uSampler'),
    },
  };

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
      lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
      color: gl.getUniformLocation(colorShaderProgram, 'uColor'),
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
      color: gl.getAttribLocation(colorAttrShaderProgram, 'aColor'),
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
     uniform highp vec4 uColor;
     void main()
     {
         if (distance(gl_PointCoord, vec2(.5, .5)) > .5)
             discard;
         gl_FragColor = uColor;
     }
  `;

  const pointVsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    void main()
    {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        gl_PointSize = 3.5;
    }
  `;

  const pointShaderProgram = initShaderProgram(gl, pointVsSource, starFsSource);

  pointProgramInfo = {
    program: pointShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(pointShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(pointShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(pointShaderProgram, 'uModelViewMatrix'),
      color: gl.getUniformLocation(pointShaderProgram, 'uColor'),
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

function setViewMatrix(a, b) {
  rotationMatrix = mat4.create();
  mat4.rotate(rotationMatrix, rotationMatrix, a, [0, 1, 0]);
  mat4.rotate(rotationMatrix, rotationMatrix, b, [1, 0, 0]);
  lastXRot = lastYRot = 0;
}

function setXYView() {
  setViewMatrix(0, pi/11);
}

function setXYViewExact() {
  setViewMatrix(0, 0);
}

function setXZView() {
  setViewMatrix(0, pi/11-pi/2);
}

function setXZViewExact() {
  setViewMatrix(0, -pi/2);
}

function resetDensityGroups() {
  var i;
  density = [];
  for (i = 0; i != densitygridsize3; i++)
    density[i] = 0;
  var slice = sliceChooser.selectedIndex;
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
  curfunc.setupFrame();

  // slow down simulation when thrusting
  if (forwardThrust != 0 || outwardThrust != 0)
    deltaTime = Math.min(minThrustDelta, deltaTime)

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mainView = { x:0, y:0, width:gl.canvas.clientWidth, height:gl.canvas.clientHeight };
  setView(mainView);

  viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, 0, -6]);
  mat4.multiply(viewMatrix, viewMatrix, rotationMatrix);
  mat4.scale(viewMatrix, viewMatrix, [zoom3d, zoom3d, zoom3d])
  mat4.invert(inverseRotationMatrix, rotationMatrix)

  drawCube(gl, buffers, projectionMatrix, viewMatrix);
  if (dispChooser.value.startsWith("partsvel") || dispChooser.value == "partsforce") {
    moveParticles();
    drawParticles(gl, buffers, projectionMatrix, viewMatrix)
  } else if (dispChooser.value.startsWith("vectors"))
    drawVectors(gl, buffers, projectionMatrix, viewMatrix);
  else if (dispChooser.value == "streamlines") {
    genLines();
    drawStreamlines();
  } else if (dispChooser.value == "equip") {
    genEquips();
    drawStreamlines();
  } else if (dispChooser.value == "partsmag") {
    moveParticles();
    drawMagneticParticles();
  } else if (dispChooser.value == "viewpaper")
    drawViewPaper();
  curfunc.render();
  if (mousePoint) {
    drawSphere(mousePoint, .04, [1, 1, 0]);
    getPot = false;
    var fvec = [];
    curfunc.getField(fvec, mousePoint);
    var mult = reverse*.2/vecLength(fvec);
    var i;
    for (i = 0; i != 3; i++)
      fvec[i] *= mult;
    drawArrow(gl, buffers, projectionMatrix, viewMatrix, mousePoint, fvec, [1, 1, 0], false);
    getPot = (dispChooser.value == "equip");
  }

  drawAxes(gl, buffers, viewMatrix);
  // no drawing after this!
}

function showDiv(div, x) {
  document.getElementById(div).style.display = (x) ? "block" : "none";
}

function csInRange(x, xa, xb) {
  if (xa < xb)
    return x >= xa-5 && x <= xb+5;
  return x >= xb-5 && x <= xa+5;
}

function checkSlice(x, y) {
  if (sliceChooser.selectedIndex == SLICE_NONE) {
    selectedSlice = false;
    return;
  }
  var n;
  selectedSlice = false;
  for (n = 0; n != sliceFaces.length; n++) {
    var sf = sliceFaces[n];
    var xa = sf.edgeVerts[0];
    var ya = sf.edgeVerts[1];
    var xb = sf.edgeVerts[2];
    var yb = sf.edgeVerts[3];
    if (!csInRange(x, xa, xb) || !csInRange(y, ya, yb))
      continue;

    var d;
    if (xa == xb)
      d = Math.abs(x-xa);
    else {
      // write line as y=a+bx
      var b = (yb-ya)/(xb-xa);
      var a = ya-b*xa;
                
      // solve for distance
      var d1 = y-(a+b*x);
      if (d1 < 0)
        d1 = -d1;
      d = d1/Math.sqrt(1+b*b);
    }
    if (d < 6) {
      selectedSlice = true;
      sliceNormal = sf.normal;
      break;
    }
  }
  if (selectedSlice) {
    mousePoint = null;
    return;
  }
  var x3 = [];
  var pn = [0, 0, 0];
  var pp = [0, 0, 0];
  var sliceCoord = sliceChooser.selectedIndex-1;
  pn[sliceCoord] = 1;
  pp[sliceCoord] = sliceval;
  unmap3d(x3, x, y, pn, pp);
  mousePoint = null;
  if (Math.max(x3[0], x3[1], x3[2]) <= 1 && Math.min(x3[0], x3[1], x3[2]) >= -1)
    mousePoint = x3;
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
  vec4.transformMat4(mousePos, mousePos, invProjMatrix);

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

function dragSlice(x, y) {
  var x3 = [];
  unmap3d(x3, x, y, sliceNormal, sliceNormal);
  switch (sliceChooser.selectedIndex) {
  case SLICE_X: sliceval = x3[0]; break;
  case SLICE_Y: sliceval = x3[1]; break;
  case SLICE_Z: sliceval = x3[2]; break;
  }
  // Avoid -1,+1 because it causes particles to drift out of the
  // cube too easily, causes problems with density groups, and
  // causes the slice to get drawn on top of/underneath the cube edges.
  if (sliceval < -.99)
    sliceval = -.99;
  if (sliceval > .99)
    sliceval = .99;
  resetDensityGroups();
  didAdjust();
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
  if ((disp == "viewpaper" || disp == "equip") && sliceChooser.selectedIndex == SLICE_NONE) {
    sliceChooser.selectedIndex = curfunc.getBestSlice();
    potentialBar.disabled = true;
  }
  resetParticles();
  streamlines = null;
  updateStateLink();
  if (refresh) refresh();
}

function sliceChooserChanged() {
  resetParticles();
  potentialBar.disabled = (sliceChooser.selectedIndex != SLICE_NONE);
  didAdjust();
}

function drawViewPaper() {
  var i, j;
  var ct = parseInt(vecDensityBar.value);
  ct = Math.floor(24+(ct*56/64));
  var z = sliceval;
  var pos = [];
  var field = [];
  var slice = sliceChooser.selectedIndex-SLICE_X;
  if (slice < 0)
    slice = 0;
  var coord1 = (slice == 0) ? 1 : 0;
  var coord2 = (slice == 2) ? 1 : 2;
  var mult = strengthBar.value*20000*curfunc.getFieldMult()/255;
  for (i = 0; i != ct; i++) {
    var x1 = i*2./ct - 1;
    var x2 = (i+1.)*2/ct - 1;
    for (j = 0; j != ct; j++) {
      var y1 = j*2./ct - 1;
      var y2 = (j+1.)*2/ct - 1;
      pos[coord1] = x1;
      pos[coord2] = y1;
      pos[slice] = z;
      curfunc.getField(field, pos);
      // paper is dark when field is perpendicular, light when
      // it is parallel
      var prp = field[slice] < 0 ? -field[slice] : field[slice];
      var par = Math.sqrt(field[coord1]*field[coord1]+field[coord2]*field[coord2]);
      var col = (par/2-prp)*mult+.5;
      var pt2 = [], pt3 = [], pt4 = [];
      var k;
      for (k = 0; k != 3; k++)
        pt2[k] = pt3[k] = pt4[k] = pos[k];
      pt2[coord1] = pt3[coord1] = x2;
      pt3[coord2] = pt4[coord2] = y2;
      drawViewPaperRect(col, pos, pt2, pt4, pt3);
    }
  }
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
  var slice = sliceChooser.selectedIndex;
  var sliced = (slice > 0);
  var vec = [0, 0, 0];

  if (!sliced) {
    vectorSpacing = Math.floor(vectorSpacing/2);
    for (x = 0; x != vectorSpacing; x++) {
      vec[0] = x*(2.0/(vectorSpacing-1))-1;
      for (y = 0; y != vectorSpacing; y++) {
        vec[1] = y*(2.0/(vectorSpacing-1))-1;
        for (z = 0; z != vectorSpacing; z++) {
          vec[2] = z*(2.0/(vectorSpacing-1))-1;
          drawVector(dd, vec);
        }
      }
    }
  } else {
    var coord1 = (slice == SLICE_X) ? 1 : 0;
    var coord2 = (slice == SLICE_Z) ? 1 : 2;
    var slicecoord = slice-SLICE_X;
    vec[slicecoord] = sliceval;
    for (x = 0; x != vectorSpacing; x++) {
      vec[coord1] = x*(2.0/(vectorSpacing-1))-1;
      for (y = 0; y != vectorSpacing; y++) {
        vec[coord2] = y*(2.0/(vectorSpacing-1))-1;
        drawVector(dd, vec);
      }
    }
  }
  //curfunc.render(g);
}

// draw the appropriate field vector at xx,yy,zz
function drawVector(dd, vec) {
  var field = dd.field;

  // calculate field vector
  curfunc.getField(field, vec);
  var dn = Math.sqrt(field[0]*field[0]+field[1]*field[1]+field[2]*field[2]);
  var dnr = dn*reverse;
  if (dn > 0) {
    field[0] /= dnr;
    field[1] /= dnr;
    field[2] /= dnr;
  }
  dn *= dd.mult;
  if (dn > 2)
    dn = 2;
  var col = Math.floor(dn*255)*3;
  var sw2 = 1./(vectorSpacing-1);
  var vv = dd.vv;
  vv[0] = sw2*field[0];
  vv[1] = sw2*field[1];
  vv[2] = sw2*field[2];
  drawArrow(dd.gl, dd.buffers, dd.projectionMatrix, dd.viewMatrix, vec, vv, [fieldColors[col], fieldColors[col+1], fieldColors[col+2]]);
}


function drawCurrentLine(point1, point2, dir) {
  gl.useProgram(currentProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.uniform4f(currentProgramInfo.uniformLocations.color, 1, 1, 0, 1);

  var ph = (currentTime*9) % 2;
  var ph0 = ph
  var phases = [dir*20+ph, ph];

  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  var verts = [].concat(point1, point2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(phases), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.phase, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.drawArrays(gl.LINE_STRIP, 0, phases.length);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);
}

function drawCurrentRing(xoff, zoff, dir, size) {
  gl.useProgram(currentProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.uniform4f(currentProgramInfo.uniformLocations.color, 1, 1, 0, 1);

  var ph = (currentTime*9) % 2;
  var ph0 = ph
  var phases = [];

  const loopSegments = 72;
  var i;
  var verts = [];
  for (i = 0; i <= loopSegments; i++) {
    var ang1 = pi*2*i/loopSegments;
    var jxx1 = size*Math.cos(ang1) + xoff;
    var jyy1 = size*Math.sin(ang1);
    verts.push(jxx1, jyy1, zoff);
    phases.push(ph-i*dir/3);
  }

  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(phases), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.phase, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.drawArrays(gl.LINE_STRIP, 0, phases.length);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);
}

function didAdjust() {
  streamlines = null;
  updateStateLink();
  refresh();
}

    function genLines() {
	if (streamlines != undefined)
	    return;
	partMult = fieldStrength = 10*curfunc.getFieldMult();
	var i;
	
	var lineGridSize = parseInt(lineDensityBar.value);
	if (lineGridSize < 3)
	    lineGridSize = 3;
	if (lineGridSize > 16)
	    lineGridSize = 16;
	var slice = sliceChooser.selectedIndex;
	var sliced = (slice > 0);
	if (sliced)
	    lineGridSize *= 2;
	var ct = (sliced) ? 30*lineGridSize*lineGridSize : 30*lineGridSize*lineGridSize*lineGridSize;
	var brightmult = 160*parseInt(strengthBar.value)*curfunc.getFieldMult();

	streamlines = [];
	streamcolors = [];
	var lineGrid = [];
	var lineGridMult = lineGridSize/2.;
	var j, k;
	for (i = 0; i != lineGridSize; i++) {
	    lineGrid[i] = [];
	    for (j = 0; j != lineGridSize; j++) {
	        lineGrid[i][j] = [];
	        for (k = 0; k != lineGridSize; k++)
	            lineGrid[i][j][k] = false;
	    }
	}
	if (sliced) {
	    var gp = Math.floor((sliceval+1)*lineGridMult);
	    for (i = 0; i != lineGridSize; i++)
		for (j = 0; j != lineGridSize; j++)
		    for (k = 0; k != lineGridSize; k++) {
			switch (slice) {
			case SLICE_X: lineGrid[i][j][k] = i!=gp; break;
			case SLICE_Y: lineGrid[i][j][k] = j!=gp; break;
			case SLICE_Z: lineGrid[i][j][k] = k!=gp; break;
			}
		    }
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
		    for (j = 0; j != 3; j++)
			p.pos[j] = origp[j];
		    dir = -1;
		    continue;
		}
		dir = 1;
		var px = 0, py = 0, pz = 0;
		while (true) {
		    if (!lineGrid[px][py][pz])
			break;
		    if (++px < lineGridSize)
			continue;
		    px = 0;
		    if (++py < lineGridSize)
			continue;
		    py = 0;
		    if (++pz < lineGridSize)
			continue;
		    break;
		}
		if (pz == lineGridSize)
		    break;
		lineGrid[px][py][pz] = true;
		var offs = .5/lineGridMult;
		origp[0] = p.pos[0] = px/lineGridMult-1+offs;
		origp[1] = p.pos[1] = py/lineGridMult-1+offs;
		origp[2] = p.pos[2] = pz/lineGridMult-1+offs;
		if (sliced)
		    origp[slice-SLICE_X] = p.pos[slice-SLICE_X] = sliceval;
	    }

            streamlines.push(p.pos[0], p.pos[1], p.pos[2]);
	    var x = p.pos;
	    lineSegment(p, dir);
	    if (p.lifetime < 0) {
		streamlines.splice(streamlines.length-3, 3);
		continue;
	    }
	    var gx = Math.floor((x[0]+1)*lineGridMult);
	    var gy = Math.floor((x[1]+1)*lineGridMult);
	    var gz = Math.floor((x[2]+1)*lineGridMult);
	    if (!lineGrid[gx][gy][gz])
		segs--;
	    lineGrid[gx][gy][gz] = true;
            streamlines.push(p.pos[0], p.pos[1], p.pos[2]);
	    var dn = brightmult*p.phi;
	    if (dn > 2)
		dn = 2;
	    var col = Math.floor(dn*255)*3;
            streamcolors.push(fieldColors[col], fieldColors[col+1], fieldColors[col+2]);
            streamcolors.push(fieldColors[col], fieldColors[col+1], fieldColors[col+2]);
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
	var c2 = a[2]-b[2];
	return c0*c0+c1*c1+c2*c2;
    }

    function lineSegment(p, dir)
    {
	var numIter=0;
	var maxh=20;
	var error=0.0, E = .001, localError;
	var order = 3;
	var Y = rk_Y;
	var Yhalf = rk_Yhalf;
	oldY = rk_oldY;
	var i;
	var slice = sliceChooser.selectedIndex;
	var sliced = (slice > 0);
	slice -= SLICE_X;

	for (i = 0; i != 3; i++)
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

	    if (sliced)
		Y[slice] = Yhalf[slice] = sliceval;

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
		Y[1] < -1 || Y[1] >= .999 ||
		Y[2] < -1 || Y[2] >= .999) {
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
	    ls_fieldavg[2] += rk_k1[2];
	    avgct++;

	    if (d > segSize2min)
		break;
	    lastd = d;

	    for (i = 0; i != order; i++)
		oldY[i] = Yhalf[i] = Y[i]; 
	}

	p.stepsize = h;
	for (i = 0; i != 3; i++)
	    p.pos[i] = Y[i];
	p.phi = Math.hypot(ls_fieldavg[0], ls_fieldavg[1], ls_fieldavg[2])/avgct;
    }
    
    var potfield;
    var potmult;
    class EquipPoint {
        constructor(a, b) {
            this.pos = [0, 0, 0];
            if (a != undefined) {
              var i;
              for (i = 0; i != 3; i++)
                  this.pos[i] = .5*(a.pos[i] + b.pos[i]);
              curfunc.getField(potfield, this.pos);
              this.pot = potmult*potfield[0];
            }
        }
        set(cx, cy, cz, x, y, z) {
            this.pos[cx] = x; this.pos[cy] = y; this.pos[cz] = z;
        }
        valid() {
            return !isNaN(this.pot) && isFinite(this.pot);
        }
        inRange() {
            return (this.pot >= -2 && this.pot <= 2);
        }
        setPot(p) { this.pot = p; }
    }

    function canSubdivide(a, b) {
        return dist2(a.pos, b.pos) > .04*.04;
    }

    function genEquips() {
        if (streamlines != null)
            return;
        partMult = fieldStrength = 10;
        vecCount = 0;
        var slice = sliceChooser.selectedIndex;
        streamlines = [];
        streamcolors = [];
        potfield = [0, 0, 0];

        var eps = [];
        var i;
        for (i = 0; i != 4; i++)
            eps[i] = new EquipPoint();
        if (slice == SLICE_NONE) {
            var steps = 3;
            for (i = -steps; i <= steps; i++)
                genEquipPlane(eps, i/steps, SLICE_X);
            for (i = -steps; i <= steps; i++)
                genEquipPlane(eps, i/steps, SLICE_Y);
            for (i = -steps; i <= steps; i++)
                genEquipPlane(eps, i/steps, SLICE_Z);
        } else
            genEquipPlane(eps, sliceval, slice);
    }

    function genEquipPlane(eps, z, slice) {
        var i, j;
        var coord1 = (slice == SLICE_X) ? 1 : 0;
        var coord2 = (slice == SLICE_Z) ? 1 : 2;
        slice -= SLICE_X;
        var grid = (sliceChooser.selectedIndex == SLICE_NONE) ? 12 : 24;
        grid *= 4;
        var gridmult = 2./grid;
        var pots = [];
        potmult = curfunc.getPotMult() * reverse;
        for (i = 0; i <= grid; i++) {
            pots[i] = [];
            for (j = 0; j <= grid; j++) {
                var x1 = i*gridmult-1;
                var y1 = j*gridmult-1;
                eps[0].set(coord1, coord2, slice, x1, y1, z);
                curfunc.getField(potfield, eps[0].pos);
                pots[i][j] = potmult*potfield[0];
            }
        }
        for (i = 0; i != grid; i++)
            for (j = 0; j != grid; j++) {
                var x1 = i*gridmult-1;
                var y1 = j*gridmult-1;
                var x2 = (i+1)*gridmult-1;
                var y2 = (j+1)*gridmult-1;
                eps[0].set(coord1, coord2, slice, x1, y1, z);
                eps[1].set(coord1, coord2, slice, x2, y1, z);
                eps[2].set(coord1, coord2, slice, x1, y2, z);
                eps[3].set(coord1, coord2, slice, x2, y2, z);
                eps[0].setPot(pots[i  ][j  ]);
                eps[1].setPot(pots[i+1][j  ]);
                eps[2].setPot(pots[i  ][j+1]);
                eps[3].setPot(pots[i+1][j+1]);
                tryEdges(eps[0], eps[1], eps[2], eps[3]);
            }
    }

    function shouldSubdivide(ep1, ep2, ep3, ep4) {
        if (!ep1.inRange())
            return true;
        if (!ep2.inRange())
            return true;
        if (!ep3.inRange())
            return true;
        if (!ep4.inRange())
            return true;
        var pmin = Math.min(ep1.pot, ep2.pot, ep3.pot, ep4.pot);
        var pmax = Math.max(ep1.pot, ep2.pot, ep3.pot, ep4.pot);
        return (pmax-pmin) > .3;
    }

    function tryEdges(ep1, ep2, ep3, ep4) {
        if (shouldSubdivide(ep1, ep2, ep3, ep4) && canSubdivide(ep1, ep2)) {
            var ep12 = new EquipPoint(ep1,  ep2);
            var ep13 = new EquipPoint(ep1,  ep3);
            var ep24 = new EquipPoint(ep2,  ep4);
            var ep34 = new EquipPoint(ep3,  ep4);
            var epc  = new EquipPoint(ep12, ep34);
            tryEdges(ep1, ep12, ep13, epc);
            tryEdges(ep12, ep2, epc, ep24);
            tryEdges(ep13, epc, ep3, ep34);
            tryEdges(epc, ep24, ep34, ep4);
            return;
        }
        tryEdge(ep1, ep2, ep3, ep4);
        tryEdge(ep1, ep2, ep1, ep3);
        tryEdge(ep1, ep2, ep2, ep4);
        tryEdge(ep1, ep3, ep2, ep4);
        tryEdge(ep1, ep3, ep3, ep4);
        tryEdge(ep2, ep4, ep3, ep4);
    }

    function spanning(ep1, ep2, pval) {
        if (ep1.pot == ep2.pot)
            return false;
        if (!(ep1.valid() && ep2.valid()))
            return false;
        return !((ep1.pot < pval && ep2.pot < pval) ||
                 (ep1.pot > pval && ep2.pot > pval));
    }

    function interpPoint(ep1, ep2, pval, pos) {
        var interp2 = (pval-ep1.pot)/(ep2.pot-ep1.pot);
        var interp1 = 1-interp2;
        var i;
        for (i = 0; i != 3; i++)
            pos[i] = ep1.pos[i]*interp1+ep2.pos[i]*interp2;
    }

    function tryEdge(ep1, ep2, ep3, ep4) {
        if (sliceChooser.selectedIndex == SLICE_NONE) {
            tryEdge2(ep1, ep2, ep3, ep4, (parseInt(potentialBar.value)-500)/500.);
        } else {
            var i;
            for (i = -20; i <= 20; i++)
                tryEdge2(ep1, ep2, ep3, ep4, i/20.);
        }
    }

    const maxVectors = 10000;
    function tryEdge2(ep1, ep2, ep3, ep4, pval) {
        if (!(spanning(ep1, ep2, pval) && spanning(ep3, ep4, pval)))
            return;

        if (streamlines.length > maxVectors*6)
            return;
        var pos = [];
        interpPoint(ep1, ep2, pval, pos);
        streamlines.push(pos[0], pos[1], pos[2]);
        interpPoint(ep3, ep4, pval, pos);
        streamlines.push(pos[0], pos[1], pos[2]);
        var col = 3*(255+(Math.floor(255*pval)));
        streamcolors.push(equipColors[col], equipColors[col+1], equipColors[col+2]);
        streamcolors.push(equipColors[col], equipColors[col+1], equipColors[col+2]);
    }


function drawParticles(gl, buffers, projectionMatrix, viewMatrix) {
  gl.useProgram(pointProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
      
  var verts = [];
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  var pcount = getParticleCount();
  for (var i = 0; i < pcount; i++) {
    verts = verts.concat(particles[i].pos);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
          
  gl.vertexAttribPointer(pointProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pointProgramInfo.attribLocations.vertexPosition);
      
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(pointProgramInfo.uniformLocations.color, 1, 1, 1, 1);

  gl.drawArrays(gl.POINTS, 0, verts.length/3);
  gl.disableVertexAttribArray(pointProgramInfo.attribLocations.vertexPosition);
}

function drawMagneticParticles() {
  var pcount = getParticleCount();
  for (var i = 0; i < pcount; i++) {
    var p = particles[i];
    var cosph = Math.cos(p.phi);
    var sinph = Math.sin(p.phi);
    var costh = Math.cos(p.theta);
    var sinth = Math.sin(p.theta);
    var al = .08;
    var rhatx = sinth*cosph*al;
    var rhaty = sinth*sinph*al;
    var rhatz = costh*al;
    var p2 = [rhatx, rhaty, rhatz];
    drawArrow(gl, buffers, projectionMatrix, viewMatrix, p.pos, p2, [1, 1, 1], false);
  }
}

function setView(view) {
  projectionMatrix = mat4.create();

  // if window is more tall than wide, adjust fov to zoom out or the earth will be cut off on the sides
  var aspect = view.width/view.height;
  var fov = Math.atan(aspect > 1 ? 1 : 1/aspect);
  mat4.perspective(projectionMatrix, fov, aspect, 0.1, 100);
  view.projectionMatrix = projectionMatrix;

  gl.viewport(view.x, gl.canvas.clientHeight-view.height-view.y, view.width, view.height);
}

function drawAxes(gl, buffers, viewMatrix) {
  var xOff = gl.canvas.width-100;
  var view = { x:xOff, y:0, width:100, height:100 };
  setView(view);

  const scaledViewMatrix = mat4.create();
  var inverseMatrix;

  // zoom3d is already in viewMatrix, so divide that out because zoom shouldn't change the axes
  var scale = 4 * .4/zoom3d;
  mat4.scale(scaledViewMatrix, viewMatrix, [scale, scale, scale, 1]);
  
  gl.disable(gl.DEPTH_TEST);           // disable depth testing

  // hack to save and restore zoom level since drawArrow looks at it
  var saveZoom = zoom3d;
  zoom3d = .4;
  drawArrow(gl, buffers, projectionMatrix, scaledViewMatrix, [0, 0, 0], [1, 0, 0], [1, 1, 1], false, inverseMatrix);
  drawArrow(gl, buffers, projectionMatrix, scaledViewMatrix, [0, 0, 0], [0, 1, 0], [1, 1, 1], false, inverseMatrix);
  drawArrow(gl, buffers, projectionMatrix, scaledViewMatrix, [0, 0, 0], [0, 0, 1], [1, 1, 1], false, inverseMatrix);
  zoom3d = saveZoom;

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

function drawCylinder(position, radius, color) {
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  const normalMatrix = mat4.create();

  var programInfo = colorProgramInfo
  gl.useProgram(programInfo.program);

  mat4.translate(modelViewMatrix, modelViewMatrix, position);
  mat4.scale(modelViewMatrix, modelViewMatrix, [radius, radius, 1, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cylinderPosition);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cylinderNormal);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix,     false, normalMatrix);
  gl.uniform4f(programInfo.uniformLocations.color, color[0], color[1], color[2], 1);
  gl.drawArrays(gl.TRIANGLES, 0, buffers.cylinderCount);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function drawWireframeCylinder(position, radius) {
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  var programInfo = colorProgramInfo
  gl.useProgram(programInfo.program);

  mat4.translate(modelViewMatrix, modelViewMatrix, position);
  mat4.scale(modelViewMatrix, modelViewMatrix, [radius, radius, 1, 1]);

  var verts = [];
  var i;
  var ct = 24;
  for (i = 0; i != ct; i++) {
    var a1 = Math.PI*2*i/ct;
    var a2 = Math.PI*2*(i+1)/ct;
    verts.push(Math.cos(a1), Math.sin(a1), +1);
    verts.push(Math.cos(a2), Math.sin(a2), +1);
    verts.push(Math.cos(a1), Math.sin(a1), -1);
    verts.push(Math.cos(a2), Math.sin(a2), -1);
    verts.push(Math.cos(a1), Math.sin(a1), +1);
    verts.push(Math.cos(a1), Math.sin(a1), -1);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(programInfo.uniformLocations.color, 1, 1, 1, 1);
  gl.drawArrays(gl.LINES, 0, verts.length/3);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function drawWireframeSphere(position, radius) {
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  var programInfo = colorProgramInfo
  gl.useProgram(programInfo.program);

  mat4.translate(modelViewMatrix, modelViewMatrix, position);
  mat4.scale(modelViewMatrix, modelViewMatrix, [radius, radius, radius, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(programInfo.uniformLocations.color, 1, 1, 1, 1);

  var i, j;
  var loncount = 8;
  var latcount = 24;
  for (j = 0; j != loncount; j++) {
     var verts = [];
     for (i = 0; i != latcount; i++) {
        var th = 2*Math.PI*i/latcount;
        var ph =   Math.PI*j/loncount;
	verts.push(Math.sin(th)*Math.cos(ph), Math.sin(th)*Math.sin(ph), Math.cos(th));
     }
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
     gl.drawArrays(gl.LINE_LOOP, 0, verts.length/3);
  }

  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function functionChanged(first) {
  if (!first)
    reverseCheck.checked = false;
  //parseError = false;
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
  //sliceChooser.selectedIndex = SLICE_NONE;
  resetParticles();
  dispChooserChanged();
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

function drawArrow(gl, buffers, projectionMatrix, viewMatrix, pos, arrowVec, col) {
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

  // find a vector perpendicular to arrow vector and eye vector, so the arrowhead can be seen
  vec3.transformMat4(zVec, [0, 0, 1], inverseRotationMatrix)
  vec3.cross(crossVec, arrowVec, zVec)
  vec3.normalize(crossVec, crossVec);

  var cross2Vec = vec3.create();
  vec3.cross(cross2Vec, crossVec, arrowVec);
  vec3.normalize(cross2Vec, cross2Vec);

  const shaftWidth = .02 * (.4/zoom3d);
  const headWidth = .08 * (.4/zoom3d);
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
  var c = Math.floor((p.pos[2]+1)*(densitygridsize/2));
  var n = 0;
  density[a+b*densitygridsize+c*densitygridsize2]--;
}

function addToDensityGroup(p) {
  var a = Math.floor((p.pos[0]+1)*(densitygridsize/2));
  var b = Math.floor((p.pos[1]+1)*(densitygridsize/2));
  var c = Math.floor((p.pos[2]+1)*(densitygridsize/2));
  var n = 0;
  return ++density[a+b*densitygridsize+c*densitygridsize2];
}

function positionParticle(p) {
  var x, y, z;
  var bestx = 0, besty = 0, bestz = 0;
  var best = 10000;

  // we avoid scanning the grid in the same order every time
  // so that we treat equal-density squares as equally as possible.
  var randaddx = getrand(densitygridsize);
  var randaddy = getrand(densitygridsize);
  var randaddz = getrand(densitygridsize);
  for (x = 0; x != densitygridsize; x++)
    for (y = 0; y != densitygridsize; y++)
      for (z = 0; z != densitygridsize; z++) {
        var ix = (randaddx + x) % densitygridsize;
        var iy = (randaddy + y) % densitygridsize;
        var iz = (randaddz + z) % densitygridsize;
        if (density[ix+iy*densitygridsize+iz*densitygridsize2] <= best) {
          bestx = ix;
          besty = iy;
          bestz = iz;
          best = density[ix+iy*densitygridsize+iz*densitygridsize2];
        }
      }
  p.pos[0] = bestx*densitygroupsize + getrand(100)*densitygroupsize/100.0 - 1;
  p.pos[1] = besty*densitygroupsize + getrand(100)*densitygroupsize/100.0 - 1;
  p.pos[2] = bestz*densitygroupsize + getrand(100)*densitygroupsize/100.0 - 1;

  var j;
  for (j = 0; j != 3; j++) {
    p.pos[j] = getrand(200)/100.0 - 1;
    p.vel[j] = 0;
  }
  p.lifetime = curfunc.redistribute() ? 500 : 5000;
  p.stepsize = 1;
  p.theta = (getrand(101)-50)*pi/50.;
  p.phi   = (getrand(101)-50)*pi/50.;
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

  var slice = document.getElementById("sliceChooser").selectedIndex;
  var sliced = (slice > 0);
  partMult = fieldStrength * reverse * timeStep;
  for (i = 0; i != pcount; i++) {
    var pt = particles[i];
    removeFromDensityGroup(pt);
    moveParticle(pt);
    var x = pt.pos;
    if (!(x[0] >= -1 && x[0] < 1 &&
          x[1] >= -1 && x[1] < 1 &&
          x[2] >= -1 && x[2] < 1) ||
        (pt.lifetime -= timeStep) < 0) {
      positionParticle(pt);
    }
    if (sliced)
      x[slice-SLICE_X] = sliceval;
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
  var maxd = (2*getParticleCount()/(densitygridsize*densitygridsize*densitygridsize));
  var i;
  var pn = 0;
  var pcount = getParticleCount();
  for (i = rediscount % 4; i < pcount; i+=4) {
    var p = particles[i];
    var a = Math.floor((p.pos[0]+1)*(densitygridsize/2));
    var b = Math.floor((p.pos[1]+1)*(densitygridsize/2));
    var c = Math.floor((p.pos[2]+1)*(densitygridsize/2));
    if (density[a+b*densitygridsize+c*densitygridsize2] <= maxd)
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

function drawStreamlines() {
  gl.useProgram(colorAttrProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(streamlines), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorAttrProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(streamcolors), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorAttrProgramInfo.attribLocations.color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttrProgramInfo.attribLocations.color);
  
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorAttrProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.drawArrays(gl.LINES, 0, streamlines.length/3);
  gl.disableVertexAttribArray(colorAttrProgramInfo.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(colorAttrProgramInfo.attribLocations.color);
}

function drawRing(xoff, zoff, size) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  const loopSegments = 72;
  var i;
  var verts = [];
  for (i = 0; i != loopSegments; i++) {
    var ang1 = pi*2*i/loopSegments;
    var ang2 = pi*2*(i+1)/loopSegments;
    var jxx1 = size*Math.cos(ang1) + xoff;
    var jyy1 = size*Math.sin(ang1);
    var jxx2 = size*Math.cos(ang2) + xoff;
    var jyy2 = size*Math.sin(ang2);
    verts.push(jxx1, jyy1, zoff, jxx2, jyy2, zoff);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);
  
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  var color = darkYellow;
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, color[0], color[1], color[2], 1);
  gl.drawArrays(gl.LINE_STRIP, 0, verts.length/3);
}

function drawPlane(sizex, sizey, z) {
  drawPlaneWithPoints([-sizex, -sizey, z, +sizex, -sizey, z, -sizex, +sizey, z, +sizex, +sizey, z]);
}

function drawPlaneWithPoints(verts) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);
  
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, darkYellow[0], darkYellow[1], darkYellow[2], 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawViewPaperRect(col, pt1, pt2, pt3, pt4) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  var verts = [].concat(pt1, pt2, pt3, pt4);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);
  
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, 0, col, 0, 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function projectCoords(vec) {
  var pvec = vec4.create();
  vec3.copy(pvec, vec);
  pvec[3] = 1;
  vec4.transformMat4(pvec, pvec, viewMatrix);
  vec4.transformMat4(pvec, pvec, projectionMatrix);
  return [mainView.x+mainView.width *(.5+.5*pvec[0]/pvec[3]),
          mainView.y+mainView.height*(.5-.5*pvec[1]/pvec[3])];
}

function drawCube(gl, buffers, projectionMatrix, viewMatrix) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  var slice = sliceChooser.selectedIndex;
  var sliceIndex = 0;
  for (var i = 0; i != 6; i++) {
    var verts = []
    var pts = [0, 0, 0];
    for (var n = 0; n != 4; n++) {
      computeFace(i, n, pts);
      verts = verts.concat(pts);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);
  
    gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
    gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, 1, 1, 1, 1);
    gl.drawArrays(gl.LINE_LOOP, 0, verts.length/3);

    // draw edges of slice
    if (slice != SLICE_NONE && Math.floor(i/2) != slice-SLICE_X) {
      if (selectedSlice)
        gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, 1, 1, 0, 1);
      var coord1 = (slice == SLICE_X) ? 1 : 0;
      var coord2 = (slice == SLICE_Z) ? 1 : 2;
      computeFace(i, 0, pts);
      pts[slice-SLICE_X] = sliceval;
      verts = [].concat(pts);
      var proj1 = projectCoords(pts);
      computeFace(i, 2, pts);
      pts[slice-SLICE_X] = sliceval;
      var proj2 = projectCoords(pts);
      verts = verts.concat(pts);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
      gl.drawArrays(gl.LINES, 0, 2);
      var nx = (i == 0) ? -1 : (i == 1) ? 1 : 0;
      var ny = (i == 2) ? -1 : (i == 3) ? 1 : 0;
      var nz = (i == 4) ? -1 : (i == 5) ? 1 : 0;
      sliceFaces[sliceIndex++] = { edgeVerts: proj1.concat(proj2), normal: [nx, ny, nz] };
    }
  }
}

// generate the nth vertex of the bth cube face
function computeFace(b, n, pts) {
  // One of the 3 coordinates (determined by a) is constant.
  // When b=0, x=-1; b=1, x=+1; b=2, y=-1; b=3, y=+1; etc
  var a = b >> 1;
  pts[a] = ((b & 1) == 0) ? -1 : 1;

  // fill in the other 2 coordinates with one of the following
  // (depending on n): -1,-1; +1,-1; +1,+1; -1,+1
  var i;
  for (i = 0; i != 3; i++) {
    if (i == a) continue;
    pts[i] = (((n>>1)^(n&1)) == 0) ? -1 : 1;
    n >>= 1;
  }
}

// draw equipotentials using a shader made for that purpose
function drawEquips(gl, buffers, projectionMatrix, viewMatrix) {
  var programInfo = equipProgramInfo;
  gl.useProgram(programInfo.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  var y = .1;
  var xz = 5*body2Orbit.semiAxis;
  var verts = [-xz, y, -xz, -xz, y, xz, xz, y, -xz, xz, y, xz];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, viewMatrix);
  var ignore2 = document.getElementById("ignoreBody2").checked;
  gl.uniform4f(programInfo.uniformLocations.body1Position, body1Orbit.position[0],
               body1Orbit.position[1], body1Orbit.position[2], mu1);
  gl.uniform4f(programInfo.uniformLocations.body2Position, body2Orbit.position[0],
               body2Orbit.position[1], body2Orbit.position[2], ignore2 ? 0 : mu2);
  gl.uniform4f(programInfo.uniformLocations.rotationVector, 0, 2*Math.PI/body2Orbit.period, 0, potentialScale);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
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
  return document.getElementById("partCountBar").value;
}

function getrand(n) {
  return Math.floor(Math.random()*n);
}

function distance(x, y, z) {
  if (y == undefined)
    return Math.sqrt(x[0]*x[0]+x[1]*x[1]+x[2]*x[2]);
  if (z == undefined)
    return Math.sqrt(x*x+y*y+1e-10);
  return Math.sqrt(x*x+y*y+z*z+1e-10);
}

function resetDensityGroups() {
  var i, j, k;
  for (i = 0; i != density.length; i++)
    density[i] = 0;
  var slice = sliceChooser.selectedIndex;
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

function resetParticles() {
  var pcount = getParticleCount();
  var i, j;
  for (i = 0; i != pcount; i++) {
    var p = particles[i];
    for (j = 0; j != 3; j++) {
      p.pos[j] = getrand(200)/100.0 - 1;
      p.vel[j] = 0;
    }
    p.lifetime = i*2;
    p.stepsize = 1;
  }
  resetDensityGroups();
}

function kickParticles() {
  var i, j;
  for (i = 0; i != getParticleCount(); i++) {
    var p = particles[i];
    for (j = 0; j != 3; j++)
      p.vel[j] += (getrand(100)/99.0 - .5) * .04;
  }
}

var boundCheck;
var oldY = [];
var rk_k1 = [];
var rk_k2 = [];
var rk_k3 = [];
var rk_k4 = [];
var rk_yn = [];

function rk(order, x, Y, stepsize) {
  var i;

  // x is not used...

  if (order == 3) {
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
  // and field strength slider to work).  It would be nice if we
  // could just say getField(result+3, y), but that's java for you.
  var i;
  for (i = 0; i != 3; i++)
    result[i+3] = .1*fmult*result[i];

  // here we fill in result[0:2] so that the particle position will
  // change according to the velocity.
  for (i = 0; i != 3; i++)
    result[i] = stepsize*timeStep*rk_yn[i+3];
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
  if (disp == "partsmag") {
    magneticMoveParticle(p);
    return;
  }

  var numIter=0;
  var maxh=1;
  var error=0.0, E = .001, localError;
  var useForce = (disp == "partsforce");
  var order = useForce ? 6 : 3;
  var Y = rk_Y;
  var Yhalf = rk_Yhalf;
  oldY = rk_oldY;
  var i;

  for (i = 0; i != 3; i++)
    oldY[i] = Y[i] = Yhalf[i] = p.pos[i];
  if (useForce)
    for (i = 0; i != 3; i++)
      Y[i+3] = Yhalf[i+3] = p.vel[i];
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
      for (i = 0; i != 3; i++) {
        p.vel[i] += fmult*Yhalf[i];
        p.pos[i] += timeStep*p.vel[i];
      }
    } else {
      for (i = 0; i != 3; i++)
        p.pos[i] += fmult*Yhalf[i];
    }
    for (i = 0; i != 3; i++)
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
  for (i = 0; i != 3; i++)
    p.pos[i] = Y[i];
  if (useForce) {
    for (i = 0; i != 3; i++)
      p.vel[i] = Y[i+3];
  }
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

  getBestSlice() {
    var y = [.9, .9, .9];
    var r1 = [];
    var r2 = [];
    var r3 = [];
    curfunc.getField(r1, y);
    y[0] = .91;
    curfunc.getField(r2, y);
    y[0] = .9; y[1] = .91;
    curfunc.getField(r3, y);
    if (r1[0] == r2[0] && r1[1] == r2[1] && r1[2] == r2[2])
      return SLICE_X;
    if (r1[0] == r3[0] && r1[1] == r3[1] && r1[2] == r3[2])
      return SLICE_Y;
    return SLICE_Z;
  }
}

var getPot = false;
const chargeSize = .06;
const darkYellow = [144/256, 144/256, 0];

function drawCharge(x, y, z, dir) {
  drawSphere([x, y, z], chargeSize, darkYellow);
  if (dir != 0)
    drawArrow(gl, buffers, projectionMatrix, viewMatrix, [x, y, z], [0, 0, .3*dir*reverse], [1, 1, 1]);
}

class InverseSquaredRadial extends VecFunction {
  getName() { return BUILD_CASE_EMV("point charge", null, "1/r^2 single"); }
  getFieldMult() { return .0003/coulombKQ; }
  getPotMult() { return .1/coulombKQ; }
  getInfo() { return "Charge = " + (-reverse) + " nC<br>"; }
  getField(result, y) {
    var r = distance(y);
    if (r < chargeSize)
      boundCheck = true;
    if (getPot) {
      result[0] = -coulombK*1e-9/r;
      return;
    }
    var r3 = r*r*r;
    var q = coulombK*1e-9/r3;
    result[0] = -y[0]*q;
    result[1] = -y[1]*q;
    result[2] = -y[2]*q;
  }

  setup() { setXZView(); }

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

function useMagnetMove() {
  return dispChooser.value == "partsmag";
}

    var mstates;

    function magneticMoveParticle(p) {
        var i;
        if (mstates == null) {
            mstates = [];
            for (i = 0; i != 3; i++)
                mstates[i] = new MagnetState();
        }
        var ms     = mstates[0];
        var mshalf = mstates[1];
        var oldms  = mstates[2];
        for (i = 0; i != 3; i++) {
            ms.pos[i] = p.pos[i];
            ms.vel[i] = p.vel[i];
            ms.theta  = p.theta;
            ms.thetav = p.thetav;
            ms.phi    = p.phi;
            ms.phiv   = p.phiv;
        }
        mshalf.copy(ms);
        oldms.copy(ms);
        
        var h = 1;
        const minh = .01;
        const maxh = 1;
        const E = .1;
        var steps = 0;
        var adapt = curfunc.useAdaptiveRungeKutta() && curfunc.useRungeKutta();
        boundCheck = false;

        var t = 0;
        while (t < 1) {
            // estimate one full step
            magnetMove(ms, h);
            if (boundCheck) {
                p.pos[0] = -100;
                return;
            }
            if (curfunc.checkBounds(ms.pos, oldms.pos)) {
                p.pos[0] = -100;
                return;
            }
            
            if (!adapt)
                break;

            // estimate two half steps
            magnetMove(mshalf, h*.5);
            magnetMove(mshalf, h*.5);
            
            // estimate the local error
            var localError =
                Math.abs(ms.pos[0] - mshalf.pos[0]) +
                Math.abs(ms.pos[1] - mshalf.pos[1]) +
                Math.abs(ms.pos[2] - mshalf.pos[2]) +
                Math.abs(ms.theta  - mshalf.theta) +
                Math.abs(ms.phi    - mshalf.phi);
            
            if (localError > E && h > minh) {
                h *= 0.75; // decrease the step size
                if (h < minh)
                    h = minh;
                ms.copy(oldms);
                continue;
            } else if (localError < (E * 0.5)) {
                h *= 1.25; // increase the step size
                if (h > maxh)
                    h = maxh;
            }
            
            mshalf.copy(ms);
            t += h;
            steps++;
        }

        for (i = 0; i != 3; i++) {
            p.pos[i]  = ms.pos[i];
            p.vel[i]  = ms.vel[i];
        }
        p.theta   = ms.theta;
        p.thetav  = ms.thetav;
        p.phi     = ms.phi;
        p.phiv    = ms.phiv;
    }

    function magnetMove(ms, stepsize) {
        var cosph = Math.cos(ms.phi);
        var sinph = Math.sin(ms.phi);
        var costh = Math.cos(ms.theta);
        var sinth = Math.sin(ms.theta);
        // rhat  = (sinth*cosph, sinth*sinph, costh)
        // thhat = (costh*cosph, costh*sinph, -sinth)
        // phhat = (-sinph, cosph, 0)
        // These three vectors are always perpendicular and rhat X
        // thhat = phhat.  The particle's arrow points in the
        // direction of rhat, so the points p.pos + thhat, p.pos +
        // phhat, p.pos - tthat, p.pos - phhat are the four points we
        // sample on the current loop (if we pretend that each
        // particle has a current loop which goes around the arrow)
        var thhat = [costh*cosph, costh*sinph, -sinth];
        var phhat = [-sinph, cosph, 0];
        var thhatn = [];
        var phhatn = [];
        var force  = [];
        var torque = [];
        var i;
        for (i = 0; i != 3; i++) {
            thhatn[i] = -thhat[i];
            phhatn[i] = -phhat[i];
            force[i] = torque[i] = 0;
        }
        getMagForce(ms.pos, thhat,  phhat,  force, torque);
        getMagForce(ms.pos, phhat,  thhatn, force, torque);
        getMagForce(ms.pos, thhatn, phhatn, force, torque);
        getMagForce(ms.pos, phhatn, thhat,  force, torque);
        for (i = 0; i != 3; i++) {
            ms.vel[i] += force[i]*stepsize;
            ms.pos[i] += ms.vel[i]*stepsize;
        }
        // turning about the phhat axis causes theta to change.
        ms.thetav += vec3.dot(torque, phhat)*1000*stepsize;
        // turning about the z axis causes phi to change.
        ms.phiv   += torque[2]*1000*stepsize; // torque . zhat

        // heavily damp the oscillation of the magnets
        ms.thetav *= Math.exp(-.2*stepsize);
        ms.phiv   *= Math.exp(-.2*stepsize);

        ms.theta  += ms.thetav*stepsize;
        ms.phi    += ms.phiv*stepsize;
    }

    function getMagForce(pos, off, j, f, torque) {
        var i;
        var offs = [];
        for (i = 0; i != 3; i++) {
            offs[i] = off[i] * .02;
            rk_yn[i] = pos[i] + offs[i];
        }
        curfunc.getField(rk_k1, rk_yn);
        var fmult = reverse * parseInt(strengthBar.value) * curfunc.getFieldMult();
        for (i = 0; i != 3; i++)
            rk_k1[i] *= fmult;
        var newf = [0, 0, 0];
        var newtorque = [0, 0, 0];
        vec3.cross(newf, j, rk_k1);
        vec3.cross(newtorque, offs, newf);
        for (i = 0; i != 3; i++) {
            f[i] += newf[i];
            torque[i] += newtorque[i];
        }
    }

    class MagnetState {
        constructor() { this.pos = [0, 0, 0]; this.vel = [0, 0, 0]; }
        copy(ms) {
            var i;
            this.pos = [];
            this.vel = [];
            for (i = 0; i != 3; i++) {
                this.pos[i]  = ms.pos[i];
                this.vel[i]  = ms.vel[i];
            }
            this.theta   = ms.theta;
            this.thetav  = ms.thetav;
            this.phi     = ms.phi;
            this.phiv    = ms.phiv;
        }
    };

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
    var r1 = distance(xx1, y[1], y[2]);
    if (r1 < chargeSize)
      boundCheck = true;
    var r2 = distance(xx2, y[1], y[2]);
    if (r2 < chargeSize)
      boundCheck = true;
    if (getPot) {
      result[0] = -coulombKQ/r1 - coulombKQ*this.sign2/r2;
      if (this.sign2 == -1)
        result[0] *= 2;
      return;
    }
    var q = coulombKQ;
    var rq1 = q/(r1*r1*r1);
    var rq2 = q/(r2*r2*r2) * this.sign2;
    result[0] = -xx1 *rq1-xx2 *rq2;
    result[1] = -y[1]*rq1-y[1]*rq2;
    result[2] = -y[2]*rq1-y[2]*rq2;
  }

  setup() {
    setXZView();
    this.sign2 = 1;
    setupBar(0, "Charge Separation", 30);
  }

  render() {
    var sep = auxBarValue(1)/100.;
    drawCharge(+sep, 0, 0);
    drawCharge(-sep, 0, 0);
  }

  createNext() { return BUILD_CASE_EMV(new InverseSquaredRadialDipole(), null, new InverseRadial()); }
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
	    var zz  = y[2];
	    var r1 = distance(xx1, yy1, zz);
	    var r2 = distance(xx2, yy1, zz);
	    var r3 = distance(xx1, yy2, zz);
	    var r4 = distance(xx2, yy2, zz);
	    if (r1 < chargeSize || r2 < chargeSize ||
		r3 < chargeSize || r4 < chargeSize)
		boundCheck = true;
	    if (getPot) {
		result[0] = coulombKQ*(-1/r1+1/r2+1/r3-1/r4);
		return;
	    }
	    var q = coulombKQ;
	    var rq1 = q/(r1*r1*r1);
	    var rq2 = q/(r2*r2*r2);
	    var rq3 = q/(r3*r3*r3);
	    var rq4 = q/(r4*r4*r4);
	    result[0] = -xx1*rq1-xx2*rq4+xx2*rq2+xx1*rq3;
	    result[1] = -yy1*rq1-yy2*rq4+yy1*rq2+yy2*rq3;
	    result[2] = -zz *rq1-zz *rq4+zz *rq2+zz *rq3;
	}
	setup() {
	    super.setup();
	    setupBar(0, "Charge Separation", 30);
	    setXYViewExact();
	}
	render() {
	    var sep = auxBarValue(1)/100.;
	    var i, j;
	    for (i = -1; i <= 1; i += 2)
		for (j = -1; j <= 1; j += 2)
		    drawCharge(i*sep, j*sep, 0);
	}
	createNext() { return new InverseRadial(); }
    };

const lineWidth = .01;

class InverseRadial extends VecFunction {
  getName() { return BUILD_CASE_EMV("charged line", null, "1/r single line"); }
  getFieldMult() { return .0003/(2*coulombKQ); }
  getPotMult() { return .4/(2*coulombKQ); }
  getInfo() { return "Charge = " + (-reverse) + " nC/m<br>"; }
  getField(result, y) {
    var r = distance(y[0], y[1], 0);
    if (r < lineWidth)
      boundCheck = true;
    if (getPot) {
      result[0] = 2*coulombKQ*Math.log(r+1e-20);
      return;
    }
    var r2 = r*r;
    result[0] = -2*coulombKQ*y[0]/r2;
    result[1] = -2*coulombKQ*y[1]/r2;
    result[2] = 0;
  }

  setup() {
    setXZView();
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
  }

  getName() { return BUILD_CASE_EMV("line charge double", null, "1/r double lines"); }
  getFieldMult() { return .0003/(2*coulombKQ); }
  getPotMult() { return .2/(2*coulombKQ); }
  getInfo() {
     var sep = auxBarValue(1)/100.;
     return "Charges = " + (this.sign == 1 ? -reverse : "&plusmn;1") + " nC/m<br>Separation = " + round(sep*2) + " m<br>";
  }
  getField(result, y) {
    var sep = auxBarValue(1)/100.;
    var xx1 = y[0] - sep;
    var xx2 = y[0] + sep;
    var r1 = distance(xx1, y[1]);
    var r2 = distance(xx2, y[1]);
    if (r1 < lineWidth || r2 < lineWidth)
      boundCheck = true;
    if (getPot) {
      result[0] = 2*coulombKQ*(Math.log(r1+1e-20)+ this.sign*Math.log(r2+1e-20));
      return;
    }
    var q = 2*coulombKQ;
    var r1s = 1/(r1*r1);
    var r2s = 1/(r2*r2*this.sign);
    result[0] = q*(-xx1 *r1s-xx2 *r2s);
    result[1] = q*(-y[1]*r1s-y[1]*r2s);
    result[2] = 0;
  }
  setup() {
    setupBar(0, "Line Separation", 30);
    setXZView();
  }

  render() {
    var sep = auxBarValue(1)/100.;
    var i;
    for (i = -1; i <= 1; i += 2)
      drawLine([sep*i, 0, -1], [sep*i, 0, +1], darkYellow);
  }

  createNext() { return BUILD_CASE_EMV(new InverseRadialDipole(), null, new InverseRotational()); }
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
	    if (getPot) {
		result[0] = 2*coulombKQ*(+Math.log(r1+1e-20)
				-Math.log(r2+1e-20)
				-Math.log(r3+1e-20)
				+Math.log(r4+1e-20));
		return;
	    }
	    var q = 2*coulombKQ;
	    result[0] = q*(-xx1/(r1*r1)-xx2/(r4*r4) +xx2/(r2*r2)+xx1/(r3*r3));
	    result[1] = q*(-yy1/(r1*r1)-yy2/(r4*r4) +yy1/(r2*r2)+yy2/(r3*r3));
	    result[2] = 0;
	}
	setup() {
	    setupBar(0, "Line Separation", 30);
	    setXYViewExact();
	}

	render() {
	    var sep = auxBarValue(1)/100.;
	    var i, j;
	    for (i = -1; i <= 1; i += 2) {
		for (j = -1; j <= 1; j += 2)
		    drawLine([sep*i, sep*j, -1], [sep*i, sep*j, +1], darkYellow);
	    }
	}

	createNext() { return new FiniteChargedLine(); }
    };

    class FiniteChargedLine extends InverseRadial {
	getName() { return "finite line"; }
        getFieldMult() { return .00018/coulombKQ; }
        getPotMult() { return .1/coulombKQ; }
        getInfo() {
          return "Total charge: " + (-reverse) + " nC<br>Length: " + round(this.lineHalfLen*2) + " m<br>";
        }
	setup() {
	    setXZView();
	    setupBar(0, "Line Length", 30);
	}
	setupFrame() {
	    this.lineHalfLen = (auxBarValue(1)+1) / 101.;
	}
	getField(result, y) {
	    result[0] = result[1] = result[2] = 0;
	    this.getLineField(result, y, 0);
	}
	getLineField(result, y, off) {
	    var a1 = -this.lineHalfLen-y[2];
	    var a2 =  this.lineHalfLen-y[2];
	    var r = distance(y[0]-off, y[1]);
	    if (r < lineWidth && a1 <= 0 && a2 >= 0) 
		boundCheck = true;
	    var y2 = r*r;
	    var a12 = a1*a1;
	    var a22 = a2*a2;
	    var a12y2 = Math.sqrt(a12+y2);
	    var a22y2 = Math.sqrt(a22+y2);
	    var q = coulombKQ/(2*this.lineHalfLen);
	    if (getPot) {
		result[0] -= q*Math.log((a2+a22y2)/(a1+a12y2));
		return;
	    }
	    var fth = q* (-1/(a12+y2+a1*a12y2)+1/(a22+y2+a2*a22y2));
	    result[0] += fth*(y[0]-off);
	    result[1] += fth*y[1];
	    result[2] += q*(1/a12y2 - 1/a22y2);
	}
	createNext() { return new FiniteChargedLinePair(); }
    };

    class FiniteChargedLinePair extends FiniteChargedLine {
	constructor() { super(); this.dipole = 1; }
	getName() { return "finite line pair"; }
	setup() {
	    setXZView();
	    setupBar(0, "Line Length", 30);
	    setupBar(1, "Line Separation", 30);
	}
	setupFrame() {
	    this.lineHalfLen = (auxBarValue(1)+1) / 101.;
	}
        getInfo() {
	    var sep = auxBarValue(2)/100.;
            return "Charge on each: " + (this.dipole == 1 ? -reverse : "&plusmn;1") + " nC<br>Length: " + round(this.lineHalfLen*2) + " m<br>" +
                 "Separation: " + round(sep*2) + " m<br>";
        }
	getField(result, y) {
	    var sep = auxBarValue(2)/100.;
	    result[0] = result[1] = result[2] = 0;
	    this.getLineField(result, y, +sep);
	    result[0] *= this.dipole;
	    result[1] *= this.dipole;
	    result[2] *= this.dipole;
	    this.getLineField(result, y, -sep);
	}
	render() {
	    var sep = auxBarValue(2)/100.;
	    var i;
	    for (i = -1; i <= 1; i += 2)
		drawLine([sep*i, 0, -this.lineHalfLen], [sep*i, 0, +this.lineHalfLen], darkYellow);
	}
	createNext() { return new FiniteChargedLineDipole(); }
    };

    class FiniteChargedLineDipole extends FiniteChargedLinePair {
	constructor() { super(); this.dipole = -1; }
	getName() { return "finite line dipole"; }
	createNext() { return new ConductingPlate(); }
    };

    class ConductingPlate extends VecFunction {
	getName() { return "conducting plate"; }
	constructor() {
	    super();
	    this.z = new Complex();
	    this.plate = true;
	}
        getInfo() {
            return "Width: " + round(this.a*2) + " m<br>" + super.getInfo();
        }
	setupFrame() {
	    this.a = (auxBarValue(1)+1)/100.;
	}
	getField(result, y) {
	    // smythe p89
	    if (y[2] >= -.02 && y[2] <= .02) {
		if ((this.plate  && y[0] >= -this.a && y[0] <= this.a) ||
		    (!this.plate && (y[0] >= this.a || y[0] <= -this.a)))
		boundCheck = true;
	    }
	    var z = this.z;
	    z.set(y[0]/this.a, y[2]/this.a);
	    if (y[2] < 0 && this.plate)
		z.b = -z.b;
	    if (getPot) {
		z.arcsin();
		result[0] = (this.plate) ? z.b*.6*this.a : -z.a*.6;
		return;
	    }
	    // here we calculate ((1-(z/a)^2)^(-1/2))/a, which is
	    // d/dz arcsin(z/a)
	    z.square();
	    z.mult(-1);
	    z.add(1);
	    z.pow(-.5);
	    z.mult(1/this.a);
	    if (this.plate) {
		// field = (Im dw/dz, Re dw/dz)
		result[2] = z.a * -.0007;
		result[0] = z.b * -.0007;
		if (y[2] < 0)
		    result[2] = -result[2];
	    } else {
		// field = (Re dw/dz, -Im dw/dz)
		result[0] = z.a * .0007;
		result[2] = -z.b * .0007;
	    }
	    result[1] = 0;
	}
	render() {
	    drawPlane(this.a, 1, 0);
	}
	setup() {
	    setupBar(0, "Plate Size", 60);
	    setXZView();
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
	    if (y[2] >= -.01 && y[2] <= .01 &&
		(y[0] >= -this.a && y[0] <= this.a))
		boundCheck = true;
	    var a1 = -this.a-y[0];
	    var a2 =  this.a-y[0];
	    var y2 = y[2]*y[2];
	    if (y2 == 0)
		y2 = 1e-8;
	    if (getPot) {
		result[0] = this.getPot(a1, a2, y[2]);
		return;
	    }
	    var q = .0003/this.a;
	    result[0] = .5*q*
	        Math.log((y2+a2*a2)/(y2+a1*a1));
	    result[1] = 0;
	    result[2] = q*
		(Math.atan(a1/y[2])-
		 Math.atan(a2/y[2]));
	}
	createNext() { return new ChargedPlatePair(); }
    };

    class ChargedPlatePair extends ChargedPlate {
	getName() { return "charged plate pair"; }
	useRungeKutta() { return false; }
        getInfo() {
	    var sep = auxBarValue(2)/100.;
            return "Separation: " + round(sep*2) + " m<br>" + super.getInfo();
        }
	getField(result, y) {
	    var sep = auxBarValue(2)/100.;
	    if ((y[2] >= -.01+sep && y[2] <= .01+sep ||
		 y[2] >= -.01-sep && y[2] <= .01-sep) &&
		y[0] >= -this.a && y[0] <= this.a)
		boundCheck = true;
	    var a1 = -this.a-y[0];
	    var a2 =  this.a-y[0];
	    var y1 = y[2]-sep;
	    var y12 = y1*y1;
	    if (y12 == 0)
		y12 = 1e-8;
	    var y2 = y[2]+sep;
	    var y22 = y2*y2;
	    if (y22 == 0)
		y22 = 1e-8;
	    if (getPot) {
		result[0] = this.getPot(a1, a2, y1)- this.getPot(a1, a2, y2);
		return;
	    }

	    var q = .0003/this.a;
	    result[0] = .5*q*
	        (Math.log((y12+a2*a2)/(y12+a1*a1)) -
		 Math.log((y22+a2*a2)/(y22+a1*a1)));
	    result[1] = 0;
	    result[2] = q*
		(Math.atan(a1/y1)
		-Math.atan(a2/y1)
		-Math.atan(a1/y2)
		+Math.atan(a2/y2));
	}
	setup() {
	    setupBar(0, "Sheet Size", 30);
	    setupBar(1, "Sheet Separation", 33);
	    setXZViewExact();
	}
	checkBounds(y, oldY) {
	    var size = auxBarValue(1)/100.;
	    var sep = auxBarValue(2)/100.;
	    // check to see if particle has passed through one of plates
	    if (y[0] >= -size && y[0] <= size) {
		if (y[2] > sep) {
		    if (oldY[2] < sep)
			return true;
		} else if (y[2] < -sep) {
		    if (oldY[2] > -sep)
			return true;
		} else if (oldY[2] > sep || oldY[2] < -sep)
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
	createNext() { return new InfiniteChargedPlane(); }
    };

    class InfiniteChargedPlane extends VecFunction {
	getName() { return "infinite plane"; }
	getBestSlice() { return SLICE_Y; }
	getField(result, y) {
	    var alpha = .0003;
	    if (y[2] > -.01 && y[2] < .01)
		boundCheck = true;
	    if (getPot) {
		result[0] = Math.abs(y[2])-1;
		return;
	    }
	    result[0] = 0;
	    result[1] = 0;
	    result[2] = (y[2] < 0) ? alpha : -alpha;
	}
	setup() {
	    setXZView();
	}
	render() {
	    drawPlane(1, 1, 0);
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new SphereAndPointCharge(); }
    };
    
    class SphereAndPointCharge extends InverseSquaredRadial {
	getName() { return "conducting sphere + pt"; }
	getSphereRadius() { return Math.max((auxBarValue(1))/110., .1); }
	getSeparation() { return auxBarValue(2)/100.; }
	getSpherePos() { return this.getSeparation()/2; }
	getPointPos() { return -this.getSeparation()/2-this.getSphereRadius(); }
	getBestSlice() { return SLICE_Y; }
        getInfo() { return "Sphere radius: " + round(this.getSphereRadius()) + " m<br>" +
                           "Sphere pos: (" + round(this.getSpherePos()) + ", 0, 0)<br>" +
                           "Point pos: (" + round(this.getPointPos()) + ", 0, 0)<br>" +
                           "Separation: " + round(this.getSeparation()) + " m<br>" +
                           this.chargeInfo() + super.getInfo(); }
        chargeInfo() { return "Sphere potential: " + round(auxBarValue(3)-50)*reverse*2 + " V<br>"; }
	setup() {
	    setupBar(0, "Sphere Size", 30);
	    setupBar(1, "Separation", 50);
	    setupBar(2, "Sphere Potential", 50);
	    setXZView();
            this.image = 1;
	}
        getSphereCharge() { return (auxBarValue(3)-50)*2*this.getSphereRadius(); }
	getField(result, y) {
	    var q = -coulombKQ;
	    var a = this.getSphereRadius();
	    var b = this.getSeparation() + a;
	    var spos = this.getSpherePos();
	    var imageQ = -this.image*q*a/b;
	    var imagePos = spos - a*a/b;

	    // first charge at center of sphere
	    var x1 = y[0]-spos;
	    var r1 = distance(x1, y[1], y[2]);
	    var sq = this.getSphereCharge();
	    if (r1 < a) {
		boundCheck = true;
                if (this.image == 1) {
		  result[0] = (getPot) ? sq/a : 0;
                  result[1] = result[2] = 0;
                  return;
                }
            }

	    // second charge at image position
	    var x2 = y[0]-imagePos;
	    var r2 = distance(x2, y[1], y[2]);

	    // third charge at point
	    var x3 = y[0]-this.getPointPos();
	    var r3 = distance(x3, y[1], y[2]);
	    if (r3 < chargeSize)
		boundCheck = true;

	    if (getPot) {
		result[0] = (sq/r1 + imageQ/r2 + q/r3);
		return;
	    }
	    var a1 = sq/(r1*r1*r1);
	    var a2 = imageQ/(r2*r2*r2);
	    var a3 = q/(r3*r3*r3);
	    result[0] = x1*a1 + x2*a2 + x3*a3;
	    result[1] = y[1]*(a1+a2+a3);
	    result[2] = y[2]*(a1+a2+a3);
	}
	render() {
	    drawCharge(this.getPointPos(), 0, 0);
	    drawSphere([this.getSpherePos(), 0, 0], this.getSphereRadius(), darkYellow);
	}
	createNext() { return new ChargedSphereAndPointCharge(); }
    };

    class ChargedSphereAndPointCharge extends SphereAndPointCharge {
	getName() { return "charged sphere + pt"; }
        setup() {
          super.setup();
          this.image = 0;
          setupBar(2, "Sphere Charge", 50);
        }
        chargeInfo() { return "Sphere charge: " + round(reverse*this.getSphereCharge()/coulombKQ) + " nC<br>"; }
        getSphereCharge() { return (auxBarValue(3)-50)*coulombKQ*.06; }
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
	    setXYView();
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
                result[0] = (getPot) ? cpot : 0;
                result[1] = result[2] = 0;
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
	    if (getPot) {
		result[0] =  (cq*Math.log(r1+1e-20)
			      +q*Math.log(r2+1e-20)
			      -q*Math.log(r3+1e-20));
		return;
	    }
	    var a1 = -cq/(r1*r1);
	    var a2 = -q/(r2*r2);
	    var a3 = q/(r3*r3);
	    result[0] = x1*a1 + x2*a2 + x3*a3;
	    result[1] = y[1]*(a1+a2+a3);
	    result[2] = 0;
	}
	render(g) {
	    drawCylinder([this.getCylPos(), 0, 0], this.getCylRadius(), darkYellow);
	    drawLine([this.getPointPos(), 0, -1], [this.getPointPos(), 0, +1], darkYellow);
	}
	createNext() { return new SphereInField(); }
    };

    class SphereInField extends VecFunction {
	constructor() { super(); this.conducting = true; this.showD = false; }
	getName() { return "conducting sphere in field"; }
	getBestSlice() { return SLICE_Y; }
	getField(result, y) {
	    // marion p74
	    var a = auxBarValue(1)/100.;
	    var a3 = a*a*a;
	    var r = distance(y);
	    var e1 = auxBarValue(2)/10. + 1;
	    var dimult = (this.conducting) ? 1 : (e1-1)/(e1+2);
	    var fmult = .0006;
	    if (r < a) {
		result[0] = result[1] = 0;
		if (this.conducting) {
		    boundCheck = true;
		    result[0] = result[1] = result[2] = 0;
		} else {
		    if (getPot)
			result[0] = -(1-dimult)*y[2];
		    else
			result[2] = (this.showD) ? e1*fmult*(1-dimult) :
			                      fmult*(1-dimult);
		}
		return;
	    }
	    var costh = y[2]/r;
	    var sinth = Math.sqrt(1-costh*costh);
	    var cosph = y[0]/(r*sinth);
	    var sinph = y[1]/(r*sinth);
	    var r_3 = 1/(r*r*r);
	    if (getPot) {
		result[0] = -(1-dimult*a3*r_3)*y[2];
		return;
	    }
	    var er  = (1+dimult*2*a3*r_3)*costh*fmult;
	    var eth = -(1-dimult*a3*r_3)*sinth*fmult;
	    er /= r;
	    result[0] = y[0]*er + eth*costh*cosph;
	    result[1] = y[1]*er + eth*costh*sinph;
	    result[2] = y[2]*er - eth*sinth;
	}
	setup() {
	    setupBar(0, "Sphere Size", 60);
	    setXZViewExact();
	}
        getInfo() { 
            if (this.conducting) return "";
	    var e1 = auxBarValue(2)/10. + 1;
            return "&epsilon;<sub>r</sub> = " + round(e1) + "<br>";
        }
	render() {
	    var a = auxBarValue(1)/100.;
	    drawSphere([0, 0, 0], a, darkYellow);
	}
	createNext() { return new DielectricSphereInFieldE(); }
    };
    class DielectricSphereInFieldE extends SphereInField {
	constructor() { super(); this.conducting = false; this.showD = false; }
	getName() { return "dielectric sphere in field, E"; }
	setup() {
	    setupBar(0, "Sphere Size", 60);
	    setupBar(1, "Dielectric Strength", 60);
	    setXZViewExact();
	}
	render() {
	    var a = auxBarValue(1)/100.;
	    //drawSphere([0, 0, 0], a);
	    drawWireframeSphere([0, 0, 0], a);
	}
	noSplitFieldVectors() { return false; }
	createNext() { return new DielectricSphereInFieldD(); }
    };
    class DielectricSphereInFieldD extends DielectricSphereInFieldE {
	constructor() { super(); this.conducting = false; this.showD = true; }
	getName() { return "dielectric sphere in field, D"; }
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
		else if (getPot)
		    result[0] = -(1-dimult)*y[0];
		else
		    result[0] = (this.showD) ? e1*fmult*(1-dimult) :
		        fmult*(1-dimult);
		return;
	    }
	    var costh = y[0]/r;
	    var sinth = y[1]/r;
	    var r_2 = 1/(r*r);
	    if (getPot) {
		result[0] = -(1-dimult*a2*r_2)*y[0];
		return;
	    }
	    var er  = (1+dimult*a2*r_2)*costh*fmult;
	    var eth = -(1-dimult*a2*r_2)*sinth*fmult;
	    er /= r;
	    result[0] = y[0]*er - eth*sinth;
	    result[1] = y[1]*er + eth*costh;
	    result[2] = 0;
	}
        getInfo() { 
            if (this.conducting) return "";
	    var e1 = auxBarValue(2)/10. + 1;
            return "&epsilon;<sub>r</sub> = " + round(e1) + "<br>";
        }
	setup() {
	    setupBar(0, "Cylinder Size", 40);
	    setXYView();
	}
	render(g) {
	    drawCylinder([0, 0, 0], this.a, darkYellow);
	}
	createNext() { return new DielectricCylinderInFieldE(); }
    };

    class DielectricCylinderInFieldE extends CylinderInField {
	constructor() { super(); this.conducting = false; this.showD = false; }
	getName() { return "dielectric cyl in field, E"; }
	setup() {
	    setupBar(0, "Cylinder Size", 40);
	    setupBar(1, "Dielectric Strength", 60);
	    setXYView();
	}
	render() {
	    drawWireframeCylinder([0, 0, 0], this.a);
	}
	noSplitFieldVectors() { return false; }
	createNext() { return new DielectricCylinderInFieldD(); }
    };
    class DielectricCylinderInFieldD extends DielectricCylinderInFieldE {
	constructor() { super(); this.conducting = false; this.showD = true; }
	getName() { return "dielectric cyl in field, D"; }
	createNext() { return new DielectricBoundaryE(); }
    };

    class DielectricBoundaryE extends InverseSquaredRadial {
	constructor() { super(); this.conducting = false; this.showD = false; this.planeZ = 0; }
	getBestSlice() { return SLICE_Y; }
	getName() { return "dielectric boundary E"; }
	setup() {
	    setupBar(0, "Charge Location", 60);
	    if (!this.conducting)
		setupBar(1, "Dielectric Strength", 60);
	    setViewMatrix(0, pi/40-pi/2);
	}
	render(g) {
	    drawPlane(1, 1, this.planeZ);
	    var cx = auxBarValue(1)/50.-1.001;
	    drawCharge(0, 0, cx);
	}
	getField(result, y) {
	    var cx = auxBarValue(1)/50.-1.001;
	    var r1 = distance(y[0], y[1], y[2]-cx);
	    if (r1 < chargeSize)
		boundCheck = true;
	    var eps1 = 1;
	    var eps2 = auxBarValue(2)/10. + 1;
	    if (this.conducting)
		eps2 = 1e8;
	    if (cx < this.planeZ) {
		eps1 = eps2;
		eps2 = 1;
	    }
	    var q1 = coulombKQ;
	    var q2 = -(eps2-eps1)/(eps2+eps1)*q1;
	    var ep = eps1;
	    if (cx > this.planeZ && y[2] < this.planeZ || cx < this.planeZ && y[2] > this.planeZ) {
		q1 = 2*eps2*q1/(eps2+eps1);
		q2 = 0;
		ep = eps2;
	    }
	    var r2 = distance(y[0], y[1], y[2]-this.planeZ*2+cx);
	    if (getPot) {
		result[0] = -(q1/(r1*ep) + q2/(r2*ep));
		return;
	    }
	    if (!this.showD) {
		q1 /= ep;
		q2 /= ep;
	    }
	    var rq1 = q1/(r1*r1*r1);
	    var rq2 = q2/(r2*r2*r2);
	    result[0] = -y[0]*(rq1+rq2);
	    result[1] = -y[1]*(rq1+rq2);
	    result[2] = -(y[2]-cx)*rq1-(y[2]-this.planeZ*2+cx)*rq2;
	}
        getInfo() { 
	    var e1 = auxBarValue(2)/10. + 1;
	    var cx = auxBarValue(1)/50.-1.001;
            var s = "&epsilon;<sub>r</sub> = " + round(e1) + " below, 1 above<br>"
            if (this.conducting) s = "";
            s += round(Math.abs(cx-this.planeZ));
            s += (this.conducting) ? " m above plane<br>" :
                 (cx > this.planeZ) ? " m above boundary<br>" : " m below boundary<br>";
            return s + super.getInfo();
        }
	createNext() { return new DielectricBoundaryD(); }
    };
    class DielectricBoundaryD extends DielectricBoundaryE {
	constructor() { super(); this.conducting = false; this.showD = true; }
	getName() { return "dielectric boundary D"; }
	createNext() { return new ConductingPlane(); }
    };
    class ConductingPlane extends DielectricBoundaryE {
	constructor() { super(); this.conducting = true; this.showD = false; this.planeZ = -1; }
	getName() { return "conducting plane + pt"; }
	createNext() { return new FastChargeEField(); }
    };

    class CurrentLoopField extends VecFunction {
	constructor() { super(); this.useColor = true; }
	getName() { return "current loop"; }
	useAdaptiveRungeKutta() { return false; }
	setup() {
	    setXZView();
	    setupBar(0, "Loop Size", 40);
	}
	setupFrame() {
	    this.size = (auxBarValue(1)+1)/100.;
	}
	getField(result, y) {
	    this.getLoopField(result, y, 0, 0, 1, this.size);
	}
	getLoopField(result, y, xoff, zoff, dir, size) {
	    var xx = y[0]-xoff;
	    var yy = y[1];
	    var zz = y[2]-zoff;
	    var i;
	    result[0] = result[1] = result[2] = 0;
	    var ct = 8;
	    var q = .0006*dir/(this.size*ct);
	    var ang0 = Math.atan2(y[1], y[0]);
	    for (i = 0; i != ct; i ++) {
		var ang = pi*2*i/ct;
		var jxx = this.size*Math.cos(ang+ang0);
		var jyy = this.size*Math.sin(ang+ang0);
		var lxx = -jyy*q;
		var lyy =  jxx*q;
		var rx = xx-jxx;
		var ry = yy-jyy;
		var rz = zz;
		var r = Math.sqrt(rx*rx+ry*ry+rz*rz);
		if (!showA) {
		    var r3 = r*r*r;
		    if (r < .04 && useMagnetMove())
			boundCheck = true;

		    // dl x R = (lxx, lyy, 0) X R
		    //        = (lyy*rz, -lxx*rz, lxx*ry-lyy*rx)
		    // we are integrating by dl x Rhat/r^2, so we rewrite
		    // that as dl x R / r^3.
		    var cx = lyy*rz/r3;
		    var cy = -lxx*rz/r3;
		    var cz = (lxx*ry - lyy*rx)/r3;
		    result[0] += cx;
		    result[1] += cy;
		    result[2] += cz;
		} else {
		    // dl /r = lxx 
		    result[0] += 6*lxx/r;
		    result[1] += 6*lyy/r;
		}
	    }
	}
	checkBounds(y, oldY) {
	    if (!useMagnetMove())
		return false;
	    if ((y[2] > 0 && oldY[2] < 0) ||
		(y[2] < 0 && oldY[2] > 0)) {
		var r = Math.sqrt(y[0]*y[0]+y[1]*y[1]);
		if (r < this.size)
		    return true;
	    }
	    return false;
	}

	render() {
	    drawCurrentRing(0, 0, 1, this.size);
	}

	noSplitFieldVectors() { return false; }
	nonGradient() { return true; }
	createNext() { return BUILD_CASE_EMV(null, new CurrentLoopsSideField(), null); }
    };

    class ChargedRing extends CurrentLoopField {
	constructor() { super(); this.useColor = false; }
	getName() { return "charged ring"; }
	getBestSlice() { return SLICE_Y; }
	getField(result, y) {
	    this.getLoopField(result, y, 0);
	}
	getLoopField(result, y, zoff) {
	    var xx = y[0];
	    var yy = y[1];
	    var zz = y[2]+zoff;
	    var i;
	    result[0] = result[1] = result[2] = 0;
	    var size = auxBarValue(1)/100.;
	    var ct = 8;
	    var q = (getPot) ? .2/ct : -.0006/ct;
	    var ang0 = Math.atan2(y[1], y[0]);
	    for (i = 0; i != ct; i++) {
		var ang = pi*2*i/ct;
		var jxx = size*Math.cos(ang+ang0);
		var jyy = size*Math.sin(ang+ang0);
		var rx = xx-jxx;
		var ry = yy-jyy;
		var rz = zz;
		var r = Math.sqrt(rx*rx+ry*ry+rz*rz);
		if (r < .06)
		    boundCheck = true;
		var r3 = r*r*r;
		if (getPot) {
		    result[0] += -q/r;
		} else {
		    result[0] += q*rx/r3;
		    result[1] += q*ry/r3;
		    result[2] += q*rz/r3;
		}
	    }
	}
	render() {
	    drawRing(0, 0, this.size);
	}
	setup() {
	    setupBar(0, "Ring Size", 40);
	    setXZView();
	}
	nonGradient() { return false; }
	createNext() { return new ChargedRingPair(); }
    };
    class ChargedRingPair extends ChargedRing {
	getName() { return "charged ring pair"; }
	constructor() {
	    super();
	    this.tres1 = [];
	    this.tres2 = [];
	    this.r2 = 1;
	}
	setupFrame() {
	    this.sep = auxBarValue(2)/100.;
	}
	getField(result, y) {
	    this.getLoopField(this.tres1, y, -this.sep);
	    this.getLoopField(this.tres2, y, this.sep);
	    var i;
	    for (i = 0; i != 3; i++)
		result[i] = this.tres1[i] + this.r2*this.tres2[i];
	}
	render(g) {
	    var size = auxBarValue(1)/100.;
	    drawRing(0, -this.sep, size);
	    drawRing(0,  this.sep, size);
	}
	setup() {
	    setupBar(0, "Ring Size", 40);
	    setupBar(1, "Ring Separation", 40);
	    setXZView();
	}
	createNext() { return new ChargedRingDipole(); }
    };
    class ChargedRingDipole extends ChargedRingPair {
	getName() { return "charged ring dipole"; }
	constructor() {
	    super();
	    this.r2 = -1;
	}
	createNext() { return new SlottedPlane(); }
    }
    class SlottedPlane extends VecFunction {
	getName() { return "slotted conducting plane"; }
	constructor() {
	    super();
	    this.z = new Complex();
	    this.z2 = new Complex();
	}
	getField(result, y) {
	    // W = -.5E (z +- (z^2-a^2)^1/2)
	    // dw/dz = -.5E (1 +- z/(z^2-a^2)^1/2)
	    // Smythe p92
	    var a = (auxBarValue(1)+1)/101.;
	    if (y[2] >= -.01 && y[2] <= .01 &&
		(y[0] < -a || y[0] > a))
		boundCheck = true;
	    var z = this.z;
	    var z2 = this.z2;
	    z.set(y[0], y[2]);
	    z2.set(z);
	    z2.square();
	    z2.add(-a*a);
	    if (getPot) {
		z2.pow(.5);
		if (z2.b < 0)
		    z2.mult(-1);
		z2.add(z.a, z.b);
		result[0] = -z2.b*.6;
		return;
	    }
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
	    result[2] = (1+z2.a) * .003;
	    result[0] = (z2.b) * .003;
	    result[1] = 0;
	}
	setup() {
	    setupBar(0, "Slot Size", 60);
	    setXZView();
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
	    setXZView();
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
	    setXYViewExact();
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
	createNext() { return new InverseRotationalDouble(); }
    };
    class InverseRotationalDouble extends InverseRadialDouble {
	constructor() { super(); this.dir2 = 1; this.ext = false; }
	getName() { return BUILD_CASE_EMV(null, "current line double", "1/r rotational double"); }
        getFieldMult() { return showA ? .001/2 : .0001/2; }
        getInfo() {
          var sep = auxBarValue(1)/100.;
          return "Current = " + (this.sign == 1 ? "" : "&plusmn;") + "10 A<br>Separation = " + round(sep*2) + " m<br>";
        }
	getField(result, y) {
	    var sep = auxBarValue(1)/100.;
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
	    setXYViewExact();
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
	    var th = auxBarValue(1) * pi /50.;
	    var ph = auxBarValue(2) * pi /50.;
	    getDirectionField(result, y, th, ph);
	}

        getFieldMult() { return .0003; }

	setup() {
	    setupBar(0, "Theta", 25);
	    setupBar(1, "Phi", 0);
	    setXYView();
	}
	createNext() { return BUILD_CASE_EMV(null, new MovingChargeField(), new InverseSquaredRadialSphere()); }
    };

    function getDirectionField(result, y, th, ph) {
	var sinth = Math.sin(th);
	var costh = Math.cos(th);
	var sinph = Math.sin(ph);
	var cosph = Math.cos(ph);
	if (!showA) {
	    if (getPot) {
		result[0] = -.4*(y[0]*sinth*cosph + y[1]*sinth*sinph + y[2]*costh);
		return;
	    }
	    result[0] = sinth*cosph;
	    result[1] = sinth*sinph;
	    result[2] = costh;
	} else {
	    // The A for this field is a linear rotation around
	    // an axis pointing in the direction of the field.
	    // First calculate the axis.
	    var axis = [];
	    axis[0] = sinth*cosph;
	    axis[1] = sinth*sinph;
	    axis[2] = costh;
	    // now project the point we are looking at onto the axis
	    var d = vec3.dot(axis, y);
	    // subtract out this projection so we can get the vector
	    // from the point to the axis
	    var r = [];
	    var i;
	    for (i = 0; i != 3; i++)
		r[i] = (y[i] - axis[i]*d);
	    // cross this vector with the axis vector to get the result
	    vec3.cross(result, axis, r);
	}
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
	setup() {
	    setXZView();
	}
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

    class FastChargeField extends MovingChargeField {
	getName() { return "fast charge"; } // B field
        getInfo() {
	   var beta = (auxBarValue(1)+1)/102.;
           return "Charge = 1 &mu;C<br>Speed: " + round(beta) + " c<br>";
        }
        getFieldMult() { return 5e-5; }
	getFieldStrength(y) {
	    var r = distance(y);
	    if (r < chargeSize)
		boundCheck = true;
	    var rz = distance(y[0], y[1]);
	    // sine of angle between particle vector and direction of motion
	    var sinth = rz/r;
	    var beta = (auxBarValue(1)+1)/102.;
	    // field = mu0 q |(v X R)|(1-beta^2)/4pi(R^3)(1-beta^2 sin^2 th)^(3/2)
	    //       = mu0 q c beta R sin th (1-beta^2)/4pi(R^3)(1-beta^2 sin^2 th)^(3/2)
	    //       = mu0 q c beta rz (1-beta^2)/4pi(R^3)(1-beta^2 sin^2 th)^(3/2)
            // which is a rotation around the z axis by:
	    //       = mu0 q c beta (1-beta^2)/4pi(R^3)(1-beta^2 sin^2 th)^(3/2)
	    var b = 1e-7*3e8*beta*(1-beta*beta)/(r*r*r*Math.pow(1-beta*beta*sinth*sinth, 1.5));
	    return b;
	}
	setup() {
	    super.setup();
	    setupBar(0, "Speed/C", 90);
	}
	render(g) {
	    // the charge is always going in the same direction,
	    // regardless of reverse
	    drawCharge(0, 0, 0, reverse);
	}
	getField(result, y) {
	    if (showA) {
		var r = distance(y);
		var rz = distance(y[0], y[1]);
		// sine of angle between particle vector and direction of motion
		var sinth = rz/r;
		var beta = (auxBarValue(1)+1)/102.;
		result[0] = result[1] = 0;
		result[2] = 10*beta/(r*Math.pow(1-beta*beta*sinth*sinth, .5));
	    } else
		rotateParticle(result, y, this.getFieldStrength(y));
	}
	createNext() { return new MovingChargeFieldDouble(); }
    };

    class MovingChargeFieldDouble extends InverseSquaredRadialDouble {
	getName() { return "moving charge double"; }
        getInfo() { return "Charges = 10 C<br>Speed: 5 m/s<br>"; }
	constructor() { super(); this.dir2 = 1; }
	getField(result, y) {
	    result[0] = result[1] = result[2] = 0;
	    var sep = auxBarValue(1)/100.;
	    var rz1 = distance(y[0] - sep, y[1], y[2]);
	    var rz2 = distance(y[0] + sep, y[1], y[2]);
	    if (showA) {
		result[0] = result[1] = 0;
		result[2] = 5*(1/rz1 + this.dir2/rz2);
	    } else {
		var r = distance(y[0] - sep, y[1]);
		if (rz1 < chargeSize)
		    boundCheck = true;
		rotateParticleAdd(result, y, 5/(rz1*rz1*rz1),  sep, 0);
		if (rz2 < chargeSize)
		    boundCheck = true;
		r = distance(y[0] + sep, y[1]);
		rotateParticleAdd(result, y, this.dir2*5/(rz2*rz2*rz2), -sep, 0);
	    }
	}
	setup() {
	    setupBar(0, "Charge Separation", 30);
	    super.setup();
	}
	render() {
	    var sep = auxBarValue(1)/100.;
	    drawCharge(+sep, 0, 0, 1);
	    drawCharge(-sep, 0, 0, this.dir2);
	}
	nonGradient() { return true; }
	createNext() { return new MovingChargeDipole(); }
    };
    class MovingChargeDipole extends MovingChargeFieldDouble {
	constructor() { super(); this.dir2 = -1; }
	getName() { return "moving charge dipole"; }
	createNext() { return new CurrentLoopField(); }
    };

    class CurrentLoopsSideField extends CurrentLoopField {
	getName() { return "loop pair"; }
	constructor() {
	    super();
	    this.tres1 = [];
	    this.tres2 = [];
	}
	setup() {
	    setXZView();
	    setupBar(0, "Loop Size", 40);
	    setupBar(1, "Loop Separation", 10);
	    setupBar(2, "Offset", 0);
	}
	setupFrame() {
	    this.size = (auxBarValue(1)+1)/100.;
	    var sep = auxBarValue(2)/100.;
	    var sep2 = auxBarValue(3)/100.;
	    this.offx = sep*(1-this.size)+this.size; this.offz = sep2;
	    this.dir2 = 1;
	}
	getField(result, y) {
	    this.getLoopField(this.tres1, y, +this.offx, +this.offz, 1,    this.size);
	    this.getLoopField(this.tres2, y, -this.offx, -this.offz, this.dir2, this.size);
	    var i;
	    for (i = 0; i != 3; i++)
		result[i] = this.tres1[i] + this.tres2[i];
	}
	render(g) {
	    drawCurrentRing(+this.offx, +this.offz,  1,   this.size);
	    drawCurrentRing(-this.offx, -this.offz, this.dir2, this.size);
	}
	checkBounds(y, oldY) {
	    if (!useMagnetMove())
		return false;
	    if ((y[2] > this.offz && oldY[2] < this.offz) ||
		(y[2] < this.offz && oldY[2] > this.offz)) {
		var x = y[0]-this.offx;
		var r = Math.sqrt(x*x+y[1]*y[1]);
		if (r < this.size)
		    return true;
	    }
	    if ((y[2] > -this.offz && oldY[2] < -this.offz) ||
		(y[2] < -this.offz && oldY[2] > -this.offz)) {
		var x = y[0]+this.offx;
		var r = Math.sqrt(x*x+y[1]*y[1]);
		if (r < this.size)
		    return true;
	    }
	    return false;
	}
	createNext() { return new CurrentLoopsSideOppField(); }
    };
    class CurrentLoopsSideOppField extends CurrentLoopsSideField {
	getName() { return "loop pair opposing"; }
	setupFrame() {
	    this.size = (auxBarValue(1)+1)/100.;
	    var sep = auxBarValue(2)/100.;
	    var sep2 = auxBarValue(3)/100.;
	    this.offx = sep*(1-this.size)+this.size; this.offz = sep2;
	    this.dir2 = -1;
	}
	createNext() { return new CurrentLoopsStackedField(); }
    };
    class CurrentLoopsStackedField extends CurrentLoopsSideField {
	getName() { return "loop pair stacked"; }
	setupFrame() {
	    this.size = (auxBarValue(1)+1)/100.;
	    var sep = (auxBarValue(2)+1)/100.;
	    var sep2 = auxBarValue(3)/100.;
	    this.offx = sep2; this.offz = sep;
	    this.dir2 = 1;
	}
	createNext() { return new CurrentLoopsStackedOppField(); }
    };
    class CurrentLoopsStackedOppField extends CurrentLoopsSideField {
	getName() { return "loop pair stacked, opp."; }
	setupFrame() {
	    this.size = (auxBarValue(1)+1)/100.;
	    var sep = (auxBarValue(2)+1)/100.;
	    var sep2 = auxBarValue(3)/100.;
	    this.offx = sep2; this.offz = sep;
	    this.dir2 = -1;
	}
	createNext() { return new CurrentLoopsOpposingConcentric(); }
    };
    class CurrentLoopsOpposingConcentric extends CurrentLoopField {
	getName() { return "concentric loops"; }
	constructor() {
	    super();
	    this.tres1 = [];
	    this.tres2 = [];
	}
	setup() {
	    setXZView();
	    setupBar(0, "Outer Loop Size", 75);
	    setupBar(1, "Inner Loop Size", 50);
	}
	setupFrame() {
	    this.size = (auxBarValue(1)+1)/101.;
	    this.size2 = this.size*(auxBarValue(2)+1)/101.;
	}
	getField(result, y) {
	    this.getLoopField(this.tres1, y, 0, 0,  1, this.size);
	    this.getLoopField(this.tres2, y, 0, 0, -1, this.size2);

	    // getLoopField's result is not proportional to size^2 (as
	    // it should be) but rather to size, because that makes
	    // the field of small loops too hard to see, and because
	    // we care more about the shape of the field than its
	    // absolute magnitude.  To correct for that, we have to
	    // multiply the smaller loop's field by size2/size to
	    // ensure that the field looks correct for two concentric
	    // loops with the same current.
	    var mult = this.size2/this.size;
	    var i;
	    for (i = 0; i != 3; i++)
		result[i] = this.tres1[i] + mult*this.tres2[i];
	}
	render(g) {
	    drawCurrentRing(0, 0,  1, this.size);
	    drawCurrentRing(0, 0, -1, this.size2);
	}
	createNext() { return new SolenoidField(); }
    };
    class SolenoidField extends VecFunction {
	getName() { return "solenoid"; }
	useRungeKutta() { return false; }  // too slow!
	setupFrame() {
	    this.size = (auxBarValue(1)+1)/100.;
	    this.turns = Math.floor(auxBarValue(3)/4)+1;
	    this.height = (auxBarValue(2)+1)/25.;
	}
	getField(result, y) {
	    var i, j, n;
	    result[0] = result[1] = result[2] = 0;
	    var angct = 8; // was 10 auxBarValue(3)+1;
	    if (this.turns < 9)
		angct = Math.floor(80/this.turns);
	    var ang0 = Math.atan2(y[1], y[0]);
	    var zcoilstep = this.height/this.turns;
	    var zangstep = zcoilstep/angct;
	    var zbase = -this.height/2;
	    var q = .003/(10*angct);
	    var lzz = q*zangstep;
	    if (ang0 < 0)
		ang0 += 2*pi;
	    if (ang0 < 0)
		System.out.print("-ang0?? " + ang0 + "\n");
	    ang0 %= zangstep;
	    zbase += zcoilstep*ang0/(2*pi);
	    for (i = 0; i != angct; i++) {
		var ang = pi*2*i/angct;
		var jxx = this.size*Math.cos(ang+ang0);
		var jyy = this.size*Math.sin(ang+ang0);
		var jzz = zbase+zangstep*i;
		var lxx = -jyy*q;
		var lyy =  jxx*q;
		var rx = y[0]-jxx;
		var ry = y[1]-jyy;
		var rx2ry2 = rx*rx+ry*ry;
		for (j = 0; j < this.turns; j++) {
		    var rz = y[2]-jzz;
		    var r = Math.sqrt(rx2ry2+rz*rz);
		    if (!showA) {
			if (r < .04 && useMagnetMove())
			    boundCheck = true;
			
			// dl x R = (lxx, lyy, lzz) X R
			//        = (lyy*rz-lzz*ry, lzz*rx-lxx*rz,
			//           lxx*ry-lyy*rx)
			// we are integrating by dl x Rhat/r^2, so we rewrite
			// that as dl x R / r^3.
			var r3 = r*r*r;
			var cx = (lyy*rz-lzz*ry)/r3;
			var cy = (lzz*rx-lxx*rz)/r3;
			var cz = (lxx*ry-lyy*rx)/r3;
			result[0] += cx;
			result[1] += cy;
			result[2] += cz;
		    } else {
			result[0] += 6*lxx/r;
			result[1] += 6*lyy/r;
			result[2] += 6*lzz/r;
		    }
		    jzz += zcoilstep;
		}
	    }
	}
	setup() {
	    setupBar(0, "Diameter", 40);
	    setupBar(1, "Height", 30);
	    setupBar(2, "# of Turns", 36);
	    setXZView();
	}
	checkBounds(y, oldY) {
	    if (!useMagnetMove())
		return false;
	    var height2 = this.height*2;
	    var r  = Math.sqrt(y[0]*y[0]+y[1]*y[1]);
	    var or = Math.sqrt(oldY[0]*oldY[0]+oldY[1]*oldY[1]);
	    // going through walls?
	    if (y[2] < height2 && y[2] > -height2) {
		if ((r < this.size && or > this.size) ||
		    (or < this.size && r > this.size))
		    return true;
	    }
	    // passing through z=0 plane inside solenoid?
	    if ((y[2] > 0 && oldY[2] < 0) ||
		(y[2] < 0 && oldY[2] > 0)) {
		if (r < this.size)
		    return true;
	    }
	    return false;
	}
	render() {

  gl.useProgram(currentProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.uniform4f(currentProgramInfo.uniformLocations.color, 1, 1, 0, 1);

  var ph = (currentTime*9) % 2;
  var ph0 = ph
  var phases = [];
  var verts = [];

	    var i, j;
	    var angct = 48;
	    if (this.turns < 10)
		angct = Math.floor(480/this.turns);
	    var zcoilstep = this.height/this.turns;
	    var zangstep = zcoilstep/angct;
	    var zbase = -this.height/2;
	    for (i = 0; i != angct; i++) {
		var ang1 = pi*2*i/angct;
		var ang2 = pi*2*(i+1)/angct;
		var jxx1 = this.size*Math.cos(ang1);
		var jyy1 = this.size*Math.sin(ang1);
		var jxx2 = this.size*Math.cos(ang2);
		var jyy2 = this.size*Math.sin(ang2);
		var jzz1 = zbase + zangstep*i;
		for (j = 0; j < this.turns; j++) {
		    var jzz2 = jzz1 + zangstep;
		    verts.push(jxx1, jyy1, jzz1, jxx2, jyy2, jzz2);
		    phases.push(ph-(i+j*angct)/2, ph-(i+1+j*angct)/2);
		    jzz1 += zcoilstep;
		}
	    }

  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(phases), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.phase, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.drawArrays(gl.LINES, 0, phases.length);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);

	}
	nonGradient() { return true; }
	createNext() { return new ToroidalSolenoidField(); }
    };
    class ToroidalSolenoidField extends VecFunction {
	constructor() { super(); this.turnmult = 1; }
	getName() { return "toroidal solenoid"; }
	useRungeKutta() { return false; }

	setupFrame() {
	    this.size1 = auxBarValue(1)/100.;
	    this.size2 = auxBarValue(2)*this.size1/100.;
	    this.turns = Math.floor(auxBarValue(3)/3)+6;
	    const angct = 8;
	    this.q = .0003/(angct*20);
	    this.costab1 = [];
	    this.sintab1 = [];
	    this.costab2 = [];
	    this.sintab2 = [];
	    var i, j;
	    for (i = 0; i != angct; i++) {
		var ang = pi*2*i/angct;
		this.costab1[i] = Math.cos(ang);
		this.sintab1[i] = Math.sin(ang);
		this.costab2[i] = [];
		this.sintab2[i] = [];
		for (j = 0; j <= this.turns; j++) {
		    var ang2 = (pi*2*j+ang)/(this.turnmult*this.turns);
		    this.costab2[i][j] = Math.cos(ang2);
		    this.sintab2[i][j] = Math.sin(ang2);
		}
	    }
	}
	finishFrame() {
	    this.costab1 = this.sintab1 = null;
	    this.costab2 = this.sintab2 = null;
	}

	setup() {
	    setupBar(0, "Center Radius", 60);
	    setupBar(1, "Outer Radius", 80);
	    setupBar(2, "# of turns", 18);
	}

	getField(result, y) {
	    var i, j, n;
	    result[0] = result[1] = result[2] = 0;
	    const angct = 8;
            var q = this.q;
	    for (i = 0; i != angct; i++) {
		var cosp = this.costab1[i];
		var sinp = this.sintab1[i];
		var jzz = this.size2*sinp;
		var lzz = q*this.turns*this.size2*cosp;
		var rz = y[2]-jzz;
		for (j = 0; j <= this.turns; j++) {
		    var cosa = this.costab2[i][j];
		    var sina = this.sintab2[i][j];
		    var jxx = cosa*(this.size1+this.size2*cosp);
		    var jyy = sina*(this.size1+this.size2*cosp);
		    var lxx = q*
			(-(this.size1+this.size2*cosp)*sina - this.turns*this.size2*cosa*sinp);
		    var lyy = q*
			((this.size1+this.size2*cosp)*cosa - this.turns*this.size2*sina*sinp);
		    var rx = y[0]-jxx;
		    var ry = y[1]-jyy;
		    var r = distance(rx, ry, rz);
		    if (!showA) {
			var r3 = r*r*r;
			if (r < .04 && useMagnetMove())
			    boundCheck = true;

			// dl x R = (lxx, lyy, lzz) X R
			//        = (lyy*rz-lzz*ry, lzz*rx-lxx*rz,
			//           lxx*ry-lyy*rx)
			// we are integrating by dl x Rhat/r^2, so we rewrite
			// that as dl x R / r^3.
			var cx = (lyy*rz-lzz*ry)/r3;
			var cy = (lzz*rx-lxx*rz)/r3;
			var cz = (lxx*ry-lyy*rx)/r3;
			result[0] += cx;
			result[1] += cy;
			result[2] += cz;
		    } else {
			result[0] += 6*lxx/r;
			result[1] += 6*lyy/r;
			result[2] += 6*lzz/r;
		    }
		}
	    }
	}
	render(g) {
  gl.useProgram(currentProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.uniform4f(currentProgramInfo.uniformLocations.color, 1, 1, 0, 1);

  var ph = (currentTime*9) % 2;
  var ph0 = ph
  var phases = [];
  var verts = [];

	    var jzz, i;
	    var steps = this.turns*48;
	    for (i = 0; i != steps; i++) {
	         var angct = 48;
	         var ang = pi*2*(i % angct)/angct;
	         var cosp = Math.cos(ang);
	         var sinp = Math.sin(ang);
	         var ang2 = (pi*2*Math.floor(i/angct)+ang)/(this.turns*this.turnmult);
	         var cosa = Math.cos(ang2);
	         var sina = Math.sin(ang2);
	         verts.push(cosa*(this.size1+this.size2*cosp), sina*(this.size1+this.size2*cosp), this.size2*sinp);
                 phases.push(ph-i/2);
	    }

  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(currentProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(phases), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(currentProgramInfo.attribLocations.phase, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.drawArrays(gl.LINE_STRIP, 0, phases.length);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.phase);
  gl.disableVertexAttribArray(currentProgramInfo.attribLocations.vertexPosition);

	}
	nonGradient() { return true; }
	createNext() { return new HorseshoeElectromagnetField(); }
    };
    class HorseshoeElectromagnetField extends ToroidalSolenoidField {
	constructor() { super(); this.turnmult = 2; }
	getName() { return "horseshoe electromagnet"; }
	setup() {
	    setupBar(0, "Center Radius", 40);
	    setupBar(1, "Outer Radius", 50);
	    setupBar(2, "# of turns", 18);
	    setXYView();
	}
	createNext() { return new SquareLoopField(); }
    };
    class SquareLoopField extends VecFunction {
	getName() { return "square loop"; }

	setup() {
	    setupBar(0, "Loop Size", 60);
	    setXZView();
	}
        getInfo() {
          var sep = auxBarValue(1)/100.;
          return "Current = 10 A<br>Width = " + round(this.size*2) + " m<br>";
        }

	setupFrame() {
	    this.size = auxBarValue(1)/100.;
	    this.lstart = -this.size;
	    this.lstop  =  this.size;
	}

        getFieldMult() { return showA ? .001/2 : .0001/2; }
	getField(result, y) {
	    this.getLoopField(result, y, 0, 1);
	}

	getLineField(result, y, offo, offt, lcoord, ocoord, tcoord, dir) {
	    var a1 = this.lstart-y[lcoord];
	    var a2 = this.lstop-y[lcoord];
	    var r = distance(y[ocoord]-offo, y[tcoord]-offt);
	    if (r < lineWidth && a1 <= 0 && a2 >= 0)
		boundCheck = true;
	    var y2 = r*r;
	    var a12 = a1*a1;
	    var a22 = a2*a2;
	    var a12y2 = Math.sqrt(a12+y2);
	    var a22y2 = Math.sqrt(a22+y2);
	    if (showA) {
		if (lcoord < ocoord)
		    dir = -dir;
		result[lcoord] += dir*Math.log((a2+a22y2)/(a1+a12y2));
		return;
	    }
	    var q = dir;
	    var fth =
		q* (-1/(a12+y2+a1*a12y2)+1/(a22+y2+a2*a22y2));
	    result[tcoord] += fth*(y[ocoord]-offo);
	    result[ocoord] -= fth*(y[tcoord]-offt);
	}

	getLoopField(result, y, zoff, dir) {
	    result[0] = result[1] = result[2] = 0;
	    this.getLineField(result, y,  this.size, zoff, 0, 1, 2,  dir);
	    this.getLineField(result, y, -this.size, zoff, 0, 1, 2, -dir);
	    this.getLineField(result, y,  this.size, zoff, 1, 0, 2,  dir);
	    this.getLineField(result, y, -this.size, zoff, 1, 0, 2, -dir);
	}
	checkBounds(y, oldY) {
	    if (!useMagnetMove())
		return false;
	    if ((y[2] > 0 && oldY[2] < 0) ||
		(y[2] < 0 && oldY[2] > 0)) {
		if (y[0] < this.size  && y[1] < this.size &&
		    y[0] > -this.size && y[1] > -this.size)
		    return true;
	    }
	    return false;
	}
	render(g) {
	    drawCurrentLine([-this.size, -this.size, 0], [+this.size, -this.size, 0], 1);
	    drawCurrentLine([+this.size, -this.size, 0], [+this.size, +this.size, 0], 1);
	    drawCurrentLine([+this.size, +this.size, 0], [-this.size, +this.size, 0], 1);
	    drawCurrentLine([-this.size, +this.size, 0], [-this.size, -this.size, 0], 1);
	}
	noSplitFieldVectors() { return false; }
	nonGradient() { return true; }
	createNext() { return new RectLoopField(); }
    };
    class RectLoopField extends SquareLoopField {
	getName() { return "rectangular loop"; }

	setup() {
	    setupBar(0, "Loop Width", 60);
	    setupBar(1, "Loop Depth", 40);
	    setXZView();
	}

	setupFrame() {
	    this.sizeX = auxBarValue(1)/100.+.01;
	    this.sizeY = auxBarValue(2)/100.+.01;
	}
        getInfo() {
          var sep = auxBarValue(1)/100.;
          return "Current = 10 A<br>Size = " + round(this.sizeX*2) + " m x " + round(this.sizeY*2) + " m<br>";
        }

	getField(result, y) {
	    result[0] = result[1] = result[2] = 0;
	    this.lstart = -this.sizeX;
	    this.lstop  =  this.sizeX;
	    this.size = this.sizeY;
	    this.getLineField(result, y,  this.sizeY, 0, 0, 1, 2,  1);
	    this.getLineField(result, y, -this.sizeY, 0, 0, 1, 2, -1);
	    this.lstart = -this.sizeY;
	    this.lstop  =  this.sizeY;
	    this.size = this.sizeX;
	    this.getLineField(result, y,  this.sizeX, 0, 1, 0, 2,  1);
	    this.getLineField(result, y, -this.sizeX, 0, 1, 0, 2, -1);
	}

	checkBounds(y, oldY) {
	    if (!useMagnetMove())
		return false;
	    if ((y[2] > 0 && oldY[2] < 0) ||
		(y[2] < 0 && oldY[2] > 0)) {
		if (y[0] < this.sizeX  && y[1] < this.sizeY &&
		    y[0] > -this.sizeX && y[1] > -this.sizeY)
		    return true;
	    }
	    return false;
	}
	render(g) {
	    drawCurrentLine([-this.sizeX, -this.sizeY, 0], [+this.sizeX, -this.sizeY, 0], 1);
	    drawCurrentLine([+this.sizeX, -this.sizeY, 0], [+this.sizeX, +this.sizeY, 0], 1);
	    drawCurrentLine([+this.sizeX, +this.sizeY, 0], [-this.sizeX, +this.sizeY, 0], 1);
	    drawCurrentLine([-this.sizeX, +this.sizeY, 0], [-this.sizeX, -this.sizeY, 0], 1);
	}
	createNext() { return new CornerField(); }
    };
    class CornerField extends SquareLoopField {
	getName() { return "corner"; }
	setup() {
	    setXZView();
	    setupBar(0, "Offset", 50);
	}
        getInfo() { return "Current = 10 A<br>"; }
	setupFrame() {
	    this.size = 2;
	    this.offset = auxBarValue(1)/50.-1;
	    this.lstart = this.offset;
	    this.lstop = 10+this.offset;
	}

	getField(result, y) {
	    result[0] = result[1] = result[2] = 0;
	    this.getLineField(result, y, this.offset, 0, 0, 1, 2, -1);
	    this.getLineField(result, y, this.offset, 0, 1, 0, 2, -1);
	}
	render() {
	    drawCurrentLine([this.offset, this.offset, 0], [1, this.offset, 0], 1);
	    drawCurrentLine([this.offset, 1, 0], [this.offset, this.offset, 0], 1);
	}
	createNext() { return new MagneticSphereB(); }
    };
    class MagneticSphereB extends VecFunction {
	getName() { return "magnetic sphere"; }
	getField(result, y) {
	    var a = auxBarValue(1)/100.;
	    var r = distance(y);
	    var rz = distance(y[0], y[1]);
	    var costh = y[2]/r;
	    var sinth = rz/r;
	    var sinph = y[1]/rz;
	    var cosph = y[0]/rz;
	    if (r < a) {
		boundCheck = true;
                if (!showA) {
		  result[0] = result[1] = 0;
                  result[2] = .003;
                } else {
		  var aph = .003*a;
		  result[0] = -sinph*aph;
		  result[1] =  cosph*aph;
		  result[2] = 0;
                }
		return;
	    }
	    if (!showA) {
		// rhat  = (sinth*cosph, sinth*sinph, costh)
		// thhat = (costh*cosph, costh*sinph, -sinth)
		var r3 = .003*a*a*a/(r*r*r);
		var eth = 2*sinth*r3;
		var er  =   costh*r3;
		result[0] = sinth*cosph*er + costh*cosph*eth;
		result[1] = sinth*sinph*er + costh*sinph*eth;
		result[2] = costh      *er - sinth*      eth;
	    } else {
		// phhat = (-sinph, cosph, 0)
		var aph = .003*a*a*a*sinth/(r*r);
		result[0] = -sinph*aph;
		result[1] =  cosph*aph;
		result[2] = 0;
	    }
	}
	setup() {
	    setupBar(0, "Sphere Size", 50);
	    setXZView();
	}
	render() {
	    var a = auxBarValue(1)/100.;
	    drawSphere([0, 0, 0], a, darkYellow);
	}
	nonGradient() { return true; }
	createNext() { return new MonopoleAttempt(); }
    };
    class MonopoleAttempt extends SquareLoopField {
	getName() { return "monopole attempt"; }
	constructor() {
	    super();
	    this.tres = [];
	    this.yflip = [];
	    var i;
	    for (i = 0; i != 6; i++)
		this.tres[i] = [0, 0, 0];
	}
        getInfo() { return ""; }
	setup() {
	    setXZView();
	    setupBar(0, "Loop Size", 40);
	    setupBar(1, "Separation", 10);
	    setupBar(2, "Loop Count", 100);
	    //dispChooser.select(DISP_VECTORS);
	}
	setupFrame() {
	    super.setupFrame();
	    this.size = (auxBarValue(1))/100.;
	    this.rad = auxBarValue(2)/100. + this.size;
	    this.count = Math.floor(auxBarValue(3)*6/101) + 1;
	}
	drawLoop(pts) {
	    var i;
	    for (i = 0; i != 4; i++) {
		var j = (i + 1) & 3;
		drawCurrentLine(pts[i], pts[j], 1);
	    }
	}
	render() {
	    var size = auxBarValue(1)/100.;
	    var rad = this.rad;

	    var i;
	    var ct = this.count;
	    for (i = -1; i <= 1; i += 2) {
		if (--ct < 0)
		    break;
		this.drawLoop([[-size,   -size,   rad*i], [+size*i, -size*i, rad*i], [+size,   +size,   rad*i], [-size*i, +size*i, rad*i]]);
	    }

	    for (i = -1; i <= 1; i += 2) {
		if (--ct < 0)
		    break;
		this.drawLoop([[-size,   rad*i, -size], [-size*i, rad*i, +size*i], [+size,   rad*i, +size], [+size*i, rad*i, -size*i]]);
	    }

	    for (i = -1; i <= 1; i += 2) {
		if (--ct < 0)
		    break;
		this.drawLoop([[rad*i, -size,   -size], [rad*i, +size*i, -size*i], [rad*i, +size,   +size], [rad*i, -size*i, +size*i]]);
	    }
	}
	getField(result, y) {
	    var i;
	    var tres = this.tres;
	    for (i = 0; i != 6; i++) {
		var ar = tres[i];
		ar[0] = ar[1] = ar[2] = 0;
	    }
	    var rad = this.rad;
	    this.getLoopField(tres[0], y, -rad, -1);
	    if (this.count > 1)
		this.getLoopField(tres[1], y,  rad,  1);
	    this.yflip[1] = y[0];
	    this.yflip[2] = y[1];
	    this.yflip[0] = y[2];
	    if (this.count > 2)
		this.getLoopField(tres[2], this.yflip, -rad, -1);
	    if (this.count > 3)
		this.getLoopField(tres[3], this.yflip,  rad,  1);
	    this.yflip[2] = y[0];
	    this.yflip[0] = y[1];
	    this.yflip[1] = y[2];
	    if (this.count > 4)
		this.getLoopField(tres[4], this.yflip, -rad, -1);
	    if (this.count > 5)
		this.getLoopField(tres[5], this.yflip,  rad,  1);
	    for (i = 0; i != 3; i++)
		result[i] = tres[0][i] + tres[1][i] +
		    tres[2][(i+1)%3] + tres[3][(i+1)%3] +
		    tres[4][(i+2)%3] + tres[5][(i+2)%3];
	}
	createNext() { return null; }
    };

    class InverseSquaredRadialSphere extends VecFunction {
	getName() { return "1/r^2 sphere"; }
	getSize() { return (auxBarValue(1)+1)/110.; }
	getField(result, y) {
	    var r = distance(y);
	    if (r < .01)
		boundCheck = true;
	    var a = this.getSize();
	    if (getPot) {
		result[0] = .1*((r > a) ? -1/r : -3/(2*a)+r*r/(2*a*a*a));
		return;
	    }
	    if (r < a)
		r = a;
	    var alpha = .0003/(r*r*r);
	    result[0] = -y[0]*alpha;
	    result[1] = -y[1]*alpha;
	    result[2] = -y[2]*alpha;
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
	    var q = .0003/r;
	    if (getPot) {
		result[0] = r-1;
		return;
	    }
	    result[0] = -q*y[0];
	    result[1] = -q*y[1];
	    result[2] = -q*y[2];
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
	    if (getPot) {
		result[0] = r*r-1;
		return;
	    }
	    var k = .0003;
	    result[0] = -y[0]*k;
	    result[1] = -y[1]*k;
	    result[2] = -y[2]*k;
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new ConstantToZAxis(); }
    };

    class ConstantToZAxis extends InverseRadial {
	getName() { return "constant to z axis"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	getField(result, y) {
	    var r = distance(y[0], y[1]);
	    if (r < lineWidth)
		boundCheck = true;
	    if (getPot) {
		result[0] = r-1;
		return;
	    }
	    var q = .0003/r;
	    result[0] = -y[0]*q;
	    result[1] = -y[1]*q;
	    result[2] = 0;
	}
	setup() {
	    super.setup();
	    setXYView();
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new ConstantToXYPlane(); }
    };
    class ConstantToXYPlane extends VecFunction {
	getName() { return "constant to xy plane"; }
	getField(result, y) {
	    var alpha = .0003;
	    if (y[2] > -.01 && y[2] < .01)
		boundCheck = true;
	    if (getPot) {
		result[0] = Math.abs(y[2])-1;
		return;
	    }
	    result[0] = 0;
	    result[1] = 0;
	    result[2] = (y[2] < 0) ? alpha : -alpha;
	}
	setup() {
	    setXZView();
	}
	render(g) {
	    drawPlane(1, 1, 0);
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new LinearToZAxis(); }
    };
    class LinearToZAxis extends InverseRadial {
	getName() { return "linear to z axis"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	getField(result, y) {
	    var r = distance(y[0], y[1]);
	    if (r < lineWidth)
		boundCheck = true;
	    if (getPot) {
		result[0] = r*r-1;
		return;
	    }
	    var q = .0003;
	    result[0] = -y[0]*q;
	    result[1] = -y[1]*q;
	    result[2] = 0;
	}
	setup() {
	    super.setup();
	    setXYView();
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new LinearToXYPlane(); }
    };
    class LinearToXYPlane extends ConstantToXYPlane {
	getName() { return "linear to xy plane"; }
	getField(result, y) {
	    if (getPot) {
		result[0] = y[2]*y[2]-1;
		return;
	    }
	    if (y[2] > -.01 && y[2] < .01)
		boundCheck = true;
	    var alpha = .0003;
	    result[0] = 0;
	    result[1] = 0;
	    result[2] = -alpha*y[2];
	}
	setup() {
	    setXYView();
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new LinearToYZXZPlane(); }
    };
    class LinearToYZXZPlane extends VecFunction {
	getName() { return "linear to yz, xz planes"; }
	getField(result, y) {
	    if (y[0] > -.01 && y[0] < .01)
		boundCheck = true;
	    if (y[1] > -.01 && y[1] < .01)
		boundCheck = true;
	    var alpha = .0003;
	    var r = Math.sqrt((auxBarValue(1)+1)/51.);
	    if (getPot) {
		result[0] = (y[0]*y[0]*r+y[1]*y[1]/r)-1;
		return;
	    }
	    result[0] = -alpha*r*y[0];
	    result[1] = -alpha/r*y[1];
	    result[2] = 0;
	}
	setup() {
	    setXYView();
	    setupBar(0, "X/Y Ratio", 50);
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new LinearToYZXZXYPlane(); }
    };
    class LinearToYZXZXYPlane extends VecFunction {
	getName() { return "linear to yz, xz, xy planes"; }
	getField(result, y) {
	    if (y[2] > -.01 && y[2] < .01)
		boundCheck = true;
	    var alpha = .0003;
	    var r1 = (auxBarValue(1)+1)/51.;
	    var r2 = (auxBarValue(2)+1)/51.;
	    if (getPot) {
		result[0] = (y[0]*y[0]*r1+y[1]*y[1]+y[2]*y[2]/r2)-1;
		return;
	    }
	    result[0] = -alpha*r1*y[0];
	    result[1] = -alpha   *y[1];
	    result[2] = -alpha/r2*y[2];
	}
	setup() {
	    setXYView();
	    setupBar(0, "X/Y Ratio", 50);
	    setupBar(1, "Y/Z Ratio", 50);
	}
	checkBoundsWithForce() { return false; }
	createNext() { return new InverseToXYPlane(); }
    };
    class InverseToXYPlane extends ConstantToXYPlane {
	getName() { return "inverse to xy plane"; }
	getField(result, y) {
	    if (y[2] > -.01 && y[2] < .01)
		boundCheck = true;
	    var alpha = .0003;
	    var zz = y[2];
	    if (getPot) {
		result[0] = -.01/(zz*zz);
		return;
	    }
	    if (zz == 0)
		zz = .00001;
	    result[0] = 0;
	    result[1] = 0;
	    result[2] = -alpha/zz;
	}
	setup() {
	    setXZView();
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
	setup() {
	    setXYViewExact();
	}
	getField(result, y) {
	    var q = .0003;
	    result[0] = -q*y[1];
	    result[1] =  q*y[0];
	    result[2] = 0;
	}
	nonGradient() { return true; }
	createNext() { return new LinearRotationalA(); }
    };
    class LinearRotationalA extends InverseRadial {
	getName() { return "fz=-(x^2+y^2)"; }
	setup() {
	    setXZView();
	}
        getFieldMult() { return .0003; }
	getField(result, y) {
	    result[0] = result[1] = 0;
	    result[2] = -(y[0]*y[0]+y[1]*y[1]);
	}
	nonGradient() { return true; }
	createNext() { return new ConstantRotational(); }
    };

    class ConstantRotational extends InverseRadial {
	getName() { return "constant rotational"; }
        getFieldMult() { return 1; }
        getPotMult() { return 1; }
	setup() {
	    setXYViewExact();
	}
	getField(result, y) {
	    var r = distance(y[0], y[1]);
	    rotateParticle(result, y, .0003/r);
	}
	nonGradient() { return true; }
	createNext() { return new ConstantRotationalA(); }
    };

    class ConstantRotationalA extends InverseRadial {
	getName() { return "(0,0,-r)"; }
	setup() {
	    setXZView();
	}
        getFieldMult() { return .0006; }
	getField(result, y) {
	    var r = distance(y[0], y[1]);
	    result[0] = result[1] = 0;
	    result[2] = -r;
	}
	nonGradient() { return true; }
	createNext() { return new Helical(); }
    };

    class Helical extends InverseRadial {
	getName() { return "helical"; }
	setup() {
	    setXZView();
	    setupBar(0, "Z Speed", 30);
	}
        getFieldMult() { return .0003; }
	getField(result, y) {
	    result[0] = -y[1];
	    result[1] =  y[0];
	    result[2] =  (.00001/.0003)*auxBarValue(1);
	}
	nonGradient() { return true; }
	createNext() { return new FxEqualsYField(); }
    };

    class FxEqualsYField extends VecFunction {
	getName() { return "fx=y"; }
        getFieldMult() { return .0006; }
	getField(result, y) {
	    result[2] = result[1] = 0;
	    result[0] = y[1];
	}
	setup() {
	    setXYView();
	}
	nonGradient() { return true; }
	createNext() { return new FxEqualsY2(); }
    };

    class FxEqualsY2 extends VecFunction {
	getName() { return "fx=y2"; }
        getFieldMult() { return .001; }
	getField(result, y) {
	    result[2] = result[1] = 0;
	    result[0] = y[1]*y[1];
	}
	setup() {
	    setXYView();
	}
	nonGradient() { return true; }
	createNext() { return new LinearZRotational(); }
    };

    class LinearZRotational extends VecFunction {
	getName() { return "(-yz,xz,0)"; }
	setup() {
	    setXZView();
	}
        getFieldMult() { return .001; }
	getField(result, y) {
	    var q = y[2];
	    result[0] = -q*y[1];
	    result[1] =  q*y[0];
	    result[2] = 0;
	}
	nonGradient() { return true; }
	createNext() { return new YzXz0Field(); }
    };

    class YzXz0Field extends VecFunction {
	getName() { return "(yz,xz,0)"; }
	setup() {
	    setXZView();
	}
        getFieldMult() { return .0006; }
	getField(result, y) {
	    var q = y[2];
	    result[0] = y[1];
	    result[1] = y[0];
	    result[2] = 0;
	}
	nonGradient() { return true; }
	createNext() { return new XY_2ZField(); }
    };

    class XY_2ZField extends VecFunction {
	getName() { return "(-x,-y,2z)"; }
	setup() {
	    setXZView();
	}
        getFieldMult() { return .0006; }
	getField(result, y) {
	    result[0] = y[0];
	    result[1] = y[1];
	    result[2] = -2*y[2];
	}
	nonGradient() { return true; }
	createNext() { return new XY0Field(); }
    };

    class XY0Field extends VecFunction {
	getName() { return "(-x,y,0)"; }
	setup() {
	    setXYView();
	}
        getFieldMult() { return .0006; }
	getField(result, y) {
	    result[0] = -y[0];
	    result[1] =  y[1];
	    result[2] = 0;
	}
	nonGradient() { return true; }
	createNext() { return new RotationalExpansion(); }
    };

    class RotationalExpansion extends VecFunction {
	getName() { return "(x-y,x+y,0)"; }
        getFieldMult() { return .0003; }
	getField(result, y) {
	    result[0] = (y[0]-y[1]);
	    result[1] = (y[0]+y[1]);
	    result[2] = 0;
	}
	setup() {
	    setXYView();
	}
	nonGradient() { return true; }
	createNext() { return new RotationalExpansion3D(); }
    };
    class RotationalExpansion3D extends VecFunction {
	getName() { return "(x-y,x+y,2z)"; }
        getFieldMult() { return .0003; }
	getField(result, y) {
	    result[0] = (y[0]-y[1]);
	    result[1] = (y[0]+y[1]);
	    result[2] = (y[2]*2);
	}
	setup() {
	    setXYView();
	}
	nonGradient() { return true; }
	createNext() { return new RosslerAttractor(); }
    };
    class RosslerAttractor extends VecFunction {
	getName() { return "Rossler attractor"; }
	getField(result, y) {
	    var scale = auxBarValue(2)*2+20;
	    var xx = y[0] * 24;
	    var yy = y[1] * 24;
	    var zz = (y[2]+.75) * scale;
	    var k = .00002;
	    var c = auxBarValue(1)*.1;
	    result[0] = -(yy+zz)*k;
	    result[1] = k*(xx+.2*yy);
	    result[2] = k*(.2+xx*zz-c*zz);
	}
	setup() {
	    setXZView();
	    setupBar(0, "c", 80);
	    setupBar(1, "Z Scale", 36);
	    strengthBar.value = 75;
	}
	nonGradient() { return true; }
	redistribute() { return false; }
	createNext() { return new LorenzAttractor(); }
    };
    class LorenzAttractor extends VecFunction {
	getName() { return "Lorenz attractor"; }
	setup() {
	    setXZView();
	    setupBar(0, "Scale", 24);
	}
	getField(result, y) {
	    var scale = auxBarValue(1)/2 + 23;
	    var xx = y[0] * scale;
	    var yy = y[1] * scale;
	    var zz = y[2] * scale + scale;
	    var k = .00002;
	    result[0] = (-10*xx+10*yy)*k;
	    result[1] = k*(28*xx-yy-xx*zz);
	    result[2] = k*(-(8./3.)*zz+xx*yy);
	}
	nonGradient() { return true; }
	redistribute() { return false; }
	createNext() { return new UserDefinedPotential(); }
    };
    class UserDefinedPotential extends VecFunction {
	getName() { return "user-defined potential"; }
	setup() {
	    setXZView();
	    textFields[0].value = "x*x-z*z";
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
	}
        getFieldMult() { return .0005; }
	getField(result, y) {
	    var dx = .00001;
	    var i;
	    for (i = 0; i != 3; i++)
		this.y0[i] = y[i];
	    var pot0 = this.expr.eval(this.y0);
	    if (getPot) {
		result[0] = pot0;
		return;
	    }

	    this.y0[0] += dx;
	    result[0] = (pot0-this.expr.eval(this.y0))/dx;
	    this.y0[0] = y[0];

	    this.y0[1] += dx;
	    result[1] = (pot0-this.expr.eval(this.y0))/dx;
	    this.y0[1] = y[1];
	    
	    this.y0[2] += dx;
	    result[2] = (pot0-this.expr.eval(this.y0))/dx;
	    for (i = 0; i != 3; i++)
		if (!(result[i] > -10 && result[i] < 10))
		    boundCheck = true;
	}
	createNext() { return new UserDefinedFunction(); }
    };
    class UserDefinedFunction extends VecFunction {
	getName() { return "user-defined field"; }
	setup() {
	    setXZView();
	    this.exprs = [];
	    textFields[0].value = "x";
	    textFields[1].value = "y";
	    textFields[2].value = "z";
	    document.getElementById("textFieldLabel").innerHTML = "Field Functions";
            showDiv("textFieldDiv", true);
            showDiv("textField23Div", true);
	    actionPerformed();
	}
	actionPerformed() {
	    var i;
	    parseError = false;
	    for (i = 0; i != 3; i++) {
		var ep = new ExprParser(textFields[i].value);
		this.exprs[i] = ep.parseExpression();
		if (ep.gotError())
		    parseError = true;
	    }
	}
        getFieldMult() { return .0005; }
	getField(result, y) {
	    var i;
	    for (i = 0; i != 3; i++) {
		result[i] = this.exprs[i].eval(y);
		if (!(result[i] > -10 && result[i] < 10))
		    boundCheck = true;
	    }
	}
	nonGradient() { return true; }
	createNext() { return null; }
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
	case E_Z:   return es[2];
	case E_R:   return Math.sqrt(
			      es[0]*es[0]+es[1]*es[1]+es[2]*es[2]);
	case E_SIN: return Math.sin(this.left.eval(es));
	case E_COS: return Math.cos(this.left.eval(es));
	case E_ABS: return Math.abs(this.left.eval(es));
	case E_EXP: return Math.exp(this.left.eval(es));
	case E_LOG: return Math.log(this.left.eval(es));
	case E_SQRT: return Math.sqrt(this.left.eval(es));
	case E_TAN: return Math.tan(this.left.eval(es));
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
	if (this.skip("z"))
	    return new Expr(E_Z);
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

