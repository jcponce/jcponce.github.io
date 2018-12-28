/* Cursor Thief
   Future Data Lab - futuredatalab.com
   Version 1.0 - 2010/08/03 */
   
// Global variables
Thief thief;
int celebrate = 30;
int wait = 10;
PImage mousecursor;
PImage sweatdrop;
PImage heart;

// Setup the Processing Canvas
void setup() {
  size(700, 200);
  thief = new Thief(width*0.5, 170);
  noCursor();
  mousecursor = loadImage("cursorcatcher/cursor.png");
  sweatdrop = loadImage("cursorcatcher/sweatdrop.png");
  heart = loadImage("cursorcatcher/heart.png");
  smooth();
}

// Main draw loop
void draw() {
  background(#b3d9ff);
  stroke(#2b2515);
  line(0, 180, width, 180);
  noStroke();
  fill(#cacd80);
  rect(0, 181, width, height);

  thief.run();
}

class Thief {
  float posx;
  float posy;
  int state;
  boolean animate;
  int reach;
  int stretch;

  Thief(float x, float y) {
    posx = x;
    posy = y;
    state = 0;
    animate = false;
    reach = 0;
    stretch = 0;
  }

  void run() {
    wait--;
    if (wait == 0) {
      wait = 10;
      animate = !animate;
    }    
    action();
    render();
  }

  void action() {
    if (mouseX + mouseY > 0) {
      switch (state) {
        case 0: { // Jumping
          switch (reach) {
            case 0: { // Nothing
              if (dist(mouseX + 5, mouseY + 10, posx, posy) < 40) state = 3; // Cursor is caught
              else if (mouseX < posx - 15) state = 1;
              else if (mouseX > posx + 15) state = 2;
              else if (round(random(100)) == 5) { stretch = 0; reach = 1; }
              break;
            }
            case 1: { // Reaching up >:3
              if (dist(mouseX + 5, mouseY + 10, posx, stretch + posy - 10) < 20) reach = 3;
              else if ((abs(stretch) + 30) > height - mouseY - 10) reach = 2;
              else stretch--;
              break;
            }
            case 2: { // So close...
              if (dist(mouseX + 5, mouseY + 10, posx, stretch + posy - 10) < 20) reach = 3;
              else if (stretch < 0) stretch++;
              else { reach = 0; stretch = 0; }
              break;
            }
            case 3: { // Woot!
              if (stretch < 0) stretch++;
              else { reach = 0; stretch = 0; state = 3; }
              break;
            }
          }
          break;
        }
        case 1: { // Chase left
          posx += (mouseX - posx)*0.02;
          if (dist(mouseX + 5, mouseY + 10, posx, posy) < 40) state = 3; // Cursor is caught
          else if (mouseX <= posx + 15 && mouseX >= posx - 15) state = 0;
          else if (mouseX > posx + 15) state = 2;
          break;
        }
        case 2: { // Chase right
          posx += (mouseX - posx)*0.02;
          if (dist(mouseX + 5, mouseY + 10, posx, posy) < 40) state = 3; // Cursor is caught
          else if (mouseX <= posx + 15 && mouseX >= posx - 15) state = 0;
          else if (mouseX < posx - 15) state = 1;
          break;
        }
        case 3: { // Hide cursor
          if (posx > width + 50) { state = 0; celebrate = 10; }
          else posx += 2;
          break;
        }
      }
    }
  }

  void render() {
    fill(255);
    stroke(0);  
    strokeWeight(3);

    switch (state) {
      case 1: {
        pushMatrix();
        translate(posx, posy);
        ellipse(0, 0, 30, 30);
        // Sweatdrops
        if (!animate) {
          pushMatrix();
          translate(15, -10);
          rotate(-HALF_PI*0.5);
          scale(0.5, 0.5);
          image(sweatdrop, 0, 0);
          popMatrix();
        }
        // Eyes
        strokeWeight(6);
        pushMatrix();      
        translate(-5, -4);
        point(7, 0);
        point(-7, 0);
        popMatrix();
        strokeWeight(3);
        // Hands
        if (animate) {
          pushMatrix();      
          translate(-4, -10);
          ellipse(-15, 0, 15, 15);
          popMatrix();
        }
        else {
          pushMatrix();      
          translate(-6, -8);
          ellipse(-15, 0, 15, 15);
          popMatrix();
        }
        // Feet
        if (animate) {
          pushMatrix();      
          translate(-3, 19);
          arc(-3, 0, 14, 14, PI, TWO_PI);
          line(-9, 0, 3, 0);
          arc(3, 0, 14, 14, PI, TWO_PI);
          line(9, 0, -3, 0);
          popMatrix();
        }
        else {
          pushMatrix();      
          translate(-1, 19);
          arc(-6, 0, 14, 14, PI, TWO_PI);
          line(-12, 0, 0, 0);
          arc(4, 0, 14, 14, PI, TWO_PI);
          line(10, 0, -2, 0);
          popMatrix();
        }
        popMatrix();
        image(mousecursor, mouseX, mouseY);
        break;
      }
      case 2: {
        pushMatrix();
        translate(posx, posy);
        ellipse(0, 0, 30, 30);
        // Sweatdrops
        if (!animate) {
          pushMatrix();
          translate(-25, -10);
          rotate(HALF_PI*0.5);
          scale(0.5, 0.5);
          image(sweatdrop, 0, 0);
          popMatrix();
        }
        // Eyes
        strokeWeight(6);
        pushMatrix();      
        translate(5, -4);
        point(-7, 0);
        point(7, 0);
        popMatrix();
        strokeWeight(3);
        // Hands
        if (animate) {
          pushMatrix();      
          translate(4, -10);
          ellipse(15, 0, 15, 15);
          popMatrix();
        }
        else {
          pushMatrix();      
          translate(6, -8);
          ellipse(15, 0, 15, 15);
          popMatrix();
        }
        // Feet
        if (animate) {
          pushMatrix();      
          translate(3, 19);
          arc(3, 0, 14, 14, PI, TWO_PI);
          line(9, 0, -3, 0);
          arc(-3, 0, 14, 14, PI, TWO_PI);
          line(-9, 0, 3, 0);
          popMatrix();
        }
        else {
          pushMatrix();      
          translate(1, 19);
          arc(6, 0, 14, 14, PI, TWO_PI);
          line(12, 0, 0, 0);
          arc(-4, 0, 14, 14, PI, TWO_PI);
          line(-10, 0, 2, 0);
          popMatrix();
        }
        popMatrix();
        image(mousecursor, mouseX, mouseY);
        break;
      }
      case 3: {
        if (celebrate > 0) {
          celebrate--;
          // Heart
          pushMatrix();
          translate(posx + 5, posy - 30);
          scale(0.3, 0.3);
          image(heart, 0, 0);
          popMatrix();
        }
        pushMatrix();
        translate(posx, posy);
        ellipse(0, 0, 30, 30);
        // Eyes
        strokeWeight(6);
        pushMatrix();      
        translate(5, -4);
        point(-7, 0);
        point(7, 0);
        popMatrix();
        strokeWeight(3);
        // Hands
        if (animate) {
          pushMatrix();      
          translate(4, 0);
          image(mousecursor, 18, -15);
          ellipse(15, 0, 15, 15);
          popMatrix();
        }
        else {
          pushMatrix();      
          translate(6, 0);
          image(mousecursor, 18, -15);
          ellipse(15, 0, 15, 15);
          popMatrix();
        }
        // Feet
        if (animate) {
          pushMatrix();      
          translate(3, 19);
          arc(3, 0, 14, 14, PI, TWO_PI);
          line(9, 0, -3, 0);
          arc(-3, 0, 14, 14, PI, TWO_PI);
          line(-9, 0, 3, 0);
          popMatrix();
        }
        else {
          pushMatrix();      
          translate(1, 19);
          arc(6, 0, 14, 14, PI, TWO_PI);
          line(12, 0, 0, 0);
          arc(-4, 0, 14, 14, PI, TWO_PI);
          line(-10, 0, 2, 0);
          popMatrix();
        }
        popMatrix();
        break;
      }
      default: {
        pushMatrix();
        if (reach > 0) {
          translate(posx, posy);
          if (reach == 3) {
            image(mousecursor, -5, stretch - 30);
          }
          // Arms
          strokeWeight(2);
          pushMatrix();
          translate(0, -15);
          rect(7, 10, 5, stretch - 10);
          rect(-12, 10, 5, stretch - 10);
          for (int i = 0; i > stretch; i--) {
            if (i == 0) {
              strokeWeight(1);
              line(7, i, 12, i);
              line(-12, i, -7, i);
            }            
          }
          popMatrix();
          strokeWeight(3);
          ellipse(0, 0, 30, 30);
        }
        else {
          if (animate) {
            translate(posx, posy);
            ellipse(0, 0, 30, 30);
          }
          else {
            translate(posx, posy - 3);
            ellipse(0, 0, 30, 30);
          }
        }
        // Eyes
        strokeWeight(6);
        pushMatrix();
        translate(0, -7);
        point(7, 0);
        point(-7, 0);
        popMatrix();
        strokeWeight(3);
        // Hands
        if (reach > 0) {
          pushMatrix();
          translate(0, -15);
          ellipse(10, stretch, 15, 15);
          ellipse(-10, stretch, 15, 15);
          popMatrix();
        }
        else {
          pushMatrix();      
          translate(0, -15);
          ellipse(14, stretch, 15, 15);
          ellipse(-14, stretch, 15, 15);
          popMatrix();
        }
        // Feet
        pushMatrix();      
        translate(0, 19);
        arc(10, 0, 14, 14, PI, TWO_PI);
        line(16, 0, 4, 0);
        arc(-10, 0, 14, 14, PI, TWO_PI);
        line(-16, 0, -4, 0);
        popMatrix();
        popMatrix();
        if (reach < 3) image(mousecursor, mouseX, mouseY);
        break;
      }
    }
  }
}
