/*

This is a p5easycam version of Musci Visualizer by Ivan Rudnicki

https://openprocessing.org/sketch/974487

https://openprocessing.org/user/110137?view=sketches&o=48

*/

let easycam;

/*Music Time ina bottle by Jim Croce*/
/*Code based on example from Daniel Shiffman.*/
let song;
let button;
let fft;
let spectra = [];
let mode = 0;

function preload() {
	song = loadSound('https://www.dynamicmath.xyz/assets/audio/01-Time-In-A-Bottle.mp3');
}


function setup() {
	
    pixelDensity(1);
    
    createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    //console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 40});
	
	button = createButton('Play music!');
	button.position(width / 2, height - 50);
	button.mousePressed(toggle);
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
	rotateZ(-0.5);
	translate(-15,-15,-4);

	///*
	
	strokeWeight(1);
	for (j = 0; j < spectra.length; j++) {
		if (j == spectra.length - 1) {
			fill(255, 200);
		} else {
	  fill(255, (j + 1) * 2);
		}
		let spec = spectra[j].getSpectrum();
		
		for (i = 0; i < 32; i += 1) {
			let adjust = (i + 1) * (i * +1) / 80;
			let h = map(spec[i] * adjust, 0, 255, 0, hh);
			if (mode == 0) stroke(255, 50 + (j + 1) * 6);
			else stroke(0, 50 + (j + 1) * 6);
			fill(i*13, 80, 100, .5);
			push();
			beginShape();
			vertex(i, j, 0);
			vertex(i+1, j, 0);
			vertex(i+1, j, h);
			vertex(i, j, h);
			endShape(CLOSE);
			pop();
		}
	}
	
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
		button.html("play music!");
		song.setVolume(1);
	} else {
		song.play();
		button.html("pause music!");
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
	button.position(width / 2, height - 50);
}



