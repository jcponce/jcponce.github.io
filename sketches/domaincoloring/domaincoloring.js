let lim = 2.5;

let realInput;
let imaginaryInput;
let button;

let inpRe;
let inpIm;


function setup() {
    createCanvas(500, 500);
    
    noLoop();
    
    colorMode(HSB, 360, 100, 100);
    
    inpRe = createInput();
    inpIm = createInput();
    inpRe.value('x');
    inpIm.value('y');
    inpRe.style('font-size', '20px');
    inpIm.style('font-size', '20px');
    
    inpRe.position(60, 510);
    inpIm.position(60, 550);
    
    realImput = createElement('h2', 'Re:');
    realImput.position(20, 490);
    
    imaginaryImput = createElement('h2', 'Im:');
    imaginaryImput.position(20, 530);
    
    button = createButton('Submit');
    button.position(inpIm.x + inpIm.width+70, imaginaryImput.y);
    button.style('font-size', '16px');
    button.mousePressed(colorDomain);
    
    
}

function colorDomain() {
    
    loadPixels();
    
    for (let xp = 0; xp < width; xp++) {
        for (let yp = 0; yp < height; yp++) {
            let x, y;
            
            x = map(xp, 0, width, -lim, lim);
            y = map(yp, height, 0, -lim, lim);
            
            let z = new p5.Vector(0,0);
            
            let nextz = new p5.Vector();
            
            nextz.x = eval(inpRe.value());
            nextz.y = eval(inpIm.value());
            
            z = new p5.Vector(z.x + nextz.x, z.y + nextz.y);
            
            let h = map(atan2(-z.y, -z.x), -PI, PI, 0, 360);
            let s = sqrt(abs( 3*sin( 2* PI * (log(sqrt( z.x*z.x + z.y*z.y ))/log(2) - floor( log(sqrt( z.x*z.x + z.y*z.y ))/log(2) )) )));
            let s2 = map(s, 0, 1, 0, 100);
            let b = sqrt(sqrt(abs( sin(2 * PI * z.y) * sin(2 * PI * z.x) )));
            let b2 = 0.5 * ((1 - s) + b + sqrt((1 - s - b) * (1 - s - b) + 0.01));
            let b3 = map(b2, 0, 1, 0, 100);
            
            set(xp, yp, color(h, s2, b3));
            
        }
    }
    
    updatePixels();
    
}
