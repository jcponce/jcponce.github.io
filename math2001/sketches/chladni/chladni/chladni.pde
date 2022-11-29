// A fork of Chladni Patterns by Konstantin Makhmutov
// https://openprocessing.org/user/56835?view=sketches&o=11
// CreativeCommons Attribution ShareAlike

// This version by Juan Carlos Ponce Campuzano
// 30/Nov/2022

float[][] p, v;
float f1 = 0.01, f2 = 0.02, f3 = 0.03;
int[][] unicoord;
int widt, heigh;
int halfWidth, halfHeight;

float vel;

void setup() {
  size(410, 410);
  colorMode(RGB, 1);
  background(1);
  
  widt = width-1;
  heigh = height-1;
  
  halfWidth = width/2;
  halfHeight = height/2;
  
  p = new float[width][height];
  v = new float[width][height];
  
  unicoord = new int[width][height];
  int pixel = 0;
  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      unicoord[x][y] = pixel++;
    }
  }
  cursor(HAND);
  
  loadPixels();
}

void draw() {
  vel = 1;
  v[halfWidth][halfHeight] = 0;
	p[halfWidth][halfHeight] = (sin(frameCount * f1 * vel) + sin(frameCount * f2 * vel) + sin(frameCount * f3 * vel)) * 8;
  
  for (int x = 1; x < widt; x++) {
    for (int y = 1; y < heigh; y++) {
      v[x][y] += (p[x-1][y] + p[x+1][y] + p[x][y-1] + p[x][y+1]) * 0.25 - p[x][y];
    }
  }
  
  for (int x = 1; x < widt; x++) {
    for (int y = 1; y < heigh; y++) {
      p[x][y] += v[x][y];
      pixels[unicoord[x][y]] = color(1 - abs(constrain(p[x][y], -1, 1)));
    }
  }
  
  updatePixels();
}

void mousePressed() {
  for (int x = 1; x < widt; x++) {
    for (int y = 1; y < heigh; y++) {
      v[x][y] = 0;
      p[x][y] = 0;
    }
  }
  
  f1 = random(0.005, 0.05);
  f2 = random(0.005, 0.05);
  f3 = random(0.005, 0.05);
  vel = random(0.5, 3);
}