let s, shader_graphic;
let img, img_ratio, img1, img1_ratio, img2, img2_ratio;
let music, fft;
let cam;

function preload() {
  music = loadSound('Disco-Science.mp3');
  // load the shader
  s = loadShader("shader.vert", "shader.frag");
  pixelDensity(1);
}

function setup() {
	pixelDensity(1);
  createCanvas(windowWidth, windowHeight, WEBGL);
	noStroke();

	img_ratio = img.width / img.height;
  cam = 1.0;
	
  //s = createShader(vert, frag);
	shader(s);
		
  noLoop();
  fft = new p5.FFT();
  fft.setInput(music);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function mousePressed() {
  if (music.isPlaying())
  {
    music.pause();
    noLoop();
  }
  else
  {
    music.loop();
    loop();
  }

  if (cam == 0.0) {
    cam = 1.0;
  } else {
    cam = 0.0;
  }
}

function draw() {
  
	fft.analyze();
  
  const bass = fft.getEnergy("bass") / 255;
  const treble = fft.getEnergy("treble") / 255;
  const mid = fft.getEnergy("mid") / 255;

	
  s.setUniform("iResolution", [width, height]);
  s.setUniform("iMouse", [mouseX, mouseY]);
  s.setUniform("iTime", millis() * 0.001);
	
  s.setUniform("iChannel0", img);
  s.setUniform("iChannel0Ratio", img_ratio);
	
  s.setUniform('iBass', bass);
  s.setUniform('iTreble', treble);
  s.setUniform('iMid', mid);

  s.setUniform('iCam', cam);
  
  rect(0, 0, width, height);


  
	//console.log(cam)
}

