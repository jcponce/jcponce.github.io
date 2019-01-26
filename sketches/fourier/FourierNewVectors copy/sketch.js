/*
 My attempt to approximate curves using the
 Discrete Fourier transform. It took me a long
 time and it is very long since I am not a
 JavaScript expert. Later I will try to write
 a shorter version using better methods.
 I am basically using the math I used to make
 this GeoGebra file: https://ggbm.at/gcqcgjy6
 
 I used another tool to calculate the numbers
 from the file codingtrain.csv. Basically,
 I created an ordered list of points (x,y)
 defining the curve to approximate. A great site
 to create this file is DrawMyData by Robert Grant:
 http://robertgrantstats.co.uk/drawmydata.html
 
 A couple interesting sites which I found very
 useful and helped me to understand the math
 involved are the following:
 https://mathematica.stackexchange.com/questions/171755/how-can-i-draw-a-homer-with-epicycloids
 http://brettcvz.github.io/epicycles/
 
 Last Update 26-Jan-2019: I was able to use less arrays
 by defining p5.vectors. Now the code looks a little
 bit better.
 */

let data;
let angle;
let size = 2;
let n = 2;
let kMax;
let T = [];
let C = [];
let CPos = [];
let CNeg = [];
let COrd = [];
let Rho = [];
let indexRho = [];
let sortedNumbers = []; // I did it.

let path = [];
let points = [];

let sel; // Two view options: 1. Epicyles 2. Approx. curve
let show = true;

let slider;

let K = [];

let Ang = [];

// preload table data
function preload() {
    data = loadTable(
                     'data.csv',
                     'csv',
                     'header');
}

let makeCurve = false;

let cond;
let strkColor = 0.5;

function mouseReleased() {
    if (strkColor == 0.5) {
        strkColor = 0;
    } else {
        strkColor = 0.5;
    }
    if (makeCurve == false) {
        makeCurve = true;
    } else {
        makeCurve = false;
    }
    angle = -PI;
}

function setup() {
    createCanvas(600, 600);
    colorMode(HSB, 1, 1, 1);
    background(0.1);
    
    sel = createSelect();
    sel.position(10, 10);
    sel.option('Epicycles');
    sel.option('Approx. Curve');
    sel.changed(mySelectEvent);
    
    angle = -PI;
    //size = data.getRowCount();
    
    
    //slider = createSlider(1, n, n / 2, 1);
    //slider.position(100, 567);
    //slider.style('width', '400px');
    //slider.changed(emptyArray);
    
}

function initialize(){
   
    
    n = (size - 1) / 2;
    kMax = n;
    
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

let centers = [];
let arrayAux = [];

function draw() {
    
    background(0.1);
    translate(width / 2, height / 2);
    
    if(points.length === 0){
        size = 0;
    }if(points.length % 2 === 0 && points.length > 0){
        size = points.length - 1;
    }else{
        size = points.length;
    }
    
    if(mouseIsPressed){
        
        let xnew = map(mouseX, 0, width, -300, 300);
        let ynew = map(mouseY, height, 0, -300, 300);
        points.push({x: xnew, y: ynew});
        path = [];
    }
    beginShape();
    for(let i=0; i<points.length; i++){
        //let ppos = points[i-1];
        let pos = points[i];
        //ppos = cmap(ppos);
        //pos = cmap(pos);
        stroke(strkColor);
        strokeWeight(3);
        noFill();
        //line(ppos.x, -ppos.y, pos.x, -pos.y);
        vertex(pos.x, -pos.y);
    }
    endShape(CLOSE);
    
    initialize();
    /*
    
    if (show == true && makeCurve == true ) { //If 'show' is true, then draw epicycles.
        
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
        
        stroke(0.8);
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
        
        
    } else {
        // If 'show' is false, then show the curve
        // approximated by adding terms in the
        // Fourier series.
        
        //The approximation curve
        
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
        
        //parametricCurve();
    }*/
    
    angle += 0.009999;
    
    if (angle > 3 * PI) {
        path = [];
        angle = -PI;
    }
}

//Other functions

function mySelectEvent() {
    var item = sel.value();
    if (item == 'Epicycles') {
        show = true;
        angle = -PI;
        path = [];
    } else {
        show = false;
    }
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

function make2Darray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function arrayColumnsSum(array) {
    return array.reduce((a, b) => // replaces two elements in array by sum of them
                        a.map((x, i) => // for every `a` element returns...
                              x + // its value and...
                              (b[i] || 0) // corresponding element of `b`,
                              // if exists; otherwise 0
                              )
                        )
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function emptyArray() {
    path = [];
}
