function parametricCurve(){
 let func = seriesF;
    strokeWeight(3);
    stroke(1);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    for (let k = -180; k < 180; k++) {
      let vs = func(CPos, CNeg, radians(k), slider.value());
      //centerX[0], centerX[0], 
      vertex(centers[0].x + vs.x, -(centers[0].y + vs.y));
    }
    endShape(CLOSE);
    textSize(17);
    strokeWeight(1);
    stroke(0);
    fill(1);
    text('Parametric curve with n=' + round(slider.value() + 1) + ' terms', -70, -270);
 
}


function seriesF(list1, list2, angle, index) {
  let sumX = 0;
  let sumY = 0;
  let i = 1;
  while (i < index + 1) {
    sumX += cos(i * angle) * list1[i - 1].x - sin(i * angle) * list1[i - 1].y + cos(-i * angle) * list2[i - 1].x - sin(-i * angle) * list2[i - 1].y;
    sumY += cos(i * angle) * list1[i - 1].y + sin(i * angle) * list1[i - 1].x + cos(-i * angle) * list2[i - 1].y + sin(-i * angle) * list2[i - 1].x;
    i++
  }
  return createVector(sumX, sumY);
}