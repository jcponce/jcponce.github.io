let time = 0;
let wave = [];
let height = 400;
let width = 600;
let background_color = document.getElementById("canvas_background").value;
let line_color = document.getElementById("canvas_lines").value;
let line_color_2 = document.getElementById("canvas_circles").value;
let terms;
let initial_term = 0;
let maximum_terms = 70;
let presets = {
  "square": ["4", "PI * ((2*n) + 1)", "(2*n) + 1", false],
  "sawtooth": ["2", "pow(-1, n) * n * PI", "n", true],
  "triangle": ["8 * pow(-1, (((2*n)+1)-1)/2)", "PI * PI * ((2*n)+1) * ((2*n)+1)", "((2*n)+1)", false],
  "clausen": ["1", "n*n", "n", true]
};
let equation = ["4", "PI * ((2*n) + 1)", "(2*n) + 1"];

function setup(){
  // Creating the canvas
  width = 0.9 * windowWidth;
  let canvas = createCanvas(width, height);
  canvas.parent('sketch-holder')

  //Set width of controls
  document.querySelector('.controls').style.width = width + "px";

  // Color selector listeners
  document.getElementById("canvas_background").addEventListener("change", (event) =>{
    background_color = event.target.value;
  })
  document.getElementById("canvas_lines").addEventListener("change", (event) =>{
    line_color = event.target.value;
  })
  document.getElementById("canvas_circles").addEventListener("change", (event) =>{
    line_color_2 = event.target.value;
  })

  //Slider for Number of Terms
  slider_terms = createSlider(1, maximum_terms, 2)
  slider_terms.parent('slider');
  slider_terms.style(
    'width', '100%',
  )

  //Custom Equation Commands
  document.getElementById("submit").onclick = () => {
    document.getElementById("presets").value = "custom";
    UpdateCanvasEquation();
  }
  document.getElementById("presets").onchange = UpdateDisplayEquation;
  
}

function UpdateDisplayEquation(event){
  for (const key in presets) {
    if (key === event.target.value) {
      document.getElementById("numerator").value = presets[event.target.value][0];
      document.getElementById("denomenator").value = presets[event.target.value][1];
      document.getElementById("coefficient").value = presets[event.target.value][2];
      document.getElementById("series_1").checked = presets[event.target.value][3];
      UpdateCanvasEquation();
    }
  }
}

function UpdateCanvasEquation(){
  equation[0] = document.getElementById("numerator").value;
  equation[1] = document.getElementById("denomenator").value;
  equation[2] = document.getElementById("coefficient").value;
  initial_term = (document.getElementById("series_1").checked) ? 1 : 0;
  wave = []
}

function windowResized() {
  //Canvas width
  width = 0.9 * windowWidth;
  resizeCanvas(width, height);

  //Set width of controls
  document.querySelector('.controls').style.width = width + "px";
}

function draw(){
  background(background_color);
  translate(width/5, height/2);
  
  let x = 0;
  let y = 0;
  let radius = 0;

  document.querySelector(".number_of_terms").innerHTML = "Number of Terms: " + slider_terms.value();
  for(var n = initial_term; n <= slider_terms.value(); n++){
    let numerator = eval(equation[0]);
    let denomenator = eval(equation[1]);
    let coefficient = eval(equation[2]);
    let prev_x = x;
    let prev_y = y;
    radius = numerator/denomenator;
    if(n==initial_term){
      initial_radius = radius
    }
    radius = map(radius, 0, initial_radius, 0, 100)
    x += radius * cos(coefficient * time);
    y += radius * sin(coefficient * time);
    stroke(line_color_2);
    noFill();
    ellipse(prev_x, prev_y, radius*2);
    stroke(line_color);
    line(prev_x, prev_y, x, y);

    // Remove unnecessary points to maintain speed
    if (wave.length > width){
      wave.pop();
    }
  }
  wave.unshift(y);

  distance = width/3;
  line(x, y, distance, wave[0]);
  translate(distance, 0);

  beginShape();
  for(let i = 0; i < wave.length; i++){
    noFill();
    vertex(i, wave[i]);
  }
  endShape();

  time += 0.06;
}