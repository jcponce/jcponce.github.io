/*
Work in progress. :) 

*/

let binaryLines = []; // Array to store binary lines
let charSize = 20; // Size of characters
let lineSpacing = 25; // Spacing between lines
let lineLength = 28; // Maximum characters per line
let typingSpeed = 10; // Speed of typing (characters per second)
let canvasPadding = 20; // Padding around the canvas
let canvasFilled = false; // Flag to track if canvas is filled

function setup() {
  createCanvas(600, 600);
  textSize(charSize);
	frameRate(8);
}

function draw() {
  background(0); // Black background

  // Add new line with binary digits
  if (frameCount % round(frameRate() / typingSpeed) == 0) {
    let newLine = '';
    let brightnessList = [];
    for (let i = 0; i < lineLength; i++) {
      let brightness = random(0, 1); // Generate brightness for each character
      brightnessList.push(brightness);
      let character = random() < brightness ? '1' : '0'; // Randomly choose 1 or 0 based on brightness
      newLine += character;
    }
	
    // Push new line with brightness list to the bottom
    binaryLines.unshift({ text: newLine, brightnessList: brightnessList });

    // Remove excess lines if canvas is filled
    if (canvasFilled) {
			//brightnessList.pop();
      binaryLines.pop();
    }
		//console.log(brightnessList.length)
		//console.log(binaryLines.length)

    // Update canvasFilled flag
    canvasFilled = binaryLines.length * lineSpacing >= height - canvasPadding * 4;
		//console.log(canvasFilled)
  }

  // Display binary lines with varying brightness
  for (let i = 0; i < binaryLines.length; i++) {
    let yPos = height - (binaryLines.length - i) * lineSpacing - canvasPadding;
    let lines = binaryLines[i];
    for (let j = 0; j < lines.text.length; j++) {
      let x = canvasPadding + j * charSize;
      let character = lines.text[j];
      let brightness = lines.brightnessList[j]; // Get brightness for each character
      let alpha = brightness < 0.4 ? 90 : 250;
      fill(0, 255, 0, alpha); // Green color with varying alpha
      text(character, x, yPos);
    }
  }
}
