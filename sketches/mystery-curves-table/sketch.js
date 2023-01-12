/* 
 
Written in p5.js (https://p5js.org/)
Under Creative Commons License
https://creativecommons.org/licenses/by-sa/4.0/

Author: Juan Carlos Ponce Campuzano
Site: https://jcponce.github.io/
Date: 16-July-2020

Inspired from Frank Farris' book:
Creating Symmetry: The Artful Mathematics of Wallpaper Patterns
Chapter 3.
https://press.princeton.edu/books/hardcover/9780691161730/creating-symmetry

Grid and Gradient classes inpired by mis.schism

https://twitter.com/skizzm_

https://www.openprocessing.org/user/105743
 
*/

let grid, colors, size, t;

let curvs = [];

let start = false;

function setup() {

  simplex = new SimplexNoise();

  createCanvas(windowHeight - 100, windowHeight - 100);
  background(20);

  cursor('grab');

  const sizeGrid = floor((height * 0.9) / 8);
  grid = new Grid(sizeGrid, sizeGrid, 8, 8);

  colors = new Gradient();

  for (let i = 0; i < grid.cells.length; i++) {
    curvs[i] = new expCurve();
  }

  document.getElementById("saveI").onclick = () => {
    saveImage();
  }

  document.getElementById("rem").onclick = () => {
    remakeAll();
  }

}

function draw() {

  t = millis() / 1000;

  if (start == false && t < 4.5) {
    background(20);
    textAlign(CENTER);
    fill(255);
    textSize(28);
    text("Press button at the top-right corner", width / 2, height / 2 - 80);
    text("to generate a new random table!", width / 2, height / 2 - 40);
    text("Enjoy!", width / 2, height / 2 + 80);
  } else {

    colorMode(RGB, 255);
    fill(35);
    noStroke();
    rect(0, 0, width, height);
    noFill();

    strokeWeight(1);
    colorMode(HSB, 1.0);
    for (let i = 0; i < grid.cells.length; i++) {

      resetMatrix();
      translate(grid.cells[i].mid_x, grid.cells[i].mid_y);

      size = width * 0.9 / 10 * 0.2;
      let a, x, y;
      const cs = 0.001;

      stroke(colors.sample(i / grid.cells.length));
      stroke(colors.sample(map(simplex.noise2D(frameCount * cs, i), -1, 1, 0, 1) % 1));
      curvs[i].show();

    }

    resetMatrix();
    colorMode(RGB, 255);
    blendMode(BLEND);
    noFill();
    stroke(20);
    strokeWeight(40);
    rect(-10, -10, width + 20, height + 20, 80);

    noLoop();
  }

}

//Auxiliary functions

function remakeAll() {
  for (let i = 0; i < grid.cells.length; i++) {
    curvs[i].set();
  }
  colors.settings();
  start = true;
  redraw();
}

function saveImage() {
  save('mystery-curves.jpg');
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* //Some extra functions that used in the first drafts :)

function createCols(_url) {
  let slash_index = _url.lastIndexOf("/");
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split("-");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = "#" + arr[i];
  }
  return arr;
}

function touchEnded() {
  for (let i = 0; i < grid.cells.length; i++) {
    curvs[i].set();
  }
  colors.settings();
  start = true;
  redraw();
}

function keyReleased() {
  if (keyCode === 83) //I key
    save('mystery-curves.jpg');
}
*/