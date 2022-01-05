var mouse = null;
var start = false;


function setup() {
  createCanvas(windowWidth, 500);
    
  b2newWorld(30, createVector(0, 9.8));
  var g = new b2Body(
    'edge', 
    false, 
    v(0, height - 20), 
    [
     v(0, -80), 
     v(400, -30), 
     v(width, 0), 
     v(width, -80)
    ]);
  g.display(ground);
  
  
}

function draw() {
  background(220);
  if(start==false){
    fill(220);
    noStroke();
    rect(0,0, 2* width, 2* height);
    textAlign(CENTER);
    textSize(28);
    fill(0);
    noStroke();
    
     text("Click here to Start!", width / 2, height / 2);
     } else{
       
       
       
  b2Update();
  b2Draw(true);
  if (mouse != null) mouse.setTarget(v(mouseX, mouseY));
  b2Draw(true);
     
     }
  
  //console.log(grav.value());
}

function keyTyped() {
  var t;
  if (key == 'm' || key == 'M') {
    t = new b2Body('box', true, v(width / 2, 0), v(40, 80));
    t.display(attr1, 0);
  } else if (key == 'n' || key == 'N') {
    t = new b2Body('box', true, v(width / 2, 0), v(30, 20));
    t.display(attr1, 0);
    
  } else if(key == 'x' || key == 'X'){
   t = new b2Body('box', true, v(width / 2, 0), v(40, 80), 1, 0, 0.1);
    t.display(attr, 0);
  } else if(key == 'z' || key == 'Z'){
  t = new b2Body('box', true, v(width / 2, 0), v(30, 20), 1, 0, 0.1);
    t.display(attr, 0);
  } if(key == 'b' || key == 'B'){
  t = new b2Body('circle', true, v(width / 2, 0), v(30, 20), 1, 0.5, 0.6);
    t.display(attr2, 0);
  }

}

function mousePressed() {
  
  var b = b2GetBodyAt(mouseX, mouseY);
  if (b == null) return;
  mouse = b;
  b2Joint("mouse", null, b, {
    xy: v(mouseX, mouseY)
  });
}

function mouseReleased() {
  
  if (mouse != null) mouse.destroyJoint();
  mouse = null;
  
}


function v(x, y) {
  
  return createVector(x, y);
  
}

function attr(body, fixture, position) {
  
  fill(76, 87, 255);
  stroke(0);
  strokeWeight(0.5);
  b2Display(body, fixture, position);

}

function attr1(body, fixture, position) {

  fill(255, 0, 0);
  stroke(0);
  strokeWeight(0.5);
  b2Display(body, fixture, position);

}

function attr2(body, fixture, position) {

  fill(150);
  stroke(0);
  strokeWeight(0.5);
  b2Display(body, fixture, position);

}


var ground = function(body, fixture, pos) {

  stroke(255, 0, 0);
  strokeWeight(4);
  b2Display(body, fixture, pos);
  
}

function mouseClicked() {
  start = true;
}