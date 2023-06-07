let s, shader_graphic, shaderBg;
let img, img_ratio, img1, img1_ratio, img2, img2_ratio;
let music, fft;
let cam, inc;

// List of songs
let songsList = [
	"Disco-Science.mp3",
	"https://www.dynamicmath.xyz/math2400/sketches/fft/dance-land.mp3", 
	"https://www.dynamicmath.xyz/assets/audio/01-Time-In-A-Bottle.mp3",
];

// Preload all the music
function preload() {
	index = Math.floor(Math.random()*songsList.length);
	song = loadSound(songsList[index]);
	//for(let i = 0; i<songsList.length; i++){
	//	song[i] = loadSound(songsList[i]); 
	//}
	//song = loadSound('');
	//song = loadSound('https://www.dynamicmath.xyz/sketches/shaders/topology/Disco-Science.mp3');
	//song = loadSound('dance-land.mp3');
}

function preload() {
  inc = loadFont('inconsolata.otf');
  //img = loadImage('20210703_141403.jpg');
  //music = loadSound('Disco-Science.mp3');

  index = Math.floor(Math.random()*songsList.length);
	music = loadSound(songsList[index]);

  // load the shader
  s = loadShader("shader.vert", "shader.frag");

}

function setup() {
  //pixelDensity(1);
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  //img_ratio = img.width / img.height;
  cam = 1.0;
  textFont(inc);
  textSize(width / 20);
  textAlign(CENTER, CENTER);

  //s = createShader(vert, frag);
  // shaders require WEBGL mode to work
  shaderBg = createGraphics(windowWidth, windowHeight, WEBGL);
  //shader(s);

  noLoop();
  fft = new p5.FFT();
  fft.setInput(music);
  cursor('pointer');
}

function draw() {

  fft.analyze();

  const bass = fft.getEnergy("bass") / 255;
  const treble = fft.getEnergy("treble") / 255;
  const mid = fft.getEnergy("mid") / 255;

  shaderBg.shader(s);

  s.setUniform("iResolution", [width, height]);
  s.setUniform("iMouse", [mouseX, mouseY]);
  s.setUniform("iTime", millis() * 0.001);

  //s.setUniform("iChannel0", img);
  //s.setUniform("iChannel0Ratio", img_ratio);

  s.setUniform('iBass', bass);
  s.setUniform('iTreble', treble);
  s.setUniform('iMid', mid);

  s.setUniform('iCam', cam);

  shaderBg.rect(0, 0, width, height);
  image(shaderBg, -width / 2, -height / 2, width, height);

  if (cam === 1) {
    fill(0);
    rect(-width / 2, -height / 2, width, height);
    fill(255);
    text("Click to play/pause!", 0, 0);
  }

  //console.log(cam)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function mousePressed() {
  cursor('grab');
  if (music.isPlaying()) {
    music.pause();
    noLoop();
  } else {
    music.loop();
    loop();
  }

  if (cam == 0.0) {
    cam = 1.0;
  } else {
    cam = 0.0;
  }
}

function touchStarted() {
  cursor('grab');
  if (music.isPlaying()) {
    music.pause();
    noLoop();
  } else {
    music.loop();
    loop();
  }

  if (cam == 0.0) {
    cam = 1.0;
  } else {
    cam = 0.0;
  }
}

function mouseReleased() {
  cursor('pointer');
}

function touchEnedd() {
  cursor('pointer');
}