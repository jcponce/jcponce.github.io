let T = [];
let C = [];
let CPos = [];
let CNeg = [];
let COrd = [];
let Rho = [];
let indexRho = [];
let sortedNumbers = []; // I did it.
let Ang = [];
let K = [];


function initialValues(){

for (let i = 0; i < 2 * n + 1; i++) {
    T[i] = 2 * PI * i / (2 * n + 1);
  }

  for (let k = 0; k < 2 * n + 1; k++) {
    sumCx = 0;
    sumCy = 0;
    let j = 0;
    while (j < size) {
      let scale = 0.7;
      let COSX = cos((k - n) * T[j]) * scale * data.getNum(j, 'x');
      let SINX = sin((k - n) * T[j]) * scale * data.getNum(j, 'y');
      let valX = 1 / size * (COSX + SINX);
      sumCx += valX;
      let COSY = cos((k - n) * T[j]) * scale * data.getNum(j, 'y');
      let SINY = sin((k - n) * T[j]) * scale * data.getNum(j, 'x');
      let valY = 1 / size * (COSY - SINY);
      sumCy += valY;
      j++;
    }
    C[k] = createVector(sumCx, sumCy);
  }

  for (i = 0; i < size - ((size + 1) / 2); i++) {
    let posx = C[i + (size + 1) / 2].x;
    let posy = C[i + (size + 1) / 2].y;
    CPos[i] = createVector(posx, posy);
  }


  for (i = 0; i < size - ((size + 1) / 2); i++) {
    let negx = C[i].x;
    let negy = C[i].y;
    CNeg[i] = createVector(negx, negy);
  }

  reverse(CNeg);

  //print(CPos.length);

  for (i = 0; i < 2 * (n); i++) {
    let cond = floor(i / 2);
    if (i === 0) {
      COrd[i] = createVector(CPos[cond].x, CPos[cond].y); //even
    } else if (i % 2 === 0) {
      COrd[i] = createVector(CPos[cond].x, CPos[cond].y); //even
    } else {
      COrd[i] = createVector(CNeg[cond].x, CNeg[cond].y); //odd
    }

  }

  for (i = 0; i < size - 1; i++) {
    let cordx = COrd[i].x;
    let cordy = COrd[i].y;
    Rho[i] = dist(0, 0, cordx, cordy);
    if (atan2(COrd[i].y, COrd[i].x) < 0) {
      Ang[i] = (atan2(cordy, cordx) + 2 * PI) * 180 / (PI); //(PI - atan2(CCordY[i], CCordX[i]) )/(2*PI);
    } else {
      Ang[i] = atan2(cordy, cordx) * 180 / (PI);
    }
  }

  indexRho = make2Darray(size - 1, 2);
  for (var ir = 0; ir < size - 1; ir++) {
    for (var jr = 0; jr < 2; jr++) {
      if (jr == 1) {
        indexRho[ir][jr] = ir + 1;
      } else {
        indexRho[ir][jr] = Rho[ir];
      }

    }
  }

  for (let k = 0; k < size - 1; k++) {
    sortedNumbers[k] = indexRho.sort(sortFunction)[k][1];
  }

  reverse(sortedNumbers);

  for (i = 0; i < 2 * n; i++) {
    let seq = ceil((i + 1) / 2) * pow((-1), (i + 2));
    K[i] = seq;
  }

  //print(sortedNumbers);
  
}