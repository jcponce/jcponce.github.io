// Original code by Vamoss (https://www.openprocessing.org/sketch/965134)
// Adapted by Roni Kaufman and Juan Carlos Ponce Campuzano

let sha1; //Shader1 Tab
let sha2; //Shader2 Tab
let grafShader1;
let grafShader2;
let grafText;

/*
//Google fonts
var families = [
	{name:'Roboto', variants:[900, 700, 500, 300]},
	{name:'Roboto Condensed', variants:[700]},
	{name: 'Open Sans', variants:[800, 700, 600]},
	{name: 'Noto Sans JP', variants: [900, 700, 500]},
	{name: 'Lato', variants: [900, 700]},
	{name: 'Montserrat', variants: [900, 800, 700]},
	{name: 'Source Sans Pro', variants: [900, 700, 600]},
	{name: 'Oswald', variants: [700, 600, 500]},
	{name: 'Raleway', variants: [900, 800, 700, 600]},
	{name: 'Poppins', variants: [900, 800, 700, 600]},
	{name: 'Merriweather', variants: [900, 700]}
];
*/

let config = {
	noiseFrequency: 1,
	noiseLevel: 0.25,
	zoom: 2,
	color1: [179, 179, 204], //[255, 0, 0],
	color2: [51, 51, 153], //[0, 0, 178],
	coordinate1: {
		x: 0,
		y: 0
	},
	coordinate2: {
		x: 1,
		y: 1
	},
	text: "Topology",
	family: "Montserrat:900",
	textSize: 180,
	textColor: [0, 0, 0], //[255, 255, 255],
	textDistort: true,
	letterSpace: 0,
	lineSpace: 200
};

function setup() {
	createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
	noStroke();

	//let familiesArr = [];
	//families.map(family => family.variants.map(variant => familiesArr.push(family.name + ':' + variant)));
	//WebFont.load({google: {families:familiesArr}});

	grafShader1 = createGraphics(width, height, WEBGL);
	sha1 = new p5.Shader(grafShader1._renderer, vert1, frag1);
	grafShader1.pixelDensity(1);

	grafShader2 = createGraphics(width, height, WEBGL);
	sha2 = new p5.Shader(grafShader2._renderer, vert2, frag2);
	grafShader2.pixelDensity(1);

	grafText = createGraphics(width, height);
	grafText.pixelDensity(1);

	/*
	let gui = new dat.GUI();
	var folder1 = gui.addFolder('background');
  folder1.add(config, 'noiseFrequency', 0, 20, 0.01);
  folder1.add(config, 'noiseLevel', 0, 0.25, 0.001);
  folder1.add(config, 'zoom', 0, 2, 0.01);
	folder1.open();
	var folder2 = folder1.addFolder('color 1');
	folder2.addColor(config, 'color1');
	folder2.add( config.coordinate1, 'x', 0, 1, 0.01);
	folder2.add( config.coordinate1, 'y', 0, 1, 0.01);
	folder2.open();
	var folder3 = folder1.addFolder('color 2');
	folder3.addColor(config, 'color2');
	folder3.add( config.coordinate2, 'x', 0, 1, 0.01);
	folder3.add( config.coordinate2, 'y', 0, 1, 0.01);
	folder3.open();
	var folder4 = gui.addFolder('Text');
	folder4.add( config, 'text');
	folder4.add( config, 'family', familiesArr);
	folder4.add( config, 'textSize', 50, 500, 5);
	folder4.add( config, 'letterSpace', -100, 100, 1);
	folder4.add( config, 'lineSpace', 0, 500, 1);
	folder4.addColor( config, 'textColor');
	folder4.add( config, 'textDistort');
	folder4.open();
	*/
}

function draw() {
	//BG
	sha1.setUniform("resolution", [width, height]);
	sha1.setUniform("time", millis() / 1000.0);
	sha1.setUniform("mouse", [mouseX, mouseY]);
	sha1.setUniform("noiseFrequency", config.noiseFrequency);
	sha1.setUniform("noiseLevel", config.noiseLevel);
	sha1.setUniform("zoom", config.zoom);
	sha1.setUniform("color1", config.color1);
	sha1.setUniform("color2", config.color2);
	sha1.setUniform("coord1", [config.coordinate1.x, config.coordinate1.y]);
	sha1.setUniform("coord2", [config.coordinate2.x, config.coordinate2.y]);
	grafShader1.shader(sha1);
	grafShader1.rect(0, 0, width, height);
	image(grafShader1, 0, 0);


	//TEXT
	grafText.clear();
	grafText.fill(config.textColor);

	//createGraphics creates a hidden canvas
	//because it is hidden, letterSpacing does not get effect
	grafText.canvas.style.display = "block";
	grafText.canvas.style.letterSpacing = config.letterSpace + "px";

	var font = config.family.split(':');
	//grafText.drawingContext.font = (font.length > 1 ? font[1] : 'normal') + ' ' + config.textSize + 'px "' + font[0] + '" ';
	grafText.drawingContext.font = "900 180px Monospace"
	grafText.drawingContext.textAlign = 'center';
	grafText.drawingContext.textBaseline = 'baseline';
	var lines = config.text.split("\\n");
	lines.forEach((line, index) => {
		grafText.drawingContext.fillText(line, width / 2, height / 2 + (index - (lines.length - 1) / 2) * config.lineSpace + config.textSize / 4);
	});
	grafText.canvas.style.display = "none";

	config.noiseLevel = sin(millis() / 10000.0);

	//DISTORT
	sha2.setUniform("resolution", [width, height]);
	sha2.setUniform("time", millis() / 1000.0);
	sha2.setUniform("mouse", [mouseX, mouseY]);
	sha2.setUniform("noiseFrequency", config.noiseFrequency);
	sha2.setUniform("noiseLevel", config.noiseLevel);
	sha2.setUniform("zoom", config.zoom);
	sha2.setUniform('tex', grafText);
	sha2.setUniform('realSize', [grafText.width, grafText.height]);
	grafShader2.shader(sha2);
	grafShader2.rect(0, 0, width, height);
	image(grafShader2, 0, 0);
}