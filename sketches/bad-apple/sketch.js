///* Version 03

let video;
let isPlaying = false; // Track video playback state
let codeText = `//p5.js code
let video;
let isPlaying = false;
let codeText = '...';
let fontSize = 20;
let charSpacing = 0.2;
let lineSpacing = 0.5;
function preload() {
video = createVideo('bad-apple-1080.mp4');}
function setup() {
createCanvas(640, 480);
video.hide();
textFont('monospace');
textSize(fontSize);}
function draw() {
background(0);
if (isPlaying) {
video.loadPixels();
let videoWidth = video.width;
let videoHeight = video.height;
let xScale = width / videoWidth;
let yScale = height / videoHeight;
let xStep = fontSize * xScale * charSpacing;
let yStep = fontSize * yScale * charSpacing;
let lineHeight = fontSize * lineSpacing;
let codeLines = codeText.split('\n');
let startY = height;
for (let y = 0; y < videoHeight; y += yStep / yScale) {
let lineIndex = floor(y / (yStep / yScale));
if (lineIndex < codeLines.length) {
for (let x = 0; x < videoWidth; x += xStep / xScale) {
let index = (floor(x) + floor(y) * videoWidth) * 4;
let r = video.pixels[index];
let g = video.pixels[index + 1];
let b = video.pixels[index + 2];
let gray = (r + g + b) / 3;
if (gray < 50) {
let charIndex = floor(x / (xStep / xScale)) % codeLines[lineIndex].length;
fill(255);
noStroke();
text(codeLines[lineIndex][charIndex], x * xScale, (y * yScale) + (lineIndex * lineHeight) + startY - height);}}}}
} else {
push();
fill(255);
textSize(100);
textAlign(CENTER, CENTER);
text('Bad Apple in p5.js', width / 2, height / 2);
pop();}
}function mousePressed() {
if (!isPlaying) {
video.loop();
isPlaying = true;}}`; // Example code text

let fontSize = 13; // Set initial font size
let charSpacing = 0.4; // Multiplier for spacing between characters
let lineSpacing = 0.4; // Multiplier for spacing between lines
const videoWidth = 480; // Fixed video width
const videoHeight = 360; // Fixed video height

function preload() {
    video = createVideo('https://topologia-general.github.io/sketches/video/bad-apple.mp4'); // Ensure the path is correct
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    video.hide(); // Hide the original video element to use as a texture
    textFont('monospace'); // Use a monospace font for better readability
    textSize(fontSize); // Set initial font size
    //cursor('none');
}

function draw() {
    background(0);

    if (isPlaying) {
        video.loadPixels(); // Load video pixels

        let videoWidth = video.width;
        let videoHeight = video.height;

        // Calculate scaling factors
        let scaleFactor = min(width / videoWidth, height / videoHeight);

        // Center the video representation in the canvas
        let tileX = (width - videoWidth * scaleFactor) / 2;
        let tileY = (height - videoHeight * scaleFactor) / 2;

        // Calculate increments dynamically based on font size, charSpacing, and lineSpacing
        let xStep = fontSize * scaleFactor * charSpacing; // Adjust horizontal step with charSpacing
        let yStep = fontSize * scaleFactor * charSpacing; // Adjust vertical step with charSpacing
        //let lineHeight = fontSize * lineSpacing; // Adjust vertical space between lines

        // Split the code text into lines for rendering
        let codeLines = codeText.split('\n');

        // Access pixels and display code text over black pixels
        for (let y = 0; y < videoHeight; y += yStep / scaleFactor) {
            let lineIndex = floor(y / (yStep / scaleFactor)) % codeLines.length;

            if (lineIndex >= 0 && lineIndex < codeLines.length) {
                for (let x = 0; x < videoWidth; x += xStep / scaleFactor) {
                    let index = (floor(x) + floor(y) * videoWidth) * 4; // RGBA format
                    let r = video.pixels[index];
                    let g = video.pixels[index + 1];
                    let b = video.pixels[index + 2];

                    // Convert to grayscale to check if pixel is black
                    let gray = (r + g + b) / 3;

                    if (gray < 50) { // Threshold for black
                        let charIndex = floor(x / (xStep / scaleFactor)) % codeLines[lineIndex].length;

                        // Check if charIndex is valid
                        if (charIndex >= 0 && charIndex < codeLines[lineIndex].length) {
                            fill(255);
                            noStroke();
                            // Render text starting from the scaled position with offsets
                            text(
                                codeLines[lineIndex][charIndex],
                                x * scaleFactor + tileX,
                                y * scaleFactor + tileY
                            );
                        }
                    }
                }
            }
        }
    } else {
        push();
        fill(255);
        textSize(100);
        textAlign(CENTER, CENTER);
        text('Bad Apple in p5.js', width / 2, height / 2);
        pop();
    }
}

