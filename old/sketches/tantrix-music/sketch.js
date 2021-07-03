/* * p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Tantrix pattern Written by Vamos https://www.openprocessing.org/user/65884
 * Original sketch: https://www.openprocessing.org/sketch/744884
 * This version with added sound by Juan Carlos Ponce Campuzano
 * https://jcponce.github.io/
 */

let osc, envelope, time;

let val = 0;
let textIni = true;

let Controls = function() {
    this.oscMode = 'Sin';
    this.color1 = '#0099cc';
    this.color2 = '#75ba84';
    this.color3 = '#ffffff';
    this.save = 'Press S to save'
};

let controls = new Controls();

let scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];

let hexagonLines;

const radius = 80;
const altitude = Math.sqrt(3) / 2 * radius;
let hexagons, hexagonPattern, rotations;

function setup() {
    createCanvas(windowWidth, windowHeight);
    cursor(HAND);
    //blendMode(BLEND);
    //pixelDensity(1);
    
    //UI conrtrols
    controlsGUI();
    
    //Hexagon, arcs and rotations of tilling
    resetArcs();
    
    rotations = [];
    hexagons = [];
    for (let x = -radius; x < width; x += altitude * 2) {
        let rowCount = 0;
        for (let y = -radius; y < height; y += radius * 1.5) {
            hexagons.push({
                          x: x + (rowCount % 2 == 0 ? 0 : altitude),
                          y: y,
                          rotation: 0
                          });
            rotations.push(TWO_PI / 6 * floor(random(6)));
            rowCount++;
        }
    }
    
    //Sound effects
    resetOscilator();
    
}

function draw() {
    background(controls.color3);
    
    hexagons.forEach((hexagon, index) => {
                     hexagon.rotation += (rotations[index] - hexagon.rotation) * 0.09;
                     push();
                     translate(hexagon.x + radius, hexagon.y + radius);
                     rotate(hexagon.rotation);
                     translate(-(hexagon.x + radius), -(hexagon.y + radius));
                     image(hexagonPattern, hexagon.x, hexagon.y);
                     pop();
                     });
    
    time = millis() / 1000;
    
    //initial message
    if (textIni === true && time < 25) {
        stroke(10)
        fill(230);
        rectMode(CENTER);
        rect(width / 2, height / 2, 300, 140, 20);
        strokeWeight(1);
        fill(50);
        textAlign(CENTER);
        textSize(26);
        text("Click to rotate.", width / 2, height / 2 - 30);
        text("Use controls to change", width / 2, height / 2 + 10);
        text("oscillator and colors.", width / 2, height / 2 + 40);
    }
    
    //console.log(val);
}

// Auxiliary functions

function controlsGUI() {
    let gui = new dat.GUI({
                          width: 270
                          });
    gui.add(controls, 'oscMode', ['Sin', 'Tri', 'Sqrt', 'Saw']).name("Oscilator").onChange(mySelectOption);
    gui.addColor(controls, 'color1').name("Arc 1").onChange(resetArcs);
    gui.addColor(controls, 'color2').name("Arc 2").onChange(resetArcs);
    gui.addColor(controls, 'color3').name("Background").onChange(resetArcs);
    gui.add(controls, 'save').name("JPG");
    gui.add(this, 'backHome').name("Go back Home");
    gui.close();
}

function backHome () {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function saveImage() {
    //save('tantrix-pattern.jpg');
}

function resetArcs() {
    let hexagonMask = createGraphics(radius * 2, radius * 2);
    hexagonMask.beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
        let x = sin(a) * radius + radius;
        let y = cos(a) * radius + radius;
        hexagonMask.vertex(x, y);
    }
    hexagonMask.endShape();
    
    hexagonLines = createGraphics(radius * 2, radius * 2);
    hexagonLines.noFill();
    hexagonLines.strokeWeight(30);
    hexagonLines.stroke(controls.color1);
    hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
    hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
    hexagonLines.ellipse(radius + altitude, radius + radius * 1.5, radius * 3, radius * 3);
    hexagonLines.strokeWeight(10);
    hexagonLines.stroke(controls.color2);
    hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
    hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
    hexagonLines.ellipse(radius + altitude, radius + radius * 1.5, radius * 3, radius * 3);
    
    hexagonPattern = createGraphics(radius * 2, radius * 2);
    hexagonPattern.image(hexagonMask, 0, 0);
    hexagonPattern.drawingContext.globalCompositeOperation = "source-in";
    hexagonPattern.image(hexagonLines, 0, 0);
    
}

function resetOscilator() {
    let sinO = new p5.SinOsc();
    let triO = new p5.TriOsc();
    let sqrO = new p5.SqrOsc();
    let sawO = new p5.SawOsc();
    
    let oscList = [sinO, triO, sqrO, sawO];
    
    osc = oscList[val];
    //p5.SinOsc, p5.TriOsc, p5.SqrOsc, or p5.SawOsc
    
    // Instantiate the envelope
    envelope = new p5.Envelope();
    
    // set attackTime, decayTime, sustainRatio, releaseTime
    envelope.setADSR(0.001, 0.5, 0.7, 0.5);
    
    // set attackLevel, releaseLevel
    envelope.setRange(1, 0);
}

function mySelectOption() {
    if (controls.oscMode == 'Sin') {
        val = 0;
    } else if (controls.oscMode == 'Tri') {
        val = 1;
    } else if (controls.oscMode == 'Sqrt') {
        val = 2;
    } else if (controls.oscMode == 'Saw') {
        val = 3;
    }
    resetOscilator();
}

function mousePressed() {
    interactRotateMusic();
}

function touchStarted() {
    interactRotateMusic();
}

function keyPressed() {
    if (keyCode === 83) {
        save('tantrix-pattern.jpg');
    }
}

function interactRotateMusic() {
    let closestIndex = 0;
    let closestDistance = 9999;
    hexagons.forEach((hexagon, index) => {
                     let d = dist(mouseX, mouseY, hexagon.x + radius, hexagon.y + radius);
                     if (d < closestDistance) {
                     closestDistance = d;
                     closestIndex = index;
                     }
                     });
    rotations[closestIndex] += TWO_PI / 6;
    
    textIni = false;
    
    osc.start();
    let midiValue = scaleArray[int(random(0, 7))];
    let freqValue = midiToFreq(midiValue);
    osc.freq(freqValue);
    envelope.play(osc, 0, 0.1);
}
