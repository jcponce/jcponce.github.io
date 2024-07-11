/**
 * Inspired by Terry Soule's Programming Particle Life
 * https://youtu.be/xiUpAeos168?feature=shared
 * 
 * This version by Juan Carlos Ponce Campuzano
 * 7/Jul/2024
 * https://www.dynamicmath.xyz/sketches/particle-life
 * 
 */

int numTypes = 6;
int colorStep = 360 / numTypes;
int numParticles = 1200;
ArrayList<Particle> swarm;

float [][] forces;
float [][] minDistances;
float [][] radii;

float run = 0;

void setup() {
  noCursor();
  fullScreen();
  colorMode(HSB, 360, 100, 100);
  noStroke();
  swarm = new ArrayList<Particle>();
  for (int i = 0; i < numParticles; i++) {
    swarm.add(new Particle());
  }
  forces = new float [numTypes][numTypes];
  minDistances = new float [numTypes][numTypes];
  radii = new float [numTypes][numTypes];
  setParameters();
}

void draw() {
  background(0);

  if (run > 2.0) {
    for (Particle p : swarm) {
      p.update();
      p.display();
    }
  }

  run+=0.01;
  
}

void mousePressed() {
  setParameters();
}

void setParameters() {
  for (int i = 0; i < numTypes; i++) {
    for (int j = 0; j < numTypes; j++) {
      forces[i ][j ] = random(0.3, 1.0);
      if (random(100)<50) {
        forces[i][j]*=-1;
      }
      minDistances[i][j]=random(30, 50);
      radii[i][j]=random(70, 250);
    }
  }
}


float K = 0.05;
float friction = 0.85;

class Particle {

  PVector position;
  PVector velocity;
  int type;

  Particle() {
    float rad = random(100);
    float ang = random(TWO_PI);
    position = new PVector(rad * cos(ang) + width/2, rad * sin(ang)+height/2);
    velocity = new PVector(0, 0);
    type = int(random(numTypes));
  }

  void update() {
    PVector direction = new PVector(0, 0);
    PVector totalForce = new PVector(0, 0);
    PVector acceleration = new PVector(0, 0);
    float dis;
    for (Particle p : swarm) {
      if (p != this) {
        direction.mult(0);
        direction = p.position.copy();
        direction.sub(position);
        if (direction.x>0.5*width) {
          direction.x-=width;
        }
        if (direction.x<-0.5*width) {
          direction.x+=width;
        }
        if (direction.y>0.5*height) {
          direction.y-=height;
        }
        if (direction.y<-0.5*height) {
          direction.y+=height;
        }

        dis = direction.mag();
        direction.normalize();
        if (dis < minDistances[type][p.type]) {
          PVector force = direction.copy();
          force.mult(abs(forces[type][p.type]) * (-3));
          force.mult(map(dis, 0, minDistances[type][p.type], 1, 0));
          force.mult(K);
          totalForce.add(force);
        }
        if (dis <radii[type][p.type]) {
          PVector force = direction.copy();
          force.mult(forces[type][p.type]);
          force.mult(map(dis, 0, radii[type][p.type], 1, 0));
          force.mult(K);
          totalForce.add(force);
        }
      }
    }

    acceleration.add(totalForce);
    velocity.add(acceleration);
    position.add(velocity);
    position.x = (position.x+width)%width;
    position.y = (position.y+height)%height;
    velocity.mult(friction);
  }

  void display() {
    fill(this.type * colorStep, 60, 100);
    circle(this.position.x, this.position.y, 7);
  }
}
