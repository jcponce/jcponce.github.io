/*
Adapted from 
https://openprocessing.org/sketch/1243135
by Tibe Cruze
https://openprocessing.org/user/279949?view=sketches

This version by Juan Carlos Ponce Campuzano
10-Nov-2021
https://jcponce.github.io
*/

setup=()=>{
  W=min(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight);
  stroke(255);
}

draw=()=>{
  background(0);
  translate(width/2,9);
  F=frameCount*0.2;
  for(i=1;i<W*1.6;i++){
    y=sqrt(i*150);
    r=pow(i/W,3)*i/2+150;
    N=noise(i*0.1-F)*99+F*0.02;
    strokeWeight(i*0.01);
    line(cos(N)*r,y+sin(N)*r,cos(N+0.2)*r,y+sin(N+0.2)*r);
  }
}