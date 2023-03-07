/*
This is an entry to the #WCCChallenge theme of "shadow math."

I tried doing a black hole! This started based on actual
physics, even though it is decidedly unphysical now. I wrote a
little blog post about it here:
https://www.davepagurek.com/blog/black-hole-rendering/
*/

let blackHoleShader
let bg

function preload() {
	// CC0 from /r/blender here: https://www.reddit.com/r/blender/comments/3ebzwz/free_space_hdrs_1/
	bg = loadImage('crab-nebula.jpg')
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
	blackHoleShader = createShader(vert, frag)
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function draw() {
  background(0)
  
  rectMode(CENTER)
  imageMode(CENTER)
  noStroke()
  push()
  shader(blackHoleShader)
  blackHoleShader.setUniform('time', millis() / 1000);
	blackHoleShader.setUniform('bg', bg);
	blackHoleShader.setUniform('aspect', width / height);
  rect(0, 0, width, height)
  pop()
}