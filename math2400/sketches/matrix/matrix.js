/*

Based on the video:

Guest Tutorial #4 Matrix Digital Rain in p5.js with Emily Xie
https://youtu.be/S1TQCi9axzg

Author Juan Carlos Ponce Campuzano
https://jcponce.github.io
11/Oct/2021

*/

let symbolSize = 30;
let streams = [];
var fadeInterval = 1.2;

function setup() {
  createCanvas(windowWidth, windowHeight);

  textSize(symbolSize);

  generateSymbls();
}

function draw() {
  background(255, 90);
  streams.forEach(function (stream) {
    stream.render();
  });
}

function generateSymbls() {
  let x = 0;
  for (let i = 0; i <= width / symbolSize; i++) {
    let stream = new Stream();
    stream.generateSymbols(x, random(-1000, 0));
    streams.push(stream);
    x += symbolSize * 2;
  }
}

class mSymbol {
  constructor(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.switchInterval = round(random(10, 20));
    this.first = first;
    this.opacity = opacity;
  }

  setToRandomSymbol() {
    // Info: 
    // https://en.wikipedia.org/wiki/Katakana_(Unicode_block)
    var charType = round(random(0, 5));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        // Set it to Katakana
        this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
      } else {
        // Set it to numeric
        this.value = round(random(0, 9));
      }
    }
  }

  rain() {
    this.y = this.y >= height ? 0 : (this.y += this.speed);
  }
}

class Stream {
  constructor() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 35));
    this.speed = random(1, 2.5);
  }

  generateSymbols(x, y) {
    let opacity = 255;
    
    // Boolean for first element
    let first = round(random(0, 4)) == 1; 
    
    for (let i = 0; i <= this.totalSymbols; i++) {
      let symbol = new mSymbol(x, y, this.speed, first, opacity);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
      opacity -= 255 / this.totalSymbols / fadeInterval;
      first = false;
    }
  }

  render() {
    this.symbols.forEach((symbol) => {
      if (symbol.first) {
        fill(160, 160, 160, symbol.opacity);
      } else {
        fill(165, 165, 165, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
