let capture
let cacheGraphics
let noiseTexture
function preload(){
	noiseTexture = loadImage("noise.jpg")
}
function setup() {
	createCanvas(640, 480);
	background(100);
	capture = createCapture(VIDEO)
	capture.size(640,480)
	cacheGraphics = createGraphics(640,480)
	cacheGraphics.translate(640,0)
	cacheGraphics.scale(-1,1)
	capture.hide()
}
var mode = 3
function draw() {
	cacheGraphics.image(capture,0,0)
	noStroke()
	scale(1)
background(0)
	let span = 10;//12+ max(mouseX,0)/20
	for(var i=0;i<cacheGraphics.width;i+=span){
		for(var o=0;o<cacheGraphics.height;o+=span){
			let pixel = cacheGraphics.get(i,o)
			let bk = (pixel[0]+pixel[1]+pixel[2])/3
			
      var w = map(bk, 0, 255, 0, 250);
			
			fill(255)
			if (mode==1){
				ellipse(i,o,span*map(bk,0,255,0,1) )
			}
			if (mode==2){
				fill(pixel)
				push()
					colorMode(HSB)
					fill(pixel[0],100,90)
					translate(i,o)
					rotate(pixel[0]/100)
				rectMode(CENTER)
					rect(0,0,span*0.3+pixel[2]/15)
				fill(0)
				ellipse(0,0,5)
				pop()
			}
			if (mode==3){
				let txt = "11111110000000"
				let bkId = int(map(bk,0,255,10,0))
				
				fill(255,w)
				textSize(span)
				textStyle(BOLD)
				text(txt[bkId],i,o)
			}
		}
	}
	push()
		blendMode(MULTIPLY)
		image(noiseTexture,0,0)
	pop()
	// image(capture,mouseX,mouseY)
}


function keyPressed(){
	if (key=="1"){
		mode=1
	}
	if (key=="2"){
		mode=2
	}
	if (key=="3"){
		mode=3
	}
}