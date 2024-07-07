int numTypes;
int colorStep;
int numParticles = 1000;
ArrayList<Particle> swarm;

float [][] forces;
float [][] minDistances;
float [][] radii;

void setup() {
  size(window.innerWidth, window.innerHeight);
  //fullScreen();
  colorMode(HSB, 360, 100, 100);
  noStroke();

  numTypes = int(random(2, 6));
  colorStep = 360 / numTypes;
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

  for (Particle p : swarm) {
    p.update();
    p.display();
  }
}

void mousePressed(){
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
    position = new PVector(random(width), random(height));
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
        direction = new PVector(p.position.x, p.position.y);
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
          PVector force = new PVector(direction.x, direction.y);
          force.mult(abs(forces[type][p.type]) * (-3));
          force.mult(map(dis, 0, minDistances[type][p.type], 1, 0));
          force.mult(K);
          totalForce.add(force);
        }
        if(dis <radii[type][p.type]){
        PVector force = new PVector(direction.x, direction.y);
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
    fill(this.type * colorStep, 100, 100);
    ellipse(this.position.x, this.position.y, 5, 5);
  }
}
