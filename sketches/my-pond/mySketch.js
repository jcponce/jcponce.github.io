/*
 * Based upon the amazing Processing project: My Life Aquatic 
 * by David Leibovic, Sunah Suh and Ricardo Sánchez
 * Source: https://github.com/dasl-/my-life-aquatic
 * 
 * Translated to p5.js by Juan Carlos Ponce Campuzano
 * 27/Jul/2024
 * https://www.dynamicmath.xyz
 * 
 * TO-DO:
 * Fix sound effects but it seems to be working now. I will check it in the future. :)
 */

let foregroundBubbles = [];
//let backgroundBubbles = [];
let foods = [];
let myFish;
let numBoids = 10;
let boids = [];

let ripples = [];
let dropSound1, dropSound2, gulp, explosion;
let nextDropFrame = 0;

function preload() {
	soundFormats('mp3', 'ogg');
	dropSound1 = loadSound('water-drops-1.mp3');
	dropSound2 = loadSound('water-drops-2.mp3');
	gulp = loadSound('gulp.mp3');
	explosion = loadSound('explosion.mp3');
}

function setup() {
	let pondWidth = window.innerWidth;
	let pondHeight = window.innerHeight;

	createCanvas(pondWidth, pondHeight);
	frameRate(50);

	let location = createVector(random(0.2 * pondWidth, 0.8 * pondWidth), random(0.2 * pondHeight, 0.8 * pondHeight));
	myFish = new Fish(location, random(2.0, 2.5), 0.2);

	cursor(HAND);


	// Create more independent fishes
	for (let n = 0; n < numBoids; n++) {
		let location2 = createVector(random(100, width - 100), random(100, height - 100));
		let fish = new Fish(location2, random(1.0, 3.5), 0.2);
		boids.push(fish);
	}
}

function draw() {
	background(0, 96, 128);
	// We can use "background()" to color the water, 
	// but it is easier to set the color of the canvas using CSS.
	// That's why we need to clear the canvas
	//clear();

	let randomNumber = random(0, 1000);
	/*
	

	if (randomNumber > 980) {
		foregroundBubbles.push(new Bubble(color(int(random(100, 255)), 200)));
	} else if (randomNumber < 20) {
		backgroundBubbles.push(new Bubble(color(int(random(100, 255)), 100)));
	}
	*/

	/*for (let i = backgroundBubbles.length - 1; i >= 0; i--) {
		let bubble = backgroundBubbles[i];
		if (bubble.getLocation().y < -50) {
			backgroundBubbles.splice(i, 1);
		} else {
			bubble.update();
			bubble.render();
		}
	}
	*/

	myFish.update();
	myFish.render();
	if (myFish.getFoodEaten() > 11 && !myFish.getIsExploding()) {
		myFish.explode();
	}
	

	for (let fish of boids) {

		fish.update();
		fish.render();

		// If there is any food in the pond
		///*
		if (foods.length > 0) {
			// Check if a fish is near one and apply arrive behavior
			for (let j = 0; j < foods.length; j++) {
				let food = foods[j];
				let fLoc = food.location.copy();
				let bLoc = fish.location.copy();
				let d = bLoc.dist(fLoc);
				
				if (d < 200.0) {
					fish.arrive(fLoc);
					if (fish.hasArrive === true) {
						
						food.isDead = true;
						fish.hasArrive = false;
						
						
					}
					fish.wander();
					
				}
			}
		}
		//*/

	}

	if (randomNumber <= 6) {
		let foodLocation = createVector(random(100, width - 100), random(100, height - 100));
		let food = new Food(foodLocation);
		foods.push(food);
	}

	for (let i = foods.length - 1; i >= 0; i--) {
		let food = foods[i];
		if (!food.getIsDead()) {
			food.update();
			food.render();
			if (myFishAteFood(food)) {
				foods.splice(i, 1);
			}
		} else {
			foods.splice(i, 1);
		}
	}

	// Create a new ripple at a random interval
	if (frameCount >= nextDropFrame) {
		let ripple = {
			x: random(width),
			y: random(height),
			radius: 0,
			speed: random(1, 3), // Random speed
			maxRadius: random(80, 120) // Random max radius
		};
		ripples.push(ripple);

		// Play a random one-second segment of the drop sound
		let vol = map(ripple.maxRadius, 80, 120, 0.05, 0.1);
		let kind = int(map(ripple.speed, 1, 3, 1, 3));
		
		if(playSounds){
			if (random() < 0.5) {
				dropSound1.play(0, 1, vol, kind, 1);
			} else {
				dropSound2.play(0, 1, vol*0.45, kind, 1);
			}
		}

		// Set the next drop frame with random interval
		nextDropFrame = frameCount + int(random(10, 50));
	}

	// Update and draw ripples
	for (let i = ripples.length - 1; i >= 0; i--) {
		let r = ripples[i];
		stroke(`rgba(198, 217, 236, ${1 - r.radius / r.maxRadius})`); // Fading effect
		push();
		noFill();
		ellipse(r.x, r.y, r.radius * 2);
		pop();
		r.radius += r.speed;

		// Remove the ripple if it exceeds maxRadius
		if (r.radius > r.maxRadius) {
			ripples.splice(i, 1);
		}
	}


}

let playSounds = false;
function keyPressed() {
	if (key === 'p' || key === 'P' ) {
		playSounds = true;
	}
	if (key === 's' || key === 's' ) {
		playSounds = false;
	}
}

function myFishAteFood(food) {
	let foodEaten = false;

	let distanceToFood = p5.Vector.sub(myFish.getLocation(), food.getLocation()).mag();
	if (distanceToFood < 10) {
		foodEaten = true;
		gulp.play(); // Uncomment if you have a gulp sound to play
		myFish.setBodySizeH(myFish.getBodySizeH() * 1.1);
		myFish.setBodySizeW(myFish.getBodySizeW() * 1.1);
		myFish.setLastAteTimer(int(frameRate() / 2));
		myFish.setFoodEaten(myFish.getFoodEaten() + 1);
	}

	return foodEaten;
}

function mouseMoved() {
	let mousePosition = createVector(mouseX, mouseY);
	myFish.setMousePosition(mousePosition);
}

function touchMoved() {
	let mousePosition = createVector(mouseX, mouseY);
	myFish.setMousePosition(mousePosition);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}