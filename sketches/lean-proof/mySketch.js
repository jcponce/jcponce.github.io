/**
 * Lean proof: The irrationality of the Square Root of 2
 * Authors: Mario Carneiro, Abhimanyu Pallavi Sudhir, Jean Lo,
 *          Calle Sönne, Yury Kudryashov (2018)
 * Source:
 * https://github.com/leanprover-community/mathlib4/blob/7414889cb3a5af9f4e5ce1157fc548d43d7dcc45/Mathlib/NumberTheory/Real/Irrational.lean#L140-L142
 *
 * This version displayed in p5.js by Juan Carlos Ponce Campuzano
 * 07/Oct/2026
 */


// ========================================================
// Display settings
// ========================================================

let fontSize;
let lineHeight;
let margin;
let cursorSize;

let themeColor;


// ========================================================
// Animation settings
// ========================================================

let scrollSpeed = 35;       // Frames between new lines
let typingSpeed = 1;        // Frames per character
let cursorBlinkSpeed = 10;  // Frames between cursor blink


// ========================================================
// Code display state
// ========================================================

let codeLines = [];
let nextY;


// ========================================================
// Typing state
// ========================================================

let frameCounter = 0;
let typingCounter = 0;

let currentSnippet = "";
let currentIndex = 0;

let isTyping = false;


// ========================================================
// Snippet sequence state
// ========================================================

let snippetIndex = 0;


// ========================================================
// Cursor state
// ========================================================

let cursorVisible = true;
let cursorCounter = 0;


// ========================================================
// Setup
// ========================================================

function setup() {

  createCanvas(windowWidth, windowHeight);

  textFont("monospace");

  updateTextSize();

  frameRate(60);

  themeColor = color(64, 180, 255);

  nextY = height / 2;
}


// ========================================================
// Main animation
// ========================================================

function draw() {

  background(0, 70);


  // ------------------------------------------------------
  // Draw all lines
  // ------------------------------------------------------

  for (let line of codeLines) {
    drawGlowingText(line.text, line.x, line.y);
  }


  // ------------------------------------------------------
  // Cursor blink logic
  // ------------------------------------------------------

  cursorCounter++;

  if (cursorCounter >= cursorBlinkSpeed) {

    cursorCounter = 0;
    cursorVisible = !cursorVisible;

  }


  // ------------------------------------------------------
  // Start typing a new line after a pause
  // ------------------------------------------------------

  frameCounter++;

  if (frameCounter >= scrollSpeed && !isTyping) {

    frameCounter = 0;
    startTyping();

  }


  // ------------------------------------------------------
  // Type characters
  // ------------------------------------------------------

  if (isTyping) {
    typeCharacter();
  }


  // ------------------------------------------------------
  // Draw cursor
  // ------------------------------------------------------

  if (cursorVisible && codeLines.length > 0) {
    drawCursor();
  }
}


// ========================================================
// Responsive text sizing
// ========================================================

function updateTextSize() {

  // Font size relative to the canvas
  fontSize = min(width, height) * 0.024;

  // Keep a sensible minimum and maximum
  fontSize = constrain(fontSize, 12, 32);

  lineHeight = fontSize * 1.6;

  margin = fontSize * 3.5;

  cursorSize = fontSize * 0.9;

  textSize(fontSize);
}


// ========================================================
// Typing control
// ========================================================

function startTyping() {

  currentSnippet = leanProof[snippetIndex];

  // Cycle through the array in order
  snippetIndex = (snippetIndex + 1) % leanProof.length;

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


  // Finished typing the current line
  if (currentIndex >= currentSnippet.length) {

    isTyping = false;

    nextY += lineHeight;

    handleScroll();

  }
}


// ========================================================
// Scrolling logic
// ========================================================

function handleScroll() {

  if (nextY + lineHeight > height - margin) {

    for (let line of codeLines) {
      line.y -= lineHeight;
    }

    nextY -= lineHeight;
  }


  // Remove lines that have moved off the screen
  codeLines = codeLines.filter(
    line => line.y > margin - lineHeight
  );
}


// ========================================================
// Cursor
// ========================================================

function drawCursor() {

  let lastLine = codeLines[codeLines.length - 1];

  let cursorX =
    lastLine.x +
    textWidth(lastLine.text) +
    fontSize * 0.3;

  let cursorY =
    lastLine.y -
    fontSize +
    fontSize * 0.2;


  drawingContext.shadowColor = themeColor;
  drawingContext.shadowBlur = fontSize * 0.5;

  noStroke();
  fill(themeColor);

  rect(
    cursorX,
    cursorY,
    cursorSize,
    cursorSize
  );

  drawingContext.shadowBlur = 0;
}


// ========================================================
// Glowing text
// ========================================================

function drawGlowingText(txt, x, y) {

  for (let i = 5; i > 0; i--) {

    fill(themeColor, 40 * i);

    text(txt, x, y);

  }

  fill(themeColor);

  text(txt, x, y);
}


// ========================================================
// Window resize
// ========================================================

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  updateTextSize();


  // ------------------------------------------------------
  // Clear previous lines
  // ------------------------------------------------------

  codeLines = [];


  // ------------------------------------------------------
  // Reset typing state
  // ------------------------------------------------------

  isTyping = false;

  currentSnippet = "";

  currentIndex = 0;

  typingCounter = 0;

  frameCounter = 0;

  snippetIndex = 0;


  // ------------------------------------------------------
  // Reset cursor
  // ------------------------------------------------------

  cursorCounter = 0;

  cursorVisible = true;


  // ------------------------------------------------------
  // Reset starting position
  // ------------------------------------------------------

  nextY = height / 2;
}