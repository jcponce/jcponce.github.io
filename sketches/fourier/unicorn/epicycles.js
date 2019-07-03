let centers = [];
let arrayAux = [];
let path = [];

function epicycles(){
  let cx0 = C[(size + 1) / 2 - 1].x;
    let cy0 = C[(size + 1) / 2 - 1].y;
    centers[0] = createVector(cx0, cy0);

    stroke(1 / centers.length, 1, 1);
    strokeWeight(1.3);
    noFill();
    ellipse(centers[0].x, -centers[0].y, 2 * Rho[sortedNumbers[0] - 1]);

    // I need the centers for the rest of the epicycles.
    for (let k = 1; k <= size - 1; k++) {
      let sumcX = cx0;
      let sumcY = cy0;
      let i = 0;
      while (i <= k - 1) {
        sumcX += Rho[sortedNumbers[i] - 1] * cos(Ang[sortedNumbers[i] - 1] * PI / 180 + angle * K[sortedNumbers[i] - 1]);
        sumcY += Rho[sortedNumbers[i] - 1] * sin(Ang[sortedNumbers[i] - 1] * PI / 180 + angle * K[sortedNumbers[i] - 1]);

        i++;
      }
      centers[k] = createVector(sumcX, sumcY);
    }

    // The rest of the epicycles.
    for (let i = 1; i < 2 * slider.value(); i++) {
      stroke(4 * i / (size), 1, 1);
      let cX = centers[i].x;
      let cY = centers[i].y;

      ellipse(cX, -cY, 2 * Rho[sortedNumbers[i] - 1]);

    }

    stroke(0.88);
    for (let k = 0; k < 2 * slider.value(); k++) {
      //stroke((4*k ) / (2 * kMax), 1, 1);
      line(centers[k].x, -centers[k].y, centers[k + 1].x, -centers[k + 1].y);
    }

    //print(centers);

    //The path traced by the epicycles.
    
    path.push(createVector(centers[2 * slider.value()].x, centers[2 * slider.value()].y));

    strokeJoin(ROUND);
    stroke(1);
    strokeWeight(3);
    noFill();
    beginShape();
    for (var pos of path) {
      vertex(pos.x, -pos.y);
    }
    endShape();
    textSize(17);
    strokeWeight(1);
    stroke(0);
    fill(1);
    text('' + round(2 * slider.value()) + ' orbits', 0, -270);

}