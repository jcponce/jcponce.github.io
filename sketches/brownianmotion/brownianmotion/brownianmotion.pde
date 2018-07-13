int numBalls = 800;
int numRedballs = 40;
Ball[] balls = new Ball[numBalls];

color c = color(255,(int)random(15,20));

boolean setcolor = false;

void setup()
{
  size(500,500);
  
  for(int i=0;i<numBalls;i++)
  {
    float r = random(1,4);
    balls[i] = (
      new Ball(
        (int)random(r,width-r),
        (int)random(r,height-r),
        r,i,balls
      )
    );
  }
}

void draw()
{
  background(0);
  
  noFill();
  stroke(190);
  strokeWeight(4);
  rect(0,0,width,height);
  
  
  for (int i=0;i<numBalls;i++)
  {
    balls[i].collide();
    balls[i].move();
    balls[i].display();
    
  }
}

void mousePressed(){
if(!setcolor){
   c = color(255,255,255,(int)random(200,220));
   setcolor = true;
}
else{
   c = color(255,255,255,(int)random(15,20));
   setcolor = false;
}

}

class Ball
{
  float x, y;
  float bx = 1, by = 1;
  float r;
  
  float xt, yt;
  
  color d = color(0, 255, 255,(int)random(230,255));
  
  float spring = 0.1;
  float gravity = 0.0;
  float friction = 0.995;
  int id;
  Ball[] others;
  
  Ball(float x,float y,float r,int id,Ball[] others)
  {
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.id = id;
    this.others = others;
    
    this.xt = random(-1,1)*0.125;
    this.yt = random(-1,1)*0.125;
  }
  
  void collide()
  {
    int k = id+1;
    
    for (int i=k; i<others.length; i++)
    {
      int ii = (i+k)%others.length;
      
      float bx = others[i].x, by = others[i].y;
      float dx = bx-x;
      float dy = by-y;
      
      float dist = sqrt(dx*dx+dy*dy);
      float md = (float)others[i].r+(float)r;
      
      if (dist <= md)
      {
        float ang = atan2(dy,dx);
        float tx = x+cos(ang)*md;
        float ty = y+sin(ang)*md;
        float ax = (tx-others[i].x)*spring;
        float ay = (ty-others[i].y)*spring;
        xt -= ax; yt -= ay;
        others[i].xt += ax;
        others[i].yt += ay;
      }
      
      if (dist <= md+40)
      {
        stroke(16,16,255,255);
        strokeWeight(1);
        //line(others[i].x,others[i].y,x,y);
      }
    }
  }
  
  void move()
  {
    yt += gravity;
    x += xt; y += yt;
    
    if (x > (width-r))
    {
      x = width-r;
      xt *= -bx*friction;
    }
    else if (x < r)
    {
      x = r;
      xt *= -bx*friction;
    }
    if (y > (height-r))
    {
      y = height-r;
      yt *= -by*friction;
    }
    else if (y < r)
    {
      y = r;
      yt *= -by*friction;
    }
  }
  
  void display()
  {
    ellipseMode(RADIUS);
    noStroke();
    if(this.id<numBalls-numRedballs){
    fill(c);
    } else
    fill(d);
    ellipse(x,y,r,r);
  }
}
