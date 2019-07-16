PVector windowCenter;
float windowWidth;
int mandelbrotResolution;
boolean drawO, drawJ;
PGraphics mandelbrotImage;

void setup() {
size(800, 400);
colorMode(HSB, 255);
windowCenter = new PVector(-0.5, 0);
windowWidth = 1.5;
mandelbrotResolution = 200;
drawMandelbrot();
drawO = true;
drawJ = true;
frameRate(60);
}

void draw() {
image(mandelbrotImage, 0, 0);

if (drawO) {
drawOrbit();
}
if (drawJ) {
drawJulia();
}
}

void drawJulia() {
loadPixels();
PVector virtualPos, actualPos, CfromMandelbrot;
float xt, yt;

PVector jwindowCenter = new PVector(0, 0);
float jwindowWidth = 2;

actualPos = new PVector(mouseX, mouseY);
xt = map(actualPos.x, 0, width-400, windowCenter.x - windowWidth, windowCenter.x + windowWidth);
yt = map(actualPos.y, height, 0, windowCenter.y - windowWidth, windowCenter.y + windowWidth);

CfromMandelbrot = new PVector(xt, yt);
for (int x = 400; x < width; x++) {
for (int y = 0; y < width; y++) {
xt = map(x, 400, width, jwindowCenter.x - jwindowWidth, jwindowCenter.x + jwindowWidth);
yt = map(y, height, 0, jwindowCenter.y - jwindowWidth, jwindowCenter.y + jwindowWidth);
virtualPos = new PVector(xt, yt);

PVector z, zn;
z = virtualPos;

int count = 0;
while ((count < mandelbrotResolution) && (dist(0, 0, z.x, z.y) < 2)) {
zn = mandelbrotCalculation(z, CfromMandelbrot);
z = zn;
count++;
}
float h;
if (count < mandelbrotResolution) {
h = map(count, 0, mandelbrotResolution/10, 0, 125)%125;
} else {
h = map(dist(z.x, z.y, 0, 0), 0, 2, 125, 255);
}
pixels[x + width*y] = (color(h, 255, 255));
}
}
updatePixels();
}

void drawOrbit() {
PVector virtualPos, actualPos, mouseC;
ArrayList<PVector> orbit = new ArrayList<PVector>();
float xt, yt;

actualPos = new PVector(mouseX, mouseY);
orbit.add(actualPos);
xt = map(actualPos.x, 0, width-400, windowCenter.x - windowWidth, windowCenter.x + windowWidth);
yt = map(actualPos.y, height, 0, windowCenter.y - windowWidth, windowCenter.y + windowWidth);
virtualPos = new PVector(0, 0);
mouseC = new PVector(xt, yt);

int count = 0;
while (count < mandelbrotResolution && dist(virtualPos.x, virtualPos.y, 0, 0) < 10) {
PVector next = mandelbrotCalculation(virtualPos, mouseC);
xt = map(next.x, windowCenter.x - windowWidth, windowCenter.x + windowWidth, 0, width-400);
yt = map(next.y, windowCenter.y - windowWidth, windowCenter.y + windowWidth, height, 0);
actualPos = new PVector(xt, yt);
orbit.add(actualPos);
virtualPos = next;
count++;
}

beginShape();
noFill();
if (count == mandelbrotResolution) {
stroke(255);
} else {
stroke(0);
}
strokeWeight(0.5/300*width);
for (PVector P : orbit) {
vertex(P.x, P.y);
}
endShape();

}




void mousePressed() {
float xp, yp;

xp = map(mouseX, 0, width-400, windowCenter.x - windowWidth, windowCenter.x + windowWidth);
yp = map(mouseY, height, 0, windowCenter.y - windowWidth, windowCenter.y + windowWidth);
windowCenter = new PVector(xp, yp);


if (mouseButton == LEFT) {
//zoom in
windowWidth /= 1.5;
} else {
windowWidth *= 1.5;
}
println("new center: (" + str(windowCenter.x) + ", " + str(windowCenter.y) + " i) and new window width of " + str(windowWidth));
drawMandelbrot();
}


void keyPressed() {
if (key == ' ') {
//reset window
setup();
println("reset window");
} else if (keyCode == UP) {
mandelbrotResolution *= 2;
println("double resolution to: " + str(mandelbrotResolution));
drawMandelbrot();
println("render done");
} else if (keyCode == DOWN) {
mandelbrotResolution /= 2;
println("halve resolution to: " + str(mandelbrotResolution));
drawMandelbrot();
println("render done");
} else if (key == 'o' || key == 'O') {
if (drawO) {
drawO = false;
} else {
drawO = true;
}
} else if (key == 'j' || key == 'J') {
if (drawJ) {
drawJ = false;
} else {
drawJ = true;
}
}
}



void drawMandelbrot() {
mandelbrotImage = createGraphics(width, height);
mandelbrotImage.beginDraw();
mandelbrotImage.loadPixels();
for (int xp = 0; xp < width; xp++) {
for (int yp = 0; yp < height; yp++) {
float x, y;
x = map(xp, 0, 400, windowCenter.x - windowWidth, windowCenter.x + windowWidth);
y = map(yp, height, 0, windowCenter.y - windowWidth, windowCenter.y + windowWidth);

PVector c = new PVector(x, y);

PVector z, zn;
z = new PVector(0, 0);

int count = 0;
while ((count < mandelbrotResolution) && (dist(0, 0, z.x, z.y)<2)) {
zn = mandelbrotCalculation(z, c);
z = zn;
count++;
}
float h;
if (count < mandelbrotResolution) {
h = map(count, 0, mandelbrotResolution/10, 0, 125)%125;
} else {
h = map(dist(z.x, z.y, 0, 0), 0, 2, 125, 255);
}
mandelbrotImage.pixels[xp + yp*width] = color(h, 255, 255);
}
}

mandelbrotImage.updatePixels();
mandelbrotImage.endDraw();
}

PVector mandelbrotCalculation(PVector z, PVector c) {
PVector o = new PVector(z.x*z.x - z.y*z.y + c.x, 2*z.x*z.y + c.y);
return o;
}
