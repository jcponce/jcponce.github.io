/*
 A fun experiment! 
 
 Monkey typewritting animation
 
 The infinite monkey theorem states that if you let 
 a monkey hit the keys of a typewriter at random an 
 infinite amount of times, eventually the monkey will 
 type out the entire works of Shakespeare. 
 
 Author: Juan Carlos Ponce Campuzano
 https://dynamicmath.xyz
 26/March/2024
 
 I still need to improve it! I will be back to that soon :)
 
*/


let particles = [];
let numParticles = 100;
let digits = []; // Array to store letters from text file
let currentLetterIndex = 0; // Index to track the current letter

let img1, img2;
let currentImage;

function preload() {
  // Load the text file containing letters
  digits = loadStrings('https://raw.githubusercontent.com/CodingTrain/Coding-Challenges/main/097.1_Book_of_Pi_Part_1/Processing/CC_097_1_Book_of_Pi_Part_1/pi-1million.txt');
	
	// Monkey images made with GeoGebra
	// https://www.geogebra.org/m/ke9sdhex
  img1 = loadImage('monkey-curves-left.png');
  img2 = loadImage('monkey-curves-right.png');
}


function loadDigitsCallback(data) {
  digits = data; // Store the loaded letters in the array
}

let initialPositionX, initialPositionY;

function setup() {
  createCanvas(windowWidth, windowHeight);
	
	colorMode(HSB, 360, 100, 100, 100); // Set color mode to HSB
	
	currentImage = img1; // Start with img1 displayed

	initialPositionX = width - (width * 3.5) / 12;
  initialPositionY = height - (height * 1.9) / 10;
  // Wait for letters to be loaded before creating particles
  if (digits[0].length > 0) {
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(initialPositionX, initialPositionY));
    }
  }
}

let posX, posY;

function draw() {
  background(360, 0, 0, 20);
	
	/* Add monkey animation */
	
	// Calculate the scale factor based on the canvas size
  let scaleFactor = min(width / img1.width, height / img1.height) * 0.5;
  
  // Calculate the scaled image size
  let scaledWidth = img1.width * scaleFactor;
  let scaledHeight = img1.height * scaleFactor;
  
  // Calculate the position for the scaled image
  let posX = width * 8 / 10 - scaledWidth / 2;
  let posY = height * 8 / 10 - scaledHeight / 2;
  
  // Display the current image at the specified position with scaled size
  image(currentImage, posX, posY, scaledWidth, scaledHeight);
  
  // Alternate between img1 and img2 every second
  if (frameCount % 15 == 0) { // 60 frames per second
    if (currentImage === img1) {
      currentImage = img2;
    } else {
      currentImage = img1;
    }
  }

  // Move and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    // Remove particles that are off-screen
    if (particles[i].offScreen()) {
      particles.splice(i, 1);
      particles.push(new Particle(initialPositionX, initialPositionY)); // Add new particle to replace the removed one
    }
  }

  //console.log(particles.length);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
	initialPositionX = width - (width * 3.5) / 12;
  initialPositionY = height - (height * 1.9) / 10;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(-2, -2);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2.5;
    this.maxForce = 0.1;
    this.noiseOffset = random(1000);
    this.digit = digits[0].charAt(currentLetterIndex); // Use the current letter
    currentLetterIndex = (currentLetterIndex + 1) % digits[0].length; // Increment current letter index and wrap around

// Calculate unique color based on particle properties
    this.hue = random(360); // Random hue value
    this.saturation = random(50, 100); // Random saturation value between 50 and 100
    this.brightness = 100; // Fixed brightness

    this.color = color(this.hue, this.saturation, this.brightness);
  }

  update() {
    // Apply noise to movement
    let noiseX = map(noise(this.noiseOffset), 0, 1, -1, 1);
    let noiseY = map(noise(this.noiseOffset + 1000), 0, 1, -1, 1);
    let noiseVector = createVector(noiseX, noiseY);
    noiseVector.mult(0.5);

    this.acc.add(noiseVector);
    this.acc.limit(this.maxForce);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);

    this.pos.add(this.vel);

    this.acc.mult(0);
    this.noiseOffset += 0.01;
  }

  display() {
    fill(this.color);
    textSize(28);
    textAlign(CENTER, CENTER);
    text(this.digit, this.pos.x, this.pos.y);
  }

  offScreen() {
    return (this.pos.x < -20 || this.pos.y < -20 || this.pos.x > width + 20 || this.pos.y > height + 20);
  }
}