function keyPressed() {
    if (keyCode === ENTER && !isPlaying) {
      video.loop(); // Start playing the video
      isPlaying = true;
    }
  }

// Function to toggle full screen mode
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
            .catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
    } else {
        document.exitFullscreen();
    }
}

// Function to reload the page
function reloadPage() {
    location.reload();
}

// Event listener for keydown event
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        toggleFullScreen();
    } else if (event.key === 'r' || event.key === 'R') {
        reloadPage();
    }
});

//*/

/* Version 01
let video;
let isPlaying = false; // Track video playback state
let codeText = `
let video;
let isPlaying = false;
let codeText = '...';
let fontSize = 20;
let charSpacing = 0.2;
let lineSpacing = 0.5;
function preload() {
  video = createVideo('bad-apple-1080.mp4');
}
function setup() {
  createCanvas(640, 480);
  video.hide();
  textFont('monospace');
  textSize(fontSize);
}
function draw() {
  background(0);
  if (isPlaying) {
  video.loadPixels();
  let videoWidth = video.width;
  let videoHeight = video.height;
  let xScale = width / videoWidth;
  let yScale = height / videoHeight;
  let xStep = fontSize * xScale * charSpacing;
  let yStep = fontSize * yScale * charSpacing;
  let lineHeight = fontSize * lineSpacing;
  let codeLines = codeText.split('\n');
  let startY = height;
  for (let y = 0; y < videoHeight; y += yStep / yScale) {
  let lineIndex = floor(y / (yStep / yScale));
  if (lineIndex < codeLines.length) {
  for (let x = 0; x < videoWidth; x += xStep / xScale) {
  let index = (floor(x) + floor(y) * videoWidth) * 4;
  let r = video.pixels[index];
  let g = video.pixels[index + 1];
  let b = video.pixels[index + 2];
  let gray = (r + g + b) / 3;
  if (gray < 50) { // Threshold for black
  let charIndex = floor(x / (xStep / xScale)) % codeLines[lineIndex].length;
  fill(255);
  noStroke();
  text(codeLines[lineIndex][charIndex], x * xScale, (y * yScale) + (lineIndex * lineHeight) + startY - height);}}}}
  } else {
  push();
  fill(255);
  textSize(100);
  textAlign(CENTER, CENTER);
  text('Bad Apple in p5.js', width / 2, height / 2);
  pop();}
}
function mousePressed() {
  if (!isPlaying) {
    video.loop();
    isPlaying = true;
  }
}
`; // Example code text

let fontSize = 20; // Set initial font size
let charSpacing = 0.2; // Multiplier for spacing between characters
let lineSpacing = 0.6; // Multiplier for spacing between lines

function preload() {
  // Load your video file (ensure the path is correct)
  video = createVideo('bad-apple-1080.mp4');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video.hide(); // Hide the original video element to use as a texture
  textFont('monospace'); // Use a monospace font for better readability
  textSize(fontSize); // Set initial font size
  cursor('none');
}

function draw() {
  background(0);

  if (isPlaying) {
    video.loadPixels(); // Load video pixels

    let videoWidth = video.width;
    let videoHeight = video.height;

    // Calculate scaling factors
    let xScale = width / videoWidth;
    let yScale = height / videoHeight;

    // Calculate increments dynamically based on font size, charSpacing, and lineSpacing
    let xStep = fontSize * xScale * charSpacing; // Adjust horizontal step with charSpacing
    let yStep = fontSize * yScale * charSpacing; // Adjust vertical step with charSpacing
    let lineHeight = fontSize * lineSpacing; // Adjust vertical space between lines

    // Split the code text into lines for rendering
    let codeLines = codeText.split('\n');

    // Start drawing text from the bottom of the canvas
    let startY = height;

    // Access pixels and display code text over black pixels
    for (let y = 0; y < videoHeight; y += yStep / yScale) {
      let lineIndex = floor(y / (yStep / yScale)); // Wrap lines

      if (lineIndex < codeLines.length) {
        for (let x = 0; x < videoWidth; x += xStep / xScale) {
          let index = (floor(x) + floor(y) * videoWidth) * 4; // RGBA format
          let r = video.pixels[index];
          let g = video.pixels[index + 1];
          let b = video.pixels[index + 2];

          // Convert to grayscale to check if pixel is black
          let gray = (r + g + b) / 3;

          if (gray < 50) { // Threshold for black
            let charIndex = floor(x / (xStep / xScale)) % codeLines[lineIndex].length; // Wrap characters
            fill(255);
            noStroke();
            // Render text starting from the bottom of the canvas
            text(codeLines[lineIndex][charIndex], x * xScale, (y * yScale) + (lineIndex * lineHeight) + startY - height);
          }
        }
      }
    }
  } else {
    push();
    fill(255);
    textSize(100);
    textAlign(CENTER, CENTER);
    text('Bad Apple in p5.js', width / 2, height / 2);
    pop();
  }
}

function mousePressed() {
  if (!isPlaying) {
    video.loop(); // Start playing the video
    isPlaying = true;
  }
}

*/

