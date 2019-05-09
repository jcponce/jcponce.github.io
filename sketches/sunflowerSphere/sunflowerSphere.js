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

let easycam;

let Angle = 1.61803398875;
let numP = 1000;

// settings and presets
let parDef = {
Title: 'Points on Sphere',
Angle: 1.61803398875,
Sphere : false,
Points: 500,
xyzAxes: false,
Random: function() { this.Angle = random(0, 2*PI); },
Play: false,
GoldenRatio: function() {
        this.Angle = 1.61803398875;
        this.Points = 1300;
        this.Play = false;
        this.xyzAxes = false;
    },
};

function sourceCode() {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/tree/master/sketches/sunflowerSphere";
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 280
                          });
    gui.add(parDef, 'Title');
    gui.add(parDef, 'Angle'  , 0, 2 * PI , PI/10 ).listen();
    gui.add(parDef, 'Play' ).name("Play").listen();
    gui.add(parDef, 'Points'  , 0, 2200 , 1 ).listen();
    gui.add(parDef, 'Sphere');
    gui.add(parDef, 'Random');
    gui.add(parDef, 'GoldenRatio');
    gui.add(parDef, 'xyzAxes' ).name("Axes").listen();
    
    gui.add(this, 'sourceCode').name("Source Code");
    gui.add(this, 'backHome').name("Back Home");
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 3});
    
    colorMode(HSB, 100);
    
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
    
    rotateX(0.9)
    rotateY(0.0);
    rotateZ(0.3);
    
    //The points are defined by the following coordinates:
    //x = cos(pi * 2 * Angle * ) * sin(acos(1-2 * i/numP)),
    //y = sin(pi * 2 * Angle * i) * sin(acos(1-2* i/numP)),
    //z = cos(acos(1-2 * i/numP))
    
    ambientLight(80);
    pointLight(100, 0, 100, 90, -50, 50);
    
    if(parDef.PlayAngle==true){
        update();
    }
    
    for (let i = 0; i < parDef.Points; i++) {
        let x = cos(PI * 2 * parDef.Angle * i) * sin(acos(1-2 * i/parDef.Points));
        let y = sin(PI * 2 * parDef.Angle * i) * sin(acos(1-2* i/parDef.Points));
        let z = cos(acos(1-2 * i/parDef.Points));
        let hu = map(i, 0, parDef.Points, 0, 100);
        push();
        translate(x, y, z);
        ambientMaterial(hu, 100, 100);
        noStroke();
        sphere(0.015, 16, 16);
        pop();
    }
    
    if(parDef.Sphere == true){
        ambientMaterial(50);
        noStroke();
        sphere(1, 24, 16);
    }
    
    if(parDef.xyzAxes == true){
    // gizmo
        strokeWeight(0.01);
        stroke( 0, 100,  100); line(0,0,0,1,0,0);
        stroke( 30, 100,  100); line(0,0,0,0,1,0);
        stroke( 70, 100,  100); line(0,0,0,0,0,1);
    }
    
    //console.log(parDef.Sphere);
    
    if(parDef.Play == true){
        if(parDef.Angle < 2 * PI){
            parDef.Angle = parDef.Angle + PI/600000;
        }else{
            parDef.Angle = 0;
        }
    }
}

