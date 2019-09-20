/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 20-Sep-2019
 * https://jcponce.github.io/
 * A brief explanation can be found here:
 * https://culturacientifica.com/2019/08/21/las-simetrias-ocultas-de-la-tabla-de-multiplicar/
 */

// I just need to add the numbers. I will do it later. :)

let multTable = [];

let w, h, size;

// --Control variables--
let clts = {
    
size: 10,

label: true,
    
othercolor: '#afbadb',
mult1: 2,
color1: '#0099cc',

mult2: 3,
bool2: false,
color2: '#4bb575',
mult3: 5,
bool3: false,
color3: '#cc003d',
mult4: 11,
bool4: false,
color4: '#4d0099',
    
Save: function () {
    save('pattern.jpg');
},
    
canvasSize: 'Small'
    
};

function setup() {
    
    //WIDTH = size * w;
    
    createCanvas(500, 500);
    
    // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 360
                          });
    gui.add(clts, 'size', 4, 100, 1).name("Size Grid");
    gui.add(clts, 'label').name("Show numbers");
    gui.add(clts, 'canvasSize', ['Small', 'Bigger'] ).name("Size window: ").onChange(screenSize);
    gui.addColor(clts, 'othercolor').name("Background");
    
    let gui1 = gui.addFolder('Option');
    gui1.open();
    gui1.add(clts, 'mult1', 2, 50, 1).name("m1 =");
    gui1.addColor(clts, 'color1').name("Color 1");
    
    
    let gui2 = gui.addFolder('Option-2');
    gui2.open();
    gui2.add(clts, 'bool2').name("Activate");
    gui2.add(clts, 'mult2', 2, 50, 1).name("m2 = ");
    gui2.addColor(clts, 'color2').name("Color 2");
    /*
    let gui3 = gui.addFolder('Option-3');
    gui3.add(clts, 'bool3').name("Activate");
    gui3.add(clts, 'mult3', 2, 50, 1).name("m3 = ");
    gui3.addColor(clts, 'color3').name("Color 3");
    
    let gui4 = gui.addFolder('Option-4');
    gui4.add(clts, 'bool4').name("Activate");
    gui4.add(clts, 'mult4', 2, 50, 1).name("m4 = ");
    gui4.addColor(clts, 'color4').name("Color 4");
     */
    
    gui.add(clts, 'Save').name("Save (jpeg)");
    
    gui.close();
    
}

function draw() {
    
    //background('#333333');
    //clear();
    size = clts.size;
    w = width / size;
    h = w;
    
    multTable = make2Darray(size, size);
    
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            multTable[i][j] = i * j;
            
            if(clts.label){
                fill(0);
                textSize(w / 2);
                textAlign(CENTER, CENTER);
                let px = map(i, 0, size, 0, width);
                let py = map(j, 0, size, 0, width);
                text('' + multTable[i][j], px, px);
            }
        }
    }
    
    
    
    
    for (let y = 0; y < height; y += h) {
        for (let x = 0; x < width; x += w) {
            
            
            let tj = round(map(y, 0, height, 0, size));
            let ti = round(map(x, 0, width, 0, size));
            //let val = multTable[ti][tj];
            
            let test = ti * tj;
            
            var remainder = (test % clts.mult1) / 100;
            var remainder2 = (test % clts.mult2) / 100;
            var remainder3 = (test % clts.mult3) / 100;
            var remainder4 = (test % clts.mult4) / 100;
            
            let temp;
            if(clts.bool2 === false){
                temp = clts.mult1;
            } else {
                temp = clts.mult1 * clts.mult2;
            }
            
            var factor1 = (test % (clts.mult1 * clts.mult2)) / 100;
            
            let col;
            
            if (remainder === 0 ) {
                col = clts.color1;
            } else if( clts.bool2 && (remainder2 === 0 || factor1 === 0)){
                col = clts.color2;
            } else  {
                col = clts.othercolor;
            }
            
            fill(col);
            
            rect(x, y, w, h);
            
            //Need to fix this part :(
            /*
            if(clts.label){
              fill(0);
              textSize(w / 2);
              textAlign(CENTER, CENTER);
              text('' + multTable[ti][tj], x + w / 2, y + h / 2);
            }*/
           //console.log();
        }
    }
    
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            let val = multTable[i][j];
            
            if(clts.label){
                fill(0);
                textSize(w / 2);
                textAlign(CENTER, CENTER);
                let px = map(i, 0, size, 0, width);
                let py = map(j, 0, size, 0, height);
                text('' + multTable[i][j], px+ w/2, py+h/2);
            }
        }
    }
    
    //console.log();
    //noLoop();
    

}

function make2Darray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}


function screenSize() {
    if (clts.canvasSize == 'Small') {
        resizeCanvas(500, 500);
    } else if (clts.canvasSize == 'Bigger') {
        resizeCanvas(800, 800);
    }
}
