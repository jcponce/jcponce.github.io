/**
* Lean proof: The irrationality of the Square Root of 2
* Authors: Mario Carneiro, Abhimanyu Pallavi Sudhir, Jean Lo, Calle Sönne, Yury Kudryashov (2018)
* Source: https://github.com/leanprover-community/mathlib4/blob/7414889cb3a5af9f4e5ce1157fc548d43d7dcc45/Mathlib/NumberTheory/Real/Irrational.lean#L140-L142
* This version displayed in p5.js by Juan Carlos Ponce Campuzano
* 07/Oct/2026
*/

let codeLines = [];
let fontSize = 19;
let lineHeight = 30;
let margin = 70;

let scrollSpeed = 35; // frames between new lines
let frameCounter = 0;
let nextY;

// Typing state
let typingSpeed = 1; // frames per character
let typingCounter = 0;
let currentSnippet = "";
let currentIndex = 0;
let isTyping = false;
let themeColor; // Declare the color variable here

// Snippet sequence state
let snippetIndex = 0;

// Cursor
let cursorBlinkSpeed = 10;
let cursorVisible = true;
let cursorCounter = 0;
let cursorSize = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  textSize(fontSize);
  frameRate(60);

  // Initialize your theme color in one place
  themeColor = color(64, 180, 255);

  nextY = height / 2;
}

function draw() {
  background(0, 70);

  // Draw all lines
  for (let line of codeLines) {
    drawGlowingText(line.text, line.x, line.y);
  }

  // Cursor blink logic
  cursorCounter++;
  if (cursorCounter >= cursorBlinkSpeed) {
    cursorCounter = 0;
    cursorVisible = !cursorVisible;
  }

  // Start typing a new line after a pause
  frameCounter++;
  if (frameCounter >= scrollSpeed && !isTyping) {
    frameCounter = 0;
    startTyping();
  }

  // Type characters
  if (isTyping) {
    typeCharacter();
  }

  // Draw cursor
  if (cursorVisible && codeLines.length > 0) {
    drawCursor();
  }
}

// -------------------------
// Typing control
// -------------------------
function startTyping() {
  currentSnippet = leanProof[snippetIndex];
  snippetIndex = (snippetIndex + 1) % leanProof.length; // cycle through array in order
  currentIndex = 0;
  isTyping = true;

  codeLines.push({
    text: "",
    x: margin,
    y: nextY
  });
}

function typeCharacter() {
  typingCounter++;
  if (typingCounter < typingSpeed) return;
  typingCounter = 0;

  let currentLine = codeLines[codeLines.length - 1];
  currentLine.text += currentSnippet[currentIndex];
  currentIndex++;

  if (currentIndex >= currentSnippet.length) {
    isTyping = false;
    nextY += lineHeight;
    handleScroll();
  }
}

// -------------------------
// Scrolling logic
// -------------------------
function handleScroll() {
  if (nextY + lineHeight > height - margin) {
    for (let line of codeLines) {
      line.y -= lineHeight;
    }
    nextY -= lineHeight;
  }

  codeLines = codeLines.filter(
    line => line.y > margin - lineHeight
  );
}

// -------------------------
// Cursor
// -------------------------
function drawCursor() {
  let lastLine = codeLines[codeLines.length - 1];
  let cursorX = lastLine.x + textWidth(lastLine.text) + 6;
  let cursorY = lastLine.y - fontSize + 4;

  drawingContext.shadowBlur = 6;
  drawingContext.shadowColor = themeColor;

  noStroke();
  fill(themeColor);
  rect(cursorX, cursorY, cursorSize, cursorSize);

  drawingContext.shadowBlur = 0;
}

// -------------------------
// Glowing text
// -------------------------
function drawGlowingText(txt, x, y) {
  for (let i = 4; i > 0; i--) {
    fill(themeColor, 40 * i);
    text(txt, x, y);
  }
  fill(themeColor);
  text(txt, x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Clear all previous lines
  codeLines = [];

  // Reset typing state
  isTyping = false;
  currentSnippet = "";
  currentIndex = 0;
  typingCounter = 0;
  frameCounter = 0;
  snippetIndex = 0; // optional: reset sequence back to the first snippet

  // Reset cursor
  cursorCounter = 0;
  cursorVisible = true;

  // Reset starting position
  nextY = height / 2;
}