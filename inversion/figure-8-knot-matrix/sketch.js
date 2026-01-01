/*

A figure-8 knot tubular surface.

This sketch is based on the work of many amazing people.
 
1. Matrix rain animation is based on 
"Guest Tutorial #4 Matrix Digital Rain in p5.js" with Emily Xie
https://youtu.be/S1TQCi9axzg

2. The tubular surface is based on Noel's Borromean rings:
https://openprocessing.org/sketch/2752798
More from Noel here https://openprocessing.org/user/108630#sketches

3. The parametric curve of the figure-8 knot is based on 
the work of Henry Segerman, François Gúritaud y Saul Schleimer 
- Segerman, H. (2016). Visualizing mathematics with 3d printing. Johns Hopkins University Press.

Author Juan Carlos Ponce Campuzano
https://www.patreon.com/jcponce
01/01/2026

*/

const SCALE = 80;
const TUBE_RADIUS = 10;
const DETAIL_X = 16;
const DETAIL_Y = 300;

let tubeGeom;
let img;
let bg;
let symbolSize = 13;
let streams = [];
var fadeInterval = 1.2;

// Figure-8 knot parameters
const EPSILON = 0.16; // ε parameter
const LAMBDA = 0.25;  // λ parameter

function preload() {
  img = loadImage('3.png'); // Your texture for the figure-8 knot
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create 2D graphics for background
  bg = createGraphics(windowWidth, windowHeight);
  bg.textSize(symbolSize);
  
  noStroke();
  
  // Build the figure-8 knot tube geometry
  tubeGeom = buildTube({
    curve: figure8KnotCurve,
    tubeRadius: TUBE_RADIUS,
    detailX: DETAIL_X,
    detailY: DETAIL_Y
  });
  
  // Generate symbols for matrix rain
  generateSymbols();

   // 👇 Hide loader once everything is ready
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("hidden");
}

function draw() {
  // Update and render matrix rain background
  bg.background(0, 90); // Semi-transparent black for trail effect
  streams.forEach(function(stream) {
    stream.render();
  });
  
  // Clear 3D canvas
  clear();
  
  background(0);
  
  // Apply orbit controls for 3D view
  orbitControl(2, 2, 1);
  
  // Draw the background as a 2D plane in 3D space
  push();
  let z_plane = -500;
  translate(0, 0, z_plane);
  let camZ = (height / 2) / tan(PI / 6);
  let D = camZ - z_plane;
  let scaleF = D / camZ;
  let w_scaled = width * scaleF;
  let h_scaled = height * scaleF;
  texture(bg);
  plane(w_scaled, h_scaled);
  pop();
  
  // Lighting for the knot
  // pointLight(255, 255, 255, 500, 500, 500);
  // ambientLight(100);
  // directionalLight(255, 255, 255, 0.5, -0.5, -1);
  
  // Rotate the knot slowly
  rotateZ(frameCount * 0.003);
  rotateY(frameCount * 0.002);
  
  // Apply texture and material properties to knot
  texture(img);
  push();
  imageLight(img);
	noStroke();
	shininess(200);
	metalness(50);
	specularMaterial(250);
  
  // Draw the figure-8 knot
  model(tubeGeom);
  pop();
}

function generateSymbols() {
  let x = 0;
  for (let i = 0; i <= width / symbolSize; i++) {
    let stream = new Stream();
    stream.generateSymbols(x, random(-1000, 0));
    streams.push(stream);
    x += symbolSize * 2;
  }
}

class mSymbol {
  constructor(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.switchInterval = round(random(10, 20));
    this.first = first;
    this.opacity = opacity;
  }

  setToRandomSymbol() {
    var charType = round(random(0, 5));
    // Always set a value, not just when switchInterval condition is met
    if (charType > 1) {
      // Set it to Katakana
      this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
    } else {
      // Set it to numeric
      this.value = round(random(0, 9)).toString();
    }
  }

  rain() {
    this.y = this.y >= height ? 0 : (this.y += this.speed);
  }
}

class Stream {
  constructor() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 35));
    this.speed = random(1, 2.5);
  }

  generateSymbols(x, y) {
    let opacity = 255;
    let first = round(random(0, 4)) == 1; 
    
    for (let i = 0; i <= this.totalSymbols; i++) {
      let symbol = new mSymbol(x, y, this.speed, first, opacity);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
      opacity -= 255 / this.totalSymbols / fadeInterval;
      first = false;
    }
  }

  render() {
    this.symbols.forEach((symbol) => {
      // Ensure value exists before rendering
      if (symbol.value === undefined || symbol.value === null) {
        symbol.setToRandomSymbol();
      }
      
      // Update symbol periodically (every switchInterval frames)
      if (frameCount % symbol.switchInterval == 0) {
        symbol.setToRandomSymbol();
      }
      
      if (symbol.first) {
        bg.fill(240, 240, 240, symbol.opacity);
      } else {
        bg.fill(210, 210, 210, symbol.opacity);
      }
      bg.text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
    });
  }
}

