/* * p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Tantrix pattern Written by Vamos https://www.openprocessing.org/user/65884
 * Original sketch: https://www.openprocessing.org/sketch/744884
 * This version with added sound by Juan Carlos Ponce Campuzano
 * https://jcponce.github.io/
 */

let osc, envelope, fft;

let scaleArray = [58, 60, 62, 64, 65, 67, 69, 71, 72, 74];
let note = 0;
let time;

const radius = 80;
const altitude = Math.sqrt(3) / 2 * radius;
let hexagons, hexagonPattern, rotations;

function setup() {
    createCanvas(windowWidth, windowHeight);
    cursor(HAND);
    blendMode(BLEND);
    let hexagonMask = createGraphics(radius * 2, radius * 2);
    hexagonMask.beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
        let x = sin(a) * radius + radius;
        let y = cos(a) * radius + radius;
        hexagonMask.vertex(x, y);
    }
    hexagonMask.endShape();
    
    let hexagonLines = createGraphics(radius * 2, radius * 2);
    hexagonLines.noFill();
    hexagonLines.strokeWeight(30);
    hexagonLines.stroke(10, 120, 203);
    hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
    hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
    hexagonLines.ellipse(radius + altitude, radius + radius * 1.5, radius * 3, radius * 3);
    hexagonLines.strokeWeight(7);
    hexagonLines.stroke(180, 190, 23);
    hexagonLines.ellipse(radius - altitude, radius - radius / 2, radius, radius);
    hexagonLines.ellipse(radius + altitude * 2, radius, radius * 3, radius * 3);
    hexagonLines.ellipse(radius + altitude, radius + radius * 1.5, radius * 3, radius * 3);
    
    hexagonPattern = createGraphics(radius * 2, radius * 2);
    hexagonPattern.image(hexagonMask, 0, 0);
    hexagonPattern.drawingContext.globalCompositeOperation = "source-in";
    hexagonPattern.image(hexagonLines, 0, 0);
    
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
    
    /*
     Sound effects
     */
    
    let sinO = new p5.SinOsc();
    let triO = new p5.TriOsc();
    let sqrO = new p5.SqrOsc();
    let sawO = new p5.SawOsc();
    let oscList = [sinO, triO, sqrO, sawO];
    //p5.SinOsc, p5.TriOsc, p5.SqrOsc, or p5.SawOsc
    osc = oscList[int(random(0, 3))];
    
    // Instantiate the envelope
    envelope = new p5.Envelope();
    
    // set attackTime, decayTime, sustainRatio, releaseTime
    envelope.setADSR(0.001, 0.5, 0.7, 0.5);
    
    // set attackLevel, releaseLevel
    envelope.setRange(1, 0);
    
    
}

function draw() {
    background(255);
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
        rect(width / 2, height / 2, 250, 200, 20);
        strokeWeight(1);
        fill(50);
        textAlign(CENTER);
        textSize(26);
        text("Click to rotate.", width / 2, height / 2 - 50);
        text("Refresh page to", width / 2, height / 2 - 10);
        text("change oscillator.", width / 2, height / 2 + 20);
        text("Press 'S' to save.", width / 2, height / 2 + 60);
    }
}

let textIni = true;

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

function interactRotateMusic(){
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
    let midiValue = scaleArray[int(random(0, 9))];
    let freqValue = midiToFreq(midiValue);
    osc.freq(freqValue);
    envelope.play(osc, 0, 0.1);
}
