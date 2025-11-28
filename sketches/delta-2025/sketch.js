let blockFont;
let cursiveFont;

let blockText;
let blockTextSize;
let cursiveTextSize;

let greeting = 'Delta 2025';
let letters = greeting.split('');

// Start times per letter
let letterStartTimes = letters.map((letter, i) => i * 50);

let bgImg;
let fgImg;
let paperImg;
let textureMaterial;

// ------------------------------------------
// COMPUTE RESPONSIVE TEXT SIZES
// ------------------------------------------
function computeBlockTextSize() {
  return min(width, height) * 0.2;  // % of the smallest dimension
}

function computeCursiveTextSize() {
  return min(width, height) * 0.07;  // subtitle size
}

// ------------------------------------------
// REGENERATE 3D MODELS WHEN SIZE CHANGES
// ------------------------------------------
function regenerateBlockText() {
  textFont(blockFont);
  textSize(blockTextSize);

  blockText = letters.map(letter =>
    blockFont.textToModel(letter, 0, 0, {
      extrude: blockTextSize,   // scale extrusion too
      sampleFactor: 0.25,
    })
  );
}

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  blockFont = await loadFont('https://fonts.googleapis.com/css2?family=Tilt+Warp&display=swap');
  cursiveFont = await loadFont("https://fonts.googleapis.com/css2?family=Meow+Script&display=swap");

  bgImg = await loadImage('delta-uq.jpg');
  fgImg = await loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Grouse_Mountain_%288598307419%29.jpg/960px-Grouse_Mountain_%288598307419%29.jpg?20210319145510');
  paperImg = await loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Brown_paper_bag_texture.jpg/640px-Brown_paper_bag_texture.jpg');

  textAlign(CENTER, CENTER);

  // INITIAL RESPONSIVE SIZES
  blockTextSize = computeBlockTextSize();
  cursiveTextSize = computeCursiveTextSize();
  regenerateBlockText();

  // Shader
  textureMaterial = baseMaterialShader().modify(() => {
    const t = uniformFloat(() => millis());
    getWorldInputs((inputs) => {
      let size = [800, 500];
      inputs.texCoord = inputs.position.xy / size + 0.5;
      inputs.position = [
        inputs.position.x,
        inputs.position.y + 20 * sin(t * 0.001 + inputs.position.x * 0.01),
        inputs.position.z
      ]
      return inputs;
    });
  });

  describe(`An old postcard that says Greetings from... ${greeting}`);
}

function easeOutElastic(t, magnitude = 0.7) {
  const p = 1 - magnitude;
  const scaledTime = t * 2;

  if (t === 0 || t === 1) return t;

  const s = p / (2 * Math.PI) * Math.asin(1);
  return 2 ** (-10 * scaledTime)
    * Math.sin((scaledTime - s) * (2 * Math.PI) / p) + 1;
}

function draw() {
  background(255);

  // BACKGROUND
  imageMode(CENTER);
  image(bgImg, 0, 0, width, height, 0, 0, bgImg.width, bgImg.height, COVER);

  // DARK OVERLAY
  push();
  noStroke();
  fill(0, 100);
  plane(width, height);
  pop();

  clearDepth();

  // -----------------------------------------------------
  // GREETINGS TEXT (Cursive)
  // -----------------------------------------------------
  push();
  textFont(cursiveFont);
  textSize(cursiveTextSize);
  fill(255);
  textAlign(LEFT, TOP);
  text("Greetings from", -width / 2 + 40, -height / 2 + 50);
  pop();

  // -----------------------------------------------------
  // 3D BLOCK TEXT
  // -----------------------------------------------------
  push();
  translate(0, 40);
  rotateX(PI * 0.1);
  rotateY(PI * 0.1);
  noStroke();

  directionalLight(color("#FFFFFF"), 0, 0, -1);
  directionalLight(color("#FFFFFF"), -0.2, 0, -1);

  texture(fgImg);
  shader(textureMaterial);

  textSize(blockTextSize);
  textFont(blockFont);

  translate(-fontWidth(greeting) / 2, 0);

  letters.forEach((letter, i) => {
    translate(fontWidth(letter) / 2, 0);

    // MOUSE INTERACTION
    const screenCoord = worldToScreen(0, 0);
    if (dist(screenCoord.x, screenCoord.y, mouseX, mouseY) < 40) {
      letterStartTimes[i] = millis();
    }

    // ANIMATION PROGRESS
    let progress = map(millis(), letterStartTimes[i], letterStartTimes[i] + 2000, 0, 1, true);
    progress = easeOutElastic(progress);

    push();
    scale(progress);
    model(blockText[i]);
    pop();

    translate(fontWidth(letter) / 2, 0);
  });
  pop();

  // -----------------------------------------------------
  // PAPER TEXTURE OVERLAY
  // -----------------------------------------------------
  clearDepth();
  push();
  blendMode(MULTIPLY);
  tint(255, 100);
  image(
    paperImg,
    0, 0, width, height,
    0, 0, paperImg.width, paperImg.height,
    COVER
  );
  pop();
}

// -----------------------------------------------------
// SAVE HIGH-RES PNG
// -----------------------------------------------------
async function keyPressed() {
  if (key === 's') {
    const prevDensity = pixelDensity();
    pixelDensity(3);
    await redraw();
    save('sketch.png');
    pixelDensity(prevDensity);
  }
}

// -----------------------------------------------------
// MAKE THE CANVAS RESPONSIVE
// -----------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  blockTextSize = computeBlockTextSize();
  cursiveTextSize = computeCursiveTextSize();

  regenerateBlockText();  // regenerate the 3D meshes
}
