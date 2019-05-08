/**
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018 by Thomas Diewald (https://www.thomasdiewald.com)
 *
 *   Source: https://github.com/diwi/p5.EasyCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 * 
 * 
 * explanatory notes:
 * 
 * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg 
 * and combines new useful features with the great look and feel of its parent.
 * 
 * 
 */
 
/*
 *  From the Coding Challenge #144:
 *  https://thecodingtrain.com/CodingChallenges/144-black-hole-visualization.html
 *
 *  Base upon Black Hole by Jase Daggett:
 *  https://github.com/MrMusAddict
 */

let easycam;

particles = [];

let controls = {
type: 'Cylinder',
c:  30,
G:  6,
m: 5000,
Reset: function(){
    //removeElements();
    for (let i=particles.length-1; i>=0; i-=1){
        particles.splice(i,1);
    }
    initSketch();
    //redraw();
},
};


//let c = 30;
//let G = 6;
let dt = 0.09;

let pCount = 3200;

let m87;



function setup() {
    
    let gui = new dat.GUI({
                          width: 320
                          });
    gui.close();
    gui.add(controls, 'type', ['Cylinder', 'Disk', 'Spiral', 'Flat-Square', 'Flat-Disk', 'Straight-Line']).name("Type").onChange(controls.Reset);
    gui.add(controls, 'c', 15, 60).step(0.1);
    gui.add(controls, 'G', 6, 30).step(0.1);
    gui.add(controls, 'm', 1, 10000).step(0.1);
    gui.add(controls, 'Reset');
    gui.add(this, 'info').name("Info");
    //gui.add(this, 'backHome').name("Back Home");
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  	//let canvas = createCanvas(1000, 1000, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 1000});
    
    initSketch();
}

function initSketch(){
    
    for( let i = 0; i < pCount; i++) {
        let a = random(TWO_PI);
        let r = 400.0 * sqrt(random(1.0));
        
        if(controls.type == 'Disk'){
            // Disco Ball
            particles.push(new Photon(createVector(500, 300.0*i/pCount*cos(TWO_PI*100.0*i/pCount), 300.0*i/pCount*sin(TWO_PI*100.0*i/pCount)) ) );
        }if(controls.type == 'Cylinder'){
            // Cylinder
            particles.push(new Photon(createVector(random(800)+500, r*cos(a), r*sin(a)) ) );
        }if(controls.type == 'Spiral'){
            // Spiral
            particles.push(new Photon(createVector( 500, 300.0*i/pCount*cos(TWO_PI*8.0*i/pCount), 300.0*i/pCount*sin(TWO_PI*8.0*i/pCount))));
        }if(controls.type == 'Flat-Square'){
            // Flat Square
            particles.push(new Photon(createVector(500, random(600)-300, random(600)-300)));
        }if(controls.type == 'Flat-Disk'){
            // Flat Disc
            particles.push(new Photon(createVector(500, r*cos(a), r*sin(a))));
        }if(controls.type == 'Straight-Line'){
            // Straigt Line
            particles.push(new Photon(createVector(500, 0, r*sin(a))));
        }
    }
    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
}

function draw(){
    
    cursor(HAND);
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    m87 = new BlackHole(0, 0, 0, controls.m);
    
    m87.show();

  for (let  p of particles) {
    m87.pull(p); 
    p.update();
    p.show();
  }
    
}

function info() {
    window.location.href = "https://www.asc.ohio-state.edu/orban.14/stemcoding/blackhole.html";
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}
