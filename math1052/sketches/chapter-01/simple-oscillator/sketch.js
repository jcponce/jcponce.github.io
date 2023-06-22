/*
Based upon Mor3s' code: 
https://editor.p5js.org/Mor3s/sketches/LP_0x2Tqe
*/

let y = 100;
let velocity = 0;
let restLength = 200;
let k=0.009;
let wave = [];
let slider;
let friction = 1;

function setup() {
  createCanvas(750, 400);
  
}

function animate() {
  clear();
  velocity = 0;
  restLength = restLengthslider.value();
  wave = [];
  
  k = Kslider.value();
  friction = frictionslider.value();
  y = Y0slider.value();
}

function draw() {
  
  
  background(112, 50, 126);
  push();
  translate(0,0)
  springCurve(y-40, 0, 100);
  pop();
  noStroke();
  fill(45, 197, 244);
  circle(100, y, 64);
  stroke(0);
  strokeWeight(4);
  line(100, y-40, 100, y-32);
  strokeWeight(1);
  let x = y - restLength;
  let force = - k * x;
  
  velocity += force
  y += velocity
  
  velocity *= friction;
  wave.unshift(y);
  
  
  
  translate(100,0);
  beginShape();
  noFill();
  stroke(255);
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]); 
  }
  endShape();
  
  
  if (wave.length > 1000) {
    wave.pop(); 
  }
  
  /*
  text("Friction coeficient:  " +frictionslider.value(), 100, 100)
  text("k:  " +Kslider.value(), 100, 200)
  text("y_0:  " +Y0slider.value(), 100, 300)
  text("ResLength:  " +restLengthslider.value(), 100,400)
  */
}

function springCurve(y0, y1, A){
  //2sin(10 * 2π (t - y_1) / (y_0 - y_1)) + x(A2)
  stroke(0);
  strokeWeight(4);
  noFill();
  beginShape();
  for(let k = -y1; k<y0; k=k+0.01){
    let x = (20* sin( 10*PI*(k - y1) / (y0 - y1)) + A);
    let y = k;
    vertex(x, y);
    
  }
  endShape();
  
}

function auxiliarStuff(){
  frictionslider = createSlider(0.9, 1, 1, 0.001);
  frictionslider.input(animate);
  
  
  Kslider = createSlider(0, 0.1, 0.009, 0.001);
  Kslider.position(0, 425);
  Kslider.input(animate);
  Klabel = createP("K constant");
  Klabel.position(185, 410);
  
  Y0slider = createSlider(0, 400, 100, 1);
  Y0slider.position(0, 455);
  Y0slider.input(animate);
  Y0label = createP("y0");
  Y0label.position(185, 440);
  
  restLengthslider = createSlider(0, 400, 200);
  restLengthslider.position(0, 485);
  restLengthslider.input(animate);
  restLengthlabel = createP("restLength");
  restLengthlabel.position(185, 470);

  let h5 = createElement('h1', "Hooke's Law :");
  h5.style('font-size', '50px');
  h5.position(370, 370);
  
  let p = createP('F = − k x');
  p.style('font-size', '30px');
  p.position(440, 450);
}