/* Version 02 

let video;
let isPlaying = false; // Track video playback state
let codeText = `
let video;let isPlaying = false;let codeText = '...';}`; // Example code text

let fontSize = 8; // Set initial font size
let charSpacing = 1.2; // Multiplier for spacing between characters
let lineSpacing = 1.5; // Multiplier for spacing between lines

function preload() {
  video = createVideo('bad-apple-1080.mp4');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video.hide(); // Hide the original video element to use as a texture
  video.loop(); // Start video playback on loop
  textFont('monospace'); // Use a monospace font for better readability
  textSize(fontSize); // Set initial font size
}

function draw() {
  background(0);

  if (isPlaying) {
    video.loadPixels(); // Load video pixels

    let videoWidth = video.width;
    let videoHeight = video.height;

    // Calculate scaling factors to map video pixels to canvas size
    let xScale = videoWidth / width;
    let yScale = videoHeight / height;

    // Calculate character spacing dynamically
    let xStep = fontSize * charSpacing;
    let yStep = fontSize * lineSpacing;

    // Split the code text into lines
    let codeLines = codeText.split('\n');

    for (let y = 0; y < height; y += yStep) {
      for (let x = 0; x < width; x += xStep) {
        // Map canvas coordinates to video pixel coordinates
        let videoX = floor(x * xScale);
        let videoY = floor(y * yScale);

        if (videoX < video.width && videoY < video.height) {
          let index = (videoX + videoY * video.width) * 4; // RGBA format
          let r = video.pixels[index];
          let g = video.pixels[index + 1];
          let b = video.pixels[index + 2];

          // Convert to grayscale to check pixel brightness
          let gray = (r + g + b) / 3;

          if (gray < 50) { // Threshold for black
            let lineIndex = floor(y / yStep) % codeLines.length; // Wrap lines
            let charIndex = floor(x / xStep) % codeLines[lineIndex].length; // Wrap characters

            // Draw the character based on video pixels
            fill(255);
            noStroke();
            text(codeLines[lineIndex][charIndex], x, y);
          }
        }
      }
    }
  } else {
    // Display message to play the video
    push(); // Save current style settings
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Click to Play Video', width / 2, height / 2);
    pop(); // Restore previous style settings
  }
}

function mousePressed() {
  if (!isPlaying) {
    isPlaying = true; // Start displaying characters based on video pixels
  }
}
*/