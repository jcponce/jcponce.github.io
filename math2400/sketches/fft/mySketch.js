/*

This is a p5easycam version of Musci Visualizer by Ivan Rudnicki

https://openprocessing.org/sketch/974487

https://openprocessing.org/user/110137?view=sketches&o=48

*/

let easycam;

/*Music Time in a bottle by Jim Croce*/
/*Code based on example from Daniel Shiffman.*/
let song;
let button;
let fft;
let spectra = [];
let mode = 0;

function preload() {
	//song = loadSound('https://www.dynamicmath.xyz/assets/audio/01-Time-In-A-Bottle.mp3');
	//song = loadSound('https://www.dynamicmath.xyz/sketches/shaders/topology/Disco-Science.mp3');
	song = loadSound('dance-land.mp3');
}


function setup() {
	
    pixelDensity(1);
    
    createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    //console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 40});
	
	button = createButton('Play me!');
	button.style('font-size:1.5em');
	button.position(20, 20);
	button.mousePressed(toggle);

	checkbox = createCheckbox(' Spin', false);
	checkbox.style('transform: scale(1.5);');
	checkbox.changed(myCheckedEvent);
	checkbox.position(30, 80);

	fft = new p5.FFT(0.5, 64);
	frameRate(15);
	
	colorMode(HSB);
}



function draw(){
    
  // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
  // BG
    
	if (mode == 0) background(0);
	else background(255);

	let spectrum = fft.analyze();
	spectra.push(new Spectrum(spectrum));
	if (spectra.length > 30) {
		spectra.splice(0, 1);
	}

	let hh = 3;
	
	rotateX(1.3);
	//rotateZ(frameCount * 0.01);

	if(rot == true) {
		rotateZ(angle);
		angle += 0.005;
	} else rotateZ(angle);

	rotateZ(-0.5);
	translate(-15,-15,-4);

	ambientLight(60);
	// add a point light to showcase specular color
  // -- use mouse location to position the light
  let lightPosX = mouseX - width / 2;
  let lightPosY = mouseY - height / 2;
	 pointLight(200, 200, 200, 600-width / 2, 300- height / 2, 50); // white light
	
	// use specular material with high shininess
  specularMaterial(150);
  shininess(50);
	

	///*
	
		
	//strokeWeight(1);
	noStroke();
	for (j = 0; j < spectra.length; j++) {
		/*
		if (j == spectra.length - 1) {
			fill(255, 200);
		} else {
	  fill(255, (j + 1) * 2);
		}
		*/
		let spec = spectra[j].getSpectrum();
		
		for (i = 0; i < 32; i += 1) {
			let adjust = (i + 1) * (i * 1) / 90;
			let h = map(spec[i] * adjust, 0, 255, 0, hh);
			if (mode == 0) stroke(255);
			else stroke(0);
			//fill(i*13, 80, 100);
			ambientMaterial((i+2)*12, 80, 100);
			push();
			noStroke();
			translate(i, j, h/2);
			//rotateX(PI/2);
			//rotateZ(PI/2);
			//cylinder(0.5, h);
			box(0.85, 0.85, h)
			pop();
			/*
			push();
			beginShape();
			vertex(i, j, 0);
			vertex(i+1, j, 0);
			vertex(i+1, j, h);
			vertex(i, j, h);
			endShape(CLOSE);
			pop();*/
		}
	}

	if (mode == 0) checkbox.style('color:white');
	else checkbox.style('color:black');
	
	/*
	// gizmo
    strokeWeight(5);
    stroke(255, 32,  0); line(0,0,0,2,0,0);
    stroke( 32,255, 32); line(0,0,0,0,2,0);
    stroke(  0, 32,255); line(0,0,0,0,0,2);
  */
	
}

function toggle() {
	if (song.isPlaying()) {
		song.pause();
		button.html("Play!");
		song.setVolume(1);
	} else {
		song.loop();
		button.html("Pause!");
	}
}

function keyPressed() {
	if (keyCode == 32) mode = 1 - mode;
}

class Spectrum {
 constructor(spectrum){
   this.spectrum = spectrum;
 }
 getSpectrum() {
   for(let i=0; i<this.spectrum.length; i++){
     this.spectrum[i]*=0.95;
   }
   return this.spectrum;
 }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
	
}

/*
// this function fires with any double click anywhere
let rot = false;
let angle = 0;
function doubleClicked() {
	if(rot == false) {
		rot = true;
	} else rot = false
}
*/

let rot = false;
let angle = 0;
function myCheckedEvent() {
	if(checkbox.checked()) {
		rot = true;
	} else rot = false
}


