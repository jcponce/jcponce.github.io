// Original code by Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Recaman Sequence Music
// https://youtu.be/pYnaBQgnARQ

// Check also Alex Bellos and Edmund Harriss' work:
// https://www.amazon.com/dp/1615193677/ref=cm_sw_em_r_mt_dp_U_GlwJCbG1ZXYQ8


// settings and presets
let parDef = {
Sequence: 'Recaman',
attackLevel : 1,
releaseLevel : 0,
attackTime : 0.01,
decayTime : 0.1,
susPercent : 0.5,
releaseTime : 0.5,
PresetValues : function(){
    this.attackTime = 0.01;
    this.decayTime = 0.1;
    this.susPercent = 0.5;
    this.releaseTime = 0.5;
    updateScketch();
},
ApplyChanges: updateScketch,
Reset : resetC,
};

let numbers = [];
let count = 1;
let sequence = [];
let index = 0;

let scl = 0;

let arcs = [];

let biggest = 0;

let osc;

let hu = 0;

let clear = false;

function backHome () {
    window.location.href = "https://jcponce.github.io/#sketches";
}

class Arc {
    constructor(start, end, dir) {
        this.start = start;
        this.end = end;
        this.dir = dir;
        this.hu = 0;
    }
    
    update() {
        if(this.hu >= 355) {
            this.hu = 0;
        }
        else {
            this.hu++;
        }
    }
    
    show() {
        let diameter = abs(this.end - this.start);
        let x = (this.end + this.start) / 2;
        stroke(this.hu,100,100);
        strokeWeight(0.5);
        noFill();
        if (this.dir == 0) {
            arc(x, 0, diameter, diameter, PI, 0);
        } else {
            arc(x, 0, diameter, diameter, 0, PI);
        }
    }
    
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(5);
    colorMode(HSB, 360, 100, 100);
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Sequence');
    //gui.add(parDef, 'attackLevel'  , 0, 5 , 1 ).listen();
    //gui.add(parDef, 'releaseLevel'  , 0, 5 , 1 ).listen();
    gui.add(parDef, 'attackTime'  , 0, 0.07 , 0.001).listen();
    gui.add(parDef, 'decayTime'  , 0, 1 , 0.001 ).listen();
    gui.add(parDef, 'susPercent'  , 0, 1 , 0.001 ).listen();
    gui.add(parDef, 'releaseTime'  , 0, 1 , 0.001 ).listen();
    gui.add(parDef, 'ApplyChanges');
    gui.add(parDef, 'PresetValues');
    gui.add(parDef, 'Reset');
    gui.add(this, 'backHome').name("Go Back Home");
    gui.close();
    
    updateScketch();
    
    numbers[index] = true;
    sequence.push(index);
    
}

function updateScketch(){
    
    env = new p5.Env();
    env.setADSR(parDef.attackTime, parDef.decayTime, parDef.susPercent, parDef.releaseTime);
    env.setRange(parDef.attackLevel, parDef.releaseLevel);
    
    osc = new p5.Oscillator();
    osc.setType('triangle');
    osc.amp(env);
    osc.start();
    
}


function step() {
    let next = index - count;
    if (next < 0 || numbers[next]) {
        next = index + count;
    }
    numbers[next] = true;
    sequence.push(next);
    
    let a = new Arc(index, next, count % 2);
    arcs.push(a);
    index = next;
    
    let n = (index % 25) + 24;
    let freq = pow(2, (n - 49) / 12) * 440;
    osc.freq(freq);
    env.play();
    
    if (index > biggest) {
        biggest = index;
    }
    count++;
}

function resetC(){
    
    if(clear == false){
        clear = true;
    }else{
        clear = false;
    }
    
    
}

function draw() {
    step();
    translate(0, height / 2);
    scl = lerp(scl, width / biggest, 0.1);
    scale(scl);
    background(0);
    
    for (let a of arcs) {
        a.update();
        a.show();
    }
    
    
    if (count > windowWidth) {
        noLoop();
    }
    
    if(clear==true){
        fill(0);
        noStroke();
        for (let i = numbers.length-1; i>=1; i--) {
            numbers.splice(i,1);
        }
        for (let i = sequence.length-1; i>=0; i--) {
            sequence.splice(i,1);
        }
        for (let i = arcs.length-1; i>=0; i--) {
            arcs.splice(i,1);
        }
        index = 0;
        count = 1;
        biggest = 0;
        scl = 0;
        
        rect(0, -height/2, width, height);
        clear=false;
    }
}
