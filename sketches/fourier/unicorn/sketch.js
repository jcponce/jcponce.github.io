/*
	Inspired by the Coding Challenge #130:
  https://youtu.be/MY4luNgGfms
	
  This is my attempt to approximate curves using the 
  Discrete Fourier transform. It took me a long 
  time since I am not a JavaScript expert.
  I am basically using the same math ideas I used 
  to make this GeoGebra file: https://ggbm.at/gcqcgjy6
  
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
  
  Last Update 27-Jan-2019: I was able to use less arrays
  by defining p5.vectors. Now the code looks a little 
  bit better.
*/

let data;
let angle;
let size;
let n;
let kMax;

// Two view options: 1. Epicyles and 2. Approx. curve
let select;
let show = true;

let slider;

// preload table data
function preload() {
  data = loadTable(
    'data.csv',
    'csv',
    'header');
}

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 1, 1, 1);
  background(0.1);

  angle = -PI;
  size = data.getRowCount();
  n = (size - 1) / 2;
  kMax = n;

  domElements();

  initialValues();

}


function draw() {

  background(0.1);
  translate(width / 2, height / 2);

  if (show == true) { //If 'show' is true, then draw epicycles.

    epicycles();

  } else {
    // If 'show' is false, then show the curve 
    // approximated by adding terms in the 
    // Fourier series.

    //The approximation curve

    parametricCurve();
  }

  angle += 0.009999; //update angle to animate

  if (angle > 3 * PI) {
    path = [];
    angle = -PI;
  }
}

//Other auxiliary functions

function domElements() {
  select = createSelect();
  select.position(10, 10);
  select.option('Epicycles');
  select.option('Approx. Curve');
  select.changed(mySelectEvent);

  slider = createSlider(1, n, n / 2, 1);
  slider.position(100, 558);
  slider.style('width', '400px');
  slider.changed(emptyArray);
}

function mySelectEvent() {
  var item = select.value();
  if (item == 'Epicycles') {
    show = true;
    angle = -PI;
    path = [];
  } else {
    show = false;
  }
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
  angle = -PI;
}
