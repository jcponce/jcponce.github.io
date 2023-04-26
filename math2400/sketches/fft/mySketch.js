/*

This is a p5easycam version of Music Visualizer by Ivan Rudnicki

https://openprocessing.org/sketch/974487

It works :) Now I just need to refactor it. ;)

Date: 26/Abril/2023
Site: https://jcponce.github.io/

*/

let easycam;

/*Code based on example from Daniel Shiffman.*/

let song;
let fft;
let spectra = [];
let mode = 0;
let angle = 0;
let mic; 

function preload() {
	//song = loadSound('https://www.dynamicmath.xyz/assets/audio/01-Time-In-A-Bottle.mp3');
	//song = loadSound('https://www.dynamicmath.xyz/sketches/shaders/topology/Disco-Science.mp3');
	song = loadSound('dance-land.mp3');
}


function setup() {
	
    pixelDensity(1);
    
    createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    easycam = new Dw.EasyCam(this._renderer, {distance : 40});
	
	document.getElementById('play').onclick = () => {
		toggle();
	};

	// Getting microphone input
	mic = new p5.AudioIn();

	// Getting FFT from p5js
	fft = new p5.FFT(0.5, 64);

	document.getElementById('micro').onclick = () => {

		val2 = !val2;
		//console.log('Toggled', val2);
		var divElem = document.getElementById('hide');
		var divInfo = document.getElementById('info');
		if( !val2){
		  divElem.style.display = 'block'  ; 
		  divInfo.style.display = 'block'  ; 
		  mic.stop();
		}
		else{
		  divElem.style.display = 'none'  ;
		  divInfo.style.display = 'none'  ; 
		  mic.start();
		  mic.connect(fft);
		  song.pause();
		  song.setVolume(1);
		}
		
	};

	// Runs slower 
	frameRate(15);

	// Rainbow colors :)
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

	let hh = 3; // To adjust height of boxes
	
	rotateX(1.3);

	if(val == true) {
		rotateZ(angle);
		angle -= 0.005;
	} else rotateZ(angle);

	rotateZ(-0.5);
	translate(-15,-15,-4);

	ambientLight(60);
	// add a point light to showcase specular color
    // -- use mouse location to position the light
    //let lightPosX = mouseX - width / 2;
    //let lightPosY = mouseY - height / 2;
	pointLight(210, 210, 210, 50, 50, 30); // white light
	
	///*
	let adjust;
	//strokeWeight(1);
	noStroke();
	for (j = 0; j < spectra.length; j++) {
		let spec = spectra[j].getSpectrum();
		
		for (i = 0; i < 32; i += 1) {

			if(val2) {
				adjust = (i + 1) * (i * 1) / 30; //musics
			} else {
				adjust = (i + 1) * (i * 1) / 90; // micro
			}
			let h = map(spec[i] * adjust, 0, 255, 0, hh);
			if (mode == 0) stroke(255);
			else stroke(0);
			//fill(i*13, 80, 100);
			//ambientMaterial();
			// use specular material with high shininess
  			specularMaterial((i+2)*12, 80, 100);
 			shininess(50);
			push();
			noStroke();
			translate(i, j, h/2);
			//rotateX(PI/2);
			//rotateZ(PI/2);
			//cylinder(0.5, h);
			box(0.85, 0.85, h)
			pop();
			
		}
	}

	/*
	// gizmo for reference
    strokeWeight(5);
    stroke(255, 32,  0); line(0,0,0,2,0,0);
    stroke( 32,255, 32); line(0,0,0,0,2,0);
    stroke(  0, 32,255); line(0,0,0,0,0,2);
    */
	
}

function toggle() {
	if (song.isPlaying()) {
		song.pause();
		song.setVolume(1);
	} else {
		song.loop();
	}
}

function keyPressed() {
	if (keyCode == 32) mode = 1 - mode;
}

// Define class for Spectrum
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