// Figure-8 knot parametric curve function
function figure8KnotCurve(t) {
  // t should be in [0, 1], map to [0, 2π]
  const angle = t * TWO_PI;
  
  // Compute A(t) = ε sin(4t)
  const A = EPSILON * sin(4 * angle);
  
  // Compute v1, v2, v3
  const v1 = LAMBDA * sin(angle) - (1 - LAMBDA) * sin(3 * angle);
  const v2 = LAMBDA * cos(angle) + (1 - LAMBDA) * cos(3 * angle);
  const v3 = sin(2 * angle);
  
  // Compute scaling factor (1+A)/(1-A)
  const scaleFactor = (1 + A) / (1 - A);
  
  // Compute final coordinates
  const x = SCALE * scaleFactor * v1;
  const y = SCALE * scaleFactor * v2;
  const z = SCALE * scaleFactor * v3;
  
  return createVector(x, y, z);
}

// The buildTube function remains exactly the same as before
function buildTube({ curve, tubeRadius = 20, detailX = 24, detailY = 100 }) {
  // Sample centers
  const C = [];
  for (let k = 0; k < detailY; k++) C.push(curve(k / detailY));
  C.push(curve(0)); // Close the loop
  
  // Tangents
  const T = [];
  for (let k = 0; k <= detailY; k++) {
    const a = C[max(0, k - 1)];
    const b = C[min(detailY, k + 1) % (detailY + 1)];
    const tvec = p5.Vector.sub(b, a).normalize();
    T.push(tvec);
  }
  
  // Parallel transport frames (N,B)
  const N = new Array(detailY + 1);
  const B = new Array(detailY + 1);
  
  const T0 = T[0].copy();
  const up = (Math.abs(T0.y) < 0.9) ? createVector(0, 1, 0) : createVector(1, 0, 0);
  B[0] = p5.Vector.cross(T0, up).normalize();
  N[0] = p5.Vector.cross(B[0], T0).normalize();
  
  for (let k = 1; k <= detailY; k++) {
    const u = T[k - 1], v = T[k];
    const axis = p5.Vector.cross(u, v);
    const s = axis.mag();
    const c = p5.Vector.dot(u, v);
    
    if (s < 1e-6) {
      N[k] = N[k - 1].copy();
      B[k] = B[k - 1].copy();
    } else {
      const aHat = axis.copy().div(s);
      const ang = Math.atan2(s, c);
      N[k] = rotateAroundAxis(N[k - 1], aHat, ang);
      B[k] = rotateAroundAxis(B[k - 1], aHat, ang);
    }
  }
  
  return this._renderer._pInst.buildGeometry(() => {
    const ringsPos = [];
    const ringsNor = [];
    
    for (let k = 0; k <= detailY; k++) {
      const ringP = [];
      const ringN = [];
      for (let j = 0; j < detailX; j++) {
        const th = (j / detailX) * TWO_PI;
        const n = p5.Vector.add(
          p5.Vector.mult(N[k], cos(th)),
          p5.Vector.mult(B[k], sin(th))
        ).normalize();
        const p = p5.Vector.add(C[k], p5.Vector.mult(n, tubeRadius));
        ringP.push(p);
        ringN.push(n);
      }
      ringsPos.push(ringP);
      ringsNor.push(ringN);
    }
    
    beginShape(TRIANGLES);
    fill(255, 255, 255, 255);
    
    for (let k = 0; k < detailY; k++) {
      const r0p = ringsPos[k], r1p = ringsPos[(k + 1) % (detailY + 1)];
      const r0n = ringsNor[k], r1n = ringsNor[(k + 1) % (detailY + 1)];
      
      for (let j = 0; j < detailX; j++) {
        const jn = (j + 1) % detailX;
        
        normal(r0n[j].x, r0n[j].y, r0n[j].z);
        vertex(r0p[j].x, r0p[j].y, r0p[j].z);
        
        normal(r1n[j].x, r1n[j].y, r1n[j].z);
        vertex(r1p[j].x, r1p[j].y, r1p[j].z);
        
        normal(r1n[jn].x, r1n[jn].y, r1n[jn].z);
        vertex(r1p[jn].x, r1p[jn].y, r1p[jn].z);
        
        normal(r0n[j].x, r0n[j].y, r0n[j].z);
        vertex(r0p[j].x, r0p[j].y, r0p[j].z);
        
        normal(r1n[jn].x, r1n[jn].y, r1n[jn].z);
        vertex(r1p[jn].x, r1p[jn].y, r1p[jn].z);
        
        normal(r0n[jn].x, r0n[jn].y, r0n[jn].z);
        vertex(r0p[jn].x, r0p[jn].y, r0p[jn].z);
      }
    }
    endShape();
  });
}

// Rotate vector v around unit axis
function rotateAroundAxis(v, a, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  const axv = p5.Vector.cross(a, v);
  const term1 = p5.Vector.mult(v, c);
  const term2 = p5.Vector.mult(axv, s);
  const term3 = p5.Vector.mult(a, p5.Vector.dot(a, v) * (1 - c));
  return p5.Vector.add(term1, p5.Vector.add(term2, term3));
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bg = createGraphics(windowWidth, windowHeight);
  bg.textSize(symbolSize);
  streams = [];
  generateSymbols();
}