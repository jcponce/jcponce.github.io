int lim = 2;
double t = 0;

void setup() {
  size(350, 350);
  colorMode(HSB, 100, 100, 100);
  //noLoop();
}

void draw() {
  double mx = map(mouseX, 0, width, -lim, lim);
  double my = map(mouseY, height, 0, -lim, lim);
	double Re = (x, y, z) => sin(10*sqrt(pow(x-(mx),2) + pow(y-(my),2)) - z)+sin(10*sqrt(pow(x-(1),2) + pow(y-(0),2)) - z);
  
	loadPixels();

	for (int xp = 0; xp < width; xp++) {
    for (int yp = 0; yp < height; yp++) {
      double x, y;
      x = map(xp, 0, width, -lim, lim);
      y = map(yp, height, 0, -lim, lim);
			double h = map(Re(x,y, frameCount*0.3), -1, 1, 0, 100);
			set(xp, yp, color(1, 0.5, h));
    }
  }
  updatePixels();

}